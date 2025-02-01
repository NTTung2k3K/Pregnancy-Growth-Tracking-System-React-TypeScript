import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import ActionRow from "@/containers/Dashboard/Payment/components/action-row";
import { Payment } from "@/containers/Dashboard/Payment";

const columnFields: { key: keyof Payment; label: string }[] = [
  { key: "paymentMethod", label: "Payment Method" },
  { key: "paymentDate", label: "Payment Date" },
];

export const columns: ColumnDef<Payment>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<Payment> }) => {
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
    accessorKey: "userMembership.user.fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name of buyer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{row.original.userMembership.user.fullName}</p>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = Number(row.getValue("amount")) || 0;
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
      const isFailed = row.getValue("status") == "Failed";
      return (
        <Badge className={cn("bg-green-400", isFailed && "bg-red-400")}>
          {isFailed ? "Failed" : "Success"}
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
