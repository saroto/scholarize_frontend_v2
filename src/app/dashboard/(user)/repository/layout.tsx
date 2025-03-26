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

    return (
      <>
        <ScrollTop>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
        <DashboardNavbar
          leftSideBar={
            <DashboardLeftSideBar sectionLists={repositorySideBarLists} />
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
