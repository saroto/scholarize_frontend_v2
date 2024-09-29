import { Metadata } from "next";

import { Container, Grid } from "@mui/material";

import ListGroups from "./list_groups";

// making this server component so we can export metadata
export const metadata: Metadata = {
  title: "Archived Groups | Scholarize",
};

export default async function CollaborationGroup() {
  return (
    <Container maxWidth={false} disableGutters sx={{ p: 3 }}>
      <Grid container gap={3}>
        <ListGroups />
      </Grid>
    </Container>
  );
}
