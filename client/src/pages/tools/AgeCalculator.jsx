import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Hourglass, Calendar, Gift, Sparkles } from 'lucide-react';
import { differenceInYears, differenceInMonths, differenceInDays, differenceInWeeks, isValid, parseISO } from 'date-fns';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const result = useMemo(() => {
    if (!dob || !targetDate) return null;

    const bdate = parseISO(dob);
    const tdate = parseISO(targetDate);

    if (!isValid(bdate) || !isValid(tdate)) return null;
    if (tdate < bdate) return 'error'; // Target is before birth

    const years = differenceInYears(tdate, bdate);

    // Find exact months after subtracting years
    const dateAfterYears = new Date(bdate);
    dateAfterYears.setFullYear(bdate.getFullYear() + years);
    const months = differenceInMonths(tdate, dateAfterYears);

    // Find exact days after subtracting years and months
    const dateAfterMonths = new Date(dateAfterYears);
    dateAfterMonths.setMonth(dateAfterYears.getMonth() + months);
    const days = differenceInDays(tdate, dateAfterMonths);

    // Raw totals
    const totalMonths = differenceInMonths(tdate, bdate);
    const totalWeeks = differenceInWeeks(tdate, bdate);
    const totalDays = differenceInDays(tdate, bdate);

    // Next birthday
    const nextBday = new Date(bdate);
    nextBday.setFullYear(tdate.getFullYear());
    if (nextBday < tdate) nextBday.setFullYear(tdate.getFullYear() + 1);
    const daysToNext = differenceInDays(nextBday, tdate);
    const nextBdayStr = nextBday.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return { years, months, days, totalMonths, totalWeeks, totalDays, daysToNext, nextBdayStr };
  }, [dob, targetDate]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-3xl mx-auto">
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/20 flex items-center justify-center mb-4">
                    <Hourglass className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Age Calculator</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Calculate your exact age in years, months, weeks, and days.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
                {/* Inputs */}
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground/80 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-pink-500" /> Date of Birth
                        </label>
                        <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="input-field w-full h-14" />
            
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground/80 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-500" /> Target Date
                        </label>
                        <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="input-field w-full h-14" />
            
                    </div>
                </div>

                {/* Results block */}
                {!result ?
        <div className="border border-dashed border-border rounded-xl p-10 text-center flex flex-col items-center justify-center min-h-[200px] text-foreground/50">
                        <Sparkles className="w-8 h-8 mb-3" />
                        <h3 className="font-bold text-lg">Enter both dates</h3>
                        <p className="text-sm border p-4 bg-background">To calculate the precise span between two dates</p>
                    </div> :
        result === 'error' ?
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-6 text-center font-bold">
                        Target Date cannot be before Date of Birth!
                    </div> :

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        
                        {/* Primary Stat */}
                        <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 p-8 rounded-2xl text-center shadow-inner">
                            <span className="text-xs font-black uppercase text-pink-500 tracking-widest block mb-4">Chronological Age</span>
                            <div className="flex flex-wrap justify-center items-end gap-x-4 gap-y-2">
                                <div className="text-center">
                                    <span className="text-5xl font-black text-foreground">{result.years}</span>
                                    <span className="text-lg font-bold text-foreground/60 ml-1">years</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-5xl font-black text-foreground">{result.months}</span>
                                    <span className="text-lg font-bold text-foreground/60 ml-1">months</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-5xl font-black text-foreground">{result.days}</span>
                                    <span className="text-lg font-bold text-foreground/60 ml-1">days</span>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-background border border-border p-4 rounded-xl text-center shadow-sm">
                                <span className="text-2xl font-black text-indigo-500">{result.years}</span>
                                <span className="block text-xs font-bold text-foreground/50 uppercase mt-1">Total Years</span>
                            </div>
                            <div className="bg-background border border-border p-4 rounded-xl text-center shadow-sm">
                                <span className="text-2xl font-black text-indigo-500">{result.totalMonths.toLocaleString()}</span>
                                <span className="block text-xs font-bold text-foreground/50 uppercase mt-1">Total Months</span>
                            </div>
                            <div className="bg-background border border-border p-4 rounded-xl text-center shadow-sm">
                                <span className="text-2xl font-black text-indigo-500">{result.totalWeeks.toLocaleString()}</span>
                                <span className="block text-xs font-bold text-foreground/50 uppercase mt-1">Total Weeks</span>
                            </div>
                            <div className="bg-background border border-border p-4 rounded-xl text-center shadow-sm">
                                <span className="text-2xl font-black text-indigo-500">{result.totalDays.toLocaleString()}</span>
                                <span className="block text-xs font-bold text-foreground/50 uppercase mt-1">Total Days</span>
                            </div>
                        </div>

                        {/* Next Bday Hint */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <Gift className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-600">Next Birthday</h4>
                                    <p className="text-xs font-bold text-emerald-500/70">{result.nextBdayStr}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black text-emerald-500">{result.daysToNext}</span>
                                <span className="block text-xs font-bold text-emerald-500/70 uppercase">Days Away</span>
                            </div>
                        </div>

                    </motion.div>
        }
            </div>
        </motion.div>);

}