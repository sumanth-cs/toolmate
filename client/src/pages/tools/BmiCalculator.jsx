import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Dumbbell, Pizza, Scale } from 'lucide-react';

export default function BmiCalculator() {
  const [system, setSystem] = useState('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const calculateBmi = () => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;

    let result = 0;
    if (system === 'metric') {
      const hM = h / 100;
      result = w / (hM * hM);
    } else {
      result = w / (h * h) * 703;
    }

    return Number(result.toFixed(1));
  };

  const bmi = calculateBmi();

  const getStatus = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-500', icon: <Pizza className="w-8 h-8 text-blue-500" /> };
    if (val < 25) return { label: 'Normal Weight', color: 'text-emerald-500', bg: 'bg-emerald-500', icon: <Dumbbell className="w-8 h-8 text-emerald-500" /> };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-500', bg: 'bg-orange-500', icon: <Scale className="w-8 h-8 text-orange-500" /> };
    return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-500', icon: <Activity className="w-8 h-8 text-red-500" /> };
  };

  const status = bmi ? getStatus(bmi) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-3xl mx-auto">
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">BMI Calculator</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Calculate your Body Mass Index directly to check your health status.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl border border-border flex flex-col gap-6">
                    <div className="flex bg-black/5 p-1 rounded-xl border border-border">
                        <button
              onClick={() => {setSystem('metric');setHeight('');setWeight('');}}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${system === 'metric' ? 'bg-background shadow-sm text-emerald-500' : 'text-foreground/50'}`}>
              
                            Metric
                        </button>
                        <button
              onClick={() => {setSystem('imperial');setHeight('');setWeight('');}}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${system === 'imperial' ? 'bg-background shadow-sm text-emerald-500' : 'text-foreground/50'}`}>
              
                            Imperial
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-2">Height ({system === 'metric' ? 'cm' : 'inches'})</label>
                            <input
                type="number"
                placeholder={system === 'metric' ? "175" : "70"}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="input-field w-full h-14 text-xl font-bold" />
              
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-2">Weight ({system === 'metric' ? 'kg' : 'lbs'})</label>
                            <input
                type="number"
                placeholder={system === 'metric' ? "70" : "150"}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input-field w-full h-14 text-xl font-bold" />
              
                        </div>
                    </div>
                </div>

                {/* Results Screen */}
                <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl border border-border flex flex-col items-center justify-center min-h-[300px] text-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                    <AnimatePresence mode="wait">
                        {!bmi ?
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-foreground/40">
                                <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="font-bold text-lg">Enter details</h3>
                                <p className="text-sm">Input your height and weight to view your BMI metrics here.</p>
                            </motion.div> :

            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-full">
                                <div className={`w-16 h-16 rounded-2xl mb-4 bg-background border border-border shadow-inner flex items-center justify-center`}>
                                    {status?.icon}
                                </div>
                                <span className={`text-6xl font-black mb-2 ${status?.color}`}>{bmi}</span>
                                <span className={`text-xl font-bold uppercase tracking-widest ${status?.color} mb-6`}>{status?.label}</span>

                                {/* Scale Guide */}
                                <div className="w-full relative h-3 rounded-full overflow-hidden flex bg-accent">
                                    <div className="flex-1 bg-blue-500"></div>
                                    <div className="w-[15%] bg-emerald-500"></div>
                                    <div className="w-[15%] bg-orange-500"></div>
                                    <div className="w-[40%] bg-red-500"></div>
                                </div>
                                <div className="w-full flex justify-between mt-2 text-[10px] font-bold text-foreground/40 uppercase relative">
                                    <span className="ml-[10%]">18.5</span>
                                    <span className="mr-[25%] -translate-x-4">25</span>
                                    <span className="mr-[12%] -translate-x-5">30</span>
                                </div>
                            </motion.div>
            }
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>);

}