/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { Box, SelectChangeEvent } from "@mui/material";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { PaperType, Department } from "@/types";
import { getPaperAndDepartment } from "@/app/api/service/getPaperAndDepartment";
import { useRouter } from "next/navigation";
import { uploadPaper } from "@/app/api/service/repo/upload-paper/uploadPaper";
import Form from "./form";
interface SubmitFormProps {
  readonly?: boolean;
}

export default function SubmitForm({ readonly = false }: SubmitFormProps) {
  // Get the current user session get token
  const { data: session } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  // Set the form data
  const [formData, setFormData] = useState<{
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
    department: [] as any,
    manuscriptTitle: "",
    paperType: "",
    abstract: "",
    tags: "",
    author: "",
    advisor: "",
    fullText: "no value",
    paperTypes: [],
    departments: [],
  });

  const FetchPaperAndDepartment = async () => {
    if (session) {
      await getPaperAndDepartment(session.user.token)
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
  };

  useEffect(() => {
    FetchPaperAndDepartment();
  }, [session?.user?.token]);

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRichTextChange = (content: string) => {
    setFormData((prev) => ({ ...prev, fullText: content }));
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

  // Usage

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const formToSend = new FormData();
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

    if (file) {
      // Check if file is PDF
      if (file.type !== "application/pdf") {
        toast.error("File must be a PDF");
        setIsLoading(false);
        return;
      }
      if (file.size > 100000000) {
        toast.error("File size too large. Maximum file size is 100MB");
        setIsLoading(false);
      }

      formToSend.append("paper_file", file); // Append the file if it exists
    }

    const departmentIds = formData.departments
      .filter((dept: Department) => formData.department.includes(dept.name))
      .map((dept: Department) => dept.id.toString());
    formToSend.append("department_id", departmentIds.join(","));

    formToSend.append("research_title", formData.manuscriptTitle.trim());
    formToSend.append("abstract", formData.abstract.trim());
    formToSend.append("tag", formData.tags.trim());
    formToSend.append("advisor", formData.advisor.trim());
    formToSend.append("author", formData.author.trim());
    formToSend.append(
      "research_type_id",
      formData.paperTypes
        .find((type: PaperType) => type.name === formData.paperType)
        ?.id.toString() as string
    );
    formToSend.append("full_text", formData.fullText);

    setUploading(true);
    const response = await uploadPaper(formToSend, session);

    if (!response.success) {
      toast.error(response.error.error);
      setIsLoading(false);
      setUploading(false);
      return;
    }

    toast.success("Paper submitted successfully");
    setUploading(false);
    setIsLoading(false);
    router.push("/dashboard/repository/my-publications");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Form
        formType="submit"
        uploading={uploading}
        isLoading={isLoading}
        setFile={setFile}
        formData={formData}
        readonly={readonly}
        handleInputChange={handleInputChange}
        handleRichTextChange={handleRichTextChange}
        handleSubmit={handleSubmit}
        handleSelectChange={handleSelectChange}
      />
    </Box>
  );
}
