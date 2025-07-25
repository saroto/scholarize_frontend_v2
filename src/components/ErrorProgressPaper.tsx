import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ErrorIcon from "@mui/icons-material/Error";
import { useRouter } from "next/navigation";

interface ProgressbarProps {
  id?: string; // Optional ID for unique keys in lists
  title?: string; // Optional title for the progress bar
  index?: number; // Optional index for unique keys in lists
}

export default function ErrorProgressPaper({
  id,
  title,
  index,
}: ProgressbarProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/dashboard/repository/hod-submission-preview/${id}`);
  };
  return (
    <Box
      key={index}
      sx={{
        backgroundColor: "rgba(255, 0, 0, 0.1)", // light red background
        padding: "12px",
        borderRadius: "8px",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        border: "1px solid rgba(255, 0, 0, 0.3)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <ErrorIcon sx={{ color: "red" }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "red",
          }}
        >
          Processing Error
        </Typography>
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 500,
          "&:hover": {
            textDecoration: "underline",
          },
        }}
        onClick={handleClick}
      >
        The research paper <strong>"{title}"</strong> encountered an issue
        during processing.
      </Typography>

      <Typography variant="h5">
        Please re-approve the paper to retry processing. If the issue persists,
        check the file content or contact support. Processing usually takes{" "}
        <strong>10–120 seconds</strong> depending on file size and content.
      </Typography>
    </Box>
  );
}
