import { useRef, useCallback } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useThemeStore } from "@/store/themeStore";
import { useSessionStore } from "@/store/sessionStore";
import { Loader2 } from "lucide-react";

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  onCursorChange?: (line: number, column: number) => void;
}

export function CodeEditor({ onCodeChange, onCursorChange }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const theme = useThemeStore((state) => state.theme);
  const code = useSessionStore((state) => state.code);
  const language = useSessionStore((state) => state.language);
  const setCode = useSessionStore((state) => state.setCode);

  const handleEditorMount: OnMount = useCallback(
    (editor) => {
      editorRef.current = editor;

      editor.onDidChangeCursorPosition((e) => {
        onCursorChange?.(e.position.lineNumber, e.position.column);
      });

      editor.focus();
    },
    [onCursorChange]
  );

  const handleChange: OnChange = useCallback(
    (value) => {
      const newCode = value ?? "";
      setCode(newCode);
      onCodeChange?.(newCode);
    },
    [setCode, onCodeChange]
  );

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: true },
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
    fontLigatures: true,
    lineNumbers: "on",
    renderLineHighlight: "all",
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",
    padding: { top: 16, bottom: 16 },
    smoothScrolling: true,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true,
    },
    suggest: {
      showKeywords: true,
      showSnippets: true,
    },
  };

  return (
    <div
      className="h-full w-full overflow-hidden"
      data-testid="code-editor-container"
    >
      <Editor
        height="100%"
        language={language}
        value={code}
        theme={theme === "dark" ? "vs-dark" : "light"}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={editorOptions}
        loading={
          <div className="flex h-full w-full items-center justify-center bg-card">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Loading editor...
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
}
