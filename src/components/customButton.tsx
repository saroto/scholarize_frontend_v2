/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Button, ButtonProps } from "@mui/material";
import { forwardRef } from "react";

interface CustomButtonProps extends ButtonProps {}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        sx={{
          backgroundColor: "primary.main",
          //   width: "100%",
          paddingBlock: "8px",
          borderRadius: "12px",
          color: "white",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "primary.main",
            opacity: 0.8,
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
