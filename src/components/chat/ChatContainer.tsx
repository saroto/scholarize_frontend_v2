import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChatInput from "./ChatInput";
import TextMessage from "./TextMessage";
import { chatPDF } from "@/app/api/service/repo/chat/chatPDF";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SearchFormData>({
    collection_name: collectionName,
    query: "",
  });

  console.log("chat data array", messages);
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
          message: response.data.formatted_answer || "No answer found",
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
        {messages.length === 0 ? (
          newChat()
        ) : (
          <Box
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
              />
            ))}
            {isLoading && (
              <TextMessage message="" sender="bot" isLoading={true} />
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
