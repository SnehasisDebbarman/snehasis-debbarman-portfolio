"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { Highlight, themes } from "prism-react-renderer";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Send, Trash2, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatBubble: React.FC<Message> = ({ role, content }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Code copied to clipboard!");
    });
  };

  return (
    <div
      className={cn(
        inter.className,
        `grid w-full mb-4 ${
          role === "assistant" ? "" : "justify-end items-end"
        }`
      )}
    >
      <div className="w-12 flex-shrink-0 flex justify-center pt-4 text-left mb-4">
        {role === "assistant" ? "AI" : "You"}
      </div>
      <div
        className={`flex-grow p-4 bg-gray-100 rounded-md ${
          role === "user" ? "text-gray-700" : "text-gray-800"
        }`}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div className="relative mt-2 mb-2">
                  <div className="bg-gray-200 rounded-lg p-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">{match[1]}</span>
                      <button
                        onClick={() => copyToClipboard(String(children))}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Copy code"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                    <div className="max-w-[calc(100vw-4rem)] md:max-w-[calc(100vw-20rem)] overflow-x-auto">
                      <Highlight
                        theme={themes.github}
                        code={String(children).replace(/\n$/, "")}
                        language={match[1] as any}
                      >
                        {({
                          className,
                          style,
                          tokens,
                          getLineProps,
                          getTokenProps,
                        }) => (
                          <pre
                            className={className}
                            style={{
                              ...style,
                              background: "transparent",
                              padding: "0.5em",
                            }}
                          >
                            {tokens.map((line, i) => (
                              <div key={i} {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                  <span
                                    key={key}
                                    {...getTokenProps({ token, key })}
                                  />
                                ))}
                              </div>
                            ))}
                          </pre>
                        )}
                      </Highlight>
                    </div>
                  </div>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const InfoModal: React.FC = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" className="text-gray-500">
        help
      </Button>
    </DialogTrigger>
    <DialogContent className="bg-white text-gray-800">
      <DialogHeader>
        <DialogTitle>About this Chat Interface</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <p>This chat interface uses Ollama to run language models locally:</p>
        <ol className="list-decimal list-inside mt-2">
          <li>
            Install Ollama from{" "}
            <Link
              href="https://ollama.com/"
              className="text-blue-500 hover:underline"
            >
              ollama.com
            </Link>
          </li>
          <li>
            Run a model (e.g., <code>ollama run llama3.2</code>)
          </li>
          <li>Set the model name and API URL in the chat interface</li>
        </ol>
        <p className="mt-2">
          The chat will use the specified model and API URL to generate
          responses.
        </p>
      </DialogDescription>
    </DialogContent>
  </Dialog>
);

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [modelName, setModelName] = useState<string>("llama3.2:latest");
  const [apiUrl, setApiUrl] = useState<string>("http://localhost:11434");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          prompt: input,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: Message = { role: "assistant", content: "" };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() === "") continue;

          try {
            const data = JSON.parse(line);
            if (data.response) {
              assistantMessage.content += data.response;
              setMessages((prevMessages) => [
                ...prevMessages.slice(0, -1),
                { ...assistantMessage },
              ]);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div
      className={cn(inter.className, "flex h-screen bg-white text-gray-800")}
    >
      <div className="w-64 bg-gray-100 p-4 hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <Input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model local URL
            </label>
            <Input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="mt-1"
            />
          </div>
          <InfoModal />
        </div>
      </div>
      <div className="flex-grow flex flex-col">
        <div className="flex-grow overflow-auto p-4">
          {messages.map((message, index) => (
            <ChatBubble key={index} {...message} />
          ))}
          {isLoading && <div className="flex p-4">LLM is thinking ...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              <Send size={20} />
            </Button>
            <Button type="button" variant="outline" onClick={clearChat}>
              <Trash2 size={20} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
