import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { TbApiApp } from "react-icons/tb";
import axios from 'axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            <div className="bg-orb w-[400px] h-[400px] bg-brand-300/30 top-[-100px] left-[-50px] animate-blob" />
            <div className="bg-orb w-[300px] h-[300px] bg-brand-400/20 bottom-[-80px] right-[-50px] animate-blob animation-delay-2000" />

            <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">
        
                <div className="glass-card rounded-3xl p-8 sm:p-10 text-center">
                    <div className="w-14 h-14 bg-gradient-to-tr from-brand-500 to-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/25">
                        <TbApiApp className="w-8 h-8 text-white" />
                    </div>

                    {status === 'loading' &&
          <div className="space-y-4">
                            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto" />
                            <h2 className="text-xl font-bold text-foreground">Verifying your email...</h2>
                            <p className="text-sm text-muted-foreground">Please wait while we confirm your email address.</p>
                        </div>
          }

                    {status === 'success' &&
          <div className="space-y-4">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                            <h2 className="text-xl font-bold text-foreground">Email Verified!</h2>
                            <p className="text-sm text-muted-foreground">{message}</p>
                            <Link to="/login" className="btn-primary h-12 rounded-2xl text-sm font-semibold gap-2 w-full mt-4">
                                Sign In
                            </Link>
                        </div>
          }

                    {status === 'error' &&
          <div className="space-y-4">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h2 className="text-xl font-bold text-foreground">Verification Failed</h2>
                            <p className="text-sm text-muted-foreground">{message}</p>
                            <Link to="/login" className="btn-secondary h-12 rounded-2xl text-sm font-semibold gap-2 w-full mt-4">
                                Go to Login
                            </Link>
                        </div>
          }
                </div>
            </motion.div>
        </div>);

}