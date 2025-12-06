import { useEditorStore } from '../store/editorStore'
import { useTheme } from '../hooks/useTheme'
import { useRef } from 'react'

export default function OutputPanel() {
  const { output, consoleLogs, code, settings } = useEditorStore()
  const { colors } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const formatValue = (value: any): string => {
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'
    if (typeof value === 'string') return `'${value}'`
    if (typeof value === 'function') return value.toString()
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }
    return String(value)
  }

  // Match Monaco editor line height exactly
  // Monaco uses: fontSize * lineHeight multiplier (default 1.5)
  const fontSize = settings.fontSize
  const lineHeight = Math.ceil(settings.fontSize * 1.5)

  // Get total number of lines in code
  const totalLines = code.split('\n').length

  // Create a map of line number to output based on matchLines setting
  const lineOutputMap = new Map<number, any>()
  
  if (settings.matchLines) {
    // Match line numbers - align output with source line
    const lines = code.split('\n')
    let consoleLogIndex = 0
    lines.forEach((line, idx) => {
      if (line.includes('console.log') && consoleLogIndex < consoleLogs.length) {
        lineOutputMap.set(idx + 1, {
          type: 'console',
          data: consoleLogs[consoleLogIndex]
        })
        consoleLogIndex++
      }
    })

    // Add expression results
    output.forEach((result) => {
      lineOutputMap.set(result.line, {
        type: 'result',
        data: result
      })
    })
  } else {
    // Serial output - outputs go line 1, 2, 3... regardless of source line
    let outputLine = 1
    
    // Add console logs serially
    consoleLogs.forEach((log) => {
      lineOutputMap.set(outputLine, {
        type: 'console',
        data: log
      })
      outputLine++
    })
    
    // Add expression results serially
    output.forEach((result) => {
      lineOutputMap.set(outputLine, {
        type: 'result',
        data: result
      })
      outputLine++
    })
  }

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-auto"
      style={{
        backgroundColor: colors['editor.background'],
        color: colors['editor.foreground'],
        fontFamily: settings.fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}px`,
        paddingTop: '4px',
      }}
    >
      {Array.from({ length: totalLines }, (_, idx) => {
        const lineNumber = idx + 1
        const lineOutput = lineOutputMap.get(lineNumber)

        return (
          <div
            key={lineNumber}
            style={{
              height: `${lineHeight}px`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Line number */}
            {settings.showLineNumbers && (
              <div
                style={{
                  width: '36px',
                  textAlign: 'right',
                  paddingRight: '16px',
                  color: colors['editorLineNumber.foreground'] || '#858585',
                  flexShrink: 0,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
              >
                {lineNumber}
              </div>
            )}

            {/* Output content */}
            <div style={{ 
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              paddingRight: '16px',
            }}>
              {lineOutput && (
                <>
                  {lineOutput.type === 'console' && (
                    <span style={{
                      color: lineOutput.data.type === 'error'
                        ? '#d54e53'
                        : lineOutput.data.type === 'warn'
                        ? '#e78c45'
                        : lineOutput.data.type === 'info'
                        ? '#7aa6da'
                        : '#b9ca4a',
                    }}>
                      {lineOutput.data.args.map((arg: any) => formatValue(arg)).join(' ')}
                    </span>
                  )}
                  {lineOutput.type === 'result' && (
                    <span style={{
                      color: lineOutput.data.error ? '#d54e53' : '#7aa6da',
                    }}>
                      {lineOutput.data.error || formatValue(lineOutput.data.value)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

