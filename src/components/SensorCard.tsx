import React from 'react';
import { Ruler, MoveDown, Timer, ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: 'height' | 'flow' | 'timer';
  direction?: 'in' | 'out' | 'static';
}

const icons = {
  height: Ruler,
  flow: MoveDown,
  timer: Timer
};

const flowIcons = {
  in: ArrowUp,
  out: ArrowDown,
  static: Minus
};

export function SensorCard({ title, value, unit, icon, direction }: SensorCardProps) {
  const Icon = icons[icon];
  const FlowIcon = direction ? flowIcons[direction] : null;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="flex items-center gap-2">
          {FlowIcon && <FlowIcon className="w-5 h-5 text-blue-500" />}
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
        <span className="ml-2 text-gray-600">{unit}</span>
      </div>
    </div>
  );
}