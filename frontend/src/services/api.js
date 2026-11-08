import axios from 'axios';

// Backend base URL (without trailing slash)
export const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const BASE = `${BACKEND_URL}/api`;

// ── Image / File URL Resolver ────────────────────────────────────────────────
// Safely resolves uploaded images/files, external URLs, or relative assets
export const getUploadUrl = (src) => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }
  const cleanPath = src.startsWith('/') ? src : `/${src}`;
  return `${BACKEND_URL}${cleanPath}`;
};

// ── Axios instances ───────────────────────────────────────────────────────────
export const publicApi = axios.create({ baseURL: `${BASE}/public` });
export const adminApi  = axios.create({ baseURL: `${BASE}/admin` });
export const authApi   = axios.create({ baseURL: `${BASE}/auth` });

// Attach JWT on every admin request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const auth = {
  login: (credentials) => authApi.post('/login', credentials),
};

// ── Public helpers ────────────────────────────────────────────────────────────
export const pub = {
  // Add timestamp to bust any browser/CDN cache so social links update immediately
  getProfile:        () => publicApi.get(`/profile?_=${Date.now()}`),
  getProjects:       () => publicApi.get('/projects'),
  getSkills:         () => publicApi.get('/skills'),
  getExperience:     () => publicApi.get('/experience'),
  getEducation:      () => publicApi.get('/education'),
  getCertifications: () => publicApi.get('/certifications'),
  getAchievements:   () => publicApi.get('/achievements'),
  getLabs:           () => publicApi.get('/labs'),
  getCV:             () => publicApi.get('/cv'),
  downloadCVUrl:     `${BASE}/public/cv/download`,
  getStats:          () => publicApi.get('/stats'),
  contact:           (data) => publicApi.post('/contact', data),
  aiChat:            (msg)  => publicApi.post('/ai-chat', { message: msg }),
};

export const CV_DOWNLOAD_URL   = `${BASE}/public/cv/download`;
export const CV_DOWNLOAD_PROXY = `${BASE}/public/cv/download`;
export const UPLOADS_PROXY     = `${BACKEND_URL}/uploads`;
export const UPLOADS           = `${BACKEND_URL}/uploads`;

// ── Admin helpers ─────────────────────────────────────────────────────────────
export const adm = {
  // Dashboard
  stats: () => adminApi.get('/dashboard/stats'),

  // Profile
  getProfile:           () => adminApi.get('/profile'),
  updateProfile:        (data) => adminApi.put('/profile', data),
  changePassword:       (data) => adminApi.put('/change-password', data),
  updateAdminAccount:   (data) => adminApi.put('/account', data),
  getAdminAccount:      () => adminApi.get('/account'),
  uploadProfilePhoto:   (fd)   => adminApi.post('/profile/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Projects
  getProjects:         () => adminApi.get('/projects'),
  createProject:       (data) => adminApi.post('/projects', data),
  updateProject:       (id, data) => adminApi.put(`/projects/${id}`, data),
  deleteProject:       (id) => adminApi.delete(`/projects/${id}`),
  uploadProjectImage:  (fd) => adminApi.post('/projects/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Skills
  getSkills:   () => adminApi.get('/skills'),
  createSkill: (data) => adminApi.post('/skills', data),
  updateSkill: (id, data) => adminApi.put(`/skills/${id}`, data),
  deleteSkill: (id) => adminApi.delete(`/skills/${id}`),

  // Experience
  getExperience:    () => adminApi.get('/experience'),
  createExperience: (data) => adminApi.post('/experience', data),
  updateExperience: (id, data) => adminApi.put(`/experience/${id}`, data),
  deleteExperience: (id) => adminApi.delete(`/experience/${id}`),

  // Education
  getEducation:    () => adminApi.get('/education'),
  createEducation: (data) => adminApi.post('/education', data),
  updateEducation: (id, data) => adminApi.put(`/education/${id}`, data),
  deleteEducation: (id) => adminApi.delete(`/education/${id}`),

  // Certifications
  getCertifications:    () => adminApi.get('/certifications'),
  createCertification:  (data) => adminApi.post('/certifications', data),
  updateCertification:  (id, data) => adminApi.put(`/certifications/${id}`, data),
  deleteCertification:  (id) => adminApi.delete(`/certifications/${id}`),

  // Achievements
  getAchievements:        () => adminApi.get('/achievements'),
  createAchievement:      (data) => adminApi.post('/achievements', data),
  updateAchievement:      (id, data) => adminApi.put(`/achievements/${id}`, data),
  deleteAchievement:      (id) => adminApi.delete(`/achievements/${id}`),
  uploadAchievementImage: (fd) => adminApi.post('/achievements/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Networking Labs
  getLabs:    () => adminApi.get('/labs'),
  createLab:  (data) => adminApi.post('/labs', data),
  updateLab:  (id, data) => adminApi.put(`/labs/${id}`, data),
  deleteLab:  (id) => adminApi.delete(`/labs/${id}`),

  // Documents / CV
  getDocuments:   () => adminApi.get('/documents'),
  uploadDocument: (formData) => adminApi.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteDocument: (id) => adminApi.delete(`/documents/${id}`),

  // Messages
  getMessages:      () => adminApi.get('/messages'),
  markRead:         (id) => adminApi.put(`/messages/${id}/read`),
  replyMessage:     (id, text) => adminApi.post(`/messages/${id}/reply`, { replyText: text }),
  deleteMessage:    (id) => adminApi.delete(`/messages/${id}`),
};
