import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { BlogMainDashboard } from "../../IBlog";

const columnFields: { key: keyof BlogMainDashboard; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "likesCount", label: "Likes" },
  { key: "week", label: "Week" },
];

export const columnsLike: ColumnDef<BlogMainDashboard>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: () => {
      return <Button variant="ghost">{label}</Button>;
    },
  })),
  {
    accessorKey: "author",
    header: () => {
      return <Button variant="ghost">Author</Button>;
    },
    cell: ({ row }) => {
      return <p>{row.original.authorResponseModel.fullName}</p>;
    },
  },
];
