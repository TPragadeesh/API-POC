import React, { useEffect, useRef} from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";

const CodeMirrorComponent: React.FC<{ onContentChange: (content: string) => void }> = ({ onContentChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    let codeEditor: CodeMirror.Editor | null = null;
    let isFirstRender = true;
    const mode = "application/json";
    const content = `{
    "swagger": "2.0",
    "info": {
        "description": "This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key special-key to test the authorization filters.",
        "version": "1.0.6",
        "title": "Swagger Petstore"
    },
    "paths": {
        "/pet": {
            "post": {
                "summary": "Add a new pet to the store",
                "description": "",
                "operationId": "addPet"
            },
            "put": {
                "summary": "Update an existing pet",
                "description": "",
                "operationId": "updatePet"
            }
        },
        "/pet/findByStatus": {
            "get": {
                "summary": "Finds Pets by status",
                "description": "Multiple status values can be provided with comma separated strings",
                "operationId": "findPetsByStatus"
            }
        }
    }
}`;

    useEffect(() => {
        if (!editorRef.current) return;

        if (!codeEditor) {
            codeEditor = CodeMirror(editorRef.current, {
                value: content,
                mode: mode,
                theme: "material",
                lineNumbers: true,
                lineWrapping: true,
                smartIndent: true,
                autofocus: true,
                extraKeys: { "Ctrl-Space": "autocomplete" }
            });
            codeEditor.on("change", (instance) => {
                const newCode = instance.getValue();
                if (newCode && !isFirstRender) {
                    onContentChange(newCode);
                }
            });
        }
        isFirstRender = false;
    }, []);

    return <div ref={editorRef} style={{ width: "50%", height: "500px", margin: "2rem" }} />;
};

export default CodeMirrorComponent;
