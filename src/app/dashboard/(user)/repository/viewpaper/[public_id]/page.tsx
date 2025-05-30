"use client";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Chip,
  Button,
  Fab,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArticleIcon from "@mui/icons-material/Article";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { GetPaperById } from "@/app/api/service/getPaperById";
import { Eachpaper } from "@/types";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import downloadResearchFiles from "@/app/api/service/downloadFiles";
import ScrollTop from "@/components/scroll-to-top";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RichTextViewPaper from "@/components/rich-text/rich-text-view-paper";
import ChatIcon from "@mui/icons-material/Chat";
import CustomButton from "@/components/customButton";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RelatedCard from "@/components/card/related_card";
import PersonIcon from "@mui/icons-material/Person";
interface ViewPaperParams {
  public_id: string;
}
const relatedPapers = [
  {
    title: "Transformers in Vision: A New Era",
    description: "Exploring the use of transformers in computer vision tasks.",
  },
  {
    title: "GPT-4: Scaling Up Language Models",
    description:
      "An in-depth analysis of scaling laws and their impact on NLP models.",
  },
  {
    title: "Self-Supervised Learning for Speech Recognition",
    description: "How self-supervised methods improve ASR systems.",
  },
  {
    title: "Neural Radiance Fields (NeRF) for 3D Reconstruction",
    description: "Using NeRFs for realistic 3D scene rendering.",
  },
  {
    title: "Diffusion Models: The Future of Generative AI",
    description:
      "Understanding how diffusion models outperform GANs in image synthesis.",
  },
  {
    title: "Reinforcement Learning with Human Feedback",
    description:
      "Incorporating human preferences into RL agents for better alignment.",
  },
  {
    title: "LoRA: Efficient Fine-Tuning for Large Models",
    description: "A low-rank adaptation method to efficiently fine-tune LLMs.",
  },
  {
    title: "Multi-Modal AI: Bridging Text, Image, and Video",
    description:
      "How models like CLIP and Flamingo combine different modalities.",
  },
  {
    title: "Efficient Transformers: Linformer vs. Performer",
    description: "A comparison of memory-efficient transformer architectures.",
  },
  {
    title: "Chain-of-Thought Prompting: Enhancing Model Reasoning",
    description:
      "How few-shot prompting techniques improve logical reasoning in LLMs.",
  },
];

export default function ViewPapers({ params }: { params: ViewPaperParams }) {
  const { data: session } = useSession();

  const [eachPaper, setEachPaper] = useState<Eachpaper>();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const eachPaper = mockEachResearchPaper;

  // useEffect(() => {
  //   setEachPaper(mockEachResearchPaper);
  // }),
  //   [];

  const id = params.public_id;
  const [isLoading, setIsLoading] = useState(false);

  console.log("eachPaper", eachPaper);
  const handleDownload = async (path: string, eachPaper: Eachpaper) => {
    setIsLoading(true);

    try {
      const response = await downloadResearchFiles(
        eachPaper.paper_info.pdf_path,
        eachPaper.paper_info.research_title
      );
      if (!response.success) {
        toast.error("Failed to download file");
        return;
      }

      const downloadUrl = response.url;
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const router = useRouter();

  useEffect(() => {
    const fetchPaper = async () => {
      if (session?.user.token && id) {
        try {
          const data = await GetPaperById(session, String(id));
          if (data?.error) {
            router.replace("/dashboard/repository/research-library");
            toast.error(data.error.error);
            return;
          }
          setEachPaper(data?.data);
          // console.log("eachPaper", data.data.session);
          setSessionId(data?.data.session);
        } catch (error) {
          console.error("Failed to load research paper", error);
        }
      }
    };

    fetchPaper();
  }, [session?.user.token, id]);
  if (!eachPaper)
    return (
      <div className="p-5 flex justify-center">
        <CircularProgress />
      </div>
    );

  const handleBackClick = () => {
    const authSignInRoute = "/signin/oauth/id";
    const defaultRoute = "/dashboard/repository/research-library";
    const previousRoute = document.referrer;

    if (previousRoute.includes(authSignInRoute)) {
      window.location.href = defaultRoute;
    } else {
      window.history.back();
    }
  };

  return (
    <>
      {eachPaper && eachPaper ? (
        <div className="p-5 flex justify-center overflow-auto mb-4">
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
                {/* reponsive button */}
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
                      onClick={() =>
                        handleDownload(
                          eachPaper.paper_info.pdf_path,
                          eachPaper
                          // eachPaper.paper_info.research_title
                        )
                      }
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        paddingInline: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        backgroundColor: "#E0EAFF",
                        color: "#0030AA",
                        border: "1.5px solid #0030AA",
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
                        },
                        "&:active": {
                          backgroundColor: "#C0D0FF", // Darkest when pressed
                          transform: "translateY(0px)", // Reset lift on click
                        },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
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
                      // onClick={() =>
                      //   router.push(
                      //     `/dashboard/repository/viewpaper/${
                      //       eachPaper.paper_info.pdf_path
                      //     }/chat?title=${encodeURIComponent(
                      //       eachPaper.paper_info.research_title
                      //     )}&paperId=${
                      //       eachPaper.paper_info.public_id
                      //     }&sessionId=${sessionId}`
                      //   )
                      // }
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
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        paddingInline: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        backgroundColor: "#E0EAFF",
                        color: "#0030AA",
                        border: "1.5px solid #0030AA",
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
                        },
                        "&:active": {
                          backgroundColor: "#C0D0FF", // Darkest when pressed
                          transform: "translateY(0px)", // Reset lift on click
                        },
                      }}
                    >
                      <ChatIcon fontSize="small" />
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
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        paddingInline: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        backgroundColor: "#E0EAFF",
                        color: "#0030AA",
                        border: "1.5px solid #0030AA",
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
                        },
                        "&:active": {
                          backgroundColor: "#C0D0FF", // Darkest when pressed
                          transform: "translateY(0px)", // Reset lift on click
                        },
                      }}
                    >
                      <PictureAsPdfIcon fontSize="small" />
                      <Typography
                        sx={{
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Full PDF
                      </Typography>
                    </CustomButton>
                  </Box>
                )}

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
                      key={eachPaper && eachPaper.paper_info.research_paper_id}
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
            {/* <Box
              sx={{
                display: "flex",
                height: "100%",
              }}
            >
              <PDFViewer title={eachPaper.paper_info.research_title} />
            </Box> */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  py: "10px",
                }}
              >
                Related Paper
              </Typography>

              {relatedPapers.map((paper, index) => (
                <Box key={index}>
                  <RelatedCard
                    title={paper.title}
                    description={paper.description}
                  />
                  {index !== relatedPapers.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}{" "}
                  {/* Add divider if more than one item */}
                </Box>
              ))}
            </Box>
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
    </>
  );
}
