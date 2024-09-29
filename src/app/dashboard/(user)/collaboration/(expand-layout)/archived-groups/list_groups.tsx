/** @format */

"use client";
import { getGroups } from "@/app/api/service/handleGroups";
import GroupCard, { GroupDetail } from "@/components/card/group_card";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ScrollTop from "@/components/scroll-to-top";
import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
const ListGroups = () => {
  // Get the current user session get token
  const { data: session } = useSession();
  const [archive, setArchive] = useState<GroupDetail[]>([]);

  useEffect(() => {
    if (session?.user.token) {
      GetArchivedGroup();
    }
  }, [session?.user?.token]);

  const GetArchivedGroup = async () => {
    if (session) {
      await getGroups(session).then(({ archived }) => {
        if (archived?.length === 0) {
          setArchive([]);
          return;
        }
        setArchive(() =>
          archived.map((group: any) => ({
            groupId: group.id,
            groupTitle: group.name,
            isOwner: group.isOwner,
            groupMembers: group.members,
            groupOwner: group.owner,
            groupAction: group.actions,
            collab_archive_status: group.collab_archive_status,
          }))
        );
      });
      // .catch(console.error);
    }
  };

  if (archive?.length === 0) {
    return (
      <Container maxWidth={false} disableGutters sx={{ px: 3 }}>
        <div id="back-to-top-anchor" />
        <ScrollTop>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
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
            No archived groups found
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {archive?.map((groupDetail) => {
        return (
          <Grid item key={groupDetail.groupId}>
            <GroupCard
              groupDetail={groupDetail}
              maxMemberToShow={99}
              UpdateGetGroup={GetArchivedGroup}
              isArchived={true}
            />
          </Grid>
        );
      })}
    </div>
  );
};

export default ListGroups;
