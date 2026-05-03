<div align="center">
  <img src="https://raw.githubusercontent.com/skmodtech-rgb/codemate-ai-toolkit/main/client/public/logo.svg" alt="ToolMate AI Logo" width="120" height="120" />
  <h1>ToolMate AI</h1>
  <p><strong>The Ultimate Open-Source, All-in-One Utility Suite & AI Powerhouse</strong></p>
  
  <p>
    Built for speed, privacy, and limitless creativity. Over 30+ browser-native tools ranging from AI Image/Video Generation, to WASM-powered Video-to-GIF converters, to secure client-side PDF manipulation.
  </p>
</div>

<hr />

DEPLOYED LINK : https://toolmate-frontend1.onrender.com

## 🚀 Overview

**ToolMate AI** was developed as a comprehensive, modern utility platform designed to replace the dozens of ad-ridden online tools developers and creators use daily. Built with an uncompromising focus on UI/UX (featuring responsive glassmorphism) and Data Privacy, ToolMate performs a vast majority of its heavy lifting **entirely in your browser**.

For our advanced AI features, ToolMate seamlessly connects directly to intelligent agentic workflows orchestrated via **n8n Webhooks**, enabling scalable, robust, and dynamic processing without traditional heavy backend infrastructures.

## ✨ Key Features & Capabilities

### 🧠 1. AI Creation Suite 
Powered by dynamic n8n workflows seamlessly integrated via webhooks.
- **AI Chatbot**: Context-aware, intelligent AI conversational assistant.
- **Image Generator (Fast & Pro Mode)**: Generate stunning visuals dynamically using powerful AI models.
- **Video Generator (Fast & Pro Mode)**: Transform prompts into high-quality generated video segments.
- **Speech-to-Text & Text-to-Speech**: Ultra-fast transcription and neural voice generation.
- **YouTube Transcriber**: Fetch and transcribe summaries directly from YouTube URLs.

### 🎬 2. Media Studio (WASM & Neural Network Powered)
All Media Studio tools execute **100% locally** in your browser using powerful WebAssembly binaries and Neural Networks—ensuring zero data leaves your device.
- **Video ↔ GIF Converters**: Uses `@ffmpeg/wasm` to flawlessly transcode video formats natively in the browser.
- **AI Image Upscaler**: Uses `@tensorflow/tfjs` to intelligently upscale low-res images via local Neural Networks.
- **Image Compressor & Target Resizer**: Compresses images using multi-threaded web workers without quality loss.
- **Format Converter & Cropper**: Canvas-based perfect pixel extraction and transformations (JPG/PNG/WEBP).
- **Webcam & Screen Recorders**: Captures high-res screen layouts, browser tabs, or webcam footage using raw `MediaRecorder` DOM abstractions.

### 📄 3. Document Workshop 
Securely modify sensitive documents natively in the browser.
- **PDF Manipulation Suite**: Merge, split, and compress PDFs dynamically using `pdf-lib`.
- **Format Transformation**: Image to PDF wrappers and robust extraction capabilities.

### 📊 4. Data Intelligence
- **Intelligent Converters**: JSON to CSV, CSV to JSON formatters with real-time payload visualization.
- **QR Generator**: High-speed QR mapping capabilities.

---

## 🛠️ Technical Stack & Architecture

- **Frontend**: React 18 / Vite / TypeScript
- **Styling**: TailwindCSS & Framer Motion (for buttery smooth micro-interactions).
- **Icons**: Lucide React & React Icons.
- **In-Browser Processing Engines**:
  - `@ffmpeg/ffmpeg` core for WASM video manipulation
  - `react-image-crop` & Browser Canvas API for media
  - `pdf-lib` for document modification
  - `@tensorflow/tfjs` for local edge-intelligence
- **Backend / Integration Engine**: Fully serverless webhook connections via *n8n* orchestrating Python nodes, OpenAI, and high-performance AI generation clusters.
- **Auth & Storage**: Secure Express/NodeJS custom server implementation utilizing strict JWT patterns and MongoDB scaling.

---

## 🏃‍♂️ Getting Started 

Want to run ToolMate AI locally? 

### Prerequisites
Make sure you have Node JS `v18+` and MongoDB running locally or on an Atlas cluster.

### Setup Process

1. **Clone the repository:**
   ```bash
   git clone https://github.com/skmodtech-rgb/codemate-ai-toolkit.git
   cd codemate-ai-toolkit
   ```

2. **Setup the Background Server (Authentication & Data Store):**
   ```bash
   cd server
   npm install
   # Create a .env file with your MONGO_URI and JWT_SECRET
   npm run build
   npm start
   ```

3. **Setup the Client (React App):**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Experience the Magic** ✨
   Navigate to `localhost:5173`. Create an account and dive into the ToolMate AI Toolkit.

---
<div align="center">
  <p>Built with ❤️ for the Hackathon</p>
</div>
