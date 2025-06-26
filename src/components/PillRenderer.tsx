import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

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

export const PillRenderer = ({
  labels,
  onDelete,
}: {
  labels: string[];
  onDelete?: (label: string) => void;
}) => {
  const labelColorMap = useRef<Record<string, string>>({});

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
          display: "flex",
          alignItems: "center",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: color,
          fontSize: "12px",
          fontWeight: 500,
          color: "#333",
          marginRight: "0.5rem",
          position: "relative",
          maxWidth: "100%",
          overflow: "hidden",
          "&:hover .delete-btn": {
            display: "inline-flex",
          },
          "&:hover .label-text": {
            maxWidth: "calc(100% - 24px)",
          },
        }}
      >
        <Typography
          className="label-text"
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {label}
        </Typography>

        {onDelete && (
          <IconButton
            className="delete-btn"
            size="small"
            sx={{
              display: "none",
              padding: 0,
              marginLeft: "4px",
              width: "20px",
              height: "20px",
            }}
            onClick={() => onDelete(label)}
          >
            <ClearIcon fontSize="inherit" />
          </IconButton>
        )}
      </Box>
    );
  };

  return <>{labels.map((label) => renderPill(label))}</>;
};
