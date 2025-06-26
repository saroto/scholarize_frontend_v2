import { Button, Container, InputAdornment, TextField } from "@mui/material";
import CustomButton from "../customButton";
import SendIcon from "@mui/icons-material/Send";
import CustomTextField from "../CustomTextField";
import { ContainerProps } from "@mui/system";
import { ButtonProps } from "@mui/material/Button";
import { TextFieldProps } from "@mui/material/TextField";

interface ChatInputProps extends Omit<ContainerProps, "children"> {
  onButtonClick?: () => void;
  buttonProps?: Omit<ButtonProps, "size" | "endIcon" | "children">;
  inputProps?: Omit<TextFieldProps, "fullWidth" | "variant">;
}

export default function ChatInput({
  onButtonClick,
  buttonProps = {},
  inputProps = {},
  ...containerProps
}: ChatInputProps) {
  return (
    <Container {...containerProps}>
      <CustomTextField
        fullWidth
        variant="outlined"
        {...inputProps}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                size="small"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={onButtonClick}
                {...buttonProps}
                sx={{
                  height: "35px",
                  borderRadius: "16px",
                  paddingInline: "20px",
                  boxShadow: "none",
                  ...buttonProps.sx,
                }}
              >
                Send
              </Button>
            </InputAdornment>
          ),
          ...inputProps.InputProps,
        }}
        sx={{
          backgroundColor: "background.paper",
          borderRadius: "16px",
          ...inputProps.sx,
        }}
      />
    </Container>
  );
}
