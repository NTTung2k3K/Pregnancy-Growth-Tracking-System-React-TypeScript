import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import ActionRow from "@/containers/Dashboard/MembershipPackage/components/action-row";
export interface MembershipPackage {
  id: number;
  packageName: string;
  description: string;
  price: number;
  duration: number;
  status: string;
  packageLevel: string;
  originalPrice: number;
  imageUrl: string;
  discount: number;
  showPriority: number;
}

const columnFields: { key: keyof MembershipPackage; label: string }[] = [
  { key: "packageName", label: "Package Name" },
  { key: "duration", label: "Duration" },
];

export const columns: ColumnDef<MembershipPackage>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<MembershipPackage> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  })),
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = Number(row.getValue("price")) || 0;
      return <p>{`${Math.round(price).toLocaleString()} VND`}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActive = row.getValue("status") == "Active";
      return (
        <Badge className={cn("bg-slate-500", isActive && "bg-emerald-400")}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return <ActionRow id={id} />;
    },
  },
];
