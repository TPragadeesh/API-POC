import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { RuleSetResponse } from "../hooks/useGovernance";
import axios from "axios";
import { serviceBaseURL } from "../helpers/Constants";
import useFileStore from "../store/useFileStore";
import useDarkThemeStore from "../store/useDarkThemeStore";
import IndexedDBService from "../services/IndexedDBService";
import useRepoStore from "../store/useRepoStore";
import _debounce from "lodash/debounce";

let codeEditorRef: any;

const MonacoEditor = () => {
  const editorRef = useRef(null);
  let codeEditorContent: string;
  const mode = "json";

  const { fileContent, name, path, url, setUpdatedContent } = useFileStore();
  const { currentRepo } = useRepoStore();
  const { theme } = useDarkThemeStore();

  let indexedDBService = new IndexedDBService();

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    if (!codeEditorRef) {
      codeEditorRef = monaco.editor.create(editorRef.current, {
        value: fileContent,
        language: mode,
        wordWrap: "on",
        theme: theme ? "vs-dark" : "",
        automaticLayout: true,
        minimap: {
          enabled: true,
        },
      });
    } else {
      codeEditorRef.setValue(fileContent);
    }
  }, [fileContent]);

  useEffect(() => {
    if (codeEditorRef) {
      codeEditorRef.updateOptions({
        theme: theme ? "vs-dark" : "",
      });
    }
  }, [theme]);

  useEffect(() => {
    codeEditorRef?.onDidChangeModelContent(() => {
      codeEditorContent = codeEditorRef.getValue();
      setUpdatedContent(codeEditorContent);
      handleDebouncedInputChange(codeEditorContent);
    });
  }, []);

  const handleDebouncedInputChange = _debounce((value) => {
    if (fileContent == value) {
      indexedDBService.deleteFile(currentRepo, path);
    } else {
      indexedDBService.updateFileContent(value, currentRepo, name, path, url);
    }
    evaluateAPIDesc(value);
  }, 300);

  const evaluateAPIDesc = (apiDesc: string) => {
    if (apiDesc) {
      axios
        .post<RuleSetResponse[]>(
          serviceBaseURL + "/evaluateRule",
          JSON.parse(apiDesc)
        )
        .then((res) => {
          const violationResponse = [];
          for (const data of res.data) {
            const violation = {
              startLineNumber: data.startLine,
              endLineNumber: data.endLine,
              startColumn: data.startColumn,
              endColumn: data.endColumn,
              message: data.message,
              severity: monaco.MarkerSeverity.Error,
            };
            violationResponse.push(violation);
          }

          monaco.editor.setModelMarkers(
            codeEditorRef.getModel(),
            "error",
            violationResponse
          );
        });
    }
  };

  return (
    <>
      <div ref={editorRef} className="editor"></div>
    </>
  );
};

export default MonacoEditor;
