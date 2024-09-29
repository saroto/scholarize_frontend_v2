import { Metadata } from "next";

type Props = {
  params: { groupName: string; userName: string; groupId: number };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Schedule | ${decodeURIComponent(params.groupName)}`,
  };
}

export default function CollaborationGroupSchedule({ params }: Props) {

  return (
    <div className="py-4 px-8">
    </div>
  );
}
