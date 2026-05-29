import TaskCard from "./TaskCard";

const STAGE_CONFIG = {
  todo: {
    label: "To Do",
    dotColor: "bg-neutral-400",
    headerClass: "text-neutral-600",
    emptyMsg: "No tasks here yet.",
  },
  inprogress: {
    label: "In Progress",
    dotColor: "bg-amber-400",
    headerClass: "text-amber-700",
    emptyMsg: "Nothing in progress.",
  },
  done: {
    label: "Done",
    dotColor: "bg-green-400",
    headerClass: "text-green-700",
    emptyMsg: "No completed tasks yet.",
  },
};

export default function TaskColumn({ stage, tasks, onAdd, onEdit, onDelete, onStageChange }) {
  const config = STAGE_CONFIG[stage.key];

  return (
    <div className="flex flex-col">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
          <h2 className={`text-sm font-semibold ${config.headerClass}`}>{config.label}</h2>
          <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-mono">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={onAdd}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          title="Add task"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2.5 min-h-[120px]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-300 border-2 border-dashed border-neutral-100 rounded-xl">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-xs">{config.emptyMsg}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task._id)}
              onStageChange={onStageChange}
            />
          ))
        )}
      </div>

      {/* Add button at bottom */}
      <button
        onClick={onAdd}
        className="mt-3 w-full flex items-center gap-2 px-3 py-2.5 text-sm text-neutral-400 hover:text-neutral-600 hover:bg-white rounded-lg border border-dashed border-neutral-200 hover:border-neutral-300 transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add task
      </button>
    </div>
  );
}
