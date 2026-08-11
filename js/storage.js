/* ============================================
   Yeni Pro CV — Local Storage Management
   ============================================ */

const Storage = {
  KEY_RESUMES: 'rf_resumes',
  KEY_CURRENT: 'rf_current_id',
  KEY_SETTINGS: 'rf_settings',

  createEmptyResume(title = 'Untitled Resume') {
    return {
      id: Utils.uid(),
      title,
      template: 'modern',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      personal: {
        fullName: '', title: '', email: '', phone: '', location: '',
        website: '', linkedin: '', github: '', summary: '', photo: null, photoShape: 'circle'
      },
      experience: [], education: [], skills: [], projects: [], certifications: [], languages: [],
      awards: [], volunteer: [], publications: [], interests: [], references: [], achievements: [],
      customization: {
        accentColor: '#0d9488', font: 'Inter', fontSize: 'medium',
        spacing: 'normal', layout: 'one-column', skillsDisplay: 'text'
      },
      sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','awards','volunteer','publications','interests','references','achievements'],
      enabledSections: {
        summary: true, experience: true, education: true, skills: true, projects: true,
        certifications: true, languages: true, awards: false, volunteer: false,
        publications: false, interests: false, references: false, achievements: false
      }
    };
  },

  getSampleResume() {
    const r = this.createEmptyResume('Software Developer Resume');
    r.personal = {
      fullName: 'Menelik Admasu', title: 'Full Stack Developer',
      email: 'menelik@example.com', phone: '+251 911 123 456',
      location: 'Bahir Dar, Ethiopia', website: 'https://menelik.dev',
      linkedin: 'linkedin.com/in/menelik', github: 'github.com/menelik',
      summary: 'Passionate Full Stack Developer with 4+ years of experience building scalable web applications.',
      photo: null, photoShape: 'circle'
    };
    r.experience = [
      { id: Utils.uid(), jobTitle: 'Senior Full Stack Developer', company: 'TechNova Solutions', location: 'Addis Ababa, Ethiopia', startDate: '2022-03', endDate: '', current: true, description: '• Led SaaS platform for 50k+ users\n• Architected microservices with Node.js and React' },
      { id: Utils.uid(), jobTitle: 'Frontend Developer', company: 'Digital Agency X', location: 'Remote', startDate: '2020-01', endDate: '2022-02', current: false, description: '• Built responsive apps with React and TypeScript' }
    ];
    r.education = [
      { id: Utils.uid(), degree: 'B.Sc. Computer Science', institution: 'Bahir Dar University', location: 'Bahir Dar, Ethiopia', gpa: '3.8 / 4.0', startDate: '2016-09', endDate: '2020-06', description: 'Graduated with distinction.' }
    ];
    r.skills = [
      { id: Utils.uid(), name: 'JavaScript', level: 'Expert' },
      { id: Utils.uid(), name: 'React', level: 'Advanced' },
      { id: Utils.uid(), name: 'Node.js', level: 'Advanced' },
      { id: Utils.uid(), name: 'HTML/CSS', level: 'Expert' }
    ];
    r.languages = [
      { id: Utils.uid(), name: 'Amharic', level: 'Native' },
      { id: Utils.uid(), name: 'English', level: 'Fluent' }
    ];
    return r;
  },

  getAllResumes() {
    try { return JSON.parse(localStorage.getItem(this.KEY_RESUMES) || '[]'); } catch { return []; }
  },
  saveAllResumes(list) { localStorage.setItem(this.KEY_RESUMES, JSON.stringify(list)); },
  getResume(id) { return this.getAllResumes().find(r => r.id === id) || null; },
  saveResume(resume) {
    resume.updatedAt = new Date().toISOString();
    const list = this.getAllResumes();
    const idx = list.findIndex(r => r.id === resume.id);
    if (idx >= 0) list[idx] = resume; else list.unshift(resume);
    this.saveAllResumes(list);
    this.setCurrentId(resume.id);
    return resume;
  },
  deleteResume(id) {
    this.saveAllResumes(this.getAllResumes().filter(r => r.id !== id));
    if (this.getCurrentId() === id) localStorage.removeItem(this.KEY_CURRENT);
  },
  duplicateResume(id) {
    const original = this.getResume(id);
    if (!original) return null;
    const copy = Utils.clone(original);
    copy.id = Utils.uid();
    copy.title = original.title + ' (Copy)';
    copy.createdAt = copy.updatedAt = new Date().toISOString();
    this.saveResume(copy);
    return copy;
  },
  getCurrentId() { return localStorage.getItem(this.KEY_CURRENT); },
  setCurrentId(id) { localStorage.setItem(this.KEY_CURRENT, id); },
  exportJSON(resume) {
    Utils.downloadFile(JSON.stringify(resume, null, 2), `${(resume.title || 'resume').replace(/\s+/g, '_')}.json`, 'application/json');
  },
  async importJSON(file) {
    const data = JSON.parse(await Utils.readFile(file));
    if (!data.id) data.id = Utils.uid();
    data.updatedAt = new Date().toISOString();
    if (!data.createdAt) data.createdAt = data.updatedAt;
    this.saveResume(data);
    return data;
  }
};

window.Storage = Storage;
