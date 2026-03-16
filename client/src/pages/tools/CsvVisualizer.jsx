import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Upload,
  Trash2,
  BarChart,
  PieChart,
  LineChart,
} from "lucide-react";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function CsvVisualizer() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [title] = useState("CSV Data Visualization");

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        if (results.meta.fields) {
          setHeaders(results.meta.fields);
          setXAxis(results.meta.fields[0]);
          setYAxis(results.meta.fields[1] || results.meta.fields[0]);
        }
      },
    });
  };

  const chartData = {
    labels: data.map((row) => row[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: data.map((row) => parseFloat(row[yAxis]) || 0),
        backgroundColor: [
          "rgba(99, 102, 241, 0.5)",
          "rgba(14, 165, 233, 0.5)",
          "rgba(168, 85, 247, 0.5)",
          "rgba(236, 72, 153, 0.5)",
          "rgba(245, 158, 11, 0.5)",
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(14, 165, 233, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(245, 158, 11, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      title: {
        display: true,
        text: title,
        color: "rgba(255, 255, 255, 0.9)",
        font: { size: 16 },
      },
    },
    scales:
      chartType !== "pie"
        ? {
            x: {
              ticks: { color: "rgba(255, 255, 255, 0.5)" },
              grid: { color: "rgba(255, 255, 255, 0.1)" },
            },
            y: {
              ticks: { color: "rgba(255, 255, 255, 0.5)" },
              grid: { color: "rgba(255, 255, 255, 0.1)" },
            },
          }
        : {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12 flex flex-col max-w-5xl mx-auto"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center mb-4">
          <LayoutGrid className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          CSV Visualizer
        </h1>
        <p className="text-foreground/60 mt-2 text-sm sm:text-base">
          Upload CSV files and transform them into interactive charts.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-border shadow-xl">
            <label className="block text-sm font-semibold text-foreground/80 mb-3">
              Upload CSV
            </label>
            <div className="relative group">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="border-2 border-dashed border-border group-hover:border-amber-500/50 rounded-xl p-4 transition-all flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-foreground/40 group-hover:text-amber-500" />
                <span className="text-xs font-bold text-foreground/60 group-hover:text-amber-500 uppercase tracking-widest">
                  Choose File
                </span>
              </div>
            </div>

            {data.length > 0 && (
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Chart Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setChartType("bar")}
                      className={`p-2 rounded-lg border flex items-center justify-center transition-all ${chartType === "bar" ? "bg-amber-500/10 border-amber-500 text-amber-500" : "bg-black/5 border-border hover:border-amber-500/50"}`}
                    >
                      <BarChart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setChartType("pie")}
                      className={`p-2 rounded-lg border flex items-center justify-center transition-all ${chartType === "pie" ? "bg-amber-500/10 border-amber-500 text-amber-500" : "bg-black/5 border-border hover:border-amber-500/50"}`}
                    >
                      <PieChart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setChartType("line")}
                      className={`p-2 rounded-lg border flex items-center justify-center transition-all ${chartType === "line" ? "bg-amber-500/10 border-amber-500 text-amber-500" : "bg-black/5 border-border hover:border-amber-500/50"}`}
                    >
                      <LineChart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    X-Axis (Label)
                  </label>
                  <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                    className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2">
                    Y-Axis (Value)
                  </label>
                  <select
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value)}
                    className="w-full bg-black/20 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setData([]);
                    setHeaders([]);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-widest"
                >
                  <Trash2 className="w-3 h-3" /> Clear Data
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-8 border border-border shadow-xl min-h-[500px] flex items-center justify-center bg-black/10">
            {data.length > 0 ? (
              <div className="w-full h-full">
                {chartType === "bar" && (
                  <Bar data={chartData} options={options} />
                )}
                {chartType === "pie" && (
                  <Pie data={chartData} options={options} />
                )}
                {chartType === "line" && (
                  <Line data={chartData} options={options} />
                )}
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-40">
                <LayoutGrid className="w-12 h-12 mx-auto" />
                <p className="text-lg font-medium">No CSV Data Loaded</p>
                <p className="text-sm">
                  Upload a CSV file to see visualization
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
