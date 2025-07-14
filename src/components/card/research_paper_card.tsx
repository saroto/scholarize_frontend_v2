/** @format */

"use client";
import { Typography, Box, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { getResearchPapers } from "@/app/api/service/getResearchPaper";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { publicResearchPaper, ResearchPaper, SubmissionPaper } from "@/types";
import { GetPaperById } from "@/app/api/service/getPaperById";
import { MyPublication } from "@/app/api/service/publication/myPublication";
import useSearchStore from "@/stores/useSearchStore";
import { getResearchPaperBySearch } from "@/app/api/service/getResearchPaperBySearch";
import {
  getPaperByHOD,
  getPaperByHODById,
} from "@/app/api/service/getPaperByHOD";
import PaperCardComponent from "./papercard_component";
import { useResearchPaperStore } from "@/stores/StoreResearchPaper";
import { usePublicationPaperStore } from "@/stores/StorePublicationPaper";
import { useSubmissionPaperStore } from "@/stores/StoreSubmissionPaper";
import { toast } from "react-toastify";
import downloadResearchFiles from "@/app/api/service/downloadFiles";
type FetchType = "all" | "user-specific" | "submitted";

interface ResearchPaperCardProps {
  fetchType: FetchType;
}
const ResearchPaperCard: React.FC<ResearchPaperCardProps> = ({ fetchType }) => {
  const { data: session } = useSession();
  const [allPapers, setAllPapers] = useState<ResearchPaper[]>([]);
  console.log("allPapers", allPapers);
  const [userPapers, setUserPapers] = useState<publicResearchPaper | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [submission, setSubmission] = useState<SubmissionPaper | null>(null);

  const { filters } = useSearchStore();
  const router = useRouter();

  const { setPapers } = useResearchPaperStore();
  const { setpublicePaper } = usePublicationPaperStore();
  const { setSubmissionPaper } = useSubmissionPaperStore();

  useEffect(() => {
    if (session) {
      setIsLoading(true);
      const fetchPapers = async () => {
        switch (fetchType) {
          case "all":
            try {
              const fetchPapers = await getResearchPapers(session);

              if (fetchPapers?.data.papers === null) {
                setIsLoading(false);
                setAllPapers([]);
                setPapers([]);
                return;
              }

              setIsLoading(false);
              setAllPapers(fetchPapers?.data.papers);
              setPapers(fetchPapers?.data.papers);
            } catch (error) {
              // throw new Error("Failed to fetch data" + error);
              setIsLoading(false);
            }
            break;
          case "user-specific":
            try {
              const userSpecificPapers = await MyPublication(session);
              if (userSpecificPapers === null) {
                setUserPapers(null);
                setIsLoading(false);
                return;
              }
              setUserPapers(userSpecificPapers && userSpecificPapers.data);
              setpublicePaper(userSpecificPapers && userSpecificPapers.data);
              setIsLoading(false);
            } catch (error) {
              // throw new Error("Failed to fetch data" + error);
            }
            break;
          case "submitted":
            try {
              const submittedPapers = await getPaperByHOD(session);
              if (submittedPapers === null) {
                setSubmission(null);
                setIsLoading(false);
                return;
              }
              setSubmission(submittedPapers);
              setSubmissionPaper(submittedPapers);
              setIsLoading(false);
            } catch (error) {
              // throw new Error("Failed to fetch data" + error);
            } finally {
              setIsLoading(false);
            }
            break;
          default:
            console.log("Invalid fetchType");
            break;
        }
      };
      fetchPapers();
      // setAllPapers(mockResearchPapers);
      // setPapers(mockResearchPapers);
    }
  }, [session?.user.token, fetchType]);

  const handleDownload = async (path: string, paper: ResearchPaper) => {
    try {
      const response = await downloadResearchFiles(
        paper.pdf_path,
        paper.research_title
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
  };

  //view paper
  const handleClick = async (id: string) => {
    try {
      await GetPaperById(session, id);
      // setResearchPaperId(id);
      router.push(`/dashboard/repository/viewpaper/${id}`);
    } catch (error) {
      console.error("Failed to get paper:", error);
    }
  };

  //submission
  const handleClickSubmission = async (id: string) => {
    try {
      await getPaperByHODById(session, id);
      router.push(`/dashboard/repository/hod-submission-preview/${id}`);
    } catch (error) {
      console.error("Failed to get paper:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (session?.user.token) {
      const fetchPapers = async () => {
        try {
          setErrorMessage(null);
          setIsLoading(true);
          const fetchedPapers = await getResearchPaperBySearch(
            session,
            filters
          );
          if (fetchedPapers.success === false) {
            setAllPapers([]);
            setIsLoading(false);
            setErrorMessage("Service is now sleeping. Please try again later.");
            return;
          }

          setAllPapers(fetchedPapers);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching papers:", error);
        }
      };
      try {
        fetchPapers();
      } catch (error) {
        setIsLoading(false);
        throw new Error("Failed to fetch data" + error);
      }
    }
  }, [filters]);

  return (
    <>
      {isLoading &&
        Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            sx={{
              borderRadius: "4px",
              width: "100%",
              height: "72px",
              mb: 1,
            }}
          />
        ))}

      {!isLoading &&
        fetchType === "all" &&
        (errorMessage ? (
          <Box sx={{ justifyContent: "center", textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "#777777",
                fontStyle: "italic",
                marginTop: 2,
              }}
            >
              {errorMessage}
            </Typography>
          </Box>
        ) : allPapers && allPapers.length > 0 ? (
          allPapers.map((paper) => (
            <Box key={paper.research_paper_id} sx={{ display: "flex" }}>
              <PaperCardComponent
                paper={paper}
                handleClick={handleClick}
                handleDownload={handleDownload}
              />
            </Box>
          ))
        ) : (
          <Box sx={{ justifyContent: "center", textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "#777777",
                fontStyle: "italic",
                marginTop: 2,
              }}
            >
              No research paper found
            </Typography>
          </Box>
        ))}

      <Box>
        {fetchType === "user-specific" &&
          !isLoading &&
          (userPapers && userPapers.published_papers !== null ? (
            userPapers.published_papers.map((userPapers) => (
              <Box
                sx={{
                  display: "flex",
                  paddingBottom: "1rem",
                }}
              >
                <PaperCardComponent
                  key={userPapers.research_paper_id}
                  paper={userPapers}
                  handleClick={handleClick}
                  handleDownload={handleDownload}
                />
              </Box>
            ))
          ) : (
            <Box sx={{ justifyContent: "center", textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  color: "#777777",
                  // fontStyle: "italic",

                  marginTop: 2,
                }}
              >
                You don't have any published research paper
              </Typography>
            </Box>
          ))}
      </Box>

      {fetchType === "submitted" &&
        (submission &&
        submission.department !== null &&
        submission.papers !== null ? (
          submission?.papers?.map((submissionPapers) => {
            return (
              <>
                {" "}
                <Box
                  sx={{
                    width: "100%",
                    paddingBottom: "1rem",
                  }}
                >
                  {" "}
                  <PaperCardComponent
                    key={submissionPapers.research_paper_id}
                    paper={submissionPapers}
                    handleClick={handleClickSubmission}
                    handleDownload={handleDownload}
                  />{" "}
                </Box>
              </>
            );
          })
        ) : (
          <Box
            sx={{
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
            }}
          >
            {!isLoading ? (
              <Box>
                {submission && submission.department === null ? (
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      color: "#777777",
                      fontStyle: "italic",
                      marginTop: 2,
                    }}
                  >
                    You are not assigned to any department
                  </Typography>
                ) : (
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      color: "#777777",
                      fontStyle: "italic",
                      marginTop: 2,
                    }}
                  >
                    No research paper found
                  </Typography>
                )}
              </Box>
            ) : null}
          </Box>
        ))}
      {/* {fetchType === "browser" &&(
          <Box sx={{ justifyContent: "center", textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "#777777",
                fontStyle: "italic",
                marginTop: 2,
              }}
            >
              No research paper found
            </Typography>
          </Box>
        
        )} */}
    </>
  );
};
export default ResearchPaperCard;
