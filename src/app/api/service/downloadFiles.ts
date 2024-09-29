/** @format */

"use server";
export default async function downloadResearchFiles(
  paperPath: string,
  researchTitle: string
) {
  const downloadUrl = `${process.env.RF_URL}/${encodeURIComponent(
    paperPath
  )}?filename=${encodeURIComponent(researchTitle)}`;

  try {
    const response = await fetch(downloadUrl, {
      method: "GET",
    });

    if (!response.ok) {
      return { success: false, url: downloadUrl };
    }

    return { success: true, url: downloadUrl };
  } catch (error) {
    throw error;
  }
}

export async function downloadCollabFiles(filePath: string, fileName: string) {
  const downloadUrl = `${process.env.CF_URL}/${encodeURIComponent(
    filePath
  )}?filename=${encodeURIComponent(fileName)}`;

  try {
    const response = await fetch(downloadUrl, {
      method: "GET",
    });
    if (!response.ok) {
      return { success: false, url: downloadUrl };
    }

    return { success: true, url: downloadUrl };
  } catch (error) {
    throw error;
  }
}
