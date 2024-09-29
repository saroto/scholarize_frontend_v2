/** @format */

"use client";

import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  Popover,
  Button,
  Typography,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { getAllNotification } from "@/app/api/service/notification/getAllNotification";
import { readNotification } from "@/app/api/service/notification/readNotification";
import { useRouter } from "next/navigation";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CircleIcon from "@mui/icons-material/Circle";

interface UserNotifications {
  Notification: Notification;
  IsRead: boolean;
}

interface Notification {
  NotificationID: number;
  NotificationAt: Date;
  NotificationMsg: string;
  UserIDs: number[];
  UserReads: number[];
  Link: string;
  IsCollabInvite: boolean;
  InviteToken: string;
}

export default function NotificationMenu() {
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState<UserNotifications[]>([]);
  const [allRead, setAllRead] = useState(true);
  const router = useRouter();

  const fetchNotifications = async () => {
    const response = await getAllNotification(session?.user?.token ?? "");
    if (response.success) {
      setNotifications(response.data as UserNotifications[]);
      setAllRead(response.allRead);
    } else {
      if (response.error === "Token invalid! Please login again!") {
        router.replace("/auth/sessionexpire");
      }

      console.error("Failed to fetch notifications", response.error);
    }
  };

  const readNotifications = async (notificationID: number) => {
    const response = await readNotification(
      session?.user?.token ?? "",
      notificationID
    );
    if (response.success) {
      fetchNotifications();
    } else {
      if (response.error === "Token invalid! Please login again!") {
        router.replace("/auth/sessionexpire");
      }
      return;
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [session?.user?.token]);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleGoToLink = (link: string) => {
    if (link) {
      router.push(link);
    }
  };

  const handleJoinCollab = (inviteToken: string) => {
    if (inviteToken) {
      router.push(`/joincollab/${inviteToken}`);
    }
  };

  return (
    <div className="flex ">
      <Tooltip title="Notifications" placement="bottom">
        {allRead ? (
          <NotificationsIcon
            onClick={handleClick}
            sx={{
              cursor: "pointer",
              color: `${open ? "red" : "#c5c5c5"}`,
              ":hover": {
                color: "red",
              },
            }}
          />
        ) : (
          <NotificationsActiveIcon
            onClick={handleClick}
            sx={{
              cursor: "pointer",
              color: "red",
            }}
          />
        )}
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiMenu-paper": {
            mt: "0.5rem",
            width: "25rem",
            padding: "0.5rem",
            borderRadius: "1rem",
            maxHeight: "50vh",
          },
        }}
      >
        {notifications?.length === 0 ? (
          <Stack
            sx={{
              flexDirection: "row",
              justifyContent: "center",
              borderRadius: "1rem",
              gap: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textWrap: "wrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "gray",
              }}
            >
              No new notifications
            </Typography>
          </Stack>
        ) : (
          notifications?.map((notification, index) => (
            <div key={index}>
              <MenuItem
                sx={{
                  minHeight: "4rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderRadius: "1rem",
                  gap: 2,
                }}
                disabled={
                  notification.IsRead &&
                  notification.Notification.IsCollabInvite
                }
                onClick={() => {
                  handleClose();
                  readNotifications(notification.Notification.NotificationID);
                  if (!notification.Notification.IsCollabInvite) {
                    handleGoToLink(notification.Notification.Link);
                  } else {
                    handleJoinCollab(notification.Notification.InviteToken);
                  }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    textWrap: "wrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: `${notification.IsRead ? "#777" : "black"}`,
                    maxWidth: "20rem",
                  }}
                >
                  {notification.Notification.NotificationMsg}
                </Typography>

                {notification.IsRead ? (
                  <div className="h-full flex justify-center">
                    <DoneAllIcon
                      sx={{
                        fontSize: "1.25rem",
                        display: "flex",
                        color: "#777",
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-full flex justify-center">
                    <CircleIcon
                      sx={{
                        fontSize: "1rem",
                        display: "flex",
                        color: "red",
                      }}
                    />
                  </div>
                )}
              </MenuItem>
              <Divider
                sx={{
                  display: "flex",
                  m: 0,
                  p: 0,
                }}
              />
            </div>
          ))
        )}
      </Menu>
    </div>
  );
}
