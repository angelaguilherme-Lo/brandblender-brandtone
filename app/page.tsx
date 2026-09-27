"use client";

import { CSSProperties, useMemo, useState } from "react";
import { ArrowDown, Check, Copy, Download, Palette as PaletteIcon, RefreshCw, SlidersHorizontal, Sparkles, Type } from "lucide-react";

type Palette = { name: string; note: string; colors: [string, string, string, string, string] };
type TypePair = { name: string; mood: string; display: string; body: string };

const palettes: Palette[] = [
  { name: "Sienna Study", note: "warm · cultivated · human", colors: ["#B45132", "#E8A650", "#F0E9DB", "#FBF8F1", "#25231F"] },
  { name: "Cobalt Paper", note: "clear · cultured · modern", colors: ["#254DB7", "#E3613E", "#D8E2F5", "#F7F3EA", "#18213A"] },
  { name: "Botanical Ink", note: "quiet · natural · refined", colors: ["#315847", "#C77849", "#CAD5B8", "#F3EFE4", "#17231D"] },
  { name: "Nocturne", note: "expressive · premium · bold", colors: ["#27243A", "#E27272", "#777DA7", "#F0E9DE", "#14131A"] },
  { name: "Mineral Blue", note: "open · intelligent · calm", colors: ["#497789", "#D69255", "#BFD2D3", "#F4F0E8", "#1D2A2D"] },
];

const typePairs: TypePair[] = [
  { name: "Gallery Modern", mood: "Editorial with a clean edge", display: "Instrument Serif", body: "Manrope" },
  { name: "Quiet Classic", mood: "Literary and considered", display: "Cormorant Garamond", body: "Manrope" },
  { name: "Modernist", mood: "Direct, graphic and contemporary", display: "Space Grotesk", body: "Manrope" },
];

const tabs = [
  { id: "palette", label: "Colour", icon: PaletteIcon },
  { id: "type", label: "Type", icon: Type },
  { id: "finish", label: "Finish", icon: SlidersHorizontal },
] as const;
type Tab = (typeof tabs)[number]["id"];

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}
function channel(value: number) { const v = value / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }
function luminance(hex: string) { const { r, g, b } = hexToRgb(hex); return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b); }
function contrast(a: string, b: string) { const first = luminance(a); const second = luminance(b); return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05); }
function hslToHex(h: number, s: number, l: number) {
  const saturation = s / 100, lightness = l / 100;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - c / 2;
  let values = [0, 0, 0];
  if (h < 60) values = [c, x, 0]; else if (h < 120) values = [x, c, 0]; else if (h < 180) values = [0, c, x]; else if (h < 240) values = [0, x, c]; else if (h < 300) values = [x, 0, c]; else values = [c, 0, x];
  return `#${values.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("palette");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [colors, setColors] = useState<[string, string, string, string, string]>(palettes[0].colors);
  const [typeIndex, setTypeIndex] = useState(0);
  const [headline, setHeadline] = useState("Ideas deserve a beautiful beginning.");
  const [typeSize, setTypeSize] = useState(76);
  const [hue, setHue] = useState(18);
  const [angle, setAngle] = useState(132);
  const [gradient, setGradient] = useState(true);
  const [grain, setGrain] = useState(true);
  const [message, setMessage] = useState("");

  const palette = palettes[paletteIndex], pairing = typePairs[typeIndex];
  const [primary, accent, soft, paper, ink] = colors;
  const ratio = useMemo(() => contrast(ink, paper), [ink, paper]);
  const displayFont = `'${pairing.display}', Georgia, serif`, bodyFont = `'${pairing.body}', Arial, sans-serif`;

  function announce(text: string) { setMessage(text); window.setTimeout(() => setMessage(""), 1800); }
  function choosePalette(index: number) { setPaletteIndex(index); setColors(palettes[index].colors); announce(`${palettes[index].name} applied`); }
  function changeColor(index: number, value: string) { setColors((current) => current.map((color, colorIndex) => colorIndex === index ? value.toUpperCase() : color) as typeof current); }
  function changeHue(value: number) { setHue(value); changeColor(1, hslToHex(value, 66, 55)); }
  function remix() { const next = (paletteIndex + 1 + Math.floor(Math.random() * (palettes.length - 1))) % palettes.length; choosePalette(next); }
  function cssTokens() { return `:root {\n  --colour-primary: ${primary};\n  --colour-accent: ${accent};\n  --colour-soft: ${soft};\n  --colour-paper: ${paper};\n  --colour-ink: ${ink};\n  --font-display: "${pairing.display}", serif;\n  --font-body: "${pairing.body}", sans-serif;\n  --gradient-angle: ${angle}deg;\n}`; }
  async function copyPalette() { await navigator.clipboard.writeText(colors.join(", ")); announce("Palette copied"); }
  function exportCss() { const blob = new Blob([cssTokens()], { type: "text/css" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "brandblender-tokens.css"; link.click(); URL.revokeObjectURL(url); announce("CSS exported"); }

  const canvasStyle = { "--primary": primary, "--accent": accent, "--soft": soft, "--paper": paper, "--ink": ink, "--angle": `${angle}deg`, "--display-font": displayFont, "--body-font": bodyFont } as CSSProperties;

  return <main className="site-shell">
    <header className="topbar">
      <a href="#top" className="brand" aria-label="BrandBlender home"><span className="brand-monogram">BB</span><span>BrandBlender <em>BrandTone</em></span></a>
      <nav className="topnav" aria-label="Page sections"><a href="#studio">Studio</a><a href="#collections">Collections</a><a href="#about">About</a></nav>
      <button className="button button-dark" onClick={exportCss}><Download size={15} /> Export CSS</button>
    </header>

    <section className="intro" id="top">
      <div><p className="kicker">A visual identity atelier</p><h1>Find your brand’s<br /><i>true colours.</i></h1></div>
      <div className="intro-copy"><p>Curated colour and typography systems for brands that want to feel considered—not generated.</p><a href="#studio">Enter the studio <ArrowDown size={15} /></a></div>
      <div className="edition-mark" aria-hidden="true"><span>01</span><small>Edition</small></div>
    </section>

    <section className="studio" id="studio">
      <aside className="tool-panel">
        <div className="panel-heading"><div><p className="kicker">The mixing desk</p><h2>Compose your system</h2></div><button className="icon-button" onClick={remix} aria-label="Remix visual direction" title="Remix direction"><RefreshCw size={16} /></button></div>
        <div className="tabs" role="tablist" aria-label="Design controls">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={activeTab === id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}><Icon size={14} /> {label}</button>)}
        </div>

        {activeTab === "palette" && <div className="tab-content" role="tabpanel">
          <div className="control-title"><span>Curated palettes</span><small>{paletteIndex + 1} / {palettes.length}</small></div>
          <div className="palette-list">{palettes.map((item, index) => <button key={item.name} className={`palette-row ${paletteIndex === index ? "selected" : ""}`} onClick={() => choosePalette(index)}><span className="mini-colors">{item.colors.slice(0, 4).map((color) => <i key={color} style={{ background: color }} />)}</span><span><strong>{item.name}</strong><small>{item.note}</small></span>{paletteIndex === index && <Check size={15} />}</button>)}</div>
          <div className="control-title space-above"><span>Edit swatches</span><button onClick={copyPalette}><Copy size={12} /> Copy all</button></div>
          <div className="swatch-grid">{colors.map((color, index) => <label key={`${index}-${color}`} className="swatch-field"><input type="color" value={color} onChange={(event) => changeColor(index, event.target.value)} aria-label={`Edit ${["primary", "accent", "soft", "paper", "ink"][index]} colour`} /><span>{color}</span></label>)}</div>
          <label className="range-control wheel-control"><span><b>Accent hue</b><small>{hue}°</small></span><div className="wheel-row"><i className="colour-wheel" /><input type="range" min="0" max="359" value={hue} onChange={(event) => changeHue(Number(event.target.value))} /></div></label>
        </div>}

        {activeTab === "type" && <div className="tab-content" role="tabpanel">
          <label className="text-control"><span>Preview text</span><textarea value={headline} maxLength={64} onChange={(event) => setHeadline(event.target.value)} /></label>
          <div className="control-title space-above"><span>Font pairings</span><small>Curated</small></div>
          <div className="type-list">{typePairs.map((pair, index) => <button key={pair.name} onClick={() => { setTypeIndex(index); announce(`${pair.name} applied`); }} className={typeIndex === index ? "selected" : ""}><span className="type-glyph" style={{ fontFamily: `'${pair.display}', serif` }}>Ag</span><span><strong>{pair.name}</strong><small>{pair.display} + {pair.body}</small><em>{pair.mood}</em></span>{typeIndex === index && <Check size={15} />}</button>)}</div>
          <label className="range-control space-above"><span><b>Display size</b><small>{typeSize}px</small></span><input type="range" min="48" max="104" value={typeSize} onChange={(event) => setTypeSize(Number(event.target.value))} /></label>
        </div>}

        {activeTab === "finish" && <div className="tab-content" role="tabpanel">
          <div className="finish-preview" style={{ background: `linear-gradient(${angle}deg, ${primary}, ${accent})` }} />
          <Toggle label="Use gradient" note="Blend primary and accent" checked={gradient} onChange={setGradient} />
          <Toggle label="Paper grain" note="Add a tactile gallery finish" checked={grain} onChange={setGrain} />
          <label className="range-control space-above"><span><b>Gradient angle</b><small>{angle}°</small></span><input type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} disabled={!gradient} /></label>
          <div className="contrast-card"><span className="contrast-sample" style={{ background: paper, color: ink }}>Aa</span><span><strong>{ratio.toFixed(1)} : 1</strong><small>Text contrast · {ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "Needs work"}</small></span><i className={ratio >= 4.5 ? "pass" : "fail"}>{ratio >= 4.5 ? "Pass" : "Check"}</i></div>
        </div>}

        <div className="panel-footer"><button className="button button-paper" onClick={remix}><RefreshCw size={14} /> Remix</button><button className="button button-dark" onClick={exportCss}><Download size={14} /> Export system</button></div>
      </aside>

      <div className="canvas-area">
        <div className="canvas-meta"><span>Live composition</span><span>{palette.name} · {pairing.name}</span></div>
        <article className={`art-canvas ${grain ? "with-grain" : ""}`} style={canvasStyle}>
          <div className="canvas-header"><span className="canvas-brand">Atelier <i>Forma</i></span><span className="canvas-index">Collection / 04—26</span><button style={{ color: ink }}>Enquire <span>↗</span></button></div>
          <div className="canvas-body">
            <div className="artwork" aria-label="Abstract brand artwork"><div className={`artwork-ground ${gradient ? "gradient" : ""}`} /><div className="artwork-sun" /><div className="artwork-arch" /><div className="artwork-line one" /><div className="artwork-line two" /><span className="artwork-number">No. 18</span></div>
            <div className="canvas-copy"><p className="canvas-kicker">Visual study · {palette.name}</p><h3 style={{ fontSize: `clamp(48px, ${typeSize / 12}vw, ${typeSize}px)` }}>{headline || "Your story starts here."}</h3><div className="canvas-notes"><p>A considered identity for ideas with texture, purpose and a point of view.</p><div><span>Direction</span><strong>{palette.note.split(" · ").slice(0, 2).join(" / ")}</strong></div></div></div>
          </div>
          <div className="canvas-footer"><span>Identity / Digital / Print</span><span>Lisbon—London</span></div>
        </article>
        <div className="canvas-actions"><div className="large-swatches">{colors.map((color, index) => <button key={`${color}-${index}`} style={{ background: color }} onClick={() => navigator.clipboard.writeText(color).then(() => announce(`${color} copied`))} aria-label={`Copy ${color}`}><span>{color}</span></button>)}</div><p><Sparkles size={13} /> Every decision updates the composition instantly.</p></div>
      </div>
    </section>

    <section className="collections" id="collections">
      <div className="collection-heading"><div><p className="kicker">Curated starting points</p><h2>Choose a visual direction.</h2></div><p>Each collection balances colour, typography and contrast—ready to refine in the studio.</p></div>
      <div className="collection-grid">{palettes.slice(0, 4).map((item, index) => <button key={item.name} className="collection-card" onClick={() => { choosePalette(index); document.querySelector("#studio")?.scrollIntoView({ behavior: "smooth" }); }}><span className="collection-art" style={{ background: item.colors[3] }}><i style={{ background: item.colors[0] }} /><i style={{ background: item.colors[1] }} /><i style={{ borderColor: item.colors[4] }} /></span><span className="collection-info"><strong>{String(index + 1).padStart(2, "0")} · {item.name}</strong><small>{item.note}</small></span></button>)}</div>
    </section>

    <footer id="about"><div><span className="brand-monogram">BB</span><strong>Good design begins with a point of view.</strong></div><p>BrandBlender turns colour and type into a coherent visual language—simply, accessibly and beautifully.</p><button className="button button-light" onClick={() => document.querySelector("#studio")?.scrollIntoView({ behavior: "smooth" })}>Create your system <span>↗</span></button></footer>
    <div className={`toast ${message ? "visible" : ""}`} role="status"><Check size={14} /> {message}</div>
  </main>;
}

function Toggle({ label, note, checked, onChange }: { label: string; note: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="toggle-row"><span><strong>{label}</strong><small>{note}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i /></label>;
}
