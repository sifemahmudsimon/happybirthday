"use client";

import { useEffect, useRef, useState } from "react";

type VideoPlayer = { playVideo: () => void; pauseVideo: () => void; setVolume: (n: number) => void; getVolume: () => number; seekTo: (n: number, allow: boolean) => void; destroy: () => void };
type PlayerOptions = { width: number; height: number; videoId: string; playerVars: Record<string, string | number>; events: { onReady: () => void; onStateChange: (e: { data: number }) => void; onError: () => void; onAutoplayBlocked: () => void } };
declare global { interface Window { YT?: { Player: new (node: HTMLElement, options: PlayerOptions) => VideoPlayer }; onYouTubeIframeAPIReady?: () => void } }
let apiReady: Promise<void> | undefined;
function prepareYouTube() {
  if (window.YT?.Player) return Promise.resolve();
  apiReady ??= new Promise<void>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(); };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api"; script.async = true;
    script.onerror = () => { apiReady = undefined; reject(new Error("Player unavailable")); };
    document.head.appendChild(script);
  });
  return apiReady;
}

export function MemoryMusic({ visible, enabled, onPlaying }: { visible: boolean; enabled: boolean; onPlaying: (playing: boolean) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<VideoPlayer | null>(null);
  const wanted = useRef(enabled);
  const playingCallback = useRef(onPlaying);
  const fadeFrame = useRef(0);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("Preparing your memory soundtrack…");

  function fade(to: number, pause = false) {
    cancelAnimationFrame(fadeFrame.current);
    const video = player.current;
    if (!video) return;
    const from = video.getVolume(), start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      video.setVolume(from + (to - from) * (p * p * (3 - 2 * p)));
      if (p < 1) fadeFrame.current = requestAnimationFrame(step);
      else if (pause) video.pauseVideo();
    };
    fadeFrame.current = requestAnimationFrame(step);
  }

  useEffect(() => { playingCallback.current = onPlaying; }, [onPlaying]);
  useEffect(() => {
    let disposed = false;
    const container = host.current;
    void prepareYouTube().then(() => {
      if (disposed || !container || !window.YT) return;
      const node = document.createElement("div"); container.appendChild(node);
      player.current = new window.YT.Player(node, {
        width: 260, height: 200, videoId: "_hEgNwyHlAU",
        playerVars: { playsinline: 1, controls: 1, origin: window.location.origin, rel: 0 },
        events: {
          onReady: () => { if (disposed) return; player.current?.setVolume(0); setReady(true); setStatus("Your memory soundtrack is ready."); },
          onStateChange: e => {
            if (disposed) return;
            if (e.data === 1) {
              if (wanted.current) { playingCallback.current(true); fade(45); setStatus("Playing your memory soundtrack ♡"); }
              else { fade(0, true); }
            } else if (e.data === 0 && wanted.current) { player.current?.seekTo(0, true); player.current?.playVideo(); }
            else if (e.data === 2) { playingCallback.current(false); }
          },
          onError: () => { if (!disposed) { playingCallback.current(false); setStatus("YouTube couldn’t play here. The music-box melody will continue."); } },
          onAutoplayBlocked: () => { if (!disposed) setStatus("Tap play below to start your memory soundtrack."); },
        },
      });
    }).catch(() => { if (!disposed) setStatus("YouTube is unavailable. The music-box melody will continue."); });
    return () => { disposed = true; cancelAnimationFrame(fadeFrame.current); player.current?.destroy(); player.current = null; container?.replaceChildren(); };
  }, []);

  useEffect(() => {
    wanted.current = enabled;
    if (!ready) return;
    if (enabled) player.current?.playVideo();
    else { playingCallback.current(false); fade(0, true); }
  }, [enabled, ready]);

  return <aside className={`memory-music-player ${visible ? "music-player-visible" : ""}`} aria-hidden={!visible} inert={!visible}><span className="micro">A SOUNDTRACK FOR OUR LITTLE FOREVER</span><div ref={host}/><p role="status">{status}</p><a href="https://www.youtube.com/watch?v=_hEgNwyHlAU" target="_blank" rel="noreferrer">Open song on YouTube ↗</a></aside>;
}
