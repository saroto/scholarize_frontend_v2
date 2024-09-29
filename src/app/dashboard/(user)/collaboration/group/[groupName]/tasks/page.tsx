/** @format */

import { Metadata } from "next";
import CollaborationGroupTaskClient from "./tasks_client";
type Props = {
  params: { groupName: string };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Tasks | ${decodeURIComponent(params.groupName)}`,
  };
}

export default function CollaborationGroupTask({ params }: Props) {
  return (
    <>
      <CollaborationGroupTaskClient params={params} />
    </>
  );
}
