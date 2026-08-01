import React from 'react';

export default function MinimalistTemplate({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="bg-white text-black p-8 font-sans w-[210mm] min-h-[297mm] shadow-xl mx-auto" style={{ boxSizing: 'border-box' }}>
      {/* Header */}
      <header className="text-center mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.contact_info?.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          {data.contact_info?.email && <span>{data.contact_info.email}</span>}
          {data.contact_info?.phone && <span>• {data.contact_info.phone}</span>}
          {data.contact_info?.location && <span>• {typeof data.contact_info.location === 'object' ? [data.contact_info.location.city, data.contact_info.location.state].filter(Boolean).join(', ') : data.contact_info.location}</span>}
          {data.contact_info?.linkedin && <span>• {data.contact_info.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <p className="text-sm leading-relaxed text-gray-800">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-900 border-b border-gray-200 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-800">{exp.role}</h3>
                  <span className="text-sm text-gray-600">{exp.start_date} - {exp.end_date}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2 text-sm text-gray-600">
                  <span className="font-medium italic">{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700">
                  {exp.bullet_points?.map((bullet: string, j: number) => (
                    <li key={j} className="pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-900 border-b border-gray-200 pb-1">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-800">{proj.name}</h3>
                  <span className="text-xs text-gray-500">{proj.technologies?.join(', ')}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-900 border-b border-gray-200 pb-1">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-gray-800">{edu.institution}</h3>
                  <div className="text-sm text-gray-600">{edu.degree} in {edu.field_of_study}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{edu.start_date} - {edu.end_date}</div>
                  {edu.gpa && <div className="text-xs text-gray-500">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && (
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-gray-900 border-b border-gray-200 pb-1">Skills</h2>
          <div className="text-sm text-gray-700 space-y-1">
            {data.skills.languages && data.skills.languages.length > 0 && (
              <div><span className="font-bold">Languages:</span> {data.skills.languages.join(', ')}</div>
            )}
            {data.skills.frameworks && data.skills.frameworks.length > 0 && (
              <div><span className="font-bold">Frameworks:</span> {data.skills.frameworks.join(', ')}</div>
            )}
            {data.skills.tools && data.skills.tools.length > 0 && (
              <div><span className="font-bold">Tools:</span> {data.skills.tools.join(', ')}</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
