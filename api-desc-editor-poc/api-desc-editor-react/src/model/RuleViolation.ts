import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export interface RuleViolation {
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
    message: string;
    severity: monaco.MarkerSeverity;
  };