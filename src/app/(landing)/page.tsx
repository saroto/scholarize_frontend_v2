/** @format */

"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import Footer from "@/components/footer/footer";

export default function Home() {
  return (
    <>
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#f5f5f5] to-[#cfcfcf] opacity-90"
        style={{
          zIndex: -1,
        }}
      >
        <img
          src={
            "https://raw.githubusercontent.com/Jemmy-PIU/Scholarize/main/scholarize-landing-bg.png"
          }
          alt=""
          className="w-full h-screen"
        />
      </div>
      <div className="h-[100vh] w-[100%] sm:px-5 md:px-10">
        <Container
          disableGutters
          sx={{
            height: "100%",
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              height: "90%",
              width: "100%",
            }}
          >
            <Box className="fade-in-right">
              <Typography
                variant="h3"
                component="h3"
                fontWeight={"600"}
                sx={{
                  fontSize: {
                    xs: "1.5rem",
                    sm: "2rem",
                  },
                }}
                className="md:text"
              >
                Your all-in-one research repository and collaboration at{" "}
                <span
                  className="text-[#2F2F85]"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Paragon International University
                </span>
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                mt={3}
                sx={{
                  fontWeight: 400,
                  maxWidth: "50rem",
                  fontSize: {
                    xs: "0.75rem",
                    sm: "1rem",
                  },
                }}
              >
                Effortlessly access research papers, engage in collaborative
                research with advisors in specialized groups, manage tasks and
                schedules smoothly, and securely store all research documents.
              </Typography>
              <Typography
                variant="h5"
                component="h5"
                mt={3}
                sx={{
                  maxWidth: "50rem",
                  fontSize: {
                    xs: "1rem",
                    sm: "1.25rem",
                  },
                }}
                fontWeight={"500"}
              >
                Enhance research experience with ease and efficiency!
              </Typography>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={3}
                mt={3}
                sx={{
                  maxWidth: "50rem",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href="/browse"
                  sx={{
                    position: "relative",
                    fontSize: {
                      xs: "0.75rem",
                      sm: "1rem",
                    },
                    backgroundColor: "#000", // Default black background color
                    color: "#fff", // Text color
                    borderRadius: "8px", // Slightly rounded corners
                    padding: "10px 20px",
                    overflow: "hidden",
                    zIndex: 1,
                    transition: "box-shadow 0.3s, transform 0.3s", // Smooth transition for shadow and transform
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)", // Initial subtle shadow
                    "&:hover": {
                      boxShadow: "0 0 20px rgba(255, 255, 255, 0.4)", // Stronger glow on hover
                      transform: "scale(1.05)", // Slightly larger button on hover
                      backgroundColor: "#000", // Maintain black background on hover
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(255, 255, 255, 0.2)",
                      zIndex: -1,
                      transition: "opacity 0.3s",
                      borderRadius: "inherit",
                    },
                    "&:hover:before": {
                      opacity: 0.2,
                    },
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      top: -10,
                      left: -10,
                      right: -10,
                      bottom: -10,
                      borderRadius: "inherit",
                      background:
                        "linear-gradient(-180deg, #000 70%, #fff 30% 100%)",

                      filter: "blur(10px)",
                      zIndex: -2,
                      opacity: 0,
                      transition: "opacity 0.3s",
                    },
                    "&:hover:after": {
                      opacity: 1,
                    },
                  }}
                >
                  Find a research
                </Button>
                <Stack direction={"row"}>
                  <Typography
                    variant="h6"
                    component="h6"
                    fontWeight={"400"}
                    sx={{
                      fontSize: {
                        xs: "0.75rem",
                        sm: "1rem",
                      },
                    }}
                  >
                    For more information contact us
                    <Link
                      href="https://sites.google.com/paragoniu.edu.kh/scholarize/home"
                      target="_blank"
                      className="ml-1 underline font-medium hover:cursor-pointer hover:text-blue-600"
                    >
                      here
                    </Link>
                    !
                  </Typography>
                </Stack>
              </Stack>
            </Box>
            <Box
              className="fade-in-left"
              sx={{
                animationDelay: "0.5s",
                width: "12.5rem",
                justifyContent: "center",
              }}
            >
              <div className="w-full h-full">
                <img src={"/PIUsvg.svg"} alt="logo" className="w-full h-full" />
              </div>
              {/* Image animated */}
              {/* <Image
              src={"/landing_page.png"}
              alt="image"
              width={800}
              height={800}
            /> */}
            </Box>
          </Stack>
          <Footer />
        </Container>
      </div>
    </>
  );
}
