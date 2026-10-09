import React, { useState } from "react";
import { 
  Plus, Droplets, Sun, Calendar, CheckCircle2, 
  Clock, AlertCircle, Sparkles, BookOpen 
} from "lucide-react";

const getDaysDiff = (dateString) => {
  const diffTime = new Date() - new Date(dateString);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export default function PlantApp() {
  const [activeTab, setActiveTab] = useState("board");
  const [plants, setPlants] = useState([
    {
      id: "1",
      name: "Monstera Deliciosa",
      nickname: "Monty",
      wateringFrequency: 7,
      lastWatered: "2026-10-01",
      sunlight: "Bright Indirect",
      imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "2",
      name: "Snake Plant",
      nickname: "Slinky",
      wateringFrequency: 14,
      lastWatered: "2026-09-20",
      sunlight: "Low Light",
      imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=600&q=80",
    },
  ]);

  const [logs, setLogs] = useState([
    {
      id: "l1",
      plantId: "1",
      notes: "Looking vibrant after pruning!",
      date: "2026-10-01",
    },
  ]);

  const [newPlant, setNewPlant] = useState({
    name: "",
    nickname: "",
    wateringFrequency: 7,
    sunlight: "Bright Indirect",
    imageUrl: "",
  });

  const getTasks = () => {
    return plants.map((plant) => {
      const daysSince = getDaysDiff(plant.lastWatered);
      const daysLeft = plant.wateringFrequency - daysSince;

      let status = "upcoming";
      if (daysLeft < 0) status = "overdue";
      else if (daysLeft === 0) status = "due_today";

      return { ...plant, daysLeft, status };
    });
  };

  const handleWaterPlant = (plantId) => {
    const today = new Date().toISOString().split("T")[0];
    
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, lastWatered: today } : p))
    );

    const newLog = {
      id: Date.now().toString(),
      plantId,
      notes: "Watered as per schedule.",
      date: today,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleAddPlant = (e) => {
    e.preventDefault();
    if (!newPlant.name) return;

    const created = {
      ...newPlant,
      id: Date.now().toString(),
      lastWatered: new Date().toISOString().split("T")[0],
      imageUrl:
        newPlant.imageUrl ||
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
    };

    setPlants((prev) => [...prev, created]);
    setNewPlant({ name: "", nickname: "", wateringFrequency: 7, sunlight: "Bright Indirect", imageUrl: "" });
    setActiveTab("board");
  };

  const tasks = getTasks();

  return (
    <div className="min-h-screen bg-emerald-50/50 text-slate-800 font-sans p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-emerald-600" /> Flora Care Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Keep your indoor jungle healthy and hydrated.</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-emerald-100 self-start">
          <button
            onClick={() => setActiveTab("board")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "board" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Care Board
          </button>
          <button
            onClick={() => setActiveTab("plants")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "plants" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Plants ({plants.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
              activeTab === "add" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-4 h-4" /> Add Plant
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {activeTab === "board" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title="Overdue"
              icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
              bgColor="bg-rose-50 border-rose-200"
              items={tasks.filter((t) => t.status === "overdue")}
              onWater={handleWaterPlant}
            />

            <TaskColumn
              title="Due Today"
              icon={<Clock className="w-5 h-5 text-amber-500" />}
              bgColor="bg-amber-50 border-amber-200"
              items={tasks.filter((t) => t.status === "due_today")}
              onWater={handleWaterPlant}
            />

            <TaskColumn
              title="Upcoming"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              bgColor="bg-emerald-50 border-emerald-200"
              items={tasks.filter((t) => t.status === "upcoming")}
              onWater={handleWaterPlant}
            />
          </div>
        )}

        {activeTab === "plants" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((plant) => (
                <div key={plant.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition">
                  <img src={plant.imageUrl} alt={plant.name} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{plant.nickname || plant.name}</h3>
                        <p className="text-xs text-slate-500 italic">{plant.name}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">
                        Every {plant.wateringFrequency}d
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>{plant.sunlight}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Last watered: {plant.lastWatered}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" /> Plant Care & Growth Logbook
              </h2>
              <div className="space-y-4">
                {logs.map((log) => {
                  const targetPlant = plants.find((p) => p.id === log.plantId);
                  return (
                    <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-emerald-900">{targetPlant?.nickname || targetPlant?.name}</span>
                        <p className="text-sm text-slate-600 mt-1">{log.notes}</p>
                      </div>
                      <span className="text-xs text-slate-400">{log.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add a New Plant</h2>
            <form onSubmit={handleAddPlant} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plant Species Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fiddle Leaf Fig"
                  value={newPlant.name}
                  onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. Figgy"
                  value={newPlant.nickname}
                  onChange={(e) => setNewPlant({ ...newPlant, nickname: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Watering Interval (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPlant.wateringFrequency}
                    onChange={(e) => setNewPlant({ ...newPlant, wateringFrequency: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sunlight Requirement</label>
                  <select
                    value={newPlant.sunlight}
                    onChange={(e) => setNewPlant({ ...newPlant, sunlight: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option>Direct Sunlight</option>
                    <option>Bright Indirect</option>
                    <option>Medium Light</option>
                    <option>Low Light</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newPlant.imageUrl}
                  onChange={(e) => setNewPlant({ ...newPlant, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition"
              >
                Save Plant
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function TaskColumn({ title, icon, bgColor, items, onWater }) {
  return (
    <div className={`p-5 rounded-2xl border ${bgColor} flex flex-col gap-4 min-h-[350px]`}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-bold text-slate-800">{title}</h2>
        <span className="ml-auto bg-white/80 text-xs font-bold px-2 py-0.5 rounded-full text-slate-600">
          {items.length}
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {items.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-8">No tasks in this list.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">{item.nickname || item.name}</h4>
                  <span className="text-xs text-slate-500">
                    {item.daysLeft < 0
                      ? `${Math.abs(item.daysLeft)} days overdue`
                      : item.daysLeft === 0
                      ? "Needs water today"
                      : `Due in ${item.daysLeft} days`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onWater(item.id)}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                title="Mark Watered"
              >
                <Droplets className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}