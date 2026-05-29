import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/TaskModal";
import Navbar from "../components/Navbar";

const STAGES = [
  { key: "todo", label: "To Do", color: "bg-neutral-100 text-neutral-600" },
  { key: "inprogress", label: "In Progress", color: "bg-amber-50 text-amber-700" },
  { key: "done", label: "Done", color: "bg-green-50 text-green-700" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStage, setDefaultStage] = useState("todo");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError("");
      const res = await getTasks();
      setTasks(res.data);
    } catch {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (stage) => {
    setEditingTask(null);
    setDefaultStage(stage);
    setModalOpen(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setDefaultStage(task.stage);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingTask) {
        const res = await updateTask(editingTask._id, data);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.data : t)));
      } else {
        const res = await createTask({ ...data, stage: defaultStage });
        setTasks((prev) => [res.data, ...prev]);
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to save task");
    }
  };

  const handleStageChange = async (taskId, newStage) => {
    const original = tasks.find((t) => t._id === taskId);
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, stage: newStage } : t)));

    try {
      await updateTask(taskId, { stage: newStage });
    } catch {
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t._id === taskId ? original : t)));
    }
  };

  const handleDelete = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await deleteTask(taskId);
    } catch {
      fetchTasks(); // re-fetch if delete fails
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.stage === "todo").length,
    inprogress: tasks.filter((t) => t.stage === "inprogress").length,
    done: tasks.filter((t) => t.stage === "done").length,
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <p className="text-sm text-neutral-400 font-mono mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>

          {/* Stats row */}
          <div className="flex gap-4 mt-5 flex-wrap">
            <StatPill label="Total" value={stats.total} />
            <StatPill label="To Do" value={stats.todo} dot="bg-neutral-400" />
            <StatPill label="In Progress" value={stats.inprogress} dot="bg-amber-400" />
            <StatPill label="Done" value={stats.done} dot="bg-green-400" />
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={fetchTasks} className="ml-auto text-xs text-red-500 underline">Retry</button>
          </div>
        )}

        {/* Board */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STAGES.map((stage) => (
              <TaskColumn
                key={stage.key}
                stage={stage}
                tasks={tasks.filter((t) => t.stage === stage.key)}
                onAdd={() => handleAddClick(stage.key)}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onStageChange={handleStageChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task create/edit modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          defaultStage={defaultStage}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

function StatPill({ label, value, dot }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-neutral-100 px-3.5 py-2 rounded-full text-sm">
      {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
      <span className="text-neutral-500">{label}</span>
      <span className="font-semibold text-neutral-800">{value}</span>
    </div>
  );
}
