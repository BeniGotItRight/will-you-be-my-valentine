import { useState } from 'react';
import { motion } from 'framer-motion';

interface AccessPageProps {
  onAccessGranted: (nickname: string) => void;
}

const AccessPage = ({ onAccessGranted }: AccessPageProps) => {
  const [nickname, setNickname] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('Nov');
  const [year, setYear] = useState('2007');
  const [error, setError] = useState('');

  const handleAccess = () => {
    if (!nickname.trim()) {
      setError('Please give me a nickname first! ❤️');
      return;
    }
    if (day === '6' && month === 'Nov' && year === '2007') {
      const role = nickname.toLowerCase().includes('benson') ? 'Benson' : 'Kendy';
      localStorage.setItem('user_role', role);
      onAccessGranted(nickname);
    } else {
      setError("That's not my correct birthday! Try again. 🥺");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="noise-bg" />
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="max-w-md w-full bg-red-950/20 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-red-500/20"
      >
        <h1 className="text-4xl text-[#FF4D6D] font-display font-bold mb-6">Access Required 🔐</h1>
        <p className="text-gray-600 mb-8 font-body">Only my special person can enter here.</p>
        
        <div className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Give me a nickname you'll call me:</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname for me..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-red-500/20 focus:border-red-500 outline-none transition-all bg-white/5 text-white placeholder:text-white/20 font-bold"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Enter my birthday:</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Day" 
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-1/3 px-4 py-3 rounded-2xl border-2 border-red-500/20 focus:border-red-500 outline-none transition-all bg-white/5 text-white placeholder:text-white/20 font-bold"
              />
              <select 
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-1/3 px-4 py-3 rounded-2xl border-2 border-red-500/20 focus:border-red-500 outline-none transition-all bg-white/5 text-white font-bold"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <option key={m} value={m} className="bg-black">{m}</option>
                ))}
              </select>
              <input 
                type="number" 
                placeholder="Year" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-1/3 px-4 py-3 rounded-2xl border-2 border-red-500/20 focus:border-red-500 outline-none transition-all bg-white/5 text-white placeholder:text-white/20 font-bold"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-bold animate-bounce">{error}</p>}

          <button 
            onClick={handleAccess}
            className="w-full bg-[#FF4D6D] text-white py-4 rounded-2xl font-bold text-xl shadow-lg hover:bg-[#ff3355] transition-all transform active:scale-95"
          >
            Enter My Heart
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccessPage;
