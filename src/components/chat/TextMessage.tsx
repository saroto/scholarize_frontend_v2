import { Box, Avatar, Typography, keyframes } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";

// Keyframes for the loading dots animation
const loadingDots = keyframes`
  0%, 20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  80%, 100% {
    opacity: 0;
  }
`;

interface TextMessageProps {
  message: string;
  sender: "user" | "bot";
  isLoading?: boolean;
  onContentUpdate?: () => void;
  shouldStream?: boolean;
  profileUrl?: string;
}

export default function TextMessage({
  message,
  sender,
  isLoading = false,
  shouldStream,
  onContentUpdate,
  profileUrl,
}: TextMessageProps) {
  const isUser = sender === "user";
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  console.log("ee", message);

  console.log("stream", shouldStream);
  // Call onContentUpdate when displayedMessage changes (during streaming)
  useEffect(() => {
    if (onContentUpdate && displayedMessage) {
      onContentUpdate();
    }
  }, [displayedMessage, onContentUpdate]);

  // Also call when message prop changes (for immediate updates)
  useEffect(() => {
    if (onContentUpdate && message) {
      onContentUpdate();
    }
  }, [message, onContentUpdate]);

  useEffect(() => {
    if (isUser || isLoading) {
      // Show user messages immediately or show loading
      setDisplayedMessage(message);
      return;
    }

    // Use message-specific shouldStream instead of global isStreaming
    if (!shouldStream) {
      // Load all text immediately without streaming effect
      setDisplayedMessage(message);
      setIsTyping(false);
      return;
    }

    // Bot message streaming effect
    if (message && message.length > 0) {
      setIsTyping(true);
      setDisplayedMessage("");

      let currentIndex = 0;
      const typingSpeed = 0.5; // milliseconds per character

      const typeMessage = () => {
        if (currentIndex < message.length) {
          setDisplayedMessage(message.substring(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeMessage, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };

      typeMessage();
    }
  }, [message, isUser, isLoading, shouldStream]);

  const formatMessage = (message: string) => {
    if (typeof message !== "string") {
      return JSON.stringify(message, null, 2);
    }

    return message
      .replace(/\\n'\s*\+\s*'/g, "\n") // Remove concatenation artifacts
      .replace(/\\n/g, "\n") // Convert \n to actual newlines
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Convert multiple newlines to double
      .trim();
  };

  console.log("displayedMessage", displayedMessage);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        justifyContent: isUser ? "flex-end" : "flex-start",
        gap: "10px",
        alignItems: "flex-start",
        paddingX: "10px",
        marginBlock: "10px",
      }}
    >
      {isUser && (
        <Avatar
          alt={isUser ? "User" : "Bot"}
          src={isUser ? profileUrl : "assets/images/bot.png"}
          variant="square"
          sx={{
            width: 32,
            height: 32,
            border: "1px solid",
            borderColor: "#E3E5E5",
            borderRadius: "12px",
          }}
        />
      )}

      <Typography
        variant="h5"
        sx={{
          backgroundColor: isUser ? "background.paper" : "",
          borderRadius: "16px",
          padding: "10px",
          color: "text.primary",
          border: isUser ? "1px solid" : "",
          borderColor: isUser ? "#E3E5E5" : "",
          maxWidth: "80%",
          marginLeft: isUser ? "auto" : "0",
          marginRight: isUser ? "0" : "auto",
          wordSpacing: "1px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {isLoading && !isUser ? (
          // Loading dots animation
          <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <Box
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "text.primary",
                animation: `${loadingDots} 1.4s ease-in-out infinite`,
                animationDelay: "0s",
              }}
            />
            <Box
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "text.primary",
                animation: `${loadingDots} 1.4s ease-in-out infinite`,
                animationDelay: "0.2s",
              }}
            />
            <Box
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "text.primary",
                animation: `${loadingDots} 1.4s ease-in-out infinite`,
                animationDelay: "0.4s",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ReactMarkdown>
              {typeof displayedMessage === "string"
                ? displayedMessage
                : JSON.stringify(displayedMessage)}
              {/* {typeof displayedMessage === "string"
                ? displayedMessage
                : formatMessage(displayedMessage)} */}
            </ReactMarkdown>
            {/* Show blinking cursor while typing */}
            {isTyping && !isUser && (
              <Box
                sx={{
                  width: "2px",
                  height: "20px",
                  backgroundColor: "text.primary",
                  marginLeft: "2px",
                  animation: "blink 1s infinite",
                  "@keyframes blink": {
                    "0%, 50%": { opacity: 1 },
                    "51%, 100%": { opacity: 0 },
                  },
                }}
              />
            )}
          </Box>
        )}
      </Typography>
    </Box>
  );
}
