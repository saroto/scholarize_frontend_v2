"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import {
  Link,
  Box,
  SelectChangeEvent,
  Typography,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useSession } from "next-auth/react";
import { PaperType, Department } from "@/types";
import { getPaperAndDepartment } from "@/app/api/service/getPaperAndDepartment";
import { useRouter } from "next/navigation";

import {
  getRejectPaper,
  rejectPaper,
} from "@/app/api/service/publication/rejectPaper";
import { reject_paper } from "@/types";
import Form from "@/components/submitform/form";
interface rejectProp {
  public_id: string;
}

export default function SubmitForm({ params }: { params: rejectProp }) {
  // Get the current user session get token
  const { data: session } = useSession();
  const router = useRouter();
  const [reject, setReject] = useState<reject_paper>();
  const [rejectReason, setRejectReason] = useState("");
  const id = params.public_id;
  const [richText, setRichText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  // Set the form data
  const [formData, setFormData] = useState<{
    research_paper_id: string;
    department: string;
    manuscriptTitle: string;
    paperType: string;
    abstract: string;
    tags: string;
    author: string;
    advisor: string;
    fullText: string;
    paperTypes: PaperType[];
    departments: Department[];
  }>({
    research_paper_id: "",
    department: [] as any,
    manuscriptTitle: "",
    paperType: "",
    abstract: "",
    tags: "",
    author: "",
    advisor: "",
    fullText: richText,
    paperTypes: [],
    departments: [],
  });
  const [file, setFile] = useState<File | null>(null);
  const [pdf_path, setPdfPath] = useState("");
  const [showPdfPath, setShowPdfPath] = useState(true);
  const [showChooseFile, setShowChooseFile] = useState("no");

  const handleShowButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowChooseFile(event.target.value);
  };

  useEffect(() => {
    if (session?.user?.token) {
      getPaperAndDepartment(session.user.token)
        .then(({ paperTypes, departments }) => {
          setFormData((prevState) => ({
            ...prevState,
            paperTypes: paperTypes.map((type) => ({
              id: type.id,
              name: type.name,
              research_type_id: type.research_type_id,
              research_type_name: type.research_type_name,
            })),
            departments: departments.map((dept) => ({
              id: dept.id,
              name: dept.name,
              department_id: dept.department_id,
              department_name: dept.department_name,
              department_tag: dept.department_tag,
              department_color: dept.department_color,
              department_status: dept.department_status,
            })),
          }));
        })
        .catch(console.error);
    }
  }, [session?.user?.token]);

  const handleRichTextChange = (content: string) => {
    setRichText(content);
    setFormData((prev) => ({ ...prev, richText: content }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange =
    (name: string) => (event: SelectChangeEvent<string>) => {
      setFormData((prevState) => ({
        ...prevState,
        [name]: event.target.value,
      }));
    };

  // // Usage

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const specialCharRegex = /[@#$%^+]+/;
    const checkInput = (input: string, fieldName: string) => {
      if (specialCharRegex.test(input) || input.length > 255) {
        toast.error(
          `${fieldName} cannot contain special characters or exceed 255 characters`
        );
        setIsLoading(false);
        return true;
      }
      return false;
    };

    if (checkInput(formData.manuscriptTitle, "Manuscript Title")) return;
    if (checkInput(formData.author, "Author")) return;
    if (checkInput(formData.tags, "Tag")) return;
    if (checkInput(formData.advisor, "Advisor")) return;
    // if (specialCharRegex.test(formData.abstract)) {
    //   toast.error("Abstract cannot contain special characters");
    //   return;
    // }
    const formToSend = new FormData();
    if (showChooseFile === "yes") {
      if (!file) {
        toast.error("Please upload a file");
        setIsLoading(false);
        return;
      } else {
        // Check if file is PDF
        if (file.type !== "application/pdf") {
          toast.error("Please upload a PDF file");
          setIsLoading(false);
          return;
        }

        if (file.size > 100000000) {
          toast.error("File size too large. Maximum file size is 100MB");
          setIsLoading(false);
        }
        formToSend.append("paper_file", file); // Append the file if it exists
      }
    }
    // Construct a FormData object to include the file and other form data

    const departmentIds = formData.departments
      .filter((dept: Department) => formData.department.includes(dept.name))
      .map((dept: Department) => dept.id.toString());
    formToSend.append("department_id", departmentIds.join(","));
    formToSend.append("research_title", formData.manuscriptTitle.trim());
    formToSend.append(
      "research_type_id",
      formData.paperTypes
        .find((type: PaperType) => type.name === formData.paperType)
        ?.id.toString() as string
    );
    formToSend.append("abstract", formData.abstract.trim());
    formToSend.append("tag", formData.tags.trim());
    formToSend.append("author", formData.author.trim());
    formToSend.append("advisor", formData.advisor.trim());
    formToSend.append("full_text", richText);
    formToSend.append("research_paper_id", formData.research_paper_id);

    setUploading(true);
    const submitReject = await rejectPaper(
      session?.user.token,
      String(reject?.paper.research_paper_id),
      formToSend
    );
    if (!submitReject.success) {
      toast.error("Failed to submit paper");
      setIsLoading(false);
      setUploading(false);
      return;
    } else {
      toast.success("Successfully uploaded paper");
      await router.replace("/dashboard/repository/my-publications");
      setIsLoading(false);
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user.token && id) {
        getRejectPaper(session.user.token, String(id))
          .then((data) => {
            setReject(data);

            setPdfPath(data.paper.pdf_path);
            setFormData((prevState) => ({
              ...prevState,
              manuscriptTitle: data.paper.research_title,
              paperType: data.paper.research_type.ResearchTypeName,
              abstract: data.paper.abstract,
              tags: data.paperInfo.Tag,
              department: data.paper.departments.map(
                (department: Department) => department.department_name
              ),
              research_paper_id: data.paper.research_paper_id,
              author: data.paper.author,
              advisor: data.paperInfo.Advisor,
              fullText: data.full_text,
            }));
          })
          .catch(console.error);
      }
    };
    fetchData();
  }, [session?.user.token, id]);

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setShowPdfPath(false); // Hide pdf_path when a file is chosen
  };

  return (
    <Box sx={{ width: "100%", padding: 4, display: "flex", overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          href="/dashboard/repository/my-publications"
          sx={{
            textDecoration: "none",
            alignItems: "center",
            display: "flex",
            height: "auto",
            fontSize: "1rem",
            color: "#777777",
            ":hover": {
              textDecoration: "none",
              color: "black",
            },
          }}
        >
          <ArrowBackIcon sx={{ padding: 0, margin: 0 }}></ArrowBackIcon>
          <Typography sx={{ display: "flex" }}>BACK</Typography>
        </Button>
        <Box sx={{ flex: 1 }} /> {/* Spacer */}
        <Typography
          variant="h4"
          sx={{
            marginBottom: 3,
            textAlign: "center",
            alignItems: "center",
            fontWeight: "550",
          }}
        >
          Rejected Submission
        </Typography>
        <Box sx={{ flex: 1 }} /> {/* Spacer */}
      </Box>

      <Form
        reject={reject}
        formType="rejected"
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleRichTextChange={handleRichTextChange}
        handleFileChange={handleFileChange}
        showChooseFile={showChooseFile}
        handleShowButton={handleShowButton}
        isLoading={isLoading}
        setFile={setFile}
        readonly={false}
        uploading={uploading}
      />
    </Box>
  );
}
