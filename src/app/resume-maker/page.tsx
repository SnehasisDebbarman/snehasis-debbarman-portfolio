"use client";
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

const ResumeMaker = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
  });

  const { theme, setTheme } = useTheme();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const generateResume = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Set font
    doc.setFont("helvetica");

    // Header
    doc.setFillColor(52, 152, 219); // Blue color
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(24);
    doc.text(formData.name, 10, 25);

    // Contact info
    doc.setFontSize(10);
    doc.text(formData.email, 10, 35);
    doc.text(formData.phone, pageWidth - 10, 35, { align: "right" });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Sections
    const addSection = (title: string, content: string, y: number) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, 10, y);
      doc.setLineWidth(0.5);
      doc.line(10, y + 1, pageWidth - 10, y + 1);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const splitContent = doc.splitTextToSize(content, pageWidth - 20);
      doc.text(splitContent, 10, y + 10);
      return y + 15 + splitContent.length * 5;
    };

    let yPos = 50;
    yPos = addSection("Education", formData.education, yPos);
    yPos = addSection("Experience", formData.experience, yPos);
    yPos = addSection("Skills", formData.skills, yPos);

    return doc;
  };

  const handlePreview = () => {
    const doc = generateResume();
    window.open(doc.output("bloburl"), "_blank");
  };

  const handleDownload = () => {
    const doc = generateResume();
    doc.save("resume.pdf");
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Resume Maker</CardTitle>
            <CardDescription>
              Fill in your details to create a professional resume.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                name="education"
                placeholder="Your educational background"
                value={formData.education}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                placeholder="Your work experience"
                value={formData.experience}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                name="skills"
                placeholder="Your key skills"
                value={formData.skills}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <div className="mt-6 flex space-x-4">
            <Button onClick={handlePreview} variant="outline">
              Preview Resume
            </Button>
            <Button onClick={handleDownload}>Download Resume</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeMaker;
