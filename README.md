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

Knock on the office door, connect Simon/Priya/Olive, drag or tap to stir gossip, open photos, and send a wish. The chapter controls offer direct navigation. Sound and motion have separate controls; device reduced-motion preferences are respected. Memory dialogs support Escape and previous/next navigation.

## Artwork

`public/art/celestial-garden.png` was created with built-in image generation for this experience. SVG scene objects are implemented in `app/world-art.tsx` and `app/celestial-art.tsx`. See `public/art/PROMPT.md` for the background generation prompt. The placeholder photographs are external Unsplash images.

## Validation

```sh
pnpm lint
pnpm build
```

Interaction direction draws on the user’s Zajno Motion, HappyScope, Qlip 2025, and Nomadic Tribe references.

## Playful detours and secret letter

Nine stops now include a seven-star collection game, a replayable four-pair celestial matching game, and a hidden-letter hunt. Find the star seals beside the office, below the tea scene, and among the memories. Their letters spell TEA. Enter that word in the moon scene, then click the moon to uncover the letter. Optional clue buttons return to the relevant scenes. Progress is retained while navigating in the current page session; reloading starts a fresh visit.

The personal letter and puzzle clues are in `app/play-scenes.tsx`. Its draft uses Simon’s supplied office, friendship, and tea-break story. Edit the letter there before sharing if you want different wording.

Full motion uses a time-based camera easing loop with overlapping scene transitions and native scrolling, without scroll snapping. Gentle motion remains available for those who prefer it.
