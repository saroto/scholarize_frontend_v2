import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";

const colors = [
  "#e0f7fa",
  "#e8f5e9",
  "#f3e5f5",
  "#fff3e0",
  "#ede7f6",
  "#fbe9e7",
  "#e1f5fe",
  "#f9fbe7",
  "#fce4ec",
  "#e8eaf6",
];

export function PillRenderer({ labels }: { labels: string[] }) {
  const labelColorMap = useRef<{ [label: string]: string }>({});

  const getColorForLabel = (label: string) => {
    if (!labelColorMap.current[label]) {
      const usedColors = Object.values(labelColorMap.current);
      const availableColors = colors.filter((c) => !usedColors.includes(c));
      const randomColor = availableColors.length
        ? availableColors[Math.floor(Math.random() * availableColors.length)]
        : colors[Math.floor(Math.random() * colors.length)];
      labelColorMap.current[label] = randomColor;
    }
    return labelColorMap.current[label];
  };

  const renderPill = (label: string) => {
    const color = getColorForLabel(label);
    return (
      <Box
        key={label}
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: color,
          color: "grey.800",
          display: "inline-block",
          marginRight: "0.5rem",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 400 }}>
          {label}
        </Typography>
      </Box>
    );
  };

  return <Box>{labels.map(renderPill)}</Box>;
}
