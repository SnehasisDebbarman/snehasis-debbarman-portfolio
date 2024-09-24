"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { FaReact, FaJs, FaNodeJs, FaGitAlt, FaCode } from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiFirebase,
  SiTailwindcss,
  SiRedux,
  SiJest,
  SiMui,
  SiVisualstudiocode,
  SiWebpack,
  SiExpo,
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { GiMagnifyingGlass } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { FaDownload } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";

// Move the skills array outside of any component
const skills = [
  { name: "React.js", icon: <FaReact /> },
  { name: "JavaScript", icon: <FaJs /> },
  { name: "TypeScript", icon: <SiTypescript /> },
  { name: "Next.js", icon: <SiNextdotjs /> },
  { name: "React Native", icon: <FaReact /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss /> },
  { name: "Firebase", icon: <SiFirebase /> },
  { name: "REST APIs", icon: <TbApi /> },
  { name: "Expo", icon: <SiExpo /> },
  { name: "Redux", icon: <SiRedux /> },
  { name: "Ionic-React", icon: <FaReact /> },
  { name: "Three JS", icon: <FaCode /> },
  { name: "Material UI", icon: <SiMui /> },
  { name: "VS Code", icon: <SiVisualstudiocode /> },
  { name: "Webpack", icon: <SiWebpack /> },
  { name: "Interface Design", icon: <FaCode /> },
  { name: "Troubleshooting", icon: <GiMagnifyingGlass /> },
  { name: "Jest", icon: <SiJest /> },
  { name: "Mocha", icon: <FaCode /> },
  { name: "Git", icon: <FaGitAlt /> },
];

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, {
    once: true,
  });

  return (
    <motion.section
      ref={ref}
      className="mb-16"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      {children}
    </motion.section>
  );
};

const ExperienceCard = ({
  company,
  position,
  duration,
  responsibilities,
}: {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
}) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <h3 className="text-xl font-semibold">{company}</h3>
      <p className="text-sm text-gray-500 mb-2">
        {position} | {duration}
      </p>
      <ul className="list-disc list-inside">
        {responsibilities.map((resp, index) => (
          <li key={index} className="text-sm mb-1">
            {resp}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const CursorFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-20 h-20 rounded-full bg-white mix-blend-difference pointer-events-none z-50"
      animate={{
        x: mousePosition.x - 40,
        y: mousePosition.y - 40,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 200,
      }}
    />
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setIsAnimating(true);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer"
          onClick={toggleTheme}
        >
          <motion.div
            className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
            animate={{
              x: theme === "dark" ? 24 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </motion.div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => setIsAnimating(false)}
            style={{
              backgroundColor: theme === "dark" ? "black" : "white",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const ResumeContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>((props, ref) => {
  return (
    <div ref={ref} className="p-8">
      <h1 className="text-4xl font-bold mb-2">Snehasis Debbarman</h1>
      <p className="text-xl mb-4">Software Developer · Frontend Specialist</p>

      <h2 className="text-2xl font-bold mt-6 mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className="bg-gray-200 rounded-full px-3 py-1 text-sm"
          >
            {skill.name}
          </span>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-6 mb-4">Experience</h2>
      <ExperienceCard
        company="Unovators Tech Private Limited"
        position="Associate Software Developer"
        duration="2023 - current"
        responsibilities={[
          "Implemented real-time customer messaging service with WebSocket in React Native",
          "Co-created Excel to XML converter for Philippines' Central Bank using React and Electron",
        ]}
      />
      <ExperienceCard
        company="Fyllo By Agrihawk Technologies Pvt. Ltd."
        position="Member of Engineering - UI Developer"
        duration="2022 - 2023"
        responsibilities={[
          "Designed interactive data visualization components using React Native and Expo",
          "Developed Fyllo support app and landing page with Next.js and Ionic",
        ]}
      />

      <h2 className="text-2xl font-bold mt-6 mb-4">Projects</h2>
      <ExperienceCard
        company="UNO CRM App"
        position="Personal Project"
        duration="05/2023 - Current"
        responsibilities={[
          "Engineered CRM App using React, Redux, and WebSocket",
          "Implemented card delivery tracking system and real-time customer chat support",
        ]}
      />
      <ExperienceCard
        company="Fyllo App"
        position="Professional Project"
        duration="05/2022 - 04/2023"
        responsibilities={[
          "Built and maintained Fyllo Consumer App using Expo and React Native",
          "Integrated live data from agriculture parameter sensors for real-time insights",
        ]}
      />

      <h2 className="text-2xl font-bold mt-20 mb-4">Education</h2>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold">
            Bengal Institute of Technology
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            B. Tech in Computer Science and Engineering | 07/2016 - 07/2020
          </p>
          <p className="text-sm">CGPA - 8.53</p>
        </CardContent>
      </Card>
    </div>
  );
});

ResumeContent.displayName = "ResumeContent";

const ResumeDownloadButton = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Snehasis_Debbarman_Resume",
    onAfterPrint: () => {
      const pdf = new jsPDF({
        format: "a4",
        unit: "pt",
      });
      if (componentRef.current) {
        pdf.html(componentRef.current, {
          callback: function (pdf) {
            pdf.save("Snehasis_Debbarman_Resume.pdf");
          },
          x: 0,
          y: 0,
          html2canvas: { scale: 0.7 },
        });
      }
    },
  });

  return (
    <>
      <Button
        onClick={handlePrint}
        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <FaDownload /> Download Resume
      </Button>
      <div style={{ display: "none" }}>
        <ResumeContent ref={componentRef} />
      </div>
    </>
  );
};

const AnimatedText = ({ text }: { text: string }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.h1
      className="text-4xl font-bold mb-2"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const Portfolio = () => {
  return (
    <>
      <CursorFollower />
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
        <ResumeDownloadButton />
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <AnimatedText text="Snehasis Debbarman" />
          <p className="text-xl text-gray-600 mb-4">
            Software Developer · Frontend Specialist
          </p>
        </motion.div>

        <Section title="Skills">
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col items-center"
                title={skill.name}
              >
                <div className="text-3xl mb-1">{skill.icon}</div>
                <span className="text-xs">{skill.name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Experience">
          <ExperienceCard
            company="Unovators Tech Private Limited"
            position="Associate Software Developer"
            duration="2023 - current"
            responsibilities={[
              "Implemented real-time customer messaging service with WebSocket in React Native",
              "Co-created Excel to XML converter for Philippines' Central Bank using React and Electron",
            ]}
          />
          <ExperienceCard
            company="Fyllo By Agrihawk Technologies Pvt. Ltd."
            position="Member of Engineering - UI Developer"
            duration="2022 - 2023"
            responsibilities={[
              "Designed interactive data visualization components using React Native and Expo",
              "Developed Fyllo support app and landing page with Next.js and Ionic",
            ]}
          />
          {/* Add more ExperienceCard components for other experiences */}
        </Section>

        <Section title="Projects">
          <ExperienceCard
            company="UNO CRM App"
            position="Personal Project"
            duration="05/2023 - Current"
            responsibilities={[
              "Engineered CRM App using React, Redux, and WebSocket",
              "Implemented card delivery tracking system and real-time customer chat support",
            ]}
          />
          <ExperienceCard
            company="Fyllo App"
            position="Professional Project"
            duration="05/2022 - 04/2023"
            responsibilities={[
              "Built and maintained Fyllo Consumer App using Expo and React Native",
              "Integrated live data from agriculture parameter sensors for real-time insights",
            ]}
          />
          {/* Add more project cards as needed */}
        </Section>

        <Section title="Education">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold">
                Bengal Institute of Technology
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                B. Tech in Computer Science and Engineering | 07/2016 - 07/2020
              </p>
              <p className="text-sm">CGPA - 8.53</p>
            </CardContent>
          </Card>
        </Section>
      </div>
    </>
  );
};

export default Portfolio;
