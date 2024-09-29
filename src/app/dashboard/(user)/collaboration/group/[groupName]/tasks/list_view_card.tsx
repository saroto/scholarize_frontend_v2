"use client";
import ExpandMoreRotate from "@/components/ui/icon/expand_more_rotate";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TaskDetailListView from "./task_detail_list_view";
import { CollabContainer, CollabMember, Task, TaskData } from "@/types";
import ScrollTop from "@/components/scroll-to-top";
import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
export default function TaskListViewCard({
  title,
  color,
  updateTaskData,
  task,
  fetchtaskData,
  createTask,
  deleteTask,
  updatePriority,
  collabDetail,
  collabMember,
}: {
  title: string;
  color: string;
  task: Task;
  fetchtaskData: TaskData;
  updateTaskData: () => void;
  createTask: (task_title: string, task_status_id: string) => void;
  deleteTask: (task_id: string) => void;
  updatePriority: (task_id: string) => void;
  collabDetail: CollabContainer;
  collabMember: CollabMember;
}) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const [taskData, setTaskData] = useState<Task>();
  const [taskTitle, setTaskTitle] = useState<string>("");

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleCreateTask = (event: React.FormEvent) => {
    event?.preventDefault();
    if (taskTitle) {
      createTask(taskTitle, task.task_status_id);
      updateTaskData();
      setTaskTitle("");
    }
  };
  const handleDeleteTask = (taskId: string) => {
    // Update the state to remove the deleted task
    deleteTask(taskId);
    setTaskData((prevTaskData) => {
      if (!prevTaskData) return prevTaskData;
      return {
        ...prevTaskData,
        task_details: prevTaskData.task_details.filter(
          (detail) => detail.task_id !== taskId
        ),
      };
    });
    updateTaskData();
  };

  useEffect(() => {
    setTaskData(task);
  });

  return (
    <>
      <div id="back-to-top-anchor" />
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <Card
        sx={{
          borderLeft: `1.25rem solid ${color ?? "#C1C1C1"}`,
          m: 0,
          width: "100%",
          borderRadius: "1rem",
        }}
      >
        <CardContent
          sx={{
            p: 0,
            "&:last-child": {
              paddingBottom: 0,
            },
            width: "100%",
          }}
        >
          <Stack
            sx={{ p: "0.5rem" }}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <Box mr={1}>
                <ExpandMoreRotate
                  title=""
                  expand={expanded}
                  onClick={() => setExpanded(!expanded)}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  display: "flex",
                }}
              >
                {title}
              </Typography>
            </Stack>
          </Stack>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider />
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{ px: "1rem", width: "100%" }}
            >
              <Box sx={{ opacity: 0 }}>
                <ExpandMoreRotate
                  title=""
                  expand={expanded}
                  onClick={() => setExpanded(!expanded)}
                />
              </Box>
              <Stack width={"100%"}>
                {/* TODO: loop tasks with actual data */}
                {taskData &&
                  taskData.task_details.map((eachtask) => {
                    return (
                      <Box key={eachtask.task_id}>
                        <TaskDetailListView
                          taskDetail={eachtask}
                          tasks={task}
                          handleDelete={handleDeleteTask}
                          updatePriority={updatePriority}
                          collabDetail={collabDetail}
                          collabMember={collabMember}
                          fetchtaskData={fetchtaskData}
                          updateTaskData={updateTaskData}
                        />
                        <Divider />
                      </Box>
                    );
                  })}
                {collabDetail.collab.collab_archive_status === false && (
                  <Stack
                    my={2}
                    direction={"row"}
                    gap={1}
                    alignItems={"center"}
                    width={"100%"}
                  >
                    <AddRoundedIcon
                      onClick={handleCreateTask}
                      sx={{
                        display: "flex",
                        cursor: "pointer",
                        borderRadius: "50%",
                        color: "#cfcfcf",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    />

                    <form onSubmit={handleCreateTask} className="w-full">
                      <TextField
                        fullWidth
                        id="task-title"
                        variant="standard"
                        placeholder="Add task"
                        value={taskTitle}
                        onChange={handleChangeInput}
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: "0.875rem",
                            display: "flex",
                            width: "100%",
                          },
                        }}
                      />
                    </form>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Collapse>
        </CardContent>
      </Card>
    </>
  );
}
