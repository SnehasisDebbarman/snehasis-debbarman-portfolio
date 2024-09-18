"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LifeCountdown = () => {
  const [birthDate, setBirthDate] = useState("");
  const [time, setTime] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Load saved birth date from localStorage
    const savedBirthDate = localStorage.getItem("birthDate");
    if (savedBirthDate) {
      setBirthDate(savedBirthDate);
    }

    const calculateTime = () => {
      if (birthDate) {
        const birth = new Date(birthDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - birth.getTime());

        const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diffTime / (1000 * 60 * 60));
        const minutes = Math.floor(diffTime / (1000 * 60));
        const seconds = Math.floor(diffTime / 1000);

        setTime({ months, days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000); // Update every second

    return () => clearInterval(timer);
  }, [birthDate]);

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const TimeDisplay: React.FC<{ value: number; unit: string }> = ({
    value,
    unit,
  }) => (
    <div className="text-center p-4">
      <div className="font-mono text-5xl font-bold mb-2">
        {formatNumber(value)}
      </div>
      <div className="text-xl text-gray-400">{unit}</div>
    </div>
  );

  const handleSetBirthDate = () => {
    setBirthDate(birthDate);
    localStorage.setItem("birthDate", birthDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Life Countdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="months" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="months">Months</TabsTrigger>
              <TabsTrigger value="days">Days</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="minutes">Minutes</TabsTrigger>
              <TabsTrigger value="seconds">Seconds</TabsTrigger>
            </TabsList>
            <TabsContent value="months">
              <TimeDisplay value={time.months} unit="Months" />
            </TabsContent>
            <TabsContent value="days">
              <TimeDisplay value={time.days} unit="Days" />
            </TabsContent>
            <TabsContent value="hours">
              <TimeDisplay value={time.hours} unit="Hours" />
            </TabsContent>
            <TabsContent value="minutes">
              <TimeDisplay value={time.minutes} unit="Minutes" />
            </TabsContent>
            <TabsContent value="seconds">
              <TimeDisplay value={time.seconds} unit="Seconds" />
            </TabsContent>
          </Tabs>
          <div className="space-y-2">
            <Label htmlFor="birthdate">Enter your birth date</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSetBirthDate}>
            Set Birth Date
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LifeCountdown;
