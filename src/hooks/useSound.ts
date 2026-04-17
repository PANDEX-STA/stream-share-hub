// Synthetic UI sounds via Web Audio API. Zero assets, opt-in.
import { useCallback, useEffect, useState } from "react";

type SoundName = "click" | "success" | "notify" | "error";

const STORAGE_KEY = "streamzone_sound_enabled";

let ctx: AudioContext | null = null;
const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
};

const tone = (
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.05,
  delay = 0,
) => {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  const start = ac.currentTime + delay;
  osc.frequency.setValueAtTime(freq, start);
  osc.type = type;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
};

const patterns: Record<SoundName, () => void> = {
  click: () => tone(620, 0.06, "triangle", 0.04),
  success: () => {
    tone(660, 0.09, "sine", 0.05);
    tone(880, 0.14, "sine", 0.05, 0.08);
  },
  notify: () => {
    tone(740, 0.1, "triangle", 0.045);
    tone(988, 0.12, "triangle", 0.045, 0.1);
  },
  error: () => {
    tone(220, 0.18, "sawtooth", 0.04);
    tone(180, 0.22, "sawtooth", 0.04, 0.1);
  },
};

const listeners = new Set<(v: boolean) => void>();
let enabledCache: boolean | null = null;
const readEnabled = () => {
  if (enabledCache !== null) return enabledCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    enabledCache = raw === null ? true : raw === "1";
  } catch {
    enabledCache = true;
  }
  return enabledCache;
};
const writeEnabled = (v: boolean) => {
  enabledCache = v;
  try {
    localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(v));
};

export const useSound = () => {
  const [enabled, setEnabledState] = useState<boolean>(() =>
    typeof window === "undefined" ? true : readEnabled(),
  );

  useEffect(() => {
    const l = (v: boolean) => setEnabledState(v);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      try {
        patterns[name]();
      } catch {
        /* ignore */
      }
    },
    [enabled],
  );

  const setEnabled = useCallback((v: boolean) => writeEnabled(v), []);
  const toggle = useCallback(() => writeEnabled(!readEnabled()), []);

  return { enabled, setEnabled, toggle, play };
};
