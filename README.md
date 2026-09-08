# A little birthday - Priya

A personal birthday experience for September 3, from Simon and Olive. Built with Next.js, React, original SVG artwork, CSS scene transitions, and a Canvas confetti burst.

## Run locally

```sh
pnpm install
pnpm dev
```

On Windows PowerShell, use `pnpm.cmd` if script execution is disabled. Open the localhost URL printed by the dev server.

## Personalize

Edit `app/birthday-content.ts` for Priya's name, the four story chapters, card messages, and photo paths. The story follows joining the office, Priya's guidance, becoming best buddies, and after-lunch tea and gossip.

- Put your photos in `public/memories/` and replace each `photo` with a path such as `/memories/tea-break.jpg`. Update the corresponding alt text. The memory strip reuses those four images.
- The current photos are clearly labeled Unsplash placeholders and require an internet connection.
- To use a real song, put it in `public/music/` and set `birthday.music` to `/music/your-song.mp3`. With no song configured, a gentle synthesized birthday melody plays locally, without an external audio service.

## Experience

The short opening progress sequence creates anticipation; the entry tap starts music and confetti. Five celestial cards reveal birthday messages. Scrolling passes through the memory chapters. Dragging upward or tapping grows a friendship flower. The photo strip opens a keyboard-dismissable viewer, and the birthday candle can be blown out and relit.

The page respects the device's reduced-motion preference. The opening screen and header offer a motion switch to choose full animation or the calm layout. Sound has a separate mute control. Native scrolling and keyboard-accessible controls remain available.

## Checks

```sh
pnpm lint
pnpm build
```

All artwork is original, created for this page. The interaction direction was informed by the user's Zajno, HappyScope, Qlip 2025, and Nomadic Tribe references.
