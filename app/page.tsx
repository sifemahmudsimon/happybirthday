"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import { birthday, cards, memories } from "./birthday-content";
import { CardArt, Garden, Spark } from "./celestial-art";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const readMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Confetti({ trigger, reduced }: { trigger: number; reduced: boolean }) {
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

export default function Home() {
  const [motion, setMotion] = useState<"system" | "full" | "calm">("system");
  const systemReduced = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  const reduced = motion === "calm" || (motion === "system" && systemReduced);
  const [progress, setProgress] = useState(0);
  const [opened, setOpened] = useState(false);
  const [sound, setSound] = useState(false);
  const [soundError, setSoundError] = useState("");
  const [burst, setBurst] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [growth, setGrowth] = useState(0);
  const [wish, setWish] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const song = useRef<HTMLAudioElement | null>(null);
  const musicTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const photoModal = useRef<HTMLDialogElement>(null);
  const startDrag = useRef<number | null>(null);
  const growthStart = useRef(0);
  const story = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(timer); return 100; } return Math.min(100, p + 5); }), 90);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "calm" : "full";
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); }), { threshold: .15 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    let ticking = false, frame = 0;
    const update = () => {
      ticking = false;
      if (reduced) {
        story.current?.querySelectorAll<HTMLElement>(".story-frame").forEach(el => { el.inert = false; });
        return;
      }
      if (hero.current) { const p = clamp(window.scrollY / window.innerHeight); hero.current.style.setProperty("--hero-scroll", String(p)); }
      if (story.current) {
        const bounds = story.current.getBoundingClientRect();
        const p = clamp(-bounds.top / (bounds.height - window.innerHeight));
        story.current.style.setProperty("--story", String(p));
        story.current.querySelectorAll<HTMLElement>(".story-frame").forEach((el, i) => {
          const distance = p * 3 - i;
          el.style.setProperty("--distance", String(distance));
          el.style.opacity = String(clamp(1 - Math.abs(distance) * 1.7));
          el.style.visibility = Math.abs(distance) < .8 ? "visible" : "hidden";
          el.style.pointerEvents = Math.abs(distance) < .45 ? "auto" : "none";
          el.inert = Math.abs(distance) >= .45;
        });
      }
    };
    const scroll = () => { if (!ticking) { ticking = true; frame = requestAnimationFrame(update); } };
    const move = (event: globalThis.PointerEvent) => {
      if (reduced || event.pointerType === "touch") return;
      document.documentElement.style.setProperty("--mx", `${(event.clientX / window.innerWidth - .5) * 24}px`);
      document.documentElement.style.setProperty("--my", `${(event.clientY / window.innerHeight - .5) * 18}px`);
    };
    update(); window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", scroll); window.addEventListener("pointermove", move);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); window.removeEventListener("pointermove", move); };
  }, [reduced]);

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
  function openBirthday() { setOpened(true); setBurst(b => b + 1); void startMusic(); }
  function selectCard(index: number) { setSelectedCard(index); modal.current?.showModal(); }
  function selectPhoto(index: number) { setSelectedPhoto(index); photoModal.current?.showModal(); }
  function grow() { setGrowth(1); if (growth < 1) setBurst(b => b + 1); }
  function dragFlower(event: PointerEvent<HTMLButtonElement>) {
    if (startDrag.current === null) return;
    const value = clamp(growthStart.current + (startDrag.current - event.clientY) / 180);
    setGrowth(value);
  }

  return <>
    <Confetti trigger={burst} reduced={reduced} />
    {!opened && <div className="loading-gate" role="dialog" aria-modal="true" aria-labelledby="loading-title">
      <div className="gate-orbit orbit-a" /><div className="gate-orbit orbit-b" />
      <span className="eyebrow">SOMETHING LOVELY IS ON ITS WAY</span>
      <div className="loading-symbol"><Spark /><span>♍︎</span><Spark /></div>
      <h2 id="loading-title">A little patience.<br /><em>A lot of magic.</em></h2>
      <div className="progress-track" role="progressbar" aria-label="Preparing birthday surprise" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
      <p className="loading-status" aria-live="polite">{progress < 100 ? `Gathering the stars… ${progress}%` : "The universe is ready for you."}</p>
      <button className="pill" disabled={progress < 100} onClick={openBirthday}>{progress < 100 ? "A little more stardust" : "Open your surprise"}<Spark /></button>
      <small>Best with sound. Made with love.</small><button className="gate-motion" onClick={() => setMotion(reduced ? "full" : "calm")}>{reduced ? "Gentle motion / Turn on full sparkle" : "Full sparkle / Prefer gentle motion?"}</button>
    </div>}

    <div className={`birthday-world ${opened ? "is-open" : ""}`} inert={!opened}>
      <header className="site-header"><a href="#home" className="wordmark">a little <em>birthday</em><Spark /></a><nav><a href="#universe">Our little universe</a><a href="#wish">Make a wish ↗</a><button className="motion-toggle" onClick={() => setMotion(reduced ? "full" : "calm")} aria-label={reduced ? "Enable full motion" : "Reduce motion"}><Spark /><span>MOTION {reduced ? "CALM" : "ON"}</span></button><button onClick={toggleSound} className="sound-toggle" aria-label={sound ? "Mute music" : "Play music"}><span className={`equalizer ${sound ? "playing" : ""}`}><i /><i /><i /><i /></span><span>SOUND {sound ? "ON" : "OFF"}</span></button></nav></header>
      {soundError && <p className="sound-error" role="status">{soundError}</p>}
      <main>
        <section className="hero" id="home" ref={hero}>
          <div className="hero-orbit orbit-a" /><div className="hero-orbit orbit-b" />
          <div className="hero-eyebrow"><span>✳</span><span>03 SEPTEMBER · THE WORLD GOT LUCKIER</span><span>✳</span></div>
          <div className="hero-title"><h1>Happy <em>Birthday</em></h1><p className="handwriting">{birthday.name}.</p></div>
          <span className="margin-note">a little cosmic magic,<br />just for you <span>↘</span></span>
          <div className="date-seal"><span>A VERY SPECIAL DAY</span><b>03</b><i>SEP</i><span>ONE OF A KIND</span></div>
          <Spark className="floating-spark spark-one" /><Spark className="floating-spark spark-two" /><span className="little-asterisk">✳</span>
          <div className="card-deck" aria-label="Choose a birthday fortune card">
            {cards.map((card,i) => <button className={`zodiac-card zodiac-${i}`} key={card.title} onClick={() => selectCard(i)} style={{ "--i": i - 2 } as CSSProperties} aria-label={`Reveal ${card.title} card`}><span className="card-border"><span className="card-top">{["XVII","XIX","VI","II","XXI"][i]}<span>✧</span></span><CardArt kind={card.symbol} /><span className="card-title">{card.title}</span><span className="card-subtitle">{card.subtitle}</span><span className="card-corner">✦</span></span></button>)}
          </div>
          <div className="card-shortcuts" aria-label="All five birthday cards">{cards.map((card,i) => <button key={card.title} onClick={() => selectCard(i)} aria-label={`Choose ${card.title}`}><span className={i === 2 ? "central-dot" : ""} /></button>)}</div><div className="hero-invitation"><p>A little corner of the universe, made just for you.</p><span>Pick a card. There’s a little magic in every one.</span></div>
          <a href="#universe" className="scroll-cue"><span>SCROLL TO UNWRAP</span><b>↓</b></a>
          <div className="hero-foot"><span>FROM SIMON & OLIVE, WITH LOVE ♡</span><span>A BIRTHDAY WRITTEN IN THE STARS</span></div>
        </section>

        <section className="cosmic-intro" id="universe">
          <div className="intro-sticky"><span className="eyebrow reveal">01 / OF ALL THE PEOPLE IN THE UNIVERSE</span><h2 className="reveal">How lucky are we<br />to exist at the same time<br /><em>as you.</em><Spark /></h2><p className="reveal">One lovely human. So many little reasons to celebrate.<br />And a story that’s still being written.</p><div className="intro-orbits" aria-hidden="true"><span>♍︎</span></div></div>
        </section>

        <section className="story-section" ref={story} id="memories" aria-label="Our memory lane">
          <div className="story-sticky"><div className="story-top"><span className="eyebrow">02 / OUR LITTLE UNIVERSE</span><span className="handwriting">some things are worth keeping ♡</span></div>
            <div className="story-orbit" /><Spark className="story-spark" />
            {memories.map((memory,i) => <article className={`story-frame story-${i}`} key={memory.title}>
              <div className="story-copy"><span className="chapter-number">0{i+1}<i> / 04</i></span><span className="eyebrow">{memory.subtitle}</span><h2>{memory.title}</h2><p>{memory.description}</p><span className="handwriting">{i === 0 ? "a small moment. a whole beginning." : i === 1 ? "friendship looks good on us." : i === 2 ? "wouldn’t trade this for anything." : "here’s to the next chapter ↗"}</span></div>
              <div className="photo-composition"><div className="photo-ghost ghost-one" /><div className="photo-ghost ghost-two" /><button className="polaroid" onClick={() => selectPhoto(i)} aria-label={`Open memory: ${memory.caption}`}><span className="tape" /><span className="photo-area"><Image unoptimized width={900} height={1000} src={memory.photo} alt={memory.alt} loading="lazy" /><span className="photo-label">A PLACE FOR YOUR PHOTO</span></span><span className="photo-caption">{memory.caption}<span>♡</span></span></button><span className="photo-annotation">a moment, forever.</span></div>
            </article>)}
            <div className="story-bottom"><span>KEEP SCROLLING. THERE’S MORE TO OUR STORY.</span><div className="story-progress"><span /></div><span>↓</span></div>
          </div>
        </section>

        <section className="garden-section" id="garden"><div className="garden-heading reveal"><span className="eyebrow">03 / GOOD THINGS GROW TOGETHER</span><h2>A little love.<br /><em>A little more bloom.</em></h2><p>{growth >= 1 ? "Look what a little love can do. Here’s to growing together." : "Every friendship needs a little looking after. Let’s make ours bloom."}</p></div><div className="garden-scene"><Garden growth={growth} /><span className="garden-star garden-star-one">✧</span><span className="garden-star garden-star-two">✧</span><button className={`grow-button ${growth >= 1 ? "grown" : ""}`} onPointerDown={e => { startDrag.current = e.clientY; growthStart.current = growth; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={dragFlower} onPointerUp={e => { const moved = startDrag.current !== null && Math.abs(startDrag.current - e.clientY) > 10; startDrag.current = null; e.currentTarget.releasePointerCapture(e.pointerId); if (moved && growth >= .9) grow(); }} onPointerCancel={() => { startDrag.current = null; }} onClick={grow} aria-label="Grow our friendship flower"><span>{growth >= 1 ? "♡" : "↑"}</span>{growth >= 1 ? "in full bloom" : "pull up to bloom"}</button><span className="garden-hint">{growth >= 1 ? "a little reminder: you are so loved." : "or tap to add a little love"}</span></div></section>

        <section className="gallery-section"><div className="gallery-heading reveal"><div><span className="eyebrow">THE LITTLE THINGS ARE THE BIG THINGS</span><h2>For the <em>memory box.</em></h2></div><span className="handwriting">more of us, please. ↘</span></div><div className="photo-strip">{[...memories,...memories.slice(0,2)].map((memory,i) => <button className="mini-polaroid" onClick={() => selectPhoto(i % memories.length)} key={i} aria-label={`View ${memory.caption}`} style={{ "--tilt": `${i%2 === 0 ? -5 : 5}deg` } as CSSProperties}><Image unoptimized width={900} height={1000} src={memory.photo} alt={memory.alt} loading="lazy" /><span>{["our office angel", "the good company", "tea & all the gossip", "best buddies", "a favourite smile", "one for the books"][i]}</span></button>)}</div><p className="placeholder-note">Borrowed pictures for now. Soon, memories that are entirely ours.</p></section>

        <section className="wish-section" id="wish"><div className="wish-orbit" /><Spark className="wish-spark" /><div className="reveal"><span className="eyebrow">04 / ONE LAST LITTLE BIT OF MAGIC</span><div className={`cake ${wish ? "blown" : ""}`} aria-hidden="true"><div className="candle"><span /></div><div className="cake-top" /><div className="cake-body">♡ ♡ ♡</div><div className="cake-plate" /></div><h2>{wish ? "May it all" : "Close your eyes."}<br /><em>{wish ? "come true." : "Make a wish."}</em></h2><p>{wish ? "One little wish, sent into the universe. May this next chapter be your most beautiful yet." : "For everything you are. For everything you’re becoming. Here’s to a year that feels like you."}</p><button className="pill" onClick={() => { setWish(!wish); setBurst(b => b + 1); }}>{wish ? "Make another wish" : "Blow out the candle"}<Spark /></button><div className="signature">Happy birthday, {birthday.name}.<span className="handwriting">with love, {birthday.from} ♡</span></div></div></section>
      </main>
      <footer><a href="#home" className="wordmark">a little <em>birthday</em><Spark /></a><span>MADE OF MEMORIES, STARDUST & A WHOLE LOT OF LOVE</span><button onClick={() => setBurst(b => b + 1)}>More confetti? ↗</button></footer>
    </div>

    <dialog ref={modal} className="fortune-dialog" aria-label="Your birthday fortune" onClick={e => { if (e.target === e.currentTarget) modal.current?.close(); }}><button className="modal-close" aria-label="Close fortune" onClick={() => modal.current?.close()}>×</button>{selectedCard !== null && <><span className="eyebrow">A LITTLE MESSAGE FROM THE UNIVERSE</span><div className="dialog-art"><CardArt kind={cards[selectedCard].symbol} /></div><h2>{cards[selectedCard].title}</h2><div className="fortune-nav"><button aria-label="Previous fortune" onClick={() => setSelectedCard((selectedCard + cards.length - 1) % cards.length)}>←</button><span>{selectedCard + 1} / {cards.length}</span><button aria-label="Next fortune" onClick={() => setSelectedCard((selectedCard + 1) % cards.length)}>→</button></div><p>{cards[selectedCard].message}</p><span className="handwriting">written in the stars. just for you.</span><button className="pill" onClick={() => { modal.current?.close(); document.getElementById("universe")?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" }); }}>Our story awaits <span>↓</span></button></>}</dialog>
    <dialog ref={photoModal} className="photo-dialog" aria-label="Our memory box" onClick={e => { if (e.target === e.currentTarget) photoModal.current?.close(); }}><button className="modal-close" aria-label="Close memory" onClick={() => photoModal.current?.close()}>×</button>{selectedPhoto !== null && <><Image unoptimized width={900} height={1000} src={memories[selectedPhoto].photo} alt={memories[selectedPhoto].alt} /><h2>{memories[selectedPhoto].title}</h2><p>{memories[selectedPhoto].description}</p><div className="photo-nav"><button onClick={() => setSelectedPhoto((selectedPhoto + 3) % 4)}>← Previous</button><span>{selectedPhoto + 1} / 4</span><button onClick={() => setSelectedPhoto((selectedPhoto + 1) % 4)}>Next →</button></div></>}</dialog>
  </>;
}


