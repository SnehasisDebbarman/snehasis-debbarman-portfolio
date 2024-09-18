"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface LifeStats {
  heartbeats: number;
  booksCouldRead: number;
  earthRevolutions: number;
  breathsTaken: number;
  wordsSaid: number;
  sleepTime: number;
}

interface BentoGridItemProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

const BentoGridItem: React.FC<BentoGridItemProps> = ({
  title,
  value,
  description,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`rounded-xl overflow-hidden ${className}`}
  >
    <Card className="h-full bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        {description && (
          <div className="text-sm text-gray-400 mt-2">{description}</div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const LifeStatsBentoGrid: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("birthDate") || "";
    }
    return "";
  });

  const [stats, setStats] = useState<LifeStats>({
    heartbeats: 0,
    booksCouldRead: 0,
    earthRevolutions: 0,
    breathsTaken: 0,
    wordsSaid: 0,
    sleepTime: 0,
  });

  useEffect(() => {
    if (birthDate) {
      // Save birthDate to localStorage
      localStorage.setItem("birthDate", birthDate);

      const birth = new Date(birthDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - birth.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffYears = diffDays / 365.25;

      setStats({
        heartbeats: Math.round(diffDays * 24 * 60 * 70),
        booksCouldRead: Math.round(diffYears * 12),
        earthRevolutions: Math.floor(diffYears),
        breathsTaken: Math.round(diffDays * 24 * 60 * 12),
        wordsSaid: Math.round(diffDays * 16 * 60 * 2.5),
        sleepTime: Math.round(diffDays * 8),
      });
    }
  }, [birthDate]);

  const formatNumber = (num: number): string => num.toLocaleString();

  const gradients = [
    "from-red-900 to-red-700",
    "from-blue-900 to-blue-700",
    "from-green-900 to-green-700",
    "from-yellow-900 to-yellow-700",
    "from-purple-900 to-purple-700",
    "from-indigo-900 to-indigo-700",
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Your Life in Numbers
        </h1>

        <div className="mb-12">
          <Label htmlFor="birthdate" className="text-lg mb-2 block">
            Enter your birth date
          </Label>
          <Input
            id="birthdate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full max-w-xs bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          <BentoGridItem
            title="Heartbeats"
            value={formatNumber(stats.heartbeats)}
            description="Your heart has beaten this many times"
            className={`lg:col-span-2 bg-gradient-to-br ${gradients[0]}`}
          />
          <BentoGridItem
            title="Books You Could Have Read"
            value={formatNumber(stats.booksCouldRead)}
            description="Based on 12 books per year"
            className={`bg-gradient-to-br ${gradients[1]}`}
          />
          <BentoGridItem
            title="Earth Revolutions"
            value={formatNumber(stats.earthRevolutions)}
            description="Times Earth circled the Sun in your lifetime"
            className={`bg-gradient-to-br ${gradients[2]}`}
          />
          <BentoGridItem
            title="Breaths Taken"
            value={formatNumber(stats.breathsTaken)}
            description="Estimated breaths since birth"
            className={`bg-gradient-to-br ${gradients[3]}`}
          />
          <BentoGridItem
            title="Words Said"
            value={formatNumber(stats.wordsSaid)}
            description="Estimated words spoken in your lifetime"
            className={`bg-gradient-to-br ${gradients[4]}`}
          />
          <BentoGridItem
            title="Time Spent Sleeping"
            value={`${formatNumber(stats.sleepTime)} hours`}
            description="Assuming 8 hours of sleep per day"
            className={`bg-gradient-to-br ${gradients[5]}`}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LifeStatsBentoGrid;
