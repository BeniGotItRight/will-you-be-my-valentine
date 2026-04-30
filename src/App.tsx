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
  touchmap: { sub: "SENSORY EXPLORATION", text: "Close your eyes and imagine my hands tracing your collarbone. Where do you want them to go next?", icon: "📍" },
  blindfold: { sub: "TOTAL SURRENDER", text: "Darkness heightens everything. Can you feel the anticipation in the air?", icon: "🕶️" },
  whisper: { sub: "AUDITORY TEASE", text: "Lean in close. I have a secret to tell you, and it involves exactly what I'm going to do to you tonight.", icon: "👂" },
  challenge: { sub: "NASTY DARE", text: "I dare you to text me the one thing you're most afraid of wanting. Right now.", icon: "🔥" },
  confession: { sub: "RAW TRUTH", text: "Admission is the first step to obsession. Tell me your deepest, most unhinged thought about us.", icon: "👄" },
  outfit: { sub: "VISUAL DESIRE", text: "Pick something that makes it impossible for me to keep my hands off you. You know exactly what I mean.", icon: "👙" },
  sensory: { sub: "FEEL EVERYTHING", text: "Ice, heat, silk, or leather? Choose your weapon. I'll use it to drive you insane.", icon: "❄️" },
  countdown: { sub: "THE CLOCK IS TICKING", text: "Every second that passes is a second closer to you being completely mine. Are you ready?", icon: "⏳" },
  fantasy: { sub: "UNLEASHED", text: "Don't hold back. In this room, every single one of your 'nasty' thoughts is a command.", icon: "💭" },
  pleasurepath: { sub: "MAPPING THE JOURNEY", text: "We're going to explore every inch, every curve, and every hidden spot. Starting... now.", icon: "🗺️" },
  command: { sub: "OBEDIENCE", text: "When I give an order, I expect total compliance. Do you understand, KENDYYY?", icon: "👑" },
  redroom: { sub: "THE CORE", text: "Welcome to the place where rules don't exist. Only our shared, desperate hunger.", icon: "🏮" },
  pulsesync: { sub: "ONE HEARTBEAT", text: "Can you feel it? Our pulses are matching. The excitement is becoming uncontrollable.", icon: "💓" },
  heatmap: { sub: "THERMAL SENSITIVITY", text: "The temperature is rising. You're glowing, and I'm the reason why.", icon: "🌡️" },
  ultimatedare: { sub: "NO RETREAT", text: "This is the final test of your devotion. Are you willing to cross every line for me?", icon: "💥" },
  tease: { sub: "SLOW TORTURE", text: "I'm going to take my time. I want you to beg for it before I even touch you.", icon: "👅" },
  contract: { sub: "SOVEREIGNTY", text: "By proceeding, you agree to give me total control over your pleasure for the next 24 hours.", icon: "📜" },
  breathless: { sub: "OXYGEN DEPRIVATION", text: "I want to hear you gasp. I want to see you struggle to find your words while I hold you.", icon: "💨" },
  blind2: { sub: "DEEPER DARKNESS", text: "Even without sight, you can feel my presence everywhere. You can't escape me.", icon: "🌑" },
  whisperwall: { sub: "ECHOES OF LUST", text: "Every word you've ever whispered to me is carved into my memory. Say them again.", icon: "🗣️" },
  radar: { sub: "TRACKING DESIRE", text: "I can sense exactly where you are and exactly what you're feeling. You're radiating heat.", icon: "📡" },
  wheel: { sub: "FATE'S CHOICE", text: "Spin the wheel. Whatever it lands on, you must endure with a smile.", icon: "🎡" },
  secretfolder: { sub: "CLINICAL EVIDENCE", text: "I've kept a record of every 'nasty' thing you've ever said. Want to see the proof?", icon: "📁" },
  finaltest: { sub: "GRADUATION", text: "You've made it through the fire. Now, show me that you truly belong to me.", icon: "🎓" },
  ascend1: { sub: "ASCENSION I", text: "Rising above the mundane. Entering the realm of pure obsession.", icon: "✨" },
  ascend2: { sub: "ASCENSION II", text: "The air is getting thinner. The pleasure is getting sharper.", icon: "✨" },
  ascend3: { sub: "ASCENSION III", text: "Higher and higher. Don't look down. Only look at me.", icon: "✨" },
  ascend4: { sub: "ASCENSION IV", text: "We're leaving the world behind. Only us. Only this.", icon: "✨" },
  ascend5: { sub: "ASCENSION V", text: "Complete detachment from reality. Total focus on sensation.", icon: "✨" },
  ascend6: { sub: "ASCENSION VI", text: "The peak is in sight. Are you trembling yet?", icon: "✨" },
  ascend7: { sub: "ASCENSION VII", text: "Absolute peak. Limitless. Forever. Infinite.", icon: "✨" },
  obsession: { sub: "THE FINAL FRONTIER", text: "I don't just want you. I need you. I am obsessed with every part of you.", icon: "👁️" },
  labyrinth: { sub: "NO EXIT", text: "You've wandered too deep. The only way out is through me.", icon: "🌀" },
  todolist: { sub: "TONIGHT'S AGENDA", text: "1. Worship. 2. Obey. 3. Beg. 4. Repeat. 5. Forever.", icon: "📋" },
  diary: { sub: "PRIVATE ENTRY", text: "'Today, I realized that I will never let her go. She is mine in every sense of the word.'", icon: "📓" },
  overload: { sub: "SYSTEM FAILURE", text: "Sensory overload. Your mind is blank. Only feeling remains.", icon: "⚡" },
  timer: { sub: "COUNTDOWN TO PLEASURE", text: "The wait is almost over. The reward is going to be explosive.", icon: "⏲️" },
  moodring: { sub: "EMOTIONAL COLOR", text: "Your aura is deep crimson. You're ready for the extreme.", icon: "💍" },
  fact_1: { sub: "NASTY FACT #1", text: "Benson thinks about you every 5 minutes. And it's never 'sweet' thoughts. 🫦", icon: "📊" },
  fact_2: { sub: "NASTY FACT #2", text: "The most searched term in Benson's mind is 'KENDYYY on her knees'. 👑", icon: "🔍" },
  fact_3: { sub: "NASTY FACT #3", text: "Benson has a secret folder of every voice note you've ever sent. 🔥", icon: "📂" },
  fact_4: { sub: "NASTY FACT #4", text: "Benson knows exactly which outfit makes you feel the most vulnerable. 👙", icon: "👗" },
  fact_5: { sub: "NASTY FACT #5", text: "Benson's favorite sound in the world is your moan when he grips you. 👅", icon: "🔊" },
  memory_1: { sub: "SHARED MEMORY", text: "Remember that time we talked about our wildest fantasies? We're living them now. 💭", icon: "🧠" },
  memory_2: { sub: "SHARED MEMORY", text: "That look you gave me when you thought I wasn't watching. I saw everything. 👁️", icon: "🧠" },
  memory_3: { sub: "SHARED MEMORY", text: "The first time I told you I wanted to own you. You didn't say no. 🔒", icon: "🧠" },
  memory_4: { sub: "SHARED MEMORY", text: "Every time we've edged closer to the 'extreme'. Tonight, we cross the line. 🔥", icon: "🧠" },
  memory_5: { sub: "SHARED MEMORY", text: "The way you reacted to my first 'nasty' order. It was perfect. 🫦", icon: "🧠" },
  question_1: { sub: "NASTY QUESTION", text: "What is the one thing you're too scared to ask me to do to you? 🫦", icon: "❓" },
  question_2: { sub: "NASTY QUESTION", text: "How many times a day do you have 'nasty' thoughts about me? 😈", icon: "❓" },
  question_3: { sub: "NASTY QUESTION", text: "Which part of your body is the most sensitive to my touch? 🔥", icon: "❓" },
  question_4: { sub: "NASTY QUESTION", text: "If I ordered you to do something truly unhinged, would you? 🔒", icon: "❓" },
  question_5: { sub: "NASTY QUESTION", text: "What's the 'nastiest' thing you want to do to me tonight? 👅", icon: "❓" },
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
