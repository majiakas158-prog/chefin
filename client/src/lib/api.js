import axios from 'axios';

/**
 * Configured axios instance for the Chefin API.
 *
 * - In development, Vite proxies "/api" and "/api/auth" to localhost:4000,
 *   so baseURL is relative and CORS headers are handled automatically.
 * - Cookies (session) are included on every request via `withCredentials`.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,           // send cookies (better-auth session)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// ── Response interceptor ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Redirect to sign-in when the session expires
      window.location.href = '/sign-in';
    }

    return Promise.reject(error);
  },
);

export default api;

// ── Typed helpers ──────────────────────────────────────────────────────────

/** User endpoints  →  /api/users */
export const userApi = {
  /** GET /api/users/me  — fetch the signed-in user's profile */
  getMe: () => api.get('/api/users/me'),

  /** PATCH /api/users/me  — update the signed-in user's profile */
  updateMe: (data) => api.patch('/api/users/me', data),
};

/** Job endpoints  →  /api/jobs */
export const jobApi = {
  /** GET /api/jobs  — list all jobs */
  getJobs: (params) => api.get('/api/jobs', { params }),

  /** GET /api/jobs/dashboard  — recruiter dashboard */
  getDashboard: () => api.get('/api/jobs/dashboard'),

  /** POST /api/jobs  — create a new job posting */
  createJob: (data) => api.post('/api/jobs', data),

  /** POST /api/jobs/:jobId/applications  — apply for a job */
  apply: (jobId) => api.post(`/api/jobs/${jobId}/applications`),
};
