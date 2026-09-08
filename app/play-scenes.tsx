"use client";

import { useRef, useState, type CSSProperties } from "react";
import { CardArt } from "./celestial-art";

export const secretClues = [
  { letter: "T", name: "The office seal", hint: "Where two new faces found their guiding angel. Look beside the floating office.", chapter: 1 },
  { letter: "E", name: "The teacup seal", hint: "Where lunch ends and the best conversations begin. Look below the teacup.", chapter: 3 },
  { letter: "A", name: "The memory seal", hint: "Among the pictures we get to keep, a tiny star holds something extra.", chapter: 4 },
];

export function SecretSeal({ index, found, onFind }: { index: number; found: boolean; onFind: (i: number) => void }) {
  return <button className={`secret-seal seal-${index} ${found ? "seal-found" : ""}`} onClick={() => onFind(index)} aria-label={`${found ? "Collected" : "Inspect"} ${secretClues[index].name}`}><span>{found ? secretClues[index].letter : "✧"}</span><small>{found ? "a piece of a secret" : "something glimmers…"}</small></button>;
}

const starPositions = [[13, 48], [30, 20], [47, 43], [64, 16], [83, 39], [70, 74], [39, 78]];
const pairKinds = ["moon", "heart", "sun", "star", "heart", "star", "moon", "sun"];
const pairNames: Record<string, string> = { moon: "Moon", heart: "Heart", sun: "Sun", star: "Star" };

export function PlayScenes({ found, onCelebrate, go }: { found: number[]; onCelebrate: () => void; go: (i: number) => void }) {
  const [stars, setStars] = useState<number[]>([]);
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
      <div className="play-heading"><span className="micro">A LITTLE DETOUR / THE SKY CAN WAIT</span><h2>A pocketful<br/>of <em>starlight.</em></h2><p>Seven runaway stars. Catch them, one by one.<br/>No clock. Just a little magic.</p></div>
      <div className="star-playground">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={starPositions.filter((_, i) => stars.includes(i)).map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="#a270a4" strokeWidth=".35" strokeDasharray="1 1"/></svg>
        {starPositions.map(([x, y], i) => <button key={i} className={`catch-star ${stars.includes(i) ? "caught" : ""}`} style={{ left: `${x}%`, top: `${y}%`, "--star-delay": `${i * -.6}s` } as CSSProperties} aria-label={`${stars.includes(i) ? "Caught" : "Catch"} star ${i + 1}`} disabled={stars.includes(i)} onClick={() => { setStars(s => [...s, i]); if (stars.length === 6) onCelebrate(); }}><span>✦</span><small>{stars.includes(i) ? "♡" : `0${i + 1}`}</small></button>)}
        <div className="star-jar" aria-hidden="true"><span>{"✧".repeat(stars.length)}</span><i>stardust, for Priya</i></div>
      </div>
      <div className="play-status" aria-live="polite"><p>{stars.length === 7 ? "The sky looks better with a little bit of you in it." : `${stars.length} / 7 stars tucked safely into your pocket.`}</p>{stars.length === 7 && <button className="play-link" onClick={() => setStars([])}>Let them fly. Catch them again ↗</button>}</div>
    </section>

    <section className="world-scene matching-scene" aria-label="Made for each other">
      <div className="play-heading"><span className="micro">A CELESTIAL LITTLE GAME / FIND THE PAIRS</span><h2>Some things<br/><em>just belong.</em></h2><p>Like tea and gossip. Like us.<br/>Turn over two cards and find all four pairs.</p></div>
      <div className="pair-table">{deck.map((kind, i) => { const shown = flipped.includes(i) || matched.includes(i); return <button key={i} className={`pair-card ${shown ? "pair-open" : ""} ${matched.includes(i) ? "pair-matched" : ""}`} aria-label={`Card ${i + 1}${shown ? `: ${pairNames[kind]}${matched.includes(i) ? ", matched" : ""}` : ": face down"}`} aria-pressed={shown} disabled={matched.includes(i)} onClick={() => flip(i)}><span className="pair-back">✧<small>PRIYA’S UNIVERSE</small></span><span className="pair-front" aria-hidden={!shown}><CardArt kind={kind}/><small>{pairNames[kind]}</small></span></button>; })}</div>
      <div className="play-status" aria-live="polite"><p>{complete ? "A perfect little constellation. Just like our trio. ♡" : `${matched.length / 2} / 4 pairs · ${turns} turns${flipped.length === 2 ? " · Not quite! Pick a new card to keep going." : ""}`}</p><button className="play-link" onClick={newRound}>{complete ? "Shuffle & play again ↗" : "Start a new round ↗"}</button></div>
    </section>

    <section className="world-scene secret-scene" aria-label="The moon keeps a secret">
      <div className="play-heading"><span className="micro">SOME WORDS ARE WORTH LOOKING FOR</span><h2>The moon keeps<br/><em>a secret.</em></h2><p>We hid a letter in this little universe.<br/>Three tiny star seals know how to find it.</p></div>
      <div className="secret-observatory">
        <button className={`secret-moon ${unlocked ? "moon-unlocked" : ""}`} aria-label={unlocked ? "Open the hidden letter" : "Inspect the secret moon"} onClick={() => { if (unlocked) letter.current?.showModal(); else setMessage("The moon is keeping our words safe. Find three seals, then whisper the password below."); }}><span aria-hidden="true">☾</span>{unlocked && <i>✉</i>}<small>{unlocked ? "there’s something behind the moon…" : "a secret, under moonlight"}</small></button>
        <div className="secret-lock"><div className="collected-seals" aria-label={`${found.length} of 3 seals collected`}>{secretClues.map((clue, i) => <span key={clue.letter}>{found.includes(i) ? clue.letter : "✧"}</span>)}</div>
          {!unlocked ? <form onSubmit={e => { e.preventDefault(); if (found.length < 3) { setMessage("A little more exploring first. The moon needs all three seals."); setHint(true); } else if (code.trim().toLowerCase() === "tea") { setUnlocked(true); setMessage("You found the word. Now peek behind the moon. ♡"); onCelebrate(); } else setMessage("Almost. Arrange your letters into our favourite after-lunch ritual."); }}><label htmlFor="moon-password">{found.length === 3 ? "Arrange the letters. Our favourite after-lunch ritual?" : `${found.length} / 3 seals found. A little wandering awaits.`}</label><div className="secret-input"><input id="moon-password" value={code} onChange={e => setCode(e.target.value)} maxLength={12} placeholder="whisper the word" autoComplete="off"/><button type="submit">Unlock ↗</button></div></form> : <p className="script">Some treasures are made of words.</p>}
          <p className="secret-feedback" role="status">{message}</p><button className="play-link" onClick={() => setHint(!hint)}>{hint ? "Fold away the clues" : "A tiny nudge? Show me a clue"}</button>
          {hint && <div className="clue-list">{secretClues.map((clue, i) => <button key={clue.letter} onClick={() => go(clue.chapter)}><b>{found.includes(i) ? "✓" : "✧"}</b><span>{clue.hint}</span><i>↗</i></button>)}</div>}
        </div>
      </div>
    </section>

    <dialog ref={letter} className="memory-window hidden-letter" aria-label="A secret letter for Priya" onClick={e => { if (e.target === e.currentTarget) letter.current?.close(); }}><button className="window-close" onClick={() => letter.current?.close()} aria-label="Fold the letter">×</button><span className="micro">YOU FOUND IT / THESE WORDS WERE ALWAYS YOURS</span><span className="letter-flower" aria-hidden="true">❦</span><h2>Dear Priya,</h2><p>When Olive and I joined the office, we were two new faces trying to find our way. And there you were — our saviour angel, making the unfamiliar feel a little less unfamiliar.</p><p>Then came the talking. The sharing. The little things that slowly became everything. Somewhere between all of that, we stopped being just colleagues and became best buddies.</p><p>If I could keep one ordinary moment forever, it would be our tea breaks after lunch. The gossip, the laughter, the “just one more story” before going back. Nothing grand. Just us. Those are some of my favourite times with you.</p><p>So here’s a little universe for the person who made our world warmer. May this year bring you the kindness you give so easily, plenty of reasons to laugh, and so many beautiful things to tell us over tea.</p><p className="letter-ending">Happy birthday, our office angel.<br/>We’re so glad we found you.</p><span className="script">With love, Simon & Olive ♡</span><button className="play-link letter-fold" onClick={() => letter.current?.close()}>Fold it carefully. Keep it forever ♡</button></dialog>
  </>;
}
