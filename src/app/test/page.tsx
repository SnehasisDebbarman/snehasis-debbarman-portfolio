"use client";

import React, { useState, useEffect } from "react";

const FallingLetter = ({
  letter,
  delay,
  isStopped,
}: {
  letter: string;
  delay: number;
  isStopped: boolean;
}) => {
  return (
    <span
      style={{
        display: "inline-block",
        animation: `fall 2s ${delay}s forwards`,
        opacity: 0,
        animationPlayState: isStopped ? "paused" : "running",
      }}
    >
      {letter}
    </span>
  );
};

const FallingName = () => {
  const name = "SNEHASIS";
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStopped(true);
    }, 2000); // Stop after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "black",
        color: "white",
        fontSize: "4rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-50vh);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      {name.split("").map((letter, index) => (
        <FallingLetter
          key={`${letter}-${index}`}
          letter={letter}
          delay={index * 0.1}
          isStopped={isStopped}
        />
      ))}
    </div>
  );
};

export default FallingName;
