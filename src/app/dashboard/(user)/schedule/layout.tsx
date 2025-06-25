/** @format */

// src/app/dashboard/(user)/schedule/layout.tsx
"use client";
import React, { useEffect, useState } from "react";
import DashboardNavbar from "@/components/navbar/dashboard_navbar";
import ScheduleLeftSideBar from "@/components/sidebar/schedule_left_sidebar";
import { SectionList } from "@/components/sidebar/section_list";
import { useSession } from "next-auth/react";
import { getGroups } from "@/app/api/service/handleGroups";
import GroupsIcon from "@mui/icons-material/Group";
import Calendar from "./calendar";
import { SocketIOProvider } from "@/socketio/SocketIOProvider";
import { Box } from "@mui/material";

export default function CollaborationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collabLists, setCollabLists] = useState<SectionList[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const { data: session } = useSession();
  const [sidebarClick, setSidebarClick] = useState(false);

  useEffect(() => {
    if (session) {
      getGroups(session)
        .then((groups) => {
          const sidebarItems = groups?.active.map((group: any) => ({
            href: group.id.toString(),
            title: `${group.name} 
            (${group.isOwner ? "Owner" : group.owner?.name})`,
            // title: group.name + " (" + group.owner?.name + ")",
            Icon: <GroupsIcon />,
            color: group.color,
          }));
          setCollabLists(sidebarItems);
          setSelectedGroups(
            groups.active.map((group: any) => group.id.toString())
          );
        })
        .catch(console.error);
    }
  }, [session]);

  const handleGroupToggle = (id: string) => {
    setSelectedGroups((prev: string[]) =>
      prev.includes(id) ? prev.filter((group) => group !== id) : [...prev, id]
    );
  };

  return (
    <SocketIOProvider>
      <DashboardNavbar
        leftSideBar={
          <ScheduleLeftSideBar
            collabList={collabLists}
            onGroupToggle={handleGroupToggle}
            selectedGroups={selectedGroups}
          />
        }
        openDrawer={true}
        onClick={() => setSidebarClick(!sidebarClick)}
      >
        {children}
        <Box
          sx={{
            height: "100%",
            display: "flex",
            overflow: "auto",
          }}
        >
          <Calendar
            selectedGroups={selectedGroups}
            collabs={collabLists}
            onClick={sidebarClick}
          />
        </Box>
      </DashboardNavbar>
    </SocketIOProvider>
  );
}
