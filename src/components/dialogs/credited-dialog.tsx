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
    roles: ["Project Manager"],
    major: "B.Sc. in Computer Science",
    email: "ung.juden@gmail.com",
    description:
      "As the project manager, I am responsible for the overall planning, execution, and closing of a project. I am also responsible for ensuring that all project objectives and features are met and is completed on time.",
    contributions: {
      "Contribution to Scholarize": [
        "Propose and confirm the topic selection of the research, project scope and team formation",
        "Document all aspects of the manuscript including Literature reviews and Methodology",
        "Developed Admin Panel of Scholarize",
        "Manage the project timeline, and assign responsibilities of the project following the SDLC model and negotiation within the team",
        "Assisted data analyst in improving data presentation, data analysis, and data interpretation from user acceptance questionnaire.",
      ],
    },
  },
  {
    name: "Jemmy Seang",
    roles: ["Tech Lead"],
    major: "B.Sc. in Management of Information Systems",
    email: "jemmyloveu2@gmail.com",
    description:
      "As the technical lead, I am responsible for choosing the technologies that are required and assisting the development process to ensure the successful completion of the project. I am also responsible for ensuring that the team follows best practices, coding standards, and security. It is my duty to make sure Scholarize works well when moving to production mode.",
    contributions: {
      "Contribution to Scholarize": [
        "Implemented all UI/UX designs of Scholarize",
        "Implemented database structure of Scholarize",
        "Developed Backend of Scholarize",
        "Implemented Laravel File Storage, Meilisearch, SocketIO, and SMTP Mail service for Scholarize",
        "Assisted User Panel development",
        "Deployed Scholarize into Production in ParagonIU On-Premise Server.",
      ],
    },
  },
  {
    name: "Pitou Noun",
    roles: ["Data Analyst"],
    description:
      "As the data analyst, I am responsible for managing, cleaning, and analyzing data to provide insights and interpretation. I interpret results, draw conclusions, and provide recommendations to future researchers who wish to improve Scholarize.",
    major: "B.Sc. in Computer Science",
    email: "nounpiter@gmail.com",
    contributions: {
      "Contribution to Scholarize": [
        "Designed and conducted user acceptance questionnaire for Scholarize",
        "Presented, analyzed, and interpreted data for Scholarize",
        "Implemented Scheduling feature using FullcalendarIO for Scholarize on User Panel and assisted in integrating with Backend",
      ],
    },
  },
  {
    name: "Kimsinh Seang",
    roles: [
      "Software Engineer for Scholarize",
      "Tech Lead for Scholarize 2.0 (SPaRCS-AIM)",
    ],
    description:
      "As a software engineer for Scholarize, I am responsible for developing and maintaining the web application, implementing new features, and ensuring quality standards through thorough testing. As the tech lead for SPaRCS-AIM, I oversee the technical architecture and lead the development of advanced AI-powered features, including semantic search integration with Generative AI models and scalable system infrastructure.",
    major: "B.Sc. in Computer Science",
    email: "s.kimsinh@gmail.com",
    contributions: {
      "Contribution to Scholarize": [
        "Initiated the development of User Panel for Scholarize",
        "Integrated User Panel and other systems of Scholarize",
        "Developed Backend of Scholarize",
        "Developed Research Repository system with the usage of TinyMCE rich text editor, and Collaboration features intergrated with other systems",
        "Conducted web application testings using JMeters and other tools to ensure the system's quality",
      ],
      "Contribution to SPaRCS-AIM": [
        "Developed the semantic search service by integrating with Generative AI models",
        "Implemented queue service using RabbitMQ for SPaRCS-AIM",
        "Implemented database structure for SPaRCS-AIM",
        "Update Scholarize backend to support SPaRCS-AIM",
        "Update File Service to support SPaRCS-AIM",
        "Deployed SPaRCS-AIM into Production in ParagonIU On-Premise Server",
      ],
    },
  },
  {
    name: "Sovannsak Yours",
    roles: ["Project Manager for Scholarize 2.0 (SPaRCS-AIM)"],
    description:
      "As the project manager, I am responsible for the overall planning, execution, and closing of a project. I am also responsible for ensuring that all project objectives and features are met and is completed on time.",
    major: "B.Sc. in Computer Science",
    email: "sovannsakyoursafk@gmail.com",
    contributions: {
      "Contribution to SPaRCS-AIM": [
        "Documented all aspects of the manuscript including Literature reviews and Methodology",
        "Proposed and confirmed the topic selection of the research, project scope and team formation",
        "Managed the project timeline, and assigned responsibilities of the project following the SDLC model and negotiation within the team",
        "Assisted data analyst in improving data presentation, data analysis, and data interpretation from user acceptance questionnaire",
        "Improved the repository User Interface of Scholarize",
        "Implemented PDF Viewer for Scholarize and Chat Interface",
        "Enhanced user experience through interface optimization and feature development",
      ],
    },
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
        {developers.map((developer, index) => (
          <Card
            key={index}
            sx={{ display: "flex", boxShadow: "0", px: "1.5rem" }}
          >
            <CardContent
              sx={{
                display: "flex",
                gap: "2rem",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box
                display={"flex"}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Avatar
                  alt={developer.name}
                  src={`/memberPic/${index + 1}.png`}
                  sx={{
                    width: { xs: 150, md: 200 },
                    height: { xs: 150, md: 200 },
                  }}
                />
              </Box>
              <Box display={"flex"} flex={1}>
                <Box
                  display={"flex"}
                  my={"auto"}
                  flexDirection={"column"}
                  width="100%"
                >
                  <Box display={"flex"}>
                    <Box display={"flex"} flexDirection={"column"}>
                      <Box display={"flex"} flexDirection={"column"} gap={1}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            alignItems: "center",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          {developer.name}
                          <Link
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${developer.email}`}
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
                            {developer.email}
                          </Link>
                        </Typography>

                        {/* Responsive chip container */}
                        <Box display={"flex"} flexWrap={"wrap"} gap={1}>
                          {/* Handle both single role and multiple roles */}
                          {Array.isArray(developer.roles) ? (
                            developer.roles.map((role, roleIndex) => (
                              <Chip
                                key={roleIndex}
                                variant="outlined"
                                label={role}
                                color="primary"
                                icon={<ManageAccountsIcon />}
                                size="small"
                              />
                            ))
                          ) : (
                            <Chip
                              variant="outlined"
                              label={developer.roles}
                              color="primary"
                              icon={<ManageAccountsIcon />}
                              size="small"
                            />
                          )}

                          <Chip
                            variant="outlined"
                            color="info"
                            label={developer.major}
                            icon={<SchoolIcon />}
                            size="small"
                            sx={{
                              color: "purple",
                              borderColor: "purple",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Typography pt={1}>{developer.description}</Typography>

                  {/* Only show contribution section if developer has contributions */}
                  {developer.contributions && (
                    <Box>
                      {Object.entries(developer.contributions).map(
                        ([section, items], sectionIndex) => (
                          <Box key={sectionIndex} mb={1}>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              pt={1}
                            >
                              {section}:
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
                              {items.map(
                                (contribution: any, contribIndex: any) => (
                                  <ListItem
                                    key={contribIndex}
                                    sx={{ display: "list-item" }}
                                  >
                                    {contribution}
                                  </ListItem>
                                )
                              )}
                            </List>
                          </Box>
                        )
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

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
                    width="50"
                    height="50"
                    viewBox="0 0 417 512.238"
                    fill="none"
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
