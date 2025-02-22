"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 12,
  },
  {
    name: "Feb",
    total: 18,
  },
  {
    name: "Mar",
    total: 24,
  },
  {
    name: "Apr",
    total: 35,
  },
  {
    name: "May",
    total: 42,
  },
  {
    name: "Jun",
    total: 48,
  },
  {
    name: "Jul",
    total: 55,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

