/** @format */

"use client";
import React, { use, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  NoSsr,
  Stack,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout } from "@mui/icons-material";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Logouts } from "@/app/api/service/logout";
import NotificationMenu from "./notification";
import Credits from "@/components/dialogs/credited-dialog";
import InfoIcon from "@mui/icons-material/Info";
const DrawerWidth = 270;

// add margin and transition when opening the drawer
// refer to this docs: https://mui.com/material-ui/react-drawer/#persistent-drawer
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  marginTop: theme.spacing(8),
  // flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${DrawerWidth}px`,
  ...(!open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default function DashboardNavbar({
  children,
  leftSideBar,
  openDrawer = true,
  onClick,
}: Readonly<{
  children: React.ReactNode;
  leftSideBar: React.ReactNode;
  openDrawer?: boolean;
  onClick?: () => void;
}>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawer, setDrawer] = useState<boolean>(openDrawer);
  const { data: session } = useSession();
  const [selectedNav, setSelectedNav] = useState<string>("");

  const [openCredits, setOpenCredits] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/dashboard/repository")) {
      setSelectedNav("repository");
    } else if (
      window.location.pathname.startsWith("/dashboard/collaboration")
    ) {
      setSelectedNav("collaboration");
    } else if (window.location.pathname.startsWith("/dashboard/schedule")) {
      setSelectedNav("schedule");
    } else {
      setSelectedNav("");
    }
  }, [selectedNav]);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    // set html dom to the state
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setDrawer((prevDrawer) => (prevDrawer = !prevDrawer));
    onClick && onClick();
  };

  const handleOpenCredits = () => {
    setOpenCredits(true);
  };
  const handleCloseCredits = () => {
    setOpenCredits(false);
  };
  const handleSignOut = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (session) {
      try {
        await Logouts(session);
        signOut({ callbackUrl: "/" });
      } catch (error) {
        console.error("Failed to complete logout process", error);
      }
    }
  };

  function getContrastColor(bgColor: string) {
    const color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16); // hexToR
    const g = parseInt(color.substring(2, 4), 16); // hexToG
    const b = parseInt(color.substring(4, 6), 16); // hexToB
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "black" : "white";
  }

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" color="inherit">
          <Toolbar>
            <Stack sx={{ flexGrow: 1 }} justifyContent={"center"}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                {/* Start section */}
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <IconButton
                      color="inherit"
                      onClick={toggleDrawer}
                      edge="start"
                    >
                      <MenuIcon />
                    </IconButton>
                  </Stack>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                    onClick={() => {
                      window.location.href =
                        "/dashboard/repository/research-library";
                    }}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        borderRadius: "1rem",
                      },
                      padding: "0.5rem",
                    }}
                  >
                    <img
                      src="/logo.png"
                      alt="Scholarize"
                      width={30}
                      height={30}
                    />

                    <Typography
                      variant="h5"
                      component="h5"
                      sx={{
                        color: "black",
                        fontWeight: "500",
                        fontFamily: "poppins, -apple-system",
                      }}
                    >
                      Scholarize
                    </Typography>
                  </Stack>
                  <Stack alignItems={"center"} fontWeight={"bold"}>
                    {session?.user?.role.RoleName === "User" && (
                      <Chip
                        label={session.user.role.RoleName}
                        sx={{ backgroundColor: session.user.role.RoleColor }}
                      />
                    )}
                    {session?.user?.role.RoleName === "HOD" && (
                      <Chip
                        label={session.user.role.RoleName}
                        sx={{ backgroundColor: session.user.role.RoleColor }}
                      />
                    )}
                    {session?.user?.role.RoleName === "Advisor" && (
                      <Chip
                        label={session.user.role.RoleName}
                        sx={{ backgroundColor: session.user.role.RoleColor }}
                      />
                    )}
                  </Stack>
                  {session?.user?.department && (
                    <>
                      {session?.user?.department.DepartmentName.length > 0 && (
                        <Tooltip
                          title={
                            "Department: " +
                            session.user.department.DepartmentName
                          }
                        >
                          <Stack alignItems={"center"} fontWeight={"bold"}>
                            <Chip
                              label={session.user.department.DepartmentTag}
                              sx={{
                                backgroundColor:
                                  session.user.department.DepartmentColor,
                                color: getContrastColor(
                                  session.user.department.DepartmentColor
                                ),
                              }}
                            />
                          </Stack>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Stack>

                {/* Link section */}
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                  <Link href={"/dashboard/repository/research-library"}>
                    <Button
                      sx={{
                        backgroundColor:
                          selectedNav === "repository"
                            ? "#CFCFCF"
                            : "transparent",
                        fontWeight:
                          selectedNav === "repository" ? "550" : "500",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        ":hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      Repository
                    </Button>
                  </Link>
                  <Link href={"/dashboard/collaboration/groups"}>
                    <Button
                      sx={{
                        backgroundColor:
                          selectedNav === "collaboration"
                            ? "#CFCFCF"
                            : "transparent",
                        fontWeight:
                          selectedNav === "collaboration" ? "550" : "500",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        ":hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      Collaboration
                    </Button>
                  </Link>
                  <Link href={"/dashboard/schedule"}>
                    <Button
                      sx={{
                        backgroundColor:
                          selectedNav === "schedule"
                            ? "#CFCFCF"
                            : "transparent",
                        fontWeight: selectedNav === "schedule" ? "550" : "500",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        ":hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      Schedule
                    </Button>
                  </Link>
                </Stack>

                {/* User section */}
                <Stack direction={"row"} alignItems={"center"} gap={2}>
                  <NotificationMenu />

                  <Tooltip title="About Developers">
                    <IconButton onClick={handleOpenCredits}>
                      <InfoIcon
                        sx={{
                          // color: "red",
                          fontSize: "1rem",
                          ":hover": {
                            cursor: "pointer",
                            // color: "red",
                          },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Credits open={openCredits} onClose={handleCloseCredits} />
                  <Typography
                    variant="h6"
                    component="h6"
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      marginRight: "0.5rem",
                    }}
                  >
                    {session?.user?.name ?? <small>Loading...</small>}
                  </Typography>
                  <Avatar
                    onClick={openMenu}
                    alt={session?.user.name}
                    src={session?.user.image}
                    sx={{
                      width: 42,
                      height: 42,
                      "&:hover": {
                        cursor: "pointer",
                        filter: "contrast(0.8)",
                      },
                    }}
                  />
                  <Menu
                    sx={{ width: "100%" }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                  >
                    <MenuItem
                      onClick={closeMenu}
                      selected={false}
                      autoFocus={false}
                      disableGutters={true}
                      sx={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: "1",
                        padding: "0",
                        "&.Mui-focusVisible": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <form className="m-0 p-0 flex" onSubmit={handleSignOut}>
                        <Button
                          type="submit"
                          sx={{
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            ":hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.2)",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Logout fontSize="small" color="warning" />
                          </ListItemIcon>
                          <Typography
                            fontSize={"medium"}
                            noWrap
                            color={"warning.main"}
                            sx={{
                              fontWeight: "500",
                              textTransform: "capitalize",
                            }}
                          >
                            Logout
                          </Typography>
                        </Button>
                      </form>
                    </MenuItem>
                  </Menu>
                </Stack>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        anchor="left"
        open={drawer}
        variant="persistent"
        PaperProps={{
          sx(theme) {
            return {
              position: "fixed",
              // zIndex below appBar by 1
              zIndex: 1099,
              width: DrawerWidth,
              top: theme.spacing(8), // push content down to fix scrollbar position
              height: `calc(100% - ${theme.spacing(8)})`, // subtract appbar height
            };
          },
        }}
      >
        {leftSideBar}
      </Drawer>
      <Main open={drawer}>{children}</Main>
    </Box>
  );
}
