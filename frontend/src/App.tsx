import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  FileText, 
  Github, 
  EyeOff, 
  Timer, 
  Link as LinkIcon, 
  Twitter, 
  Linkedin,
  Flame,
  Search,
  Zap,
  BarChart3,
  MessageSquareWarning,
  Star,
  ChevronDown,
  Plus,
  X,
  LayoutDashboard
} from 'lucide-react';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';

// --- Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 94;
    const duration = 1800;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
        setTimeout(onComplete, 500);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-brand-bg flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative">
        <div className="font-mono text-[120px] text-brand-primary leading-none">
          {count.toString().padStart(2, '0')}%<span className="animate-pulse">|</span>
        </div>
        <div className="mt-4 font-sans text-xs text-brand-muted uppercase tracking-widest text-center">
          analyzing your potential...
        </div>
      </div>
      
      {/* Scan Lines */}
      <motion.div 
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-brand-primary/10"
      />
      <motion.div 
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.6 }}
        className="absolute left-0 right-0 h-px bg-brand-primary/10"
      />

      <div className="absolute bottom-10 font-mono text-[10px] text-brand-ghost uppercase tracking-tighter">
        RÉSCORE v1.0.0 — initialized
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-brand-divider flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-1 group cursor-pointer">
        <span className="font-display text-2xl text-brand-primary">R/</span>
        <span className="font-display text-xl text-brand-ink">ÉSCORE</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10">
        {['Features', 'How It Works', 'Roast Mode'].map((link) => (
          <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="relative font-sans text-[13px] text-white/70 hover:text-white transition-colors group">
            {link}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-primary transition-all group-hover:w-full" />
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="font-sans text-xs text-brand-muted hover:text-white transition-colors">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="h-9 px-5 bg-brand-primary text-brand-bg font-sans font-medium text-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(198,255,74,0.3)]">
              Get Started
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link to="/dashboard">
            <button className="flex items-center gap-2 font-sans text-xs text-brand-primary hover:text-brand-bg hover:bg-brand-primary border border-brand-primary h-9 px-4 transition-all duration-200">
              <LayoutDashboard size={14} /> Dashboard
            </button>
          </Link>
          <div className="ml-2 flex items-center">
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border border-brand-divider" } }} />
          </div>
        </Show>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20
    });
  };

  return (
    <section 
      className="relative min-h-screen pt-[60px] overflow-hidden flex items-center justify-center px-6 md:px-20"
      onMouseMove={handleMouseMove}
    >
      {/* Mesh Gradients */}
      <div 
        className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div 
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none"
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
      />

      {/* Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E2535_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
        <div>
          <div className="space-y-0 relative">
            <div className="w-full h-px bg-brand-divider absolute top-[110px] left-0 pointer-events-none" />
            
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[70px] md:text-[110px] leading-[0.9] text-brand-ghost tracking-tight"
            >
              YOUR RESUME IS
            </motion.h1>
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[70px] md:text-[110px] leading-[0.9] text-brand-ink tracking-tight"
            >
              LYING TO YOU.
            </motion.h1>
            <motion.h1 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[70px] md:text-[110px] leading-[0.9] text-brand-primary tracking-widest"
            >
              WE FIX THAT.
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 max-w-[480px] font-sans text-brand-muted text-base md:text-lg leading-relaxed"
          >
            AI-powered resume intelligence. ATS scoring, brutal feedback, and a roast mode that actually helps. Built for builders, not buzzwords.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/analyze">
              <button className="group relative h-12 px-8 bg-brand-primary text-brand-bg font-sans font-medium text-sm flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(198,255,74,0.3)]">
                Analyze Now
              </button>
            </Link>
            <button className="h-12 px-8 border border-brand-ghost text-white font-sans text-sm flex items-center justify-center hover:border-brand-secondary hover:text-brand-secondary transition-all">
              See a Sample Roast
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 flex items-center gap-4 font-sans text-xs text-brand-muted"
          >
            <span className="flex items-center gap-1.5"><span className="text-brand-primary">⬢</span> 4,200+ resumes analyzed</span>
            <span className="flex items-center gap-1.5"><span className="text-brand-primary">⬢</span> Built in India</span>
            <span className="flex items-center gap-1.5"><span className="text-brand-primary">⬢</span> Professional tier insights</span>
          </motion.div>
        </div>

        {/* Hero Right Side - Resume Card Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <motion.div 
            initial={{ rotate: -10, opacity: 0, x: 50 }}
            animate={{ rotate: -3, opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-[400px] h-[500px] bg-brand-card border border-brand-divider p-8 rounded-xl shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="space-y-6">
              <div className="w-1/3 h-4 bg-brand-divider rounded" />
              {[60, 80, 40, 90, 50, 70].map((w, i) => (
                <div key={i} className="space-y-2">
                  <div className={`h-2 bg-brand-divider rounded relative overflow-hidden`} style={{ width: `${w}%` }}>
                    {i % 2 === 0 && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent animate-shimmer" />}
                  </div>
                  {i % 3 === 0 && <div className="w-full h-px bg-brand-divider/30" />}
                </div>
              ))}
            </div>

            {/* Score Badge */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-brand-primary text-brand-bg px-4 py-2 font-mono text-sm font-bold shadow-xl"
            >
              67 / 100 →
            </motion.div>
            
            {/* Connector Line Mockup */}
            <svg className="absolute -left-12 top-20 w-12 h-20 overflow-visible pointer-events-none opacity-30 hidden md:block">
              <path 
                d="M 50,0 Q 0,40 50,100" 
                fill="none" 
                stroke="#C6FF4A" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-brand-ghost relative overflow-hidden group-hover:bg-brand-primary transition-colors">
          <motion.div 
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-[20%] bg-brand-primary"
          />
        </div>
        <span className="font-sans text-[11px] text-brand-ghost uppercase tracking-[0.2em]">scroll</span>
      </div>
    </section>
  );
};

const Marquee = () => {
  return (
    <div className="h-16 bg-brand-surface border-y border-brand-divider overflow-hidden relative flex items-center">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-brand-surface to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-brand-surface to-transparent z-10" />
      
      <div className="flex whitespace-nowrap animate-marquee">
        {[1, 2].map((group) => (
          <div key={group} className="flex items-center gap-8 px-4">
            {['RÉSCORE', 'ATS Optimizer', 'Resume Roast Mode', 'GitHub Sync', 'Interview Predictor', 'Built for Indian Job Market', 'Brutal. Honest. Precise.'].map((text, i) => (
              <div key={i} className="flex items-center gap-8 shrink-0">
                <span className="font-heading text-[13px] text-brand-muted uppercase tracking-[0.1em]">{text}</span>
                <span className="text-brand-primary text-sm">✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center py-24 bg-brand-bg relative px-6">
      <div className="max-w-[800px] w-full">
        <div className="overflow-hidden">
          <motion.div 
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <span className="px-3 py-1 border border-brand-primary text-brand-primary font-sans text-[10px] uppercase tracking-[0.2em]">The Problem</span>
          </motion.div>
        </div>

        <div className="overflow-hidden mb-10">
          <motion.h2 
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-heading text-4xl md:text-6xl text-brand-ink text-center leading-tight"
          >
            <span className="text-brand-primary">75%</span> of resumes never <br className="hidden md:block" /> reach a human.
          </motion.h2>
        </div>

        <div className="overflow-hidden mb-16 text-center">
          <motion.p 
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="font-sans text-brand-muted text-lg leading-relaxed max-w-[700px] mx-auto"
          >
            Applicant Tracking Systems filter out qualified candidates before any recruiter sees them. Formatting errors. Missing keywords. Vague bullets. Your resume might be great. The ATS doesn't know that.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <EyeOff className="text-brand-tertiary" />, title: 'Invisible to ATS', body: 'Parsed incorrectly, ranked last, rejected automatically.' },
            { icon: <Timer className="text-brand-primary" />, title: '6 seconds', body: "That's how long a recruiter actually reads your resume." },
            { icon: <LinkIcon className="text-brand-secondary" />, title: 'Generic feedback', body: 'Most tools give you a score. Not a solution.' }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className={`p-7 bg-brand-card border border-brand-divider rounded-xl group transition-colors duration-300 ${i === 0 ? 'hover:border-brand-tertiary' : i === 1 ? 'hover:border-brand-primary' : 'hover:border-brand-secondary'}`}
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="font-heading text-lg text-brand-ink mb-2">{card.title}</h3>
              <p className="font-sans text-sm text-brand-muted leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureShowcase = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="h-[500vh] relative bg-brand-bg" id="features">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="absolute top-0 left-0 w-full z-20">
          <motion.div style={{ width: progressBarWidth }} className="h-0.5 bg-brand-primary" />
        </div>

        <motion.div style={{ x }} className="flex w-[500vw]">
          {/* Panel 1 - ATS Scoring */}
          <div className="w-screen h-screen shrink-0 flex items-center px-6 md:px-20 gap-20">
            <div className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-divider" />
                  <motion.circle 
                    cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray="816"
                    initial={{ strokeDashoffset: 816 }}
                    whileInView={{ strokeDashoffset: 816 * 0.15 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="text-brand-primary" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-8xl text-brand-primary">85</span>
                  <span className="font-mono text-xl text-brand-muted">/ 100</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-5xl text-brand-ink mb-8 leading-tight">Know your ATS score. <br /> Down to the keyword.</h2>
              <div className="space-y-6 max-w-sm">
                {[
                  { label: 'Keyword Match', val: 92 },
                  { label: 'Formatting', val: 78 },
                  { label: 'Bullet Impact', val: 88 }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between font-sans text-sm text-brand-muted">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-brand-divider w-full rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.val}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full bg-brand-primary rounded-full" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 2 - Roast Mode */}
          <div className="w-screen h-screen shrink-0 bg-[#0F0A08] flex items-center px-6 md:px-20 gap-20">
            <div className="flex-1 relative">
              <div className="bg-brand-card border border-brand-divider p-8 rounded-xl opacity-60">
                <div className="space-y-4">
                  <div className="w-1/4 h-3 bg-brand-divider rounded" />
                  <div className="w-full h-px bg-brand-divider/20" />
                  <div className="relative">
                    <span className="text-white/40">Responsible for managing local database systems...</span>
                    <div className="absolute -bottom-1 left-0 w-full h-px bg-brand-tertiary/40" />
                    <div className="absolute -top-12 -right-4 bg-brand-tertiary text-white text-[10px] p-2 leading-tight max-w-[120px]">
                      Vague impact. Use quantitative metrics.
                    </div>
                  </div>
                  <div className="w-5/6 h-2 bg-brand-divider rounded" />
                  <div className="w-4/6 h-2 bg-brand-divider rounded" />
                </div>
              </div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-brand-tertiary/5 rounded-full blur-3xl pointer-events-none" />
            </div>
            <div className="flex-1">
              <div className="bg-brand-bg border border-brand-divider p-6 rounded-lg font-mono text-sm space-y-4 max-w-md shadow-2xl">
                <div className="flex gap-2">
                  <Flame className="text-brand-tertiary w-4 h-4 shrink-0" />
                  <span className="text-brand-tertiary"># ROAST_MODE INITIALIZED</span>
                </div>
                <div className="text-brand-muted space-y-2">
                  <div className="flex gap-2">
                    <span className="text-brand-primary shrink-0">&gt;</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      Bullet #4: "Worked on backend" — worked on what? For whom? Suggest quantitative results. Rewrite this immediately.
                    </motion.span>
                  </div>
                </div>
                <div className="w-2 h-4 bg-brand-primary animate-pulse" />
              </div>
              <h2 className="mt-10 font-heading text-5xl text-brand-ink leading-tight">Roast Mode. <br /> Brutally honest. <br /> Genuinely useful.</h2>
            </div>
          </div>

          {/* Panel 3 - GitHub Sync */}
          <div className="w-screen h-screen shrink-0 flex items-center px-6 md:px-20 gap-20">
            <div className="flex-1 flex gap-2 overflow-hidden justify-center max-w-[500px]">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  {[...Array(7)].map((_, j) => {
                    const active = Math.random() > 0.5;
                    const opacity = active ? (Math.random() * 0.8 + 0.2) : 0.05;
                    return (
                      <div 
                        key={j} 
                        className={`w-3 h-3 rounded-sm ${active ? 'bg-brand-primary' : 'bg-brand-divider'}`}
                        style={{ opacity }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-5xl text-brand-ink mb-6">Your GitHub is part <br /> of your resume. <br /> We prove it.</h2>
              <p className="font-sans text-brand-muted max-w-sm">We automatically translate your repos and contributions into punchy, high-impact resume bullets that recruiters actually care about.</p>
            </div>
          </div>

          {/* Panel 4 - Multi-Role */}
          <div className="w-screen h-screen shrink-0 flex items-center px-6 md:px-20 justify-center flex-col text-center">
            <div className="max-w-2xl">
              <h2 className="font-heading text-6xl text-brand-ink mb-10">One resume. <br /> Five tailored versions.</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {['React Developer', 'Full Stack Engineer', 'Backend Dev', 'PM', 'Product Designer'].map((role, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5, borderColor: '#C6FF4A' }}
                    className="px-6 py-3 border border-brand-divider text-brand-muted rounded-full text-sm font-sans"
                  >
                    {role}
                  </motion.div>
                ))}
              </div>
              <p className="mt-8 font-sans text-brand-muted">Tailoring takes seconds, not hours. Let the AI handle the context-switching.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-24 bg-brand-bg px-6" id="how-it-works">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-5xl text-brand-ink text-center mb-20">How It Works.</h2>
        
        <div className="space-y-12">
          {[
            { num: '01', title: 'Upload your resume.', content: 'Drop your PDF/Word doc and let RÉSCORE ingest your data profile.' },
            { num: '02', title: 'We tear it apart.', content: 'Our AI simulates a top-tier recruiter roast combined with deep ATS analysis.' },
            { num: '03', title: 'You level up.', content: 'Get rewritten bullets, formatting fixes, and a perfect score tailored for your job.' }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ rotateX: -20, opacity: 0 }}
              whileInView={{ rotateX: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: i * 0.1 }}
              className="relative p-10 bg-brand-card border border-brand-divider h-[300px] overflow-hidden group hover:border-brand-primary transition-colors flex flex-col justify-end"
            >
              <div className="absolute top-0 left-0 p-10 font-display text-[150px] text-brand-divider leading-[0.7] -z-10 group-hover:text-brand-primary/10 transition-colors">
                {step.num}
              </div>
              <h3 className="font-heading text-3xl text-brand-ink mb-4">{step.title}</h3>
              <p className="font-sans text-brand-muted text-lg max-w-md">{step.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MaskReveal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    <section ref={ref} className="py-32 bg-brand-bg px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl text-brand-ink mb-16">What one session looks like.</h2>
        <div className={`mask-reveal flex flex-col md:flex-row gap-20 items-center ${isInView ? 'active' : ''}`}>
          <div className="flex-1 text-center md:text-left">
            <div className="font-display text-[200px] md:text-[300px] text-brand-primary leading-none">A+</div>
            <div className="font-sans text-xl text-brand-muted mt-4">
              Before: <span className="text-white">54/100</span> → After: <span className="text-brand-primary">91/100</span>
            </div>
          </div>
          <div className="flex-1 space-y-8">
            {[
              'ATS keywords added: 14',
              'Weak bullets rewritten: 7',
              'Formatting issues fixed: 3',
              'Roast notes addressed: 11'
            ].map((text, i) => (
              <motion.div 
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-4 text-xl md:text-2xl font-heading text-brand-ink"
              >
                <Check className="text-brand-primary shrink-0" size={24} />
                {text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const UseCases = () => {
  const cards = [
    { title: 'Fresh Grad', desc: 'Getting your first tech job with no experience.', icon: <BarChart3 /> },
    { title: 'Hackathon Builder', desc: 'Translating 48-hour builds into career capital.', icon: <Zap /> },
    { title: 'Career Switcher', desc: 'Pivoting from one field and making the resume match.', icon: <LinkIcon /> },
    { title: 'FAANG Aspirant', desc: 'Competing at L4/L5 with a keyword-optimized shot.', icon: <Search /> },
    { title: 'Research Student', desc: 'Academic CVs meeting industry expectations.', icon: <FileText /> },
    { title: 'Startup Founder', desc: 'Rewriting founder experience as employable skill.', icon: <Flame /> }
  ];

  return (
    <section className="py-32 bg-brand-bg px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-5xl text-brand-ink mb-20 text-center">Built for builders.</h2>
        <div className="flex flex-nowrap md:flex-wrap gap-6 md:justify-center overflow-x-auto md:overflow-visible pb-10 scrollbar-hide">
          {cards.map((card, i) => (
            <motion.div 
              key={i}
              whileHover={{ 
                scale: 1.08, 
                y: -10, 
                borderColor: '#C6FF4A',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(198,255,74,0.2)' 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="min-w-[280px] w-[280px] h-[340px] p-8 bg-brand-card border border-brand-divider rounded-2xl flex flex-col justify-between group cursor-pointer z-10"
            >
              <div>
                <div className="mb-6 text-brand-primary group-hover:scale-110 transition-transform origin-left">{card.icon}</div>
                <h3 className="font-heading text-2xl text-brand-ink mb-4">{card.title}</h3>
                <p className="font-sans text-sm text-brand-muted leading-relaxed">{card.desc}</p>
              </div>
              <div className="flex items-center gap-2 text-brand-primary text-sm font-sans font-medium">
                See example <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 bg-brand-bg px-6 border-t border-brand-divider">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-1">
            <span className="font-display text-2xl text-brand-primary">R/</span>
            <span className="font-display text-xl text-brand-ink">ÉSCORE</span>
          </div>
          
          <div className="flex items-center gap-8 font-sans text-xs text-brand-muted">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Contact</a>
          </div>

          <div className="font-sans text-[11px] text-brand-muted text-center md:text-right">
            Built with obsession in <span className="text-brand-primary">Chennai</span>.<br />
            © 2026 RÉSCORE. All rights reserved.
          </div>
        </div>
        
        <div className="mt-12 flex justify-center gap-6">
          <Github className="w-5 h-5 text-brand-muted hover:text-brand-primary cursor-pointer transition-colors" />
          <Twitter className="w-5 h-5 text-brand-muted hover:text-brand-primary cursor-pointer transition-colors" />
          <Linkedin className="w-5 h-5 text-brand-muted hover:text-brand-primary cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
        
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('button, a, .cursor-pointer');
        const dot = document.getElementById('custom-cursor-dot');
        
        if (isInteractive) {
          cursor.style.width = '32px';
          cursor.style.height = '32px';
          cursor.style.backgroundColor = 'rgba(198, 255, 74, 0.2)';
          cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
          if (dot) dot.style.display = 'none';
        } else {
          cursor.style.width = '12px';
          cursor.style.height = '12px';
          cursor.style.backgroundColor = 'transparent';
          cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
          if (dot) dot.style.display = 'block';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink selection:bg-brand-primary selection:text-brand-bg grain-overlay relative">
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar />
          <Hero />
          <Marquee />
          <ProblemSection />
          <FeatureShowcase />
          <HowItWorks />
          <MaskReveal />
          <UseCases />
          
          {/* Roast CTA - Extra Section */}
          <section className="py-32 bg-[#0F0A08] relative overflow-hidden px-6">
            <div className="relative z-10 text-center flex flex-col items-center">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="font-display text-7xl md:text-[110px] text-brand-tertiary leading-none mb-6"
              >
                READY TO GET ROASTED?
              </motion.h2>
              <p className="font-sans text-lg text-white max-w-lg mb-10">Upload your resume. We'll tell you everything wrong with it. Instantly.</p>
              <motion.button 
                whileHover={{ x: [0, -3, 3, -3, 3, 0] }}
                className="h-14 w-52 bg-brand-tertiary text-black font-sans font-bold uppercase tracking-wider shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all"
              >
                Upload & Roast
              </motion.button>
              <p className="mt-6 font-sans italic text-brand-muted text-xs">No judgment. Just data. And maybe a little judgment.</p>
            </div>
            
            {/* Background Flame Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-tertiary opacity-5 rounded-full blur-[120px] pointer-events-none" />
          </section>

          <Footer />
        </>
      )}

      {/* Custom Cursor Circle */}
      {!loading && (
        <motion.div 
          className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] border border-brand-primary rounded-full hidden md:flex items-center justify-center mix-blend-difference" 
          id="custom-cursor"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
        >
          <div className="w-1 h-1 bg-brand-primary rounded-full" id="custom-cursor-dot" />
        </motion.div>
      )}
    </div>
  );
}



