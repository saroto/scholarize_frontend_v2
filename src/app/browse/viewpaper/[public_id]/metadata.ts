// /app/browse/viewpaper/[id]/metadata.ts
import { Metadata } from "next";
import { GetPublicPaperDetailById } from "@/app/api/service/getPublicPaperDetailById"; // adjust path
import { redirect } from "next/navigation";

interface ViewPaperParams {
  public_id: string;
}

export async function generateMetadata({
  params,
}: {
  params: ViewPaperParams;
}): Promise<Metadata> {
  const id = params.public_id;
  const fetchPaper = await GetPublicPaperDetailById(id);

  if (!fetchPaper.success || !fetchPaper.data?.title) {
    redirect("/browse");
  }

  const paper = fetchPaper.data;

  return {
    title: `${paper.title} - Scholarize`,
    description: paper.abstract || "Scholarize.",
    openGraph: {
      images: [
        {
          url: paper.thumbnailUrl || "/logo.png",
          alt: paper.title,
          type: "image/png",
          width: 800,
          height: 400,
        },
      ],
    },
    twitter: {
      images: [
        {
          url: paper.thumbnailUrl || "/logo.png",
          alt: paper.title,
          type: "image/png",
          width: 800,
          height: 400,
        },
      ],
    },
  };
}
