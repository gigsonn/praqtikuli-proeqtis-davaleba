import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-100">⚙️ პარამეტრები & პროექტის შესახებ</h2>
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-slate-300">
        <h3 className="text-lg font-semibold text-indigo-400">TaskFlow v1.0</h3>
        <p>პროექტი მომზადებულია სსიპ კოლეჯი „სპექტრის“ პრაქტიკული პროექტის ფარგლებში.</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
          <li><strong>ტექნოლოგიები:</strong> React 18, TypeScript, Tailwind CSS, Vite</li>
          <li><strong>ავტორი:</strong> გიგა გაგაშვილი</li>
          <li><strong>ხელმძღვანელი:</strong> ლალი მანავლიშვილი</li>
        </ul>
      </div>
    </div>
  );
};
export default SettingsPage;