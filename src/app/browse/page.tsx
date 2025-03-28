/** @format */

import { Metadata } from "next";
import BrowserPaper from "@/app/browse/browser_paper";
import { Box } from "@mui/material";
export const metadata: Metadata = {
  title: "Publish Research | Scholarize",
};
export default function PublishResearchPaperPage() {
  return <BrowserPaper />;
}
