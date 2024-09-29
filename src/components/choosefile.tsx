/** @format */

"use client";
import React, { useState, ChangeEvent } from "react";
import { Button, Box } from "@mui/material";
import Link from "next/link";
type ChooseFileProps = {
  onFileChange: (file: File | null) => void;
  pdf_path?: string;
  showPdfPath?: boolean;
  hidden?: boolean | undefined;
};

export const ChooseFile: React.FC<ChooseFileProps> = ({
  onFileChange,
  pdf_path,
  showPdfPath = false,
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
        borderRadius: "20px",
        paddingTop: 1,
        width: "100%",
      }}
    >
      <Button
        variant="contained"
        component="label"
        sx={{
          borderRadius: "20px",
          mr: 2,
          backgroundColor: "gray",
        }}
      >
        Choose file
        <input
          type="file"
          onChange={handleFileChange}
          hidden={hidden}
          accept=".pdf"
        />
      </Button>
      <Box component="span" sx={{ fontSize: "0.875rem" }}>
        {fileName}
      </Box>
      {showPdfPath && (
        <Box component="span" sx={{ fontSize: "0.875rem" }}>
          {pdf_path}
        </Box>
      )}
    </Box>
  );
};
