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
import {
  mockEachResearchPaper,
  mockResearchPapers,
} from "@/constants/research";
import CustomButton from "@/components/customButton";
interface ViewPaperParams {
  public_id: string;
}
export default function ViewPapers({ params }: { params: ViewPaperParams }) {
  const { data: session } = useSession();

  const [eachPaper, setEachPaper] = useState<Eachpaper>();

  // const eachPaper = mockEachResearchPaper;

  useEffect(() => {
    setEachPaper(mockEachResearchPaper);
  }),
    [];

  const id = params.public_id;
  const [isLoading, setIsLoading] = useState(false);

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

  // useEffect(() => {
  //   const fetchPaper = async () => {
  //     if (session?.user.token && id) {
  //       try {
  //         const data = await GetPaperById(session, String(id));
  //         if (data?.error) {
  //           router.replace("/dashboard/repository/research-library");
  //           toast.error(data.error.error);
  //           return;
  //         }
  //         setEachPaper(data?.data);
  //       } catch (error) {
  //         console.error("Failed to load research paper", error);
  //       }
  //     }
  //   };

  //   fetchPaper();
  // }, [session?.user.token, id]);
  // if (!eachPaper)
  // return (
  //   <div className="p-5 flex justify-center">
  //     <CircularProgress />
  //   </div>
  // );

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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {eachPaper && eachPaper ? (
        <div className="p-5 flex justify-center">
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Grid container spacing={3}>
              <Grid item container xs={12} gap={2}>
                {/* reponsive button */}
                {eachPaper && isSmallScreen && (
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
                      }}
                    >
                      <Typography variant="h6">
                        {isLoading ? "Loading..." : "Download"}
                      </Typography>
                      <DownloadIcon fontSize="small" />
                    </CustomButton>
                    <CustomButton
                      disabled={isLoading}
                      size="small"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        paddingInline: "10px",
                      }}
                    >
                      <Typography variant="h6">Chat Now</Typography>
                      <ChatIcon fontSize="small" />
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
                  {eachPaper && !isSmallScreen && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                      }}
                    >
                      <CustomButton
                        endIcon={<DownloadIcon />}
                        disabled={isLoading}
                        sx={{
                          display: "flex",
                          textTransform: "none",
                          paddingInline: "20px",
                        }}
                        onClick={() =>
                          handleDownload(
                            eachPaper.paper_info.pdf_path,
                            eachPaper
                            // eachPaper.paper_info.research_title
                          )
                        }
                      >
                        <Typography variant="h5">
                          {isLoading ? "Loading..." : "Download"}
                        </Typography>
                      </CustomButton>
                      <CustomButton
                        endIcon={<ChatIcon />}
                        disabled={isLoading}
                        sx={{
                          display: "flex",
                          textTransform: "none",
                          paddingInline: "20px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography variant="h5">
                          {/* {isLoading ? "Loading..." : "Download"} */}
                          Chat Now
                        </Typography>
                      </CustomButton>
                    </Box>
                  )}
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
                  <PermIdentityIcon sx={{ display: "flex" }} />
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

              <Grid item container>
                <Box width={"100%"}>
                  <Divider />
                </Box>
              </Grid>
              <Grid item container>
                <Box
                  width={"100%"}
                  sx={{
                    overflow: "wrap",
                    overflowWrap: "break-word",
                    "& li": {
                      listStylePosition: "inside",
                    },
                  }}
                >
                  {/* <SafeHtmlComponent html={eachPaper.fulltext_content} /> */}
                  <RichTextViewPaper
                    rich_text={eachPaper && eachPaper.fulltext_content}
                  />
                </Box>
              </Grid>
              <Grid item container>
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
    </>
  );
}
