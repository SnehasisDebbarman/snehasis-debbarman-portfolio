"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { DM_Sans, Exo, Lato, Orbitron, Work_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import IconCloud from "@/components/ui/icon-globe";
import HyperText from "@/components/ui/hyper-text";
import FlickeringGridRoundedDemo from "@/components/example/flickering-grid-rounded-demo";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import Globe from "@/components/magicui/globe";
import { BorderBeam } from "@/components/magicui/border-beam";
import DelayedText from "@/components/ui/delayed-text";
import { motion } from "framer-motion";
import ThreeScene from "@/components/customUi/ThreeScene";
import ThreeDPin from "@/components/customUi/ThreeDPin";
import SparklesText from "@/components/magicui/sparkles-text";
import CustomDock from "@/components/customUi/CustomDock";

const exo = Exo({
  weight: "300",
  subsets: ["latin"],
  style: "normal",
});

const projects = [
  {
    title: "IP Address Tracker",
    url: "https://snehasisdebbarman.github.io/ip-react/",
    description: "tracking a user location using IP address",
  },
  {
    title: "Twitter Clone",
    url: "https://snehasisdebbarman.github.io/twitter-clone/",
    description:
      "This is a very simple twitter like features posting texts, like , comments using react and firebase",
  },
];

const slugs = [
  "typescript",
  "javascript",
  "react",
  "html5",
  "css3",
  "threedotjs",
  "nodedotjs",
  "nextdotjs",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "git",
  "jira",
  "github",
  "visualstudiocode",
  "sonarqube",
  "figma",
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
      <div className="h-full relative w-full p-2 sm:p-5">
        <div className="p-3 sm:p-5 z-10 min-h-[40rem] w-full relative border border-gray-600 antialiased flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col justify-between w-full lg:w-[70%] mb-8 lg:mb-0">
            <div>
              <HyperText
                duration={500}
                className={cn(
                  "text-2xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-400",
                  exo.className
                )}
                text="Hi, I'm Snehasis Debbarman"
              />

              <HyperText
                duration={1000}
                className={cn(
                  "text-sm sm:text-base text-gray-500 bg-clip-text bg-gradient-to-b from-neutral-400 to-neutral-500",
                  exo.className
                )}
                text="frontend & Mobile Developer"
              />
            </div>

            <motion.div
              className="w-full overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <SparklesText
                className="text-white font-semibold pt-5 text-3xl sm:text-5xl ml-2 sm:ml-5"
                text="Projects"
              />

              <div className="flex  w-full overflow-y-auto py-5 sm:py-10 gap-8 sm:gap-8">
                {projects.map((project, i) => (
                  <ThreeDPin key={`key-project-${i}`} {...project} />
                ))}
              </div>
            </motion.div>
          </div>
          <div className="w-full lg:w-[25%] text-pretty h-full flex flex-col-reverse">
            <motion.div
              className={cn(
                "text-gray-600 text-sm sm:text-lg font-semibold",
                exo.className
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
            >
              Focusing on user centric experiences. Passionate about solving
              complex problems and continuously learning new technologies.
            </motion.div>
          </div>

          <BackgroundBeams />
          <BorderBeam />
        </div>
      </div>
    </main>
  );
}
