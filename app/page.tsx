'use client';
import {useEffect,useMemo,useState} from 'react';
import {Search,Building2,Users,Database,Code2,TrendingUp,BriefcaseBusiness,RefreshCw} from 'lucide-react';

type AnyObj=Record<string,any>;
const API=process.env.NEXT_PUBLIC_API_URL||'https://wkymrptykrklswmgnvze.supabase.co/functions/v1/company-intelligence-v2';
const KEY=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'';
const sections:[string,string,any][]=[['Overview','company',Building2],['Business','business',TrendingUp],['Financials','financials',Database],['People','people',Users],['Technology','technologies',Code2],['Culture','culture',BriefcaseBusiness]];
function pretty(k:string){return k.replaceAll('_',' ').replace(/\b\w/g,m=>m.toUpperCase())}
function display(v:any){if(v===null||v===undefined||v==='')return '—';return String(v)}
async function api(path:string){const r=await fetch(API+path,{headers:KEY?{apikey:KEY,Authorization:`Bearer ${KEY}`}:{}});const d=await r.json();if(!r.ok)throw Error(d.message||d.error||'API request failed');return d}
export default function Home(){
 const [query,setQuery]=useState('Blinkit'),[data,setData]=useState<AnyObj|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState(''),[tab,setTab]=useState('company');
 const load=async(q=query)=>{setLoading(true);setError('');try{const d=await api(`?route=company&name=${encodeURIComponent(q)}`);setData(d);setTab('company')}catch(e:any){setError(e.message)}finally{setLoading(false)}};
 useEffect(()=>{load('Blinkit')},[]);
 const interview=data?.interview_intelligence||[];
 const top=useMemo(()=>[...interview].sort((a:any,b:any)=>Number(b.rating)-Number(a.rating)).slice(0,6),[interview]);
 return <main className="min-h-screen">
  <header className="sticky top-0 z-10 border-b border-[#1d2430] bg-[#07090d]/90 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><div><div className="text-lg font-bold tracking-tight">COMPANY<span className="text-cyan-400">INTEL</span></div><div className="text-xs text-gray-500">Company intelligence platform</div></div><div className="pill">LIVE API</div></div></header>
  <div className="mx-auto max-w-7xl px-6 py-8">
   <div className="mb-8"><h1 className="text-4xl font-bold tracking-tight">Company Intelligence</h1><p className="mt-2 text-gray-400">Research-backed company profiles, business data and interview intelligence.</p></div>
   <div className="card flex items-center gap-3 p-3"><Search className="text-gray-500" size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} placeholder="Search a company..." className="flex-1 bg-transparent outline-none"/><button onClick={()=>load()} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">Search</button></div>
   {loading&&<div className="mt-8 flex items-center gap-2 text-gray-400"><RefreshCw className="animate-spin" size={18}/> Loading intelligence...</div>}
   {error&&<div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-300">{error}</div>}
   {data&&!loading&&<>
    <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]"><div className="card p-6"><div className="flex items-start gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Building2/></div><div><h2 className="text-2xl font-bold">{data.company?.short_name||data.company?.name}</h2><p className="text-gray-400">{data.company?.name}</p><div className="mt-3 flex flex-wrap gap-2"><span className="pill">{display(data.company?.industry)}</span><span className="pill">{display(data.company?.category)}</span><span className="pill">{display(data.company?.operating_countries)}</span></div></div></div></div><div className="card p-6"><div className="text-xs uppercase tracking-wider text-gray-500">Interview focus</div><div className="mt-2 text-3xl font-bold">{interview.length}</div><div className="text-sm text-gray-400">skill areas</div></div></div>
    <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[#1d2430] pb-3">{sections.map(([label,key,Icon])=><button key={key} onClick={()=>setTab(key)} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${tab===key?'bg-white text-black':'text-gray-400 hover:bg-[#111722]'}`}><Icon size={16}/>{label}</button>)}<button onClick={()=>setTab('interview')} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${tab==='interview'?'bg-white text-black':'text-gray-400 hover:bg-[#111722]'}`}><Code2 size={16}/>Interview</button></div>
    {tab==='interview'?<Interview rows={interview}/>:<Section title={pretty(tab)} obj={data[tab]||{}}/>}
    <div className="mt-8"><h3 className="mb-3 text-lg font-semibold">Interview skill snapshot</h3><div className="grid-auto">{top.map((x:any)=><div className="card p-4" key={x.skill_area}><div className="flex justify-between gap-3"><span className="font-medium">{pretty(x.skill_area)}</span><span className="pill">{x.rating}/10</span></div><p className="mt-2 text-xs leading-5 text-gray-500">{x.topics?.join(' · ')}</p></div>)}</div></div>
   </>}
  </div>
 </main>
}
function Section({title,obj}:{title:string,obj:AnyObj}){const entries=Object.entries(obj).filter(([k])=>k!=='company_id');return <section className="mt-6"><h3 className="mb-3 text-lg font-semibold">{title}</h3><div className="grid-auto">{entries.map(([k,v])=><div className="card p-4" key={k}><div className="text-xs uppercase tracking-wider text-gray-500">{pretty(k)}</div><div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-200">{display(v)}</div></div>)}</div></section>}
function Interview({rows}:{rows:any[]}){return <section className="mt-6"><h3 className="mb-3 text-lg font-semibold">Technical Interview Intelligence</h3><div className="grid-auto">{rows.map(x=><div className="card p-5" key={x.skill_area}><div className="flex items-center justify-between"><h4 className="font-semibold">{pretty(x.skill_area)}</h4><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-300">{x.rating}/10</span></div><div className="mt-4 flex flex-wrap gap-2">{(x.topics||[]).map((t:string)=><span className="pill" key={t}>{t}</span>)}</div></div>)}</div></section>}