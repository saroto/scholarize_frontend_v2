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
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface BrowserPaperCardProps {
  paper: ResearchPaper;
}
export default function BrowserPaperCardNew({
  paper,
}: //   handleClick,
BrowserPaperCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const handleClick = (public_id: string) => {
    if (!session) {
      //   router.push("auth/signin");
      const url = new URL("/auth/signin", window.location.origin);
      url.searchParams.append(
        "callbackUrl",
        `/dashboard/repository/viewpaper/${public_id}`
      );
      router.push(url.toString());
    } else {
      router.push(`/dashboard/repository/viewpaper/${public_id}`);
    }
  };
  return (
    <>
      {paper && paper !== null && (
        <>
          <Card
            sx={{
              marginBottom: 2,
              // borderRadius: "0.5rem",
              width: "100%",
              // bgcolor: "#f9f9f9",
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
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  overflow: "hidden",
                  flexDirection: "row",
                }}
              >

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
              </Box> */}

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
                    variant="h5"
                    className="research-title"
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      // color: "#2F2F85",
                      color: "#708090",

                      // fontWeight: "550",
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
                    color="#333333"
                    sx={{
                      textJustify: "inter-word",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: showFullAbstract ? undefined : 20,
                    }}
                  >
                    {showFullAbstract || paper.abstract.length <= 300
                      ? paper.abstract
                      : `${paper.abstract.substring(0, 300)}`}
                    {paper.abstract && paper.abstract.length > 300 && (
                      <span
                        onClick={() => setShowFullAbstract(!showFullAbstract)}
                        style={{
                          opacity: 0.6,
                          cursor: "pointer",
                        }}
                      >
                        {showFullAbstract ? " less" : "... more"}
                      </span>
                    )}
                  </Typography>
                </Box>
              </Grid>
              {/* Research Type, Author, Published Date */}
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                sx={{
                  gap: "1.5rem",
                  width: "100%",
                }}
              >
                <Box
                  display={"flex"}
                  maxWidth={"20%"}
                  sx={{
                    gap: "0.2rem",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ArticleIcon />
                  <Typography variant="body2">
                    {paper.research_type?.ResearchTypeName.slice(0, 20) +
                      (paper.research_type?.ResearchTypeName.length > 20
                        ? "..."
                        : "")}
                  </Typography>
                </Box>

                <Box
                  display={"flex"}
                  maxWidth={"40%"}
                  sx={{
                    gap: "0.2rem",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <PermIdentityIcon />
                  <Typography variant="body2">
                    {paper.author.slice(0, 20) +
                      (paper.author.length > 30 ? "..." : "")}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  maxWidth={"40%"}
                  sx={{
                    gap: "0.2rem",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CalendarMonthIcon />
                  <Typography variant="body2">{paper.published_at}</Typography>
                </Box>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
