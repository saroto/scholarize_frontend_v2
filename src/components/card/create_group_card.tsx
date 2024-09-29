/** @format */

"use client";
import IconButton from "@mui/material/IconButton";
import SubjectIcon from "@mui/icons-material/Subject";
import GroupIcon from "@mui/icons-material/Group";
import {
  CreateGroup,
  InviteMembers,
  getInviteMembersCreate,
} from "@/app/api/service/handleGroups";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseIcon from "@mui/icons-material/Close";
import { EditGroupMember } from "./group_card";
import { useSession } from "next-auth/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

export function CreateGroupMember({
  member,
  onRemove,
}: Readonly<{
  member: EditGroupMember;
  onRemove?: () => void;
}>) {
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
                  color: "black",
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
                ) : null}
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontSize: "0.9rem",
                  color: "black",
                }}
              >
                {member.user_email}
              </Typography>
            </Box>
          </Box>

          <IconButton
            sx={{
              display: "flex-inline",
            }}
            onClick={onRemove}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
}

export default function CreateGroupCard({
  onGroupCreate,
}: {
  onGroupCreate: () => void;
}) {
  const [createGroupDialog, setCreateGroupDialog] = useState<boolean>(false);
  const openCreateGroupDialog = () => {
    setCreateGroupDialog(true);
  };

  const closeCreateGroupDialog = () => {
    setCreateGroupDialog(false);
  };

  return (
    <>
      <CreateGroupDialog
        closeDialog={() => {
          closeCreateGroupDialog();
        }}
        open={createGroupDialog}
        onGroupCreate={onGroupCreate}
      />
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
          onClick={openCreateGroupDialog}
          title="Create a group"
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
            backgroundColor: "#F5F5F5",
            "&:hover": {
              filter: "contrast(0.85)",
              cursor: "pointer",
            },
          }}
        >
          <Stack
            sx={{
              width: "100%",
              height: "100%",
            }}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <AddRoundedIcon
              sx={{
                width: "7rem",
                height: "7rem",
                color: "#CFCFCF",
              }}
            />
          </Stack>
        </Card>
      </Box>
    </>
  );
}

function CreateGroupDialog({
  open,
  closeDialog,
  onGroupCreate,
}: {
  open: boolean;
  closeDialog: () => void;
  onGroupCreate: () => void;
}) {
  // currently this is just a temporary implementation, u can change ref to other technique of getting the input, eg form, useState
  const emailInputRef = useRef<HTMLInputElement>();

  const [newGroupTitle, setNewGroupTitle] = useState<string>("");
  const { data: session } = useSession();
  const [inviteMembers, setInviteMembers] = useState<InviteMembers>({
    available_members: [],
  });
  const [creating, setCreating] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [groupMemberList, setGroupMemberList] = useState<EditGroupMember[]>([]);

  const handleCloseDialog = () => {
    closeDialog();
    setGroupMemberList([]);
    setNewGroupTitle("");
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
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

  // useEffect(() => {
  //   if (session?.user?.token && open) {
  //     getInviteMembersCreate(session, searchInput).then((data) => {
  //       setInviteMembers(data);
  //     });
  //   }
  // }, [open]);

  useEffect(() => {
    if (session?.user?.token && searchInput && open) {
      getInviteMembersCreate(session, searchInput).then((data) => {
        setInviteMembers(data);
      });
    }
  }, [searchInput]);

  useEffect(() => {
    if (newGroupTitle === "" && groupMemberList.length === 0) {
      setCreating(true);
    } else {
      setCreating(false);
    }
  }, [newGroupTitle, groupMemberList]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    const regex = /^[A-Za-z0-9\s-()]+$/;
    if (!regex.test(event.currentTarget["collab_name"].value)) {
      toast.error("Collab name should not contain special characters");
      setCreating(false);
      return;
    }

    if (event.currentTarget["collab_name"].length > 50) {
      toast.error("Collab name should not exceed 50 characters");
      setCreating(false);
      return;
    }

    const formToSend = new FormData(event.currentTarget);
    if (groupMemberList.length !== 0) {
      groupMemberList.forEach((member) => {
        formToSend.append("member_ids", member.user_id.toString());
      });
    }
    CreateGroup({
      data: formToSend,
      token: session?.user.token || "",
    }).then((res) => {
      if (res?.success) {
        handleCloseDialog();
        setGroupMemberList([]);
        onGroupCreate();
        toast.success("Group created successfully");
      } else {
        toast.error(res?.error.error);
      }
      setCreating(false);
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
            Create Collaboration
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
              <SubjectIcon
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <div className="flex w-full">
                <TextField
                  fullWidth
                  id="group-title"
                  variant="standard"
                  name="collab_name"
                  placeholder="Enter group title"
                  value={newGroupTitle}
                  onChange={(e) => {
                    setNewGroupTitle(e.target.value);
                  }}
                />
                <IconButton
                  sx={{
                    display: "flex",
                    marginLeft: 2,
                    visibility: newGroupTitle ? "visible" : "hidden",
                  }}
                  onClick={() => {
                    setNewGroupTitle("");
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
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

                  if (emailInputRef.current) {
                    emailInputRef.current.value = "";
                  }
                }}
              >
                <AddRoundedIcon />
              </IconButton> */}
            </Stack>

            {/* Members: */}
            <Box sx={{ paddingLeft: 2, overflow: "auto" }}>
              {groupMemberList?.map((member, index) => (
                <CreateGroupMember
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
            sx={{
              display: "flex",
            }}
            disabled={creating}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
