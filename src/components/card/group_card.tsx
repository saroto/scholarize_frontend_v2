/** @format */

"use client";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  getEditGroupForm,
  removePendingMember,
} from "@/app/api/service/handleGroups";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SubjectIcon from "@mui/icons-material/Subject";
import GroupIcon from "@mui/icons-material/Group";
import ArchiveIcon from "@mui/icons-material/Archive";
import EditNoteIcon from "@mui/icons-material/EditNote";
import KeyIcon from "@mui/icons-material/Key";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import React, { useEffect, useRef, useState } from "react";
import ConfirmPopup from "../dialogs/Confirm-popup";
import {
  UpdateGroup,
  ArchiveGroup,
  getInviteMembers,
  InviteMembers,
  DeleteGroup,
  LeaveGroup,
  UpdatePermissionCollab,
  getCollabPermissions,
} from "@/app/api/service/handleGroups";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { CollabPermissions, Permissions } from "@/types";
import { update } from "lodash";

export type GroupMember = {
  id: number;
  profile: string;
  name: string;
  isOwner?: boolean;
  email: string;
};

export type GroupDetail = {
  groupId: number;
  groupTitle: string;
  isOwner: boolean;
  groupMembers: GroupMember[];
  groupOwner: GroupMember;
  groupAction: string[];
  collab_archive_status: boolean;
  pendingMembers?: GroupMember[];
};

export type EditGroupMember = {
  user_id: number;
  user_name: string;
  user_profile_img: string;
  user_email: string;
  isNew?: boolean;
};

export type EditGroupDetails = {
  collab_id: number;
  collab_name: string;
  collab_archive_status: boolean;
  owner_info: EditGroupMember;
  members_info: EditGroupMember[] | null;
  pending_invites: EditGroupMember[] | null;
};

type AnchorEl = null | HTMLElement;

export function Member({
  isOwner = false,
  groupDetail,
  member,
  isEdit = false,
  showEmail = false,
  onRemove,
}: {
  isOwner?: boolean;
  member: GroupMember;
  groupDetail?: GroupDetail;
  showEmail?: boolean;
  isEdit?: boolean;
  onRemove?: () => void;
}) {
  return (
    <>
      {member && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginBottom: 1,
          }}
        >
          <Avatar
            alt={member.name}
            src={member.profile}
            sx={{
              width: 32,
              height: 32,
              display: "flex",
            }}
          />
          <Box
            sx={{ display: "flex", overflow: "hidden", alignItems: "center" }}
          >
            <Typography variant="body1" noWrap sx={{}}>
              {member.name}
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", overflow: "hidden", alignItems: "center" }}
          >
            {isOwner && (
              <StarsIcon
                sx={{
                  color: "black",
                  width: "1.2rem",
                  height: "1.2rem",
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  );
}

export function ViewMember({
  isOwner = false,
  groupDetail,
  member,
}: {
  isOwner?: boolean;
  member: GroupMember;
  groupDetail?: GroupDetail;
}) {
  return (
    <>
      {member && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 1.5,
          }}
        >
          <Avatar
            alt={member.name}
            src={member.profile}
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
            }}
          />
          <Box
            sx={{
              display: "flex",
              overflow: "hidden",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Typography
              noWrap
              sx={{
                fontSize: "1rem",
              }}
            >
              {member.name}{" "}
              {isOwner && (
                <StarsIcon
                  sx={{
                    color: "black",
                    width: "1.2rem",
                    height: "1.2rem",
                    my: "auto",
                  }}
                />
              )}
            </Typography>
            <Typography
              noWrap
              sx={{
                fontSize: "0.9rem",
              }}
            >
              {member.email}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}

export function EditMember({
  isOwner = false,
  member,
  onRemove,
  isPending = false,
}: {
  isOwner?: boolean;
  member: EditGroupMember;
  onRemove?: () => void;
  isPending?: boolean;
}) {
  return (
    <>
      {member && (
        <Box
          sx={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 1.5,
          }}
        >
          <Box
            overflow={"hidden"}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              alt={member.user_name}
              src={member.user_profile_img}
              sx={{
                width: "2.5rem",
                height: "2.5rem",
                display: "flex",
              }}
            />
            <Box
              sx={{
                display: "flex",
                overflow: "hidden",
                alignItems: "start",
                flexDirection: "column",
              }}
            >
              <Typography
                noWrap
                sx={{
                  fontSize: "1rem",
                  color: isPending ? "#999" : "black",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {member.user_name}&nbsp;
                {member.isNew ? (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "red",
                      fontSize: "0.7rem",
                      my: "auto",
                      display: "flex",
                    }}
                  >
                    (TO BE ADDED)
                  </Typography>
                ) : (
                  <>
                    {!isOwner && !isPending && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "blue",
                          fontSize: "0.7rem",
                          my: "auto",
                          display: "flex",
                        }}
                      >
                        (MEMBER)
                      </Typography>
                    )}
                  </>
                )}
                {isOwner && (
                  <StarsIcon
                    sx={{
                      color: "black",
                      width: "1.2rem",
                      height: "1.2rem",
                      my: "auto",
                      display: "flex",
                    }}
                  />
                )}
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontSize: "0.9rem",
                  color: isPending ? "#999" : "black",
                }}
              >
                {member.user_email}
              </Typography>
            </Box>
          </Box>
          {!isOwner && (
            <IconButton
              sx={{
                display: "flex-inline",
              }}
              onClick={onRemove}
            >
              {isPending ? <CloseIcon /> : <DeleteIcon />}
            </IconButton>
          )}
        </Box>
      )}
    </>
  );
}

export default function GroupCard({
  isArchived = false,
  groupDetail,
  maxMemberToShow = 2,
  UpdateGetGroup,
}: {
  UpdateGetGroup: () => void;
  isArchived?: boolean;
  maxMemberToShow?: number;
  groupDetail: GroupDetail;
}) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [anchorEl, setAnchorEl] = useState<AnchorEl>(null);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  // For user/hod to view group info only
  const [groupInfoDialog, setGroupInfoDialog] = useState<boolean>(false);

  const openGroupInfoDialog = () => {
    setGroupInfoDialog(true);
  };

  const closeGroupInfoDialog = () => {
    setGroupInfoDialog(false);
  };

  // Edit group dialog is for advisor only
  const [editGroupDialog, setEditGroupDialog] = useState<boolean>(false);

  const openEditGroupDialog = () => {
    setEditGroupDialog(true);
  };

  const closeEditGroupDialog = () => {
    setEditGroupDialog(false);
  };

  const [permissionDialog, setPermissionDialog] = useState<boolean>(false);

  const openPermissionDialog = () => {
    setPermissionDialog(true);
  };

  const closePermissionDialog = () => {
    setPermissionDialog(false);
  };

  const [archived, setArchived] = useState(isArchived);
  // const [leaveCollab, setLeaveCollab] = useState<boolean>(false);
  const { data: session } = useSession();

  const handlePermission = async (permission: Permissions) => {
    const data: CollabPermissions = {
      collab_id: groupDetail.groupId,
      permissions: {
        "Create task": permission.create_task,
        "Edit task": permission.edit_task,
        "Delete task": permission.delete_task,
        "Upload file": permission.upload_file,
        "Edit file": permission.edit_file,
        "Delete file": permission.delete_file,
        "Add schedule event": permission.add_schedule,
        "Edit schedule event": permission.edit_schedule,
        "Delete schedule event": permission.delete_schedule,
      },
    };

    try {
      if (session) {
        const res = await UpdatePermissionCollab(session.user.token, data);
        if (res.error) {
          return;
        }
      }
      toast.success("Permission updated successfully");
    } catch (error) {
      toast.error("Failed to update permission");
    }
  };

  // Archive collab
  const handleArchiveGroup = async (): Promise<void> => {
    try {
      // e.preventDefault();
      const formToSend = new FormData();
      formToSend.append("collab_id", groupDetail.groupId.toString());

      const postArchive = await ArchiveGroup({
        data: formToSend,
        token: session?.user.token || "",
      });
      if (postArchive?.success) {
        toast.success("Collaboration archived successfully");
        UpdateGetGroup();
        setArchived(!archived);
      } else {
        toast.error("Failed to archive Collaboration");
      }
    } catch (error) {
      console.error("Error archiving collaboration:", error);
    }
  };

  // Delete collab
  const handleDeleteGroup = async () => {
    try {
      // e.preventDefault();
      const formToSend = new FormData();
      formToSend.append("collab_id", groupDetail.groupId.toString());
      const deleteCollab = await DeleteGroup({
        data: formToSend,
        token: session?.user.token || "",
      });
      if (deleteCollab.success) {
        toast.success("Collaboration deleted successfully");
        setArchived(true);
        UpdateGetGroup();
      }
    } catch (error) {
      console.error("Error deleting collaboration:", error);
    }
  };

  // Leave collab
  const handleLeaveGroup = async () => {
    try {
      const formToSend = new FormData();
      formToSend.append("collab_id", groupDetail.groupId.toString());
      const response = await LeaveGroup({
        data: formToSend,
        token: session?.user.token || "",
      });

      if (response.error) {
        toast.error("Failed to leave collaboration");
        return;
      } else {
        toast.success("Left collaboration successfully");
        setArchived(true);
        UpdateGetGroup();
      }
    } catch (error) {
      console.error("Error leaving collaboration:");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          aspectRatio: "1 / 1",
          padding: 1,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            borderRadius: "2rem",
            border: "1px solid #cfcfcf",
            filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))",
            flexDirection: "column",
            padding: 1.5,

            backgroundImage: isArchived
              ? "linear-gradient(45deg, #cfcfcf, #f5f5f5)"
              : "none",
          }}
        >
          <Box>
            <CardHeader
              sx={{
                "& .MuiCardHeader-content": {
                  display: "flex",
                  overflow: "hidden",
                },
              }}
              action={
                <IconButton aria-label="settings" onClick={openMenu}>
                  <MoreVertIcon />
                </IconButton>
              }
              title={
                <Link
                  href={`/dashboard/collaboration/group/${groupDetail.groupTitle}/tasks?groupId=${groupDetail.groupId}`}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      width: "20rem",
                      color: "black",
                      textDecoration: "none",
                      textTransform: "capitalize",
                      "&:hover": {
                        color: "#7200BB",
                      },
                    }}
                  >
                    {groupDetail.groupTitle}
                  </Typography>
                </Link>
              }
              titleTypographyProps={{
                noWrap: true,
                textOverflow: "ellipsis",
              }}
            />
          </Box>
          <GroupMenu
            updateGroup={UpdateGetGroup}
            anchorEl={anchorEl}
            groupDetail={groupDetail}
            closeMenu={closeMenu}
            openGroupInfoDialog={openGroupInfoDialog}
            openEditGroupDialog={openEditGroupDialog}
            openPermissionDialog={openPermissionDialog}
            handleArchiveGroup={handleArchiveGroup as () => Promise<void>}
            handleDeleteGroup={handleDeleteGroup as () => Promise<void>}
            handleLeaveGroup={handleLeaveGroup as () => Promise<void>}
          />

          <GroupInfoDialog
            groupDetail={groupDetail}
            closeDialog={closeGroupInfoDialog}
            open={groupInfoDialog}
          />

          <EditGroupDialog
            UpdateGetGroup={UpdateGetGroup}
            groupDetail={groupDetail}
            closeDialog={closeEditGroupDialog}
            open={editGroupDialog}
          />

          <GroupPermissionDialog
            handlePermission={handlePermission}
            groupDetail={groupDetail}
            closeDialog={closePermissionDialog}
            open={permissionDialog}
          />

          <Divider />
          <CardContent sx={{ overflow: "hidden" }}>
            <Typography variant="body2" fontWeight={650} color="text.secondary">
              {`MEMBER (${groupDetail.groupMembers.length + 1})`}
            </Typography>
            <Box
              sx={{
                padding: 2,
                paddingLeft: 1.5,
                overflowY: "auto",
                height: "100%",
              }}
            >
              <Member
                member={groupDetail.groupOwner}
                groupDetail={groupDetail}
                isOwner={true}
              />
              {groupDetail.groupMembers.map((member, index) => (
                <Member member={member} key={index} groupDetail={groupDetail} />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

// Done
function GroupMenu({
  groupDetail,
  anchorEl,
  closeMenu,
  openGroupInfoDialog,
  openEditGroupDialog,
  openPermissionDialog,
  handleArchiveGroup,
  handleDeleteGroup,
  handleLeaveGroup,
  updateGroup,
}: {
  groupDetail: GroupDetail;
  anchorEl: AnchorEl;
  closeMenu: () => void;
  openGroupInfoDialog: () => void;
  openEditGroupDialog: () => void;
  openPermissionDialog: () => void;
  handleArchiveGroup: () => Promise<void>;
  handleDeleteGroup: () => void;
  handleLeaveGroup: () => void;
  updateGroup: () => void;
}) {
  const [confirmLeaveCollab, setConfirmLeaveCollab] = useState<boolean>(false);
  const [confirmArchiveCollab, setConfirmArchiveCollab] =
    useState<boolean>(false);
  const [confirmDeleteCollab, setConfirmDeleteCollab] =
    useState<boolean>(false);
  const openGroupInfoDialogAndHideMenu = () => {
    closeMenu();
    openGroupInfoDialog();
  };
  const openEditGroupDialogAndHideMenu = () => {
    closeMenu();
    openEditGroupDialog();
  };

  const openPermissionDialogAndHideMenu = () => {
    closeMenu();
    openPermissionDialog();
  };
  const handleLeaveGroupAndClosePopup = () => {
    handleLeaveGroup();
    setConfirmLeaveCollab(false);
  };
  const handleArchiveGroupAndClosePopup = () => {
    handleArchiveGroup();
    setConfirmArchiveCollab(false);
  };
  const handleDeleteGroupAndClosePopup = () => {
    handleDeleteGroup();
    setConfirmDeleteCollab(false);
  };
  return (
    <Menu
      id="menu-appbar-group"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeMenu}
    >
      {groupDetail.groupAction.includes("View Info") && (
        <MenuItem onClick={openGroupInfoDialogAndHideMenu}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <Typography fontSize={"medium"} noWrap>
            View info
          </Typography>
        </MenuItem>
      )}

      {groupDetail.groupAction.includes("Edit Collab") && (
        <MenuItem onClick={openEditGroupDialogAndHideMenu}>
          <ListItemIcon>
            <EditNoteIcon fontSize="small" />
          </ListItemIcon>
          <Typography fontSize={"medium"} noWrap>
            Edit Group
          </Typography>
        </MenuItem>
      )}

      {groupDetail.groupAction.includes("Edit Permission") && (
        <MenuItem onClick={openPermissionDialogAndHideMenu}>
          <ListItemIcon>
            <KeyIcon fontSize="small" />
          </ListItemIcon>
          <Typography fontSize={"medium"} noWrap>
            Permission
          </Typography>
        </MenuItem>
      )}
      {groupDetail.collab_archive_status !== true && <Divider />}

      {groupDetail.groupAction.includes("Archive Collab") &&
        groupDetail.collab_archive_status !== true && (
          <MenuItem>
            <Box
              sx={{ display: "flex" }}
              onClick={() => setConfirmArchiveCollab(true)}
            >
              <ListItemIcon>
                <ArchiveIcon fontSize="small" />
              </ListItemIcon>

              <Typography fontSize={"medium"} noWrap>
                Archive Collab
              </Typography>
            </Box>
            <ConfirmPopup
              closeMenu={closeMenu}
              confirmTitle="Archive group"
              onConfirm={handleArchiveGroupAndClosePopup}
              open={confirmArchiveCollab}
              onClose={() => setConfirmArchiveCollab(false)}
            />
          </MenuItem>
        )}

      {groupDetail.isOwner !== true &&
        groupDetail.collab_archive_status !== true && (
          <div>
            <MenuItem>
              <Box
                sx={{ display: "flex" }}
                onClick={() => {
                  setConfirmLeaveCollab(true);
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="warning" />
                </ListItemIcon>
                <Typography fontSize={"medium"} noWrap color={"warning.main"}>
                  Leave group
                </Typography>
              </Box>
              <ConfirmPopup
                closeMenu={closeMenu}
                confirmTitle="Leave group"
                onConfirm={handleLeaveGroupAndClosePopup}
                open={confirmLeaveCollab}
                onClose={() => setConfirmLeaveCollab(false)}
              />
            </MenuItem>
          </div>
        )}

      {groupDetail.groupAction.includes("Delete Collab") &&
        groupDetail.collab_archive_status !== true && (
          <MenuItem>
            <Box
              sx={{ display: "flex" }}
              onClick={() => setConfirmDeleteCollab(true)}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="warning" />
              </ListItemIcon>
              <Typography fontSize={"medium"} noWrap color={"warning.main"}>
                Delete group
              </Typography>
            </Box>
            <ConfirmPopup
              closeMenu={closeMenu}
              confirmTitle="Delete group"
              onConfirm={handleDeleteGroupAndClosePopup}
              open={confirmDeleteCollab}
              onClose={() => setConfirmDeleteCollab(false)}
            />
          </MenuItem>
        )}
    </Menu>
  );
}

// Done
function GroupInfoDialog({
  groupDetail,
  open,
  closeDialog,
}: {
  groupDetail: GroupDetail;
  open: boolean;
  closeDialog: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "1.5rem",
          padding: 1,
          minHeight: "30rem",
          width: "30rem",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          noWrap
          variant="h5"
          sx={{
            fontWeight: "550",
            px: 2,
          }}
        >
          Group Information
        </Typography>
        <IconButton
          onClick={closeDialog}
          color="inherit"
          sx={{
            display: "flex",
            position: "absolute",
            right: "1rem",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Stack
            direction={"row"}
            gap={2}
            overflow={"hidden"}
            sx={{
              display: "flex",
              alignItems: "top",
            }}
          >
            <Box sx={{ paddingTop: 0.5 }}>
              <SubjectIcon />
            </Box>
            <Typography
              variant="h6"
              fontWeight={500}
              sx={{ wordBreak: "break-word" }}
            >
              {groupDetail.groupTitle}
            </Typography>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <GroupIcon />
            <Typography variant="body1" fontWeight={500} noWrap>
              MEMBERS
            </Typography>
          </Stack>
        </Stack>
        <Box sx={{ padding: 2 }}>
          <ViewMember
            member={groupDetail.groupOwner}
            groupDetail={groupDetail}
            isOwner={true}
          />
          {groupDetail.groupMembers.map((member, index) => (
            <ViewMember member={member} key={index} groupDetail={groupDetail} />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function EditGroupDialog({
  UpdateGetGroup,
  groupDetail,
  open,
  onSave,
  closeDialog,
}: {
  groupDetail: GroupDetail;
  open: boolean;
  UpdateGetGroup: () => void;
  onSave?: () => void;
  closeDialog: () => void;
}) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [editGroupDetail, setEditGroupDetail] = useState<EditGroupDetails>(
    {} as EditGroupDetails
  );
  const [groupMemberList, setGroupMemberList] = useState<EditGroupMember[]>([]);
  const [pendingGroupMembers, setPendingGroupMembers] = useState<
    EditGroupMember[]
  >([]);
  const [editGroupTitle, setEditGroupTitle] = useState<boolean>(false);
  const { data: session } = useSession();
  const [inviteMembers, setInviteMembers] = useState<InviteMembers>({
    available_members: [],
  });
  const [searchInput, setSearchInput] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user?.token && groupDetail.isOwner && open) {
      handleGetEditGroupForm();
      // getInviteMembers(session, groupDetail.groupId, searchInput).then(
      //   (data) => {
      //     // setInviteMembers(data);
      //   }
      // );
    }
  }, [open]);

  useEffect(() => {
    if (session?.user?.token && groupDetail.isOwner && open) {
      getInviteMembers(session, groupDetail.groupId, searchInput).then(
        (data) => {
          setInviteMembers(data);
        }
      );
    }
  }, [searchInput]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleGetEditGroupForm = async () => {
    const response = await getEditGroupForm(session, groupDetail.groupId);
    if (response && response.success) {
      setEditGroupDetail(response.data.collab_details);
      setGroupMemberList(
        (response &&
          response.data.collab_details?.members_info?.map(
            (member: {
              user_id: any;
              user_name: any;
              user_profile_img: any;
              user_email: any;
            }) => ({
              user_id: member.user_id,
              user_name: member.user_name,
              user_profile_img: member.user_profile_img,
              user_email: member.user_email,
            })
          )) ||
          []
      );
      setPendingGroupMembers(
        (response &&
          response.data.collab_details?.pending_invites?.map(
            (member: {
              user_id: any;
              user_name: any;
              user_profile_img: any;
              user_email: any;
            }) => ({
              user_id: member.user_id,
              user_name: member.user_name,
              user_profile_img: member.user_profile_img,
              user_email: member.user_email,
            })
          )) ||
          []
      );
    } else {
      console.error("Failed to get group details", response?.error);
    }
  };

  const filterOptions = (options: any[], state: { inputValue: string }) => {
    return options.filter(
      (option) =>
        option.user_name
          .toLowerCase()
          .includes(state.inputValue.toLowerCase()) ||
        option.user_email.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  };

  const handleCloseDialog = () => {
    closeDialog();
    setGroupMemberList([]);
    setEditGroupTitle(false);
    setSearchInput("");
  };

  const handleRemovePendingMember = async (pending_member_id: number) => {
    const formToSend = new FormData();
    formToSend.append("collab_id", groupDetail.groupId.toString());
    formToSend.append("pending_member_id", pending_member_id.toString());
    const response = await removePendingMember(session, formToSend);
    if (response && response.error) {
      console.error("Failed to delete group member", response?.error);
      return;
    }
    toast.success("Pending member removed successfully");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const formToSend = new FormData(event.currentTarget);
    const collab_id = groupDetail.groupId;
    formToSend.append("collab_id", collab_id.toString());
    if (!formToSend.get("collab_name")) {
      formToSend.set("collab_name", editGroupDetail.collab_name);
    } else {
      const regex = /^[A-Za-z0-9\s-()]+$/;
      if (!regex.test(event.currentTarget["collab_name"].value)) {
        toast.error(
          "Collab name should not contain special characters except - and ()"
        );
        setSaving(false);
        return;
      }

      if (event.currentTarget["collab_name"].length > 50) {
        toast.error("Collab name should not exceed 50 characters");
        setSaving(false);
        return;
      }
    }
    if (groupMemberList.length != 0) {
      groupMemberList.forEach((member) => {
        formToSend.append("member_ids", member.user_id.toString());
      });
    }
    await UpdateGroup({
      data: formToSend,
      token: session?.user.token || "",
    }).then((res) => {
      if (res.error) {
        setEditGroupTitle(false);
        toast.error(res.error, {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        setSaving(false);
        return;
      }
      closeDialog();
      UpdateGetGroup();
      toast.success("Group updated successfully");
      setSaving(false);
      setEditGroupTitle(false);
      setInviteMembers({
        available_members: [],
      });
    });
  };

  const handleOptionClick = (option: any) => () => {
    const newMember: EditGroupMember = {
      user_id: option.user_id,
      user_profile_img: option.user_profile_img,
      user_email: option.user_email,
      user_name: option.user_name,
      isNew: true,
    };

    setInviteMembers({
      available_members: inviteMembers.available_members.filter(
        (member) => member.user_email !== option.user_email
      ),
    });
    if (
      groupMemberList.some((member) => member.user_email === option.user_email)
    ) {
      return;
    }
    setGroupMemberList([...groupMemberList, newMember]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "1.5rem",
          padding: 1,
          minHeight: "30rem",
          width: "30rem",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            noWrap
            sx={{
              fontSize: "1.5rem",
              fontWeight: "550",
              px: 2,
            }}
          >
            Edit Collaboration
          </Typography>
          <IconButton
            onClick={handleCloseDialog}
            color="inherit"
            sx={{
              display: "flex",
              position: "absolute",
              right: "1rem",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />

        <DialogContent
          sx={{
            height: "25rem",
            overflow: "auto",
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction={"row"}
              gap={2}
              overflow={"hidden"}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <SubjectIcon />
              {editGroupTitle ? (
                <div className="flex w-full truncate">
                  <TextField
                    fullWidth
                    id="group-title"
                    variant="standard"
                    name="collab_name"
                    placeholder="Enter group title"
                    defaultValue={editGroupDetail.collab_name}
                  />
                  <IconButton onClick={() => setEditGroupTitle(false)}>
                    <ClearRoundedIcon />
                  </IconButton>
                </div>
              ) : (
                <div className="w-full flex align-middle justify-between truncate">
                  <Typography
                    fontWeight={500}
                    noWrap
                    sx={{
                      display: "flex",
                      fontSize: "1.2rem",
                      my: "auto",
                      width: "20rm",
                    }}
                  >
                    {groupDetail.groupTitle}
                  </Typography>
                  <IconButton
                    onClick={() => setEditGroupTitle(true)}
                    sx={{ display: "flex" }}
                  >
                    <EditNoteRoundedIcon />
                  </IconButton>
                </div>
              )}
            </Stack>

            {/* Email entering */}
            <Stack
              sx={{ display: "flex", alignItems: "center" }}
              direction={"row"}
              gap={2}
            >
              <GroupIcon sx={{ display: "flex", my: "auto" }} />
              <Autocomplete
                clearIcon={false}
                fullWidth
                options={inviteMembers.available_members.filter(
                  (member) =>
                    !groupMemberList.some(
                      (groupMember) =>
                        groupMember.user_email === member.user_email
                    )
                )}
                id="group-member"
                autoHighlight
                getOptionLabel={(option) => option.user_email}
                isOptionEqualToValue={(option, value) => {
                  return option.user_email === value.user_email;
                }}
                filterOptions={filterOptions}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props as { key: string };
                  return (
                    <Stack
                      component={"li"}
                      direction={"row"}
                      alignItems={"center"}
                      gap={1}
                      key={key}
                      {...otherProps}
                      sx={{
                        overflow: "hidden",
                        ml: 1,
                      }}
                      onClick={handleOptionClick(option)}
                    >
                      <Avatar
                        alt={option.user_name}
                        src={option.user_profile_img}
                        sx={{
                          width: 32,
                          height: 32,
                        }}
                      />
                      <Stack
                        sx={{
                          overflow: "hidden",
                        }}
                      >
                        <Stack direction={"row"} gap={1}>
                          <Typography variant="body2" noWrap>
                            {option.user_name}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" noWrap>
                          {option.user_email}
                        </Typography>
                      </Stack>
                    </Stack>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    onChange={handleSearchInput}
                    value={searchInput}
                    inputRef={emailInputRef}
                    placeholder="Enter member's email to be added"
                    {...params}
                  />
                )}
              />
              {/* <IconButton
                onClick={() => {
                  if (!emailInputRef.current?.value) return;
                  const newMember = inviteMembers.available_members.find(
                    (member) =>
                      member.user_email === emailInputRef.current?.value
                  );
                  if (!newMember) {
                    return console.log("Member not found");
                  }
                  const member: EditGroupMember = {
                    user_id: newMember.user_id,
                    user_profile_img: newMember.user_profile_img,
                    user_email: newMember.user_email,
                    user_name: newMember.user_name,
                    isNew: true,
                  };

                  if (
                    groupMemberList.some(
                      (member) => member.user_email === newMember.user_email
                    )
                  ) {
                    return;
                  }

                  setGroupMemberList([...groupMemberList, member]);
                  emailInputRef.current.value = "";
                  console.log(emailInputRef.current.value);
                }}
              >
                {emailInputRef.current?.value &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                  emailInputRef.current?.value
                ) &&
                searchInput !== "" ? (
                  <AddRoundedIcon
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  />
                ) : (
                  <AddRoundedIcon />
                )}
              </IconButton> */}
            </Stack>

            {/* Members: */}
            <Box sx={{ paddingLeft: 2, overflow: "auto" }}>
              <EditMember member={editGroupDetail.owner_info} isOwner={true} />
              {groupMemberList?.map((member, index) => (
                <EditMember
                  member={member}
                  key={index}
                  onRemove={() => {
                    setGroupMemberList(
                      groupMemberList.filter(
                        (filteredMember) =>
                          filteredMember.user_email !== member.user_email
                      )
                    );
                  }}
                />
              ))}

              {pendingGroupMembers.length > 0 && (
                <div className="mb-[0.7rem] mt-[1.5rem]">
                  <Typography variant="body2" fontWeight={500} noWrap>
                    PENDING MEMBER
                  </Typography>
                  <Divider />
                </div>
              )}

              {pendingGroupMembers?.map((member, index) => (
                <EditMember
                  member={member}
                  isPending={true}
                  key={index}
                  onRemove={() => {
                    setPendingGroupMembers(
                      pendingGroupMembers.filter(
                        (filteredMember) =>
                          filteredMember.user_email !== member.user_email
                      )
                    );
                    handleRemovePendingMember(member.user_id);
                  }}
                />
              ))}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            onClick={onSave}
            sx={{
              display: "flex",
            }}
            disabled={saving}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// Done
function GroupPermissionDialog({
  groupDetail,
  open,
  handlePermission,
  closeDialog,
  onSave,
}: {
  groupDetail: GroupDetail;
  open: boolean;
  handlePermission: (permission: Permissions) => void;
  closeDialog: () => void;
  onSave?: () => void;
}) {
  const [permissions, setPermissions] = useState<Permissions>({
    create_task: false,
    edit_task: false,
    delete_task: false,
    upload_file: false,
    edit_file: false,
    delete_file: false,
    add_schedule: false,
    edit_schedule: false,
    delete_schedule: false,
  });
  const [initialPermissions, setInitialPermissions] = useState<Permissions>({});

  useEffect(() => {
    if (open) {
      getMemberPermission();
    }
  }, [open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPermissions = {
      ...permissions,
      [event.target.name]: event.target.checked,
    };

    setPermissions(updatedPermissions);
  };

  const handleSubmit = () => {
    handlePermission(permissions);
  };
  const { data: session } = useSession();
  const getMemberPermission = async () => {
    if (session) {
      const response = await getCollabPermissions(
        session.user.token,
        groupDetail.groupId
      );

      if (response.error) {
        console.error("Failed to get group permissions", response.error);
        return;
      }

      const permissions = response.data.permissions as Permissions;
      setPermissions({
        create_task: permissions["Create task"],
        edit_task: permissions["Edit task"],
        delete_task: permissions["Delete task"],
        upload_file: permissions["Upload file"],
        edit_file: permissions["Edit file"],
        delete_file: permissions["Delete file"],
        add_schedule: permissions["Add schedule event"],
        edit_schedule: permissions["Edit schedule event"],
        delete_schedule: permissions["Delete schedule event"],
      });
      setInitialPermissions({
        create_task: permissions["Create task"],
        edit_task: permissions["Edit task"],
        delete_task: permissions["Delete task"],
        upload_file: permissions["Upload file"],
        edit_file: permissions["Edit file"],
        delete_file: permissions["Delete file"],
        add_schedule: permissions["Add schedule event"],
        edit_schedule: permissions["Edit schedule event"],
        delete_schedule: permissions["Delete schedule event"],
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "1.5rem",
          padding: 1,
          minHeight: "30rem",
          width: "30rem",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          noWrap
          variant="h5"
          sx={{
            fontWeight: "550",
            px: 2,
          }}
        >
          {`${groupDetail.groupTitle}'s Permission`}
        </Typography>

        <IconButton
          onClick={closeDialog}
          color="inherit"
          sx={{
            display: "flex",
            position: "absolute",
            right: "1rem",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Stack>
            <Typography variant="body1" fontWeight={500} noWrap color={"blue"}>
              What can members of this group do?
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="body1" fontWeight={500} noWrap>
              Task Management
            </Typography>
            <Stack>
              <FormGroup
                sx={{
                  marginLeft: "1rem",
                  gap: "0",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.create_task}
                      onChange={handleChange}
                      name="create_task"
                    />
                  }
                  label="Create task"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.edit_task}
                      onChange={handleChange}
                      name="edit_task"
                    />
                  }
                  label="Edit task"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.delete_task}
                      onChange={handleChange}
                      name="delete_task"
                    />
                  }
                  label="Delete task"
                />
              </FormGroup>
            </Stack>
          </Stack>
          <Stack>
            <Typography variant="body1" fontWeight={500} noWrap>
              File Management
            </Typography>
            <Stack>
              <FormGroup
                sx={{
                  marginLeft: "1rem",
                  gap: "0",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.upload_file}
                      onChange={handleChange}
                      name="upload_file"
                    />
                  }
                  label="Upload file"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.edit_file}
                      onChange={handleChange}
                      name="edit_file"
                    />
                  }
                  label="Edit file"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.delete_file}
                      onChange={handleChange}
                      name="delete_file"
                    />
                  }
                  label="Delete file"
                />
              </FormGroup>
            </Stack>
          </Stack>
          <Stack>
            <Typography variant="body1" fontWeight={500} noWrap>
              Scheduling
            </Typography>
            <Stack>
              <FormGroup
                sx={{
                  marginLeft: "1rem",
                  gap: "0",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.add_schedule}
                      onChange={handleChange}
                      name="add_schedule"
                    />
                  }
                  label="Add schedule "
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.edit_schedule}
                      onChange={handleChange}
                      name="edit_schedule"
                    />
                  }
                  label="Edit schedule "
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.delete_schedule}
                      onChange={handleChange}
                      name="delete_schedule"
                    />
                  }
                  label="Delete schedule "
                />
              </FormGroup>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            closeDialog();
            handleSubmit();
          }}
          sx={{
            display: "flex",
          }}
          disabled={
            JSON.stringify(permissions) === JSON.stringify(initialPermissions)
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
