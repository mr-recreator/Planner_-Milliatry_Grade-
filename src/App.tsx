import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Circle, Trash2, Clock, Bold, Star, Calendar as CalIcon, Edit2, X, AlertTriangle, ChevronLeft, ChevronRight, Type } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jee-tasks') || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [bold, setBold] = useState(false);
  const [font, setFont] = useState('font-sans');
  const [prio, setPrio] = useState(false);
  const [cat, setCat] = useState('Physics');
  const [backlog, setBacklog] = useState(false);

  const [time, setTime] = useState(3600);
  const [active, setActive] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [sessionEnd, setSessionEnd] = useState(false);
  const [breakPrompt, setBreakPrompt] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const [tab, setTab] = useState<'tasks'|'calendar'>('tasks');
  const [placeholder, setPlaceholder] = useState('');
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showFonts, setShowFonts] = useState(false);

  useEffect(() => {
    const code = `let t; self.onmessage = e => { if(e.data==='start') t = setInterval(()=>postMessage('tick'), 1000); else if(e.data==='stop') clearInterval(t); }`;
    const blob = new Blob([code], {type: 'application/javascript'});
    workerRef.current = new Worker(URL.createObjectURL(blob));
    workerRef.current.onmessage = () => {
      setTime(p => {
        if (p <= 1) { workerRef.current?.postMessage('stop'); setActive(false); setSessionEnd(true); return 0; }
        return p - 1;
      });
    };
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => { if(active) workerRef.current?.postMessage('start'); else workerRef.current?.postMessage('stop'); }, [active]);
  useEffect(() => localStorage.setItem('jee-tasks', JSON.stringify(tasks)), [tasks]);

  useEffect(() => {
    const phrases = ["Uncap the Momento pen. What's the next target?", "What target should we lock on?", "Start brief for the mission"];
    setPlaceholder(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  const formatDt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const todayStr = formatDt(new Date());

  const add = () => {
    if(!input) return;
    setTasks([...tasks, { id: Date.now(), text: input, done: false, cat, backlog, bold, font, prio, date: todayStr }]);
    setInput(''); setPrio(false);
  };

  const sortedTasks = [...tasks].sort((a,b) => (a.done === b.done ? (b.prio === a.prio ? 0 : b.prio ? 1 : -1) : a.done ? 1 : -1));

  const dInM = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const fDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const days = Array.from({length: 42}, (_, i) => (i - fDay + 1 > 0 && i - fDay + 1 <= dInM) ? i - fDay + 1 : null);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 pt-28 flex flex-col items-center font-sans relative">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}</style>
      
      <div className="fixed inset-0 opacity-20 bg-cover bg-center pointer-events-none" style={{backgroundImage: "url('/image_38a99e.jpg')"}} />

      {/* Dynamic Island Navigation */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/80 backdrop-blur-xl border border-gray-700/80 rounded-full p-1.5 flex gap-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-500 hover:scale-105">
        <button onClick={()=>setTab('tasks')} className={`px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold tracking-wide transition-all duration-300 ${tab==='tasks' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}><Clock size={16}/> Execution</button>
        <button onClick={()=>setTab('calendar')} className={`px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold tracking-wide transition-all duration-300 ${tab==='calendar' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}><CalIcon size={16}/> Logs</button>
      </div>

      <div className="z-10 w-full max-w-5xl">
        {tab === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {}
            <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-700 shadow-2xl h-fit backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg uppercase tracking-widest text-blue-400 flex items-center font-bold"><Clock className="mr-2" size={18}/> Focus Block</h2>
                <button onClick={() => setEditingTime(!editingTime)} className="text-gray-500 hover:text-white transition"><Edit2 size={16}/></button>
              </div>

              {editingTime ? (
                <input type="number" defaultValue={time/60} onBlur={e => { setTime(Math.max(1, Number(e.target.value))*60); setEditingTime(false); }} className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-center text-4xl font-mono mb-6 focus:border-blue-500 outline-none text-white" autoFocus />
              ) : (
                <div className="text-7xl font-mono mb-8 text-center tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">{`${Math.floor(time/60)}:${(time%60).toString().padStart(2,'0')}`}</div>
              )}

              {!sessionEnd ? (
                <div className="flex gap-3">
                  <button onClick={() => setActive(!active)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">{active ? 'PAUSE' : 'ENGAGE'}</button>
                  <button onClick={() => { setActive(false); setTime(3600); }} className="bg-gray-800 hover:bg-gray-700 px-6 rounded-xl font-bold tracking-wider transition-all text-white">RESET</button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button onClick={() => { setTime(300); setSessionEnd(false); setActive(true); }} className="flex-1 bg-green-900/30 text-green-400 border border-green-500/50 py-3 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 hover:bg-green-600/40"><span className="text-xl">5m</span><span className="text-[10px] uppercase tracking-widest opacity-80">Breather</span></button>
                  <button onClick={() => setBreakPrompt(true)} className="flex-1 bg-orange-900/30 text-orange-400 border border-orange-500/50 py-3 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 hover:bg-orange-600/40"><span className="text-xl">15m</span><span className="text-[10px] uppercase tracking-widest opacity-80">Deep Rest</span></button>
                </div>
              )}
            </div>

            {}
            <div className="col-span-2 bg-gray-900/80 p-6 rounded-3xl border border-gray-700 shadow-2xl backdrop-blur-md flex flex-col h-[75vh]">
              <div className="flex gap-2 mb-6 flex-wrap items-center">
                {['Physics', 'Chemistry', 'Math'].map(c => <button key={c} onClick={()=>setCat(c)} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${cat===c ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.5)] text-white' : 'bg-gray-950 text-gray-400 hover:bg-gray-800 border border-gray-800'}`}>{c}</button>)}
                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                <button onClick={()=>setBacklog(!backlog)} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${backlog ? 'bg-red-900/50 text-red-400 border border-red-500 shadow-[0_0_12px_rgba(220,38,38,0.4)]' : 'bg-gray-950 text-gray-400 border border-gray-800 hover:bg-gray-800'}`}>+ Backlog</button>
              </div>

              <div className="flex items-center gap-3 bg-gray-950 p-2 pl-4 rounded-2xl border border-gray-800 mb-6 focus-within:border-blue-500/50 transition-all shadow-inner relative">
                <div className="relative">
                  <button onClick={()=>setShowFonts(!showFonts)} className={`p-2 rounded-lg transition-all ${showFonts?'bg-gray-800 text-blue-400':'text-gray-500 hover:text-gray-300'}`}><Type size={18}/></button>
                  {showFonts && (
                    <div className="absolute top-full mt-2 left-0 bg-gray-800 border border-gray-700 rounded-xl p-1 flex flex-col gap-1 z-20 shadow-xl">
                      <button onClick={()=>{setFont('font-sans'); setShowFonts(false);}} className={`px-4 py-1.5 rounded-lg text-sm font-sans text-left ${font==='font-sans'?'bg-blue-600 text-white':'hover:bg-gray-700'}`}>Sans</button>
                      <button onClick={()=>{setFont('font-serif'); setShowFonts(false);}} className={`px-4 py-1.5 rounded-lg text-sm font-serif text-left ${font==='font-serif'?'bg-blue-600 text-white':'hover:bg-gray-700'}`}>Serif</button>
                      <button onClick={()=>{setFont('font-mono'); setShowFonts(false);}} className={`px-4 py-1.5 rounded-lg text-sm font-mono text-left ${font==='font-mono'?'bg-blue-600 text-white':'hover:bg-gray-700'}`}>Mono</button>
                    </div>
                  )}
                </div>
                <button onClick={()=>setBold(!bold)} className={`p-2 rounded-lg transition-all ${bold?'bg-gray-800 text-blue-400':'text-gray-500 hover:text-gray-300'}`}><Bold size={18}/></button>
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} className={`flex-1 bg-transparent outline-none text-lg placeholder-gray-600 ${font}`} style={{fontWeight: bold?'bold':'normal'}} placeholder={placeholder} />
                <button onClick={()=>setPrio(!prio)} className={`p-2 rounded-xl transition-all ${prio?'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] scale-110 bg-yellow-400/10':'text-gray-600 hover:text-gray-400'}`}><Star size={22} fill={prio?'currentColor':'none'}/></button>
                <button onClick={add} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_12px_rgba(37,99,235,0.3)] text-sm">EXECUTE</button>
              </div>

              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {sortedTasks.filter(t => t.date === todayStr).map((t: any) => (
                  <div key={t.id} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${t.done ? 'bg-gray-950/50 border-gray-800/50 opacity-40 hover:opacity-70' : t.prio ? 'bg-gray-900 border-yellow-500/40 shadow-[0_4px_20px_rgba(250,204,21,0.08)]' : 'bg-gray-900/90 border-gray-700/50 hover:border-gray-500'}`}>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setTasks(tasks.map((x: any) => x.id === t.id ? {...x, done: !x.done} : x))} className="transition-transform active:scale-75">
                        {t.done ? <CheckCircle className="text-blue-500" /> : <Circle className={t.prio ? 'text-yellow-500' : 'text-gray-500'} />}
                      </button>
                      <div>
                        <span style={{fontWeight: t.bold?'bold':'normal'}} className={`text-lg block transition-all ${t.font} ${t.done?'line-through text-gray-500':''}`}>{t.text}</span>
                        <div className="flex gap-2 mt-1.5 opacity-80">
                          <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-blue-300 bg-blue-900/30 border border-blue-800/50 px-2 py-0.5 rounded-full">{t.cat}</span>
                          {t.backlog && <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-red-300 bg-red-900/30 border border-red-800/50 px-2 py-0.5 rounded-full">Backlog</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      {t.prio && !t.done && <Star className="text-yellow-500 animate-pulse" size={16} fill="currentColor"/>}
                      <button onClick={() => setTasks(tasks.filter((x: any) => x.id !== t.id))} className="p-2 bg-gray-950 rounded-lg border border-gray-800 hover:border-red-900"><Trash2 className="text-gray-500 hover:text-red-400 transition-colors" size={16}/></button>
                    </div>
                  </div>
                ))}
                {sortedTasks.filter(t => t.date === todayStr).length === 0 && <div className="text-center text-gray-600 mt-16 italic">No targets locked. Time to open the Classmate Pulse and execute.</div>}
              </div>
            </div>
          </div>
        )}

        {}
        {tab === 'calendar' && (
          <div className="bg-gray-900/90 p-8 rounded-3xl border border-gray-700 shadow-2xl backdrop-blur-xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-white">Mission Logs</h2>
              <div className="flex items-center gap-4 bg-gray-950 p-1.5 rounded-full border border-gray-800">
                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-800 rounded-full transition-all"><ChevronLeft size={18}/></button>
                <span className="text-sm font-bold uppercase tracking-widest text-blue-400 w-36 text-center">{viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-800 rounded-full transition-all"><ChevronRight size={18}/></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-3 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">{d}</div>)}
              {days.map((d, i) => {
                if (!d) return <div key={i} className="h-28 rounded-2xl bg-gray-950/20"></div>;
                const dateStr = formatDt(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
                const isToday = dateStr === todayStr;
                const dayTasks = tasks.filter(t => t.date === dateStr);
                const completed = dayTasks.filter(t => t.done).length;
                
                return (
                  <div key={i} onClick={() => setSelectedDate(dateStr)} className={`group h-28 rounded-2xl border p-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col ${isToday ? 'border-blue-500 bg-blue-900/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'border-gray-800/80 bg-gray-950/60 hover:border-gray-600 hover:bg-gray-900'}`}>
                    <span className={`text-sm font-mono self-start ${isToday ? 'text-blue-400 font-bold bg-blue-900/30 px-2 py-0.5 rounded-md' : 'text-gray-500 group-hover:text-gray-300'}`}>{d}</span>
                    {dayTasks.length > 0 && (
                      <div className="mt-auto flex flex-col gap-2">
                        <span className="text-[10px] font-bold tracking-wider text-gray-500 text-left">{completed}/{dayTasks.length} DONE</span>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${completed === dayTasks.length ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${(completed/dayTasks.length)*100}%`}}></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {}
      {selectedDate && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative flex flex-col max-h-[80vh]">
            <button onClick={() => setSelectedDate(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-2 rounded-full"><X size={18}/></button>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-blue-400 border-b border-gray-800 pb-4">Log: <span className="text-white">{new Date(selectedDate).toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span></h3>
            <div className="overflow-y-auto pr-2 flex-1 space-y-3 custom-scrollbar">
              {tasks.filter(t => t.date === selectedDate).length === 0 ? (
                 <div className="text-center text-gray-600 py-12 italic">No targets recorded on this date.</div>
              ) : (
                tasks.filter(t => t.date === selectedDate).map(t => (
                  <div key={t.id} className={`p-4 bg-gray-950/50 border border-gray-800 rounded-2xl flex items-center gap-4 ${t.done?'opacity-60':''}`}>
                    {t.done ? <CheckCircle size={18} className="text-blue-500 shrink-0"/> : <Circle size={18} className="text-gray-600 shrink-0"/>}
                    <span className={`text-sm ${t.font} ${t.done?'line-through text-gray-500':''}`} style={{fontWeight: t.bold?'bold':'normal'}}>{t.text}</span>
                    <span className="ml-auto font-sans text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full">{t.cat}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {breakPrompt && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-10 max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 animate-pulse"></div>
            <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-6 animate-bounce" />
            <h3 className="text-3xl font-black tracking-tight mb-3 text-white">Are you sure???</h3>
            <p className="text-gray-400 mb-10 text-sm">A 15-minute break breaks momentum. Ensure your previous block was extremely productive before proceeding.</p>
            <div className="flex gap-4">
              <button onClick={() => setBreakPrompt(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-4 rounded-2xl font-bold tracking-wide transition-all text-white">CANCEL</button>
              <button onClick={() => { setTime(900); setSessionEnd(false); setActive(true); setBreakPrompt(false); }} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold tracking-wide transition-all text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]">I EARNED IT</button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 w-full bg-gray-950/80 backdrop-blur-sm border-t border-gray-800 p-3 text-center text-gray-500 text-xs font-bold uppercase tracking-widest z-10 flex justify-center items-center gap-3">
        <span className="text-blue-500 animate-pulse text-lg leading-none">●</span> 
        <span>Target: IIT Bombay CSE 2028</span>
        <span className="opacity-30">|</span>
        <span className="hidden md:inline">"Till the full stop doesn't come, the sentence is not complete."</span>
      </div>
    </div>
  );
}