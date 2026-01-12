"use client"; // Required for charts in Next.js

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis
} from "recharts";

type EsgRadarProps = {
  data: {
    subject: string;
    A: number; // The Metric Value
    fullMark: number;
  }[];
};

export default function EsgRadar({ data }: EsgRadarProps) {
  return (
    <div className="h-[300px] w-full flex items-center justify-center bg-void-800 border border-void-700">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          {/* The Web Grid */}
          <PolarGrid stroke="#333" />
          
          {/* The Labels (Env, Soc, Gov) */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#888", fontSize: 12, fontFamily: "monospace" }} 
          />
          
          {/* The Scale (0 - 100) */}
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          
          {/* The Shape */}
          <Radar
            name="ESG Score"
            dataKey="A"
            stroke="#ccff00" // Axiom Acid
            strokeWidth={2}
            fill="#ccff00"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}