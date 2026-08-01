import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, User, Mail, Phone, MapPin, Linkedin, Github, Globe,
  GraduationCap, Wrench, Trophy, BookOpen, Heart, Award,
  Brain, TrendingUp, AlertTriangle, CheckCircle2, MessageSquare,
  ChevronDown, ChevronUp, ArrowLeft, Calendar, Clock, Star,
  Building2, Zap, Shield, Users
} from 'lucide-react';
import { UserButton } from '@clerk/react';
import { cn } from '../lib/utils';
import { motion as m } from 'framer-motion';

function ScoreRing({ score, label, color = 'cyan' }: { score: number; label: string; color?: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;
  const colorMap: Record<string, string> = {
    cyan: '#00DCFF',
    lime: '#C6FF4A',
    ember: '#FF6B35',
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1a1a2e" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={c} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-mono font-bold" style={{ color: c }}>{score.toFixed(1)}</span>
        </div>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-muted text-center">{label}</span>
    </div>
  );
}

function Tag({ children, color = 'default' }: { children: React.ReactNode; color?: 'green' | 'red' | 'cyan' | 'default' }) {
  const colors = {
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    cyan: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
    default: 'bg-brand-card text-brand-muted border-brand-divider',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-1 rounded text-[10px] font-mono border', colors[color])}>
      {children}
    </span>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-brand-divider rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 bg-brand-card hover:bg-brand-card/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className="text-brand-secondary" />
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-brand-ink">{title}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-brand-muted" /> : <ChevronDown size={14} className="text-brand-muted" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 pt-4 border-t border-brand-divider bg-brand-bg"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RecruiterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-6">
        <p className="text-brand-muted font-mono">No recruiter report found.</p>
        <button onClick={() => navigate('/analyze')} className="text-brand-secondary font-mono text-sm underline">
          Run a new analysis
        </button>
      </div>
    );
  }

  const r = data.parsed_resume || {};
  const a = data.professional_assessment || {};
  const p = a.personality_profile || {};
  const contact = r.contact || {};
  const skills = r.skills || {};

  const recommendationColor = {
    'Strong Recommend': 'green',
    'Recommend': 'cyan',
    'Neutral': 'default',
    'Do Not Recommend': 'red',
  }[a.hire_recommendation] || 'default';

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink relative">
      <div className="absolute top-6 right-6">
        <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 border border-brand-divider" } }} />
      </div>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-brand-divider bg-brand-bg/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/analyze')} className="p-2 hover:bg-brand-card rounded-lg transition-colors text-brand-muted hover:text-brand-ink">
              <ArrowLeft size={18} />
            </button>
            <div className="h-5 w-px bg-brand-divider" />
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-brand-secondary" />
              <span className="font-mono text-xs uppercase tracking-widest text-brand-secondary">Recruiter Report</span>
            </div>
          </div>
          <Tag color={recommendationColor as any}>{a.hire_recommendation || 'Pending'}</Tag>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column — Parsed Resume */}
        <div className="lg:col-span-2 space-y-5">
          {/* Candidate Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-brand-card border border-brand-divider rounded-xl"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-heading text-4xl uppercase tracking-tight mb-1">{r.candidate_name || 'Unknown Candidate'}</h1>
                <div className="flex flex-wrap gap-3 text-xs text-brand-muted font-mono mt-3">
                  {contact.email && <span className="flex items-center gap-1"><Mail size={11} />{contact.email}</span>}
                  {contact.phone && <span className="flex items-center gap-1"><Phone size={11} />{contact.phone}</span>}
                  {contact.location && <span className="flex items-center gap-1"><MapPin size={11} />{contact.location}</span>}
                  {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-secondary hover:underline"><Linkedin size={11} />LinkedIn</a>}
                  {contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-secondary hover:underline"><Github size={11} />GitHub</a>}
                  {contact.website && <a href={contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-secondary hover:underline"><Globe size={11} />Portfolio</a>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Tag color="cyan">{r.career_level || 'Unknown Level'}</Tag>
                {r.total_experience_years != null && (
                  <span className="text-[10px] text-brand-muted font-mono flex items-center gap-1">
                    <Clock size={10} />{r.total_experience_years}y exp.
                  </span>
                )}
              </div>
            </div>

            {r.summary && (
              <div className="mt-5 pt-5 border-t border-brand-divider">
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2">Summary</p>
                <p className="text-sm text-brand-ink font-sans leading-relaxed">{r.summary}</p>
              </div>
            )}
          </motion.div>

          {/* Experience */}
          {r.experience?.length > 0 && (
            <Section title="Experience" icon={Building2}>
              <div className="space-y-6">
                {r.experience.map((exp: any, i: number) => (
                  <div key={i} className={cn("pl-4 border-l-2", i === 0 ? "border-brand-secondary" : "border-brand-divider")}>
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                      <div>
                        <p className="font-heading text-lg">{exp.title}</p>
                        <p className="text-sm text-brand-muted font-sans">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-brand-secondary flex items-center gap-1 justify-end">
                          <Calendar size={10} />{exp.duration}
                        </p>
                        {exp.duration_months && (
                          <p className="text-[9px] font-mono text-brand-ghost">{exp.duration_months} months</p>
                        )}
                      </div>
                    </div>
                    {exp.highlights?.length > 0 && (
                      <ul className="space-y-1 mt-2">
                        {exp.highlights.map((h: string, j: number) => (
                          <li key={j} className="text-xs text-brand-muted font-sans flex gap-2">
                            <span className="text-brand-secondary mt-1 shrink-0">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Education */}
          {r.education?.length > 0 && (
            <Section title="Education" icon={GraduationCap}>
              <div className="space-y-4">
                {r.education.map((edu: any, i: number) => (
                  <div key={i} className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-heading text-base">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-brand-muted font-sans">{edu.institution}</p>
                      {edu.highlights?.length > 0 && (
                        <p className="text-xs text-brand-ghost mt-1">{edu.highlights.join(', ')}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-brand-secondary">{edu.graduation_year}</p>
                      {edu.gpa && <p className="text-[9px] font-mono text-brand-ghost">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Projects */}
          {r.projects?.length > 0 && (
            <Section title="Projects" icon={Zap} defaultOpen={false}>
              <div className="space-y-5">
                {r.projects.map((proj: any, i: number) => (
                  <div key={i} className="border border-brand-divider p-4 rounded-lg">
                    <p className="font-heading text-base mb-1">{proj.name}</p>
                    <p className="text-xs text-brand-muted font-sans mb-2">{proj.description}</p>
                    {proj.impact && <p className="text-xs text-brand-secondary font-sans italic">Impact: {proj.impact}</p>}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.technologies?.map((t: string, j: number) => (
                        <Tag key={j} color="cyan">{t}</Tag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Skills */}
          {(skills.technical?.length > 0 || skills.tools?.length > 0) && (
            <Section title="Skills & Tools" icon={Wrench} defaultOpen={false}>
              <div className="space-y-4">
                {skills.technical?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2">Technical</p>
                    <div className="flex flex-wrap gap-2">{skills.technical.map((s: string, i: number) => <Tag key={i}>{s}</Tag>)}</div>
                  </div>
                )}
                {skills.tools?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2">Tools & Platforms</p>
                    <div className="flex flex-wrap gap-2">{skills.tools.map((s: string, i: number) => <Tag key={i} color="cyan">{s}</Tag>)}</div>
                  </div>
                )}
                {skills.languages_spoken?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">{skills.languages_spoken.map((s: string, i: number) => <Tag key={i}>{s}</Tag>)}</div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Extras: Certs / Achievements / Publications */}
          {(r.certifications?.length > 0 || r.achievements?.length > 0 || r.publications?.length > 0) && (
            <Section title="Achievements & Credentials" icon={Award} defaultOpen={false}>
              <div className="space-y-4">
                {r.certifications?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2">Certifications</p>
                    <ul className="space-y-1">{r.certifications.map((c: string, i: number) => <li key={i} className="text-xs text-brand-ink font-sans flex gap-2"><span className="text-brand-secondary">•</span>{c}</li>)}</ul>
                  </div>
                )}
                {r.achievements?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2">Achievements</p>
                    <ul className="space-y-1">{r.achievements.map((ach: string, i: number) => <li key={i} className="text-xs text-brand-ink font-sans flex gap-2"><span className="text-yellow-500">★</span>{ach}</li>)}</ul>
                  </div>
                )}
                {r.publications?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2">Publications</p>
                    <ul className="space-y-1">{r.publications.map((pub: string, i: number) => <li key={i} className="text-xs text-brand-ink font-sans flex gap-2"><BookOpen size={11} className="text-brand-muted shrink-0 mt-0.5" />{pub}</li>)}</ul>
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>

        {/* Right Column — Professional Assessment */}
        <div className="space-y-5">
          {/* Overall Score + Recommendation */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-brand-card border border-brand-divider rounded-xl text-center"
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-3">Overall Score</p>
            <div className="text-6xl font-heading mb-2 text-brand-secondary">{a.overall_score || '—'}</div>
            <div className="text-[10px] font-mono text-brand-muted">/ 100</div>
            <div className="mt-4 pt-4 border-t border-brand-divider">
              <Tag color={recommendationColor as any}>{a.hire_recommendation || 'Pending'}</Tag>
              {a.hire_reasoning && <p className="text-xs text-brand-muted font-sans mt-3 leading-relaxed italic">{a.hire_reasoning}</p>}
            </div>
          </motion.div>

          {/* Executive Summary */}
          {a.executive_summary && (
            <div className="p-5 bg-brand-card border border-brand-secondary/20 rounded-xl">
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-secondary mb-3">Executive Summary</p>
              <p className="text-sm text-brand-ink font-sans leading-relaxed">{a.executive_summary}</p>
            </div>
          )}

          {/* Personality Indices */}
          {p.collaboration_index != null && (
            <div className="p-5 bg-brand-card border border-brand-divider rounded-xl">
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-4">Personality Indices</p>
              <div className="flex justify-around">
                <ScoreRing score={p.collaboration_index} label="Collaboration" color="cyan" />
                <ScoreRing score={p.innovation_index} label="Innovation" color="lime" />
                <ScoreRing score={p.attention_to_detail} label="Attention" color="ember" />
              </div>
            </div>
          )}

          {/* Archetype */}
          {p.archetype && (
            <div className="p-5 bg-brand-card border border-brand-divider rounded-xl">
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-3 flex items-center gap-2"><Brain size={12} />Personality Profile</p>
              <p className="font-heading text-xl mb-2 text-brand-secondary">{p.archetype}</p>
              {p.work_style && <p className="text-xs text-brand-muted font-sans italic mb-3">{p.work_style}</p>}
              {p.traits?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">{p.traits.map((t: string, i: number) => <Tag key={i}>{t}</Tag>)}</div>
              )}
              {p.growth_trajectory && (
                <div className="mt-3 pt-3 border-t border-brand-divider">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-1 flex items-center gap-1"><TrendingUp size={10} />Growth Trajectory</p>
                  <p className="text-xs text-brand-ink font-sans">{p.growth_trajectory}</p>
                </div>
              )}
            </div>
          )}

          {/* Communication Style */}
          {a.communication_style && (
            <div className="p-5 bg-brand-card border border-brand-divider rounded-xl">
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2 flex items-center gap-2"><MessageSquare size={12} />Communication Style</p>
              <p className="text-xs text-brand-ink font-sans leading-relaxed">{a.communication_style}</p>
            </div>
          )}

          {/* Flags */}
          {(a.green_flags?.length > 0 || a.red_flags?.length > 0) && (
            <div className="p-5 bg-brand-card border border-brand-divider rounded-xl space-y-4">
              {a.green_flags?.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-green-400 mb-2 flex items-center gap-2"><CheckCircle2 size={12} />Green Flags</p>
                  <ul className="space-y-1.5">{a.green_flags.map((f: string, i: number) => <li key={i} className="text-xs text-brand-ink font-sans flex gap-2"><span className="text-green-400 shrink-0">✓</span>{f}</li>)}</ul>
                </div>
              )}
              {a.red_flags?.length > 0 && (
                <div className="pt-4 border-t border-brand-divider">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={12} />Red Flags</p>
                  <ul className="space-y-1.5">{a.red_flags.map((f: string, i: number) => <li key={i} className="text-xs text-brand-ink font-sans flex gap-2"><span className="text-red-400 shrink-0">⚠</span>{f}</li>)}</ul>
                </div>
              )}
            </div>
          )}

          {/* Strengths */}
          {a.strengths?.length > 0 && (
            <div className="p-5 bg-brand-card border border-brand-divider rounded-xl">
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-3 flex items-center gap-2"><Star size={12} />Strengths</p>
              <ul className="space-y-1.5">{a.strengths.map((s: string, i: number) => <li key={i} className="text-xs text-brand-ink font-sans flex gap-2"><span className="text-brand-secondary shrink-0">→</span>{s}</li>)}</ul>
            </div>
          )}

          {/* Interview Questions */}
          {a.recommended_interview_questions?.length > 0 && (
            <div className="p-5 bg-brand-card border border-brand-divider rounded-xl">
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-3 flex items-center gap-2"><MessageSquare size={12} />Suggested Interview Questions</p>
              <div className="space-y-4">
                {a.recommended_interview_questions.map((q: any, i: number) => (
                  <div key={i} className="border-l-2 border-brand-secondary/30 pl-3">
                    <p className="text-xs text-brand-ink font-sans leading-relaxed font-medium">{q.question}</p>
                    <p className="text-[10px] text-brand-ghost font-sans mt-1 italic">{q.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Culture Fit + Skill Gaps */}
          {(a.culture_fit_signals?.length > 0 || a.skill_gaps?.length > 0) && (
            <div className="p-5 bg-brand-card border border-brand-divider rounded-xl space-y-4">
              {a.culture_fit_signals?.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2 flex items-center gap-2"><Users size={12} />Culture Fit Signals</p>
                  <div className="flex flex-wrap gap-1.5">{a.culture_fit_signals.map((s: string, i: number) => <Tag key={i}>{s}</Tag>)}</div>
                </div>
              )}
              {a.skill_gaps?.length > 0 && (
                <div className="pt-4 border-t border-brand-divider">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mb-2 flex items-center gap-2"><Shield size={12} />Skill Gaps</p>
                  <ul className="space-y-1">{a.skill_gaps.map((g: string, i: number) => <li key={i} className="text-xs text-brand-muted font-sans flex gap-2"><span>·</span>{g}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
