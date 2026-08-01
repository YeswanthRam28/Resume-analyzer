import React from 'react';

export default function ModernTemplate({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="bg-white text-gray-800 font-sans w-[210mm] min-h-[297mm] shadow-xl mx-auto flex" style={{ boxSizing: 'border-box' }}>
      
      {/* Left Sidebar */}
      <div className="w-1/3 bg-slate-800 text-white p-6 flex flex-col">
        <div className="mb-8 border-b border-slate-600 pb-6">
          <h1 className="text-3xl font-bold leading-tight mb-2 text-white">{data.contact_info?.name || 'Your Name'}</h1>
          <p className="text-slate-300 uppercase tracking-widest text-xs font-semibold">{data.target_role || 'Professional'}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-bold">Contact</h2>
          <div className="space-y-3 text-sm text-slate-200">
            {data.contact_info?.email && <div>{data.contact_info.email}</div>}
            {data.contact_info?.phone && <div>{data.contact_info.phone}</div>}
            {data.contact_info?.location && <div>{typeof data.contact_info.location === 'object' ? [data.contact_info.location.city, data.contact_info.location.state].filter(Boolean).join(', ') : data.contact_info.location}</div>}
            {data.contact_info?.linkedin && <div className="truncate">{data.contact_info.linkedin}</div>}
            {data.contact_info?.github && <div className="truncate">{data.contact_info.github}</div>}
          </div>
        </div>

        {data.skills && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-bold">Skills</h2>
            <div className="space-y-4 text-sm">
              {data.skills.languages && data.skills.languages.length > 0 && (
                <div>
                  <h3 className="text-slate-300 mb-1">Languages</h3>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.languages.map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.frameworks && data.skills.frameworks.length > 0 && (
                <div>
                  <h3 className="text-slate-300 mb-1">Frameworks</h3>
                  <div className="flex flex-wrap gap-1">
                    {data.skills.frameworks.map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-4 font-bold">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu: any, i: number) => (
                <div key={i} className="text-sm">
                  <div className="font-bold text-white">{edu.degree}</div>
                  <div className="text-slate-300">{edu.field_of_study}</div>
                  <div className="text-slate-400 text-xs mt-1">{edu.institution}</div>
                  <div className="text-slate-500 text-xs">{edu.start_date} - {edu.end_date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8 bg-gray-50">
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-3 border-b-2 border-blue-500 inline-block pb-1">Profile</h2>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-4 border-b-2 border-blue-500 inline-block pb-1">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((exp: any, i: number) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-gray-50" />
                  <h3 className="font-bold text-slate-800 text-base">{exp.role}</h3>
                  <div className="text-sm text-blue-600 font-medium mb-1">{exp.company} | <span className="text-slate-500 font-normal">{exp.start_date} - {exp.end_date}</span></div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-600 mt-2">
                    {exp.bullet_points?.map((bullet: string, j: number) => (
                      <li key={j} className="pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-4 border-b-2 border-blue-500 inline-block pb-1">Projects</h2>
            <div className="space-y-5">
              {data.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    {proj.name} 
                    {proj.link && <span className="text-xs font-normal text-blue-500">[{proj.link}]</span>}
                  </h3>
                  <div className="text-xs text-slate-500 mb-1">{proj.technologies?.join(' • ')}</div>
                  <p className="text-sm text-gray-600">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
