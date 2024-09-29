import { Metadata } from "next";

type Props = {
  params: { groupName: string; selectedGroups: any };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `All Schedule | Scholarize`,
  };
}

export default function CollaborationGroupSchedule({ params }: Props) {
  return (
    <div className="py-4 px-8">
    </div>
  );
}
