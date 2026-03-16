import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StopCircle, Play, Download, AlertCircle, Camera } from 'lucide-react';

export default function WebcamRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // Initialize camera preview on mount
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        streamRef.current = stream;
        setHasCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setError('Failed to access webcam or microphone. Please check permissions.');
      }
    };
    initCamera();

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (!streamRef.current) return;
    setError(null);
    setVideoUrl(null);

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm; codecs=vp8,opus' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex items-center justify-center mb-4">
                    <Camera className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Webcam Recorder</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Record high-quality video directly from your webcam.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
                {error &&
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-3 text-sm mb-6 text-center">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </motion.div>
        }

                <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto gap-6">
                    
                    {/* Live Preview Container */}
                    {!videoUrl &&
          <div className="w-full relative rounded-2xl overflow-hidden bg-black/60 shadow-2xl border border-border aspect-video flex flex-col items-center justify-center">
                            {!hasCamera && !error &&
            <p className="text-foreground/40 text-sm absolute">Requesting camera access...</p>
            }
                            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" />
            
                            {recording &&
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full z-10">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold text-red-100">REC</span>
                                </div>
            }
                        </div>
          }

                    {/* Result Container */}
                    {videoUrl &&
          <div className="w-full flex-col flex items-center gap-4">
                            <div className="w-full flex items-center justify-between">
                                <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Recording Saved
                                </span>
                                <button
                onClick={() => setVideoUrl(null)}
                className="text-xs text-red-500 hover:text-red-400 font-semibold px-3 py-1.5 rounded-lg bg-red-500/10">
                
                                    Discard & Record New
                                </button>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden bg-black/60 shadow-2xl border border-border aspect-video w-full">
                                <video src={videoUrl} controls className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                        </div>
          }

                    {/* Controls */}
                    <div className="w-full flex justify-center mt-2">
                        {!recording && !videoUrl && hasCamera &&
            <button
              onClick={startRecording}
              className="btn-primary w-full sm:w-64 h-14 gap-2 text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-purple-500/40">
              
                                <Play className="w-5 h-5" /> Start Recording
                            </button>
            }

                        {recording &&
            <button
              onClick={stopRecording}
              className="btn-primary w-full sm:w-64 h-14 gap-2 text-lg bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 font-bold">
              
                                <StopCircle className="w-5 h-5" /> Stop Recording
                            </button>
            }

                        {videoUrl &&
            <a
              href={videoUrl}
              download={`webcam_recording_${new Date().toISOString().slice(0, 10)}.webm`}
              className="btn-primary w-full h-14 gap-2 text-lg bg-gradient-to-r from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] flex items-center justify-center font-bold">
              
                                <Download className="w-5 h-5" /> Download Video
                            </a>
            }
                    </div>
                </div>
            </div>
        </motion.div>);

}