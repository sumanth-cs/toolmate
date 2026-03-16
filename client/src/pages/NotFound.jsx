import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            <div className="bg-orb w-[500px] h-[500px] bg-brand-300/40 top-[-150px] left-[-100px] animate-blob" />
            <div className="bg-orb w-[400px] h-[400px] bg-brand-400/25 bottom-[-100px] right-[-100px] animate-blob animation-delay-2000" />
            
            <div className="w-full max-w-md relative z-10 text-center">
                <div className="glass-card rounded-3xl p-8 sm:p-12">
                    <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-6xl font-extrabold text-foreground mb-4">404</h1>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
                    <p className="text-muted-foreground text-sm mb-8">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                    <Link to="/app" className="btn-primary w-full h-12 flex items-center justify-center gap-2">
                        <Home className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>);

}