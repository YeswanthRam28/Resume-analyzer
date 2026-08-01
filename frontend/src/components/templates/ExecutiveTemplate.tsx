import React from 'react';

export default function ExecutiveTemplate({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="bg-[#FAF9F6] text-[#2C3E50] font-serif w-[210mm] min-h-[297mm] shadow-xl mx-auto p-10" style={{ boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header className="text-center mb-8 border-b-4 border-[#34495E] pb-6">
        <h1 className="text-4xl font-extrabold uppercase tracking-widest mb-3 text-[#2C3E50]">{data.contact_info?.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-[#7F8C8D] font-sans">
          {data.contact_info?.email && <span>{data.contact_info.email}</span>}
          {data.contact_info?.phone && <span>| {data.contact_info.phone}</span>}
          {data.contact_info?.location && <span>| {typeof data.contact_info.location === 'object' ? [data.contact_info.location.city, data.contact_info.location.state].filter(Boolean).join(', ') : data.contact_info.location}</span>}
          {data.contact_info?.linkedin && <span>| {data.contact_info.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-[#34495E] font-medium text-justify">{data.summary}</p>
        </section>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-[#2C3E50] border-b border-[#BDC3C7] pb-1">Professional Experience</h2>
          <div className="space-y-6">
            {data.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-[#2C3E50] text-lg uppercase">{exp.company}</h3>
                  <span className="text-sm font-sans text-[#7F8C8D]">{exp.location}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="italic text-[#34495E] font-semibold">{exp.role}</h4>
                  <span className="text-sm font-sans text-[#7F8C8D]">{exp.start_date} - {exp.end_date}</span>
                </div>
                <ul className="list-square list-outside ml-5 space-y-1 text-sm text-[#34495E] font-sans">
                  {exp.bullet_points?.map((bullet: string, j: number) => (
                    <li key={j} className="pl-2">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-[#2C3E50] border-b border-[#BDC3C7] pb-1">Key Initiatives</h2>
          <div className="space-y-4 font-sans">
            {data.projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="font-bold text-[#2C3E50] mb-1">{proj.name}</div>
                <p className="text-sm text-[#34495E] leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Credentials */}
      {data.education && data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-[#2C3E50] border-b border-[#BDC3C7] pb-1">Education & Credentials</h2>
          <div className="space-y-3 font-sans">
            {data.education.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-[#2C3E50]">{edu.degree} in {edu.field_of_study}</span>, <span className="italic text-[#34495E]">{edu.institution}</span>
                </div>
                <div className="text-sm text-[#7F8C8D]">
                  {edu.end_date}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {data.skills && (
        <section>
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-[#2C3E50] border-b border-[#BDC3C7] pb-1">Core Competencies</h2>
          <div className="text-sm text-[#34495E] font-sans">
            <div className="grid grid-cols-2 gap-2">
              {data.skills.languages && data.skills.languages.map((s:string) => <div key={s}>• {s}</div>)}
              {data.skills.frameworks && data.skills.frameworks.map((s:string) => <div key={s}>• {s}</div>)}
              {data.skills.tools && data.skills.tools.map((s:string) => <div key={s}>• {s}</div>)}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
