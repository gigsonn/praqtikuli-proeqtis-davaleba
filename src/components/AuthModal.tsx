import React, { useState } from 'react';
import type { User } from '../types';

interface AuthModalProps {
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('კაცი');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isRegister && (!username || !age))) {
      setError('გთხოვთ შეავსოთ ყველა სავალდებულო ველი!');
      return;
    }

    onLogin({
      id: Date.now().toString(),
      email,
      username: isRegister ? username : (username || 'გიგა ღაღაშვილი'),
      age: isRegister ? age : '20',
      gender: isRegister ? gender : 'კაცი',
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0b0f19] flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-5">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-bold text-white">
            {isRegister ? 'რეგისტრაცია' : 'ავტორიზაცია'}
          </h2>
          <p className="text-slate-400 text-xs">
            შედით TaskFlow სისტემაში დავალებების გასამართად
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  მომხმარებლის სახელი
                </label>
                <input
                  type="text"
                  placeholder="გიგა ღაღაშვილი"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-[#161f32] border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ასაკი
                  </label>
                  <input
                    type="number"
                    placeholder="მაგ: 22"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      setError('');
                    }}
                    className="w-full bg-[#161f32] border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    სქესი (Gender)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#161f32] border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                  >
                    <option value="კაცი">კაცი</option>
                    <option value="ქალი">ქალი</option>
                    <option value="სხვა">სხვა</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              ელ. ფოსტა
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full bg-[#161f32] border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              პაროლი
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full bg-[#161f32] border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 text-sm mt-2 cursor-pointer"
          >
            {isRegister ? 'რეგისტრაცია' : 'შესვლა'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          {isRegister ? (
            <span>
              უკვე გაქვთ ანგარიში?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className="text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                შესვლა
              </button>
            </span>
          ) : (
            <span>
              არ გაქვთ ანგარიში?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className="text-indigo-400 hover:underline font-medium cursor-pointer"
              >
                რეგისტრაცია
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;