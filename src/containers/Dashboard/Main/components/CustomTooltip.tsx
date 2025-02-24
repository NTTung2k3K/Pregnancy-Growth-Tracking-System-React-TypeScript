import { TooltipProps } from "recharts"; // Import correct type for Tooltip props

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formatToVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
};

// Define custom tooltip component with proper TypeScript types
export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ payload }) => {
  if (!payload || payload.length === 0 || !payload[0]?.payload?.month) return null;

  const monthIndex = payload[0].payload.month;
  const monthLabel = monthNames[monthIndex - 1] || "Unknown";

  return (
    <div className="p-2 bg-white shadow-md rounded-md">
      <p className="font-bold">{monthLabel}</p>
      {payload.map((entry, index) => {
        // Ensure entry and its properties are defined
        if (!entry || typeof entry.value !== "number" || !entry.name) return null;

        return (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes("Total Amount")
              ? formatToVND(entry.value) // Format only "Total Amount" as VND
              : entry.value} {/* Transactions remain as a plain number */}
          </p>
        );
      })}
    </div>
  );
};

