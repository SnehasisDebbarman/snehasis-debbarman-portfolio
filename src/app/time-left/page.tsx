"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    // Retrieve birth date from local storage on component mount
    const storedBirthDate = localStorage.getItem("birthDate");
    if (storedBirthDate) {
      setBirthDate(storedBirthDate);
      console.log(storedBirthDate);
    }
  }, []);

  useEffect(() => {
    const calculateTime = () => {
      if (birthDate) {
        const birth = new Date(birthDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - birth.getTime());

        const months = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
        );
        const hours = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        setTime({ months, days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000); // Update every second
    handleSetBirthDate();

    return () => clearInterval(timer);
  }, [birthDate]);

  const formatNumber = (num: number, padding: number): string => {
    return num.toString().padStart(padding, "0");
  };

  const TimeUnit: React.FC<{
    value: number;
    unit: string;
    padding: number;
  }> = ({ value, unit, padding }) => (
    <div className="text-center p-2">
      <div className="font-mono text-3xl font-bold mb-1 h-10 flex items-center justify-center">
        {formatNumber(value, padding)}
      </div>
      <div className="text-xs text-gray-400 uppercase">{unit}</div>
    </div>
  );

  const handleSetBirthDate = () => {
    // Save birth date to local storage
    localStorage.setItem("birthDate", birthDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Life Countdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-5 gap-2">
            <TimeUnit value={time.months} unit="Months" padding={3} />
            <TimeUnit value={time.days} unit="Days" padding={2} />
            <TimeUnit value={time.hours} unit="Hours" padding={2} />
            <TimeUnit value={time.minutes} unit="Minutes" padding={2} />
            <TimeUnit value={time.seconds} unit="Seconds" padding={2} />
          </div>
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
          {/* <Button className="w-full" onClick={handleSetBirthDate}>
            Set Birth Date
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LifeCountdown;
