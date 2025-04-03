import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

// Extend MUI's TextField with custom styles
const CustomTextField = styled((props: TextFieldProps) => (
  <TextField {...props} variant="outlined" fullWidth />
))(({ theme }) => ({
  "& .MuiInputLabel-root": {
    color: "#979C9E",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    borderColor: "#ddd",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderRadius: "16px",
      borderColor: "#ddd",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderRadius: "16px",
      borderColor: "#ddd",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      borderRadius: "16px",
      borderColor: "#ddd",
    },
  },
}));

export default CustomTextField;
