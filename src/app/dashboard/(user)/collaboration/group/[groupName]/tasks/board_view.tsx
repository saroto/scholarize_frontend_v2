/** @format */

"use client";
import { Grid, Stack } from "@mui/material";

import CreateTaskCard from "./create_task_card";
import TaskDetailBoardView from "./task_detail_board_view";
import { TaskData, CollabContainer, CollabMember } from "@/types";

import { useEffect, useState } from "react";

export default function TasksBoardView({
  fetchtaskData,
  updateTaskData,
  createTask,
  deleteTask,
  updatePriority,
  collabDetail,
  collabMember,
}: {
  fetchtaskData: TaskData;
  updateTaskData: () => void;
  createTask: (task_title: string, task_status_id: string) => void;
  deleteTask: (task_id: string) => void;
  updatePriority: (task_id: string) => void;
  collabDetail: CollabContainer;
  collabMember: CollabMember;
}) {
  const [taskData, setTaskData] = useState<TaskData>();

  const handleDeleteTask = (taskId: string) => {
    // Update the state to remove the deleted task
    deleteTask(taskId);
    setTaskData((prevTaskData) => {
      if (!prevTaskData) return prevTaskData;
      return {
        ...prevTaskData,
        tasks: prevTaskData.tasks.map((task) => ({
          ...task,
          task_details: task.task_details.filter(
            (detail) => detail.task_id !== taskId
          ),
        })),
      };
    });
    updateTaskData();
  };

  useEffect(() => {
    setTaskData(fetchtaskData);
  });

  return (
    <Grid container spacing={3}>
      {taskData &&
        taskData?.tasks?.map((task) => (
          <Grid
            item
            xs={12}
            md={2.4}
            lg={2.4}
            xl={2.4}
            key={task.task_status_id}
          >
            <CreateTaskCard
              collabDetail={collabDetail}
              updateTaskData={updateTaskData}
              title={task.task_status_name}
              color={task.task_status_color}
              task_status_id={task.task_status_id}
              createTask={createTask}
            />

            <Stack mt={3} spacing={1}>
              {task &&
                task?.task_details?.map((taskDetail) => {
                  return (
                    <TaskDetailBoardView
                      taskDetail={taskDetail}
                      tasks={task}
                      fetchtaskData={fetchtaskData}
                      key={taskDetail.task_id}
                      handleDelete={handleDeleteTask}
                      updatePriority={updatePriority}
                      updateTaskData={updateTaskData}
                      collabDetail={collabDetail}
                      collabMember={collabMember}
                      taskStatusColor={task.task_status_color}
                      taskStatusName={task.task_status_name}
                    />
                  );
                })}
            </Stack>
          </Grid>
        ))}
    </Grid>
  );
}
