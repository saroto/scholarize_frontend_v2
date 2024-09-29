/** @format */

"use client";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
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
        <div className="text-4xl font-mono text-center">SIGN IN ERROR</div>
        <p className="text-lg text-center font-mono my-8">
          Please sign in with Paragon International University's email address
          to access Scholarize.
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
            Back to Sign In
          </Button>
          <div className="flex w-full justify-center">
            <a href="/" className="hover:underline hover:text-[blue]">
              Back to home page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
