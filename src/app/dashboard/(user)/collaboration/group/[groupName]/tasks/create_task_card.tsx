/** @format */

"use client";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useState } from "react";
import CreateTaskDialog from "./create-task-dialog";
import { CollabContainer } from "@/types";

export default function CreateTaskCard({
  title,
  color,
  task_status_id,
  updateTaskData,
  createTask,
  collabDetail,
}: Readonly<{
  title: string;
  color: string;
  task_status_id: string;
  updateTaskData: () => void;
  createTask: (task_title: string, task_status_id: string) => void;
  collabDetail: CollabContainer;
}>) {
  const [createTaskDialogOpen, setCreateTaskDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <CreateTaskDialog
        open={createTaskDialogOpen}
        onClose={() => setCreateTaskDialogOpen(false)}
        task_status_id={task_status_id}
        updateTaskData={updateTaskData}
        createTask={createTask}
      />
      <Card
        sx={{
          borderTop: `1rem solid ${color ?? "#C1C1C1"}`,
          filter: "drop-shadow(0px 2px 0px rgba(0, 0, 0, 0.1))",
          borderRadius: "1rem",
          height: "4rem",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "4rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "570",
              display: "flex",
            }}
          >
            {title}
          </Typography>
          {collabDetail.collab.collab_archive_status === false && (
            <IconButton
              onClick={() => setCreateTaskDialogOpen(true)}
              sx={{
                display: "flex",
              }}
            >
              <AddRoundedIcon
                sx={{
                  display: "flex",
                }}
              />
            </IconButton>
          )}
        </CardContent>
      </Card>
    </>
  );
}
