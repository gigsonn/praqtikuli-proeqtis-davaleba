import React, { useState } from 'react';
import AuthModal from './components/AuthModal';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';
import type { User, Page, Task } from './types';

interface ExtendedTask extends Task {
  imageUrl?: string;
}

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ExtendedTask | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Completed'>('To Do');
  const [dueDate, setDueDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Initial Tasks with API Images
  const [tasks, setTasks] = useState<ExtendedTask[]>([
    {
      id: '1',
      title: 'ვებ-საიტის UI დიზაინის მომზადება',
      description: 'Figma-ში მთავარი გვერდების და კომპონენტების ვიზუალის აწყობა Tailwind-ის სტილში.',
      category: 'Design',
      priority: 'High',
      status: 'Completed',
      dueDate: '2026-09-20',
      imageUrl: 'https://picsum.photos/id/1/400/200',
    },
    {
      id: '2',
      title: 'React Router და State-ის გამართვა',
      description: 'აპლიკაციის ნავიგაციისა და გლობალური მდგომარეობის (State) სტრუქტურის აწყობა.',
      category: 'Development',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2026-09-25',
      imageUrl: 'https://picsum.photos/id/180/400/200',
    },
    {
      id: '3',
      title: 'CRUD ოპერაციების და ფორმის ვალიდაციის ტესტირება',
      description: 'დავალებების დამატების, რედაქტირებისა და წაშლის ლოგიკის შემოწმება.',
      category: 'Testing',
      priority: 'Medium',
      status: 'To Do',
      dueDate: '2026-09-28',
      imageUrl: 'https://picsum.photos/id/60/400/200',
    },
  ]);

  const fetchRandomImage = async () => {
    try {
      const randomId = Math.floor(Math.random() * 100) + 10;
      const res = await fetch(`https://picsum.photos/id/${randomId}/info`);
      if (res.ok) {
        const data = await res.json();
        return data.download_url;
      }
    } catch (e) {
      console.error('API Error:', e);
    }
    return `https://picsum.photos/seed/${Date.now()}/400/200`;
  };

  if (!user) {
    return <AuthModal onLogin={(u: User) => setUser(u)} />;
  }

  const handleOpenForm = (task?: ExtendedTask) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setCategory(task.category);
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate);
      setImageUrl(task.imageUrl || '');
    } else {
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setCategory('Development');
      setPriority('Medium');
      setStatus('To Do');
      setDueDate('');
      setImageUrl('');
    }
    setIsFormOpen(true);
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalImg = imageUrl;
    if (!finalImg && !editingTask) {
      finalImg = await fetchRandomImage();
    }

    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === editingTask.id
            ? { ...t, title, description, category, priority, status, dueDate, imageUrl: finalImg }
            : t
        )
      );
    } else {
      const newTask: ExtendedTask = {
        id: Date.now().toString(),
        title,
        description,
        category,
        priority,
        status,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        imageUrl: finalImg,
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }

    setTitle('');
    setDescription('');
    setIsFormOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#0d1322] sticky top-0 z-40 px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              T
            </div>
            <span className="font-bold text-lg text-white tracking-wide">TaskFlow</span>
          </div>

          <nav className="flex items-center gap-2 text-sm font-medium">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-1.5 rounded-lg transition ${
                currentPage === 'dashboard'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('tasks')}
              className={`px-4 py-1.5 rounded-lg transition ${
                currentPage === 'tasks'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              დავალებები
            </button>
            <button
              onClick={() => handleOpenForm()}
              className="px-4 py-1.5 text-slate-400 hover:text-white transition"
            >
              + ახალი
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              className={`px-4 py-1.5 rounded-lg transition ${
                currentPage === 'analytics'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ანალიტიკა
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              className={`px-4 py-1.5 rounded-lg transition ${
                currentPage === 'profile'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              პროფილი
            </button>
            <button
              onClick={() => setCurrentPage('settings')}
              className={`px-4 py-1.5 rounded-lg transition ${
                currentPage === 'settings'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              პარამეტრები
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {/* DASHBOARD */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  მოგესალმებით, {user.username || 'მომხმარებელო'} 👋
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  აი შენი პროექტის მიმდინარე სტატისტიკა და მიმოხილვა
                </p>
              </div>
              <button
                onClick={() => handleOpenForm()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-indigo-600/20"
              >
                + ახალი დავალება
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  სულ დავალება
                </p>
                <p className="text-3xl font-extrabold text-white mt-3">{tasks.length}</p>
              </div>
              <div className="bg-[#111827] border border-amber-500/40 p-5 rounded-2xl">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  შესასრულებელი
                </p>
                <p className="text-3xl font-extrabold text-white mt-3">
                  {tasks.filter((t) => t.status === 'To Do').length}
                </p>
              </div>
              <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  მიმდინარე
                </p>
                <p className="text-3xl font-extrabold text-white mt-3">
                  {tasks.filter((t) => t.status === 'In Progress').length}
                </p>
              </div>
              <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  დასრულებული
                </p>
                <p className="text-3xl font-extrabold text-white mt-3">
                  {tasks.filter((t) => t.status === 'Completed').length}
                </p>
              </div>
            </div>

            <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-white">ბოლო დავალებები</h2>
                <button
                  onClick={() => setCurrentPage('tasks')}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition"
                >
                  ყველას ნახვა →
                </button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#161f32] border border-slate-800/60 p-4 rounded-xl flex justify-between items-center gap-4 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-4">
                      {task.imageUrl && (
                        <img
                          src={task.imageUrl}
                          alt={task.title}
                          className="w-16 h-12 rounded-lg object-cover border border-slate-700/50"
                        />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-sm">{task.title}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs line-clamp-1">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenForm(task)}
                        className="text-xs text-indigo-400 hover:underline"
                      >
                        რედაქტირება
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        წაშლა
                      </button>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                          task.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : task.status === 'In Progress'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {task.status === 'Completed'
                          ? 'დასრულებული'
                          : task.status === 'In Progress'
                          ? 'მიმდინარე'
                          : 'შესასრულებელი'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TASKS PAGE */}
        {currentPage === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">📝 დავალებების სრული სია</h2>
              <button
                onClick={() => handleOpenForm()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                + ახალი დავალება
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-[#111827] p-4 rounded-xl border border-slate-800/80">
              <input
                type="text"
                placeholder="ძებნა სათაურით ან აღწერით..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">ყველა სტატუსი</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#111827] border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  {task.imageUrl && (
                    <img
                      src={task.imageUrl}
                      alt={task.title}
                      className="w-full h-40 object-cover border-b border-slate-800/60"
                    />
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-semibold text-white">{task.title}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded border ${
                            task.priority === 'High'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : task.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mb-4">{task.description}</p>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>🏷️ {task.category}</span>
                        <span>📅 {task.dueDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="bg-slate-800 px-2 py-1 rounded text-indigo-300 font-medium">
                          {task.status}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenForm(task)}
                            className="text-indigo-400 hover:underline"
                          >
                            რედაქტირება
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-400 hover:underline"
                          >
                            წაშლა
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS PAGE */}
        {currentPage === 'analytics' && <AnalyticsPage tasks={tasks} />}

        {/* PROFILE PAGE */}
        {currentPage === 'profile' && (
          <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-2xl space-y-4 max-w-md">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>👤</span> მომხმარებლის პროფილი
            </h2>
            <div className="space-y-3 pt-2">
              <div>
                <p className="text-xs text-slate-400 font-medium">სახელი</p>
                <p className="text-base font-semibold text-white mt-0.5">
                  {user.username || 'მომხმარებელი'}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">ელ. ფოსტა</p>
                <p className="text-base font-semibold text-indigo-400 mt-0.5">{user.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                <div>
                  <p className="text-xs text-slate-400 font-medium">ასაკი</p>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {user.age ? `${user.age} წლის` : 'მითითებული არ არის'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">სქესი</p>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {user.gender || 'მითითებული არ არის'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setUser(null)}
              className="text-xs font-medium text-red-400 hover:text-red-300 transition pt-3 inline-block cursor-pointer"
            >
              სისტემიდან გამოსვლა
            </button>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {currentPage === 'settings' && <SettingsPage />}
      </main>

      {/* BIG EXPANDED FOOTER */}
      <footer className="border-t border-slate-800 bg-[#0d1322] mt-auto pt-16 pb-8 px-6 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
                T
              </div>
              <span className="font-bold text-xl text-white">TaskFlow</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              თანამედროვე დავალებების მართვის სისტემა, რომელიც შექმნილია თქვენი პროდუქტიულობის გასაზრდელად. ადვილად ადევნეთ თვალი პროექტის მიმდინარეობას.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">ნავიგაცია</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('dashboard')} className="hover:text-indigo-400 transition">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tasks')} className="hover:text-indigo-400 transition">
                  დავალებები
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('analytics')} className="hover:text-indigo-400 transition">
                  ანალიტიკა
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('profile')} className="hover:text-indigo-400 transition">
                  პროფილი
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('settings')} className="hover:text-indigo-400 transition">
                  პარამეტრები
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">რესურსები</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-400 transition">დოკუმენტაცია</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">API ინტეგრაცია</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">კონფიდენციალურობა</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">წესები & პირობები</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">მხარდაჭერა</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">სიახლეები</h3>
            <p className="text-xs text-slate-400">გამოიწერეთ სიახლეები და იყავით განახლებული პროექტის ცვლილებებზე.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="თქვენი ელ. ფოსტა"
                className="bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 flex-1"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition"
              >
                გამოწერა
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 TaskFlow System. ყველა უფლება დაცულია.</p>
          <p className="text-slate-500">ავტორი: გიგა ღაღაშვილი</p>
        </div>
      </footer>

      {/* Task Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 w-full max-w-lg text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">
              {editingTask ? 'დავალების რედაქტირება' : 'ახალი დავალების დამატება'}
            </h3>
            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">სათაური</label>
                <input
                  type="text"
                  required
                  placeholder="შეიყვანეთ სათაური..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">აღწერა</label>
                <textarea
                  placeholder="შეიყვანეთ აღწერა..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">კატეგორია</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">ვადა (Due Date)</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">პრიორიტეტი</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                    className="w-full bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">სტატუსი</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'To Do' | 'In Progress' | 'Completed')}
                    className="w-full bg-[#161f32] border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  შენახვა
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;