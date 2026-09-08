export function Spark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 1C42 28 52 38 79 40C52 42 42 52 40 79C38 52 28 42 1 40C28 38 38 28 40 1Z" fill="currentColor" /></svg>;
}

export function CardArt({ kind }: { kind: string }) {
  return <svg viewBox="0 0 240 270" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <circle cx="120" cy="133" r="83" opacity=".4" /><circle cx="120" cy="133" r="74" opacity=".25" />
    <path d="M120 18v15m-7-8h14M27 98v14m-7-7h14M207 183v15m-7-8h14M39 202l6 6-6 6-6-6Zm157-155 5 5-5 5-5-5Z" />
    {kind === "virgo" && <>
      <path d="M78 196c-13-24-25-39-22-68 2-22 19-39 39-44 2-23 34-39 54-23 12 10 15 28 7 43l-3 12 9 16-12 4-1 15c-1 9-11 14-20 11l-1 16 29 21M88 194c-3-22 5-38 18-48M95 85c15-4 31 5 42 16M91 79c12-23 43-29 60-10M80 99c-17 12-21 34-14 54m21-43c-11 13-12 30-6 43m15-30c-5 9-5 22-1 28M135 119l9 1m-11 24c4 2 8 2 11 0" />
      <path d="M78 195c22-12 37-5 52 2 14 7 31 5 44-3M86 205c21-8 33 3 48 4 16 1 27-1 34-5M111 180l8-20" />
      <path d="M166 216c12-24 19-46 18-77m-1 16c-11-5-15-14-14-22 12 5 16 13 14 22Zm-1 13c12-3 19-9 20-18-12 1-19 8-20 18Zm-4 16c-11-5-15-12-15-21 12 4 16 11 15 21Zm-5 14c13-1 21-6 24-14-12-1-20 5-24 14Z" />
      <path d="m101 55 4-13 9 9 8-20 8 20 10-8 2 14" /><circle cx="121" cy="26" r="3" />
    </>}
    {kind === "moon" && <><path d="M144 62a73 73 0 1 0 21 129c-37 9-70-12-77-45-9-36 13-70 56-84Z" /><path d="M129 76a62 62 0 0 0 22 123" opacity=".6" /><path d="m156 91 5 18 18 5-18 5-5 18-5-18-18-5 18-5Z" /><circle cx="162" cy="154" r="4" /><path d="M83 226h77m-65 7h52" /></>}
    {kind === "sun" && <><circle cx="120" cy="132" r="45" /><circle cx="120" cy="132" r="39" /><path d="M101 130q7-8 14 0m11 0q7-8 14 0m-21 3-3 15h8m-18 7q14 15 27 0" />{Array.from({ length: 16 }, (_, i) => <path key={i} d="M120 73q-8-14 0-28q8 14 0 28Z" transform={`rotate(${i * 22.5} 120 132)`} />)}</>}
    {kind === "heart" && <><path d="M120 189c-16-18-64-45-64-77 0-37 48-48 64-15 16-33 64-22 64 15 0 32-48 59-64 77Z" /><path d="M120 176c-18-17-52-39-52-64 0-22 29-34 44-13" opacity=".5" /><path d="M65 184 178 78m-18 3 20-6-5 22M62 180l-9 14 16-6M120 62V43m-24 20-9-17m56 17 9-17M90 214h60" /></>}
    {kind === "star" && <><path d="m120 65 16 45 47 1-38 29 14 45-39-26-39 26 14-45-38-29 47-1Z" /><path d="m120 65 0 94m-63-48 88 29m38-29-88 29m-14 45 55-75m23 75-55-75" opacity=".5" /><ellipse cx="120" cy="138" rx="102" ry="30" transform="rotate(-30 120 138)" /><circle cx="197" cy="82" r="7" /><path d="M87 229h66" /></>}
    <path d="m118 244 2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" />
  </svg>;
}

export function Garden({ growth }: { growth: number }) {
  return <svg className="garden-art" viewBox="0 0 1400 680" fill="none" aria-hidden="true">
    <circle cx="700" cy="290" r="190" fill="#f2ccd9" /><circle cx="700" cy="290" r="215" stroke="#baa0c8" strokeWidth="1" strokeDasharray="2 9" />
    <path d="M0 470Q250 360 500 495T1000 470T1500 460V680H0Z" fill="#d5bfdc" /><path d="M0 580Q260 440 570 570T1400 510V680H0Z" fill="#b89cc9" />
    <path d="M650 680Q580 550 700 470Q760 425 690 384" stroke="#f6e2e7" strokeWidth="55" />
    {[110,245,1140,1280].map((x, i) => <g key={x} transform={`translate(${x} ${i % 2 ? 260 : 350}) scale(${i % 2 ? .8 : 1})`} stroke="#73577e" strokeWidth="2"><path d="M0 270Q-30 140 0 0" /><path d="M-7 70Q-86 40-55 0Q-3 20-7 70M-10 110Q55 63 62 109Q30 143-10 140M-13 179Q-90 128-87 178Q-52 215-13 205M-5 233Q72 169 77 220Q45 254-5 250" fill="#a98bb9" /></g>)}
    <g style={{ transformOrigin: "700px 550px", transform: `scale(${.2 + growth * .8})`, opacity: .4 + growth * .6 }}>
      <path d="M700 555Q682 461 704 347" stroke="#77557d" strokeWidth="4" /><path d="M697 478Q633 478 636 430Q686 424 697 478M698 433Q761 435 763 388Q713 381 698 433" fill="#9c83ad" stroke="#77557d" strokeWidth="2" />
      {[0,60,120,180,240,300].map(angle => <ellipse key={angle} cx="700" cy="302" rx="28" ry="49" fill="#f5aecb" stroke="#b575a5" strokeWidth="1.5" transform={`rotate(${angle} 700 345)`} />)}<circle cx="700" cy="345" r="29" fill="#f9dfac" stroke="#b575a5" strokeWidth="2" /><path d="M688 346q4-5 8 0m8 0q4-5 8 0m-21 8q9 8 18 0" stroke="#9b7399" strokeWidth="1.5" />
    </g>
    {[350,1000,890,490].map((x,i) => <g key={x} transform={`translate(${x} ${520 + i%2*60})`}><path d="M0 70V0" stroke="#73577e" strokeWidth="2" /><path d="M0 45q-35-5-27-26Q-1 15 0 45" fill="#92749f" /><circle r="17" fill="#f8d6df" /><circle cx="-13" cy="-10" r="13" fill="#f8d6df" /><circle cx="13" cy="-10" r="13" fill="#f8d6df" /><circle cy="-18" r="13" fill="#f8d6df" /><circle cy="-5" r="8" fill="#f9dfac" /></g>)}
  </svg>;
}
