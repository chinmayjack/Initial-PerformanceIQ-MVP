"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CompletionChart({ data }: { data: { name: string; progress: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="progress" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DistributionChart({ data }: { data: { range: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="range" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DepartmentReadinessChart({ data }: { data: { department: string; readiness: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="department" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="readiness" fill="#7c3aed" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SentimentTrendChart({ data }: { data: { month: string; Positive: number; Neutral: number; Improvement: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="Positive" stroke="#059669" strokeWidth={2} />
        <Line type="monotone" dataKey="Neutral" stroke="#64748b" strokeWidth={2} />
        <Line type="monotone" dataKey="Improvement" stroke="#d97706" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RiskPieChart({ data }: { data: { name: string; value: number }[] }) {
  const colors = ["#2563eb", "#f59e0b", "#e11d48"];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={92} label>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
