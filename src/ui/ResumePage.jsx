import React from 'react'
import {
  profile,
  careerJourney,
  credentialsShelf,
  educationList,
  toolsMatrix,
  projectsCatalog,
} from '../data/karthik.js'

export default function ResumePage({ setActivePage }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#FBF9F5] text-[#141312]">
      {/* ── PAGE HEADER ── */}
      <section className="w-full max-w-[1000px] pt-28 sm:pt-36 pb-8 px-6 sm:px-10 flex flex-col items-center text-center gap-3">
        <span className="section-kicker">
          [ CURRICULUM VITAE ]
        </span>
        <h1 className="font-notch text-[36px] sm:text-[50px] md:text-[62px] leading-[1.06] font-extrabold tracking-tight text-[#141312]">
          sure, let's <span className="font-editorial italic font-normal text-[#141312]">keep it</span> <span className="text-[#E03E2D]">formal</span>.
        </h1>
        <p className="font-headline text-[15px] sm:text-[16.5px] text-[#5C574F] max-w-[620px] leading-relaxed">
          Official professional record, enterprise track record, cloud certifications, and technical proficiencies.
        </p>
        <div className="pt-3 flex gap-3">
          <button
            onClick={handlePrint}
            className="btn-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </section>

      {/* ── RESUME PAPER DOCUMENT CARD ── */}
      <section className="w-full max-w-[960px] py-6 pb-28 px-4 sm:px-6">
        <div className="bg-white border border-[#E5DFD5] rounded-[28px] p-8 sm:p-14 shadow-[0_12px_40px_rgba(20,19,18,0.05)] flex flex-col gap-9">
          
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5DFD5] pb-6">
            <div>
              <h2 className="font-notch text-[32px] sm:text-[40px] font-bold text-[#141312] leading-tight">
                {profile.name}
              </h2>
              <p className="font-headline text-[17px] font-semibold text-[#E03E2D] mt-0.5">
                {profile.role}
              </p>
              <p className="font-headline text-[13px] text-[#8C857B] mt-1">
                {profile.location} • {profile.status}
              </p>
            </div>
            <div className="flex flex-col gap-1 font-headline text-[13px] text-[#5C574F] sm:text-right">
              <a href={`mailto:${profile.contact.email}`} className="hover:text-[#E03E2D] transition-colors">{profile.contact.email}</a>
              <a href={`tel:${profile.contact.phone}`} className="hover:text-[#E03E2D] transition-colors">{profile.contact.phone}</a>
              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#E03E2D] transition-colors">{profile.contact.linkedinDisplay}</a>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="flex flex-col gap-2">
            <h3 className="font-notch text-[15px] uppercase tracking-wider font-bold text-[#141312] border-b border-[#E5DFD5] pb-1.5">
              Professional Summary
            </h3>
            <p className="font-headline text-[14px] leading-[25px] text-[#5C574F] pt-1">
              Azure Data Engineer with <strong className="text-[#141312]">2+ years of experience</strong> designing scalable data pipelines and lakehouse solutions using Databricks, PySpark, SQL, Delta Lake, and Kafka. Proven expertise in ETL optimization, real-time event streaming, and automated enterprise migrations. Certified by Microsoft and Databricks.
            </p>
          </div>

          {/* Certifications & Honors */}
          <div className="flex flex-col gap-3">
            <h3 className="font-notch text-[15px] uppercase tracking-wider font-bold text-[#141312] border-b border-[#E5DFD5] pb-1.5">
              Certifications & Honors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {credentialsShelf.map((cred) => (
                <div key={cred.id} className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] flex flex-col gap-1">
                  <span className="font-headline text-[14px] font-bold text-[#141312]">{cred.title}</span>
                  <span className="text-[12px] font-headline text-[#E03E2D] font-semibold">{cred.subtitle}</span>
                  <p className="text-[12px] font-headline text-[#5C574F] mt-1 leading-relaxed">{cred.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="flex flex-col gap-3">
            <h3 className="font-notch text-[15px] uppercase tracking-wider font-bold text-[#141312] border-b border-[#E5DFD5] pb-1.5">
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] font-headline">
              {toolsMatrix.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-bold text-[#141312]">{item.category}:</span>
                  <span className="text-[#5C574F]">{item.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="flex flex-col gap-4">
            <h3 className="font-notch text-[15px] uppercase tracking-wider font-bold text-[#141312] border-b border-[#E5DFD5] pb-1.5">
              Professional Experience
            </h3>
            {careerJourney.map((job, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h4 className="font-headline text-[15px] font-bold text-[#141312]">
                      {job.role} — <span className="text-[#E03E2D]">{job.company}</span>
                    </h4>
                    <span className="text-[12px] text-[#8C857B]">{job.location}</span>
                  </div>
                  <span className="font-mono text-[12px] font-semibold text-[#141312]">{job.period}</span>
                </div>
                <ul className="list-disc list-outside pl-5 flex flex-col gap-1.5 font-headline text-[13px] text-[#5C574F] leading-relaxed">
                  {job.achievements.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects & Production Engineering */}
          <div className="flex flex-col gap-4">
            <h3 className="font-notch text-[15px] uppercase tracking-wider font-bold text-[#141312] border-b border-[#E5DFD5] pb-1.5">
              Key Projects & Engineering Works
            </h3>
            <div className="flex flex-col gap-5">
              {projectsCatalog.map((proj) => (
                <div key={proj.id} className="flex flex-col gap-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4 className="font-headline text-[15px] font-bold text-[#141312]">
                      {proj.name}
                    </h4>
                    <span className="text-[12px] font-mono text-[#8C857B]">
                      {proj.stack.join(', ')}
                    </span>
                  </div>
                  <ul className="list-disc list-outside pl-5 flex flex-col gap-1 font-headline text-[13px] text-[#5C574F] leading-relaxed">
                    {proj.points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="flex flex-col gap-3">
            <h3 className="font-notch text-[15px] uppercase tracking-wider font-bold text-[#141312] border-b border-[#E5DFD5] pb-1.5">
              Education
            </h3>
            <div className="flex flex-col gap-3">
              {educationList.map((edu, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                  <div>
                    <h4 className="font-headline text-[14px] font-bold text-[#141312]">{edu.degree}</h4>
                    <span className="text-[12px] text-[#5C574F]">{edu.institution} • {edu.location}</span>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="font-mono text-[12px] font-semibold text-[#141312] block">{edu.period}</span>
                    <span className="font-headline text-[12px] font-bold text-[#E03E2D]">{edu.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
