/** @format */

"use server";

export async function GetSocketHost() {
  const hostname = process.env.SOCKET_HOST;
  return hostname;
}
