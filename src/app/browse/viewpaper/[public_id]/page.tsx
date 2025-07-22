"use client";
import { GetPublicPaperDetailById } from "@/app/api/service/getPublicPaperDetailById";
import CustomButton from "@/components/customButton";
import ScrollTop from "@/components/scroll-to-top";
import { Eachpaper } from "@/types";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Divider,
  Fab,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatIcon from "@mui/icons-material/Chat";
import downloadResearchFiles from "@/app/api/service/downloadFiles";
import { useSession } from "next-auth/react";
import ErrorIcon from "@mui/icons-material/Error";
import Navbar from "@/app/(landing)/navbar";

interface ViewPaperParams {
  public_id: string;
}
export default function PaperDetail({ params }: { params: ViewPaperParams }) {
  const { data: session } = useSession();
  console.log("session", session);
  const [eachPaper, setEachPaper] = useState<Eachpaper>();
  const id = params.public_id;
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const data = await GetPublicPaperDetailById(String(id));

        if (data?.error) {
          // router.replace("/browse");
          toast.error(data.error);
          return;
        }
        setEachPaper(data?.data);
      } catch (error) {
        console.error("Failed to load research paper", error);
      }
    };

    fetchPaper();
  }, [id]);
  const handleDownload = async () => {
    if (!session) {
      router.replace(`/dashboard/repository/viewpaper/${id}`);
      return;
    }
    setIsLoading(true);
  };
  return (
    <>
      <Navbar />
      {/* <Box
        sx={{
          backgroundColor: "rgba(0, 102, 204, 0.1)",
          padding: "8px",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {" "}
          <ErrorIcon />
          <Typography variant="h5">
            Please <strong>sign in</strong> to view the full research paper and
            access all features, including <strong>PDF viewing</strong> and{" "}
            <strong>PDF download</strong>.
          </Typography>
        </Box>
      </Box> */}
      <Box sx={{ marginTop: "60px" }}>
        {eachPaper && eachPaper ? (
          <div className="p-5 flex justify-center overflow-auto mb-4 relative">
            <Box
              sx={{
                width: isSmallScreen ? "100%" : "60%",
                display: "flex",
                height: "100%",
                flexDirection: "column",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Grid container spacing={3}>
                <Grid item container xs={12} gap={2}>
                  {/* title and tag */}
                  <Box
                    display={"flex"}
                    sx={{
                      width: "100%",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      key={eachPaper.paper_info.research_paper_id}
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        // alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h3"
                        key={
                          eachPaper && eachPaper.paper_info.research_paper_id
                        }
                        fontWeight={"bold"}
                        sx={{
                          textTransform: "capitalize",
                          textWrap: "wrap",
                          wordWrap: "break-word",
                          color: "text.primary",
                          alignSelf: "center",
                        }}
                      >
                        {eachPaper && eachPaper.paper_info.research_title}
                      </Typography>

                      {eachPaper &&
                        eachPaper.paper_info?.departments?.map((department) => (
                          <Chip
                            label={department.department_tag}
                            size="small"
                            sx={{
                              marginRight: 1,
                              display: "flex",
                              backgroundColor: department.department_color,
                              color: "#fff",
                              my: 0.5,
                              alignSelf: "flex-start",
                            }}
                            key={department.department_id}
                          />
                        ))}
                    </Box>
                  </Box>

                  {/* <Box
                  sx={{
                    backgroundColor: "rgba(0, 102, 204, 0.1)",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {" "}
                    <ErrorIcon />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      Noted
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ marginTop: "8px" }}>
                    After your paper is approved, please allow 5–7 minutes for
                    processing. You will be notified via email when the search
                    is successful or if any issues occur.
                  </Typography>
                </Box> */}

                  {eachPaper && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                      }}
                    >
                      <CustomButton
                        disabled={isLoading}
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon fontSize="small" />}
                        onClick={() => handleDownload()}
                        sx={{
                          px: "1rem",
                          borderRadius: "1rem",
                          textTransform: "none",
                          boxShadow: "none",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isLoading ? "Loading..." : "Download"}
                        </Typography>
                      </CustomButton>
                      <CustomButton
                        onClick={() => {
                          // Get existing chat sessions from localStorage
                          const existingSessions =
                            sessionStorage.getItem("chatSessions");
                          let sessions = existingSessions
                            ? JSON.parse(existingSessions)
                            : [];

                          // Create new session object
                          const newSession = {
                            paperID: eachPaper.paper_info.public_id,
                            sessionId: sessionId,
                            paperTitle: eachPaper.paper_info.research_title,
                            pdfPath: eachPaper.paper_info.pdf_path,
                            timestamp: new Date().toISOString(),
                          };

                          // Check if session already exists (avoid duplicates)
                          const existingIndex = sessions.findIndex(
                            (session: any) =>
                              session.paperID === newSession.paperID &&
                              session.sessionId === newSession.sessionId
                          );

                          if (existingIndex !== -1) {
                            // Update existing session
                            sessions[existingIndex] = newSession;
                          } else {
                            // Add new session to the beginning of array
                            sessions.unshift(newSession);
                          }

                          // Store updated sessions array back to localStorage
                          sessionStorage.setItem(
                            "chatSessions",
                            JSON.stringify(sessions)
                          );

                          // Navigate to the chat page
                          router.push(
                            `/dashboard/repository/viewpaper/${
                              eachPaper.paper_info.pdf_path
                            }/chat?title=${encodeURIComponent(
                              eachPaper.paper_info.research_title
                            )}&paperId=${
                              eachPaper.paper_info.public_id
                            }&sessionId=${sessionId}`
                          );
                        }}
                        disabled={isLoading}
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<ChatIcon fontSize="small" />}
                        sx={{
                          px: "1rem",
                          borderRadius: "1rem",
                          textTransform: "none",
                          boxShadow: "none",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Chat Now
                        </Typography>
                      </CustomButton>
                      <CustomButton
                        size="small"
                        variant="contained"
                        startIcon={<PictureAsPdfIcon fontSize="small" />}
                        color="primary"
                        onClick={() =>
                          router.push(
                            `/dashboard/repository/viewpaper/${
                              eachPaper.paper_info.pdf_path
                            }/pdf?title=${encodeURIComponent(
                              eachPaper.paper_info.research_title
                            )}`
                          )
                        }
                        sx={{
                          px: "1rem",
                          borderRadius: "1rem",
                          textTransform: "none",
                          boxShadow: "none",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          View PDF
                        </Typography>
                      </CustomButton>
                    </Box>
                  )}
                  {!session && (
                    <Box
                      sx={{
                        backgroundColor: "rgba(0, 102, 204, 0.1)",
                        padding: "8px",
                        borderRadius: "8px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {" "}
                        <ErrorIcon />
                        <Typography variant="h5">
                          Please <strong>sign in</strong> to view the full
                          research paper and access all features, including{" "}
                          <strong>PDF download, </strong>
                          <strong>PDF viewing</strong> and{" "}
                          <strong>Chat with PDF</strong>.
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid
                  item
                  container
                  sx={{ display: "flex", gap: 4, alignItems: "center" }}
                >
                  <Box
                    display={"flex"}
                    sx={{ alignItems: "center", gap: "10px" }}
                  >
                    <ArticleIcon sx={{ display: "flex" }} />
                    <Typography
                      variant="h5"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {eachPaper &&
                        eachPaper.paper_info.research_type.ResearchTypeName}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item container>
                  <Box
                    display={"flex"}
                    sx={{ alignItems: "center", gap: "10px" }}
                  >
                    {/* <PermIdentityIcon sx={{ display: "flex" }} /> */}
                    <PersonIcon sx={{ display: "flex" }} />

                    <Typography
                      variant="h5"
                      sx={{
                        color: "text.secondary",
                      }}
                    >
                      {eachPaper && eachPaper.paper_info.author}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item container>
                  <Box
                    display={"flex"}
                    sx={{ alignItems: "center", gap: "10px" }}
                  >
                    <CalendarMonthIcon sx={{ display: "flex" }} />
                    <Typography variant="h5" sx={{ color: "text.secondary" }}>
                      {eachPaper && eachPaper.paper_info.published_at}
                    </Typography>
                  </Box>
                </Grid>
                {eachPaper && eachPaper.raw_paper.Advisor !== "None" && (
                  <Grid item container>
                    <Box
                      display={"flex"}
                      sx={{ alignItems: "center", gap: "10px" }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ color: "text.primary", fontWeight: 500 }}
                      >
                        Advisor:{" "}
                      </Typography>
                      <Typography variant="h5" sx={{ color: "text.secondary" }}>
                        {eachPaper.raw_paper.Advisor}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item container>
                  <Box
                    display={"flex"}
                    sx={{ alignItems: "center", gap: "10px" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ color: "text.primary", fontWeight: 500 }}
                    >
                      Keyword:{" "}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "text.secondary" }}>
                      {eachPaper && eachPaper.raw_paper.Tag}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item container mt="1rem">
                  <Box
                    width={"100%"}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      Abstract
                    </Typography>
                    <Typography variant="h5">
                      {eachPaper && eachPaper.paper_info.abstract}
                    </Typography>
                  </Box>
                </Grid>

                <Grid
                  item
                  container
                  sx={{
                    marginBlock: "5px",
                  }}
                >
                  <Box width={"100%"}>
                    <Divider />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <ScrollTop>
              <Fab size="small" aria-label="scroll back to top">
                <KeyboardArrowUpIcon />
              </Fab>
            </ScrollTop>
          </div>
        ) : (
          <div className="p-5 flex justify-center">
            <CircularProgress />
          </div>
        )}
      </Box>
    </>
  );
}
