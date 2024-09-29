"use client";
import { JoinGroup } from "@/app/api/service/handleGroups";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";

type Props = {
  params: { token: string };
};

export default function JoinCollab({ params }: Props) {
  const router = useRouter();
  const [initiated, setInitiated] = useState(false);
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("Joining group...");

  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      setTimeout(() => {
        handleJoinGroup();
      }, 200);
    }
  }, [initiated]);

  const handleJoinGroup = async () => {
    await JoinGroup(params.token).then((response) => {
      if (response.success) {
        setJoined(true);
        setMessage(response.data.message);
      } else {
        setMessage("Failed to join group. Redirecting to home page...");
        setTimeout(() => {
          router.replace("/");
        }, 3000);
      }
    });
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4">{message}</div>
        <div className="text-2xl font-bold mb-4">
          {joined && (
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                "&:hover": {
                  backgroundColor: "purple",
                  color: "white",
                },
              }}
              onClick={() => router.replace("/dashboard/collaboration/groups")}
            >
              Go to Collaboration
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
