/** @format */

"use client";
import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { submissionsHodPaper, awaiting_paper } from "@/types";
import { toast } from "react-toastify";
import downloadResearchFiles from "@/app/api/service/downloadFiles";
import DownloadIcon from "@mui/icons-material/Download";
import CustomButton from "./customButton";
interface DownloadButtonProps {
  submission?: submissionsHodPaper | awaiting_paper;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ submission }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!submission || isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await downloadResearchFiles(
        submission.paper.pdf_path,
        submission.paper.research_title
      );
      if (!response.success) {
        toast.error("Failed to download file");
        return;
      }

      const downloadUrl = response.url;

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsDownloading(false);
  };

  return (
    <CustomButton
      variant="contained"
      size="small"
      color="primary"
      component="a"
      sx={{
        px: "1rem",
        borderRadius: "1rem",
        textTransform: "none",
        boxShadow: "none",
        opacity: isDownloading ? 0.5 : 1,
      }}
      disabled={isDownloading}
      onClick={handleDownload}
    >
      <DownloadIcon fontSize="small" />
      <Typography
        variant="h5"
        sx={{
          fontSize: "10px",
          whiteSpace: "nowrap",
        }}
      >
        {isDownloading ? "Downloading..." : "Download"}
      </Typography>
    </CustomButton>
  );
};

export default DownloadButton;
