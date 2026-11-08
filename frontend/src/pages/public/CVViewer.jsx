import React, { useEffect, useState } from 'react';
import { pub, getUploadUrl, CV_DOWNLOAD_PROXY } from '../../services/api';
import { Download, ExternalLink, Printer, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const CVViewer = () => {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    pub.getCV()
      .then(({ data }) => {
        if (data && (data._id || data.filename)) {
          setCv(data);
        } else {
          setError('No CV uploaded yet. Please upload one from the Admin documents page.');
        }
      })
      .catch(() => setError('Could not load CV. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const fileUrl = cv ? getUploadUrl(cv.path || `/uploads/${cv.filename}`) : null;
  const isPdf = cv?.mimetype === 'application/pdf' || cv?.filename?.toLowerCase().endsWith('.pdf');
  const fmtSize = (b) =>
    b ? (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`) : '';

  const handleDownloadClick = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  const handlePrint = () => {
    if (!fileUrl) return;
    const win = window.open(fileUrl, '_blank');
    if (win) {
      win.focus();
      win.onload = () => {
        try { win.print(); } catch (e) { console.error(e); }
      };
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--c-bg-cv, var(--c-section))' }}
    >
      {/* ── Starry header ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: '48px', paddingBottom: '40px' }}
      >
        {/* Stars background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20px 30px,   #fff, transparent),
              radial-gradient(1.5px 1.5px at 140px 70px, rgba(255,255,255,.9), transparent),
              radial-gradient(1px 1px at 260px 40px,  rgba(255,255,255,.7), transparent),
              radial-gradient(2px 2px at 390px 110px, rgba(255,255,255,.95),transparent),
              radial-gradient(1px 1px at 520px 25px,  #fff, transparent),
              radial-gradient(1.5px 1.5px at 640px 95px, rgba(255,255,255,.85),transparent),
              radial-gradient(1px 1px at 780px 45px,  rgba(255,255,255,.65),transparent),
              radial-gradient(2px 2px at 910px 130px, rgba(255,255,255,.9), transparent),
              radial-gradient(1px 1px at 1050px 65px, #fff, transparent),
              radial-gradient(1.5px 1.5px at 1180px 110px,rgba(255,255,255,.75),transparent),
              radial-gradient(1px 1px at 1300px 35px, #fff, transparent),
              radial-gradient(1.5px 1.5px at 1420px 85px,rgba(255,255,255,.85),transparent)
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '750px 190px',
            opacity: 0.85,
          }}
        />

        {/* Purple ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            style={{
              width: '384px',
              height: '160px',
              borderRadius: '9999px',
              opacity: 0.25,
              background: 'radial-gradient(ellipse at center, rgba(6,182,212,.4) 0%, transparent 70%)',
              filter: 'blur(45px)',
            }}
          />
        </div>

        {/* Centered action bar */}
        <div className="relative z-10 flex flex-col items-center gap-3 px-4">
          {/* Primary download button */}
          <a
            href={CV_DOWNLOAD_PROXY}
            download={cv?.name || 'Resume_CV.pdf'}
            onClick={handleDownloadClick}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl text-white font-medium text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5 active:scale-95 group"
            style={{
              background: 'linear-gradient(135deg,#532577 0%,#69349c 100%)',
              boxShadow: '0 4px 20px rgba(105,52,156,.45), 0 0 0 1px var(--c-accent-40)',
              textDecoration: 'none',
            }}
            title="Download CV to your device"
          >
            {downloading ? (
              <>
                <CheckCircle2 size={18} className="text-green-300 animate-pulse" />
                <span>Downloading…</span>
              </>
            ) : (
              <>
                <Download size={18} className="transition-transform group-hover:translate-y-0.5" />
                <span>Download CV</span>
              </>
            )}
          </a>

          {/* Secondary actions — only shown when a CV is loaded */}
          {fileUrl && (
            <div className="flex items-center gap-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/10"
                style={{
                  color: 'var(--c-text-85)',
                  background: 'var(--c-input)',
                  border: '1px solid var(--c-border-surf)',
                  textDecoration: 'none',
                }}
                title="Open in new window"
              >
                <ExternalLink size={13} />
                <span>Full Screen</span>
              </a>

              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/10 cursor-pointer"
                style={{
                  color: 'var(--c-text-85)',
                  background: 'var(--c-input)',
                  border: '1px solid var(--c-border-surf)',
                }}
                title="Print CV"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>
            </div>
          )}

          {/* File meta */}
          {cv && (
            <p
              className="text-xs tracking-wide"
              style={{ color: 'rgba(255,255,255,.45)', fontFamily: 'monospace' }}
            >
              {cv.name}
              {cv.size ? ` · ${fmtSize(cv.size)}` : ''}
            </p>
          )}
        </div>
      </section>

      {/* ── Document area ──────────────────────────────────────────────── */}
      <main
        className="flex-1 w-full mx-auto pb-16 px-2 sm:px-4 lg:px-8"
        style={{ maxWidth: '960px' }}
      >
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg,#532577,#0891b2)' }}
            >
              <Loader2 size={30} className="text-white animate-spin" />
            </div>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,.7)' }}>
              Loading Resume / CV…
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)' }}
            >
              <AlertCircle size={32} style={{ color: '#ef4444' }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">CV Not Available</h3>
            <p className="text-sm text-white/60 max-w-md mb-6">{error}</p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: '#5b2b82' }}
            >
              <FileText size={15} /> Contact Me Directly
            </a>
          </div>
        )}

        {/* ── White paper document card ──────────────────────────────── */}
        {!loading && cv && (
          <div
            className="w-full bg-white overflow-hidden"
            style={{
              borderRadius: '12px 12px 0 0',
              boxShadow: '0 25px 60px -10px rgba(0,0,0,.65), 0 0 0 1px var(--c-surface-md)',
            }}
          >
            {isPdf ? (
              <>
                {/* PDF iframe — fills full viewport height minus the header */}
                <iframe
                  id="cv-pdf-viewer"
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                  title="Curriculum Vitae / Resume"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'calc(100vh - 160px)',
                    minHeight: '900px',
                    border: 'none',
                    background: '#fff',
                  }}
                />

                {/* Mobile notice */}
                <div className="sm:hidden bg-slate-100 px-4 py-3 text-center border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-1.5">
                    On a small screen? Open the full PDF for the best experience.
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 underline"
                  >
                    <ExternalLink size={12} /> Open in PDF Reader
                  </a>
                </div>
              </>
            ) : (
              /* Non-PDF fallback */
              <div className="flex flex-col items-center justify-center p-16 text-center text-slate-700">
                <FileText size={48} className="text-cyan-600 mb-4" />
                <h4 className="text-lg font-bold mb-1">{cv.name}</h4>
                <p className="text-xs text-slate-500 mb-6">
                  {fmtSize(cv.size)} · Click below to view or download.
                </p>
                <div className="flex gap-3">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-700 hover:bg-cyan-800 transition-colors"
                  >
                    View Document
                  </a>
                  <a
                    href={CV_DOWNLOAD_PROXY}
                    download={cv.name}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-cyan-700 border border-cyan-300 hover:bg-cyan-50 transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CVViewer;
