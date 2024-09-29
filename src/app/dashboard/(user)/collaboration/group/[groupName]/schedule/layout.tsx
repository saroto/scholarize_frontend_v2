"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/breadcrumb/page";
import { useSession } from "next-auth/react";
import { getCollabDetail } from "@/app/api/service/collab/getCollabDetail";
import Calendar from "@/app/dashboard/(user)/schedule/calendar";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function CollaborationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const { data: session } = useSession();
  const [collabLists, setCollabLists] = useState<any[]>([]);
  const [collabArchived, setCollabArchived] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const collabIDParam = searchParams?.get("groupId") as string;

  useEffect(() => {
    if (session && collabIDParam !== null) {
      getCollabDetail(session.user.token, collabIDParam).then((data) => {
        if (data?.error) {
          toast.error("Failed to fetch collaboration group details");
        } else {
          setCollabLists([
            {
              collab_id: data?.collab?.collab_id,
              collab_name: data?.collab?.collab_name,
            },
          ]);
          setCollabArchived(data?.collab?.collab_archive_status);
          setSelectedGroups([data?.collab?.collab_id.toString()]);
        }
      });
    }
  }, [collabIDParam, session]);

  return (
    <>
      <Breadcrumb
        groupname={collabLists[0]?.collab_name}
        href="/dashboard/collaboration/groups"
        section="Schedule"
      />
      <div className="my-4" />
      <Calendar
        selectedGroups={selectedGroups}
        collabs={collabLists}
        collabArchived={collabArchived}
      />
    </>
  );
}
