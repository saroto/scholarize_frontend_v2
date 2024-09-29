/** @format */

"use client";
import { getGroups } from "@/app/api/service/handleGroups";
import GroupCard, { GroupDetail } from "@/components/card/group_card";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CreateGroupCard from "@/components/card/create_group_card";

const ListGroups = () => {
  const { data: session } = useSession();
  const [groups, setGroups] = useState<GroupDetail[]>([]);

  const [hasCreateGroupPermission, setHasCreateGroupPermission] =
    useState(false);

  useEffect(() => {
    if (session) {
      GetActiveGroup();
      if (
        session.user.role_permissions.some((category) =>
          category.permissions.includes("Create group")
        )
      ) {
        setHasCreateGroupPermission(true);
      }
    }
  }, [session?.user?.token]);

  const GetActiveGroup = async () => {
    if (session) {
      await getGroups(session)
        .then(({ active }) => {
          if (active?.length === 0) {
            setGroups([]);
            return;
          }
          setGroups(() =>
            active.map((group: any) => ({
              groupId: group.id,
              groupTitle: group.name,
              isOwner: group.isOwner,
              groupMembers: group.members,
              groupOwner: group.owner,
              groupAction: group.actions,
              collab_archive_status: group.collab_archive_status,
            }))
          );
        })
        .catch(console.error);
    }
  };

  if (groups?.length === 0 && !hasCreateGroupPermission) {
    return (
      <Container maxWidth={false} disableGutters sx={{ px: 3 }}>
        <Stack
          direction={"row"}
          mt={4}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography
            variant="h6"
            component="h6"
            fontWeight={"400"}
            color={"text.secondary"}
          >
            You are currently not in a collaboration group!
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {groups?.map((groupDetail) => {
        return (
          <Grid item key={groupDetail.groupId}>
            <GroupCard
              groupDetail={groupDetail}
              maxMemberToShow={99}
              UpdateGetGroup={GetActiveGroup}
              isArchived={false}
            />
          </Grid>
        );
      })}
      {hasCreateGroupPermission && (
        <CreateGroupCard onGroupCreate={GetActiveGroup} />
      )}
    </div>
  );
};

export default ListGroups;
