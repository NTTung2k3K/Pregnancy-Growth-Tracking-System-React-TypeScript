import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentMainDashboard } from "../IPayment";
import { formatDate } from "@/lib/text";

const columnFields: { key: keyof PaymentMainDashboard; label: string }[] = [
  { key: "paymentMethod", label: "Payment Method" },
];

export const columnsPayment: ColumnDef<PaymentMainDashboard>[] = [
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
      return <p>{formatDate(row.original.paymentDate)}</p>;
    },
  },
  {
    accessorKey: "total",
    header: () => {
      return <Button variant="ghost">Total</Button>;
    },
    cell: ({ row }) => {
      return (
        <p>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original.amount ?? 0)}
        </p>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => {
      return <Button variant="ghost">Name</Button>;
    },
    cell: ({ row }) => {
      return <p>{row.original.userMembership.user.fullName}</p>;
    },
  },
  {
    accessorKey: "phone",
    header: () => {
      return <Button variant="ghost">Phone</Button>;
    },
    cell: ({ row }) => {
      return <p>{row.original.userMembership.user.phoneNumber}</p>;
    },
  },
  {
    accessorKey: "packageName",
    header: () => {
      return <Button variant="ghost">Package Name</Button>;
    },
    cell: ({ row }) => {
      return <p>{row.original.userMembership.package.packageName}</p>;
    },
  },
];
