import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ErrorIcon from "@mui/icons-material/Error";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
interface ProgressbarProps {
  value?: number; // Optional external control
  step?: number; // % per second (defaults to 10)
  intervalMs?: number; // Optional interval override in ms
  title?: string; // Optional title for the progress bar
  index?: number; // Optional index for unique keys in lists
}
export default function Progressbar({
  value,
  step = 10,
  intervalMs = 1000,
  title,
  index,
}: ProgressbarProps) {
  const [internalProgress, setInternalProgress] = React.useState(0);

  React.useEffect(() => {
    if (value === undefined) {
      const timer = setInterval(() => {
        setInternalProgress((prev) =>
          prev >= 100 ? 0 : Math.min(prev + step, 100)
        );
      }, intervalMs);
      return () => clearInterval(timer);
    }
  }, [value, step, intervalMs]);

  const progressToShow = value !== undefined ? value : internalProgress;

  return (
    <Box
      key={index}
      sx={{
        backgroundColor: "rgba(0, 102, 204, 0.1)",
        padding: "8px",
        borderRadius: "8px",
        display: "flex",
        gap: "8px",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {" "}
        <ErrorIcon />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
          }}
        >
          File Currently Processing
        </Typography>
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 500,
        }}
      >
        The research paper <strong>"{title}"</strong> is currently under
        processing.
      </Typography>
      <Typography variant="h5">
        Please wait until the current operation is complete before starting a
        new submission. Processing usually takes 10–120 seconds depending on
        file size and content.
      </Typography>
      <LinearProgressWithLabel
        value={progressToShow}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#1976d2",
          },
        }}
      />
    </Box>
  );
}
