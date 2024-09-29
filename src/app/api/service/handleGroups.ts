"use server";
import { GroupsResponse, CollabPermissions } from "@/types";
import { redirect } from "next/navigation";
//import alert

export async function getGroups(session: any) {
  const response = await fetch(`${process.env.API_URL}/collab/`, {
    cache: "no-cache",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
  }

  const transformedData = {
    active: data.collab_list.active.map((group: any) => ({
      id: group.collab_id,
      name: group.collab_name,
      collab_archive_status: group.collab_archive_status,
      isOwner: session.user.email === group.owner_info.user_email,
      members:
        group.members_info?.map((member: any) => ({
          id: member.user_id,
          profile: member.user_profile_img,
          name: member.user_name,
          email: member.user_email,
        })) ?? [],
      owner: group.owner_info
        ? {
            id: group.owner_info.user_id,
            profile: group.owner_info.user_profile_img,
            name: group.owner_info.user_name,
            email: group.owner_info.user_email,
          }
        : null,

      actions: group.actions,
      color: group.collab_color,
    })),
    archived: data.collab_list.archived.map((group: any) => ({
      id: group.collab_id,
      name: group.collab_name,
      collab_archive_status: group.collab_archive_status,
      members:
        group.members_info?.map((member: any) => ({
          id: member.user_id,
          profile: member.user_profile_img,
          name: member.user_name,
          email: member.user_email,
        })) ?? [],
      owner: group.owner_info
        ? {
            id: group.owner_info.user_id,
            profile: group.owner_info.user_profile_img,
            name: group.owner_info.user_name,
            email: group.owner_info.user_email,
          }
        : null,
      actions: group.actions,
    })),
  };
  return transformedData as any;
}

export async function getEditGroupForm(session: any, collab_id: number) {
  const response = await fetch(
    `${process.env.API_URL}/collab/edit?collab_id=${collab_id}`,
    {
      cache: "no-cache",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
    return { success: false, error: data };
  }

  return { data: data, success: true };
}

export async function removePendingMember(session: any, formData: FormData) {
  const response = await fetch(
    `${process.env.API_URL}/collab/removependingmember`,
    {
      cache: "no-cache",
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (data && data.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
    return { success: false, error: data };
  }

  return { data: data, success: true };
}

export interface FormGroupProps {
  data: FormData;
  token: string;
}

export async function UpdateGroup({ data, token }: FormGroupProps) {
  const response = await fetch(process.env.API_URL + "/collab/updatecollab", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  const res = await response.json();
  if (!response.ok) {
    if (res && res.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
      return;
    }
  }
  return res;
}

export async function CreateGroup({ data, token }: FormGroupProps) {
  try {
    const response = await fetch(process.env.API_URL + "/collab/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const responseData = await response.json();

    if (!response.ok) {
      if (
        responseData &&
        responseData.error === "Token invalid! Please login again!"
      ) {
        redirect("/auth/sessionexpire");
      }
      return { success: false, error: responseData };
    }

    return { success: true, data: responseData };
  } catch (error) {
    // console.log("Failed to create group", error);
    throw error;
  }
}

export async function ArchiveGroup({ data, token }: FormGroupProps) {
  try {
    const response = await fetch(
      process.env.API_URL + "/collab/archivecollab",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );
    const res = await response.json();
    if (!response.ok) {
      if (res && res.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
        return;
      }
      return { success: false, error: res };
    }

    return { success: true, data: res };
  } catch (error) {
    console.log("Failed to create group", error);
  }
}

interface Member {
  user_id: number;
  user_name: string;
  user_profile_img: string;
  user_email: string;
}

export interface InviteMembers {
  available_members: Member[];
}
export async function getInviteMembers(
  session: any,
  collab_id: number,
  query?: string
): Promise<InviteMembers> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/editquery?collab_id=${collab_id}&search=${
        query ?? ""
      }`,
      {
        cache: "no-cache",
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
    }
    if (data.available_members == null) {
      data.available_members = [];
    }
    return data;
  } catch (error) {
    // console.error("Failed to get groups", error);
    throw error;
  }
}
export async function getInviteMembersCreate(
  session: any,
  query?: string
): Promise<InviteMembers> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/createquery?search=${query ?? ""}`,
      {
        cache: "no-cache",
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
        // return;
      }
      // throw new Error(`Failed to get groups: ${data.message}`);
    }
    if (data.available_members == null) {
      data.available_members = [];
    }
    return data;
  } catch (error) {
    // console.error("Failed to get groups", error);
    throw error;
  }
}

export async function DeleteGroup({ data, token }: FormGroupProps) {
  const response = await fetch(process.env.API_URL + "/collab/deletecollab", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  const res = await response.json();
  if (!response.ok) {
    if (res && res.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
    return { success: false, error: res };
  }
  return { success: true, data: res };
}
export async function LeaveGroup({ data, token }: FormGroupProps) {
  const response = await fetch(process.env.API_URL + "/collab/leavecollab", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  const res = await response.json();
  if (!response.ok) {
    if (res && res.error === "Token invalid! Please login again!") {
      redirect("/auth/sessionexpire");
    }
    return { success: false, error: res };
  }

  return { success: true, data: res };
}

export async function JoinGroup(groupToken: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/joincollab/${groupToken}`,
      {
        cache: "no-cache",
        method: "GET",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      if (data && data.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
      return { success: false, error: data };
    }

    return { success: true, data: data };
  } catch (error) {
    throw error;
  }
}

export async function getCollabPermissions(token: string, collab_id: number) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/collab/permissions?collab_id=${collab_id}`,
      {
        cache: "no-cache",
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
      return { error: data };
    }

    return { data: data };
  } catch (error) {
    throw error;
  }
}

export async function UpdatePermissionCollab(
  token: string,
  data: CollabPermissions
) {
  try {
    const bodyData = JSON.stringify(data);
    const response = await fetch(
      `${process.env.API_URL}/collab/updatepermissions`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: bodyData,
      }
    );

    const res = await response.json();
    if (!response.ok) {
      if (res && res.error === "Token invalid! Please login again!") {
        redirect("/auth/sessionexpire");
      }
      return { error: res };
    }
    return res;
  } catch (error) {
    throw error;
  }
}
