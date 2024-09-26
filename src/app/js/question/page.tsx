// pages/index.tsx
'use client'
import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface BlogPost {
  title: string;
  date: string;
  content: string;
}

const CodeBlock: React.FC<{ language: string | null; value: string }> = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language || 'javascript'} style={atomDark}>
      {value}
    </SyntaxHighlighter>
  );
};

const BlogPost: React.FC<BlogPost> = ({ title, date, content }) => (
  <motion.article 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-12 p-6 bg-white rounded-lg shadow-lg"
  >
    <h2 className="text-3xl font-bold mb-2 text-indigo-600">{title}</h2>
    <p className="text-gray-500 mb-4">{date}</p>
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
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
  </motion.article>
);

const Home: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      title: "Advanced JavaScript: Currying and Function Composition",
      date: "2024-09-26",
      content: `
# Currying in JavaScript

Currying is an advanced technique in functional programming where a function with multiple arguments is transformed into a sequence of functions, each taking a single argument. Let's look at an implementation of a curry function:

\`\`\`javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      }
    }
  };
}

// Example usage:
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6
console.log(curriedSum(1, 2, 3)); // 6
\`\`\`

This curry function allows us to call a function with any number of arguments, creating partial applications as we go.
      `
    },
    {
      title: "Debounce: Controlling Function Execution Rate",
      date: "2024-09-25",
      content: `
# Implementing Debounce in JavaScript

Debounce is a technique used to limit the rate at which a function gets called. It's particularly useful for performance optimization in scenarios like handling user input or API calls.

Here's an implementation of a debounce function:

\`\`\`javascript
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Example usage:
const handleInput = debounce((e) => {
  console.log('Input value:', e.target.value);
}, 300);

// In a React component:
<input onChange={handleInput} />
\`\`\`

This debounce function ensures that the wrapped function is only called after the specified delay has passed since the last invocation.
      `
    },
    {
      title: "Understanding the Event Loop and Call Stack in JavaScript",
      date: "2024-09-24",
      content: `
# The Event Loop and Call Stack

JavaScript's event loop and call stack are fundamental to understanding how the language handles asynchronous operations.

## The Call Stack

The call stack is a data structure that records where in the program we are. When we call a function, it's added to the stack. When we return from a function, it's removed from the stack.

\`\`\`javascript
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  var squared = square(n);
  console.log(squared);
}

printSquare(4);
\`\`\`

In this example, the call stack would look like:

1. Push printSquare(4)
2. Push square(4)
3. Push multiply(4, 4)
4. Pop multiply(4, 4)
5. Pop square(4)
6. Push console.log(16)
7. Pop console.log(16)
8. Pop printSquare(4)

## The Event Loop

The event loop continuously checks if the call stack is empty and if there are any tasks in the task queue. If the call stack is empty, it takes the first task from the queue and pushes it onto the call stack, which effectively runs it.

This is how JavaScript handles asynchronous operations:

1. Async operations (like setTimeout, fetch, etc.) are sent to the Web APIs
2. When they complete, they're pushed to the task queue
3. The event loop checks if the call stack is empty
4. If it is, the first task in the queue is pushed to the call stack and executed

This mechanism allows JavaScript to be non-blocking despite being single-threaded.
      `
    },
    {
      title: "React Hooks: Types and Usage",
      date: "2024-09-23",
      content: `
# React Hooks: An Overview

React Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here are some of the most commonly used hooks:

1. **useState**: For adding state to functional components
2. **useEffect**: For side effects in components
3. **useContext**: For consuming context
4. **useReducer**: An alternative to useState for complex state logic
5. **useCallback**: For memoizing functions
6. **useMemo**: For memoizing values
7. **useRef**: For creating mutable references
8. **useLayoutEffect**: Similar to useEffect, but fires synchronously after all DOM mutations
9. **useImperativeHandle**: For customizing the instance value exposed to parent components when using ref
10. **useDebugValue**: For displaying a label for custom hooks in React DevTools

Let's look at a couple of these in more detail:

## Cleaning Up with useEffect

The useEffect hook can return a cleanup function, which is particularly useful when your component is unmounting:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // This function will be called when the component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return <h1>I've rendered {count} times!</h1>;
}
\`\`\`

## useMemo for Performance Optimization

The useMemo hook is used to memoize expensive computations:

\`\`\`javascript
import React, { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const expensiveResult = useMemo(() => {
    // Some expensive computation here
    return data.reduce((total, item) => total + item.value, 0);
  }, [data]); // Only re-compute if data changes

  return <div>{expensiveResult}</div>;
}
\`\`\`

Use useMemo when:
1. You have computationally expensive operations
2. You want to ensure referential equality between renders for optimization
3. You want to avoid unnecessary re-renders of child components that depend on object props

Remember, premature optimization can lead to more complex code. Use useMemo judiciously!
      `
    },
    {
      title: "Machine Coding: Flippable Card Component",
      date: "2024-09-22",
      content: `
# Creating a Flippable Card Component in React

Here's an implementation of a flippable card component using React and CSS transitions:

\`\`\`jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const FlippableCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      className="perspective-1000 w-64 h-64 mx-auto cursor-pointer"
      onClick={handleFlip}
      initial={false}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-4 bg-blue-500 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Reveal</h2>
      </div>
      <div
        className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-4 bg-green-500 text-white rounded-lg shadow-lg"
        style={{ transform: "rotateY(180deg)" }}
      >
        <h2 className="text-2xl font-bold mb-4">Personal Data</h2>
        <ul className="list-disc pl-4">
          <li>Aadhar ID: XXXX-XXXX-XXXX</li>
          <li>Date of Birth: DD/MM/YYYY</li>
          <li>Address: 123 Main St, City</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default FlippableCard;
\`\`\`

This component uses:
- React's useState for managing the flip state
- Framer Motion for smooth animations
- Tailwind CSS for styling (make sure to configure Tailwind in your project)

To use this component, simply import and render it in your React application:

\`\`\`jsx
import FlippableCard from './FlippableCard';

function App() {
  return (
    <div className="App">
      <h1>Flippable Card Example</h1>
      <FlippableCard />
    </div>
  );
}
\`\`\`

This creates an interactive card that flips to reveal personal information when clicked. Remember to handle sensitive information securely in a real application!
      `
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Advanced JavaScript and React Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-12 text-center text-indigo-800"
        >
          Advanced JavaScript and React Blog
        </motion.h1>
        {blogPosts.map((post, index) => (
          <BlogPost key={index} {...post} />
        ))}
      </main>

      <footer className="py-4 text-center text-gray-500">
        © 2024 Advanced JavaScript and React Blog
      </footer>
    </div>
  );
};

export default Home;