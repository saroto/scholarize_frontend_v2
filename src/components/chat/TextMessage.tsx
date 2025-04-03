/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

interface TextMessageProps {
  sender: "user" | "bot";
  message: string | object;
  isImage?: boolean;
  isFile?: boolean;
  isFinish?: boolean;
  keyQuestion?: string;
}

export default function TextMessage({
  sender,
  message,
  isImage,
  isFile,
  isFinish,
  keyQuestion,
}: TextMessageProps) {
  const isUser = sender === "user";

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
          src={isUser ? "assets/images/bot.png" : "assets/images/logo_main.png"}
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
      {/* TODO: consider update font family, for more readable */}
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
        }}
      >
        <ReactMarkdown>
          {typeof message === "string" ? message : JSON.stringify(message)}
        </ReactMarkdown>
      </Typography>
    </Box>
  );
}
