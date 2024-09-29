/** @format */

"use server";
import { redirect } from "next/navigation";
export type GetFilesByCollabIdResponse =
  | {
      folder?: Folder;
      message: string;
      success: true;
      collab_archive_status: boolean;
    }
  | {
      error: string;
      success: false;
    };

export type Folder = {
  folder_id: number;
  folder_name: string;
  total_files: number;
  files: File[];
};

export type File = {
  file_id: number;
  file_name: string;
  file_size: string;
  updated_at: Date;
  file_path: string;
  user_details: UserDetails;
};

type UserDetails = {
  user_id: number;
  user_name: string;
  user_profile_img: string;
  user_email: string;
};

type Params = {
  collabId: number;
  folderId: number;
  page?: number;
  count: number;
};

export async function getFilesByCollabId(
  token: string,
  param: Params
): Promise<GetFilesByCollabIdResponse> {
  try {
    const api_url = new URL(
      `${process.env.API_URL}/collab/${param.collabId}/file/getfiles`
    );

    if (param.folderId) {
      api_url.searchParams.append("folder_id", param.folderId.toString());
    }

    if (param.page) {
      api_url.searchParams.append("page", param.page.toString());
    }
    param.count = 10;
    api_url.searchParams.append("count", param.count.toString());

    const response = await fetch(api_url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // disable cache here
      cache: "no-cache",
    });
    const data = await response.json();
    const FileByCollabId: GetFilesByCollabIdResponse = data;
    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
      if (response.status === 401) {
        redirect("/dashboard/collaboration/groups");
      }
      return { error: data, success: false };
    }
    data.success = response.ok;

    return FileByCollabId;
  } catch (error) {
    // console.error("Failed to get file by collab id", error);
    throw error;
  }
}
