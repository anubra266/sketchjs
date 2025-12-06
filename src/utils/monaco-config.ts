import type { editor } from 'monaco-editor'
import { themes } from '../themes'

export function configureMonaco(monaco: typeof import('monaco-editor')) {
  // Register all available themes
  themes.forEach(theme => {
    monaco.editor.defineTheme(theme.id, {
      base: theme.base,
      inherit: theme.inherit,
      rules: theme.rules,
      colors: theme.colors,
    })
  })

  // Configure TypeScript compiler options
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types'],
    strict: false,
    skipLibCheck: true,
    noImplicitAny: false,
    strictNullChecks: false,
    strictFunctionTypes: false,
    strictPropertyInitialization: false,
    noImplicitThis: false,
    alwaysStrict: false,
  })

  // Configure diagnostics options - be more lenient for playground use
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: false,
    diagnosticCodesToIgnore: [
      1108, // 'return' statement can only be used within a function body
      1005, // expected ';'
      2792, // Cannot find module (for imports)
    ],
  })

  // Enable more features
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)

  // Add common type definitions for better autocomplete
  const libSource = `
// Console API
declare const console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  clear(): void;
  dir(obj: any): void;
  table(data: any): void;
};

// Timers
declare function setTimeout(handler: () => void, timeout: number): number;
declare function setInterval(handler: () => void, timeout: number): number;
declare function clearTimeout(id: number): void;
declare function clearInterval(id: number): void;

// Built-in objects
declare const Math: {
  E: number;
  LN10: number;
  LN2: number;
  LOG10E: number;
  LOG2E: number;
  PI: number;
  SQRT1_2: number;
  SQRT2: number;
  abs(x: number): number;
  acos(x: number): number;
  asin(x: number): number;
  atan(x: number): number;
  atan2(y: number, x: number): number;
  ceil(x: number): number;
  cos(x: number): number;
  exp(x: number): number;
  floor(x: number): number;
  log(x: number): number;
  max(...values: number[]): number;
  min(...values: number[]): number;
  pow(x: number, y: number): number;
  random(): number;
  round(x: number): number;
  sin(x: number): number;
  sqrt(x: number): number;
  tan(x: number): number;
};

declare const JSON: {
  parse(text: string): any;
  stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string;
};

// Array methods
interface Array<T> {
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
  filter(callbackfn: (value: T, index: number, array: T[]) => boolean): T[];
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
  forEach(callbackfn: (value: T, index: number, array: T[]) => void): void;
  find(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined;
  some(predicate: (value: T, index: number, array: T[]) => boolean): boolean;
  every(predicate: (value: T, index: number, array: T[]) => boolean): boolean;
}

// String methods
interface String {
  toUpperCase(): string;
  toLowerCase(): string;
  trim(): string;
  split(separator: string | RegExp, limit?: number): string[];
  slice(start?: number, end?: number): string;
  substring(start: number, end?: number): string;
  includes(searchString: string, position?: number): boolean;
  startsWith(searchString: string, position?: number): boolean;
  endsWith(searchString: string, length?: number): boolean;
}

// Object methods
interface ObjectConstructor {
  keys(o: object): string[];
  values(o: object): any[];
  entries(o: object): [string, any][];
  assign<T, U>(target: T, source: U): T & U;
}
declare const Object: ObjectConstructor;

// Promise support
declare class Promise<T> {
  constructor(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void);
  then<U>(onFulfilled?: (value: T) => U | Promise<U>): Promise<U>;
  catch<U>(onRejected?: (reason: any) => U | Promise<U>): Promise<U>;
  finally(onFinally?: () => void): Promise<T>;
  static resolve<T>(value: T): Promise<T>;
  static reject<T>(reason?: any): Promise<T>;
  static all<T>(values: Promise<T>[]): Promise<T[]>;
}
  `

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    libSource,
    'ts:filename/globals.d.ts'
  )
}

export function getEditorOptions(settings: any): editor.IStandaloneEditorConstructionOptions {
  return {
    fontSize: settings.fontSize,
    fontFamily: settings.fontFamily,
    minimap: { enabled: false },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    lineNumbers: settings.showLineNumbers ? 'on' : 'off',
    renderLineHighlight: settings.highlightActiveLine ? 'all' : 'none',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    formatOnPaste: true,
    formatOnType: true,
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    parameterHints: {
      enabled: true,
    },
    suggest: {
      showMethods: true,
      showFunctions: true,
      showConstructors: true,
      showFields: true,
      showVariables: true,
      showClasses: true,
      showModules: true,
      showProperties: true,
      showValues: true,
      showConstants: true,
    },
    hover: {
      enabled: true,
    },
    lightbulb: {
      enabled: true,
    },
  }
}

