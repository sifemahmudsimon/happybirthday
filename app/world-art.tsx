export function OfficeIsland() {
  return <svg viewBox="0 0 900 690" fill="none" className="office-island" aria-hidden="true">
    <defs><linearGradient id="walls" x1="200" y1="100" x2="620" y2="500" gradientUnits="userSpaceOnUse"><stop stopColor="#f6d5d6"/><stop offset="1" stopColor="#b482ab"/></linearGradient><linearGradient id="window" x2="0" y2="1"><stop stopColor="#fff2d7"/><stop offset="1" stopColor="#e5a6c2"/></linearGradient><linearGradient id="rock" x2=".8" y2="1"><stop stopColor="#e6b8c8"/><stop offset="1" stopColor="#785e91"/></linearGradient></defs>
    <g stroke="#77536e" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M125 468Q100 406 222 407L636 401Q770 397 782 468L730 514 210 527Z" fill="#ead0cf"/>
      <path d="m147 478 77 96 100-30 109 119 94-113 95 19 126-86-173 14-127-7-132 24Z" fill="url(#rock)"/>
      <path d="m224 574 92-60 8 30m109 119 15-173m79 60 48-53m47 72 20-63M183 470q278 70 550-9" opacity=".6"/>
      <path d="M229 191 463 113 685 205 455 286Z" fill="#fae2d5"/>
      <path d="M229 191v247l226 85V286Z" fill="#ce9bb7"/>
      <path d="M455 286v237l230-91V205Z" fill="url(#walls)"/>
      <path d="m217 185 248-87 232 101-11 23-225-84-230 75Z" fill="#b581a1"/>
      <path d="M279 250v135l62 24V274Z" fill="url(#window)"/>
      <path d="M368 284v135l51 20V306Z" fill="url(#window)"/>
      <path d="m289 257 0 125 40 15V280m-47 39 56 22m39 8 34 14"/>
      <path d="M573 472V323q0-68 68-46v170Z" fill="#725473"/>
      <path d="M585 465V324q1-50 43-40v164Z" fill="url(#window)"/>
      <path d="m628 448-37-17V317l37-33Z" fill="#f8d2c9"/>
      <circle cx="604" cy="374" r="3" fill="#77536e"/>
      <path d="M491 303v87l52-20v-88Z" fill="url(#window)"/><path d="m491 347 52-20m-26-34v86"/>
      <path d="m564 478 81-30 13 11-79 30Zm15 11 79-30 14 12-78 31Z" fill="#f6d8d0"/>
      <path d="m250 443 165 63m-147-68 144 54M480 459l63-24" opacity=".5"/>
      <path d="M320 201q0-27 25-19v34q-25 0-25-15Z" fill="#fbe8d7"/><path d="m333 188 0 15 7 7"/>
      <path d="M667 435v-95m0 41q-41-12-34-40 34 0 34 40m0 32q46-14 39-49-35 6-39 49" fill="#9b92a5"/>
      <path d="m648 431 42-15-6 38-31 10Z" fill="#f2c4c6"/>
      <path d="M213 451v-92m0 55q-49-25-34-56 32 13 34 56m0-31q34-20 30-48-28 3-30 48" fill="#b1a1b6"/>
      <path d="m191 441 46 15-8 29-30-10Z" fill="#e6b0c1"/>
      <path d="M411 119V65l67 27-67 25" fill="#f2b4c7"/>
      <path d="M724 215q38-34 31-66m-17 19 17-19 3 24" strokeDasharray="4 5"/>
    </g>
    <g className="island-clouds" fill="#fae6df" opacity=".8"><ellipse cx="224" cy="520" rx="95" ry="17"/><ellipse cx="712" cy="530" rx="72" ry="12"/><ellipse cx="428" cy="640" rx="100" ry="12"/></g>
    <g fill="#fff3d1"><path d="m177 239 6 20 21 6-21 6-6 21-6-21-20-6 20-6Z"/><path d="m723 351 4 13 13 4-13 4-4 13-4-13-13-4 13-4Z"/></g>
  </svg>;
}

export function TeaWorld({ stirred }: { stirred: number }) {
  return <svg viewBox="0 0 850 700" className="tea-world" fill="none" aria-hidden="true">
    <defs><linearGradient id="china" x1="230" y1="310" x2="570" y2="550" gradientUnits="userSpaceOnUse"><stop stopColor="#fff1e7"/><stop offset=".4" stopColor="#f9d2d5"/><stop offset="1" stopColor="#c894b8"/></linearGradient><radialGradient id="tea"><stop stopColor="#ddb498"/><stop offset="1" stopColor="#97657b"/></radialGradient></defs>
    <g className="tea-steam" stroke="#fff2e2" strokeWidth="9" strokeLinecap="round" opacity=".65"><path d="M343 284c-100-91 104-127 20-219"/><path d="M437 260c-88-77 93-125 33-214"/><path d="M509 272c-39-55 83-95 33-155"/></g>
    <g stroke="#926b85" strokeWidth="2">
      <ellipse cx="422" cy="580" rx="265" ry="62" fill="#d9b0c5"/><ellipse cx="421" cy="566" rx="244" ry="55" fill="#fae1d8"/><ellipse cx="420" cy="565" rx="188" ry="35" stroke="#c697b0"/>
      <path d="M591 365c120-62 156 55 78 116l-91 23 15-37 52-21c47-30 38-87-27-42Z" fill="url(#china)"/>
      <path d="M223 340q3 211 105 232 91 36 190-3 100-32 104-229Z" fill="url(#china)"/>
      <ellipse cx="422" cy="340" rx="201" ry="65" fill="#ffebdf"/><ellipse cx="422" cy="343" rx="181" ry="49" fill="url(#tea)"/>
      <g className="tea-swirl" style={{ transform: `rotate(${stirred * 180}deg)`, transformOrigin: "422px 343px" }} stroke="#f6d7b7" opacity=".8"><ellipse cx="422" cy="343" rx="151" ry="29"/><path d="M292 346c44-32 248-20 232 6-24 32-169 1-114-8 65-12 89 6 49 10"/></g>
      <path d="M251 423q172 48 340-1M262 449q158 42 318-3" stroke="#b087a4"/>
      {[310,365,422,479,534].map(x=><g key={x} transform={`translate(${x} 488)`}><path d="M0 16V-12m0 11q-16-10-16-20Q0-20 0-1m0 7q17-8 17-20Q2-12 0 6" stroke="#9e8399"/><circle cy="-22" r="7" fill="#d99ab5"/></g>)}
      <path d="M328 573q83 23 183-2" stroke="#b087a4"/>
    </g>
    <g className="tea-spoon" style={{ transform: `rotate(${stirred * 25 - 12}deg)`, transformOrigin: "468px 330px" }} stroke="#997a8e" strokeWidth="2"><path d="m455 341 94-197q8-15 16-8 7 5 0 18L475 353Z" fill="#e3c7ba"/><ellipse cx="463" cy="346" rx="15" ry="23" fill="#f8dfca" transform="rotate(24 463 346)"/></g>
    <g stroke="#a98791" strokeWidth="2"><ellipse cx="221" cy="582" rx="44" ry="25" fill="#d5ad8b"/><ellipse cx="220" cy="573" rx="44" ry="25" fill="#e9c9a4"/><path d="m200 563 3 5m22-4-2 5m15 5 4-3m-29 15 3-5m-23-4 5-2" strokeWidth="4"/></g>
  </svg>;
}

export function Ribbon({ connected }: { connected: number }) {
  return <svg className="friendship-ribbon" viewBox="0 0 1000 500" fill="none" aria-hidden="true"><path d="M100 300C70 95 390 70 470 205S755 420 860 190C935 8 552 90 507 300S165 463 100 300Z" stroke="#e496b8" strokeWidth="22" opacity=".15"/><path d="M100 300C70 95 390 70 470 205S755 420 860 190C935 8 552 90 507 300S165 463 100 300Z" stroke="#efaac6" strokeWidth="15" pathLength="100" strokeDasharray="100" strokeDashoffset={100-connected*100} strokeLinecap="round"/><path d="M100 300C70 95 390 70 470 205S755 420 860 190C935 8 552 90 507 300S165 463 100 300Z" stroke="#ffebd8" strokeWidth="2" pathLength="100" strokeDasharray="100" strokeDashoffset={100-connected*100}/></svg>;
}
