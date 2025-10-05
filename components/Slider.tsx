import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, unit, onChange }) => {

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let numValue = parseFloat(e.target.value);
    if (isNaN(numValue)) {
        numValue = min;
    }
    if (numValue > max) {
        numValue = max;
    }
    if (numValue < min) {
        numValue = min;
    }
    
    // Create a synthetic event object that mimics a real ChangeEvent
    const syntheticEvent = {
      target: {
        ...e.target,
        value: String(numValue),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">{label}</label>
        
        <div className="relative flex items-center">
          {unit === '$' && <span className="absolute left-3 pointer-events-none text-gray-500 dark:text-gray-400">$</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            onBlur={handleBlur}
            className={`
              w-32 h-9 rounded-md border border-gray-300 dark:border-gray-600
              bg-gray-50 dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              text-right
              ${unit === '$' ? 'pl-7 pr-3' : 'pl-3 pr-8'}
            `}
          />
          {unit !== '$' && <span className="absolute right-3 pointer-events-none text-gray-500 dark:text-gray-400">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-thumb"
        style={{
          '--thumb-color': '#4f46e5',
        } as React.CSSProperties}
      />
      <style>{`
        /* Hide number input arrows */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--thumb-color);
          cursor: pointer;
          border-radius: 50%;
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--thumb-color);
          cursor: pointer;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Slider;
