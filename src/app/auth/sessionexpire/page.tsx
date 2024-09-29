/** @format */

"use client";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
export default function ErrorPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="bg-gray-300 flex items-center justify-center min-h-screen">
      <div
        className="border-[0.2rem] border-[#000] p-6 py-6 rounded-[2rem] w-[40%]
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
