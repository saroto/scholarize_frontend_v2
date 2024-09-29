"use client";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Chip,
  Button,
  Fab,
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
interface ViewPaperParams {
  public_id: string;
}
export default function ViewPapers({ params }: { params: ViewPaperParams }) {
  const { data: session } = useSession();

  const [eachPaper, setEachPaper] = useState<Eachpaper>();

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
        } catch (error) {
          console.error("Failed to load research paper", error);
        }
      }
    };

    fetchPaper();
  }, [session?.user.token, id]);
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

  return (
    <>
      {eachPaper && eachPaper ? (
        <div className="p-5 flex justify-center">
          <Box
            sx={{
              border: "2px solid #e0e0e0",
              borderRadius: 5,
              width: "100%",
              backgroundColor: "#fff",
            }}
          >
            <Box sx={{ padding: 3 }}>
              <Button
                // onClick={() => router.back()}
                onClick={handleBackClick}
                sx={{
                  textDecoration: "none",
                  alignItems: "center",
                  display: "flex",
                  height: "auto",
                  position: "absolute",
                  fontSize: "1rem",
                  color: "#777777",
                  ":hover": {
                    textDecoration: "none",
                    color: "black",
                  },
                }}
              >
                <ArrowBackIcon sx={{ padding: 0, margin: 0 }}></ArrowBackIcon>
                <Typography sx={{ display: "flex" }}>BACK</Typography>
              </Button>
            </Box>
            <Grid container sx={{ padding: 5 }} spacing={3}>
              <Grid item container>
                {eachPaper &&
                  eachPaper.paper_info?.departments?.map((department) => (
                    <Chip
                      label={department.department_tag}
                      size="medium"
                      sx={{
                        marginRight: 1,
                        display: "flex",
                        backgroundColor: department.department_color,
                        color: "#fff",
                        fontSize: "1.2rem",
                        my: 0.5,
                      }}
                      key={department.department_id}
                    ></Chip>
                  ))}
              </Grid>

              <Grid item container xs={12}>
                <Box width={"100%"}>
                  <Typography
                    variant="h4"
                    key={eachPaper && eachPaper.paper_info.research_paper_id}
                    fontWeight={"bold"}
                    color={"#2F2F85"}
                    sx={{
                      textTransform: "capitalize",
                      textWrap: "wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {eachPaper && eachPaper.paper_info.research_title}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                item
                container
                sx={{ display: "flex", gap: 4, alignItems: "center" }}
              >
                <Box display={"flex"} sx={{ justifyContent: "center" }}>
                  <ArticleIcon sx={{ display: "flex" }} />
                  <Typography
                    sx={{
                      marginLeft: 0.7,
                      fontSize: "1.1rem",
                      fontWeight: "550",
                    }}
                  >
                    {eachPaper &&
                      eachPaper.paper_info.research_type.ResearchTypeName}
                  </Typography>
                </Box>
              </Grid>

              <Grid item container>
                <Box display={"flex"}>
                  <PermIdentityIcon sx={{ display: "flex" }} />
                  <Typography
                    sx={{
                      marginLeft: 0.7,
                      fontSize: "1.1rem",
                      // fontStyle: "italic",
                    }}
                  >
                    {eachPaper && eachPaper.paper_info.author}
                  </Typography>
                </Box>
              </Grid>

              <Grid item container>
                <Box display={"flex"}>
                  <CalendarMonthIcon sx={{ display: "flex" }} />
                  <Typography sx={{ marginLeft: 0.7, fontSize: "1.1rem" }}>
                    {eachPaper && eachPaper.paper_info.published_at}
                  </Typography>
                </Box>
              </Grid>
              {eachPaper && eachPaper.raw_paper.Advisor !== "None" && (
                <Grid item container>
                  <Box component="span" mr={1}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Advisor:{" "}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "1.1rem" }}>
                    {eachPaper.raw_paper.Advisor}
                  </Typography>
                </Grid>
              )}

              <Grid item container>
                <Box component="span" mr={1}>
                  <Typography sx={{ fontWeight: "bold" }}>Keyword: </Typography>
                </Box>
                <Typography sx={{ fontSize: "1.1rem" }}>
                  {eachPaper && eachPaper.raw_paper.Tag}
                </Typography>
              </Grid>
              <Grid item container>
                {eachPaper && (
                  <Button
                    sx={{
                      display: "flex",
                      borderRadius: 5,
                      padding: "0.5rem",
                      paddingLeft: "1.25rem",
                      paddingRight: "1.25rem",
                      cursor: "pointer",
                      backgroundColor: "#3572EF",

                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#050C9C",
                        color: "#fff",
                        transition: "all 0.5s",
                      },
                    }}
                    disabled={isLoading}
                    onClick={() =>
                      handleDownload(
                        eachPaper.paper_info.pdf_path,
                        eachPaper
                        // eachPaper.paper_info.research_title
                      )
                    }
                  >
                    <DownloadIcon sx={{ display: "flex" }} />
                    <Typography
                      sx={{
                        marginLeft: 0.5,
                        fontSize: "1.1rem",
                      }}
                    >
                      {isLoading ? "Loading..." : "Download"}
                    </Typography>
                  </Button>
                )}
              </Grid>
              <Grid item container mt="1rem">
                <Box width={"100%"}>
                  <Typography variant="h4" mb={1} sx={{ fontWeight: " 550" }}>
                    Abstract
                  </Typography>
                  <Typography variant="body1">
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
