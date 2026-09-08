"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CardArt } from "./celestial-art";

export const secretClues = [
  { letter: "CIG", name: "The office seal", hint: "Where two new faces found their guiding angel. Look beside the floating office.", chapter: 1 },
  { letter: "ARE", name: "The teacup seal", hint: "Where lunch ends and the best conversations begin. Look below the teacup.", chapter: 3 },
  { letter: "TTE", name: "The memory seal", hint: "Among the pictures we get to keep, a tiny star holds something extra.", chapter: 4 },
];

export function SecretSeal({ index, found, onFind }: { index: number; found: boolean; onFind: (i: number) => void }) {
  return <button className={`secret-seal seal-${index} ${found ? "seal-found" : ""}`} onClick={() => onFind(index)} aria-label={`${found ? "Collected" : "Inspect"} ${secretClues[index].name}`}><span>{found ? secretClues[index].letter : "✧"}</span><small>{found ? "a piece of a secret" : "something glimmers…"}</small></button>;
}

// A continuous, numbered stroke: every segment joins consecutive stars.
const starPositions = [[14,74],[14,54],[14,34],[22,20],[34,30],[35,51],[35,73],[40,42],[48,20],[59,30],[60,50],[60,67],[69,79],[82,70],[88,53],[83,37],[73,29],[68,43],[73,59],[89,82]];
const virgoEdges = Array.from({ length: starPositions.length - 1 }, (_, i) => [i, i + 1]);
// Reference-shaped heart: full lobes and straight, broad diagonals into the tip.
// Mirrored points keep all 20 stars separated without pinching the lower outline.
const heartPositions = [[50,25],[61,14],[74,8],[86,12],[94,24],[96,37],[88,52],[78,65],[69,74],[59.5,83],[50,92],[40.5,83],[31,74],[22,65],[12,52],[4,37],[6,24],[14,12],[26,8],[39,14]];
const pairKinds = ["simon", "priya", "olive", "heart", "priya", "heart", "simon", "olive"];
const pairNames: Record<string, string> = { simon: "Simon", priya: "Priya", olive: "Olive", heart: "Heart" };

export function PlayScenes({ found, onCelebrate, go }: { found: number[]; onCelebrate: () => void; go: (i: number) => void }) {
  const [stars, setStars] = useState<number[]>([]);
  const [heartProgress, setHeartProgress] = useState(0);
  useEffect(() => {
    if (stars.length !== starPositions.length) return;
    const gentle = document.documentElement.dataset.motion === "calm";
    const start = performance.now() + (gentle ? 0 : 1500);
    let frame = 0;
    const formHeart = (now: number) => {
      const progress = gentle ? 1 : Math.max(0, Math.min(1, (now - start) / 1900));
      setHeartProgress(progress * progress * (3 - 2 * progress));
      if (progress < 1) frame = requestAnimationFrame(formHeart);
    };
    frame = requestAnimationFrame(formHeart);
    return () => cancelAnimationFrame(frame);
  }, [stars.length]);
  const skyPositions = starPositions.map(([x, y], i) => {
    const target = heartPositions[i];
    return [x + (target[0] - x) * heartProgress, y + (target[1] - y) * heartProgress];
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [deck, setDeck] = useState(pairKinds);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [hint, setHint] = useState(false);
  const letter = useRef<HTMLDialogElement>(null);
  const complete = matched.length === 8;

  function flip(i: number) {
    if (matched.includes(i) || flipped.includes(i)) return;
    const next = flipped.length === 2 ? [i] : [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setTurns(t => t + 1);
      if (deck[next[0]] === deck[next[1]]) {
        setMatched(m => [...m, ...next]);
        setFlipped([]);
        if (matched.length === 6) onCelebrate();
      }
    }
  }

  function newRound() {
    const shuffled = [...pairKinds];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeck(shuffled); setFlipped([]); setMatched([]); setTurns(0);
  }

  return <>
    <section className="world-scene stargame-scene" aria-label="Pocketful of starlight">
      <div className="play-heading"><span className="micro">A LITTLE DETOUR / THE SKY CAN WAIT</span><h2>A pocketful<br/>of <em>starlight.</em></h2><p>Light the numbered stars to draw your Virgo sign.<br/>Finish all {starPositions.length}, and watch it become a heart.</p></div>
      <div className="star-playground constellation-playground">
        <div className="virgo-sky-atmosphere" style={{opacity:1-heartProgress}} aria-hidden="true"><div className="sky-medallion"/><span className="sky-sign-caption">VIRGO / THE MAIDEN</span>{[[5,15],[48,5],[92,19],[5,53],[95,72],[24,94],[64,93],[48,62]].map(([x,y],i)=><i key={i} style={{left:`${x}%`,top:`${y}%`,animationDelay:`${i*-.8}s`}}/>)}</div>
        <svg className="sky-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g style={{opacity:1-heartProgress}}>{virgoEdges.filter(([a,b]) => stars.includes(a) && stars.includes(b)).map(([a,b]) => <line key={`${a}-${b}`} className="constellation-line" x1={skyPositions[a][0]} y1={skyPositions[a][1]} x2={skyPositions[b][0]} y2={skyPositions[b][1]} pathLength="1"/>)}</g>
          {stars.length === starPositions.length && <g style={{opacity:heartProgress}}>{skyPositions.map(([x,y],i) => <line key={i} className="constellation-closing" x1={x} y1={y} x2={skyPositions[(i+1)%skyPositions.length][0]} y2={skyPositions[(i+1)%skyPositions.length][1]}/>)}</g>}
        </svg>
        {skyPositions.map(([x, y], i) => <button key={i} className={`catch-star ${stars.includes(i) ? "caught" : ""} ${i === starPositions.findIndex((_, n) => !stars.includes(n)) ? "next-sky-star" : ""}`} style={{ left: `${x}%`, top: `${y}%`, "--star-size": `${[0,8,19].includes(i) ? 36 : i % 3 === 0 ? 29 : 32}px` } as CSSProperties} aria-label={`${stars.includes(i) ? "Connected" : "Connect"} star ${i + 1}`} disabled={stars.includes(i)} onClick={() => { setStars(s => s.includes(i) ? s : [...s, i]); if (stars.length === starPositions.length - 1) { onCelebrate(); } }}><span>✦</span><small>{stars.includes(i) ? "♡" : String(i + 1).padStart(2, "0")}</small></button>)}
        <div className={`heart-keepsake ${heartProgress === 1 ? "heart-ready" : ""}`} style={{opacity:heartProgress}} aria-hidden="true"><span>made of love</span><i>stardust, for Priya</i></div>
      </div>
      <div className="play-status" aria-live="polite"><p>{heartProgress === 1 ? "Your little constellation was made of love all along." : stars.length === starPositions.length ? "Your Virgo sign is complete. Here comes a little love…" : `${stars.length} / ${starPositions.length} stars lit. Follow the numbers to reveal Virgo.`}</p>{stars.length === starPositions.length && <button className="play-link" onClick={() => { setStars([]); setHeartProgress(0); }}>Draw your Virgo again ↗</button>}</div>
    </section>

    <section className="world-scene matching-scene" aria-label="Made for each other">
      <div className="play-heading"><span className="micro">A CELESTIAL LITTLE GAME / FIND THE PAIRS</span><h2>Some things<br/><em>just belong.</em></h2><p>Simon. Priya. Olive. And a little love.<br/>Match each name with itself, and heart with heart.</p></div>
      <div className="pair-table">{deck.map((kind, i) => { const shown = flipped.includes(i) || matched.includes(i); return <button key={i} className={`pair-card ${shown ? "pair-open" : ""} ${matched.includes(i) ? "pair-matched" : ""}`} aria-label={`Card ${i + 1}${shown ? `: ${pairNames[kind]}${matched.includes(i) ? ", matched" : ""}` : ": face down"}`} aria-pressed={shown} disabled={matched.includes(i)} onClick={() => flip(i)}><span className="pair-back">✧<small>PRIYA’S UNIVERSE</small></span><span className="pair-front" aria-hidden={!shown}>{kind === "heart" ? <CardArt kind="heart"/> : <span className={`pair-person person-${kind}`}><b>{pairNames[kind][0]}</b><i>{kind === "priya" ? "our birthday girl" : "your best buddy"}</i></span>}<small>{pairNames[kind]}</small></span></button>; })}</div>
      <div className="play-status" aria-live="polite"><p>{complete ? "A perfect little constellation. Just like our trio. ♡" : `${matched.length / 2} / 4 pairs · ${turns} turns${flipped.length === 2 ? " · Not quite! Pick a new card to keep going." : ""}`}</p><button className="play-link" onClick={newRound}>{complete ? "Shuffle & play again ↗" : "Start a new round ↗"}</button></div>
    </section>

    <section className="world-scene secret-scene" aria-label="The moon keeps a secret">
      <div className="play-heading"><span className="micro">SOME WORDS ARE WORTH LOOKING FOR</span><h2>The moon keeps<br/><em>a secret.</em></h2><p>We hid a letter in this little universe.<br/>Three tiny star seals know how to find it.</p></div>
      <div className="secret-observatory">
        <button className={`secret-moon ${unlocked ? "moon-unlocked" : ""}`} aria-label={unlocked ? "Open your letter from Simon and Olive" : "Inspect the secret moon"} onClick={() => { if (unlocked) letter.current?.showModal(); else setMessage("Find all three star seals, join their word pieces, and enter the answer below to open your letter."); }}>{unlocked ? <><svg className="letter-envelope" viewBox="0 0 220 140" aria-hidden="true"><rect x="10" y="10" width="200" height="120" rx="8" fill="#fff0dc" stroke="#94628e" strokeWidth="2"/><path d="M12 15L110 85L208 15M12 128L80 71M208 128L140 71" fill="none" stroke="#b480a2" strokeWidth="2"/><circle cx="110" cy="82" r="19" fill="#ae789c"/><path d="M110 90C87 76 105 68 110 77C115 68 133 76 110 90" fill="#ffead8"/></svg><strong>Open your letter</strong><small>Tap the envelope to read the note from Simon & Olive</small></> : <><span aria-hidden="true">☾</span><small>Collect 3 seals to unlock your letter</small></>}</button>
        <div className="secret-lock"><div className="collected-seals" aria-label={`${found.length} of 3 seals collected`}>{secretClues.map((clue, i) => <span key={clue.letter}>{found.includes(i) ? clue.letter : "✧"}</span>)}</div>
          {!unlocked ? <form onSubmit={e => { e.preventDefault(); if (found.length < 3) { setMessage("A little more exploring first. The moon needs all three seals."); setHint(true); } else if (code.trim().toLowerCase() === "cigarette") { setUnlocked(true); setMessage("Your letter is unlocked! Tap the envelope to read it again."); setHint(false); onCelebrate(); letter.current?.showModal(); } else setMessage("Almost. Join the three pieces into one word: our favourite after-lunch ritual."); }}><label htmlFor="moon-password">{found.length === 3 ? "Join the three pieces. Our favourite after-lunch ritual?" : `${found.length} / 3 seals found. A little wandering awaits.`}</label><div className="secret-input"><input id="moon-password" value={code} onChange={e => setCode(e.target.value)} maxLength={12} placeholder="whisper the word" autoComplete="off"/><button type="submit">Unlock ↗</button></div></form> : <p className="script">Some treasures are made of words.</p>}
          <p className="secret-feedback" role="status">{message}</p><button className="play-link" onClick={() => setHint(!hint)}>{hint ? "Fold away the clues" : "A tiny nudge? Show me a clue"}</button>
          {hint && <div className="clue-list">{secretClues.map((clue, i) => <button key={clue.letter} onClick={() => go(clue.chapter)}><b>{found.includes(i) ? "✓" : "✧"}</b><span>{clue.hint}</span><i>↗</i></button>)}</div>}
        </div>
      </div>
    </section>

    <dialog ref={letter} className="memory-window hidden-letter" aria-label="A secret letter for Priya" onClick={e => { if (e.target === e.currentTarget) letter.current?.close(); }}><button className="window-close" onClick={() => letter.current?.close()} aria-label="Fold the letter">×</button><span className="micro">YOU FOUND IT / THESE WORDS WERE ALWAYS YOURS</span><span className="letter-flower" aria-hidden="true">❦</span><h2>Dear Priya,</h2><p>When Olive and I joined the office, we were two new faces trying to find our way. And there you were — our saviour angel, making the unfamiliar feel a little less unfamiliar.</p><p>Then came the talking. The sharing. The little things that slowly became everything. Somewhere between all of that, we stopped being just colleagues and became best buddies.</p><p>If I could keep one ordinary moment forever, it would be our tea breaks after lunch. The gossip, the laughter, the “just one more story” before going back. Nothing grand. Just us. Those are some of my favourite times with you.</p><p>So here’s a little universe for the person who made our world warmer. May this year bring you the kindness you give so easily, plenty of reasons to laugh, and so many beautiful things to tell us over tea.</p><p className="letter-ending">Happy birthday, our office angel.<br/>We’re so glad we found you.</p><span className="script">With love, Simon & Olive ♡</span><button className="play-link letter-fold" onClick={() => letter.current?.close()}>Fold it carefully. Keep it forever ♡</button></dialog>
  </>;
}
