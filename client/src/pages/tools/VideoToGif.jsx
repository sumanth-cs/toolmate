import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileVideo, Upload, Download, Loader2, RefreshCw } from 'lucide-react';
import { saveAs } from 'file-saver';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function VideoToGif() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const ffmpegRef = useRef(null);

  const loadFfmpeg = async () => {
    if (!ffmpegRef.current) {
      const ffmpeg = new FFmpeg();
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });
      await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
      });
      ffmpegRef.current = ffmpeg;
    }
    return ffmpegRef.current;
  };

  const handleFile = useCallback((f) => {
    if (!f.type.startsWith('video/')) {alert('Please upload a video file.');return;}
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setProgress(0);
  }, []);

  const convertToGif = async () => {
    if (!file || !preview) return;
    setConverting(true);
    setResult(null);
    setProgress(0);

    try {
      const ffmpeg = await loadFfmpeg();

      await ffmpeg.writeFile('input.mp4', await fetchFile(file));

      // Execute conversion: scale to 480px width max, 10fps for reasonable gif size
      await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', 'fps=10,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
      '-loop', '0',
      'output.gif']
      );

      const data = await ffmpeg.readFile('output.gif');
      const blob = new Blob([data], { type: 'image/gif' });

      setResult({
        blob: blob,
        url: URL.createObjectURL(blob)
      });

    } catch (error) {
      console.error(error);
      alert('Error converting video to GIF.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 flex flex-col max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20 flex items-center justify-center mb-4">
                    <FileVideo className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Video to GIF</h1>
                <p className="text-foreground/60 mt-2 text-sm sm:text-base">Convert MP4 videos into animated GIFs locally in your browser.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 shadow-xl border border-border">
                <div className="flex flex-col gap-6">
                    {!file ?
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 min-h-[300px] cursor-pointer transition-all ${
            dragOver ? 'border-red-500 bg-red-500/10' : 'border-border hover:border-red-500/50 hover:bg-white/5'}`
            }
            onDragOver={(e) => {e.preventDefault();setDragOver(true);}}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {e.preventDefault();setDragOver(false);if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);}}
            onClick={() => {const input = document.createElement('input');input.type = 'file';input.accept = 'video/*';input.onchange = (e) => {const f = e.target.files?.[0];if (f) handleFile(f);};input.click();}}>
            
                            <Upload className="w-12 h-12 mx-auto mb-4 text-red-500/60" />
                            <p className="text-foreground/80 font-semibold mb-2 text-center">Click or Drop Video</p>
                            <p className="text-foreground/40 text-xs mt-1 text-center">MP4, WEBM, MOV supported</p>
                        </div> :

          <div className="flex flex-col border border-border rounded-xl overflow-hidden min-h-[300px] bg-black/20">
                            <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-background">
                                <span className="text-xs font-semibold truncate max-w-[200px]">{file.name}</span>
                                <button onClick={() => {setFile(null);setPreview(null);setResult(null);}} className="text-xs text-red-500 hover:text-red-400 font-semibold">Clear</button>
                            </div>
                            <div className="flex-1 flex items-center justify-center p-4">
                                <video src={preview} controls className="max-h-[300px] object-contain" />
                            </div>
                        </div>
          }

                    <button
            onClick={convertToGif}
            disabled={converting || !file}
            className="w-full mt-2 h-14 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative">
            
                        {converting &&
            <div className="absolute top-0 left-0 h-full bg-black/20" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
            }
                        <span className="relative z-10 flex items-center gap-2">
                            {converting ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                            {converting ? `Processing... ${progress}%` : `Convert to GIF`}
                        </span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {result && !converting &&
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-6 border-red-500/20 text-center shadow-xl">
                        <div className="flex items-center justify-center mb-4">
                            <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Conversion Successful
                            </span>
                        </div>
                        <div className="relative rounded-xl overflow-hidden bg-black/5 mb-6 max-h-[400px] flex items-center justify-center">
                            <img src={result.url} className="max-h-[300px] relative z-10 object-contain mx-auto border border-border rounded-lg shadow-2xl" alt="Converted GIF" />
                        </div>
                        <button
            onClick={() => {
              const newName = file?.name.split('.')[0] + '.gif';
              saveAs(result.blob, newName);
            }}
            className="btn-primary w-full max-w-md mx-auto h-12 gap-2 text-base shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-bold">
            
                            <Download className="w-4 h-4" /> Download GIF
                        </button>
                    </motion.div>
        }
            </AnimatePresence>
        </motion.div>);

}