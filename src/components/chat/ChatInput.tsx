import { Button, Container, InputAdornment, TextField } from "@mui/material";
import CustomButton from "../customButton";
import SendIcon from "@mui/icons-material/Send";
import CustomTextField from "../CustomTextField";

export default function ChatInput() {
  return (
    <Container>
      <CustomTextField
        fullWidth
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <CustomButton
                size="small"
                endIcon={<SendIcon />}
                sx={{
                  height: "35px",
                  borderRadius: "16px",
                  paddingInline: "20px",
                }}
              >
                Send
              </CustomButton>
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "background.paper",
        }}
      />
    </Container>
  );
}
