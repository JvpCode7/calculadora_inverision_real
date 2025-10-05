import React, { useState, useEffect, useMemo } from 'react';
import Slider from './components/Slider';
import InvestmentChart from './components/InvestmentChart';
import RealReturnChart from './components/RealReturnChart';
import { ChartDataPoint } from './types';

const App: React.FC = () => {
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(3);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(20);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

  useEffect(() => {
    const calculateYearly = () => {
      const data: ChartDataPoint[] = [];
      let futureValue = 0;
      let realFutureValue = 0; // Tracks value in today's dollars

      const monthlyReturnRate = Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;
      const monthlyInflationRate = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;
      const realMonthlyReturnRate = ((1 + monthlyReturnRate) / (1 + monthlyInflationRate)) - 1;

      const totalMonths = investmentPeriod * 12;

      for (let month = 1; month <= totalMonths; month++) {
        // Nominal calculation (vencido)
        const interestEarned = futureValue * monthlyReturnRate;
        futureValue += monthlyContribution + interestEarned;
        
        // Real value calculation (vencido)
        const realInterestEarned = realFutureValue * realMonthlyReturnRate;
        realFutureValue += monthlyContribution + realInterestEarned;
        
        // Solo guardar el dato al final de cada año
        if (month % 12 === 0) {
            const year = month / 12;
            const investedCapital = monthlyContribution * month;
            const accumulatedInterest = futureValue - investedCapital;

            data.push({
              year,
              investedCapital: Math.round(investedCapital),
              accumulatedInterest: Math.round(accumulatedInterest),
              totalValue: Math.round(futureValue),
              realValue: Math.round(realFutureValue),
            });
        }
      }
      setChartData(data);
    };

    const calculateMonthly = () => {
        const data: ChartDataPoint[] = [];
        let futureValue = 0;
        let realFutureValue = 0; // Tracks value in today's dollars

        const monthlyReturnRate = Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;
        const monthlyInflationRate = Math.pow(1 + inflationRate / 100, 1 / 12) - 1;
        const realMonthlyReturnRate = ((1 + monthlyReturnRate) / (1 + monthlyInflationRate)) - 1;

        const totalMonths = investmentPeriod * 12;
  
        for (let month = 1; month <= totalMonths; month++) {
            // Nominal calculation (vencido)
            const interestEarned = futureValue * monthlyReturnRate;
            futureValue += monthlyContribution + interestEarned;
            
            // Real value calculation (vencido)
            const realInterestEarned = realFutureValue * realMonthlyReturnRate;
            realFutureValue += monthlyContribution + realInterestEarned;
    
            const investedCapital = monthlyContribution * month;
            const accumulatedInterest = futureValue - investedCapital;
    
            data.push({
                year: month, // Using 'year' key to represent month number for chart compatibility
                investedCapital: Math.round(investedCapital),
                accumulatedInterest: Math.round(accumulatedInterest),
                totalValue: Math.round(futureValue),
                realValue: Math.round(realFutureValue),
            });
        }
        setChartData(data);
    };

    if (timeUnit === 'years') {
        calculateYearly();
    } else {
        calculateMonthly();
    }
  }, [monthlyContribution, annualReturnRate, inflationRate, investmentPeriod, timeUnit]);

  const finalValues = useMemo(() => {
    if (chartData.length === 0) {
      return { total: 0, real: 0, invested: 0, interest: 0 };
    }
    const lastPoint = chartData[chartData.length - 1];
    return {
      total: lastPoint.totalValue,
      real: lastPoint.realValue,
      invested: lastPoint.investedCapital,
      interest: lastPoint.accumulatedInterest
    };
  }, [chartData]);
  
  const realRateOfReturn = useMemo(() => {
      const nominal = 1 + annualReturnRate / 100;
      const inflation = 1 + inflationRate / 100;
      return ((nominal / inflation) - 1) * 100;
  }, [annualReturnRate, inflationRate]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            Calculadora de Inversión a Futuro
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Visualiza el poder del interés compuesto y planifica tus metas financieras.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 border-b pb-3 dark:border-gray-600">Configura tu Inversión</h2>
            <div className="space-y-6">
              <Slider
                label="Ahorro Mensual"
                value={monthlyContribution}
                min={50}
                max={5000}
                step={50}
                unit="$"
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
              <Slider
                label="Tasa de Retorno Anual"
                value={annualReturnRate}
                min={0}
                max={20}
                step={0.1}
                unit="%"
                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
              />
              <Slider
                label="Inflación Anual Estimada"
                value={inflationRate}
                min={0}
                max={15}
                step={0.1}
                unit="%"
                onChange={(e) => setInflationRate(Number(e.target.value))}
              />
              <Slider
                label="Período de Inversión (Años)"
                value={investmentPeriod}
                min={1}
                max={50}
                step={1}
                unit=""
                onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Results and Charts */}
          <div className="lg:col-span-2 space-y-8">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Futuro Total</h3>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{finalValues.total.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Real (Poder Adquisitivo)</h3>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{finalValues.real.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 col-span-2 md:col-span-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasa de Retorno Real</h3>
                    <p className={`text-2xl font-bold ${realRateOfReturn >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-500'}`}>{realRateOfReturn.toFixed(2)}%</p>
                </div>
            </div>

            <div className="flex justify-center items-center mb-4">
              <span className={`mr-3 text-sm font-medium ${timeUnit === 'years' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>Anual</span>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                      type="checkbox" 
                      checked={timeUnit === 'months'} 
                      onChange={() => setTimeUnit(prev => prev === 'years' ? 'months' : 'years')} 
                      className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
              <span className={`ml-3 text-sm font-medium ${timeUnit === 'months' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>Mensual</span>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Crecimiento de la Inversión</h3>
              <InvestmentChart data={chartData} timeUnit={timeUnit} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Valor Nominal vs. Valor Real (Ajustado por Inflación)</h3>
              <RealReturnChart data={chartData} timeUnit={timeUnit} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
