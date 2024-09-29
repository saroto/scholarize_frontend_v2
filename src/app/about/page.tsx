/** @format */

import {
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Box,
  Button,
  Divider,
} from "@mui/material";
import type { Metadata } from "next";
import juden from "../../../public/memberPic/1.png";
import kimsinh from "../../../public/memberPic/4.png";
import pitou from "../../../public/memberPic/3.png";
import jemmy from "../../../public/memberPic/2.png";
import Logo from "../../../public/logo.png";
import Navbar from "../(landing)/navbar";
import Footer from "@/components/footer/footer";
export const metadata: Metadata = {
  title: "Scholarize - About",
};

const developers = [
  {
    name: "Juden Ung",
    role: "Project Manager",
    image: juden,
    major: "B.Sc. in Computer Science",
    email: "ung.juden@gmail.com",
  },
  {
    name: "Jemmy Seang",
    role: "Tech Lead",
    image: jemmy,
    major: "B.Sc. in Management of Information Systems",
    email: "jemmyloveu2@gmail.com",
  },
  {
    name: "Pitou Noun",
    role: "Data Analyst",
    description: "Description of Developer 2",
    image: pitou,
    major: "B.Sc. in Computer Science",
    email: "nounpiter@gmail.com",
  },
  {
    name: "Kimsinh Seang",
    role: "Software Engineer",
    image: kimsinh,
    major: "B.Sc. in Computer Science",
    email: "s.kimsinh@gmail.com",
  },
];

const features = [
  {
    title: "Repository",
    description:
      "A digital library that stores research papers published by the students of Paragon International University.",
    image: "/features/1.png",
  },
  {
    title: "Task Management",
    description:
      "Managing lists of tasks, including creating, editing, and deleting, is streamlined through our platform. Scholarize helps students and advisors organize, assign, and track various project tasks efficiently. Users can set priorities, update progress, and communicate effortlessly, ensuring smooth and effective collaboration for all involved.",
    image: "/features/2.png",
  },
  {
    title: "File Storage",
    description:
      "An organized digital storage where students and advisors can store and manage their research documents. This feature ensures that all files related to the research process, including documents and drafts, are easily accessible within the platform.",
    image: "/features/3.png",
  },
  {
    title: "Scheduling",
    description:
      "A shared calendar helps students and advisors to book meetings without any conflicts. This tool visually displays everyone's schedules, making it easy to identify suitable meeting times and manage project timelines effectively.",
    image: "/features/4.png",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="p-4 pt-[5.125rem]">
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            margin: "auto",
            display: "flex",
          }}
        >
          <Box
            sx={{
              margin: "auto",
              p: 4,
              backgroundColor: "secondary.main",
              borderRadius: "12px",
              boxShadow: 2,
            }}
          >
            <Box sx={{ justifyContent: "center", display: "flex", mb: 2 }}>
              <img src={Logo.src} alt="Scholarize" width={100} height={100} />
            </Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "600" }}
              align="center"
            >
              About Scholarize
            </Typography>
            <Typography
              variant="body1"
              sx={{ paddingBlock: "10px", color: "text.secondary" }}
            >
              <b>Scholarize</b> is a web application platform designed to
              facilitate academic research and collaboration. Scholarize’s
              research repository allows users to effortlessly search, read, and
              download research papers in PDF format. In addition, Scholarize's
              innovative research collaboration dashboard enables advisors to
              create groups, invite students, and utilize advanced tools for
              task management, file storage, and scheduling. By making it easier
              for researchers to find references and for advisors to manage
              multiple collaborations, Scholarize streamlines academic research,
              making it more efficient and productive.
            </Typography>
            {/* <Box sx={{ paddingBlock: "20px" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "600" }}
                align="center"
              >
                How does Scholarize work?
              </Typography>
              <Typography
                variant="body1"
                sx={{ paddingBlock: "10px", color: "text.secondary" }}
              >
                The Bit-Pi system works by allowing instructors to upload their
                materials, so that students can study those materials while at
                the same time create discussion threads to discuss or ask
                questions about the material among the students, lecturers,
                teaching assistants, and other peer support such as peer tutor.
              </Typography>
            </Box> */}
            <Box sx={{ paddingBlock: "20px" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "600" }}
                align="center"
                // color="#2F2F85"
                color={"#000"}
              >
                Key Features of Scholarize
              </Typography>
              <Divider
                sx={{
                  mt: 1,
                  mb: 3,
                }}
              />

              <Grid container spacing={2}>
                {features?.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <img
                        src={feature.image}
                        alt="Repository"
                        className="w-full h-full"
                      />
                      <CardContent sx={{ height: "100%" }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {/* <Typography
                variant="body1"
                sx={{
                  paddingBlock: "10px",
                  color: "text.secondary",
                  fontWeight: "bold",
                }}
              >
                The Scholarize system can benefit instructors and students in
                several ways:
              </Typography>
              <Typography
                variant="body1"
                sx={{ paddingBlock: "10px", color: "text.secondary" }}
              >
                1. Reduce the number of emails and repeat questions to
                instructors and the teaching team
              </Typography>
              <Typography
                variant="body1"
                sx={{ paddingBlock: "10px", color: "text.secondary" }}
              >
                2. Asynchronous access allows more students to participate in
                discussions.
              </Typography>
              <Typography
                variant="body1"
                sx={{ paddingBlock: "10px", color: "text.secondary" }}
              >
                3. Gives students multiple ways to express ideas with equations,
                code snippets and more.
              </Typography>
              <Typography
                variant="body1"
                sx={{ paddingBlock: "10px", color: "text.secondary" }}
              >
                4. Allows students to discuss, and ask questions on the specific
                part of the material or resource.
              </Typography>
              <Typography
                variant="body1"
                sx={{ paddingBlock: "10px", color: "text.secondary" }}
              >
                5. Enhances learning experience for students as they are able to
                see different perspectives, discussions, or related questions to
                any part of the material or resource.
              </Typography> */}
            </Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "600", mt: 4 }}
              align="center"
              // color="#2F2F85"
              color={"#000"}
            >
              Meet the Team
            </Typography>
            <Divider
              sx={{
                mt: 1,
                mb: 3,
              }}
            />
            <Grid container>
              {developers.map((developer, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      boxShadow: 0,
                      bgcolor: "transparent",
                    }}
                  >
                    <CardContent>
                      <Avatar
                        alt={developer.name}
                        src={developer.image.src}
                        sx={{
                          width: 200,
                          height: 200,
                          margin: "auto",
                          marginBottom: "20px",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        {developer.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        textAlign={"center"}
                        mb={1}
                        // fontStyle={"italic"}
                      >
                        {developer.email}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        textAlign={"center"}
                        color="#2F2F85"
                        fontWeight={"550"}
                      >
                        {developer.role}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        textAlign={"center"}
                        fontStyle={"italic"}
                      >
                        {developer.major}
                      </Typography>
                      {/* <Typography variant="body2">
                    {developer.description}
                  </Typography> */}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Divider
              sx={{
                my: 3,
              }}
            />
            <div className="text-center text-[1.25rem] font-sans">
              Find out more about us at our{" "}
              <a
                className="text-[1.25rem] font-sans underline hover:cursor-pointer hover:text-[#2F2F85] hover:font-bold"
                href="https://sites.google.com/paragoniu.edu.kh/scholarize/home"
                target="_blank"
              >
                Google Site
              </a>
            </div>
          </Box>
        </Box>
      </div>
      <Footer />
    </>
  );
}
