import { useState } from "react";

const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-500 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low: "bg-blue-50 text-blue-500 border-blue-100",
};

const STAGE_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function TaskCard({ task, onEdit, onDelete, onStageChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const nextStage = STAGE_OPTIONS.filter((s) => s.value !== task.stage);

  return (
    <div className="bg-white border border-neutral-100 rounded-xl p-4 hover:border-neutral-200 hover:shadow-sm transition-all group">
      {/* Priority badge + menu */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </span>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded hover:bg-neutral-100 transition-all text-neutral-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-40 bg-white border border-neutral-100 rounded-lg shadow-lg py-1 z-20 text-sm">
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Edit
                </button>
                {nextStage.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => { onStageChange(task._id, s.value); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Move to {s.label}
                  </button>
                ))}
                <button
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-red-500 hover:bg-red-50 transition-colors border-t border-neutral-100 mt-0.5 pt-1.5"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className={`text-sm font-medium leading-snug text-neutral-800 ${task.stage === "done" ? "line-through text-neutral-400" : ""}`}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-50">
        <span className="text-xs text-neutral-300 font-mono">
          {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>

        {/* Quick stage move */}
        <div className="flex gap-1">
          {nextStage.map((s) => (
            <button
              key={s.value}
              onClick={() => onStageChange(task._id, s.value)}
              className="text-xs text-neutral-400 hover:text-neutral-700 px-1.5 py-0.5 rounded hover:bg-neutral-50 transition-colors"
              title={`Move to ${s.label}`}
            >
              → {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
