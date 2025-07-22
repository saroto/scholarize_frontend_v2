/** @format */

import { ResearchPaper } from "@/types";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GetPaperById } from "../api/service/getPaperById";
import { GetPublicPaperDetailById } from "../api/service/getPublicPaperDetailById";
interface BrowserPaperCardProps {
  paper: ResearchPaper;
}
export default function BrowserPaperCard({
  paper,
}: //   handleClick,
BrowserPaperCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  // const handleClick = (public_id: string) => {
  //   if (!session) {
  //     //   router.push("auth/signin");
  //     const url = new URL("/auth/signin", window.location.origin);
  //     url.searchParams.append(
  //       "callbackUrl",
  //       `/dashboard/repository/viewpaper/${public_id}`
  //     );
  //     router.replace(url.toString());
  //   } else {
  //     router.push(`/dashboard/repository/viewpaper/${public_id}`);
  //   }
  // };

  const handleClick = async (public_id: string) => {
    console.log("public_id", public_id);
    try {
      await GetPublicPaperDetailById(public_id);
      // setResearchPaperId(id);
      router.push(`/browse/viewpaper/${public_id}`);
    } catch (error) {
      console.error("Failed to get paper:", error);
    }
  };

  return (
    <>
      {paper && paper !== null && (
        <>
          <Card
            sx={{
              marginBottom: 2,
              borderRadius: "16px",
              width: "100%",
              border: "1px solid",
              borderColor: "#ddd",
              boxShadow: 0,
              backgroundColor: "white",
            }}
            key={paper.research_paper_id}
          >
            <CardContent
              sx={{
                width: "100%",
                padding: "1.25rem",
                display: "flex",
                overflow: "hidden",
                flexDirection: "column",
                gap: "1rem",
                "&:last-child": {
                  paddingBottom: "1.25rem",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  overflow: "hidden",
                  flexDirection: "row",
                }}
              >
                {/* Departments */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "0.5rem",
                  }}
                >
                  {paper.departments && paper.departments !== null && (
                    <>
                      {paper.departments.slice(0, 3).map((department) => (
                        <Box
                          key={department.department_id}
                          sx={{ display: "flex" }}
                        >
                          <Tooltip
                            title={department.department_name}
                            placement="top"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: `${department.department_color} !important`,
                                  color: "#fff",
                                },
                              },
                            }}
                          >
                            <Chip
                              variant="outlined"
                              label={department.department_tag}
                              size="small"
                              sx={{
                                backgroundColor: department.department_color,
                                color: "#fff",
                                fontWeight: "575",
                                p: "0.25rem",
                                border: "none",
                              }}
                            />
                          </Tooltip>
                        </Box>
                      ))}
                      {paper.departments.length > 3 && (
                        <Box sx={{ display: "flex" }}>
                          <Chip
                            size="small"
                            label={"+ " + (paper.departments.length - 3)}
                            sx={{
                              backgroundColor: "#777777",
                              color: "#fff",
                            }}
                          />
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>

              {/* Research Title */}
              <Box
                flexDirection="row"
                alignContent={"start"}
                display={"flex"}
                justifyContent={"start"}
              >
                <Box
                  display={"flex"}
                  width={"100%"}
                  onClick={() => handleClick(paper.public_id)}
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  <Typography
                    variant="h3"
                    className="research-title"
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      // textTransform: "capitalize",
                      // color: "#2F2F85",
                      color: "text.primary",
                      fontWeight: 500,
                      ":hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {paper.research_title}
                  </Typography>
                </Box>
              </Box>
              {/* Abstract */}
              <Grid item xs={12} container alignItems="center">
                <Box display={"flex"} flexDirection="row" width={"100%"}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      textJustify: "inter-word",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: showFullAbstract ? undefined : 20,
                    }}
                  >
                    {showFullAbstract || paper.abstract.length <= 200
                      ? paper.abstract
                      : `${paper.abstract.substring(0, 200)}`}
                    {paper.abstract && paper.abstract.length > 200 && (
                      <Typography
                        component={"span"}
                        variant="body2"
                        onClick={() => setShowFullAbstract(!showFullAbstract)}
                        sx={{
                          color: "text.primary",
                          opacity: 0.6,
                          cursor: "pointer",
                        }}
                      >
                        {showFullAbstract ? " less" : "... more"}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Grid>
              {/* Research Type, Author, Published Date */}
              <Grid item xs={6} container alignItems="center" gap={2}>
                <Tooltip
                  title={`Research Type: ${paper.research_type?.ResearchTypeName}`}
                >
                  <Box
                    display={"flex"}
                    sx={{
                      gap: "10px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ArticleIcon />
                    <Typography variant="body2">
                      {paper.research_type?.ResearchTypeName}
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title={`Author: ${paper.author}`}>
                  <Box
                    display={"flex"}
                    sx={{
                      gap: "10px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <PersonIcon />
                    <Typography
                      variant="body2"
                      sx={{ maxWidth: "10rem" }}
                      noWrap
                    >
                      {paper.author}
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title={`Published Date: ${paper.published_at}`}>
                  <Box
                    display={"flex"}
                    sx={{
                      gap: "10px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <CalendarMonthIcon />
                    <Typography variant="body2">
                      {paper.published_at}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
