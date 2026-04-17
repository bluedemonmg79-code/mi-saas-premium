import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', ingresos: 12000 },
  { name: 'Feb', ingresos: 19000 },
  { name: 'Mar', ingresos: 15000 },
  { name: 'Abr', ingresos: 27000 },
  { name: 'May', ingresos: 22000 },
  { name: 'Jun', ingresos: 35000 },
  { name: 'Jul', ingresos: 42500 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid var(--accent-cyan)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        color: '#fff'
      }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{label}</p>
        <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

function DashboardChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="rgba(255,255,255,0.3)" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value / 1000}k`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="ingresos" 
            stroke="var(--accent-cyan)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorIngresos)" 
            activeDot={{ r: 6, fill: 'var(--accent-cyan)', stroke: '#0f172a', strokeWidth: 2 }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardChart;
