/** @format */

"use client";
import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { submissionsHodPaper, awaiting_paper } from "@/types";
import { toast } from "react-toastify";
import downloadResearchFiles from "@/app/api/service/downloadFiles";
import DownloadIcon from "@mui/icons-material/Download";
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "20px",
        width: "100%",
      }}
    >
      <Button
        variant="contained"
        component="a"
        sx={{
          fontSize: "14px",
          borderRadius: "20px",
          mr: 2,
          backgroundColor: "#3572EF",
          opacity: isDownloading ? 0.5 : 1,
          transition: "opacity 0.3s ease",
          "&:hover": {
            backgroundColor: "#050C9C",
          },
        }}
        disabled={isDownloading}
        onClick={handleDownload}
      >
        <DownloadIcon sx={{ display: "flex", paddingRight: 1 }} />
        <Typography
          sx={{
            marginLeft: 0.5,
            fontSize: "1.1rem",
          }}
        >
          {isDownloading ? "Downloading..." : "Download"}
        </Typography>
      </Button>
    </Box>
  );
};

export default DownloadButton;
