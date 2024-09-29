/** @format */

"use client";
import DashboardNavbar from "@/components/navbar/dashboard_navbar";
import CollaborationLeftSideBar, {
  CollaborationList,
} from "@/components/sidebar/collaboration_left_sidebar";
import LayersIcon from "@mui/icons-material/Layers";
import ArchiveIcon from "@mui/icons-material/Archive";
import GroupsIcon from "@mui/icons-material/Groups";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getGroups } from "@/app/api/service/handleGroups";

import ScrollTop from "@/components/scroll-to-top";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab } from "@mui/material";
export default function CollaborationExpandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const [groups, setGroups] = useState<{
    activeGroup: { href: string; title: string }[];
    archivedGroup: { href: string; title: string }[];
  }>({
    activeGroup: [],
    archivedGroup: [],
  });

  useEffect(() => {
    if (session?.user?.token) {
      getGroups(session)
        .then(({ active, archived }) => {
          if (active?.length === 0 && archived?.length === 0) {
            setGroups({
              activeGroup: [],
              archivedGroup: [],
            });
            return;
          }

          if (active?.length === 0) {
            setGroups({
              activeGroup: [],
              archivedGroup: archived.map((group: any) => {
                return {
                  href: `/dashboard/collaboration/group/${group.name}/tasks?groupId=${group.id}`,
                  title: group.name,
                };
              }),
            });
            return;
          }

          if (archived?.length === 0) {
            setGroups({
              activeGroup: active.map((group: any) => {
                return {
                  href: `/dashboard/collaboration/group/${group.name}/tasks?groupId=${group.id}`,
                  title: group.name,
                };
              }),
              archivedGroup: [],
            });
            return;
          }

          setGroups(() => {
            return {
              activeGroup: active.map((group: any) => {
                return {
                  href: `/dashboard/collaboration/group/${group.name}/tasks?groupId=${group.id}`,
                  title: group.name,
                };
              }),
              archivedGroup: archived.map((group: any) => {
                return {
                  href: `/dashboard/collaboration/group/${group.name}/tasks?groupId=${group.id}`,
                  title: group.name,
                };
              }),
            };
          });
        })
        .catch(console.error);
    }
  }, [session?.user?.token]);

  const collaborationLists: CollaborationList[] = [
    {
      href: "/dashboard/collaboration/groups",
      headerTitle: "ACTIVE GROUP",
      icon: <GroupsIcon />,
      collapsible: {
        yes: true,
        default: false,
      },
      sectionLists: groups.activeGroup.map((group) => ({
        ...group,
        Icon: <LayersIcon />,
      })),
    },
    {
      href: "/dashboard/collaboration/archived-groups",
      headerTitle: "ARCHIVED",
      icon: <ArchiveIcon />,
      collapsible: {
        yes: true,
      },
      sectionLists: groups.archivedGroup.map((group) => ({
        ...group,
        Icon: <LayersIcon />,
      })),
    },
  ];

  return (
    <>
      <div id="back-to-top-anchor" />
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <DashboardNavbar
        leftSideBar={
          <CollaborationLeftSideBar collaborationLists={collaborationLists} />
        }
        openDrawer={true}
      >
        {children}
      </DashboardNavbar>
    </>
  );
}
