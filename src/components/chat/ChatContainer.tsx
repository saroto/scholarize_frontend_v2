import {
  Box,
  Button,
  Container,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChatInput from "./ChatInput";
import TextMessage from "./TextMessage";
import { chatPDF } from "@/app/api/service/repo/chat/chatPDF";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { GetChatSession } from "@/app/api/service/repo/chat/getChatSession";
import { saveChatHistory } from "@/app/api/service/repo/chat/updateChatSession";

interface SearchFormData {
  collection_name: string;
  query: string;
}

// Interface for chat messages
interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: Date;
}
export default function ChatContainer() {
  const theme = useTheme();
  const { data: session } = useSession();
  const searchParam = useSearchParams();
  const collectionName = searchParam?.get("title") ?? "No Title Found";
  const sessionId = searchParam?.get("sessionId") ?? "No Session ID Found";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fecthMessage, setFetchMessage] = useState<ChatMessage[]>([]);

  console.log("fecthMessage", fecthMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SearchFormData>({
    collection_name: collectionName,
    query: "",
  });

  console.log("chat data array", messages);
  useEffect(() => {
    if (session?.user.token && sessionId) {
      const fetchChatSession = async () => {
        try {
          const data = await GetChatSession(session, String(sessionId));

          setFetchMessage(data.data.session.Message || []);
        } catch (error) {
          console.error("Failed to load research paper", error);
        }
      };
      fetchChatSession();
    }
  }, [session?.user.token, sessionId]);

  // Function to merge fetched messages with current messages
  const mergeChatHistory = () => {
    if (fecthMessage.length > 0) {
      // Remove duplicates by checking message IDs or timestamps
      const existingIds = new Set(
        messages.map((msg) => msg.id || msg.timestamp)
      );
      const newMessages = fecthMessage.filter(
        (msg) => !existingIds.has(msg.id || msg.timestamp)
      );

      // Merge and sort by timestamp if available
      const mergedMessages = [...messages, ...newMessages].sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        }
        return 0;
      });

      setMessages(mergedMessages);
      return mergedMessages;
    }
    return messages;
  };

  useEffect(() => {
    if (fecthMessage.length > 0) {
      const mergedMessages = mergeChatHistory();
      setMessages(mergedMessages);
      scrollHandler(true); // Force scroll to bottom when new messages are loaded
    }
  }, [fecthMessage]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // const scrollToBottom = () => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //   }
  // };

  // useEffect(() => {
  //   if (messages.length > 0 || isLoading) {
  //     scrollToBottom();
  //   }
  // }, [messages, isLoading]);
  const isScrollingRef = useRef(false);

  const scrollHandler = (forceScroll = false) => {
    if (!chatContainerRef.current) return;

    // For new messages or loading start - always scroll
    if (forceScroll) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      return;
    }

    // For streaming - smart scroll
    if (isScrollingRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom <= 30) {
      chatContainerRef.current.scrollTop = scrollHeight;
    }
  };

  const handleScroll = () => {
    isScrollingRef.current = true;
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 100);
  };

  // NEW MESSAGES: Force scroll
  useEffect(() => {
    if (messages.length > 0) {
      isScrollingRef.current = false;
      scrollHandler(true); // Force scroll
    }
  }, [messages]);

  // LOADING START: Force scroll
  useEffect(() => {
    if (isLoading) {
      scrollHandler(true); // Force scroll
    }
  }, [isLoading]);
  const chatPDFData = async (query: string) => {
    const requestFormData = new FormData();

    const specialCharRegex = /[@#$%^+]+/;
    const checkInput = (input: string, fieldName: string) => {
      if (specialCharRegex.test(input) || input.length > 255) {
        toast.error(
          `${fieldName} cannot contain special characters or exceed 255 characters`
        );
        setIsLoading(false);
        return true;
      }
      return false;
    };

    if (checkInput(formData.query, "query")) return;
    if (checkInput(formData.collection_name, "collection_name")) return;

    requestFormData.append("collection_name", formData.collection_name);
    requestFormData.append("query", formData.query);

    console.log("Request Form Data:", requestFormData);
    try {
      const response = await chatPDF(requestFormData, session);
      return response;
    } catch (error) {
      console.error("Error fetching chat data:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!formData.query.trim()) {
      // toast.error("Please enter a query");
      return;
    }

    // Set loading state to true
    setIsLoading(true);

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: formData.query,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Clear the input immediately
    const currentQuery = formData.query;
    setFormData((prev) => ({ ...prev, query: "" }));

    try {
      const response = await chatPDFData(currentQuery);

      if (response?.success && response.data) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(), // Add 1 to avoid duplicate IDs
          message: response.data.answer || "No answer found",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Add error message as bot response
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message:
            "Sorry, I encountered an error while processing your request. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      toast.error("Failed to send message");

      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(), // Add 2 to avoid duplicate IDs
        message: "An error occurred while processing your request.",
        sender: "bot",
        timestamp: new Date(),
      };

      // Remove duplicate userMessage from the catch block
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // Always set loading to false when done
      setIsLoading(false);
    }
  };
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      query: event.target.value,
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const saveHistory = async () => {
    try {
      // First merge fetched messages with current messages
      const finalMessages = mergeChatHistory();

      if (finalMessages.length === 0) {
        toast.error("No chat history to save");
        return;
      }

      // Create FormData object
      const formData = new FormData();

      // Convert messages to JSON and append to FormData
      const messagesJson = JSON.stringify(finalMessages);
      formData.append("message", messagesJson);

      console.log("Saving chat history:", messagesJson);
      // Call the save API
      const result = await saveChatHistory(
        formData,
        session,
        String(sessionId)
      );

      if (result.success) {
        toast.success("Chat history saved successfully");
      } else {
        toast.error("Failed to save chat history");
        console.error("Save error:", result.error);
      }
    } catch (error) {
      console.error("Error saving chat history:", error);
      toast.error("An error occurred while saving chat history");
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "hidden",
          paddingBlock: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "16px",
          }}
        >
          <Tooltip title="Save Chat">
            <IconButton
              onClick={saveHistory}
              size="small"
              sx={{
                borderRadius: "5px",
                color: "#0030AA",
                border: "1.5px solid #0030AA",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                backgroundColor: "#E0EAFF",
                "&:hover": {
                  backgroundColor: "#D0DCFF", // Darker on hover
                  color: "#001F80", // Slightly darker text
                  borderColor: "#001F80",
                  transform: "translateY(-1px)", // Subtle lift effect
                },
                "&:focus": {
                  backgroundColor: "#C8D6FF", // Even darker on focus
                  color: "#001A70", // Darker text on focus
                  borderColor: "#001A70",
                  outline: "2px solid rgba(0, 48, 170, 0.3)", // Focus ring
                  outlineOffset: "2px",
                },
                "&:active": {
                  backgroundColor: "#C0D0FF", // Darkest when pressed
                  transform: "translateY(0px)", // Reset lift on click
                },
              }}
            >
              <SaveAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Chat History">
            <IconButton
              color="error"
              size="small"
              sx={{
                backgroundColor: "#FDE0E0",
                borderRadius: "5px",
                border: "1.5px solid",
                borderColor: "#F00000",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#FCC8C8", // Darker red on hover
                  borderColor: "#D00000", // Darker border
                  transform: "translateY(-1px)", // Subtle lift effect
                  "& .MuiSvgIcon-root": {
                    color: "#D00000", // Darker icon color
                  },
                },
                "&:focus": {
                  backgroundColor: "#FAB0B0", // Even darker on focus
                  borderColor: "#C00000", // Darker border on focus
                  outline: "2px solid rgba(240, 0, 0, 0.3)", // Focus ring
                  outlineOffset: "2px",
                  "& .MuiSvgIcon-root": {
                    color: "#C00000", // Darker icon color
                  },
                },
                "&:active": {
                  backgroundColor: "#F89898", // Darkest when pressed
                  transform: "translateY(0px)", // Reset lift on click
                  "& .MuiSvgIcon-root": {
                    color: "#B00000", // Darkest icon color
                  },
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        {messages.length === 0 ? (
          newChat()
        ) : (
          <Box
            ref={chatContainerRef}
            onScroll={handleScroll}
            sx={{
              display: "flex",
              overflow: "auto",
              height: "100%",
              flex: 1,
              flexDirection: "column",
            }}
          >
            {messages.map((msg) => (
              <TextMessage
                key={msg.id}
                message={msg.message}
                sender={msg.sender}
                onContentUpdate={() => scrollHandler(false)}
              />
            ))}
            {isLoading && (
              <TextMessage
                message=""
                sender="bot"
                isLoading={true}
                onContentUpdate={() => scrollHandler(false)}
              />
            )}
          </Box>
        )}

        <ChatInput
          onClick={handleSendMessage}
          inputProps={{
            value: formData.query,
            onChange: handleQueryChange,
            onKeyPress: handleKeyPress,
            placeholder: "Ask about research paper...",
            disabled: isLoading,
          }}
          buttonProps={{
            disabled: isLoading || !formData.query.trim(),
          }}
        />
        {/* Add other chat components here */}
      </Box>
    </>
  );
}

const newChat = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflow: "hidden",
        paddingBlock: "20px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 500, textAlign: "center", color: "text.secondary" }}
      >
        Start a new chat by asking questions about your research paper.
        <br />
        Type your question in the input box below and press Enter or click the
        send button to get started.
      </Typography>
    </Box>
  );
};
