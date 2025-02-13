import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { BlogMainDashboard } from "../../IBlog";
import { formatDate } from "@/lib/text";

const columnFields: { key: keyof BlogMainDashboard; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "viewCount", label: "Views" },
  { key: "week", label: "Week" },
];

export const columnsView: ColumnDef<BlogMainDashboard>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: () => {
      return <Button variant="ghost">{label}</Button>;
    },
  })),
  {
    accessorKey: "date",
    header: () => {
      return <Button variant="ghost">Date</Button>;
    },
    cell: ({ row }) => {
      return <p>{formatDate(row.original.createdTime)}</p>;
    },
  },
];
