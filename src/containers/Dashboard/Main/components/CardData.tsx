import { Users } from "lucide-react";

interface CardDataProps {
  data: number | undefined;
  description: string;
}

const CardData = ({ data, description }: CardDataProps) => {
  return (
    <div className="w-64 bg-slate-100 flex flex-col border p-6 rounded-lg">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
        <Users />
      </div>
      <p className="text-xl font-bold">{data} users</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default CardData;
