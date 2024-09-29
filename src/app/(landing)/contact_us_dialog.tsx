// TODO: Delete this file
"use client";

import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    Input,
    InputLabel,
    Stack,
    Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export default function ContactUsDialog() {
    const [open, setOpen] = useState<boolean>(false);

    // just a example variable to demonstrate error message in form input
    const error = true;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <span
                onClick={handleClickOpen}
                className="underline font-medium hover:cursor-pointer"
            >
                here!
            </span>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <Stack
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        direction={"row"}
                    >
                        <span></span>
                        <span>Contact US</span>
                        <Tooltip
                            title="Close"
                            sx={{
                                float: "right",
                            }}
                        >
                            <IconButton onClick={handleClose} color="inherit">
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <form action="">
                        <Stack direction={"row"} spacing={4} m={2}>
                            <FormControl error={error} variant="standard">
                                <InputLabel htmlFor="firstName">
                                    First name
                                </InputLabel>
                                <Input id="firstName" name="firstName" />
                                <FormHelperText
                                    id="firstName"
                                    sx={{
                                        opacity: error ? "100%" : "0%",
                                    }}
                                >
                                    Error
                                </FormHelperText>
                            </FormControl>
                            <FormControl error={error} variant="standard">
                                <InputLabel htmlFor="lastName">
                                    Last name
                                </InputLabel>
                                <Input id="lastName" name="lastName" />
                                <FormHelperText
                                    id="lastName"
                                    sx={{
                                        opacity: error ? "100%" : "0%",
                                    }}
                                >
                                    Error
                                </FormHelperText>
                            </FormControl>
                        </Stack>
                        <Stack spacing={4} m={2}>
                            <FormControl error={error} variant="standard">
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" name="email" />
                                <FormHelperText
                                    id="email"
                                    sx={{
                                        opacity: error ? "100%" : "0%",
                                    }}
                                >
                                    Error
                                </FormHelperText>
                            </FormControl>
                        </Stack>
                        <Stack spacing={4} m={2}>
                            <FormControl error={error} variant="standard">
                                <InputLabel htmlFor="description">
                                    Description
                                </InputLabel>
                                <Input
                                    multiline
                                    maxRows={5}
                                    id="description"
                                    name="description"
                                />
                                <FormHelperText
                                    id="description"
                                    sx={{
                                        opacity: error ? "100%" : "0%",
                                    }}
                                >
                                    Error
                                </FormHelperText>
                            </FormControl>
                        </Stack>
                        <Stack justifyContent={"end"} direction={"row"}>
                            <Button variant="outlined">
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
