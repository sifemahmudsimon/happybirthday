"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { birthday, cards, memories } from "./birthday-content";
import { CardArt, Spark } from "./celestial-art";
import { OfficeIsland, Ribbon, TeaWorld } from "./world-art";
import { MemoryMusic } from "./memory-music";
import { MoreScenes } from "./more-scenes";
import { PlayScenes, SecretSeal } from "./play-scenes";
import { Confetti, useBirthdayMusic } from "./experience-effects";

const chapters = [
  "A little universe",
  "Our office angel",
  "An invisible thread",
  "Tea. Gossip. Repeat.",
  "The memory constellation",
  "Pocketful of starlight",
  "Made for each other",
  "The moon keeps a secret",
  "A garden for your year",
  "Our next little adventure",
  "Send a wish into the sky",
  "A wish for Priya",
];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const subscribe = (callback: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [progress, setProgress] = useState(0);
  const [motion, setMotion] = useState<"system" | "full" | "calm">("full");
  const systemReduced = useSyncExternalStore(
    subscribe,
    getReduced,
    () => false,
  );
  const reduced = motion === "calm" || (motion === "system" && systemReduced);
  const [active, setActive] = useState(0);
  const [memoryPlaying, setMemoryPlaying] = useState(false);
  const [burst, setBurst] = useState(0);
  const [portal, setPortal] = useState(false);
  const [door, setDoor] = useState(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [stirred, setStirred] = useState(0);
  const [wished, setWished] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [fortune, setFortune] = useState<number | null>(null);
  const [found, setFound] = useState<number[]>([]);
  const [sealNotice, setSealNotice] = useState("");
  const [menu, setMenu] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const portalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { sound, soundError, startMusic, toggleSound } = useBirthdayMusic(
    active === 4,
    memoryPlaying,
  );

  useEffect(() => {
    let loaded = false;
    const asset = new window.Image();
    asset.onload = asset.onerror = () => {
      loaded = true;
    };
    asset.src = "/art/celestial-garden.png";
    const timer = setInterval(
      () =>
        setProgress((p) => {
          const next = Math.min(loaded ? 100 : 92, p + 4);
          if (next === 100) clearInterval(timer);
          return next;
        }),
      70,
    );
    return () => {
      clearInterval(timer);
      asset.onload = asset.onerror = null;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "calm" : "full";
    let frame = 0;
    let camera = window.scrollY;
    let lastTime = 0;
    const scenes = stage.current?.querySelectorAll<HTMLElement>(".world-scene");
    const update = (time: number) => {
      const elapsed = Math.min(64, time - (lastTime || time - 16));
      lastTime = time;
      const target = window.scrollY;
      camera = reduced
        ? target
        : camera + (target - camera) * (1 - Math.exp(-elapsed / 115));
      if (Math.abs(target - camera) < 0.1) camera = target;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = clamp(camera / Math.max(1, max)) * (chapters.length - 1);
      stage.current?.style.setProperty(
        "--travel",
        String((p / (chapters.length - 1)) * 5),
      );
      stage.current?.style.setProperty(
        "--journey",
        `${(p / (chapters.length - 1)) * 100}%`,
      );
      setActive((previous) =>
        previous === Math.round(p) ? previous : Math.round(p),
      );
      scenes?.forEach((scene, i) => {
        const d = p - i;
        const visible = reduced ? Math.round(p) === i : Math.abs(d) < 1;
        scene.style.setProperty("--local", String(d));
        scene.style.opacity = String(
          reduced ? (visible ? 1 : 0) : clamp(1 - Math.abs(d)),
        );
        scene.style.visibility = visible ? "visible" : "hidden";
        scene.inert = Math.round(p) !== i;
        scene.setAttribute("aria-hidden", String(Math.round(p) !== i));
      });
      frame = camera === target ? 0 : requestAnimationFrame(update);
    };
    const followScroll = () => {
      if (!frame) {
        lastTime = 0;
        frame = requestAnimationFrame(update);
      }
    };
    const pointer = (e: globalThis.PointerEvent) => {
      if (reduced || e.pointerType === "touch") return;
      stage.current?.style.setProperty(
        "--pointer-x",
        `${(e.clientX / innerWidth - 0.5) * 22}px`,
      );
      stage.current?.style.setProperty(
        "--pointer-y",
        `${(e.clientY / innerHeight - 0.5) * 18}px`,
      );
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", followScroll, { passive: true });
    window.addEventListener("resize", followScroll);
    window.addEventListener("pointermove", pointer);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", followScroll);
      window.removeEventListener("resize", followScroll);
      window.removeEventListener("pointermove", pointer);
    };
  }, [reduced]);

  useEffect(
    () => () => {
      if (portalTimer.current) clearTimeout(portalTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!sealNotice) return;
    const timer = setTimeout(() => setSealNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [sealNotice]);

  function go(index: number) {
    const max = document.documentElement.scrollHeight - innerHeight;
    window.scrollTo({
      top: (clamp(index, 0, chapters.length - 1) / (chapters.length - 1)) * max,
      behavior: reduced ? "instant" : "smooth",
    });
    setMenu(false);
  }
  function enter() {
    window.scrollTo({ top: 0, behavior: "instant" });
    setOpened(true);
    setBurst((v) => v + 1);
    void startMusic();
  }
  function throughPortal() {
    if (portal) return;
    setPortal(true);
    setBurst((v) => v + 1);
    portalTimer.current = setTimeout(
      () => {
        go(1);
        setPortal(false);
      },
      reduced ? 0 : 1000,
    );
  }
  function showPhoto(index: number) {
    setFortune(null);
    setPhoto(index);
    dialog.current?.showModal();
  }
  function showFortune(index: number) {
    setPhoto(null);
    setFortune(index);
    dialog.current?.showModal();
  }
  function connect(name: string) {
    setFriends((current) =>
      current.includes(name) ? current : [...current, name],
    );
  }
  function stir(e: PointerEvent<HTMLButtonElement>) {
    if (!lastPointer.current) return;
    const distance = Math.hypot(
      e.clientX - lastPointer.current.x,
      e.clientY - lastPointer.current.y,
    );
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setStirred((v) => clamp(v + distance / 700, 0, 3));
  }

  return (
    <>
      <Confetti trigger={burst} reduced={reduced} />
      {!opened && (
        <div
          className="prologue"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prologue-title"
        >
          <div className="prologue-art" />
          <div className="prologue-shade" />
          <span className="micro prologue-top">
            A SMALL GIFT FROM SIMON & OLIVE
          </span>
          <div className="prologue-center">
            <div className="seed-orbits">
              <i />
              <i />
              <i />
              <Spark />
            </div>
            <p className="micro">SEPTEMBER 03 · A WORLD MADE FOR YOU</p>
            <h1 id="prologue-title">
              Something lovely
              <br />
              is about to <em>happen.</em>
            </h1>
            <div
              className="loading-line"
              role="progressbar"
              aria-label="Preparing Priya’s universe"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <span className="load-number">
              {String(progress).padStart(2, "0")} <i>/ 100</i>
            </span>
            <button
              className="enter-button"
              disabled={progress < 100}
              onClick={enter}
            >
              {progress < 100
                ? "Gathering a little magic"
                : "Let the magic happen"}
              <span>↗</span>
            </button>
            <p className="sound-note">Sound on. Ordinary world off.</p>
          </div>
          <button
            className="motion-choice"
            onClick={() => setMotion(reduced ? "full" : "calm")}
          >
            {reduced
              ? "Gentle motion enabled · choose full experience"
              : "Full experience · prefer gentle motion?"}
          </button>
        </div>
      )}

      <div
        ref={stage}
        className={`universe-stage ${opened ? "universe-open" : ""} ${portal ? "travelling-portal" : ""}`}
        inert={!opened}
      >
        <div className="world-backdrop" />
        <div className="world-tint" />
        <div className="world-grain" />
        <div className="dust-field" aria-hidden="true">
          {Array.from({ length: 30 }, (_, i) => (
            <i
              key={i}
              style={
                {
                  "--left": `${(i * 37) % 100}%`,
                  "--top": `${(i * 19) % 100}%`,
                  "--delay": `${(i % 9) * -0.8}s`,
                  "--size": `${(i % 3) + 2}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <svg
          className="travelling-thread"
          viewBox="0 0 1400 900"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-80 700C290 970 1340 70 1080 200S-50 480 280 660S1580 320 1450 750"
            stroke="#b86c9b"
            strokeWidth="19"
            opacity=".15"
          />
          <path
            d="M-80 700C290 970 1340 70 1080 200S-50 480 280 660S1580 320 1450 750"
            stroke="#eeb8cc"
            strokeWidth="10"
          />
          <path
            d="M-80 700C290 970 1340 70 1080 200S-50 480 280 660S1580 320 1450 750"
            stroke="#ffe7cd"
            strokeWidth="1.5"
          />
        </svg>

        <MemoryMusic
          visible={opened && active === 4}
          enabled={opened && sound && active === 4}
          onPlaying={setMemoryPlaying}
        />
        <header className="world-header">
          <button
            className="world-brand"
            onClick={() => go(0)}
            aria-label="Back to Priya’s birthday"
          >
            <Spark />
            <span>
              PRIYA’S
              <br />
              <b>LITTLE UNIVERSE</b>
            </span>
          </button>
          <div className="world-controls">
            <button
              onClick={() => setMotion(reduced ? "full" : "calm")}
              aria-label={reduced ? "Enable full motion" : "Use gentle motion"}
            >
              {reduced ? "MOTION: GENTLE" : "MOTION: FULL"}
            </button>
            <button
              className="music-control"
              onClick={toggleSound}
              aria-label={sound ? "Mute music" : "Play music"}
            >
              <span className={sound ? "music-bars playing" : "music-bars"}>
                <i />
                <i />
                <i />
                <i />
              </span>
              <span>{sound ? "SOUND ON" : "SOUND OFF"}</span>
            </button>
            <button
              className="chapter-menu-button"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label="Choose a chapter"
            >
              {menu ? "CLOSE ×" : "CHAPTERS +"}
            </button>
          </div>
        </header>
        {soundError && (
          <div className="sound-error" role="status">
            {soundError}
          </div>
        )}
        {menu && (
          <nav className="chapter-menu" aria-label="Story chapters">
            {chapters.map((name, i) => (
              <button key={name} onClick={() => go(i)}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {name}
                <b>↗</b>
              </button>
            ))}
          </nav>
        )}

        <button
          className="secret-tracker"
          onClick={() => go(7)}
          aria-label={`Follow the hidden letter clues, ${found.length} of 3 seals found`}
        >
          ✧ <span>A letter is hiding here</span>
          <b>{found.length}/3</b>
        </button>
        <span className="seal-notice" role="status">
          {sealNotice}
        </span>
        <main
          className="scene-world"
          aria-label="Priya’s interactive birthday story"
        >
          <section
            className="world-scene opening-scene"
            aria-label="A little universe"
            style={{ "--local": 0 } as CSSProperties}
          >
            <div className="opening-copy">
              <span className="micro">
                THE UNIVERSE DID SOMETHING RIGHT ON SEPTEMBER 03
              </span>
              <h2>
                Happy
                <br />
                <em>Birthday,</em>
                <strong>
                  {birthday.name}
                  <span>✧</span>
                </strong>
              </h2>
              <p className="script">the world is lovelier with you in it.</p>
            </div>
            <div className="portal-stage">
              <div className="portal-halo" />
              <span className="portal-orbit-label">
                EARTH SIGN · SOFT HEART · QUIET MAGIC ·
              </span>
              <button
                className="virgo-doorway"
                onClick={throughPortal}
                aria-label="Enter through the Virgo doorway"
              >
                <div className="doorway-inner">
                  <span className="doorway-date">III · IX</span>
                  <CardArt kind="virgo" />
                  <span className="doorway-title">The Virgo</span>
                  <span className="doorway-invite">
                    YOUR STORY IS WAITING <b>↗</b>
                  </span>
                </div>
              </button>
              <div className="satellite-card satellite-left">
                <button
                  onClick={() => showFortune(0)}
                  aria-label="Reveal the dreamer fortune"
                >
                  <CardArt kind="moon" />
                  <span>The dreamer</span>
                </button>
              </div>
              <div className="satellite-card satellite-right">
                <button
                  onClick={() => showFortune(3)}
                  aria-label="Reveal the heart fortune"
                >
                  <CardArt kind="heart" />
                  <span>The heart</span>
                </button>
              </div>
              <span className="portal-handwritten script">
                a doorway, just for you ↗
              </span>
            </div>
            <div className="opening-corner">
              <span>♍︎</span>
              <p>
                ONE BEAUTIFUL SOUL.
                <br />
                AN ENTIRE UNIVERSE OF LOVE.
              </p>
            </div>
          </section>

          <section
            className="world-scene office-scene"
            aria-label="Our office angel"
          >
            <div className="scene-copy">
              <span className="micro">CHAPTER ONE / TWO NEW FACES</span>
              <h2>
                Every story
                <br />
                needs <em>an angel.</em>
              </h2>
              <p>
                When Olive and I joined the office,
                <br />
                everything was unfamiliar.
              </p>
              <p>
                Then there was you, Priya.
                <br />
                You showed us the way.
              </p>
              <span className="script">
                and suddenly, it felt like we belonged.
              </span>
            </div>
            <div className={`office-stage ${door ? "office-awake" : ""}`}>
              <div className="office-aura" />
              <OfficeIsland />
              <button
                className="office-knock"
                onClick={() => {
                  setDoor(true);
                  setBurst((v) => v + 1);
                }}
              >
                <span>{door ? "♡" : "✧"}</span>
                {door ? "our guiding angel" : "knock on the door"}
              </button>
              {door && (
                <div className="office-note">
                  <span className="micro">A LITTLE NOTE FOR YOU</span>Some
                  people explain the work.
                  <br />
                  You made us feel at home.
                  <span className="script">thank you for being you.</span>
                </div>
              )}
              <span className="island-label script">
                somewhere, an ordinary office.
                <br />
                somehow, an extraordinary beginning.
              </span>
            </div>
            <SecretSeal
              index={0}
              found={found.includes(0)}
              onFind={(i) => {
                setFound((f) => (f.includes(i) ? f : [...f, i]));
                setSealNotice(
                  "A secret seal found. Follow the letter trail above. ♡",
                );
              }}
            />
          </section>

          <section
            className="world-scene connection-scene"
            aria-label="An invisible thread"
          >
            <div className="connection-heading">
              <span className="micro">
                CHAPTER TWO / THE SPACE BETWEEN US GOT SMALLER
              </span>
              <h2>
                A hello. A conversation.
                <br />
                <em>An invisible thread.</em>
              </h2>
            </div>
            <div className="constellation-stage">
              <Ribbon connected={friends.length / 3} />
              {["Simon", "Priya", "Olive"].map((name, i) => (
                <button
                  key={name}
                  onClick={() => connect(name)}
                  className={`friend-orb friend-${i} ${friends.includes(name) ? "connected" : ""}`}
                  aria-pressed={friends.includes(name)}
                  aria-label={`Connect ${name}`}
                >
                  <span className="friend-orb-art">
                    <CardArt kind={["sun", "virgo", "moon"][i]} />
                  </span>
                  <b>{name}</b>
                  <span>
                    {friends.includes(name)
                      ? "CONNECTED BY A LITTLE MAGIC"
                      : "TAP TO CONNECT"}
                  </span>
                </button>
              ))}
            </div>
            <div className="connection-caption" aria-live="polite">
              <p>
                {friends.length === 3
                  ? "And just like that: best buddies. A little constellation of our own."
                  : "First we talked. Then we shared. Somewhere along the way, colleagues became our people."}
              </p>
              <span className="script">
                {friends.length === 3
                  ? "three people. so many stories. ♡"
                  : "tap our stars. see what brings us together."}
              </span>
            </div>
          </section>

          <section
            className="world-scene tea-scene"
            aria-label="Tea and gossip"
          >
            <div className="scene-copy tea-copy">
              <span className="micro">
                CHAPTER THREE / OUR FAVOURITE LITTLE RITUAL
              </span>
              <h2>
                Tea.
                <br />
                Gossip.
                <br />
                <em>Repeat.</em>
              </h2>
              <p>
                After lunch. No grand plans.
                <br />
                Just us, our tea, and conversations
                <br />
                we never wanted to end.
              </p>
              <span className="script">
                my favourite part of an ordinary day.
              </span>
            </div>
            <div className="tea-stage">
              <TeaWorld stirred={stirred} />
              <button
                className="stir-control"
                onPointerDown={(e) => {
                  lastPointer.current = { x: e.clientX, y: e.clientY };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={stir}
                onPointerUp={(e) => {
                  lastPointer.current = null;
                  e.currentTarget.releasePointerCapture(e.pointerId);
                }}
                onPointerCancel={() => {
                  lastPointer.current = null;
                }}
                onClick={() => setStirred((v) => clamp(v + 0.6, 0, 3))}
                aria-label="Stir the tea to reveal a memory"
              >
                <span>↻</span>
                {stirred >= 3 ? "another cup? always." : "stir a little gossip"}
              </button>
              {[
                "“Okay, but did you hear…”",
                "One more story. One more sip.",
                "Same time tomorrow? ♡",
              ].map((text, i) => (
                <span
                  key={text}
                  className={`gossip-bubble gossip-${i} ${stirred > i ? "gossip-visible" : ""}`}
                >
                  {text}
                </span>
              ))}
              <span className="tea-hint">
                DRAG TO STIR · OR TAP FOR A LITTLE STORY
              </span>
            </div>
            <SecretSeal
              index={1}
              found={found.includes(1)}
              onFind={(i) => {
                setFound((f) => (f.includes(i) ? f : [...f, i]));
                setSealNotice(
                  "A secret seal found. Follow the letter trail above. ♡",
                );
              }}
            />
          </section>

          <section
            className="world-scene memory-scene"
            aria-label="The memory constellation"
          >
            <div className="memory-heading">
              <span className="micro">
                CHAPTER FOUR / MOMENTS WE GET TO KEEP
              </span>
              <h2>
                Our little
                <br />
                <em>forever things.</em>
              </h2>
              <p>Click a memory. Stay a little longer.</p>
            </div>
            <div className="memory-vortex">
              {Array.from({ length: 10 }, (_, i) => {
                const memory = memories[i % 4];
                return (
                  <button
                    key={i}
                    className={`flying-memory flying-${i}`}
                    style={{ "--n": i } as CSSProperties}
                    onClick={() => showPhoto(i % 4)}
                    aria-label={`Open memory ${i + 1}: ${memory.caption}`}
                  >
                    <span className="memory-pin" />
                    <Image
                      unoptimized
                      width={500}
                      height={600}
                      src={memory.photo}
                      alt={memory.alt}
                    />
                    <span>{memory.caption}</span>
                    <i>PHOTO PLACEHOLDER</i>
                  </button>
                );
              })}
            </div>
            <span className="memory-footnote script bg-[#956691] text-white">
              borrowed pictures for now. but our memories are forever.
            </span>
            <SecretSeal
              index={2}
              found={found.includes(2)}
              onFind={(i) => {
                setFound((f) => (f.includes(i) ? f : [...f, i]));
                setSealNotice(
                  "A secret seal found. Follow the letter trail above. ♡",
                );
              }}
            />
          </section>

          <PlayScenes
            found={found}
            onCelebrate={() => setBurst((v) => v + 1)}
            go={go}
          />

          <MoreScenes celebrate={() => setBurst((v) => v + 1)} />

          <section
            className={`world-scene finale-scene ${wished ? "wish-sent" : ""}`}
            aria-label="A birthday wish"
          >
            <span className="micro finale-kicker">
              AND NOW, THE WHOLE UNIVERSE IS ROOTING FOR YOU.
            </span>
            <div className="finale-name" aria-hidden="true">
              Priya
            </div>
            <div className="wish-orbit wish-orbit-one" />
            <div className="wish-orbit wish-orbit-two" />
            <div className="finale-center">
              <div className="celestial-cake" aria-hidden="true">
                <div className="cake-candle">
                  <span />
                </div>
                <div className="icing" />
                <div className="cake-tier">✧ ♡ ✧</div>
                <div className="cake-dish" />
              </div>
              <h2>
                {wished ? "May it all" : "Close your eyes."}
                <br />
                <em>{wished ? "come true." : "Make a wish."}</em>
              </h2>
              <p>
                {wished
                  ? "More tea. More laughter. More beautiful chapters.\nYou deserve every little bit of it."
                  : "For everything you are. For everything you’re becoming.\nHere’s to a year as lovely as you."}
              </p>
              <button
                className="wish-button"
                onClick={() => {
                  setWished(!wished);
                  setBurst((v) => v + 1);
                }}
              >
                {wished
                  ? "Send another little wish"
                  : "Send your wish to the stars"}
                <Spark />
              </button>
              <span className="script finale-signature">
                with all our love, Simon & Olive ♡
              </span>
            </div>
          </section>
        </main>

        <footer className="journey-controls">
          <div className="chapter-count">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <i>/ {String(chapters.length).padStart(2, "0")}</i>
          </div>
          <div className="journey-track">
            <div className="journey-track-line">
              <span />
            </div>
            <nav aria-label="Navigate the universe">
              {chapters.map((name, i) => (
                <button
                  key={name}
                  className={active === i ? "current" : ""}
                  aria-label={`Go to ${name}`}
                  aria-current={active === i ? "step" : undefined}
                  onClick={() => go(i)}
                >
                  <span />
                </button>
              ))}
            </nav>
          </div>
          <div className="chapter-caption">
            <span>{chapters[active]}</span>
            <small>
              {active === chapters.length - 1
                ? "STAY A LITTLE. THIS MOMENT IS YOURS."
                : "SCROLL TO WANDER"}
            </small>
          </div>
          <div className="journey-arrows">
            <button
              aria-label="Previous chapter"
              disabled={active === 0}
              onClick={() => go(active - 1)}
            >
              ↑
            </button>
            <button
              aria-label={
                active === chapters.length - 1
                  ? "Replay the journey"
                  : "Next chapter"
              }
              onClick={() =>
                go(active === chapters.length - 1 ? 0 : active + 1)
              }
            >
              {active === chapters.length - 1 ? "↺" : "↓"}
            </button>
          </div>
        </footer>
      </div>
      <div className="scroll-journey" aria-hidden="true" />
      <dialog
        ref={dialog}
        className={`memory-window ${photo !== null ? "memory-photo-window" : ""}`}
        aria-label={
          photo !== null ? "A memory of us" : "A message from the stars"
        }
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="window-close"
          onClick={() => dialog.current?.close()}
          aria-label="Close the memory"
        >
          ×
        </button>
        {photo !== null ? (
          <>
            <Image
              unoptimized
              width={900}
              height={900}
              src={memories[photo].photo}
              alt={memories[photo].alt}
            />
            <div className="memory-photo-copy">
            <span className="micro">A MOMENT IN OUR LITTLE UNIVERSE</span>
            <h2>{memories[photo].title}</h2>
            <p>{memories[photo].description}</p>
            <div className="window-nav">
              <button onClick={() => setPhoto((photo + 3) % 4)}>
                ← Previous
              </button>
              <span>{photo + 1} / 4</span>
              <button onClick={() => setPhoto((photo + 1) % 4)}>Next →</button>
            </div>
            </div>
          </>
        ) : fortune !== null ? (
          <>
            <div className="fortune-illustration">
              <CardArt kind={cards[fortune].symbol} />
            </div>
            <span className="micro">
              THE UNIVERSE HAS A LITTLE SOMETHING TO SAY
            </span>
            <h2>{cards[fortune].title}</h2>
            <p>{cards[fortune].message}</p>
            <div className="window-nav">
              <button
                aria-label="Previous fortune"
                onClick={() => setFortune((fortune + 4) % 5)}
              >
                ←
              </button>
              <span>{fortune + 1} / 5</span>
              <button
                aria-label="Next fortune"
                onClick={() => setFortune((fortune + 1) % 5)}
              >
                →
              </button>
            </div>
          </>
        ) : null}
      </dialog>
    </>
  );
}
