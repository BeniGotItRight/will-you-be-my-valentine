
import { motion } from 'framer-motion';
import { useAppState } from '../hooks/useAppState';

const choices = [
  { category: "Mood", options: ["Completely Surrendered", "Desperate", "Begging", "Submissive"] },
  { category: "Dress Code", options: ["Just A Collar", "Blindfold Only", "Nothing", "My Shirt & Nothing Else"] },
  { category: "Tonight's Focus", options: ["Total Domination", "Slow Torture", "Sensory Deprivation", "Public Risk"] }
];

const BensonsChoice = () => {
  const { appState, updateAppState } = useAppState();
  const role = localStorage.getItem('user_role');

  if (!appState) return <div>Syncing...</div>;
  const selections = appState.bensons_choice || {};

  const pickForHer = (category: string) => {
    if (role !== 'Benson') return; // Only Benson can choose
    const options = choices.find(c => c.category === category)?.options || [];
    const random = options[Math.floor(Math.random() * options.length)];
    updateAppState({ bensons_choice: { ...selections, [category]: random } });
  };

  return (
    <div className="space-y-8 w-full max-w-sm">
      <h2 className="text-4xl font-black uppercase italic text-red-600 drop-shadow-lg">Benson's Choice 👑</h2>
      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">
        {role === 'Benson' ? "Dictate how tonight goes..." : "Waiting for Benson's orders..."}
      </p>
      
      <div className="space-y-4">
        {choices.map(c => (
          <div key={c.category} className="flex flex-col gap-2">
            <button 
              onClick={() => pickForHer(c.category)}
              disabled={role !== 'Benson'}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group hover:border-red-600 transition-all disabled:opacity-100 disabled:cursor-default"
            >
              <span className="font-bold text-gray-400 uppercase text-xs">{c.category}</span>
              <span className="text-red-500 font-black group-hover:scale-110 transition-transform">
                {selections[c.category] || (role === 'Benson' ? "TAP TO DECIDE" : "WAITING...")}
              </span>
            </button>
          </div>
        ))}
      </div>

      {Object.keys(selections).length === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-red-900/40 rounded-3xl border border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
          <p className="text-white italic font-black text-lg">"Those are my terms. Prepare yourself. 😈"</p>
        </motion.div>
      )}
    </div>
  );
};

export default BensonsChoice;
