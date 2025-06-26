/** @format */

"use client";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
export default function ErrorPage() {
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="bg-gray-300 flex items-center justify-center min-h-screen w-full">
      <div
        className="border-[0.2rem] border-[#000] p-6 py-6 rounded-[2rem] max-w-[600px] 
      bg-[#f5f5f5]
      "
      >
        <div className="text-4xl font-mono text-center">SESSION EXPIRE</div>
        <p className="text-lg text-left font-mono my-8">
          Session has expired. Please sign in again or go back to the home page.
        </p>
        <div className="flex justify-center flex-col gap-2">
          <Button
            variant="contained"
            size="large"
            onClick={handleSignIn}
            sx={{
              display: "flex",
              borderRadius: "1rem",
              minWidth: "50%",
              backgroundColor: "#000",
              "&:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            Sign In
          </Button>
          <div className="flex w-full justify-center">
            <a
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hover:underline hover:text-[blue] cursor-pointer"
            >
              Back to home page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
