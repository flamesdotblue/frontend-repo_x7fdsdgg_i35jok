import React, { useEffect, useRef, useState } from 'react';
import { Rocket, User, Mail, Phone, Link as LinkIcon, Upload } from 'lucide-react';
import Hero3D from './components/Hero3D';
import TextAreaWithCounter from './components/TextAreaWithCounter';
import SkillChips from './components/SkillChips';
import LogoSelector from './components/LogoSelector';

const Section = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition ring-1 ring-white/10">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
    </div>
    <div className="grid gap-4">{children}</div>
  </section>
);

const useDebouncedLocalStorage = (key, value, delay = 200) => {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    }, delay);
    return () => clearTimeout(t);
  }, [key, value, delay]);
};

const loadState = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  personal: { name: '', photo: null },
  contact: {
    personalEmail: '',
    officialEmail: '',
    phone: '',
    linkedin: '',
    github: '',
    leetcode: '',
    hackerrank: '',
  },
  education: {
    btech: { specialization: '', year: '', gpa: '' },
    twelfth: { board: '', year: '', percentage: '', school: '' },
    tenth: { board: '', year: '', percentage: '', school: '' },
  },
  skills: {
    languages: [],
    web: [],
    databases: [],
    tools: [],
    others: '',
  },
  projects: [
    { title: '', tech: '', desc: '' },
    { title: '', tech: '', desc: '' },
    { title: '', tech: '', desc: '' },
  ],
  internship: { title: '', company: '', duration: '', desc: '' },
  certs: [
    { name: '', link: '', addLink: false },
    { name: '', link: '', addLink: false },
    { name: '', link: '', addLink: false },
  ],
  achieves: [
    { text: '', link: '' },
    { text: '', link: '' },
    { text: '', link: '' },
  ],
  qr: { portfolio: null, video: null },
  logos: [],
};

const LANGS = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go'];
const WEB = ['HTML', 'CSS', 'Tailwind', 'React', 'Node.js', 'Express', 'Next.js'];
const DBS = ['MySQL', 'MongoDB', 'PostgreSQL', 'SQLite', 'Redis'];
const TOOLS = ['Git', 'GitHub', 'VS Code', 'Docker', 'Postman', 'Figma'];

const isHttps = (url) => !url || /^https:\/\//.test(url);
const inputCls = 'w-full rounded-lg border border-white/20 bg-white/10 p-2.5 text-white placeholder-white/50 outline-none backdrop-blur-md focus:ring-2 focus:ring-blue-400/60';

export default function App() {
  const [data, setData] = useState(() => loadState('resume-data', initialState));
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  useDebouncedLocalStorage('resume-data', data, 200);

  const update = (path, value) => {
    setData((prev) => {
      const next = structuredClone(prev);
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  const onFile = (path, file) => {
    if (!file) return update(path, null);
    const okTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!okTypes.includes(file.type)) {
      alert('Only JPG/PNG images are allowed.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update(path, reader.result);
    reader.readAsDataURL(file);
  };

  const toggleSkill = (key, item) => {
    setData((prev) => {
      const set = new Set(prev.skills[key]);
      set.has(item) ? set.delete(item) : set.add(item);
      return { ...prev, skills: { ...prev.skills, [key]: Array.from(set) } };
    });
  };

  const toggleLogo = (name) => {
    setData((prev) => {
      const set = new Set(prev.logos);
      if (set.has(name)) set.delete(name);
      else if (set.size < 4) set.add(name);
      return { ...prev, logos: Array.from(set) };
    });
  };

  const addRow = (key, empty, max = 5) => {
    setData((prev) => {
      const arr = [...prev[key]];
      if (arr.length < max) arr.push(empty);
      return { ...prev, [key]: arr };
    });
  };

  const validate = () => {
    const e = {};
    if (!data.personal.name) e.name = 'Name is required';
    if (!data.personal.photo) e.photo = 'Profile photo is required';
    // Projects 3 required 10–30 words
    data.projects.slice(0, 3).forEach((p, i) => {
      const w = (p.desc || '').trim().split(/\s+/).filter(Boolean).length;
      if (!p.title || !p.tech || w < 10 || w > 30) e[`project${i}`] = 'Each project needs title, tech and 10–30 word description';
    });
    // Internship 10–40
    const wI = (data.internship.desc || '').trim().split(/\s+/).filter(Boolean).length;
    if (data.internship.desc && (wI < 10 || wI > 40)) e.intern = 'Internship description must be 10–40 words';

    // Links https only
    const linkFields = [
      data.contact.linkedin,
      data.contact.github,
      data.contact.leetcode,
      data.contact.hackerrank,
      ...data.certs.filter((c) => c.addLink).map((c) => c.link),
      ...data.achieves.map((a) => a.link).filter(Boolean),
    ];
    if (linkFields.some((u) => u && !isHttps(u))) e.links = 'All links must start with https://';

    if (data.logos.length !== 4) e.logos = 'Select exactly 4 logos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const generate = () => {
    if (!validate()) {
      // focus first error
      const el = formRef.current?.querySelector('[data-error="true"] input, [data-error="true"] textarea');
      if (el) el.focus();
      return;
    }
    // Fallback to browser print for now (html2pdf can be integrated later)
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1E2A5E] via-indigo-800 to-blue-800 text-white">
      <Hero3D />

      <main className="mx-auto max-w-6xl px-6 pb-36 md:px-10 lg:px-16">
        <div ref={formRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Personal Info */}
          <Section title="Personal Info" subtitle="Your name and profile photo">
            <div className={`grid grid-cols-1 gap-4 ${errors.name || errors.photo ? 'ring-1 ring-[#ef4444]/50 rounded-xl p-3 -m-3' : ''}`} data-error={Boolean(errors.name || errors.photo)}>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-white/70" />
                <input
                  type="text"
                  aria-label="Full Name"
                  placeholder="Full Name"
                  value={data.personal.name}
                  onChange={(e) => update(['personal', 'name'], e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/80">Profile Photo (JPG/PNG, white background)</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/20">
                    {data.personal.photo ? (
                      <img src={data.personal.photo} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/10 text-xs text-white/60">No image</div>
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm backdrop-blur-md transition hover:bg-white/15">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFile(['personal', 'photo'], e.target.files?.[0])}
                    />
                  </label>
                </div>
                {errors.photo && <p className="mt-1 text-xs text-[#ef4444]">{errors.photo}</p>}
              </div>
            </div>
          </Section>

          {/* Contact Info */}
          <Section title="Contact Info" subtitle="Emails, phone and profiles">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputRow icon={<Mail className="h-4 w-4" />} placeholder="Personal Email" value={data.contact.personalEmail} onChange={(v) => update(['contact', 'personalEmail'], v)} />
              <InputRow icon={<Mail className="h-4 w-4" />} placeholder="Official Email" value={data.contact.officialEmail} onChange={(v) => update(['contact', 'officialEmail'], v)} />
              <InputRow icon={<Phone className="h-4 w-4" />} placeholder="Phone" value={data.contact.phone} onChange={(v) => update(['contact', 'phone'], v)} />
              <InputRow icon={<LinkIcon className="h-4 w-4" />} placeholder="LinkedIn (https://)" value={data.contact.linkedin} onChange={(v) => update(['contact', 'linkedin'], v)} invalid={data.contact.linkedin && !isHttps(data.contact.linkedin)} />
              <InputRow icon={<LinkIcon className="h-4 w-4" />} placeholder="GitHub (https://)" value={data.contact.github} onChange={(v) => update(['contact', 'github'], v)} invalid={data.contact.github && !isHttps(data.contact.github)} />
              <InputRow icon={<LinkIcon className="h-4 w-4" />} placeholder="LeetCode (https://)" value={data.contact.leetcode} onChange={(v) => update(['contact', 'leetcode'], v)} invalid={data.contact.leetcode && !isHttps(data.contact.leetcode)} />
              <InputRow icon={<LinkIcon className="h-4 w-4" />} placeholder="HackerRank (https://)" value={data.contact.hackerrank} onChange={(v) => update(['contact', 'hackerrank'], v)} invalid={data.contact.hackerrank && !isHttps(data.contact.hackerrank)} />
            </div>
            {errors.links && <p className="text-xs text-[#ef4444]">{errors.links}</p>}
          </Section>

          {/* Education */}
          <Section title="Education" subtitle="B.Tech, 12th & 10th">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white/90">B.Tech (required)</h4>
                <input className={inputCls} placeholder="Specialization" value={data.education.btech.specialization} onChange={(e) => update(['education', 'btech', 'specialization'], e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputCls} placeholder="Year" value={data.education.btech.year} onChange={(e) => update(['education', 'btech', 'year'], e.target.value)} />
                  <input className={inputCls} placeholder="GPA" value={data.education.btech.gpa} onChange={(e) => update(['education', 'btech', 'gpa'], e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white/90">12th</h4>
                <input className={inputCls} placeholder="Board" value={data.education.twelfth.board} onChange={(e) => update(['education', 'twelfth', 'board'], e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputCls} placeholder="Year" value={data.education.twelfth.year} onChange={(e) => update(['education', 'twelfth', 'year'], e.target.value)} />
                  <input className={inputCls} placeholder="Percentage" value={data.education.twelfth.percentage} onChange={(e) => update(['education', 'twelfth', 'percentage'], e.target.value)} />
                </div>
                <input className={inputCls} placeholder="School/College" value={data.education.twelfth.school} onChange={(e) => update(['education', 'twelfth', 'school'], e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <h4 className="text-sm font-semibold text-white/90">10th</h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                  <input className={inputCls} placeholder="Board" value={data.education.tenth.board} onChange={(e) => update(['education', 'tenth', 'board'], e.target.value)} />
                  <input className={inputCls} placeholder="Year" value={data.education.tenth.year} onChange={(e) => update(['education', 'tenth', 'year'], e.target.value)} />
                  <input className={inputCls} placeholder="Percentage" value={data.education.tenth.percentage} onChange={(e) => update(['education', 'tenth', 'percentage'], e.target.value)} />
                  <input className={inputCls} placeholder="School/College" value={data.education.tenth.school} onChange={(e) => update(['education', 'tenth', 'school'], e.target.value)} />
                </div>
              </div>
            </div>
          </Section>

          {/* Technical Skills */}
          <Section title="Technical Skills" subtitle="Click chips to select">
            <div className="space-y-4">
              <SkillChips title="Languages" options={LANGS} selected={data.skills.languages} onToggle={(v) => toggleSkill('languages', v)} otherValue={data.skills.others} onOtherChange={(v) => update(['skills', 'others'], v)} />
              <SkillChips title="Web Technologies" options={WEB} selected={data.skills.web} onToggle={(v) => toggleSkill('web', v)} otherValue={''} onOtherChange={() => {}} />
              <SkillChips title="Databases" options={DBS} selected={data.skills.databases} onToggle={(v) => toggleSkill('databases', v)} otherValue={''} onOtherChange={() => {}} />
              <SkillChips title="Tools" options={TOOLS} selected={data.skills.tools} onToggle={(v) => toggleSkill('tools', v)} otherValue={''} onOtherChange={() => {}} />
            </div>
          </Section>

          {/* Academic Projects */}
          <Section title="Academic Projects" subtitle="3 required (10–30 words)">
            <div className="space-y-5">
              {data.projects.map((p, idx) => (
                <div key={idx} className={`rounded-xl border p-3 ${errors[`project${idx}`] ? 'border-[#ef4444]/60' : 'border-white/20'} bg-white/5`} data-error={Boolean(errors[`project${idx}`])}>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <input className={inputCls} placeholder="Project Title" value={p.title} onChange={(e) => update(['projects', idx, 'title'], e.target.value)} />
                    <input className={`${inputCls} md:col-span-2`} placeholder="Technologies" value={p.tech} onChange={(e) => update(['projects', idx, 'tech'], e.target.value)} />
                  </div>
                  <div className="mt-2">
                    <TextAreaWithCounter
                      id={`proj-${idx}`}
                      label="Description"
                      value={p.desc}
                      onChange={(v) => update(['projects', idx, 'desc'], v)}
                      minWords={10}
                      maxWords={30}
                      placeholder="Briefly describe the project impact, your role and the outcome."
                    />
                  </div>
                </div>
              ))}
              {data.projects.length < 5 && (
                <button type="button" onClick={() => addRow('projects', { title: '', tech: '', desc: '' }, 5)} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm backdrop-blur-md transition hover:bg-white/15">
                  + Add another project
                </button>
              )}
            </div>
          </Section>

          {/* Internship/Training */}
          <Section title="Internship/Training" subtitle="10–40 words description">
            <div className={`space-y-3 ${errors.intern ? 'ring-1 ring-[#ef4444]/50 rounded-xl p-3 -m-3' : ''}`} data-error={Boolean(errors.intern)}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input className={inputCls} placeholder="Job Title" value={data.internship.title} onChange={(e) => update(['internship', 'title'], e.target.value)} />
                <input className={inputCls} placeholder="Company" value={data.internship.company} onChange={(e) => update(['internship', 'company'], e.target.value)} />
                <input className={inputCls} placeholder="Duration" value={data.internship.duration} onChange={(e) => update(['internship', 'duration'], e.target.value)} />
              </div>
              <TextAreaWithCounter
                id="intern-desc"
                label="Description"
                value={data.internship.desc}
                onChange={(v) => update(['internship', 'desc'], v)}
                minWords={10}
                maxWords={40}
                placeholder="Summarize what you did and learned."
              />
            </div>
          </Section>

          {/* Certifications */}
          <Section title="Certifications" subtitle="3 required (up to 5)">
            <div className="space-y-3">
              {data.certs.map((c, idx) => (
                <div key={idx} className="grid grid-cols-1 items-start gap-2 md:grid-cols-3">
                  <input className={`${inputCls} md:col-span-2`} placeholder="Certification Name" value={c.name} onChange={(e) => update(['certs', idx, 'name'], e.target.value)} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={c.addLink} onChange={(e) => update(['certs', idx, 'addLink'], e.target.checked)} />
                    <span>Add Link</span>
                  </label>
                  {c.addLink && (
                    <input className={`${inputCls} md:col-span-3 ${c.link && !isHttps(c.link) ? 'ring-2 ring-[#ef4444]/60' : ''}`} placeholder="https://certificate-link" value={c.link} onChange={(e) => update(['certs', idx, 'link'], e.target.value)} />
                  )}
                </div>
              ))}
              {data.certs.length < 5 && (
                <button type="button" onClick={() => addRow('certs', { name: '', link: '', addLink: false }, 5)} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm backdrop-blur-md transition hover:bg-white/15">
                  + Add certification
                </button>
              )}
            </div>
          </Section>

          {/* Achievements/Participations */}
          <Section title="Achievements/Participations" subtitle="3 required (up to 5)">
            <div className="space-y-3">
              {data.achieves.map((a, idx) => (
                <div key={idx} className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  <input className={`${inputCls} md:col-span-2`} placeholder="Achievement" value={a.text} onChange={(e) => update(['achieves', idx, 'text'], e.target.value)} />
                  <input className={`${inputCls} ${a.link && !isHttps(a.link) ? 'ring-2 ring-[#ef4444]/60' : ''}`} placeholder="Optional link (https://)" value={a.link} onChange={(e) => update(['achieves', idx, 'link'], e.target.value)} />
                </div>
              ))}
              {data.achieves.length < 5 && (
                <button type="button" onClick={() => addRow('achieves', { text: '', link: '' }, 5)} className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm backdrop-blur-md transition hover:bg-white/15">
                  + Add achievement
                </button>
              )}
            </div>
          </Section>

          {/* Portfolio & Video Resume */}
          <Section title="Portfolio & Video Resume" subtitle="Upload 2 QR images">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm">Portfolio QR</label>
                <UploadTile image={data.qr.portfolio} onFile={(file) => onFile(['qr', 'portfolio'], file)} />
              </div>
              <div>
                <label className="mb-2 block text-sm">Video Resume QR</label>
                <UploadTile image={data.qr.video} onFile={(file) => onFile(['qr', 'video'], file)} />
              </div>
            </div>
          </Section>

          {/* Logo Selection */}
          <Section title="Logo Selection" subtitle="Choose exactly 4 logos">
            <LogoSelector selected={data.logos} onToggle={toggleLogo} />
            {errors.logos && <p className="mt-2 text-xs text-[#ef4444]">{errors.logos}</p>}
          </Section>
        </div>

        <div className="sticky bottom-6 mt-10 flex w-full justify-center">
          <button
            type="button"
            onClick={generate}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#10b981] to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
          >
            <Rocket className="h-4 w-4 transition group-hover:translate-x-0.5" />
            Generate Resume
          </button>
        </div>
      </main>
    </div>
  );
}

const InputRow = ({ icon, placeholder, value, onChange, invalid }) => (
  <div className="flex items-center gap-2">
    <span className="text-white/70" aria-hidden>
      {icon}
    </span>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} flex-1 ${invalid ? 'ring-2 ring-[#ef4444]/60' : ''}`}
      aria-invalid={invalid ? 'true' : 'false'}
    />
  </div>
);

const UploadTile = ({ image, onFile }) => (
  <label className="flex h-32 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/30 bg-white/5 p-3 text-sm text-white/80 backdrop-blur-md transition hover:bg-white/10">
    {image ? (
      <img src={image} alt="Uploaded" className="h-full w-full rounded-md object-contain" />
    ) : (
      <div className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload JPG/PNG</div>
    )}
    <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
  </label>
);
