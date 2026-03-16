import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { TbApiApp } from "react-icons/tb";
import { useStore } from '../store/useStore';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      });
      login(data);
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try demo@toolmate.ai / demo123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Orbs */}
            <div className="bg-orb w-[500px] h-[500px] bg-brand-300/40 top-[-150px] left-[-100px] animate-blob" />
            <div className="bg-orb w-[400px] h-[400px] bg-brand-400/25 bottom-[-100px] right-[-100px] animate-blob animation-delay-2000" />
            <div className="bg-orb w-[300px] h-[300px] bg-brand-200/30 top-[50%] right-[20%] animate-blob animation-delay-4000" />
            
            <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10">
        
                <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                    {/* Decorative background icon */}
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                        <Lock className="w-48 h-48 rotate-12" />
                    </div>
                    
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center relative z-10">
                        <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="w-14 h-14 bg-gradient-to-tr from-brand-500 to-brand-400 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-brand-500/25">
              
                            <TbApiApp className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-muted-foreground text-center text-sm">Enter your details to access your dashboard</p>
                    </div>

                    {error &&
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm p-3.5 rounded-2xl mb-6 font-medium">
            
                            {error}
                        </motion.div>
          }

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@toolmate.ai"
                  className="glass-input w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm" />
                
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="glass-input w-full py-3.5 pl-11 pr-12 rounded-2xl text-sm" />
                
                                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  
                                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-border bg-[var(--input-bg)] text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0 w-4 h-4" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Forgot password?</a>
                        </div>

                        <button
              disabled={loading}
              type="submit"
              className="btn-primary w-full h-13 rounded-2xl text-sm font-semibold gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              
                            {loading ?
              <Loader2 className="w-5 h-5 animate-spin" /> :

              <>Sign In <ArrowRight className="w-4 h-4" /></>
              }
                        </button>
                    </form>

                    <div className="mt-8 relative z-10">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
                            <span className="relative px-3 text-xs text-muted-foreground bg-[var(--glass-bg)] backdrop-blur-sm rounded-full">or</span>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Create one</Link>
                    </p>
                </div>
            </motion.div>
        </div>);

}