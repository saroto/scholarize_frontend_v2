import {
  Box,
  Button,
  Container,
  Icon,
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
import ChatModal from "../modal/ChatModal";
import ChatSkeleton from "../skeleton/ChatSkeleton";
import { Metadata, ExtendedMetadata } from "./TextMessage";
import CustomPopper from "../CustomPopper";
import HelpIcon from "@mui/icons-material/Help";
interface SearchFormData {
  collection_name: string;
  query: string;
}

// Interface for chat messages
interface ChatMessage {
  id: string;
  message: string;
  metadata?: Metadata | ExtendedMetadata;
  sender: "user" | "bot";
  timestamp: Date;
  shouldStream?: boolean;
}
export default function ChatContainer() {
  const theme = useTheme();
  const { data: session } = useSession();
  const searchParam = useSearchParams();
  const [chatSessions, setChatSessions] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = sessionStorage.getItem("chatSession");
    setChatSessions(storedSession);
  }, []);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [isLoadingModal, setLoadingModal] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingChatSkeleton, setIsLoadingChatSkeleton] = useState(false);
  const collectionName = searchParam?.get("title") ?? "No Title Found";

  const paperId = searchParam?.get("paperId") ?? "No Paper ID Found";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fecthMessage, setFetchMessage] = useState<ChatMessage[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // Parse the array and find the session by paperId
  let sessionIdFromCache = null;
  let currentSession = null;

  if (chatSessions) {
    const sessionsArray = JSON.parse(chatSessions);

    // Find the session that matches the current paperId
    currentSession = sessionsArray.find(
      (session: any) => session.paperID === paperId
    );

    // Extract sessionId if session found
    sessionIdFromCache = currentSession?.sessionId || null;
  }
  const sessionId =
    sessionIdFromCache ??
    searchParam?.get("sessionId") ??
    "No Session ID Found";

  console.log("fecthMessage", fecthMessage);
  const [isLoading, setIsLoading] = useState(false);
  console.log("is", isLoading);
  const [formData, setFormData] = useState<SearchFormData>({
    collection_name: collectionName,
    query: "",
  });

  console.log("chat data array", messages);
  useEffect(() => {
    if (session?.user.token && sessionId) {
      setIsLoadingChatSkeleton(true);
      const fetchChatSession = async () => {
        try {
          const data = await GetChatSession(session, String(sessionId));

          setFetchMessage(data.data.session.Message || []);
          setIsLoadingChatSkeleton(false);
        } catch (error) {
          setIsLoadingChatSkeleton(false);
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
      const mergedMessages = mergeChatHistory().map((msg) => ({
        ...msg,
        shouldStream: false, // Don't stream fetched messages
      }));
      setMessages(mergedMessages);
      // Wait for DOM update
      setTimeout(() => {
        scrollHandler(true);
      }, 10);
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
          metadata: response.data.metadata || "No metadata found",
          sender: "bot",
          timestamp: new Date(),
          shouldStream: true, // Stream new messages
        };
        setIsStreaming(true);
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
        // setIsStreaming(true);
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
      // setIsStreaming(true);
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
      setLoadingModal(true);
      // First merge fetched messages with current messages
      const finalMessages = mergeChatHistory();

      if (finalMessages.length === 0) {
        toast.error("No chat history to save");
        setLoadingModal(false);
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
        setLoadingModal(false);
        toast.success("Chat history saved successfully");
      } else {
        toast.error("Failed to save chat history");
        console.error("Save error:", result.error);
        setLoadingModal(false);
      }
    } catch (error) {
      console.error("Error saving chat history:", error);
      toast.error("An error occurred while saving chat history");
      setLoadingModal(false);
    }
    setLoadingModal(false);
  };

  const deleteHistory = async () => {
    try {
      setLoadingModal(true);
      // Create FormData object
      const formData = new FormData();

      // Send empty array as JSON for deletion
      const emptyMessagesJson = JSON.stringify([]);
      formData.append("message", emptyMessagesJson);

      console.log("Deleting chat history by sending empty messages");

      // Call the save API with empty messages to delete
      const result = await saveChatHistory(
        formData,
        session,
        String(sessionId)
      );

      if (result.success) {
        toast.success("Chat history deleted successfully");
        setMessages([]);
        setFetchMessage([]);
        setLoadingModal(false);
      } else {
        toast.error("Failed to delete chat history");
        setLoadingModal(false);
        console.error("Delete error:", result.error);
      }
    } catch (error) {
      setLoadingModal(false);
      console.error("Error deleting chat history:", error);
      toast.error("An error occurred while deleting chat history");
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
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
            justifyContent: "space-between",
            paddingInline: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 500,
              }}
            >
              Chat
            </Typography>
            <IconButton
              aria-describedby={id}
              type="button"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <HelpIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: "10px" }}>
            {messages.length !== 0 && (
              <Tooltip title="Save Chat">
                <IconButton
                  onClick={() => {
                    setOpenSaveModal(true);
                  }}
                  size="small"
                  sx={{
                    backgroundColor: "#000000",
                    borderRadius: "5px",
                    color: "#fff",
                    padding: "6px",
                    "&:hover": {
                      backgroundColor: "#333333",
                    },

                    "&:focus": {
                      backgroundColor: "#333333",
                    },
                  }}
                >
                  <SaveAltIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {messages.length !== 0 && (
              <Tooltip title="Delete Chat History">
                <IconButton
                  onClick={() => {
                    setOpenDeleteModal(true);
                  }}
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
                    },
                    "&:focus": {
                      backgroundColor: "#FAB0B0", // Even darker on focus
                      borderColor: "#C00000", // Darker border on focus
                    },
                    "&:active": {
                      backgroundColor: "#F89898", // Darkest when pressed
                      transform: "translateY(0px)", // Reset lift on click
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}{" "}
          </Box>
        </Box>
        {isLoadingChatSkeleton ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
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
                metadata={msg.metadata}
                sender={msg.sender}
                shouldStream={msg.shouldStream || false}
                profileUrl={session?.user.image || ""}
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
          inputProps={{
            value: formData.query,
            onChange: handleQueryChange,
            onKeyPress: handleKeyPress,
            placeholder: "Ask about research paper...",
            disabled: isLoading,
          }}
          buttonProps={{
            onClick: handleSendMessage,
            disabled: isLoading || !formData.query.trim(),
          }}
        />
        {/* Add other chat components here */}
      </Box>
      <ChatModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        confirmTitle="Delete Chat History"
        confirmDescription="Are you sure you want to delete the chat history?"
      >
        <Box sx={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button
            disabled={isLoading}
            onClick={() => setOpenDeleteModal(false)}
            color="primary"
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            // loading={isLoading}
            disabled={isLoading}
            onClick={() => {
              deleteHistory();
              setOpenDeleteModal(false);
            }}
            color="error"
            sx={{
              backgroundColor: "#FDE0E0",
              border: "1.5px solid",
              px: "1rem",
              borderRadius: "1rem",
              borderColor: "#F00000",
              transition: "all 0.2s ease-in-out",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#FCC8C8", // Darker red on hover
                borderColor: "#D00000", // Darker border
              },
              "&:focus": {
                backgroundColor: "#FAB0B0", // Even darker on focus
                borderColor: "#C00000", // Darker border on focus
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
            Delete
          </Button>
        </Box>
      </ChatModal>
      <ChatModal
        open={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        confirmTitle="Save Chat History"
        confirmDescription="Are you sure you want to save this chat history? This action will permanently store the conversation data."
      >
        <Box sx={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button
            disabled={isLoadingModal}
            onClick={() => setOpenSaveModal(false)}
            size="small"
            color="primary"
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            // loading={isLoadingModal}
            disabled={isLoadingModal}
            onClick={() => {
              saveHistory();
              setOpenSaveModal(false);
            }}
            color="primary"
            variant="contained"
            sx={{
              px: "1rem",
              borderRadius: "1rem",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Save
          </Button>
        </Box>
      </ChatModal>
      <CustomPopper id={id} open={open} anchorEl={anchorEl}>
        <div
          style={{
            padding: "8px",
            maxWidth: "240px",
            fontSize: "0.875rem",
            color: "#555",
          }}
        >
          Chat is temporarily saved in memory.
          <strong>
            It will not be saved permanently unless you click "Save History".
          </strong>
        </div>
      </CustomPopper>
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
