"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function uploadFiles(
  token: string,
  groupId: number,
  formData: FormData,
  pathname: string
): Promise<{
  success: boolean;
  message: string;
  data: any;
}> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/${groupId}/file/uploadfiles`,
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
    // console.log("Failed to upload files", error);
    throw error;
  }
}
