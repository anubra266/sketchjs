import * as Babel from '@babel/standalone'

export function transformCodeForCapture(code: string): string {
    try {
        // First pass: Strip TypeScript types
        const typescriptResult = Babel.transform(code, {
            presets: [
                ['typescript', {
                    isTSX: false,
                    allExtensions: true,
                    allowDeclareFields: true,
                    onlyRemoveTypeImports: true,
                }]
            ],
            filename: 'sketch.ts',
        })

        // Second pass: Add capture logic
        const finalResult = Babel.transform(typescriptResult.code || code, {
            plugins: [capturePlugin],
            filename: 'sketch.js',
        })

        return finalResult.code || code
    } catch (error) {
        console.error('Transform error:', error)
        return code
    }
}

// Babel plugin to inject result capturing
// Only capture "naked" expressions (not variable declarations)
function capturePlugin({ types: t }: any) {
    return {
        visitor: {
            Program(path: any) {
                const captureStatements: any[] = []

                // Traverse to collect what we want to capture
                path.traverse({
                    ExpressionStatement(exprPath: any) {
                        // Skip if it's a call to __RESULTS__.push (our injected code)
                        if (
                            t.isCallExpression(exprPath.node.expression) &&
                            t.isMemberExpression(exprPath.node.expression.callee) &&
                            t.isIdentifier(exprPath.node.expression.callee.object, { name: '__RESULTS__' })
                        ) {
                            return
                        }

                        // Skip console.* calls (they're handled by console capture)
                        if (
                            t.isCallExpression(exprPath.node.expression) &&
                            t.isMemberExpression(exprPath.node.expression.callee) &&
                            t.isIdentifier(exprPath.node.expression.callee.object, { name: 'console' })
                        ) {
                            return
                        }

                        const { line } = exprPath.node.loc?.start || { line: 0 }

                        // Capture ALL expressions: naked vars, operations, calls, etc.
                        // Examples: doubled, 1+1, arr.map(), str.split(), etc.
                        captureStatements.push({
                            line,
                            value: t.cloneNode(exprPath.node.expression),
                        })
                    }
                })

                // Build new program body
                const newBody: any[] = []

                // Add __RESULTS__ array at the beginning
                newBody.push(
                    t.variableDeclaration('const', [
                        t.variableDeclarator(
                            t.identifier('__RESULTS__'),
                            t.arrayExpression([])
                        ),
                    ])
                )

                // Add original code
                newBody.push(...path.node.body)

                // Add capture calls for each naked expression we found
                captureStatements.forEach(({ line, value }) => {
                    newBody.push(
                        t.expressionStatement(
                            t.callExpression(
                                t.memberExpression(
                                    t.identifier('__RESULTS__'),
                                    t.identifier('push')
                                ),
                                [
                                    t.objectExpression([
                                        t.objectProperty(
                                            t.identifier('line'),
                                            t.numericLiteral(line)
                                        ),
                                        t.objectProperty(
                                            t.identifier('value'),
                                            value
                                        ),
                                    ]),
                                ]
                            )
                        )
                    )
                })

                // Add return statement at the end
                newBody.push(
                    t.returnStatement(t.identifier('__RESULTS__'))
                )

                // Replace the program body
                path.node.body = newBody
                path.stop()
            },
        },
    }
}

