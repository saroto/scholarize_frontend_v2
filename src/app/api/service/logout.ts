"use server";
export async function Logouts(session: any) {
  try {
    const response = await fetch(`${process.env.API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.error === "Token invalid! Please login again!") {
        return data;
      }
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error("Error during logout", error);
    throw error;
  }
}
