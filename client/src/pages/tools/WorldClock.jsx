import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Globe, Plus, Trash2 } from 'lucide-react';
import moment from 'moment-timezone';

export default function WorldClock() {
  const popularZones = [
  'America/New_York', 'America/Los_Angeles', 'Europe/London',
  'Europe/Paris', 'Asia/Tokyo', 'Asia/Dubai', 'Asia/Kolkata',
  'Australia/Sydney', 'Pacific/Auckland', 'UTC'];


  const [zones, setZones] = useState([moment.tz.guess(), 'America/New_York', 'Europe/London']);
  const [currentTime, setCurrentTime] = useState(moment());
  const [selectedZone, setSelectedZone] = useState(popularZones[0]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addZone = () => {
    if (!zones.includes(selectedZone)) {
      setZones([...zones, selectedZone]);
    }
  };

  const removeZone = (z) => {
    setZones(zones.filter((zone) => zone !== z));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20 flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">World Clock</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Track precise times in multiple global timezones.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
                <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-black/5 p-4 rounded-2xl border border-border">
                    <div className="flex-1 relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                        <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="input-field w-full h-14 pl-12 pr-4 cursor-pointer font-bold bg-background">
              
                            {moment.tz.names().map((z) => <option key={z} value={z}>{z.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                    <button
            onClick={addZone}
            className="btn-primary h-14 sm:w-auto px-8 gap-2 bg-gradient-to-r from-blue-600 to-indigo-500">
            
                        <Plus className="w-5 h-5" /> Add Timezone
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {zones.map((z) => {
              const timeContext = currentTime.tz(z);
              const city = z.split('/').pop()?.replace('_', ' ') || z;
              return (
                <motion.div
                  key={z}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-background border border-border rounded-2xl p-6 relative shadow-sm group hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all">
                  
                                    <button
                    onClick={() => removeZone(z)}
                    className="absolute top-4 right-4 text-foreground/30 hover:text-red-500 transition-colors">
                    
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    
                                    <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{z.split('/')[0]}</span>
                                    <h3 className="text-xl font-extrabold tracking-tight truncate mb-4">{city}</h3>
                                    
                                    <div className="text-4xl font-black text-indigo-500 tabular-nums">
                                        {timeContext.format('HH:mm:ss')}
                                    </div>
                                    <div className="text-sm font-semibold text-foreground/60 mt-2">
                                        {timeContext.format('dddd, MMMM D')}
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs font-bold">
                                        <span className="text-foreground/50">Offset</span>
                                        <span className="bg-black/5 px-2 py-1 rounded-md">UTC {timeContext.format('Z')}</span>
                                    </div>
                                </motion.div>);

            })}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>);

}