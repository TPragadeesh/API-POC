import React, { useEffect, useRef } from "react";
import ace from "ace-builds";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-json";

const AceEditorComponent: React.FC<{ onContentChange: (content: string) => void }> = ({ onContentChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    let codeEditor: ace.Ace.Editor | null = null;
    let isFirstRender = true;
    const mode = "json";
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
            codeEditor = ace.edit(editorRef.current);
            codeEditor.setTheme("ace/theme/monokai");
            codeEditor.getSession().setMode(`ace/mode/${mode}`);
            codeEditor.setValue(content, -1); // -1 moves the cursor to the end
            codeEditor.setOptions({
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                enableCodeFold: true,
            });
            codeEditor.getSession().setFoldStyle("markbeginend");
            codeEditor.on("change", () => {
                const newCode = codeEditor?.getValue();
                if (newCode && !isFirstRender) {
                    onContentChange(newCode);
                }
            });
        }
        isFirstRender = false;
    }, []);

    return <div ref={editorRef} style={{ width: "50%", height: "500px", margin: "2rem" }} />;
};

export default AceEditorComponent;
