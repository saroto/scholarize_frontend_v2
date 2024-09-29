"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function moveFileByFileId(
  token: string,
  groupId: number,
  fileId: number,
  folderId: number,
  pathname: string
): Promise<{
  success: boolean;
  message: string;
  data: any;
}> {
  try {
    const formData = new FormData();
    formData.append("file_id", fileId.toString());
    formData.append("folder_id", folderId.toString());

    const response = await fetch(
      `${process.env.API_URL}/collab/${groupId}/file/movefile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    if (response.ok) {
      // invalidate cache
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
      revalidatePath(pathname);
    }

    return {
      message: data.message,
      success: response.ok,
      data: data,
    };
  } catch (error) {
    // console.log("Failed to move file by file id", error);
    throw error;
  }
}
