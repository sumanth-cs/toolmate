import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Scan, Camera, X, Check, Copy } from 'lucide-react';
import jsQR from 'jsqr';

export default function QrScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef();

  const tick = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = videoRef.current.videoHeight;
      canvas.width = videoRef.current.videoWidth;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        setResult(code.data);
        setScanning(false);
        stopCamera();
        return;
      }
    }
    requestRef.current = requestAnimationFrame(tick);
  }, [scanning]);

  const startCamera = async () => {
    try {
      setError(null);
      setResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setScanning(true);
      }
    } catch (err) {
      setError(err.message || 'Error accessing camera');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  useEffect(() => {
    if (scanning) {
      requestRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [scanning, tick]);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-2xl mx-auto">
      
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center mb-4">
                    <Scan className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">QR Code Scanner</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Scan QR codes instantly using your device's camera.</p>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden border border-border shadow-2xl bg-black/10">
                <div className="relative aspect-square sm:aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {!scanning && !result &&
          <div className="text-center space-y-4 px-6">
                            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                                <Camera className="w-10 h-10 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-bold">Ready to Scan</h3>
                            <p className="text-sm text-foreground/50">Allow camera access to scan QR codes and barcodes.</p>
                            <button
              onClick={startCamera}
              className="btn-primary mt-4 bg-amber-500 hover:bg-amber-600 border-none px-10 h-12 rounded-xl">
              
                                Start Camera
                            </button>
                        </div>
          }

                    {scanning &&
          <>
                            <video
              ref={videoRef}
              className="w-full h-full object-cover" />
            
                            <canvas ref={canvasRef} className="hidden" />
                            <div className="absolute inset-0 border-[60px] sm:border-[100px] border-black/60 pointer-events-none">
                                <div className="w-full h-full border-2 border-amber-500 relative bg-amber-500/5">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500 -mt-1 -ml-1"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500 -mt-1 -mr-1"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500 -mb-1 -ml-1"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500 -mb-1 -mr-1"></div>
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500/50 animate-scan"></div>
                                </div>
                            </div>
                            <button
              onClick={stopCamera}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-transform">
              
                                <X className="w-6 h-6" />
                            </button>
                        </>
          }

                    {result &&
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground/50 uppercase tracking-widest mb-4">Scan Result</h3>
                            <div className="bg-black/40 border border-border p-6 rounded-2xl w-full max-w-md break-all font-mono text-amber-500 mb-8 max-h-[200px] overflow-y-auto">
                                {result}
                            </div>
                            <div className="flex gap-4">
                                <button
                onClick={copyToClipboard}
                className="btn-secondary h-12 px-6 gap-2">
                
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy Result'}
                                </button>
                                <button
                onClick={startCamera}
                className="btn-primary h-12 px-6 bg-amber-500 border-none">
                
                                    Scan Another
                                </button>
                            </div>
                        </div>
          }

                    {error && !scanning && !result &&
          <div className="text-center text-red-500 space-y-4 p-8">
                            <X className="w-12 h-12 mx-auto" />
                            <p className="font-bold">{error}</p>
                            <button onClick={startCamera} className="text-foreground border-b border-foreground text-sm uppercase font-black">Try Again</button>
                        </div>
          }
                </div>
            </div>
        </motion.div>);

}

// Add CSS for scanning animation in index.css if not already there, 
// for now I'll use inline style or expect common patterns.