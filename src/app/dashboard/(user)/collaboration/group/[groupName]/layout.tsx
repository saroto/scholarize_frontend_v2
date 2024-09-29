/** @format */

"use client";
import DashboardNavbar from "@/components/navbar/dashboard_navbar";
import DashboardLeftSideBar from "@/components/sidebar/dashboard_left_sidebar";
import { SectionList } from "@/components/sidebar/section_list";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useSearchParams } from "next/navigation";
import { SocketIOProvider } from "@/socketio/SocketIOProvider";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllFolders } from "@/app/api/service/collab/file-storage/getAllFolders";

type Params = {
  groupName: string;
};

export default function CollaborationLayout({
  children,
  params,
}: {
  params: Params;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const [folders, setFolders] = useState<any[]>([]);

  const { data: session } = useSession();

  const fetchFolders = async () => {
    try {
      if (session?.user.token) {
        const response = await getAllFolders(
          session.user.token,
          Number(searchParams?.get("groupId"))
        );
        setFolders(response.folders);
      }
    } catch (error) {
      console.error("Failed to get folders", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [params.groupName]);

  const inGroupSideBarLists: SectionList[] = [
    {
      href: `/dashboard/collaboration/group/${
        params.groupName
      }/tasks?${searchParams?.toString()}`,
      title: "Tasks",
      Icon: <AssignmentIcon />,
    },
    {
      href: `/dashboard/collaboration/group/${
        params.groupName
      }/schedule?${searchParams?.toString()}`,
      title: "Schedule",
      Icon: <CalendarMonthIcon />,
    },
    {
      href: `/dashboard/collaboration/group/${
        params.groupName
      }/file-storage?${searchParams?.toString()}`,
      title: "File storage",
      isCollapsible: true,
      folderLists: folders,
      groupName: params.groupName,
      Icon: <InsertDriveFileIcon />,
    },
  ];

  return (
    <>
      <SocketIOProvider>
        <DashboardNavbar
          leftSideBar={
            <DashboardLeftSideBar sectionLists={inGroupSideBarLists} />
          }
          openDrawer={true}
        >
          {children}
        </DashboardNavbar>
      </SocketIOProvider>
    </>
  );
}
