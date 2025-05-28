/** @format */

"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Link,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { awaitPaper } from "@/app/api/service/publication/awaitingPaper";
import { useSession } from "next-auth/react";
import { awaiting_paper } from "@/types";
import DownloadButton from "@/components/download-file";
import RichText from "@/components/rich-text/rich-text-preview";
import ViewPaper from "@/components/viewPaper";
interface submissionPropParam {
  public_id: string;
}

export default function submissionPreview({
  params,
}: {
  params: submissionPropParam;
}) {
  const { data: session } = useSession();
  const id = params.public_id;

  const [awaitingPaper, setawaitingPaper] = useState<awaiting_paper>();

  console.log("awaitingPaper", awaitingPaper);
  useEffect(() => {
    if (session?.user.token && id) {
      const fetchPaper = async () => {
        try {
          const data = await awaitPaper(session.user.token, String(id));
          setawaitingPaper(data);
        } catch (error) {
          console.error("Failed to load awaitng paper", error);
        }
      };
      fetchPaper();
    }
  }, [session?.user.token, id]);

  // const dept = awaitingPaper?.paper.departments
  //   .map((department) => department.department_name)
  //   .join(", ");

  return (
    <Box sx={{ width: "100%", padding: 4, overflow: "auto" }}>
      <FormControl fullWidth>
        <Button
          href="/dashboard/repository/my-publications"
          sx={{
            textDecoration: "none",
            alignItems: "center",
            display: "flex",
            height: "auto",
            position: "absolute",
            fontSize: "1rem",
            color: "#777777",
            ":hover": {
              textDecoration: "none",
              color: "black",
            },
          }}
        >
          <ArrowBackIcon sx={{ padding: 0, margin: 0 }}></ArrowBackIcon>
          <Typography sx={{ display: "flex" }}>BACK</Typography>
        </Button>
        <Typography
          variant="h4"
          sx={{
            marginBottom: 3,
            textAlign: "center",
            alignItems: "center",
            fontWeight: "550",
          }}
        >
          Awaitng Approval Submission
        </Typography>
        {awaitingPaper && <ViewPaper viewPaper={awaitingPaper} />}
      </FormControl>

      {/* <Stack direction="column">
        <InputLabel id="rich-text" sx={{ color: "black", fontWeight: "550" }}>
          FULL TEXT
        </InputLabel>
      </Stack> */}

      {/* <Stack direction="column" sx={{ marginTop: 2 }}>
        <RichText rich_text={awaitingPaper?.full_text} />
      </Stack> */}
    </Box>
  );
}
