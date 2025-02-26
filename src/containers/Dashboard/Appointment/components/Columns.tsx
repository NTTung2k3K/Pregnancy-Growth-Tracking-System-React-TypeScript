import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Appointment } from "@/containers/Dashboard/Appointment";
import ActionRow from "@/containers/Dashboard/Appointment/components/action-row";
import { cn, getSlotString } from "@/lib/utils";

const columnFields: { key: keyof Appointment; label: string }[] = [];

export const columns: ColumnDef<Appointment>[] = [
  ...columnFields.map(({ key, label }) => ({
    accessorKey: key,
    header: ({ column }: { column: Column<Appointment> }) => {
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
    accessorKey: "user.fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{row.original.user.fullName}</p>;
    },
  },
  {
    accessorKey: "user.phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{row.original.user.phoneNumber}</p>;
    },
  },
  {
    accessorKey: "appointmentTemplate.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Case
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // cell: ({ row }) => {
    //   const price = Number(row.getValue("appointmentTemplate.name")) || 0;
    //   return <p>{`${Math.round(price).toLocaleString()} VND`}</p>;
    // },
  },
  {
    accessorKey: "childs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Child Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <ul className="list-disc pl-4">
          {row.original.childs.map((child, index) => (
            <li key={index}>{child.name}</li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "appointmentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date & Slot
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <ul className="list-disc pl-4">
          {new Date(row.original.appointmentDate).toLocaleDateString("vi-VN")} |
          Slot: {getSlotString(row.original.appointmentSlot)}
        </ul>
      );
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
      const status = row.getValue("status") as string;

      return (
        <Badge
          className={cn("font-bold", {
            "bg-green-500": row.getValue("status") === "Completed",
            "bg-yellow-500": row.getValue("status") === "Pending",
            "bg-red-500": [
              "NoShow",
              "Failed",
              "CancelledByUser",
              "CancelledByDoctor",
            ].includes(row.getValue("status")),
            "bg-blue-500": row.getValue("status") === "InProgress",
            "bg-violet-500": row.getValue("status") === "Confirmed",
            "bg-pink-500": row.getValue("status") === "Rescheduled",
          })}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, status } = row.original;

      return <ActionRow id={id} status={status} />;
    },
  },
];
