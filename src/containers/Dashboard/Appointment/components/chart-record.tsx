"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Line,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const chartConfig = {
//   height: {
//     label: "Height (cm)",
//     color: "#8884d8",
//   },
//   weight: {
//     label: "Weight (kg)",
//     color: "#82ca9d",
//   },
// };

export type FetalGrowthRecord = {
  recordedAt: string;
  weekOfPregnancy: number;
  weight: number;
  height: number;
  healthCondition: string | null;
  headCircumference: number;
  abdominalCircumference: number;
  fetalHeartRate: number;
  fetalGrowthStandardModelView: {
    averageHeight: number;
    averageWeight: number;
    fetalHeartRate: number;
    minHeight: number;
    maxHeight: number;
    minWeight: number;
    maxWeight: number;
    gestationalAge: string;
    headCircumference: number;
    abdominalCircumference: number;
  };
};

type Child = {
  name: string;
  fetalGrowthRecordModelViews: FetalGrowthRecord[];
};

export function GrowthCharts({ child }: { child: Child }) {
  if (!child) return <div>No data available for children.</div>;

  const records = child.fetalGrowthRecordModelViews;
  if (!records || records.length === 0) {
    return <div>No growth records available for {child.name}.</div>;
  }

  const chartData = records.map((record) => ({
    week: record.weekOfPregnancy,
    height: record.height,
    weight: record.weight,
    standardHeight: record.fetalGrowthStandardModelView.averageHeight,
    standardWeight: record.fetalGrowthStandardModelView.averageWeight,
    minWeight: record.fetalGrowthStandardModelView.minWeight,
    maxWeight: record.fetalGrowthStandardModelView.maxWeight,
    minHeight: record.fetalGrowthStandardModelView.minHeight,
    maxHeight: record.fetalGrowthStandardModelView.maxHeight,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Growth Chart for {child.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {/* Biểu đồ Height & Weight */}

          <AreaChart
            width={1100}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
          >
            <defs>
              <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              label={{
                value: "Week of Pregnancy",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number | string, name: string) => [
                value,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
              labelFormatter={(label) => `Week: ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="height"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorHeight)"
              name="Height (cm)"
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorWeight)"
              name="Weight (kg)"
            />
            {/* Tiêu chuẩn (Standard) */}
            <Line
              type="monotone"
              dataKey="standardHeight"
              stroke="red"
              strokeDasharray="5 5"
              name="Standard Height (cm)"
            />
            <Line
              type="monotone"
              dataKey="standardWeight"
              stroke="red"
              strokeDasharray="5 5"
              name="Standard Weight (kg)"
            />
            {/* Standard Min/Max */}
            <Line
              type="monotone"
              dataKey="minHeight"
              stroke="blue"
              strokeDasharray="5 5"
              name="Min Height (cm)"
            />
            <Line
              type="monotone"
              dataKey="maxHeight"
              stroke="blue"
              strokeDasharray="5 5"
              name="Max Height (cm)"
            />
            <Line
              type="monotone"
              dataKey="minWeight"
              stroke="green"
              strokeDasharray="5 5"
              name="Min Weight (kg)"
            />
            <Line
              type="monotone"
              dataKey="maxWeight"
              stroke="green"
              strokeDasharray="5 5"
              name="Max Weight (kg)"
            />
          </AreaChart>

          {/* Danh sách dữ liệu Health Condition & Circumferences */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Additional Growth Data:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <div className="grid grid-cols-2">
                {records.map((record, index) => (
                  <li key={index}>
                    <strong>Week {record.weekOfPregnancy}:</strong> <br />
                    <span className="italic">
                      Record{" "}
                      {new Date(record.recordedAt).toLocaleDateString("vi-VN")}
                    </span>
                    <ul className="list-none pl-3">
                      <li>
                        🧠 Head Circumference:{" "}
                        <span className="font-bold text-blue-500">
                          {record.headCircumference}
                        </span>{" "}
                        cm (Standard:{" "}
                        {record.fetalGrowthStandardModelView.headCircumference}{" "}
                        cm)
                      </li>
                      <li>
                        🩺 Abdominal Circumference:{" "}
                        <span className="font-bold text-blue-500">
                          {record.abdominalCircumference}
                        </span>{" "}
                        cm (Standard:{" "}
                        {
                          record.fetalGrowthStandardModelView
                            .abdominalCircumference
                        }{" "}
                        cm)
                      </li>
                      <li>
                        ❤️ Fetal Heart Rate:{" "}
                        <span className="font-bold text-blue-500">
                          {record.fetalHeartRate}
                        </span>{" "}
                        bpm (Standard:{" "}
                        {record.fetalGrowthStandardModelView.fetalHeartRate}{" "}
                        bpm)
                      </li>
                      <li>
                        🍼 Gestational Age:{" "}
                        {record.fetalGrowthStandardModelView.gestationalAge}{" "}
                        weeks
                      </li>
                      <li>
                        📏 Standard Weight:{" "}
                        {record.fetalGrowthStandardModelView.minWeight} -{" "}
                        {record.fetalGrowthStandardModelView.maxWeight} kg
                      </li>
                      <li>
                        📐 Standard Height:{" "}
                        {record.fetalGrowthStandardModelView.minHeight} -{" "}
                        {record.fetalGrowthStandardModelView.maxHeight} cm
                      </li>
                      <li>
                        <strong className="italic">Health Condition:</strong>{" "}
                        {record.healthCondition || "No health issues recorded."}
                      </li>
                    </ul>
                  </li>
                ))}
              </div>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
