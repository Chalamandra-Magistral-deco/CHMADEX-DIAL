import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit,
  Shuffle, 
  Zap,
  ExternalLink, 
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Info,
  Loader2,
  Cpu,
  Cloud,
  History,
  Trash2,
  KeyRound,
  Check,
  X,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { chalamandra } from './services/chalamandraService';
import { DialecticStyle, DialecticalState, ProcessingStatus, CapabilityStatus, PromptHistory } from './types';

const App: React.FC = () => {
  // ============ Estado principal ============
  const [input, setInput] = useState('');
  const [thesisStyle, setThesisStyle] = useState<DialecticStyle>('chola');
  const [antithesisStyle, setAntithesisStyle] = useState<DialecticStyle>('malandra');
  const [status, setStatus] = useState<ProcessingStatus>({ step: 'idle' });
  const [result, setResult] = useState<DialecticalState | null>(null);
  const [capabilities, setCapabilities] = useState<CapabilityStatus | null>(null);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // ============ Estado de configuración de API Key ============
  const [hasKey, setHasKey] = useState<boolean | null>(null); // null = cargando
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const caps = await chalamandra.checkCapabilities();
      setCapabilities(caps);

      // Verificar si hay API key configurada
      const keyExists = await chalamandra.hasApiKey();
      setHasKey(keyExists);
      if (!keyExists) setShowSettings(true);

      // Cargar texto seleccionado / historial
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['lastSelectedText', 'chalamandra_history'], (data) => {
          if (data.lastSelectedText) {
            setInput(data.lastSelectedText as string);
            chrome.storage.local.remove('lastSelectedText');
          }
          if (data.chalamandra_history) {
            setHistory(data.chalamandra_history as PromptHistory[]);
          }
        });
      }
    };
    init();
  }, []);

  // ============ Handlers de API Key ============
  const handleSaveKey = async () => {
    const trimmed = tempKey.trim();
    if (!trimmed) {
      setSettingsMessage('La key no puede estar vacía.');
      return;
    }
    if (!trimmed.startsWith('AIza')) {
      setSettingsMessage('Las keys de Gemini empiezan con "AIza...". Verifica tu key.');
      return;
    }
    setSavingKey(true);
    setSettingsMessage(null);
    try {
      await chalamandra.saveApiKey(trimmed);
      setHasKey(true);
      setShowSettings(false);
      setTempKey('');
      setSettingsMessage(null);
    } catch (e) {
      setSettingsMessage('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSavingKey(false);
    }
  };

  const handleClearKey = async () => {
    await chalamandra.clearApiKey();
    setHasKey(false);
    setTempKey('');
    setShowSettings(true);
    setSettingsMessage('Key eliminada.');
  };

  // ============ Handlers del flujo principal ============
  const saveToHistory = (newResult: DialecticalState) => {
    const entry: PromptHistory = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      input,
      result: newResult,
      styles: { thesis: thesisStyle, antithesis: antithesisStyle }
    };
    const updatedHistory = [entry, ...history].slice(0, 20);
    setHistory(updatedHistory);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ 'chalamandra_history': updatedHistory });
    }
  };

  const handleProcess = async () => {
    if (!input.trim()) return;
    setResult(null);
    setFeedback(null);
    setStatus({ step: 'analyzing_thesis', message: 'Sincronizando Tesis...' });

    try {
      const dialecticResult = await chalamandra.runDialectic(
        input,
        thesisStyle,
        antithesisStyle,
        (msg) => setStatus(prev => ({ ...prev, message: msg }))
      );
      setResult(dialecticResult);
      saveToHistory(dialecticResult);
      setStatus({ step: 'complete' });
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : 'Fallo en la sincronización cuántica.';
      setStatus({ step: 'error', message: msg });
    }
  };

  const handleDisruption = async () => {
    if (!input.trim()) return;
    setResult(null);
    setStatus({ step: 'disrupting', message: 'Hackeando realidad...' });

    try {
      const text = await chalamandra.generateDisruption(input);
      const disruptionResult: DialecticalState = {
        thesis: input,
        antithesis: "ORDEN ESTABLECIDO",
        synthesis: text,
        energySignature: "disruption-369"
      };
      setResult(disruptionResult);
      saveToHistory(disruptionResult);
      setStatus({ step: 'complete' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error de disrupción.';
      setStatus({ step: 'error', message: msg });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.remove('chalamandra_history');
    }
  };

  // ============ Pantalla de carga inicial ============
  if (hasKey === null) {
    return (
      <div className="p-6 flex items-center justify-center" style={{ minHeight: '300px' }}>
        <Loader2 className="animate-spin w-6 h-6 text-malandra" />
      </div>
    );
  }

  // ============ Pantalla de configuración de API Key ============
  if (showSettings) {
    return (
      <div className="p-6 flex flex-col gap-5 select-none animate-in fade-in duration-500">
        <header className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chola via-malandra to-fresa p-[1px]">
            <div className="w-full h-full bg-void rounded-xl flex items-center justify-center">
              <KeyRound className="text-malandra w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase bg-gradient-to-r from-chola via-malandra to-fresa bg-clip-text text-transparent italic leading-none">
              Configuración
            </h1>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] mt-1">
              API Key de Gemini
            </p>
          </div>
        </header>

        <div className="glass-panel rounded-xl p-4 border-l-2 border-chola space-y-3">
          <div className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-chola flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1 text-chola">Necesitas una API Key de Gemini</p>
              <p className="font-light text-slate-400">
                Tu key se guarda <strong className="text-slate-200">solo en este navegador</strong> y nunca se envía a ningún servidor. La extensión la usa para llamar directamente a Google.
              </p>
            </div>
          </div>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-malandra hover:opacity-70 transition-opacity"
          >
            <ExternalLink className="w-3 h-3" />
            Obtener API Key gratis en Google AI Studio
          </a>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
            API Key
          </label>
          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:ring-1 focus:ring-malandra outline-none transition-all placeholder:text-slate-600 font-mono"
            autoComplete="off"
            spellCheck={false}
          />
          {settingsMessage && (
            <p className={`text-[10px] font-mono ${settingsMessage.includes('eliminada') || settingsMessage.includes('éxito') ? 'text-emerald-400' : 'text-fresa'}`}>
              {settingsMessage}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveKey}
            disabled={savingKey || !tempKey.trim()}
            className="flex-1 bg-gradient-to-r from-chola to-malandra text-white font-black rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg shadow-chola/10 hover:shadow-malandra/20 transition-all text-[10px] uppercase tracking-widest disabled:opacity-30 active:scale-95"
          >
            {savingKey ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
            {savingKey ? 'Guardando...' : 'Guardar Key'}
          </button>

          {hasKey && (
            <>
              <button
                onClick={() => { setShowSettings(false); setSettingsMessage(null); }}
                className="flex-1 glass-panel border-white/10 text-slate-300 font-bold rounded-xl py-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                Cancelar
              </button>
              <button
                onClick={handleClearKey}
                className="glass-panel border-fresa/30 text-fresa font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-[10px] uppercase hover:bg-fresa/10 transition-all active:scale-95"
                title="Eliminar key guardada"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        <div className="text-[9px] text-slate-600 leading-relaxed border-t border-white/5 pt-3">
          <p className="font-mono uppercase tracking-widest mb-1">Privacidad</p>
          <p>La API key se almacena usando <code className="text-slate-500">chrome.storage.local</code>, cifrado en el perfil de tu Chrome. Se borra al desinstalar la extensión. Nunca sale de tu navegador.</p>
        </div>
      </div>
    );
  }

  // ============ Pantalla principal ============
  return (
    <div className="p-6 flex flex-col gap-6 select-none animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chola via-malandra to-fresa p-[1px]">
            <div className="w-full h-full bg-void rounded-xl flex items-center justify-center">
              <Sparkles className="text-malandra w-5 h-5 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase bg-gradient-to-r from-chola via-malandra to-fresa bg-clip-text text-transparent italic leading-none">
              Chalamandra
            </h1>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1 mt-1">
              <Cpu className="w-2.5 h-2.5" /> Magistral Engine v4.1
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button
             onClick={() => setShowHistory(!showHistory)}
             className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
             title="Historial de decodificaciones"
           >
             <History className="w-4 h-4" />
           </button>
           <button
             onClick={() => { setTempKey(''); setSettingsMessage(null); setShowSettings(true); }}
             className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
             title="Configuración de API Key"
           >
             <Settings className="w-4 h-4" />
           </button>
           {capabilities && (
              <div className={`flex items-center gap-2 text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${capabilities.languageModel === 'local' ? 'text-hybrida border-hybrida/20 bg-hybrida/5' : 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5'}`}>
                {capabilities.languageModel === 'local' ? <Zap className="w-2.5 h-2.5" /> : <Cloud className="w-2.5 h-2.5" />}
                {capabilities.languageModel === 'local' ? 'Nano Edge' : 'Gemini Cloud'}
              </div>
           )}
        </div>
      </header>

      {showHistory ? (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registros Cuánticos</h3>
            <button onClick={clearHistory} className="text-[8px] text-fresa uppercase font-bold flex items-center gap-1 hover:opacity-70">
              <Trash2 className="w-3 h-3" /> Limpiar
            </button>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {history.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-600 italic">No hay registros aún.</p>
            ) : history.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-lg p-3 text-[11px] cursor-pointer hover:bg-white/5 transition-colors border-l-2 border-hybrida"
                onClick={() => {
                  setInput(item.input);
                  setResult(item.result);
                  setThesisStyle(item.styles.thesis);
                  setAntithesisStyle(item.styles.antithesis);
                  setShowHistory(false);
                }}
              >
                <div className="flex justify-between opacity-50 text-[8px] mb-1">
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  <span>{item.result.energySignature}</span>
                </div>
                <p className="line-clamp-2 text-slate-300 font-medium">"{item.input}"</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowHistory(false)}
            className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-white/5 rounded-lg hover:bg-white/5"
          >
            Volver
          </button>
        </div>
      ) : (
        <>
          <main className="space-y-5">
            <div className="relative group">
              <textarea
                className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-1 focus:ring-malandra outline-none transition-all placeholder:text-slate-600 resize-none font-light leading-relaxed scrollbar-hide"
                placeholder="Introduce dilema, idea o realidad a decodificar..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 transition-opacity" title="Selecciona texto en el navegador para cargarlo aquí automáticamente.">
                <Info className="w-4 h-4 cursor-help text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel rounded-xl p-3 border-l-2 border-chola transition-all hover:bg-white/[0.05]">
                <label className="text-[8px] font-bold text-chola uppercase tracking-[0.2em] block mb-1 opacity-70">Tesis Node</label>
                <select
                  value={thesisStyle}
                  onChange={(e) => setThesisStyle(e.target.value as DialecticStyle)}
                  className="w-full bg-transparent text-[11px] font-bold outline-none cursor-pointer text-slate-300 appearance-none"
                >
                  <option value="chola">CHOLA (Barrio)</option>
                  <option value="fresa">FRESA (Tech)</option>
                  <option value="malandra">MALANDRA (Strat)</option>
                </select>
              </div>
              <div className="glass-panel rounded-xl p-3 border-l-2 border-malandra transition-all hover:bg-white/[0.05]">
                <label className="text-[8px] font-bold text-malandra uppercase tracking-[0.2em] block mb-1 opacity-70">Antítesis Node</label>
                <select
                  value={antithesisStyle}
                  onChange={(e) => setAntithesisStyle(e.target.value as DialecticStyle)}
                  className="w-full bg-transparent text-[11px] font-bold outline-none cursor-pointer text-slate-300 appearance-none"
                >
                  <option value="malandra">MALANDRA (Strat)</option>
                  <option value="chola">CHOLA (Barrio)</option>
                  <option value="fresa">FRESA (Tech)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleProcess}
                disabled={status.step !== 'idle' && status.step !== 'complete' && status.step !== 'error'}
                className="flex-[2] bg-gradient-to-r from-chola to-malandra text-white font-black rounded-xl py-4 flex items-center justify-center gap-2 shadow-xl shadow-chola/10 hover:shadow-malandra/20 transition-all text-xs uppercase tracking-widest disabled:opacity-50 active:scale-95"
              >
                {status.step.includes('analyzing') || status.step === 'synthesizing' ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <BrainCircuit className="w-4 h-4" />
                )}
                Decodificar 369
              </button>
              <button
                onClick={handleDisruption}
                className="flex-1 glass-panel border-fresa/30 text-fresa font-bold rounded-xl py-4 flex items-center justify-center gap-2 text-xs uppercase hover:bg-fresa/10 transition-all active:scale-95"
              >
                <Shuffle className="w-4 h-4" />
                Disrupt
              </button>
            </div>
          </main>

          {status.step !== 'idle' && status.step !== 'complete' && status.step !== 'error' && (
            <div className="py-4 text-center border-y border-white/5 animate-pulse">
               <span className="text-[10px] font-mono text-hybrida uppercase tracking-widest">{status.message}</span>
            </div>
          )}

          {status.step === 'error' && (
            <div className="glass-panel rounded-xl p-4 border-l-2 border-fresa text-fresa text-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{status.message}</span>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-5 pb-8 animate-in slide-in-from-bottom-6 duration-700">
              <div className="glass-panel rounded-xl p-5 border-l-4 border-chola relative group">
                <h4 className="text-[10px] font-black text-chola mb-3 flex items-center gap-2 uppercase tracking-tighter">
                  <Zap className="w-3 h-3" /> Tesis: {thesisStyle.toUpperCase()}
                </h4>
                <div className="text-xs leading-relaxed text-slate-300 font-light whitespace-pre-wrap">
                  {result.thesis}
                </div>
                {result.thesisSources && result.thesisSources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    {result.thesisSources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[9px] bg-white/5 px-2 py-1 rounded flex items-center gap-1.5 hover:bg-white/10 text-slate-400 hover:text-malandra transition-colors max-w-[140px] truncate">
                        <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" /> {s.title || new URL(s.uri).hostname.replace('www.', '')}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-xl p-5 border-l-4 border-malandra">
                <h4 className="text-[10px] font-black text-malandra mb-3 flex items-center gap-2 uppercase tracking-tighter">
                  <Shuffle className="w-3 h-3" /> Antítesis: {antithesisStyle.toUpperCase()}
                </h4>
                <div className="text-xs leading-relaxed text-slate-300 font-light whitespace-pre-wrap">
                  {result.antithesis}
                </div>
              </div>

              <div className="glass-panel rounded-xl p-6 border-l-4 border-hybrida bg-gradient-to-br from-hybrida/10 via-transparent to-transparent shadow-quantum relative group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-[10px] font-black text-hybrida flex items-center gap-2 uppercase tracking-tighter">
                    <Sparkles className="w-3 h-3" /> Síntesis Salamandra Magistral
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFeedback('liked')}
                      className={`p-1.5 rounded-lg transition-colors ${feedback === 'liked' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-slate-600'}`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setFeedback('disliked')}
                      className={`p-1.5 rounded-lg transition-colors ${feedback === 'disliked' ? 'bg-fresa/20 text-fresa' : 'hover:bg-white/5 text-slate-600'}`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    <button onClick={handleProcess} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-600 transition-colors" title="Regenerar Síntesis">
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-sm font-semibold leading-relaxed text-white italic border-l border-white/10 pl-4 py-1 whitespace-pre-wrap">
                  "{result.synthesis}"
                </div>
                <div className="mt-6 flex justify-between items-center text-[8px] font-mono text-slate-600 uppercase tracking-widest pt-4 border-t border-white/5">
                  <span>Signature: {result.energySignature}</span>
                  <span className="animate-pulse flex items-center gap-1">
                    <div className="w-1 h-1 bg-hybrida rounded-full"></div> Quantum Decoded
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
