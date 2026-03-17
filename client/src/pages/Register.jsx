import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { TbApiApp } from "react-icons/tb";
import { useStore } from '../store/useStore';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const navigate = useNavigate();
  const { login } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        name, email, password
      });

      if (data.verificationSent) {
        setVerificationSent(true);
        // Also log them in (they can use the app, but with a verification banner)
        login(data);
      } else {
        login(data);
        navigate('/app');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Show verification success screen
  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
                <div className="bg-orb w-[500px] h-[500px] bg-brand-400/30 top-[-150px] right-[-100px] animate-blob" />
                <div className="bg-orb w-[400px] h-[400px] bg-brand-300/35 bottom-[-100px] left-[-100px] animate-blob animation-delay-2000" />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative z-10">
                    <div className="glass-card rounded-3xl p-8 sm:p-10 text-center">
                        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-foreground mb-2">Check your email</h2>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                            We've sent a verification link to <strong className="text-foreground">{email}</strong>. 
                            Please check your inbox and click the link to verify your account.
                        </p>
                        <Link to="/app" className="btn-primary w-full h-12 rounded-2xl text-sm font-semibold gap-2">
                            Continue to Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                        <p className="mt-4 text-xs text-muted-foreground">
                            Didn't receive the email? Check your spam folder or{' '}
                            <button className="text-brand-500 hover:underline font-medium">resend</button>
                        </p>
                    </div>
                </motion.div>
            </div>);

  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            <div className="bg-orb w-[500px] h-[500px] bg-brand-400/30 top-[-150px] right-[-100px] animate-blob" />
            <div className="bg-orb w-[400px] h-[400px] bg-brand-300/35 bottom-[-100px] left-[-100px] animate-blob animation-delay-2000" />
            
            <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10">
        
                <div className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                        <User className="w-48 h-48 rotate-12" />
                    </div>
                    
                    <div className="mb-7 flex flex-col items-center relative z-10">
                        <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="w-12 h-12 bg-gradient-to-tr from-brand-500 to-brand-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/25">
                            <TbApiApp className="w-7 h-7 text-white" />
                        </motion.div>
                        <h2 className="text-2xl font-extrabold text-foreground text-center mb-1">Create Account</h2>
                        <p className="text-muted-foreground text-center text-sm">Join ToolMate AI and power up your workflow</p>
                    </div>

                    {error &&
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm p-3 rounded-2xl mb-5 font-medium">
                            {error}
                        </motion.div>
          }

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="John Doe" className="glass-input w-full py-3 pl-11 pr-4 rounded-2xl text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com" className="glass-input w-full py-3 pl-11 pr-4 rounded-2xl text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                                <input type={showPassword ? 'text' : 'password'} required value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="glass-input w-full py-3 pl-11 pr-12 rounded-2xl text-sm" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>
                        <button disabled={loading} type="submit"
            className="btn-primary w-full h-12 rounded-2xl text-sm font-semibold gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-6 relative z-10">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
                            <span className="relative px-3 text-xs text-muted-foreground bg-[var(--glass-bg)] backdrop-blur-sm rounded-full">or</span>
                        </div>
                    </div>
                    <p className="mt-5 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>);

}