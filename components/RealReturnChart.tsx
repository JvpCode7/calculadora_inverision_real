import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

interface RealReturnChartProps {
  data: ChartDataPoint[];
  timeUnit: 'years' | 'months';
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label, timeUnit }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const timeLabel = timeUnit === 'years' ? 'Año' : 'Mes';
      return (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800 dark:text-gray-200">{`${timeLabel} ${label}`}</p>
          <p className="text-sm text-cyan-600 dark:text-cyan-400">{`Valor Nominal: ${data.totalValue.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}`}</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">{`Valor Real (Poder Adquisitivo): ${data.realValue.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}`}</p>
        </div>
      );
    }
  
    return null;
  };

const RealReturnChart: React.FC<RealReturnChartProps> = ({ data, timeUnit }) => {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="year" tick={{ fill: 'currentColor', fontSize: 12 }}/>
          <YAxis tickFormatter={formatCurrency} tick={{ fill: 'currentColor', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip timeUnit={timeUnit} />} />
          <Legend />
          <Line type="monotone" dataKey="totalValue" name="Valor Nominal" stroke="#0891b2" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="realValue" name="Valor Real (Poder Adquisitivo)" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealReturnChart;