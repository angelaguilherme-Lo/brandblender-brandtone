"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Copy, Lock, RefreshCw, Sparkles } from "lucide-react";

const systems = {
  Hospitality: { name: "Grounded retreat", colors: ["#173F35", "#C6FF5E", "#F3EFE7", "#FFFFFF", "#16221E"], fonts: ["Georgia", "Arial"], headline: "Space to come back to yourself.", eyebrow: "The quiet side of Portugal" },
  Technology: { name: "Clear momentum", colors: ["#1640D6", "#C6FF5E", "#F2F5FF", "#FFFFFF", "#111827"], fonts: ["Arial", "Arial"], headline: "Build the next thing, clearly.", eyebrow: "A smarter digital foundation" },
  Beauty: { name: "Modern ritual", colors: ["#6E203B", "#FFB7A5", "#FFF5F0", "#FFFFFF", "#2D1720"], fonts: ["Georgia", "Arial"], headline: "Care made beautifully simple.", eyebrow: "Considered formulas, visible results" },
  Consulting: { name: "Quiet authority", colors: ["#102A43", "#FFCC4D", "#F4F7FA", "#FFFFFF", "#17212B"], fonts: ["Georgia", "Arial"], headline: "Clarity for your next move.", eyebrow: "Strategy that turns into action" },
};
type Industry = keyof typeof systems;

export default function Home() {
  const [industry, setIndustry] = useState<Industry>("Hospitality");
  const [luxury, setLuxury] = useState(76);
  const [energy, setEnergy] = useState(34);
  const [radius, setRadius] = useState(18);
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);
  const system = useMemo(() => systems[industry], [industry, seed]);
  const [primary, accent, background, surface, ink] = system.colors;
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "configure_brand_direction",
      title: "Configure brand direction",
      description: "Apply an industry and strategic tone values to the visible BrandBlender workspace.",
      inputSchema: { type: "object", properties: { industry: { type: "string", enum: Object.keys(systems) }, luxury: { type: "number", minimum: 0, maximum: 100 }, energy: { type: "number", minimum: 0, maximum: 100 } }, required: ["industry"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) { const value = input as { industry?: string; luxury?: number; energy?: number }; if (!value.industry || !(value.industry in systems)) throw new Error("Choose a supported industry."); setIndustry(value.industry as Industry); if (typeof value.luxury === "number") setLuxury(value.luxury); if (typeof value.energy === "number") setEnergy(value.energy); return { applied: true, industry: value.industry }; }
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  const copyTokens = async () => { await navigator.clipboard.writeText(`:root {\n  --brand-primary: ${primary};\n  --brand-accent: ${accent};\n  --brand-background: ${background};\n  --brand-surface: ${surface};\n  --brand-text: ${ink};\n  --font-display: '${system.fonts[0]}';\n  --font-body: '${system.fonts[1]}';\n}`); setCopied(true); setTimeout(() => setCopied(false), 1600); };

  return <main className="min-h-screen bg-[#f6f6f3] text-[#11130f]">
    <header className="flex h-16 items-center justify-between border-b border-black/10 bg-white px-4 sm:px-7">
      <div className="flex items-center gap-3"><div className="logo-mark"><span>B</span></div><div><p className="text-[15px] font-bold leading-none tracking-[-.03em]">BrandBlender</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[.18em] text-black/45">BrandTone</p></div></div>
      <div className="hidden rounded-full border border-black/10 bg-[#f6f6f3] p-1 sm:flex">{['Define','Blend','Preview'].map((item,i)=><span key={item} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${i===1?'bg-black text-white':'text-black/45'}`}>{i+1}. {item}</span>)}</div>
      <button onClick={copyTokens} className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold text-white hover:bg-[#1640D6]">{copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copied':'Export tokens'}</button>
    </header>
    <section className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[390px_1fr]">
      <aside className="border-r border-black/10 bg-white p-5 sm:p-7">
        <div className="mb-7"><p className="section-label">Brand brief</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em]">What should your brand feel like?</h1><p className="mt-3 text-[15px] leading-6 text-black/55">Turn positioning into a visual system—not a random palette.</p></div>
        <label className="field-label">Describe the brand</label><textarea className="input min-h-24 resize-none" defaultValue="A premium eco-retreat in Portugal for design-conscious travellers who value calm and nature." />
        <div className="mt-5 grid grid-cols-2 gap-3"><label><span className="field-label">Industry</span><div className="relative"><select value={industry} onChange={e=>setIndustry(e.target.value as Industry)} className="input appearance-none pr-8">{Object.keys(systems).map(x=><option key={x}>{x}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5" size={15}/></div></label><label><span className="field-label">Audience</span><select className="input"><option>Premium B2C</option><option>Modern B2B</option><option>Mass market</option></select></label></div>
        <div className="mt-6 space-y-5"><Range label="Accessible ↔ Luxury" value={luxury} setValue={setLuxury}/><Range label="Calm ↔ Energetic" value={energy} setValue={setEnergy}/><Range label="Sharp ↔ Soft" value={radius*3} setValue={v=>setRadius(Math.round(v/3))}/></div>
        <div className="mt-7 border-t border-black/10 pt-6"><p className="field-label">Keep while remixing</p><div className="mt-3 flex flex-wrap gap-2"><Pill>Primary color</Pill><Pill>Typography</Pill><button className="rounded-full border border-dashed border-black/20 px-3 py-2 text-xs font-semibold text-black/50">+ Add lock</button></div></div>
        <button onClick={()=>setSeed(x=>x+1)} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c6ff5e] px-4 py-3.5 text-sm font-extrabold hover:brightness-95"><RefreshCw size={16}/> Remix direction</button>
      </aside>
      <div className="min-w-0 p-4 sm:p-7 lg:p-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="section-label">Generated direction 01</p><h2 className="mt-1 text-2xl font-semibold tracking-[-.04em]">{system.name}</h2></div><div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-green-500"/> Brand fit <strong>{88+Math.round((luxury+energy)/20)}%</strong></div></div>
        <div className="grid gap-5 xl:grid-cols-[1fr_250px]">
          <div className="preview-shell overflow-hidden border border-black/10 bg-white shadow-[0_20px_70px_rgba(16,18,14,.08)]" style={{borderRadius:radius}}><div className="flex h-11 items-center gap-2 border-b border-black/10 bg-[#f8f8f6] px-4"><i/><i/><i/><span className="ml-3 text-[10px] font-semibold text-black/35">live brand interface</span></div>
            <div style={{background,color:ink,fontFamily:system.fonts[1]}}><nav className="flex items-center justify-between px-6 py-5 sm:px-9"><strong className="text-sm tracking-tight">Serra Quiet</strong><div className="hidden gap-6 text-[11px] font-bold sm:flex"><span>STAY</span><span>EXPERIENCE</span><span>JOURNAL</span></div><button className="px-4 py-2 text-[11px] font-bold" style={{background:primary,color:'white',borderRadius:Math.max(6,radius-5)}}>BOOK A STAY</button></nav>
              <div className="grid min-h-[440px] grid-cols-1 md:grid-cols-[1.15fr_.85fr]"><div className="flex flex-col justify-center px-7 py-12 sm:px-12"><p className="mb-5 text-[10px] font-extrabold uppercase tracking-[.2em]" style={{color:primary}}>{system.eyebrow}</p><h3 className="max-w-[560px] text-[clamp(2.8rem,6vw,5.8rem)] leading-[.89] tracking-[-.055em]" style={{fontFamily:system.fonts[0]}}>{system.headline}</h3><p className="mt-7 max-w-md text-sm leading-6 opacity-65">Thoughtful stays, local rituals and restorative landscapes—designed for the pace you actually need.</p><div className="mt-8 flex items-center gap-4"><button className="px-5 py-3 text-xs font-extrabold" style={{background:accent,color:ink,borderRadius:Math.max(6,radius-4)}}>DISCOVER THE RETREAT</button><span className="text-xs font-bold underline underline-offset-4">Explore rooms</span></div></div><div className="relative m-4 min-h-72 overflow-hidden" style={{background:primary,borderRadius:Math.max(8,radius-3)}}><div className="absolute inset-0 opacity-90" style={{background:`radial-gradient(circle at 75% 25%, ${accent} 0 7%, transparent 7.5%), linear-gradient(145deg, transparent 0 45%, ${accent} 45.5% 47%, transparent 47.5%), radial-gradient(ellipse at 50% 100%, ${surface}22 0 40%, transparent 41%)`}}/><div className="absolute bottom-6 left-6 right-6 border-t border-white/30 pt-4 text-white"><p className="text-[10px] font-bold uppercase tracking-[.18em] opacity-70">Featured stay</p><p className="mt-1 text-lg" style={{fontFamily:system.fonts[0]}}>The hillside house</p></div></div></div>
            </div></div>
          <div className="space-y-4"><Panel title="Color system"><div className="mt-3 flex overflow-hidden rounded-lg">{system.colors.map((c,i)=><button key={c} aria-label={`Copy ${c}`} onClick={()=>navigator.clipboard.writeText(c)} className="group relative h-20 flex-1" style={{background:c}}><span className="absolute inset-x-0 bottom-1 text-[8px] font-bold opacity-0 mix-blend-difference transition group-hover:opacity-100" style={{color:'white'}}>{i+1}</span></button>)}</div><div className="mt-3 grid grid-cols-2 gap-y-2 text-[10px] font-semibold text-black/50"><span>Primary {primary}</span><span>Accent {accent}</span><span>Canvas {background}</span><span>Ink {ink}</span></div></Panel><Panel title="Type pairing"><p className="mt-3 text-3xl tracking-[-.04em]" style={{fontFamily:system.fonts[0]}}>Aa</p><p className="mt-2 text-sm font-bold">{system.fonts[0]}</p><p className="text-xs text-black/45">Display · 400</p><div className="my-4 h-px bg-black/10"/><p className="text-xl" style={{fontFamily:system.fonts[1]}}>Ag</p><p className="mt-2 text-sm font-bold">{system.fonts[1]}</p><p className="text-xs text-black/45">Body & UI · 400–700</p></Panel><Panel title="Effectiveness"><Score label="Accessibility" value={96}/><Score label="Type harmony" value={91}/><Score label="CTA visibility" value={94}/></Panel></div>
        </div>
      </div>
    </section>
  </main>;
}
function Range({label,value,setValue}:{label:string,value:number,setValue:(v:number)=>void}) { return <label className="block"><span className="mb-2 flex justify-between text-xs font-bold"><span>{label}</span><span className="text-black/35">{value}</span></span><input className="w-full accent-black" type="range" value={value} onChange={e=>setValue(+e.target.value)}/></label> }
function Pill({children}:{children:React.ReactNode}) { return <button className="flex items-center gap-1.5 rounded-full border border-black/15 bg-[#f6f6f3] px-3 py-2 text-xs font-bold"><Lock size={11}/>{children}</button> }
function Panel({title,children}:{title:string,children:React.ReactNode}) { return <section className="rounded-2xl border border-black/10 bg-white p-4"><p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.12em]"><Sparkles size={12}/>{title}</p>{children}</section> }
function Score({label,value}:{label:string,value:number}) { return <div className="mt-3"><div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-black/55">{label}</span><strong>{value}%</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-black/8"><div className="h-full rounded-full bg-[#1640D6]" style={{width:`${value}%`}}/></div></div> }
