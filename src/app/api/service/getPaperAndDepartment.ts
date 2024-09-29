"use server";
import { PaperAndDepartmentResponse } from "@/types";
import { redirect } from "next/navigation";
export async function getPaperAndDepartment(
  token: string
): Promise<PaperAndDepartmentResponse> {
  // try {
  const response = await fetch(
    // process.env.API_URL+"repository/uploadform",
    `${process.env.API_URL}/repository/uploadform`,
    {
      cache: "no-cache",
      // next:{revalidate: 3600 },
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
  }

  const transformedData = {
    paperTypes: data.research_types.map((type: any) => ({
      id: type.ResearchTypeID,
      name: type.ResearchTypeName,
    })),
    departments: data.departments.map((dept: any) => ({
      id: dept.DepartmentID,
      name: dept.DepartmentName,
      department_tag: dept.DepartmentTag,
      department_color: dept.DepartmentColor,
    })),
  };
  return transformedData as any;
  // } catch (error) {
  //   // console.error("Failed to get paper and department", error);
  //   throw error;
  // }
}
