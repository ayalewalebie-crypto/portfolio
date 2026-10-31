/**
 * SkillIcon — shows the correct technology icon for a skill name.
 *
 * Priority:
 *  1. Local SVG from /public/techicons/ (files from the reference portfolio)
 *  2. react-icons/si  (Simple Icons — looked up by string key, no unused-import warnings)
 *  3. Coloured dot fallback
 */
import React from 'react';
import * as Si from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

// ── 1. Local SVG files from /public/techicons/ ────────────────────────────────
const LOCAL_SVG = {
  'javascript':          'Javascript.svg',
  'js':                  'Javascript.svg',
  'node.js':             'Node.svg',
  'nodejs':              'Node.svg',
  'node':                'Node.svg',
  'react':               'React.svg',
  'react.js':            'React.svg',
  'reactjs':             'React.svg',
  'mongodb':             'Mongo.svg',
  'mongo db':            'Mongo.svg',
  'mongo':               'Mongo.svg',
  'git':                 'Git.svg',
  'github':              'github.svg',
  'firebase':            'Firebase.svg',
  'tailwind':            'Tailwind.svg',
  'tailwind css':        'Tailwind.svg',
  'tailwindcss':         'Tailwind.svg',
  'php':                 'php.svg',
  'flutter':             'flutter.svg',
  'java':                'Java.svg',
  'c++':                 'C++.svg',
  'cpp':                 'C++.svg',
  'next.js':             'Next.svg',
  'nextjs':              'Next.svg',
  'sql':                 'SQL.svg',
  'mysql':               'SQL.svg',
  'vs code':             'vscode.svg',
  'vscode':              'vscode.svg',
  'visual studio code':  'vscode.svg',
  'postman':             'Postman.svg',
  'google chrome':       'Google Chrome.svg',
  'chrome':              'Google Chrome.svg',
  'intellij':            'intellij-idea.svg',
  'intellij idea':       'intellij-idea.svg',
  'macos':               'Apple MacOSX.svg',
  'apple':               'Apple MacOSX.svg',
};

// ── 2. Simple Icons lookup — string key → { siName, color } ──────────────────
// siName must exactly match a named export in react-icons/si (e.g. 'SiDocker')
const SI_MAP = {
  'typescript':          { siName: 'SiTypescript',   color: '#3178c6' },
  'ts':                  { siName: 'SiTypescript',   color: '#3178c6' },
  'python':              { siName: 'SiPython',       color: '#3776ab' },
  'go':                  { siName: 'SiGo',           color: '#00add8' },
  'rust':                { siName: 'SiRust',         color: '#ce422b' },
  'swift':               { siName: 'SiSwift',        color: '#fa7343' },
  'kotlin':              { siName: 'SiKotlin',       color: '#7f52ff' },
  'dart':                { siName: 'SiDart',         color: '#0175c2' },
  'html':                { siName: 'SiHtml5',        color: '#e34f26' },
  'html5':               { siName: 'SiHtml5',        color: '#e34f26' },
  'css':                 { siName: 'SiCss',          color: '#1572b6' },
  'css3':                { siName: 'SiCss',          color: '#1572b6' },
  'sass':                { siName: 'SiSass',         color: '#cc6699' },
  'scss':                { siName: 'SiSass',         color: '#cc6699' },
  'bootstrap':           { siName: 'SiBootstrap',    color: '#7952b3' },
  'vue':                 { siName: 'SiVuedotjs',     color: '#4fc08d' },
  'vue.js':              { siName: 'SiVuedotjs',     color: '#4fc08d' },
  'nuxt':                { siName: 'SiNuxt',         color: '#00dc82' },
  'angular':             { siName: 'SiAngular',      color: '#dd0031' },
  'svelte':              { siName: 'SiSvelte',       color: '#ff3e00' },
  'express':             { siName: 'SiExpress',      color: 'var(--text-primary)' },
  'express.js':          { siName: 'SiExpress',      color: 'var(--text-primary)' },
  'expressjs':           { siName: 'SiExpress',      color: 'var(--text-primary)' },
  'nestjs':              { siName: 'SiNestjs',       color: '#e0234e' },
  'nest.js':             { siName: 'SiNestjs',       color: '#e0234e' },
  'django':              { siName: 'SiDjango',       color: '#44b78b' },
  'flask':               { siName: 'SiFlask',        color: 'var(--text-primary)' },
  'fastapi':             { siName: 'SiFastapi',      color: '#009688' },
  'laravel':             { siName: 'SiLaravel',      color: '#ff2d20' },
  'postgresql':          { siName: 'SiPostgresql',   color: '#4169e1' },
  'postgres':            { siName: 'SiPostgresql',   color: '#4169e1' },
  'sqlite':              { siName: 'SiSqlite',       color: '#003b57' },
  'redis':               { siName: 'SiRedis',        color: '#dc382d' },
  'supabase':            { siName: 'SiSupabase',     color: '#3ecf8e' },
  'docker':              { siName: 'SiDocker',       color: '#2496ed' },
  'kubernetes':          { siName: 'SiKubernetes',   color: '#326ce5' },
  'linux':               { siName: 'SiLinux',        color: '#fcc624' },
  'ubuntu':              { siName: 'SiUbuntu',       color: '#e95420' },
  'nginx':               { siName: 'SiNginx',        color: '#009639' },
  'gitlab':              { siName: 'SiGitlab',       color: '#fc6d26' },
  'figma':               { siName: 'SiFigma',        color: '#f24e1e' },
  'vercel':              { siName: 'SiVercel',       color: 'var(--text-primary)' },
  'netlify':             { siName: 'SiNetlify',      color: '#00c7b7' },
  'google cloud':        { siName: 'SiGooglecloud',  color: '#4285f4' },
  'gcp':                 { siName: 'SiGooglecloud',  color: '#4285f4' },
  'android':             { siName: 'SiAndroid',      color: '#3ddc84' },
  'cisco':               { siName: 'SiCisco',        color: '#1ba0d7' },
  'cisco packet tracer': { siName: 'SiCisco',        color: '#1ba0d7' },
  'arduino':             { siName: 'SiArduino',      color: '#00979d' },
  'raspberry pi':        { siName: 'SiRaspberrypi',  color: '#a22846' },
  'mqtt':                { siName: 'SiMqtt',         color: '#660066' },
  'graphql':             { siName: 'SiGraphql',      color: '#e10098' },
  'rest apis':           { siName: 'SiOpenapiinitiative', color: '#6ba539' },
  'rest api':            { siName: 'SiOpenapiinitiative', color: '#6ba539' },
  'mongoose':            { siName: 'SiMongoose',     color: '#880000' },
  'tailwindcss':         { siName: 'SiTailwindcss',  color: '#a855f7' },
};

// ── Lookup helpers ─────────────────────────────────────────────────────────────
const norm = (s) => (s || '').toLowerCase().trim();

const findLocal = (name) => {
  const k = norm(name);
  if (LOCAL_SVG[k]) return LOCAL_SVG[k];
  for (const [key, file] of Object.entries(LOCAL_SVG)) {
    if (k.includes(key) || key.includes(k)) return file;
  }
  return null;
};

const findSi = (name) => {
  const k = norm(name);
  if (SI_MAP[k]) return SI_MAP[k];
  for (const [key, val] of Object.entries(SI_MAP)) {
    if (k.includes(key) || key.includes(k)) return val;
  }
  return null;
};

/**
 * Returns { type:'svg', src } | { type:'si', Icon, color } | null
 */
export const getSkillIcon = (name) => {
  const local = findLocal(name);
  if (local) return { type: 'svg', src: `/techicons/${local}` };

  const si = findSi(name);
  if (si) {
    const Icon = Si[si.siName];
    if (Icon) return { type: 'si', Icon, color: si.color };
  }

  // fa fallback
  if (norm(name).includes('java') && !norm(name).includes('javascript')) {
    return { type: 'si', Icon: FaJava, color: '#f89820' };
  }

  return null;
};

/**
 * <SkillIcon name="React" size={20} />
 */
const SkillIcon = ({ name, size = 20 }) => {
  const match = getSkillIcon(name);

  if (!match) {
    return (
      <span style={{
        display: 'inline-block', flexShrink: 0,
        width: Math.round(size * 0.55),
        height: Math.round(size * 0.55),
        borderRadius: '50%',
        background: '#a855f7',
      }} />
    );
  }

  if (match.type === 'svg') {
    return (
      <img
        src={match.src}
        alt={name}
        width={size}
        height={size}
        style={{ objectFit: 'contain', flexShrink: 0 }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  const { Icon, color } = match;
  return <Icon size={size} style={{ color, flexShrink: 0 }} />;
};

export default SkillIcon;
