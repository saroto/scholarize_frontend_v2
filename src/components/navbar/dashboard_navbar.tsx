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
  Container,
  useMediaQuery,
  useTheme,
  Popper,
  Fade,
  Paper,
  PopperPlacementType,
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
import ResearchRightSideBar from "@/components/sidebar/research_right_sidebar";
const DrawerWidth = 270;
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import PublishIcon from "@mui/icons-material/Publish";
import GetAppIcon from "@mui/icons-material/GetApp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// add margin and transition when opening the drawer
// refer to this docs: https://mui.com/material-ui/react-drawer/#persistent-drawer
// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
//   open?: boolean;
// }>(({ theme, open }) => ({
//   marginTop: theme.spacing(8),
//   // flexGrow: 1,
//   transition: theme.transitions.create("margin", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   marginLeft: `${DrawerWidth}px`,
//   marginRight: `${DrawerWidth}px`,
//   ...(!open && {
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//     marginRight: 0,
//   }),
// }));
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  // marginTop: theme.spacing(8), // Keeps space for the AppBar
  paddingTop: theme.spacing(8),

  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  // Default for larger screens
  marginLeft:
    open &&
    window.location.pathname === "/dashboard/repository/research-library"
      ? `${DrawerWidth}px`
      : 0,
  // marginRight: open ? `${DrawerWidth}px` : 0,

  [theme.breakpoints.down("sm")]: {
    // On small screens (xs, sm), always remove margins
    marginLeft: 0,
    marginRight: 0,
  },

  ...(!open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  if (isSmallScreen) {
    openDrawer = false;
  }
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawer, setDrawer] = useState<boolean>(openDrawer);
  const { data: session } = useSession();
  const [selectedNav, setSelectedNav] = useState<string>("");
  const [openCredits, setOpenCredits] = useState(false);

  const [anchorEls, setAnchorEls] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<PopperPlacementType>();

  const handleClickOpenPopper =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (session?.user?.role?.RoleName != "HOD") {
        return;
      } else {
        setAnchorEls(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
      }
    };

  const pathname = usePathname();
  const isRepository = pathname === "/dashboard/repository/research-library";
  const isCollaboration = pathname?.startsWith("/dashboard/collaboration");
  const isSchedule = pathname?.startsWith("/dashboard/schedule");

  useEffect(() => {
    if (pathname === "/dashboard/repository/my-publications") {
      setSelectedNav("my-publications");
    } else if (pathname?.startsWith("/dashboard/repository/research-library")) {
      setSelectedNav("repository");
    } else if (pathname?.startsWith("/dashboard/collaboration")) {
      setSelectedNav("collaboration");
    } else if (pathname?.startsWith("/dashboard/schedule")) {
      setSelectedNav("schedule");
    } else {
      setSelectedNav("");
    }
  }, [pathname]);

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

  console.log("session", session);

  useEffect(() => {
    if (!isRepository && !isSmallScreen) {
      setDrawer(false);
    }
  }, [isRepository]);

  return (
    <Box sx={{ flexGrow: 1, overflow: "hidden", height: "100%" }}>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Stack sx={{ flexGrow: 1 }} justifyContent={"center"}>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Start section */}

              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                {(isRepository || (isRepository && isSmallScreen)) && (
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <IconButton
                      color="inherit"
                      onClick={toggleDrawer}
                      edge="start"
                    >
                      <MenuIcon />
                    </IconButton>
                  </Stack>
                )}

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
                {!isSmallScreen && (
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
                )}
                {/* <Stack alignItems={"center"} fontWeight={"bold"}>
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
                </Stack> */}
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
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                sx={{
                  display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
                }}
              >
                <Link href={"/dashboard/repository/research-library"}>
                  <Button
                    sx={{
                      backgroundColor:
                        selectedNav === "repository"
                          ? "#CFCFCF"
                          : "transparent",
                      fontWeight: selectedNav === "repository" ? "550" : "500",
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      ":hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        textTransform: "none",
                        color: "text.primary",
                      }}
                    >
                      {" "}
                      Repository
                    </Typography>
                  </Button>
                </Link>
                <Link
                  href={
                    session?.user?.role.RoleName === "HOD"
                      ? "/dashboard/repository/hod-submission"
                      : "/dashboard/repository/my-publications"
                  }
                >
                  <Button
                    onClick={handleClickOpenPopper("bottom")}
                    onMouseEnter={handleClickOpenPopper("bottom")}
                    onMouseLeave={() => {
                      setOpen(false);
                      setAnchorEls(null);
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor:
                        selectedNav === "my-publications"
                          ? "#CFCFCF"
                          : "transparent",
                      fontWeight:
                        selectedNav === "my-publications" ? "550" : "500",
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      ":hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        textTransform: "none",
                        color: "text.primary",
                      }}
                    >
                      {" "}
                      {session?.user?.role?.RoleName === "HOD"
                        ? "Submissions"
                        : "My Publications"}
                    </Typography>
                    {session?.user.role.RoleName === "HOD" &&
                      (open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      ))}
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
                    <Typography
                      variant="h5"
                      sx={{
                        textTransform: "none",
                        color: "text.primary",
                      }}
                    >
                      {" "}
                      Collaboration
                    </Typography>
                  </Button>
                </Link>
                <Link href={"/dashboard/schedule"}>
                  <Button
                    sx={{
                      backgroundColor:
                        selectedNav === "schedule" ? "#CFCFCF" : "transparent",
                      fontWeight: selectedNav === "schedule" ? "550" : "500",
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      ":hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        textTransform: "none",
                        color: "text.primary",
                      }}
                    >
                      {" "}
                      Schedule
                    </Typography>
                  </Button>
                </Link>
              </Stack>

              {/* User section */}
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <NotificationMenu />

                <Tooltip
                  title="About Developers"
                  sx={{
                    display: {
                      xs: "none",
                      sm: "none",
                      md: "flex",
                      lg: "flex",
                      xl: "flex",
                    },
                  }}
                >
                  <IconButton onClick={handleOpenCredits}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {!isSmallScreen && (
                  <Credits open={openCredits} onClose={handleCloseCredits} />
                )}
                {!isLargeScreen && (
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
                )}

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
      {/* </Box> */}

      {!isSmallScreen && isRepository && (
        <Drawer
          anchor="left"
          open={drawer}
          variant="persistent"
          PaperProps={{
            sx(theme) {
              return {
                position: "fixed",
                backgroundColor: "transparent",
                border: 0,
                marginLeft: "20px",
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
      )}

      {/* mobile drawer */}
      {isSmallScreen && (
        <Drawer
          anchor={"top"}
          open={drawer}
          variant={"temporary"}
          onClose={() => setDrawer(false)}
          PaperProps={{
            sx(theme) {
              return {
                position: "absolute",
                backgroundColor: "secondary.main",
                boxShadow: 0,
                border: 0,
                zIndex: 1099,
                width: "100%",
                left: "0px",
                top: 0,
                height: isSmallScreen
                  ? "auto"
                  : `calc(100% - ${theme.spacing(8)})`,
              };
            },
          }}
        >
          {leftSideBar}
        </Drawer>
      )}

      {/* right sidebar when not in small screen */}
      {/* {!isSmallScreen && isRepository && (
        <Drawer
          anchor="right"
          open={drawer}
          variant="persistent"
          PaperProps={{
            sx(theme) {
              return {
                position: "fixed",
                backgroundColor: "transparent",
                boxShadow: 0,
                border: 0,
                zIndex: 1099,
                width: `calc(${DrawerWidth} - 100px)`,
                right: "100px",
                top: theme.spacing(8),
                height: `calc(100% - ${theme.spacing(8)})`,
              };
            },
          }}
        >
          <ResearchRightSideBar />
        </Drawer>
      )} */}

      <Popper
        // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
        sx={{ zIndex: 1200 }}
        open={open}
        anchorEl={anchorEls}
        placement={placement}
        transition
        onMouseEnter={() => {
          setOpen(true);
          setAnchorEls(anchorEls);
        }}
        onMouseLeave={() => {
          setOpen(false);
          setAnchorEls(null);
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <MenuItem
                onClick={() => {
                  router.push("/dashboard/repository/my-publications");
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: "10px",
                  paddding: "10px",
                }}
              >
                <PublishIcon />
                <Typography variant="h5">My Publication</Typography>
              </MenuItem>
              {session?.user?.role.RoleName === "HOD" && (
                <MenuItem
                  onClick={() => {
                    router.push("/dashboard/repository/hod-submission");
                  }}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    gap: "10px",
                    paddding: "10px",
                  }}
                >
                  <GetAppIcon />
                  <Typography variant="h5">Submission</Typography>
                </MenuItem>
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
      <Main
        open={drawer}
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100%",
          paddingLeft: {
            xs: "20px",
            sm: "20px",
            md: drawer ? "40px" : "20px",
            lg: drawer ? "40px" : "20px",
            xl: drawer ? "40px" : "20px",
          },

          // paddingLeft: "40px",
          paddingRight: "20px",
        }}
      >
        {children}
      </Main>
    </Box>
  );
}
