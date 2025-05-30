import React from "react";
import { Box, Skeleton } from "@mui/material";

interface ChatSkeletonProps {
  messageCount?: number;
}

const ChatSkeleton: React.FC<ChatSkeletonProps> = ({ messageCount = 6 }) => {
  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {Array.from({ length: messageCount }, (_, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Message skeleton */}
          <Skeleton variant="text" height={20} width="80%" sx={{ mb: 0.5 }} />
          <Skeleton variant="text" height={20} width="60%" sx={{ mb: 0.5 }} />
          <Skeleton variant="text" height={20} width="60%" sx={{ mb: 0.5 }} />
          <Skeleton variant="text" height={20} width="40%" />
        </Box>
      ))}
    </Box>
  );
};

export default ChatSkeleton;
