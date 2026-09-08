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


export function useBirthdayMusic() {
  const [sound, setSound] = useState(false);
  const [soundError, setSoundError] = useState("");
  const audio = useRef<AudioContext | null>(null);
  const song = useRef<HTMLAudioElement | null>(null);
  const musicTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (musicTimer.current) clearInterval(musicTimer.current); void audio.current?.close(); song.current?.pause(); }, []);
  async function startMusic() {
    try {
      setSoundError("");
      if (birthday.music) { song.current ??= new Audio(birthday.music); song.current.loop = true; song.current.volume = .45; await song.current.play(); }
      else if (audio.current) await audio.current.resume();
      else {
        const context = new AudioContext(); audio.current = context; await context.resume();
        const notes = [261.63,261.63,293.66,261.63,349.23,329.63,261.63,261.63,293.66,261.63,392,349.23,261.63,261.63,523.25,440,349.23,329.63,293.66,466.16,466.16,440,349.23,392,349.23];
        const lengths = [.3,.3,.6,.6,.6,1.2,.3,.3,.6,.6,.6,1.2,.3,.3,.6,.6,.6,.6,1.2,.3,.3,.6,.6,.6,1.5];
        const schedule = () => {
          if (context.state !== "running") return;
          let time = context.currentTime + .05;
          notes.forEach((note,i) => {
            [1,2].forEach((harmonic) => {
              const osc = context.createOscillator(), gain = context.createGain();
              osc.type = "sine"; osc.frequency.value = note * harmonic;
              gain.gain.setValueAtTime(0, time); gain.gain.linearRampToValueAtTime(harmonic === 1 ? .075 : .025, time + .012); gain.gain.exponentialRampToValueAtTime(.0001, time + lengths[i] + .5);
              osc.connect(gain); gain.connect(context.destination); osc.start(time); osc.stop(time + lengths[i] + .6);
            });
            time += lengths[i];
          });
        };
        schedule(); musicTimer.current = setInterval(schedule, (lengths.reduce((a,b) => a+b,0) + 1) * 1000);
      }
      setSound(true);
    } catch { setSound(false); setSoundError("Tap sound to try the music again."); }
  }
  function toggleSound() { if (sound) { void audio.current?.suspend(); song.current?.pause(); setSound(false); } else void startMusic(); }

  return { sound, soundError, startMusic, toggleSound };
}
