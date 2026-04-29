import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../hooks/useAppState';

const questions = {
  truth: [
    "What is the most degrading thing you've ever imagined me doing to you?",
    "Tell me a filthy secret about your body that you've been hiding from me.",
    "Which exact spot on your body makes you completely lose your mind when touched?",
    "What's the absolute dirtiest thought you've had about us in public?",
    "If I tied you up right now, what are you most afraid I would do to you?",
    "Describe the exact moment you realized you wanted to completely surrender to me."
  ],
  dare: [
    "Send me a voice note begging for it using my name.",
    "Go into the bathroom, touch yourself for exactly 60 seconds, and send a picture of your face.",
    "Describe in explicit detail how you want me to leave a mark on you tonight.",
    "Send a video of you whispering exactly what you want me to do to you.",
    "Show me where you're aching the most right now.",
    "Tell me exactly what you'd do if I ordered you to strip right this second."
  ],
  wyr: [
    "Would you rather be completely blindfolded and teased for an hour, or tied down and edged?",
    "Would you rather I ruin your favorite outfit or make you wear nothing but a collar?",
    "Would you rather have a slow, agonizingly deep session, or a violently rough quickie in a public bathroom?",
    "Would you rather beg until you cry or be forced to stay completely silent while I take you?",
    "Would you rather I use ice on you or hot wax?",
    "Would you rather be praised for being a good girl/boy, or punished for being a brat?"
  ],
  spicy: [
    "What's the one command you'd secretly love me to force you to obey?",
    "If we were alone in an elevator for 10 minutes, exactly how would you provoke me?",
    "What's your most intense, unhinged fantasy that you're almost too embarrassed to admit?",
    "Describe how it feels when I completely overpower you.",
    "What's the nastiest thing you want to whisper in my ear while we're in a crowded room?",
    "If you were completely naked and I walked in, what's the first thing you'd do?",
    "What's your absolute favorite way I've ever made you moan?",
    "Describe the feeling of me gripping your throat right before I kiss you.",
    "If I told you to get on your knees right now, what would be running through your head?",
    "What's the dirtiest thing you want me to do to you tonight?"
  ]
};

const TogetherGame = () => {
  const { appState, updateAppState } = useAppState();
  const [role, setRole] = useState<string | null>(localStorage.getItem('user_role'));
  const [localAnswer, setLocalAnswer] = useState('');

  if (!appState) return <div>Syncing...</div>;

  const handleRoleSelect = (r: string) => {
    localStorage.setItem('user_role', r);
    setRole(r);
  };

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center space-y-10 w-full">
        <h2 className="text-3xl font-black text-red-600 uppercase tracking-tighter italic">Who is holding this phone?</h2>
        <div className="flex gap-4">
          <button onClick={() => handleRoleSelect('Benson')} className="bg-red-900/40 border-2 border-red-500 p-6 rounded-2xl font-bold uppercase text-white">Benson</button>
          <button onClick={() => handleRoleSelect('Kendy')} className="bg-red-900/40 border-2 border-red-500 p-6 rounded-2xl font-bold uppercase text-white">KENDYYY</button>
        </div>
      </div>
    );
  }

  const category = appState.together_category as keyof typeof questions | null;
  const qIndex = appState.together_q_index;
  const bAnswer = appState.together_benson_ans;
  const kAnswer = appState.together_kendy_ans;
  const showAnswers = Boolean(bAnswer && kAnswer);

  const handleNext = () => {
    if (category && qIndex < questions[category].length - 1) {
      updateAppState({ together_q_index: qIndex + 1, together_benson_ans: null, together_kendy_ans: null });
      setLocalAnswer('');
    } else {
      updateAppState({ together_category: null, together_q_index: 0, together_benson_ans: null, together_kendy_ans: null });
      setLocalAnswer('');
    }
  };

  const handleLockIn = () => {
    if (!localAnswer.trim()) return;
    if (role === 'Benson') updateAppState({ together_benson_ans: localAnswer });
    else updateAppState({ together_kendy_ans: localAnswer });
  };

  if (!category) {
    return (
      <div className="space-y-6 text-center w-full max-w-md">
        <h2 className="text-5xl text-[#FF4D6D] font-black italic tracking-tighter uppercase">Extreme Nasty Corner 😈</h2>
        <p className="text-gray-400 italic font-bold">Pick a category to explore your darkest desires. Both screens will sync.</p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          {Object.keys(questions).map((cat) => (
            <button
              key={cat}
              onClick={() => updateAppState({ together_category: cat, together_q_index: 0, together_benson_ans: null, together_kendy_ans: null })}
              className="bg-red-950/40 p-6 rounded-2xl border-2 border-red-500/30 hover:border-red-500 capitalize font-black text-white shadow-xl transition-all"
            >
              {cat === 'wyr' ? 'Would You Rather' : cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = questions[category][qIndex];
  const myAnswerState = role === 'Benson' ? bAnswer : kAnswer;
  const partnerAnswerState = role === 'Benson' ? kAnswer : bAnswer;
  const partnerRole = role === 'Benson' ? 'Kendy' : 'Benson';

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 space-y-8 relative z-10 text-center max-w-lg">
      <div className="space-y-2">
        <p className="text-xs font-black opacity-80 uppercase tracking-widest text-red-500">{category === 'wyr' ? 'Would You Rather' : category} - Round {qIndex + 1}</p>
        <h3 className="text-3xl font-black italic text-white drop-shadow-md">"{currentQ}"</h3>
      </div>

      {!showAnswers ? (
        <div className="w-full space-y-6">
          <textarea
            value={localAnswer}
            onChange={(e) => setLocalAnswer(e.target.value)}
            disabled={Boolean(myAnswerState)}
            placeholder="Type your dirtiest truth..."
            className="w-full bg-black/50 p-6 rounded-2xl border-2 border-dashed border-red-500/30 outline-none h-32 text-white text-xl font-bold placeholder:text-white/20 focus:border-red-500 transition-all resize-none disabled:opacity-50"
          />
          <div className="flex justify-between items-center px-2">
            <p className="text-sm font-bold text-gray-400">
              {partnerAnswerState ? `🔥 ${partnerRole} locked in.` : `⏳ Waiting for ${partnerRole}...`}
            </p>
            <button
              onClick={handleLockIn}
              disabled={Boolean(myAnswerState) || !localAnswer.trim()}
              className="bg-red-600 disabled:bg-gray-700 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-xl disabled:shadow-none transition-all"
            >
              {myAnswerState ? 'Locked 🔒' : 'Lock In 😈'}
            </button>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 w-full">
            <div className="space-y-2 border-b border-red-500/20 pb-6 text-left">
              <p className="text-red-500 text-xs font-black uppercase tracking-widest">Benson's Confession</p>
              <p className="text-2xl font-black text-white italic">"{bAnswer}"</p>
            </div>
            <div className="space-y-2 text-left">
              <p className="text-red-500 text-xs font-black uppercase tracking-widest">KENDYYY's Confession</p>
              <p className="text-2xl font-black text-white italic">"{kAnswer}"</p>
            </div>
            <div className="flex gap-4 justify-center pt-8">
               <button onClick={handleNext} className="bg-white text-black px-8 py-3 rounded-full font-black shadow-lg">Next Dare</button>
               <button onClick={() => updateAppState({ together_category: null })} className="text-white underline text-sm pt-3">Exit Category</button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TogetherGame;
