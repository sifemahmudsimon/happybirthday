# Priya’s little universe

An illustrated birthday journey for September 3, from Simon and Olive. Built with Next.js, React, SVG scenes, scroll-driven camera transforms, Canvas confetti, and a painted celestial environment.

## Run locally

```sh
pnpm install
pnpm dev
```

On Windows PowerShell, use `pnpm.cmd` if script execution is disabled. Open the localhost URL printed by the server.

## Personalize

Edit `app/birthday-content.ts` for names, memories, fortune messages, and photo paths.

- Put photos in `public/memories/`, replace each `photo` with `/memories/your-photo.jpg`, and update its alt text. The floating constellation repeats the four memories across ten frames.
- Current images are labeled Unsplash placeholders and need an internet connection.
- Put your song in `public/music/` and set `birthday.music` to `/music/your-song.mp3`. The default is a locally synthesized birthday melody.

## Journey

The loading sequence leads to an entry tap that starts music and confetti. A dimensional Virgo doorway opens the story. Native scrolling moves the camera through a floating office, a friendship constellation, a giant teacup, floating memories, and a birthday wish.

Knock on the office door, connect Simon/Priya/Olive, drag or tap to stir gossip, open photos, and send a wish. The chapter controls offer direct navigation. Sound and motion have separate controls; full motion is the initial default, with a gentle-motion option. Memory dialogs support Escape and previous/next navigation.

## Artwork

`public/art/celestial-garden.png` was created with built-in image generation for this experience. SVG scene objects are implemented in `app/world-art.tsx` and `app/celestial-art.tsx`. See `public/art/PROMPT.md` for the background generation prompt. The placeholder photographs are external Unsplash images.

## Validation

```sh
pnpm lint
pnpm build
```

Interaction direction draws on the user’s Zajno Motion, HappyScope, Qlip 2025, and Nomadic Tribe references.

## Playful detours and secret letter

Nine stops now include a sixteen-star collection game that forms a heart, a replayable Simon/Priya/Olive/Heart matching game, and a hidden-letter hunt. Find the star seals beside the office, below the tea scene, and among the memories. Their word pieces are CIG, ARE, and TTE. Join them to enter CIGARETTE in the moon scene. Solving the puzzle unlocks a labeled envelope; she clicks it to open the letter. Fold, close, and Escape animate the paper folding away before dismissing it. Optional clue buttons return to the relevant scenes. Progress is retained while navigating in the current page session; reloading starts a fresh visit.

The personal letter and puzzle clues are in `app/play-scenes.tsx`. Its draft uses Simon’s supplied office, friendship, and tea-break story. Edit the letter there before sharing if you want different wording.

Full motion uses a time-based camera easing loop with overlapping scene transitions and native scrolling, without scroll snapping. Gentle motion remains available for those who prefer it.

## Expanded journey and memory soundtrack

There are now 12 stops, including a six-flower birthday garden, a next-outing wheel, and up to six personal wish lanterns. These interactions live in `app/more-scenes.tsx`; persistence is in `app/wish-storage.ts`. Wishes and their sky positions are saved in localStorage on this browser under `priya-birthday-wishes-v1`; they are never sent to a server. Saved wishes restore after reload and sync across tabs. The page offers an explicit clear-saved-wishes control and handles unavailable storage without losing the current on-screen wishes.

The memory scene uses the supplied YRF YouTube upload of Hai Junoon (KK), video ID `_hEgNwyHlAU`, through the official IFrame API in `app/memory-music.tsx`. Its visible player is initialized during the opening loader. YouTube controls media buffering; preparing the player does not guarantee the whole audio is downloaded in advance. The local music-box score continues until YouTube reports playback, then fades out while the song fades in. Leaving the scene or muting fades the song down before pausing it. Transitions take about 1.4 seconds. Browser autoplay restrictions or YouTube errors leave the fallback melody available and the player offers manual playback.

For local audio files, `birthday.music` and `birthday.memoryMusic` support preloading and gain fades. The original memory melody is the fallback while the YouTube soundtrack loads. Reference: https://developers.google.com/youtube/iframe_api_reference

The star game starts as a stylized Virgo symbol made of 20 numbered stars. Consecutive numbered connections (1 to 2 through 19 to 20) appear as their endpoint stars are lit. When all stars are connected, Virgo pauses briefly, then the stars transform into a heart made of straight connections. Plain number labels are slightly larger; connected stars show the original small heart marker; replay restores Virgo.

Lanterns settle into six scattered positions with varied heights, angles, and scale. New wishes float upward into place; restored wishes appear in their saved positions and gently drift.

The final heart is made only from the 20 stars and their straight connecting lines; there is no curved outline overlay. Flower controls use compact hit areas so front flowers do not block unplanted seeds behind them.

Development uses Webpack on port 3000. Windows development output is isolated by the actual operating-system account under `.next/account-*`, so Codex and your terminal do not replace each other's Windows-owned cache files. Stop the existing server with Ctrl+C before starting another.

Production builds use the standard `.next` directory for Vercel and `pnpm start`. Keep Vercel's Output Directory at its Next.js default.
