"use client";
import { useEffect, useRef, useState } from "react";
import { birthday } from "./birthday-content";
const clamp = (v: number) => Math.min(1, Math.max(0, v));
export function Confetti({ trigger, reduced }: { trigger: number; reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!trigger || reduced) return;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const w = window.innerWidth, h = window.innerHeight, ratio = Math.min(devicePixelRatio, 2);
    el.width = w * ratio; el.height = h * ratio; ctx.scale(ratio, ratio);
    const colors = ["#b699d3", "#ed9cbf", "#f8d28e", "#8652ac", "#fff6eb"];
    const particles = Array.from({ length: 180 }, (_, i) => ({ x: w / 2, y: h * .46, vx: Math.cos(i * 2.399) * (3 + Math.random() * 15), vy: Math.sin(i * 2.399) * (3 + Math.random() * 15) - 5, size: 4 + Math.random() * 8, angle: Math.random() * 6, spin: (Math.random() - .5) * .2, color: colors[i % colors.length], star: i % 4 === 0 }));
    let id = 0, previous = performance.now();
    const started = previous;
    function draw(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - previous) / 16.67, 2); previous = now;
      const frame = (now - started) / 16.67;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy += .12 * dt; p.vx *= .994; p.angle += p.spin * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.fillStyle = p.color; ctx.globalAlpha = clamp((280 - frame) / 65);
        if (p.star) { ctx.beginPath(); for (let j = 0; j < 8; j++) { const angle = j * Math.PI / 4, r = j % 2 ? p.size * .25 : p.size; ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r); } ctx.closePath(); ctx.fill(); }
        else ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .5);
        ctx.restore();
      });
      if (frame < 280) id = requestAnimationFrame(draw); else ctx.clearRect(0, 0, w, h);
    }
    id = requestAnimationFrame(draw); return () => cancelAnimationFrame(id);
  }, [trigger, reduced]);
  return <canvas className="confetti-canvas" ref={canvas} aria-hidden="true" />;
}


export function useBirthdayMusic(inMemories = false, externalPlaying = false) {
  const [sound, setSound] = useState(false);
  const [soundError, setSoundError] = useState("");
  const audio = useRef<AudioContext | null>(null);
  const song = useRef<HTMLAudioElement | null>(null);
  const intendedSound = useRef(false);

  useEffect(() => {
    const warm = [birthday.music, birthday.memoryMusic].filter(Boolean).map(src => {
      const media = new Audio(src); media.preload = "auto"; media.load(); return media;
    });
    return () => { warm.forEach(media => { media.pause(); media.removeAttribute("src"); media.load(); }); };
  }, []);

  useEffect(() => {
    if (!sound || externalPlaying) return;
    const context = audio.current;
    if (!context) return;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    let sceneMedia: HTMLAudioElement | null = null;
    let mediaSource: MediaElementAudioSourceNode | null = null;
    const oscillators: OscillatorNode[] = [];
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 1.4);
    gain.connect(context.destination);
    const track = inMemories ? birthday.memoryMusic : birthday.music;
    function playSynth() {
      if (!context || cancelled) return;
      const notes = inMemories
        ? [261.63,329.63,392,523.25,493.88,392,329.63,293.66,349.23,440,523.25,440,392,329.63,293.66,261.63]
        : [261.63,261.63,293.66,261.63,349.23,329.63,261.63,261.63,293.66,261.63,392,349.23,261.63,261.63,523.25,440,349.23,329.63,293.66,466.16,466.16,440,349.23,392,349.23];
      const lengths = inMemories ? notes.map((_, i) => i % 4 === 3 ? 1.4 : .8) : [.3,.3,.6,.6,.6,1.2,.3,.3,.6,.6,.6,1.2,.3,.3,.6,.6,.6,.6,1.2,.3,.3,.6,.6,.6,1.5];
      const schedule = () => {
        if (cancelled || context.state !== "running") return;
        let time = context.currentTime + .05;
        notes.forEach((note, i) => {
          [1, 2].forEach(harmonic => {
            const osc = context.createOscillator(), envelope = context.createGain();
            osc.frequency.value = note * harmonic;
            envelope.gain.setValueAtTime(0, time);
            envelope.gain.linearRampToValueAtTime(harmonic === 1 ? .065 : .018, time + .025);
            envelope.gain.exponentialRampToValueAtTime(.0001, time + lengths[i] + .55);
            osc.connect(envelope); envelope.connect(gain);
            oscillators.push(osc);
            osc.onended = () => { osc.disconnect(); envelope.disconnect(); const index = oscillators.indexOf(osc); if (index >= 0) oscillators.splice(index, 1); };
            osc.start(time); osc.stop(time + lengths[i] + .6);
          });
          time += lengths[i];
        });
      };
      schedule(); timer = setInterval(schedule, (lengths.reduce((a, b) => a + b, 0) + 1) * 1000);
    }
    if (track) {
      const media = new Audio(track); sceneMedia = media; song.current = media; media.loop = true; media.volume = .4; media.preload = "auto";
      mediaSource = context.createMediaElementSource(media); mediaSource.connect(gain);
      void media.play().then(() => { if (cancelled) media.pause(); }).catch(() => {
        if (cancelled) return;
        setSoundError("This track couldn’t play. A little music-box melody is playing instead.");
        playSynth();
      });
    } else playSynth();
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      const currentVolume = gain.gain.value;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(currentVolume, context.currentTime);
      gain.gain.setTargetAtTime(0, context.currentTime, .35);
      // Stop scheduled notes and disconnect the old scene after its short fade.
      setTimeout(() => { sceneMedia?.pause(); mediaSource?.disconnect(); [...oscillators].forEach(osc => { try { osc.stop(); } catch {} }); gain.disconnect(); }, 1600);
    };
  }, [sound, inMemories, externalPlaying]);

  useEffect(() => () => { intendedSound.current = false; song.current?.pause(); void audio.current?.close(); }, []);
  async function startMusic() {
    intendedSound.current = true;
    try {
      audio.current ??= new AudioContext();
      await audio.current.resume();
      if (intendedSound.current) { setSoundError(""); setSound(true); }
    } catch { if (intendedSound.current) { setSound(false); setSoundError("Tap sound to try the music again."); } }
  }
  function toggleSound() {
    if (sound) { intendedSound.current = false; setSound(false); setSoundError(""); }
    else void startMusic();
  }
  return { sound, soundError, startMusic, toggleSound };
}
