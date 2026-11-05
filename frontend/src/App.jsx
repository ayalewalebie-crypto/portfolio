import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout  from './layouts/AdminLayout';
import { Loader2 } from 'lucide-react';

// ── Error boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: '40px', fontFamily: 'monospace', color: '#e0f4fa', background: '#06152e', minHeight: '100vh' }}>
        <h2 style={{ color: '#22d3ee' }}>Something went wrong</h2>
        <pre style={{ whiteSpace: 'pre-wrap', color: '#f87171', fontSize: '13px' }}>
          {this.state.error?.toString()}
          {'\n\n'}
          {this.state.error?.stack}
        </pre>
      </div>
    );
    return this.props.children;
  }
}

// ── Public pages ──────────────────────────────────────────────────────────────
import Home from './pages/public/Home';
const PublicAbout       = lazy(() => import('./pages/public/About'));
const PublicSkills      = lazy(() => import('./pages/public/Skills'));
const PublicContact     = lazy(() => import('./pages/public/Contact'));
const PublicProjects    = lazy(() => import('./pages/public/Projects'));
const PublicCV          = lazy(() => import('./pages/public/CVViewer'));
const PublicNetworking  = lazy(() => import('./pages/public/NetworkingLabs'));

// ── Admin pages ───────────────────────────────────────────────────────────────
import Login from './pages/admin/Login';
const Dashboard      = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects  = lazy(() => import('./pages/admin/Projects'));
const AdminSkills    = lazy(() => import('./pages/admin/Skills'));
const AdminEducation = lazy(() => import('./pages/admin/Education'));
const AdminExperience= lazy(() => import('./pages/admin/Experience'));
const AdminCerts     = lazy(() => import('./pages/admin/Certifications'));
const AdminLabs      = lazy(() => import('./pages/admin/NetworkingLabs'));
const AdminDocuments = lazy(() => import('./pages/admin/Documents'));
const AdminMessages  = lazy(() => import('./pages/admin/Messages'));
const AdminSettings  = lazy(() => import('./pages/admin/Settings'));

const Spin = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(20,15,35)' }}>
    <Loader2 size={32} className="animate-spin" style={{ color: '#22d3ee' }} />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <Router basename="/">
        <Suspense fallback={<Spin />}>
          <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<PublicLayout />}>
            <Route index              element={<Home />} />
            <Route path="about"       element={<PublicAbout />} />
            <Route path="skills"      element={<PublicSkills />} />
            <Route path="contact"     element={<PublicContact />} />
            <Route path="projects"    element={<PublicProjects />} />
            <Route path="cv"          element={<PublicCV />} />
            <Route path="networking-labs" element={<PublicNetworking />} />
          </Route>

          {/* ── Admin login ── */}
          <Route path="/admin/login" element={<Login />} />

          {/* ── Protected admin ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index                   element={<Dashboard />} />
            <Route path="projects"         element={<AdminProjects />} />
            <Route path="skills"           element={<AdminSkills />} />
            <Route path="education"        element={<AdminEducation />} />
            <Route path="experience"       element={<AdminExperience />} />
            <Route path="certifications"   element={<AdminCerts />} />
            <Route path="networking-labs"  element={<AdminLabs />} />
            <Route path="documents"        element={<AdminDocuments />} />
            <Route path="messages"         element={<AdminMessages />} />
            <Route path="settings"         element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
