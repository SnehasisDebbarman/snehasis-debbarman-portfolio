"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { Highlight, themes } from "prism-react-renderer";
import { Arvo } from "next/font/google";
import { cn } from "@/lib/utils";
import { Send, Info } from "lucide-react";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

const arvo = Arvo({
  weight: "400",
  subsets: ["latin"],
  style: "normal",
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CopyIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const ChatBubble: React.FC<Message> = ({ role, content }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Code copied to clipboard!");
    });
  };

  return (
    <div
      className={cn(
        arvo.className,
        `flex ${role === "user" ? "justify-end" : "justify-start"} mb-4`
      )}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          role === "user"
            ? "bg-gray-800 text-gray-200"
            : "bg-gray-900 text-gray-300"
        }`}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div className="relative mt-2 mb-2">
                  <div className="bg-black rounded-lg p-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">{match[1]}</span>
                      <button
                        onClick={() => copyToClipboard(String(children))}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                        title="Copy code"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                    <Highlight
                      theme={themes.vsDark}
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
                            fontFamily: arvo.style.fontFamily,
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
      <Button variant="ghost" className="absolute top-4 right-4 text-gray-300">
        <Info size={24} />
      </Button>
    </DialogTrigger>
    <DialogContent className="bg-gray-800 text-gray-200">
      <DialogHeader>
        <DialogTitle>How to Run</DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-gray-200">
        <p>To run this chat interface:</p>
        <ol className="list-decimal list-inside mt-2">
          <li>
            Install ollama from below link-
            <Link href={"https://ollama.com/"}> OLLAMA</Link>
          </li>
          <li>
            <span>
              type in your terminal (default is llama3.2:latest)
              <pre>ollama run llama3.2</pre>
            </span>
          </li>
          <li>
            if you want to know your model name - run - `ollama list` in
            terminal- then put it on input
          </li>
          <li>
            set url default is `http://localhost:11434`. if not working then run
            `ollama serve` in terminal you will get your url ant put it in url
            section
          </li>
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
      const response = await fetch(`${apiUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [userMessage],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiMessageContent = "";

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() === "data: [DONE]") {
            break;
          }
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices && data.choices[0].delta.content) {
                aiMessageContent += data.choices[0].delta.content;
                setMessages((prevMessages) => [
                  ...prevMessages.slice(0, -1),
                  { role: "assistant", content: aiMessageContent },
                ]);
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
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

  return (
    <div className="flex flex-col h-screen bg-black text-gray-300">
      <InfoModal />
      <div className="p-4 bg-gray-900">
        <div className="max-w-3xl mx-auto flex space-x-4">
          <Input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Model name"
            className="flex-grow bg-gray-800 text-gray-200 border-0 outline-none px-4 py-2 rounded-md border-transparent focus:border-0 focus:outline-none focus:ring-2 focus:ring-transparent"
          />
          <Input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="API URL"
            className="flex-grow bg-gray-800 text-gray-200 border-0 outline-none px-4 py-2 rounded-md border-transparent focus:border-0 focus:outline-none focus:ring-2 focus:ring-transparent"
          />
        </div>
      </div>
      <div className="flex-grow overflow-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatBubble key={index} {...message} />
          ))}
          {isLoading && (
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-gray-100 hover:duration-300 ">
              <span>✨ Generating...</span>
            </AnimatedShinyText>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-gray-900">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow bg-gray-800 text-gray-200 border-0 outline-none px-4 py-2 rounded-l-md border-transparent focus:border-0 focus:outline-none focus:ring-2 focus:ring-transparent"
          />
          <Button variant="ghost" type="submit">
            <Send />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
