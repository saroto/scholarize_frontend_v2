"use client";
import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { submissionsHodPaper, awaiting_paper } from "@/types";
import { useSession } from "next-auth/react";

interface DownloadButtonProps {
  submission?: submissionsHodPaper | awaiting_paper;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ submission }) => {
  const { data: session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!submission || isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/downloadpaper?path=${encodeURIComponent(submission.paper.pdf_path)}`, {
        cache: 'no-cache',
        method: 'GET',
      });

      if (!response.ok) {
        console.error(`Failed to download the paper: Status ${response.status}`);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', submission.paper.pdf_path.split('/').pop() || 'paper.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the paper:", error);
    } finally {
      setIsDownloading(false);
    }
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
          borderRadius: "20px",
          mr: 2,
          backgroundColor: "gray",
          opacity: isDownloading ? 0.5 : 1,
          transition: "opacity 0.3s ease",
        }}
        onClick={handleDownload}
      >
        {isDownloading ? "Downloading..." : "Download"}
      </Button>
    </Box>
  );
};

export default DownloadButton;
