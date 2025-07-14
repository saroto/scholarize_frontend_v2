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
  useMediaQuery,
  useTheme,
  Divider,
  IconButton,
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div className="p-5 flex justify-center overflow-auto mb-4">
      <Box
        sx={{
          width: isSmallScreen ? "100%" : "60%",
          display: "flex",
          height: "100%",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // Distributes left and right properly
            width: "100%", // Ensure it spans the full width
            position: "relative", // For absolute positioning inside
          }}
        >
          {" "}
          {!isSmallScreen && (
            <Button
              href="/dashboard/repository/my-publications"
              sx={{
                textDecoration: "none",
                alignItems: "center",
                display: "flex",
                fontSize: "1rem",
                color: "#777777",
                ":hover": {
                  textDecoration: "none",
                  color: "black",
                },
              }}
            >
              {isSmallScreen && (
                <IconButton
                  href="/dashboard/repository/my-publications"
                  size="small"
                >
                  <ArrowBackIcon sx={{ padding: 0, margin: 0 }} />
                </IconButton>
              )}
              <ArrowBackIcon sx={{ padding: 0, margin: 0 }}></ArrowBackIcon>
              <Typography sx={{ display: "flex" }}>BACK</Typography>
            </Button>
          )}
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 550,
              margin: "0 auto",
            }}
          >
            Awaitng Approval Submission
          </Typography>
        </Box>

        <Divider
          sx={{
            width: "100%",
          }}
        />
        <FormControl fullWidth>
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
    </div>
  );
}
