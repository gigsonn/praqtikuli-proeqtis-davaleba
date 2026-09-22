import React from 'react';
import type { Task } from '../types';

const AnalyticsPage: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const toDo = tasks.filter((t) => t.status === 'To Do').length;

  const getPercent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-100">📊 დეტალური ანალიტიკა</h2>
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1 text-slate-300">
            <span>შესასრულებელი (To Do)</span>
            <span>{getPercent(toDo)}% ({toDo})</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div className="bg-amber-500 h-3 rounded-full" style={{ width: `${getPercent(toDo)}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1 text-slate-300">
            <span>მიმდინარე (In Progress)</span>
            <span>{getPercent(inProgress)}% ({inProgress})</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${getPercent(inProgress)}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1 text-slate-300">
            <span>დასრულებული (Completed)</span>
            <span>{getPercent(completed)}% ({completed})</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${getPercent(completed)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;