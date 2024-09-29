import { Metadata } from "next";
import FileStorageClient from "./file_storage_client";

type Props = {
  params: { groupName: string };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `File Storage | ${decodeURIComponent(params.groupName)}`,
  };
}

export default async function CollaborationGroupFileStorage({ params }: Props) {
  return <FileStorageClient groupName={params.groupName} />;
}
