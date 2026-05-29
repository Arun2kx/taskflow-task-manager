import { useState, useEffect, useRef } from "react";

const STAGES = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function TaskModal({ task, defaultStage, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    stage: task?.stage || defaultStage || "todo",
    priority: task?.priority || "medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();

    // Close on escape
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave(form);
    } catch (err) {
      setError(err.message || "Failed to save task");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-900">
            {task ? "Edit task" : "New task"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-1.5">
              Title *
            </label>
            <input
              ref={titleRef}
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-800 focus:bg-white transition-all placeholder:text-neutral-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add some details... (optional)"
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-800 focus:bg-white transition-all placeholder:text-neutral-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-1.5">
                Stage
              </label>
              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-800 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider block mb-1.5">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-800 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-neutral-600 font-medium bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm text-white font-medium bg-[#1a1a1a] rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
