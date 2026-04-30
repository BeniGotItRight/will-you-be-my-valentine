import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from './components/FloatingHearts';
import LetterModal from './components/LetterModal';
import Gallery from './components/Gallery';
import ReasonList from './components/ReasonList';
import AccessPage from './components/AccessPage';
import TogetherGame from './components/TogetherGame';
import BensonsChoice from './components/BensonsChoice';
import { SpicyScratch, NastySlot, MoodMap } from './components/SpicyInteractive';
import RealtimeQuiz from './components/RealtimeQuiz';
import { useAppState } from './hooks/useAppState';

// 113 STAGES: 10% Sweet, 70% Nasty, 20% Extreme
type Stage = 
  | 'intro' | 'timeline' | 'reasons' | 'pics' | 'garden' | 'playlist' | 'hug' 
  | 'destination' | 'compliment' | 'promise' | 'together' | 'touchmap' | 'blindfold' 
  | 'whisper' | 'temperature' | 'challenge' | 'confession' | 'outfit' | 'sensory' 
  | 'countdown' | 'fantasy' | 'pleasurepath' | 'command' | 'redroom' | 'pulsesync' 
  | 'bensonschoice' | 'spicyslot' | 'spicyscratch' | 'moodmap'
  | `alphabet_${string}` | `order_${number}` | `fact_${number}` | `memory_${number}` | `question_${number}`
  | 'contract' | 'breathless' | 'blind2' | 'whisperwall' | 'radar' 
  | 'wheel' | 'secretfolder' | 'finaltest' | 'ascend1' | 'ascend2' | 'ascend3' 
  | 'ascend4' | 'ascend5' | 'ascend6' | 'ascend7' | 'obsession' | 'labyrinth' 
  | 'deep1' | 'deep2' | 'deep3' | 'deep4' | 'deep5' | 'deep6' | 'deep7' | 'deep8' | 'deep9' | 'deep10'
  | 'todolist' | 'diary' | 'overload' | 'timer' | 'moodring' 
  | `descent${number}`
  | 'finalsecret' | 'quiz' | 'future' | 'ask' | 'celebrate' | 'letter' 
  | 'outro1' | 'outro2' | 'outro3' | 'outro4';

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const stages: Stage[] = [
  'intro', 'timeline', 'reasons', 'pics', 'garden', 'playlist', 'hug', 'destination', 'compliment', 'promise', // 1-10 (Sweet)
  'together', 'touchmap', 'blindfold', 'whisper', 'temperature', 'challenge', 'confession', 'outfit', 'sensory', 'countdown', // 11-20
  'fantasy', 'pleasurepath', 'command', 'redroom', 'pulsesync', 'bensonschoice', 'spicyslot', 'spicyscratch', 'moodmap', // 21-29
  ...alphabet.map(l => `alphabet_${l}` as Stage), // 30-55 (26 pages)
  ...[1,2,3,4,5,6,7,8,9,10].map(n => `order_${n}` as Stage), // 56-65
  ...[1,2,3,4,5].map(n => `fact_${n}` as Stage), // 66-70
  ...[1,2,3,4,5].map(n => `memory_${n}` as Stage), // 71-75
  ...[1,2,3,4,5].map(n => `question_${n}` as Stage), // 76-80 (Total Nasty: 70 pages)
  'contract', 'breathless', 'blind2', 'whisperwall', 'radar', 'wheel', 'secretfolder', 'finaltest', // 81-88
  'ascend1', 'ascend2', 'ascend3', 'ascend4', 'ascend5', 'ascend6', 'ascend7', 'obsession', 'labyrinth', // 89-97
  'deep1', 'deep2', 'deep3', 'deep4', 'deep5', 'deep6', 'deep7', 'deep8', 'deep9', 'deep10', // 98-107
  'todolist', 'diary', 'overload', 'timer', 'moodring',
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(n => `descent${n}` as Stage), // 108-125
  'finalsecret', 'quiz', 'ask', 'celebrate', 'letter', 'outro1', 'outro2', 'outro3', 'outro4'
];

const STAGE_DETAILS: Record<string, { sub: string, text: string, icon: string }> = {
  touchmap: { sub: "SENSORY EXPLORATION", text: "If my hands were on you right now, where would they be tracing first? 📍", icon: "📍" },
  blindfold: { sub: "TOTAL SURRENDER", text: "In complete darkness, which of your senses would crave me the most? 🕶️", icon: "🕶️" },
  whisper: { sub: "AUDITORY TEASE", text: "What's the one word you want me to whisper that would make you lose all control? 👂", icon: "👂" },
  challenge: { sub: "NASTY DARE", text: "What is the most unhinged thing you'd do for me if I asked right now? 🔥", icon: "🔥" },
  confession: { sub: "RAW TRUTH", text: "What's the 'nastiest' thought you've had about me today? 👄", icon: "👄" },
  outfit: { sub: "VISUAL DESIRE", text: "Which outfit of yours do you think would make me the most desperate? 👙", icon: "👙" },
  sensory: { sub: "FEEL EVERYTHING", text: "If we were locked in a room, would you want ice, heat, or silk first? ❄️", icon: "❄️" },
  countdown: { sub: "THE CLOCK IS TICKING", text: "How much longer do you think you can handle this teasing before you beg? ⏳", icon: "⏳" },
  fantasy: { sub: "UNLEASHED", text: "If rules didn't exist for 10 minutes, what would you do to me? 💭", icon: "💭" },
  pleasurepath: { sub: "MAPPING THE JOURNEY", text: "Which hidden spot on your body are you dying for me to find? 🗺️", icon: "🗺️" },
  command: { sub: "OBEDIENCE", text: "How does it feel knowing you have to follow every single one of my orders? 👑", icon: "👑" },
  redroom: { sub: "THE CORE", text: "Are you ready to give up all control and belong entirely to the Red Room? 🏮", icon: "🏮" },
  pulsesync: { sub: "ONE HEARTBEAT", text: "Can you feel your heart racing as fast as mine is right now? 💓", icon: "💓" },
  heatmap: { sub: "THERMAL SENSITIVITY", text: "Where on your body is the heat becoming absolutely unbearable? 🌡️", icon: "🌡️" },
  ultimatedare: { sub: "NO RETREAT", text: "What is the one line you thought you'd never cross that you're now ready for? 💥", icon: "💥" },
  tease: { sub: "SLOW TORTURE", text: "Do you like it when I take my time, or are you about to break? 👅", icon: "👅" },
  contract: { sub: "SOVEREIGNTY", text: "Will you sign away your freedom and let me own your pleasure tonight? 📜", icon: "📜" },
  breathless: { sub: "OXYGEN DEPRIVATION", text: "What's the sound you make when you finally run out of breath? 💨", icon: "💨" },
  blind2: { sub: "DEEPER DARKNESS", text: "If you couldn't see me, how would you know I was standing right behind you? 🌑", icon: "🌑" },
  whisperwall: { sub: "ECHOES OF LUST", text: "Which of our shared secrets makes you blush the hardest? 🗣️", icon: "🗣️" },
  radar: { sub: "TRACKING DESIRE", text: "Do you know that I can sense exactly how much you want me right now? 📡", icon: "📡" },
  wheel: { sub: "FATE'S CHOICE", text: "Are you prepared to do whatever the wheel demands of you? 🎡", icon: "🎡" },
  secretfolder: { sub: "CLINICAL EVIDENCE", text: "Which of your 'nasty' messages do you think I've read the most? 📁", icon: "📁" },
  finaltest: { sub: "GRADUATION", text: "How does it feel to finally be completely mine, KENDYYY? 🎓", icon: "🎓" },
  ascend1: { sub: "ASCENSION I", text: "What's the first thing you'll do when we're finally together? ✨", icon: "✨" },
  ascend2: { sub: "ASCENSION II", text: "Can you feel the obsession taking over your every thought? ✨", icon: "✨" },
  ascend3: { sub: "ASCENSION III", text: "How deep into this labyrinth are you willing to go? ✨", icon: "✨" },
  ascend4: { sub: "ASCENSION IV", text: "Is there anything else in the world that matters more than this? ✨", icon: "✨" },
  ascend5: { sub: "ASCENSION V", text: "Are you ready to lose yourself completely in me? ✨", icon: "✨" },
  ascend6: { sub: "ASCENSION VI", text: "Can you handle the intensity of what's coming next? ✨", icon: "✨" },
  ascend7: { sub: "ASCENSION VII", text: "Will you stay in this state of pure desire with me forever? ✨", icon: "✨" },
  obsession: { sub: "THE FINAL FRONTIER", text: "Do you realize that you are the only thing I care about? 👁️", icon: "👁️" },
  labyrinth: { sub: "NO EXIT", text: "Do you even want to find a way out of me? 🌀", icon: "🌀" },
  todolist: { sub: "TONIGHT'S AGENDA", text: "Which of tonight's 'tasks' are you most excited for? 📋", icon: "📋" },
  diary: { sub: "PRIVATE ENTRY", text: "What would you write in your diary about what we've done today? 📓", icon: "📓" },
  overload: { sub: "SYSTEM FAILURE", text: "Can you even think straight anymore, or is it just feeling? ⚡", icon: "⚡" },
  timer: { sub: "COUNTDOWN TO PLEASURE", text: "What's the first thing you'll do when the timer hits zero? ⏲️", icon: "⏲️" },
  moodring: { sub: "EMOTIONAL COLOR", text: "What color do you think your desire is right now? 💍", icon: "💍" },
  fact_1: { sub: "NASTY QUESTION #1", text: "Do you know how many times I've imagined you on your knees today? 🫦", icon: "❓" },
  fact_2: { sub: "NASTY QUESTION #2", text: "What do you think I'd do if I caught you thinking about me at work? 👑", icon: "❓" },
  fact_3: { sub: "NASTY QUESTION #3", text: "Which of your 'nasty' photos is my absolute favorite? 🔥", icon: "❓" },
  fact_4: { sub: "NASTY QUESTION #4", text: "What's the one thing I do that makes you lose your mind instantly? 🫦", icon: "❓" },
  fact_5: { sub: "NASTY QUESTION #5", text: "Are you ready for the 'extreme' punishment I've planned for you? 👅", icon: "❓" },
  memory_1: { sub: "MEMORY QUESTION", text: "Do you remember the exact moment you realized you belonged to me? 💭", icon: "❓" },
  memory_2: { sub: "MEMORY QUESTION", text: "What was the 'nastiest' thing we've ever talked about doing? 👄", icon: "❓" },
  memory_3: { sub: "MEMORY QUESTION", text: "How did it feel the first time I gave you a 'nasty' order? 🔒", icon: "❓" },
  memory_4: { sub: "MEMORY QUESTION", text: "What's the one shared memory that still makes your heart race? 🔥", icon: "❓" },
  memory_5: { sub: "MEMORY QUESTION", text: "Do you remember the first time you confessed a fantasy to me? 🫦", icon: "❓" },
  question_1: { sub: "NASTY QUESTION", text: "What's the one thing you want me to do to you that you've never told anyone? 🫦", icon: "❓" },
  question_2: { sub: "NASTY QUESTION", text: "If we were in a public place, what 'nasty' thing would you want me to do? 😈", icon: "❓" },
  question_3: { sub: "NASTY QUESTION", text: "What's the longest you think you could go without my touch? 🔥", icon: "❓" },
  question_4: { sub: "NASTY QUESTION", text: "How many times have you wanted to beg me to stop teasing you today? 🔒", icon: "❓" },
  question_5: { sub: "NASTY QUESTION", text: "What is your absolute favorite way for me to take control? 👅", icon: "❓" },
};

function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [bensonNickname, setBensonNickname] = useState('');
  
  const { appState, updateAppState } = useAppState();
  const stageIndex = appState?.stage_index ?? 0;
  const stage = stages[stageIndex] || 'intro';
  
  const [noCount, setNoCount] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ top: 'auto', left: 'auto', position: 'static' as any });
  const audioRef = useRef<HTMLAudioElement>(null);

  const flowers = appState?.garden_flowers ?? [];
  const temp = appState?.temperature ?? 50;

  const nextStage = () => { 
    if (stageIndex < stages.length - 1) updateAppState({ stage_index: stageIndex + 1 }); 
  };
  const prevStage = () => { 
    if (stageIndex > 0) updateAppState({ stage_index: stageIndex - 1 }); 
  };

  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    setNoButtonPos({ position: 'fixed', top: `${y}px`, left: `${x}px` });
    setNoCount(prev => prev + 1);
  };

  const addFlower = (e: React.MouseEvent) => {
    const newFlower = { x: e.clientX, y: e.clientY, id: Date.now() };
    updateAppState({ garden_flowers: [...flowers, newFlower] });
  };

  const handleYes = () => {
    updateAppState({ stage_index: stages.indexOf('celebrate') });
    confetti({ particleCount: 200, spread: 90 });
    if (audioRef.current) audioRef.current.play().catch(e => console.log(e));
    setTimeout(() => updateAppState({ stage_index: stages.indexOf('letter') }), 4000);
  };

  if (!hasAccess) return <AccessPage onAccessGranted={(nick) => { setBensonNickname(nick); setHasAccess(true); }} />;
  if (!appState) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-bold">Syncing Connection...</div>;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center relative bg-[#0a0a0a] text-white overflow-hidden selection:bg-red-600 selection:text-white font-sans">
      <div className="noise-bg" />
      <FloatingHearts />
      <div className="z-[60] fixed top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${(stageIndex / (stages.length - 1)) * 100}%` }}
          transition={{ type: 'spring', damping: 20 }}
        />
      </div>

      <div className="z-10 w-full max-w-lg px-6 flex flex-col items-center justify-center min-h-screen text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full flex flex-col items-center justify-center py-10"
          >
            {stage === 'intro' && (
              <div className="space-y-6">
                <h1 className="text-5xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-tighter italic">70% NASTY 🫦</h1>
                <p className="text-gray-400 font-medium italic">"Nickname: {bensonNickname}"</p>
                <p className="text-lg font-bold">The experience has been re-balanced. Sweetness is now only 10%. The rest is for us.</p>
                <button onClick={nextStage} className="bg-red-600 text-white px-10 py-5 rounded-full text-2xl font-black shadow-[0_0_40px_rgba(220,38,38,0.4)]">ENTER THE CORE 😈</button>
              </div>
            )}

            {stage.startsWith('alphabet_') && (
              <div className="space-y-10">
                <h2 className="text-9xl font-black text-red-600 italic tracking-tighter opacity-20 absolute top-20 left-0 right-0">{stage.split('_')[1]}</h2>
                <h3 className="text-4xl font-black uppercase tracking-widest relative z-10">
                  {stage === 'alphabet_A' && 'Adoration & Arousal'}
                  {stage === 'alphabet_B' && 'Biting & Begging'}
                  {stage === 'alphabet_C' && 'Craving & Control'}
                  {stage === 'alphabet_D' && 'Dominance & Desire'}
                  {stage === 'alphabet_E' && 'Extremely Excited'}
                  {stage === 'alphabet_F' && 'Fantasies & Fever'}
                  {stage === 'alphabet_G' && 'Grips & Glances'}
                  {stage === 'alphabet_H' && 'Heat & Heartbeat'}
                  {stage === 'alphabet_I' && 'Intense & Irresistible'}
                  {stage === 'alphabet_J' && 'Just Yours'}
                  {stage === 'alphabet_K' && 'KENDYYY\'s Knees'}
                  {stage === 'alphabet_L' && 'Lust & Lips'}
                  {stage === 'alphabet_M' && 'Moans & Midnight'}
                  {stage === 'alphabet_N' && 'Nasty & Needing'}
                  {stage === 'alphabet_O' && 'Obsession & Orders'}
                  {stage === 'alphabet_P' && 'Pleasure & Power'}
                  {stage === 'alphabet_Q' && 'Quick & Quiet'}
                  {stage === 'alphabet_R' && 'Red Room & Rules'}
                  {stage === 'alphabet_S' && 'Screams & Silk'}
                  {stage === 'alphabet_T' && 'Teasing & Touching'}
                  {stage === 'alphabet_U' && 'Ultimate & Under'}
                  {stage === 'alphabet_V' && 'Very Nasty'}
                  {stage === 'alphabet_W' && 'Wild & Wet'}
                  {stage === 'alphabet_X' && 'X-Rated Thoughts'}
                  {stage === 'alphabet_Y' && 'You Are Mine'}
                  {stage === 'alphabet_Z' && 'Zero Limits'}
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <button onClick={nextStage} className="bg-red-600 px-10 py-3 rounded-full font-black uppercase tracking-tighter shadow-xl">Next Letter</button>
                  <button onClick={prevStage} className="text-xs text-gray-500 underline">Back</button>
                </div>
              </div>
            )}

            {stage.startsWith('order_') && (
              <div className="space-y-6">
                <h2 className="text-xs font-black text-red-500 uppercase tracking-widest">Nasty Order #{stage.split('_')[1]}</h2>
                <p className="text-3xl font-black italic text-white leading-tight">
                  {stage === 'order_1' && "You will text me your 'nasty' outfit idea."}
                  {stage === 'order_2' && "You will send a voice note whispering my name."}
                  {stage === 'order_3' && "You will tell me exactly where you want my hands."}
                  {stage === 'order_4' && "You will let me take total control tonight."}
                  {stage === 'order_5' && "You will wear something that makes me lose it."}
                  {stage === 'order_6' && "You will describe your wildest fantasy in detail."}
                  {stage === 'order_7' && "You will look me in the eyes and tell me you're mine."}
                  {stage === 'order_8' && "You will follow every single rule in the Red Room."}
                  {stage === 'order_9' && "You will beg me to stop teasing you."}
                  {stage === 'order_10' && "You will belong to me, and only me. Forever."}
                </p>
                <div className="flex flex-col items-center gap-4">
                  <button onClick={nextStage} className="bg-red-600 px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.3)]">I ACCEPT 🫦</button>
                  <button onClick={prevStage} className="text-xs text-gray-500 underline">Back</button>
                </div>
              </div>
            )}

            {(stage === 'timeline' || stage === 'reasons' || stage === 'pics' || stage === 'garden' || stage === 'playlist' || stage === 'hug' || stage === 'destination' || stage === 'compliment' || stage === 'promise' || stage === 'together') && (
               <div className="w-full space-y-6">
                  {stage === 'together' && <TogetherGame />}
                  {stage === 'garden' && (
                    <div className="w-full h-80 bg-red-900/10 rounded-[3rem] border-2 border-red-500/20 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden relative" onClick={addFlower}>
                      {flowers.map(f => <motion.span key={f.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute text-2xl" style={{ left: f.x % 300, top: f.y % 300 }}>🌸</motion.span>)}
                      <h2 className="text-2xl font-black text-red-500 uppercase">THE GARDEN</h2>
                      <p className="text-xs opacity-60 uppercase tracking-widest">Tap to plant a memory ({flowers.length})</p>
                    </div>
                  )}
                  {stage === 'reasons' && <ReasonList />}
                  {stage === 'pics' && <Gallery />}
                  <div className="flex justify-center gap-4">
                    <button onClick={prevStage} className="text-xs text-gray-500 underline">Back</button>
                    <button onClick={nextStage} className="bg-red-600 px-10 py-3 rounded-full font-black uppercase tracking-tighter">Next Page</button>
                  </div>
               </div>
            )}

            {stage === 'bensonschoice' && <div className="w-full flex flex-col items-center"><BensonsChoice /><button onClick={nextStage} className="bg-red-600 px-10 py-3 rounded-full font-black uppercase tracking-tighter mt-10">ACCEPT CHOICE 🫦</button></div>}
            {stage === 'spicyslot' && <div className="space-y-8"><h2 className="text-3xl font-black uppercase italic">Nasty Slot Machine</h2><NastySlot /><button onClick={nextStage} className="text-red-500 font-bold underline">Next Page</button></div>}
            {stage === 'spicyscratch' && <div className="space-y-8"><h2 className="text-3xl font-black uppercase italic">Secret Scratch Card</h2><SpicyScratch /><button onClick={nextStage} className="text-red-500 font-bold underline">Next Page</button></div>}
            {stage === 'moodmap' && <div className="space-y-8 w-full"><h2 className="text-3xl font-black uppercase italic text-red-600">The Mood Map</h2><MoodMap /><button onClick={nextStage} className="bg-red-600 px-8 py-2 rounded-full font-bold uppercase mt-4">Next Page</button></div>}

            {(['touchmap','blindfold','whisper','temperature','challenge','confession','outfit','sensory','countdown','fantasy','pleasurepath','command','redroom','pulsesync','heatmap','ultimatedare','tease','contract','breathless','blind2','whisperwall','radar','wheel','secretfolder','finaltest','ascend1','ascend2','ascend3','ascend4','ascend5','ascend6','ascend7','todolist','diary','overload','timer','moodring','obsession','labyrinth'].includes(stage) || stage.startsWith('fact_') || stage.startsWith('memory_') || stage.startsWith('question_')) && (
              <div className="space-y-8 w-full">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-6xl mb-4 animate-pulse">{STAGE_DETAILS[stage]?.icon || "🔥"}</span>
                  <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.4em]">{STAGE_DETAILS[stage]?.sub || "NASTY STAGE"}</h2>
                  <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">{stage.replace('_', ' ').toUpperCase()}</h1>
                </div>

                <div className="red-glass p-10 rounded-[3rem] border-2 border-red-500/20 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
                  <p className="text-2xl font-bold italic text-gray-200 leading-relaxed relative z-10">
                    "{STAGE_DETAILS[stage]?.text || "The heat is rising, KENDYYY. Are you ready for what comes next?"}"
                  </p>
                </div>

                {stage === 'temperature' && (
                  <div className="bg-red-950/20 p-8 rounded-[3rem] border border-red-500/20 space-y-6">
                    <input type="range" min="0" max="100" value={temp} onChange={(e) => updateAppState({ temperature: parseInt(e.target.value) })} className="w-full h-4 bg-red-900/30 rounded-full appearance-none accent-red-600 cursor-pointer" />
                    <p className="text-5xl font-black text-red-500 italic animate-pulse">{temp}%</p>
                    <p className="text-sm font-bold opacity-60 uppercase">{temp > 90 ? "CRITICAL HEAT LEVEL" : "INCREASING PRESSURE"}</p>
                  </div>
                )}
                
                <div className="flex flex-col items-center gap-6 pt-4">
                  <p className="text-gray-500 italic font-medium text-sm">"The experience is at {Math.round((stageIndex/stages.length)*100)}% intensity..." {noCount > 0 && `(Resisted: ${noCount})`}</p>
                  <div className="flex gap-4">
                    <button onClick={prevStage} className="px-8 py-3 rounded-full font-bold uppercase text-xs border border-white/10 text-gray-500 hover:text-white transition-colors">Back</button>
                    <button onClick={nextStage} className="bg-red-600 text-white px-12 py-4 rounded-full font-black shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm">DEEPER 😈</button>
                  </div>
                </div>
              </div>
            )}

            {stage.startsWith('deep') && (
              <div className="space-y-8 w-full">
                <h2 className="text-xs font-black text-red-600 uppercase tracking-[0.5em] mb-4">Extreme Confession #{stage.slice(4)}</h2>
                <div className="red-glass p-12 rounded-[3.5rem] border-l-8 border-red-600 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                   <p className="text-3xl md:text-4xl font-black italic text-white leading-tight drop-shadow-lg relative z-10">
                    {stage === 'deep1' && "I want to be the only thing you think about when you're alone. 🫦"}
                    {stage === 'deep2' && "I want to feel your heart pounding against my chest in the dark. 🌑"}
                    {stage === 'deep3' && "I want to leave a trail of kisses from your neck all the way down. 🔥"}
                    {stage === 'deep4' && "I want to explore every inch of you with my tongue. 👅"}
                    {stage === 'deep5' && "I want to hear you beg me not to stop. 👄"}
                    {stage === 'deep6' && "I want to take you in ways you've never been taken before. 😈"}
                    {stage === 'deep7' && "I want to spend 24 hours locked in a room with just you. 🔒"}
                    {stage === 'deep8' && "I want to be the reason you're always a little bit distracted. 🫦"}
                    {stage === 'deep9' && "I want to own every single one of your 'nasty' thoughts. 👙"}
                    {stage === 'deep10' && "I want you to be as obsessed with me as I am with you. ♾️"}
                   </p>
                </div>
                <button onClick={nextStage} className="bg-white text-black px-12 py-3 rounded-full font-black uppercase tracking-tighter">Next Confession</button>
              </div>
            )}

            {stage.startsWith('descent') && (
              <div className="flex flex-col items-center justify-center">
                 <h2 className="text-8xl font-black text-red-600 uppercase italic tracking-tighter animate-bounce drop-shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                    {['CRAVING', 'WANTING', 'NEEDING', 'NASTY', 'EXTREME', 'OBSESSED', 'FOREVER', 'LIMITLESS', 'YOURS', 'NOW', 'FASTER', 'INTENSE', 'DEEPER', 'WILDER', 'SCREAM', 'BEG', 'YES', 'ALWAYS'][parseInt(stage.slice(7))-1]}
                 </h2>
                 <button onClick={nextStage} className="mt-20 bg-red-600 text-white px-10 py-4 rounded-full font-black shadow-2xl uppercase tracking-widest text-xs">Dive Deeper...</button>
              </div>
            )}

            {stage === 'ask' && (
              <div className="space-y-10 w-full">
                <img src="/assets/pic1.jpg" alt="KENDYYY" className="w-56 h-56 mx-auto rounded-full object-cover border-4 border-red-600 shadow-2xl" />
                <h1 className="text-4xl font-black uppercase leading-none tracking-tighter">Will you keep being my 'nasty' special person, KENDYYY?</h1>
                <div className="flex flex-col items-center justify-center gap-6 relative h-40">
                    <button onClick={handleYes} className="bg-red-600 text-white px-16 py-5 rounded-full text-3xl font-black shadow-[0_0_50px_rgba(220,38,38,0.5)] z-20">YES ❤️</button>
                    <motion.button onMouseEnter={moveNoButton} onTouchStart={moveNoButton} style={noButtonPos} className="bg-transparent border-2 border-white/20 text-white/40 px-10 py-3 rounded-full text-xl font-bold z-20">NO</motion.button>
                </div>
              </div>
            )}

            {stage === 'quiz' && (
              <div className="w-full flex flex-col items-center">
                <RealtimeQuiz />
                <button onClick={nextStage} className="text-red-500 font-bold underline mt-10">Skip / Next Page</button>
              </div>
            )}

            {stage === 'celebrate' && <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-[1000] p-10"><img src="/assets/pic2.jpg" className="w-64 h-64 rounded-3xl object-cover mb-8 border-4 border-red-600 shadow-2xl" /><h1 className="text-6xl font-black text-red-500 uppercase italic tracking-tighter">OUR VICTORY 🎉</h1></div>}
            {stage === 'letter' && <div className="w-full"><LetterModal isOpen={true} /></div>}

            {stage.startsWith('outro') && (
              <div className="space-y-10">
                <h2 className="text-7xl font-black text-red-600 italic uppercase tracking-tighter">{['THE END', 'OR IS IT?', 'SEE YOU TONIGHT', 'KENDYYY 🫦'][parseInt(stage.slice(-1))-1]}</h2>
                {stage !== 'outro4' && <button onClick={nextStage} className="bg-white text-black px-12 py-3 rounded-full font-black uppercase tracking-tighter">...</button>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <audio ref={audioRef} src="/assets/music.mp3" loop />
    </div>
  );
}

export default App;
