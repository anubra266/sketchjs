import { ConsoleLog, LineResult } from '../store/editorStore'
import { transformCodeForCapture } from './transform'

let consoleLogCallback: ((log: ConsoleLog) => void) | null = null

// Mock console for capturing logs
const createMockConsole = () => {
    const createLogFunction = (type: ConsoleLog['type']) => {
        return (...args: any[]) => {
            if (consoleLogCallback) {
                consoleLogCallback({
                    id: `${Date.now()}-${Math.random()}`,
                    type,
                    args,
                    timestamp: Date.now(),
                })
            }
        }
    }

    return {
        log: createLogFunction('log'),
        error: createLogFunction('error'),
        warn: createLogFunction('warn'),
        info: createLogFunction('info'),
    }
}

export async function executeCode(
    code: string,
    onConsoleLog: (log: ConsoleLog) => void
): Promise<LineResult[]> {
    consoleLogCallback = onConsoleLog
    const results: LineResult[] = []

    try {
        const mockConsole = createMockConsole()

        // Transform code to capture line results
        let transformedCode: string
        try {
            transformedCode = transformCodeForCapture(code)
        } catch (transformError: any) {
            // Babel transform failed - throw as SyntaxError for proper handling
            throw new SyntaxError(transformError.message)
        }

        // Create a sandboxed context
        const sandbox = {
            console: mockConsole,
            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval,
            Promise,
            Array,
            Object,
            String,
            Number,
            Boolean,
            Math,
            Date,
            RegExp,
            JSON,
            Map,
            Set,
            WeakMap,
            WeakSet,
            Symbol,
            Error,
            TypeError,
            RangeError,
            parseInt,
            parseFloat,
            isNaN,
            isFinite,
            encodeURI,
            decodeURI,
            encodeURIComponent,
            decodeURIComponent,
        }

        // Execute in sandbox context
        const fn = new Function(...Object.keys(sandbox), `
      "use strict";
      ${transformedCode}
    `)

        const capturedResults = fn(...Object.values(sandbox))

        // Process captured results
        if (Array.isArray(capturedResults)) {
            capturedResults.forEach((result: any) => {
                if (result && typeof result === 'object' && 'line' in result && 'value' in result) {
                    results.push({
                        line: result.line,
                        value: result.value,
                    })
                }
            })
        }
    } catch (error: any) {
        // Show ALL errors in output panel (syntax, runtime, etc.)
        if (consoleLogCallback) {
            // Format error with type prefix (like RunJS)
            const errorType = error.constructor?.name || 'Error'
            const errorMessage = `${errorType}: ${error.message || 'Unknown error'}`

            consoleLogCallback({
                id: `${Date.now()}-${Math.random()}`,
                type: 'error',
                args: [errorMessage],
                timestamp: Date.now(),
            })
        }
    }

    consoleLogCallback = null
    return results
}
