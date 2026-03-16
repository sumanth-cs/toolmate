import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  MonitorPlay,
  StopCircle,
  Play,
  Download,
  AlertCircle,
} from "lucide-react";

export default function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setError(null);
      setVideoUrl(null);
      // Request screen sharing with audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      // Handle user clicking "Stop sharing" on the browser banner
      stream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp8,opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error starting screen record:", err);
      setError(
        err.message ||
          "Failed to start screen recording. Please check permissions.",
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-4xl mx-auto"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center mb-4">
          <MonitorPlay className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Screen Recorder
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Capture your screen and audio directly in the browser.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-start gap-3 text-sm mb-6 text-center"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </motion.div>
        )}

        <div className="flex flex-col items-center justify-center min-h-[300px]">
          {!recording && !videoUrl && (
            <div className="text-center w-full max-w-md">
              <MonitorPlay className="w-24 h-24 mx-auto mb-6 text-indigo-500/20" />
              <h3 className="text-xl font-bold mb-2">Ready to Record</h3>
              <p className="text-foreground/60 mb-8">
                Click below to choose which screen, window, or tab to share.
                System audio can also be captured if selected.
              </p>

              <button
                onClick={startRecording}
                className="btn-primary w-full h-14 gap-2 text-lg bg-gradient-to-r from-indigo-600 to-purple-500 hover:shadow-indigo-500/40"
              >
                <Play className="w-5 h-5" /> Start Recording
              </button>
            </div>
          )}

          {recording && (
            <div className="text-center w-full max-w-md">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto rounded-full bg-red-500/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                  <div className="w-16 h-16 rounded-full bg-red-500 animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-red-500 animate-pulse">
                Recording active...
              </h3>
              <p className="text-foreground/60 mb-8">
                Your screen is currently being recorded.
              </p>

              <button
                onClick={stopRecording}
                className="btn-primary w-full h-14 gap-2 text-lg bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 font-bold"
              >
                <StopCircle className="w-5 h-5" /> Stop Recording
              </button>
            </div>
          )}

          {!recording && videoUrl && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                  Recording Saved
                </span>
                <button
                  onClick={() => setVideoUrl(null)}
                  className="text-xs text-red-500 hover:text-red-400 font-semibold px-3 py-1.5 rounded-lg bg-red-500/10"
                >
                  Discard & Record New
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black/60 mb-6 border border-border shadow-2xl">
                <video
                  src={videoUrl}
                  controls
                  className="w-full max-h-[500px] block outline-none"
                />
              </div>

              <a
                href={videoUrl}
                download={`screen_recording_${new Date().toISOString().slice(0, 10)}.webm`}
                className="btn-primary w-full h-14 gap-2 text-lg bg-gradient-to-r from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] flex items-center justify-center font-bold"
              >
                <Download className="w-5 h-5" /> Download Recording (WEBM)
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
