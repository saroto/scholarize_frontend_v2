/** @format */

"use client";
import React, { useState, ChangeEvent } from "react";
import { Button, Box } from "@mui/material";
type UploadResearchFileProp = {
  onFileChange: (file: File | null) => void;
  pdf_path?: string;
  hidden?: boolean | undefined;
};

export const UploadResearchFile: React.FC<UploadResearchFileProp> = ({
  onFileChange,
  pdf_path,
  hidden,
}) => {
  const [fileName, setFileName] = useState(pdf_path);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && file.size > 100 * 1024 * 1024) {
      // 100 MB limit
      alert("File size exceeds the limit of 100MB");
    } else {
      onFileChange(file);
      setFileName(file ? file.name : "No file chosen");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "1.2rem",
        width: "100%",
      }}
    >
      <input
        type="file"
        onChange={handleFileChange}
        required
        accept=".pdf"
        className="text-lg text-[#000]
        file:mr-2 file:px-3
        file:capitalize file:font-sans
        file:border-none
        file:rounded-xl file:bg-[#777] file:text-[#fff]
        hover:file:cursor-pointer hover:file:bg-[#000]
        "
      />
    </Box>
  );
};
