/** @format */

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Link from "next/link";
const developers = [
  {
    name: "Juden Ung",
    role: "Project Manager",
    major: "B.Sc. in Computer Science",
    email: "ung.juden@gmail.com",
    description:
      "As the project manager, I am responsible for the overall planning, execution, and closing of a project. I am also responsible for ensuring that all project objectives and features are met and is completed on time.",
  },
  {
    name: "Jemmy Seang",
    role: "Tech Lead",
    major: "B.Sc. in Management of Information Systems",
    email: "jemmyloveu2@gmail.com",
    description:
      "As the technical lead, I am responsible for choosing the technologies that are required and assisting the development process to ensure the successful completion of the project. I am also responsible for ensuring that the team follows best practices, coding standards, and security. It is my duty to make sure Scholarize works well when moving to production mode.",
  },
  {
    name: "Pitou Noun",
    role: "Data Analyst",
    description:
      "As the data analyst, I am responsible for managing, cleaning, and analyzing data to provide insights and interpretation. I interpret results, draw conclusions, and provide recommendations to future researchers who wish to improve Scholarize.",
    major: "B.Sc. in Computer Science",
    email: "nounpiter@gmail.com",
  },
  {
    name: "Kimsinh Seang",
    role: "Software Engineer",
    description:
      "As the software engineer, I am responsible for developing and maintaining the Scholarize web application. I am also responsible for implementing new features and improving existing ones. Additionally, I ensure that the system meets quality standards by conducting thorough testing.",
    major: "B.Sc. in Computer Science",
    email: "s.kimsinh@gmail.com",
  },
];
export default function Credits({
  open,
  onClose,
}: Readonly<{
  open: boolean;
  onClose: () => void;
}>) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "80%",
          height: "80%",
          borderRadius: "2rem",
        },
        "& .MuiDialogContent-root": {
          padding: "0",
          py: "1.5rem",
        },
        "& .MuiDialogTitle-root": {
          padding: "0",
        },
      }}
      fullWidth
    >
      <DialogTitle display={"flex"} justifyContent={"center"}>
        <Typography padding={"1.5rem"} variant="h4" fontWeight={"550"}>
          About Scholarize Developers
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: "1.5rem",
            top: "1.5rem",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider
        sx={{
          my: 0,
        }}
      />
      <DialogContent>
        {/* Juden */}
        <Card sx={{ display: "flex", boxShadow: "0", px: "1.5rem" }}>
          <CardContent sx={{ display: "flex", gap: "2rem" }}>
            <Box display={"flex"}>
              <Box display={"flex"} my={"auto"}>
                <Avatar
                  alt={developers[0].name}
                  src="/memberPic/1.png"
                  sx={{
                    width: 200,
                    height: 200,
                  }}
                />
              </Box>
            </Box>
            <Box display={"flex"}>
              <Box display={"flex"} my={"auto"} flexDirection={"column"}>
                <Box display={"flex"}>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Box display={"flex"} justifyContent={"center"} gap={2}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        {developers[0].name} &nbsp;
                        <Link
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${developers[0].email}`}
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                            fontSize: "1rem",
                            fontStyle: "italic",
                            height: "auto",
                            display: "flex",
                            fontWeight: "normal",
                          }}
                          target="_blank"
                        >
                          {developers[0].email}
                        </Link>
                      </Typography>
                      <Chip
                        variant="outlined"
                        label={developers[0].role}
                        color="primary"
                        icon={<ManageAccountsIcon />}
                      />

                      <Chip
                        variant="outlined"
                        color="info"
                        label={developers[0].major}
                        icon={<SchoolIcon />}
                        sx={{
                          color: "purple",
                          borderColor: "purple",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography pt={1}>{developers[0].description}</Typography>
                <Typography>
                  <Typography variant="body1" fontWeight="bold" pt={1}>
                    Contribution:
                  </Typography>
                  <List
                    sx={{
                      listStyleType: "disc",
                      pl: "1.5rem",
                      "& .MuiListItem-root": {
                        py: "0",
                      },
                    }}
                  >
                    <ListItem sx={{ display: "list-item" }}>
                      Propose and confirm the topic selection of the research,
                      project scope and team formation
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Document all aspects of the manuscript including
                      Literature reviews and Methodology
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Developed Admin Panel of Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Manage the project timeline, and assign responsibilities
                      of the project following the SDLC model and negotiation
                      within the team
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Assisted data analyst in improving data presentation, data
                      analysis, and data interpretation from user acceptance
                      questionnaire.
                    </ListItem>
                  </List>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Jemmy */}
        <Card sx={{ display: "flex", boxShadow: "0", px: "1.5rem" }}>
          <CardContent sx={{ display: "flex", gap: "2rem" }}>
            <Box display={"flex"}>
              <Box display={"flex"} my={"auto"}>
                <Avatar
                  alt={developers[1].name}
                  src="/memberPic/2.png"
                  sx={{
                    width: 200,
                    height: 200,
                  }}
                />
              </Box>
            </Box>
            <Box display={"flex"}>
              <Box display={"flex"} my={"auto"} flexDirection={"column"}>
                <Box display={"flex"}>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Box display={"flex"} justifyContent={"center"} gap={2}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        {developers[1].name} &nbsp;
                        <Link
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${developers[1].email}`}
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                            fontSize: "1rem",
                            fontStyle: "italic",
                            height: "auto",
                            display: "flex",
                            fontWeight: "normal",
                          }}
                          target="_blank"
                        >
                          {developers[1].email}
                        </Link>
                      </Typography>
                      <Chip
                        variant="outlined"
                        label={developers[1].role}
                        color="primary"
                        icon={<ManageAccountsIcon />}
                      />

                      <Chip
                        variant="outlined"
                        color="info"
                        label={developers[1].major}
                        icon={<SchoolIcon />}
                        sx={{
                          color: "purple",
                          borderColor: "purple",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography pt={1}>{developers[1].description}</Typography>

                <Typography>
                  <Typography variant="body1" fontWeight="bold" pt={1}>
                    Contribution:
                  </Typography>
                  <List
                    sx={{
                      listStyleType: "disc",
                      pl: "1.5rem",
                      "& .MuiListItem-root": {
                        py: "0",
                      },
                    }}
                  >
                    <ListItem sx={{ display: "list-item" }}>
                      Implemented all UI/UX designs of Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Implemented database structure of Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Developed Backend of Scholarize{" "}
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Implemented Laravel File Storage, Meilisearch, SocketIO,
                      and SMTP Mail service for Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Assisted User Panel development
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Deployed Scholarize into Production in ParagonIU
                      On-Premise Server.
                    </ListItem>
                  </List>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Pitou */}
        <Card sx={{ display: "flex", boxShadow: "0", px: "1.5rem" }}>
          <CardContent sx={{ display: "flex", gap: "2rem" }}>
            <Box display={"flex"}>
              <Box display={"flex"} my={"auto"}>
                <Avatar
                  alt={developers[2].name}
                  src="/memberPic/3.png"
                  sx={{
                    width: 200,
                    height: 200,
                  }}
                />
              </Box>
            </Box>
            <Box display={"flex"}>
              <Box display={"flex"} my={"auto"} flexDirection={"column"}>
                <Box display={"flex"}>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Box display={"flex"} justifyContent={"center"} gap={2}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        {developers[2].name} &nbsp;
                        <Link
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${developers[2].email}`}
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                            fontSize: "1rem",
                            fontStyle: "italic",
                            height: "auto",
                            display: "flex",
                            fontWeight: "normal",
                          }}
                          target="_blank"
                        >
                          {developers[2].email}
                        </Link>
                      </Typography>
                      <Chip
                        variant="outlined"
                        label={developers[2].role}
                        color="primary"
                        icon={<ManageAccountsIcon />}
                      />

                      <Chip
                        variant="outlined"
                        color="info"
                        label={developers[2].major}
                        icon={<SchoolIcon />}
                        sx={{
                          color: "purple",
                          borderColor: "purple",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography pt={1}>{developers[2].description}</Typography>

                <Typography>
                  <Typography variant="body1" fontWeight="bold" pt={1}>
                    Contribution:
                  </Typography>
                  <List
                    sx={{
                      listStyleType: "disc",
                      pl: "1.5rem",
                      "& .MuiListItem-root": {
                        py: "0",
                      },
                    }}
                  >
                    <ListItem sx={{ display: "list-item" }}>
                      Designed and conducted user acceptance questionnaire for
                      Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Presented, analyzed, and interpreted data for Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Implemented Scheduling feature using FullcalendarIO for
                      Scholarize on User Panel and assisted in integrating with
                      Backend
                    </ListItem>
                  </List>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Kimsinh */}
        <Card sx={{ display: "flex", boxShadow: "0", px: "1.5rem" }}>
          <CardContent sx={{ display: "flex", gap: "2rem" }}>
            <Box display={"flex"}>
              <Box display={"flex"} my={"auto"}>
                <Avatar
                  alt={developers[3].name}
                  src="/memberPic/4.png"
                  sx={{
                    width: 200,
                    height: 200,
                  }}
                />
              </Box>
            </Box>
            <Box display={"flex"}>
              <Box display={"flex"} my={"auto"} flexDirection={"column"}>
                <Box display={"flex"}>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Box display={"flex"} justifyContent={"center"} gap={2}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        {developers[3].name} &nbsp;
                        <Link
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${developers[3].email}`}
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                            fontSize: "1rem",
                            fontStyle: "italic",
                            height: "auto",
                            display: "flex",
                            fontWeight: "normal",
                          }}
                          target="_blank"
                        >
                          {developers[3].email}
                        </Link>
                      </Typography>
                      <Chip
                        variant="outlined"
                        label={developers[3].role}
                        color="primary"
                        icon={<ManageAccountsIcon />}
                      />

                      <Chip
                        variant="outlined"
                        color="info"
                        label={developers[3].major}
                        icon={<SchoolIcon />}
                        sx={{
                          color: "purple",
                          borderColor: "purple",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography pt={1}>{developers[3].description}</Typography>

                <Typography>
                  <Typography variant="body1" fontWeight="bold" pt={1}>
                    Contribution:
                  </Typography>
                  <List
                    sx={{
                      listStyleType: "disc",
                      pl: "1.5rem",
                      "& .MuiListItem-root": {
                        py: "0",
                      },
                    }}
                  >
                    <ListItem sx={{ display: "list-item" }}>
                      Initiated the development of User Panel for Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Integrated User Panel and other systems of Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Developed Backend of Scholarize
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Developed Research Repository system with the usage of
                      TinyMCE rich text editor, and Collaboration features
                      intergrated with other systems
                    </ListItem>
                    <ListItem sx={{ display: "list-item" }}>
                      Conducted web application testings using JMeters and other
                      tools to ensure the system's quality
                    </ListItem>
                  </List>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Divider
          sx={{
            my: 0,
          }}
        />
        <DialogActions
          sx={{
            py: "1.5rem",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Typography variant="h6" textAlign="center" fontStyle="italic">
              For more information, please contact us via:
            </Typography>
            <Box display={"flex"} padding={"1.5rem"} gap={3}>
              <Tooltip title="Linktree" placement="top">
                <Link href="https://linktr.ee/scholarize" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50" // Set a specific width
                    height="50" // Set a specific height
                    viewBox="0 0 417 512.238"
                    fill="none" // Ensure fill is set to "none" for the SVG, and use "fill" for paths
                  >
                    <path
                      fill="#43E660"
                      d="M171.274 344.942h74.09v167.296h-74.09V344.942zM0 173.468h126.068l-89.622-85.44 49.591-50.985 85.439 87.829V0h74.086v124.872L331 37.243l49.552 50.785-89.58 85.24H417v70.502H290.252l90.183 87.629L331 381.192 208.519 258.11 86.037 381.192l-49.591-49.591 90.218-87.631H0v-70.502z"
                    />
                  </svg>
                </Link>
              </Tooltip>

              <Tooltip title="Google Site" placement="top">
                <Link
                  href="https://sites.google.com/paragoniu.edu.kh/scholarize/home"
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="50"
                    height="50"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#3949ab"
                      d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l4,6l6,4v29C40,43.657,38.657,45,37,45z"
                    ></path>
                    <path fill="#1a237e" d="M40,13H30V3L40,13z"></path>
                    <path
                      fill="#fafafa"
                      d="M15,19v3h18v-3H15z M30,25v8h3v-8H30z M15,33h12v-8H15V33z"
                    ></path>
                  </svg>
                </Link>
              </Tooltip>
            </Box>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
