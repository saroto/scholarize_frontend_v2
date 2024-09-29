import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function InvalidToken({
  bool,
  token,
  Messagestring,
}: Readonly<{
  Messagestring: string | undefined;
  token: string | undefined;
  bool: boolean;
}>) {
  const [open, setOpen] = useState(bool);
  const route = useRouter();
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signOut();
    route.replace("/");
    if (res) {
      setOpen(false);
    }
  };
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {Messagestring}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <form onSubmit={handleLogout}>
          <Button type="submit" autoFocus>
            OK
          </Button>
        </form>
      </DialogActions>
    </Dialog>
  );
}
