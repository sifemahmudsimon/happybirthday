"use client";

import { useState, type CSSProperties } from "react";
import { useSavedWishes } from "./wish-storage";

const lanternSpots = [[12, 16, -8, .78], [68, 9, 7, .66], [37, 37, -4, .86], [84, 56, 9, .72], [10, 76, -6, .7], [60, 82, 5, .82]];

const gardenWords = ["Kindness", "Laughter", "Courage", "Little joys", "Good company", "Beautiful days"];
const plans = ["An extra-long gossip break", "A sunset walk, all three of us", "A photo day with your best buddies", "A little adventure with no itinerary", "Your favourite food. Our treat.", "A whole afternoon of doing nothing together"];

export function MoreScenes({ celebrate }: { celebrate: () => void }) {
  const [flowers, setFlowers] = useState<number[]>([]);
  const [plan, setPlan] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [wish, setWish] = useState("");
  const { wishes: lanterns, save: saveLanterns } = useSavedWishes();
  const [newLantern, setNewLantern] = useState<number | null>(null);
  const [storageWarning, setStorageWarning] = useState("");
  const [wishError, setWishError] = useState("");

  return <>
    <section className="world-scene garden-scene" aria-label="A garden for your year">
      <div className="play-heading"><span className="micro">A NEW YEAR / SOMETHING LOVELY TO GROW</span><h2>Good things<br/><em>take root.</em></h2><p>Six little seeds for your next chapter.<br/>Tap each one and grow yourself a birthday garden.</p></div>
      <div className="birthday-garden"><svg className="garden-ground" viewBox="0 0 600 170" aria-hidden="true"><ellipse cx="300" cy="80" rx="285" ry="65" fill="#c5a1bd" stroke="#9f749b"/><path d="M15 80Q300 210 585 80L520 145Q300 200 80 145Z" fill="#a788ad"/><ellipse cx="300" cy="75" rx="268" ry="51" fill="#e8c5cf"/></svg>{gardenWords.map((word, i) => <button key={word} className={`garden-seed seed-position-${i} ${flowers.includes(i) ? "flower-grown" : ""}`} aria-label={`${flowers.includes(i) ? "Grown" : "Plant"} ${word}`} aria-pressed={flowers.includes(i)} style={{ "--petal-tone": ["#ecc0d5", "#c3a1d2", "#f0c9ad"][i % 3], "--lean": `${(i % 3 - 1) * 8}deg` } as CSSProperties} onClick={() => { if (!flowers.includes(i)) { setFlowers(f => [...f, i]); if (flowers.length === 5) celebrate(); } }}><span className="garden-flower" aria-hidden="true"><i className="flower-stem"/><i className="flower-leaf leaf-left"/><i className="flower-leaf leaf-right"/><span className="flower-head">{Array.from({ length: 6 }, (_, j) => <i key={j} style={{ rotate: `${j * 60}deg` }}/>) }<b/></span></span><span className="seed-pearl" aria-hidden="true">✧</span><small>{flowers.includes(i) ? word : "plant a little joy"}</small></button>)}</div>
      <div className="play-status" aria-live="polite"><p>{flowers.length === 6 ? "Look what you grew. May your year be just as beautiful." : `${flowers.length} / 6 little joys in bloom.`}</p>{flowers.length === 6 && <button className="play-link" onClick={() => setFlowers([])}>Plant another little garden ↗</button>}</div>
    </section>

    <section className="world-scene adventure-scene" aria-label="Our next little adventure">
      <div className="play-heading"><span className="micro">TO BE CONTINUED / WITH YOUR FAVOURITE PEOPLE</span><h2>What shall<br/><em>we do next?</em></h2><p>Let a little chance choose our next memory.<br/>Spin the wheel. Daydream about the plan.</p></div>
      <div className="adventure-stage"><span className="wheel-pointer" aria-hidden="true">▼</span><div className="adventure-wheel" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">{["☕", "☾", "✿", "✧", "♡", "☀"].map((symbol, i) => <span key={symbol} style={{ transform: `rotate(${i * 60}deg) translateY(-115px) rotate(${-i * 60}deg)` }}>{symbol}</span>)}</div><button className="wheel-hub" onClick={() => { const next = Math.floor(Math.random() * plans.length); setRotation(r => r + 1080 + ((360 - next * 60 - r % 360) % 360 + 360) % 360); setPlan(next); }}>Spin our<br/><em>next chapter ↗</em></button></div>
      <div className="play-status adventure-result" aria-live="polite"><span className="micro">{plan === null ? "SIX LITTLE POSSIBILITIES" : "OUR NEXT LITTLE PLAN"}</span><p>{plan === null ? "There’s always room for one more story." : plans[plan]}</p>{plan !== null && <span className="script">Simon + Priya + Olive. Obviously. ♡</span>}</div>
    </section>

    <section className="world-scene lantern-scene" aria-label="Send a wish into the sky">
      <div className="play-heading"><span className="micro">A QUIET LITTLE MOMENT / JUST FOR YOU</span><h2>Let a wish<br/><em>find its wings.</em></h2><p>Something you hope for. Something you dream of.<br/>Write it on a lantern and let it fly.</p></div>
      <div className="lantern-sky"><div className="lantern-moon" aria-hidden="true">☾</div><div className="lantern-flight-field">{lanterns.map(({text, slot}) => { const [x, y, tilt, scale] = lanternSpots[slot]; return <div className={`released-lantern scattered-lantern ${newLantern === slot ? "lantern-just-released" : ""}`} key={slot} style={{ "--lantern-x": `${x}%`, "--lantern-y": `${y}%`, "--lantern-tilt": `${tilt}deg`, "--lantern-scale": scale, "--lantern-delay": `${slot * -.7}s` } as CSSProperties}><span className="lantern-drift"><span className="paper-lantern"><i/></span><small>{text}</small></span></div>;})}</div><form className="wish-writing" onSubmit={e => { e.preventDefault(); if (!wish.trim()) { setWishError("Give your wish a few words first."); return; } if (lanterns.length >= 6) return; const slot = lanternSpots.findIndex((_, i) => !lanterns.some(l => l.slot === i)); const saved = saveLanterns([...lanterns, {text: wish.trim(), slot}]); setNewLantern(slot); setStorageWarning(saved ? "" : "This browser could not save your wishes. They will stay here until you reload."); setWish(""); setWishError(""); }}><label htmlFor="lantern-wish">{lanterns.length === 6 ? "Six wishes, safe among the stars." : "Dear universe, this year I wish for…"}</label><input id="lantern-wish" value={wish} onChange={e => setWish(e.target.value)} maxLength={80} placeholder="a little dream of your own" disabled={lanterns.length === 6}/><button className="wish-button" type="submit" disabled={lanterns.length === 6}>Release my wish ↑</button><span className="wish-privacy">{storageWarning || "Saved on this browser, just for you. Your lanterns will be here when you return."}</span><span role="status" className="wish-error">{wishError}</span></form></div>
      <div className="play-status" aria-live="polite"><p>{lanterns.length ? `${lanterns.length} little ${lanterns.length === 1 ? "wish" : "wishes"} carried into your sky. ♡` : "The universe is listening."}</p>{lanterns.length > 0 && <button className="play-link" onClick={() => { const saved = saveLanterns([]); setNewLantern(null); setStorageWarning(saved ? "" : "This browser could not update your saved wishes."); }}>Clear saved wishes & start again ↗</button>}</div>
    </section>
  </>;
}
