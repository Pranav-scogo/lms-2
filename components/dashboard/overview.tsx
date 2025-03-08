"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"

// Calculate data for the last 30 days
const generateChartData = () => {
  const data = [];
  const now = new Date();
  
  // Generate labels for the last 30 days (showing just the last 7 on x-axis)
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Format the date as "Day Month" (e.g., "15 Jan")
    const name = i % 5 === 0 || i === 0 ? 
      `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}` : 
      '';
    
    // Generate random minutes of learning for each day
    // With a bit of a pattern - more activity on weekends
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseMinutes = isWeekend ? 45 : 30;
    let minutes = 0;
    
    // Add some random variation
    if (Math.random() > 0.3) { // 70% chance of activity on a given day
      minutes = Math.floor(baseMinutes + Math.random() * 60);
    }
    
    // For the last week, ensure we have data to show progress
    if (i < 7) {
      minutes = Math.max(minutes, 15 + i * 5);
    }
    
    data.push({
      name,
      minutes,
      date: date.toLocaleDateString(),
    });
  }
  
  return data;
};

export function Overview() {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate the data once when the component mounts
    setData(generateChartData());
  }, []);
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}m`}
          label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
        />
        <Tooltip 
          formatter={(value) => [`${value} minutes`, 'Study Time']}
          labelFormatter={(label, items) => {
            if (!items || items.length === 0) return label;
            return items[0].payload.date;
          }}
        />
        <Line 
          type="monotone" 
          dataKey="minutes" 
          stroke="#8b5cf6" 
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 8, strokeWidth: 1 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

