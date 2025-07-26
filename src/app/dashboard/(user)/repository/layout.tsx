/** @format */

"use client";
import DashboardNavbar from "@/components/navbar/dashboard_navbar";
import DashboardLeftSideBar from "@/components/sidebar/dashboard_left_sidebar";
import { SectionList } from "@/components/sidebar/section_list";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PublishIcon from "@mui/icons-material/Publish";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useSession } from "next-auth/react";
import ScrollTop from "@/components/scroll-to-top";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Fab } from "@mui/material";
import { getPaperByHODById } from "@/app/api/service/getPaperByHOD";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { GetProgresPaperById } from "@/app/api/service/getProgressPaperById";
export default function RepositoryLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { data: session } = useSession();

  let repositorySideBarLists: SectionList[] = [
    {
      href: "/dashboard/repository/research-library",
      title: "Research Library",
      Icon: <AutoStoriesIcon />,
    },
    {
      href: "/dashboard/repository/my-publications",
      title: "My Publications",
      Icon: <PublishIcon />,
    },
  ];

  {
    const rolePermissions = session?.user.role_permissions;

    let hasResearchSubmissionApproval = false;

    rolePermissions?.forEach((permissionObject) => {
      if (
        permissionObject.permissions.includes("Research submission approval")
      ) {
        hasResearchSubmissionApproval = true;
      }
    });
    if (hasResearchSubmissionApproval) {
      repositorySideBarLists.push({
        href: "/dashboard/repository/hod-submission",
        title: "Submission",
        Icon: <FileDownloadIcon />,
      });
    }

    // Your existing sidebar and permission logic...

    useEffect(() => {
      if (!session?.user.token) return;

      const checkApprovalStatus = async (paperId: string, title: string) => {
        try {
          const result = await GetProgresPaperById(session, paperId);
          if (!result?.success) return;

          const status = result?.data?.data?.ResearchPaperStatus;
          const raw = localStorage.getItem("pendingPaper");
          const item = JSON.parse(raw || "{}");
          switch (status) {
            case "published": {
              try {
                const wasApproved = item.isApproved;

                item.status = "published";
                item.isApproved = true;
                localStorage.setItem("pendingPaper", JSON.stringify(item));

                if (!wasApproved) {
                  toast.success(
                    `Research Paper "${title}" approved successfully!`
                  );
                }
              } catch (err) {
                console.error("Failed to update pendingPaper status");
              }
              break;
            }

            case "rejected":
              localStorage.removeItem("pendingPaper");
              toast.error(`Approval failed for "${title}".`);
              break;

            case "unpublished":
              toast.info(`Research Paper "${title}" is currently unpublished.`);
              break;
            case "awaiting": {
              try {
                item.status = "awaiting";
                localStorage.setItem("pendingPaper", JSON.stringify(item));
              } catch (err) {
                console.error("Failed to update pendingPaper status", err);
              }
              // toast.info(`Research Paper "${title}" is awaiting approval.`);
              break;
            }
            case "pending":
            case "in_progress":
              // Still waiting — do nothing
              break;

            default:
              console.warn(`Unknown status "${status}" for "${title}".`);
          }
        } catch (error) {
          console.error("Failed to check paper status", error);
        }
      };

      const interval = setInterval(() => {
        const itemRaw = localStorage.getItem("pendingPaper");
        if (!itemRaw) return;

        try {
          const item = JSON.parse(itemRaw);

          if (["pending", "awaiting", "in_progress"].includes(item?.status)) {
            checkApprovalStatus(item.id, item.title || "Research Paper");

            // Extend duration to allow more time for checking
            const updatedDuration = (item.duration || 20) + 1;
            localStorage.setItem(
              "pendingPaper",
              JSON.stringify({ ...item, duration: updatedDuration })
            );
          }
        } catch (err) {
          console.error("Invalid JSON in localStorage: pendingPaper", err);
          localStorage.removeItem("pendingPaper"); // cleanup if corrupted
        }
      }, 1000); // check every 10s

      return () => clearInterval(interval);
    }, [session?.user.token]);

    return (
      <>
        <ScrollTop>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
        <DashboardNavbar
          leftSideBar={
            <>
              <DashboardLeftSideBar sectionLists={repositorySideBarLists} />
            </>
          }
          openDrawer={true}
        >
          {/* <Box>test</Box> */}

          {children}
        </DashboardNavbar>
      </>
    );
  }
}
