"use client";
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";

interface CompilerOutput {
  result: string;
  error: string | null;
}

const CodeEditorCompiler: React.FC = () => {
  const [code, setCode] = useState<string>(
    '// Write your TypeScript code here\nconsole.log("Hello, World!");'
  );
  const [output, setOutput] = useState<CompilerOutput>({
    result: "",
    error: null,
  });

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const runCode = () => {
    try {
      // Clear previous output
      setOutput({ result: "", error: null });

      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(args.join(" "));
      };

      // Run the code
      // Note: eval is used for demonstration. In a real-world scenario,
      // you'd want to use a more secure method of execution.
      eval(code);

      // Restore original console.log
      console.log = originalLog;

      setOutput({ result: logs.join("\n"), error: null });
    } catch (error) {
      setOutput({ result: "", error: (error as Error).message });
    }
  };

  const resetCode = () => {
    setCode(
      '// Write your TypeScript code here\nconsole.log("Hello, World!");'
    );
    setOutput({ result: "", error: null });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
        Javascript Playground
      </h1>
      <div className="flex flex-1 space-x-6">
        <Card className="flex-1 overflow-hidden border-2 border-gray-700">
          <div className="h-full">
            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
              }}
            />
          </div>
        </Card>
        <Card className="flex-1 overflow-hidden border-2 border-gray-700 bg-gray-800">
          <div className="h-full p-4 font-mono text-sm overflow-auto">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              Output:
            </h2>
            <pre className="whitespace-pre-wrap break-all">
              {output.error ? (
                <span className="text-red-400">{output.error}</span>
              ) : (
                <span className="text-green-300">{output.result}</span>
              )}
            </pre>
          </div>
        </Card>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          onClick={resetCode}
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Button
          onClick={runCode}
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Play className="mr-2 h-4 w-4" /> Run Code
        </Button>
      </div>
    </div>
  );
};

export default CodeEditorCompiler;
