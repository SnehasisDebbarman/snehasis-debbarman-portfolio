"use client";
import React, { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>(
    `console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
});

console.log("End");`
  );
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [eventLoop, setEventLoop] = useState<string[]>([]);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  const runCode = () => {
    setError(null);
    setOutput("");
    setEventLoop([]);
    setHighlightedLine(null);

    const capturedOutput: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        const output = args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          )
          .join(" ");
        capturedOutput.push(output);
        setOutput((prev) => prev + output + "\n");
      },
      error: (...args: any[]) => {
        const output = `Error: ${args.join(" ")}`;
        capturedOutput.push(output);
        setOutput((prev) => prev + output + "\n");
      },
      warn: (...args: any[]) => {
        const output = `Warning: ${args.join(" ")}`;
        capturedOutput.push(output);
        setOutput((prev) => prev + output + "\n");
      },
    };

    const customSetTimeout = (callback: Function, delay: number) => {
      setEventLoop((prev) => [...prev, `Timeout (${delay}ms)`]);
      setTimeout(() => {
        setEventLoop((prev) => [...prev, `Executing Timeout (${delay}ms)`]);
        callback();
      }, delay);
    };

    const customPromise = {
      resolve: (value?: any) => {
        setEventLoop((prev) => [...prev, "Promise (resolved)"]);
        return Promise.resolve(value).then((val) => {
          setEventLoop((prev) => [...prev, "Executing Promise (resolved)"]);
          return val;
        });
      },
      reject: (reason?: any) => {
        setEventLoop((prev) => [...prev, "Promise (rejected)"]);
        return Promise.reject(reason).catch((err) => {
          setEventLoop((prev) => [...prev, "Executing Promise (rejected)"]);
          throw err;
        });
      },
    };

    const lines = code.split("\n");
    let currentLine = 0;

    const runWithLineHighlight = async () => {
      for (const line of lines) {
        setHighlightedLine(currentLine);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay for visualization
        try {
          // Use Function constructor instead of eval for better scoping
          new Function("console", "setTimeout", "Promise", line)(
            customConsole,
            customSetTimeout,
            customPromise
          );
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          break;
        }
        currentLine++;
      }
      setHighlightedLine(null);
    };

    runWithLineHighlight();
  };

  useEffect(() => {
    if (codeRef.current && highlightedLine !== null) {
      const lines = codeRef.current.querySelectorAll("div");
      lines[highlightedLine]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedLine]);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        JavaScript Event Loop Visualizer
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow p-2 rounded mb-2 font-mono bg-gray-800 text-white border-gray-700 border resize-none h-64"
            placeholder="Write your JavaScript code here..."
          />
          <button
            onClick={runCode}
            className="px-4 py-2 rounded transition-colors bg-blue-600 text-white hover:bg-blue-700"
          >
            Run Code
          </button>
        </div>
        <div className="grid grid-rows-2 gap-4">
          <div className="bg-gray-800 p-2 rounded overflow-auto h-64">
            <h2 className="text-xl font-semibold mb-2">Output:</h2>
            <pre className="whitespace-pre-wrap">{output}</pre>
            {error && (
              <Alert
                variant="destructive"
                className="mt-2 bg-red-900 border-red-700"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="bg-gray-800 p-2 rounded overflow-auto h-64">
            <h2 className="text-xl font-semibold mb-2">Event Loop:</h2>
            <div className="flex flex-col items-center">
              {eventLoop.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-700 px-2 py-1 rounded mb-1 w-full text-center"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-gray-800 p-2 rounded overflow-auto h-64">
        <h2 className="text-xl font-semibold mb-2">Code Execution:</h2>
        <pre ref={codeRef} className="font-mono text-sm">
          {code.split("\n").map((line, index) => (
            <div
              key={index}
              className={`${
                index === highlightedLine ? "bg-blue-500" : ""
              } px-2 py-1`}
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
