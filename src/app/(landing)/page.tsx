/** @format */

"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

import VideoFrame from "@/components/VideoFrame";
import LandingFooter from "./footer";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const youtubeSrc =
    "https://www.youtube.com/embed/K27diMbCsuw?si=8IeU36V7y6RmhaQl";
  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingBlock: "2rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                lg: "3rem",
                md: "3rem",
                sm: "2rem",
                xs: "2rem",
              },

              fontWeight: 500,
            }}
          >
            Leave it to Scholarize
          </Typography>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              flexDirection: "row",
              fontWeight: 300,
              width: "100%",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Effortlessly search research papers with AI-powered semantic search
            in repository. Chat with papers for insights, collaborate with
            advisors, manage tasks, and securely store all research documents.
          </Typography>
        </Box>
        <VideoFrame src={youtubeSrc} />
        <Button
          variant="contained"
          sx={{
            borderRadius: "16px",
            width: "fit-content",
            boxShadow: 0,
            textTransform: "none",
          }}
          onClick={() => {
            router.push("/browse");
          }}
        >
          Find A Research
        </Button>
        <LandingFooter />
      </Container>
    </>
  );
}
