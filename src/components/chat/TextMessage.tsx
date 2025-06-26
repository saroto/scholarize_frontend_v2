import {
  Box,
  Avatar,
  Typography,
  keyframes,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import usePageStore from "@/stores/StorePageNumber";
import "./ChatMarkDown.css";

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

// Basic metadata interface
export interface Metadata {
  page: string;
}

// Extended metadata interface with optional properties
export interface ExtendedMetadata {
  page: string;
  title?: string;
  author?: string;
  source?: string;
  date?: string;
  document_id?: string;
  total_pages?: number;
  file_type?: string;
  file_size?: string;
  keywords?: string[];
  summary?: string;
}
interface TextMessageProps {
  message: string;
  metadata?: Metadata | ExtendedMetadata;
  sender: "user" | "bot";
  isLoading?: boolean;
  onContentUpdate?: () => void;
  shouldStream?: boolean;
  profileUrl?: string;
}

export default function TextMessage({
  message,
  metadata,
  sender,
  isLoading = false,
  shouldStream,
  onContentUpdate,
  profileUrl,
}: TextMessageProps) {
  const isUser = sender === "user";
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { pageNumber: pageNumberChat, setPageNumber } = usePageStore();
  console.log("ee", message);
  console.log("meta", metadata);
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
      const typingSpeed = 0.1; // milliseconds per character

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

  // When Zustand pageNumberChat changes, update pageNumbers accordingly
  useEffect(() => {
    if (pageNumberChat === null) {
      setSelectedPage(null);
    }
  }, [pageNumberChat]);

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
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const getPageNumbers = (): number[] => {
    if (!metadata?.page) return [];

    const pages: number[] = metadata.page
      .split(",")
      .map((page: string) => page.trim())
      .filter((page: string) => page && !isNaN(Number(page)))
      .map((page: string) => parseInt(page, 10));

    return [...new Set(pages)].sort((a: number, b: number) => a - b);
  };

  const pageNumbers: number[] = getPageNumbers();

  const handlePageClick = (pageNumber: number): void => {
    setSelectedPage(pageNumber);
    onPageClick?.(pageNumber);
  };

  const onPageClick = (pageNumber: number): void => {
    // Handle page click logic here, e.g., navigate to a specific page in the document
    console.log(`Page ${pageNumber} clicked`);
    setPageNumber(pageNumber);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

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
            <article className="markdown-body">
              <ReactMarkdown
                components={{
                  li: ({ node, children, ...props }) => (
                    <li className="text-base mb-2" {...props}>
                      {children}
                    </li>
                  ),
                }}
              >
                {typeof displayedMessage === "string"
                  ? displayedMessage
                  : JSON.stringify(displayedMessage)}
              </ReactMarkdown>
            </article>

            {sender === "bot" && !isSmallScreen && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {pageNumbers.map((pageNumber) => (
                    <IconButton
                      key={pageNumber}
                      onClick={() => handlePageClick(pageNumber)}
                      size="small"
                      sx={{
                        backgroundColor:
                          selectedPage === pageNumber
                            ? "primary.main"
                            : "grey.100",
                        color:
                          selectedPage === pageNumber
                            ? "white"
                            : "primary.main",
                        border: 1,
                        borderColor:
                          selectedPage === pageNumber
                            ? "primary.main"
                            : "grey.300",
                        "&:hover": {
                          backgroundColor:
                            selectedPage === pageNumber
                              ? "primary.dark"
                              : "primary.light",
                          color: "white",
                        },

                        width: 24,
                        height: 24,
                        padding: 0,
                        fontSize: "10px",
                        fontWeight: 600,
                        borderRadius: "50%",
                      }}
                    >
                      {pageNumber}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            )}

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
