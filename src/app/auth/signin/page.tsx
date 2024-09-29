/** @format */

"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
export default function SignInPage() {
  const [callbackUrl, setCallbackUrl] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const newCallbackUrl =
      searchParams?.get("callbackUrl") ||
      `${window.location.origin}/dashboard/repository/research-library`;
    setCallbackUrl(newCallbackUrl);
  }, [searchParams]);

  useEffect(() => {
    if (callbackUrl) {
      signIn("google", {
        callbackUrl: callbackUrl,
      });
    }
  }, [callbackUrl]);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4">Redirecting...</div>
        <p className="text-lg text-gray-700">
          You will be redirected in a few seconds
        </p>
      </div>
    </div>
  );
}
