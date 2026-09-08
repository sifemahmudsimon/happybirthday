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

const starPositions = [[10, 15], [34, 9], [59, 18], [85, 10], [20, 35], [45, 30], [72, 37], [92, 33], [9, 58], [32, 57], [58, 54], [81, 61], [18, 82], [44, 78], [67, 87], [91, 84]];
const heartPositions = [[50, 27], [40, 17], [28, 12], [18, 16], [10, 26], [9, 38], [16, 51], [29, 65], [50, 85], [71, 65], [84, 51], [91, 38], [90, 26], [82, 16], [72, 12], [60, 17]];
const pairKinds = ["simon", "priya", "olive", "heart", "priya", "heart", "simon", "olive"];
const pairNames: Record<string, string> = { simon: "Simon", priya: "Priya", olive: "Olive", heart: "Heart" };

export function PlayScenes({ found, onCelebrate, go }: { found: number[]; onCelebrate: () => void; go: (i: number) => void }) {
  const [stars, setStars] = useState<number[]>([]);
  const [heartProgress, setHeartProgress] = useState(0);
  const [skyPointer, setSkyPointer] = useState<number[] | null>(null);
  useEffect(() => {
    if (stars.length !== starPositions.length) return;
    const gentle = document.documentElement.dataset.motion === "calm";
    const start = performance.now() + (gentle ? 0 : 700);
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
    const target = heartPositions[Math.max(0, stars.indexOf(i))];
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
      <div className="play-heading"><span className="micro">A LITTLE DETOUR / THE SKY CAN WAIT</span><h2>A pocketful<br/>of <em>starlight.</em></h2><p>Connect the scattered stars in any order.<br/>There’s a little surprise in the sky when you finish.</p></div>
      <div className="star-playground constellation-playground" onPointerMove={e => { if (e.pointerType === "touch" || stars.length === starPositions.length) return; const rect = e.currentTarget.getBoundingClientRect(); setSkyPointer([(e.clientX - rect.left) / rect.width * 100, (e.clientY - rect.top) / rect.height * 100]); }} onPointerLeave={() => setSkyPointer(null)}>
        <svg className="sky-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {stars.slice(1).map((id, i) => <line key={`${stars[i]}-${id}`} className="constellation-line" x1={skyPositions[stars[i]][0]} y1={skyPositions[stars[i]][1]} x2={skyPositions[id][0]} y2={skyPositions[id][1]} pathLength="1"/>)}
          {stars.length > 0 && stars.length < starPositions.length && skyPointer && <line className="constellation-preview" x1={skyPositions[stars[stars.length - 1]][0]} y1={skyPositions[stars[stars.length - 1]][1]} x2={skyPointer[0]} y2={skyPointer[1]}/>}
          {stars.length === starPositions.length && <line className="constellation-closing" style={{opacity:heartProgress}} x1={skyPositions[stars[stars.length - 1]][0]} y1={skyPositions[stars[stars.length - 1]][1]} x2={skyPositions[stars[0]][0]} y2={skyPositions[stars[0]][1]}/>}
        </svg>
        {skyPositions.map(([x, y], i) => <button key={i} className={`catch-star ${stars.includes(i) ? "caught" : ""}`} style={{ left: `${x}%`, top: `${y}%` } as CSSProperties} aria-label={`${stars.includes(i) ? "Connected" : "Connect"} star ${i + 1}`} disabled={stars.includes(i)} onClick={() => { setStars(s => s.includes(i) ? s : [...s, i]); if (stars.length === starPositions.length - 1) { setSkyPointer(null); onCelebrate(); } }}><span>✦</span><small>{stars.includes(i) ? "♡" : String(i + 1).padStart(2, "0")}</small></button>)}
        <div className={`heart-keepsake ${heartProgress === 1 ? "heart-ready" : ""}`} style={{opacity:heartProgress}} aria-hidden="true"><span>made of love</span><i>stardust, for Priya</i></div>
      </div>
      <div className="play-status" aria-live="polite"><p>{heartProgress === 1 ? "Your little constellation was made of love all along." : stars.length === starPositions.length ? "Now watch what your stars become…" : `${stars.length} / ${starPositions.length} stars connected. Choose any star to keep drawing.`}</p>{stars.length === starPositions.length && <button className="play-link" onClick={() => { setStars([]); setHeartProgress(0); setSkyPointer(null); }}>Scatter the stars. Draw again ↗</button>}</div>
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
