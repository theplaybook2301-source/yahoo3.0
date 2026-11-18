import React, { useState, useEffect, useRef, useCallback, useMemo, useId } from 'react';
import {
  Search, ChevronDown, ChevronRight, X, Minus, Square, Send, UserPlus, Volume2, VolumeX,
  Bold, Italic, Underline, MessageSquare, Phone, Video, Paperclip, ArrowLeft, Edit3,
  Smile, Palette, Image as ImageIcon, LogOut, Users, Clock,
} from 'lucide-react';

/* =====================================================================
   Yahoo! Messenger 2007 — bản mô phỏng hoài niệm (fan-made simulator)
   Single-file React + Tailwind (core classes) + lucide-react.
   Không kết nối mạng, không lưu mật khẩu. Mọi nick đều là nhân vật ảo.
   ===================================================================== */

const PURPLE = '#7B0099';
const UI_FONT = 'Tahoma, Verdana, "Segoe UI", Arial, sans-serif';

const GRAD = {
  title: 'linear-gradient(180deg,#b04fd0 0%,#8a12ad 45%,#6d0088 55%,#8a1ba8 100%)',
  titleIdle: 'linear-gradient(180deg,#c9a3d6 0%,#a57bb8 50%,#9670aa 100%)',
  silver: 'linear-gradient(180deg,#fdfdfd 0%,#ececec 48%,#dcdcdc 52%,#e9e9e9 100%)',
  silverSoft: 'linear-gradient(180deg,#f7f7f7 0%,#e3e3e3 100%)',
  lavender: 'linear-gradient(180deg,#fbf6fd 0%,#efe2f5 100%)',
  signIn: 'linear-gradient(180deg,#fff3b0 0%,#ffd23f 45%,#f7a600 55%,#ffbf2e 100%)',
  desktop:
    'radial-gradient(ellipse at 78% 18%,rgba(140,220,255,.55) 0%,rgba(140,220,255,0) 40%),' +
    'radial-gradient(ellipse at 12% 85%,rgba(160,90,255,.45) 0%,rgba(160,90,255,0) 45%),' +
    'linear-gradient(160deg,#0c3a7a 0%,#1565b8 38%,#0b4f8f 62%,#062a55 100%)',
  taskbar: 'linear-gradient(180deg,rgba(60,78,100,.92) 0%,rgba(20,30,44,.96) 50%,rgba(8,14,22,.98) 100%)',
};

const FONT_FACES = ['Tahoma', 'Arial', 'Comic Sans MS', 'Times New Roman', 'Verdana', 'Courier New'];
const FONT_FALLBACK = {
  Tahoma: 'Tahoma, Verdana, sans-serif',
  Arial: 'Arial, Helvetica, sans-serif',
  'Comic Sans MS': '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "Comic Neue", cursive',
  'Times New Roman': '"Times New Roman", Times, serif',
  Verdana: 'Verdana, Geneva, sans-serif',
  'Courier New': '"Courier New", Courier, monospace',
};
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20];
const FONT_COLORS = [
  '#000000', '#7B0099', '#FF1493', '#FF0000', '#FF6600', '#CC9900', '#008000', '#008080',
  '#0000FF', '#000080', '#6633CC', '#996633', '#808080', '#FF66CC', '#00AAFF', '#33CC33',
];

const IMVIRONMENTS = {
  none: { label: 'Mặc định', style: { background: '#ffffff' } },
  hearts: {
    label: 'Trái tim hồng',
    style: {
      backgroundColor: '#fff0f6',
      backgroundImage:
        'radial-gradient(circle at 20% 30%,rgba(255,105,180,.18) 0 7px,transparent 8px),' +
        'radial-gradient(circle at 70% 70%,rgba(255,20,147,.14) 0 10px,transparent 11px)',
      backgroundSize: '64px 64px, 90px 90px',
    },
  },
  sky: {
    label: 'Bầu trời',
    style: {
      backgroundColor: '#eaf6ff',
      backgroundImage:
        'radial-gradient(ellipse at 30% 40%,rgba(255,255,255,.95) 0 14px,transparent 15px),' +
        'radial-gradient(ellipse at 75% 65%,rgba(255,255,255,.9) 0 18px,transparent 19px),' +
        'linear-gradient(180deg,#cfeaff 0%,#f4fbff 100%)',
      backgroundSize: '120px 70px, 160px 90px, 100% 100%',
    },
  },
  notebook: {
    label: 'Vở ô ly',
    style: {
      backgroundColor: '#fffef6',
      backgroundImage:
        'linear-gradient(90deg,transparent 30px,rgba(255,80,80,.35) 30px 31px,transparent 31px),' +
        'linear-gradient(rgba(120,140,255,.22) 1px,transparent 1px),' +
        'linear-gradient(90deg,rgba(120,140,255,.10) 1px,transparent 1px)',
      backgroundSize: '100% 100%, 16px 16px, 16px 16px',
    },
  },
};

/* ------------------------------ Smiley SVG ------------------------------ */

const FACE_COLORS = {
  yellow: ['#FFF8B5', '#FFD82A', '#F2A900', '#9A6A00'],
  red: ['#FFC0AE', '#FF5A3C', '#C81E0E', '#7A0E05'],
  green: ['#EEFFC2', '#B8E04E', '#7FAF1C', '#4E6F0A'],
  devil: ['#F5C4FF', '#C862EA', '#8A1FB0', '#4F0A66'],
  gray: ['#F6F6F6', '#CFCFCF', '#A0A0A0', '#6E6E6E'],
};
const INK = '#3b2400';
const MOUTH_FILL = '#5c1a00';

function heartPath(cx, cy, s) {
  return `M${cx} ${cy + 2.6 * s} C${cx - 4 * s} ${cy - 0.2 * s} ${cx - 2.6 * s} ${cy - 3.4 * s} ${cx} ${cy - 1.3 * s} C${cx + 2.6 * s} ${cy - 3.4 * s} ${cx + 4 * s} ${cy - 0.2 * s} ${cx} ${cy + 2.6 * s} Z`;
}

const EL = 12.2; // left eye x
const ER = 19.8; // right eye x
const EY = 14.6; // eyes y

function Eyes({ type }) {
  const sp = { stroke: INK, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const dot = (x, y = EY) => <ellipse cx={x} cy={y} rx="1.45" ry="2.15" fill={INK} />;
  const happy = (x) => <path d={`M${x - 2.2} ${EY + 1} Q${x} ${EY - 2} ${x + 2.2} ${EY + 1}`} {...sp} />;
  const closed = (x) => <path d={`M${x - 2.2} ${EY} Q${x} ${EY + 2} ${x + 2.2} ${EY}`} {...sp} />;
  const bigEye = (x, py = 0) => (
    <g>
      <circle cx={x} cy={EY} r="2.9" fill="#fff" stroke={INK} strokeWidth="0.9" />
      <circle cx={x} cy={EY + py} r="1.25" fill={INK} />
    </g>
  );
  switch (type) {
    case 'happy': return <g>{happy(EL)}{happy(ER)}</g>;
    case 'wink': return <g>{happy(EL)}{dot(ER)}</g>;
    case 'closed': return <g>{closed(EL)}{closed(ER)}</g>;
    case 'squint':
      return (
        <g>
          <path d={`M${EL - 2} ${EY - 2} L${EL + 1.8} ${EY} L${EL - 2} ${EY + 2}`} {...sp} />
          <path d={`M${ER + 2} ${EY - 2} L${ER - 1.8} ${EY} L${ER + 2} ${EY + 2}`} {...sp} />
        </g>
      );
    case 'big': return <g>{bigEye(EL)}{bigEye(ER)}</g>;
    case 'roll': return <g>{bigEye(EL, -1.5)}{bigEye(ER, -1.5)}</g>;
    case 'cool':
      return (
        <g>
          <path d="M7.4 12.4 H24.6 V13.8 Q24.2 17.9 20.6 17.9 Q17.7 17.9 17.1 14.6 H14.9 Q14.3 17.9 11.4 17.9 Q7.8 17.9 7.4 13.8 Z" fill="#141414" />
          <path d="M9.4 13.4 L11.6 13.4" stroke="#fff" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
          <path d="M18.6 13.4 L20.8 13.4" stroke="#fff" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
        </g>
      );
    case 'heart':
      return (
        <g>
          <path d={heartPath(EL, EY, 0.95)} fill="#ff1f4f" stroke="#a3001f" strokeWidth="0.5" />
          <path d={heartPath(ER, EY, 0.95)} fill="#ff1f4f" stroke="#a3001f" strokeWidth="0.5" />
        </g>
      );
    case 'x':
      return (
        <g>
          <path d={`M${EL - 1.9} ${EY - 1.9} L${EL + 1.9} ${EY + 1.9} M${EL + 1.9} ${EY - 1.9} L${EL - 1.9} ${EY + 1.9}`} {...sp} />
          <path d={`M${ER - 1.9} ${EY - 1.9} L${ER + 1.9} ${EY + 1.9} M${ER + 1.9} ${EY - 1.9} L${ER - 1.9} ${EY + 1.9}`} {...sp} />
        </g>
      );
    case 'nerd':
      return (
        <g>
          <circle cx={EL} cy={EY} r="3.1" fill="rgba(255,255,255,.55)" stroke={INK} strokeWidth="1.1" />
          <circle cx={ER} cy={EY} r="3.1" fill="rgba(255,255,255,.55)" stroke={INK} strokeWidth="1.1" />
          <path d={`M${EL + 3.1} ${EY} H${ER - 3.1}`} stroke={INK} strokeWidth="1.1" />
          <circle cx={EL} cy={EY} r="1.1" fill={INK} />
          <circle cx={ER} cy={EY} r="1.1" fill={INK} />
        </g>
      );
    case 'lashes':
      return (
        <g>
          {dot(EL)}{dot(ER)}
          <path d={`M${EL - 2.3} ${EY - 1.6} l-1.2 -1.2 M${EL - 1} ${EY - 2.4} l-0.6 -1.5 M${ER + 2.3} ${EY - 1.6} l1.2 -1.2 M${ER + 1} ${EY - 2.4} l0.6 -1.5`} {...sp} strokeWidth="1" />
        </g>
      );
    case 'half':
      return (
        <g>
          <path d={`M${EL - 2.2} ${EY - 0.3} H${EL + 2.2} M${ER - 2.2} ${EY - 0.3} H${ER + 2.2}`} {...sp} />
          <ellipse cx={EL} cy={EY + 1} rx="1.3" ry="1" fill={INK} />
          <ellipse cx={ER} cy={EY + 1} rx="1.3" ry="1" fill={INK} />
        </g>
      );
    case 'dollar':
      return (
        <g fontFamily="Arial" fontWeight="bold" fontSize="7" fill="#138a1f" textAnchor="middle">
          <text x={EL} y={EY + 2.5}>$</text>
          <text x={ER} y={EY + 2.5}>$</text>
        </g>
      );
    case 'spiral':
      return (
        <g fill="none" stroke={INK} strokeWidth="0.9">
          <circle cx={EL} cy={EY} r="2.6" /><circle cx={EL} cy={EY} r="1.2" />
          <circle cx={ER} cy={EY} r="2.6" /><circle cx={ER} cy={EY} r="1.2" />
        </g>
      );
    default: return <g>{dot(EL)}{dot(ER)}</g>;
  }
}

function Brows({ type }) {
  if (!type) return null;
  const sp = { stroke: INK, strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' };
  if (type === 'angry') return <path d="M9.2 10.2 L14.2 12.4 M22.8 10.2 L17.8 12.4" {...sp} />;
  if (type === 'sad') return <path d="M9.6 12.3 L14 10.6 M22.4 12.3 L18 10.6" {...sp} />;
  if (type === 'raised') return <path d="M10 11 Q12.2 10 14.4 11 M17.6 9.4 Q19.8 7.4 22.2 9.2" {...sp} />;
  return null;
}

function Mouth({ type }) {
  const sp = { stroke: INK, strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (type) {
    case 'smallSmile': return <path d="M12.6 21.2 Q16 24 19.4 21.2" {...sp} />;
    case 'grin': return <path d="M9.8 19.6 Q16 23 22.2 19.6 Q16 28 9.8 19.6 Z" fill={MOUTH_FILL} stroke={INK} strokeWidth="1" />;
    case 'bigGrin':
    case 'laugh': {
      const w = type === 'laugh' ? 1.1 : 0;
      return (
        <g>
          <path d={`M${9.4 - w} 19.2 Q16 21.2 ${22.6 + w} 19.2 Q${21.6 + w} ${27.4 + w} 16 ${27.4 + w} Q${10.4 - w} ${27.4 + w} ${9.4 - w} 19.2 Z`} fill={MOUTH_FILL} stroke={INK} strokeWidth="1" />
          <path d={`M${10 - w} 19.7 Q16 21.5 ${22 + w} 19.7 L${21.7 + w} 21.3 Q16 22.8 ${10.3 - w} 21.3 Z`} fill="#fff" />
          <ellipse cx="16" cy={25.3 + w * 0.6} rx={3.6 + w} ry="1.7" fill="#ff6b78" />
        </g>
      );
    }
    case 'frown': return <path d="M11 24.6 Q16 19.8 21 24.6" {...sp} />;
    case 'flat': return <path d="M11.6 22.6 H20.4" {...sp} />;
    case 'o': return <ellipse cx="16" cy="22.6" rx="1.9" ry="2.3" fill={MOUTH_FILL} stroke={INK} strokeWidth="0.8" />;
    case 'bigO': return <ellipse cx="16" cy="22.6" rx="2.9" ry="3.7" fill={MOUTH_FILL} stroke={INK} strokeWidth="0.9" />;
    case 'yawn':
      return (
        <g>
          <ellipse cx="16" cy="22.8" rx="3.5" ry="4.2" fill={MOUTH_FILL} stroke={INK} strokeWidth="0.9" />
          <ellipse cx="16" cy="25.2" rx="2.2" ry="1.3" fill="#ff6b78" />
        </g>
      );
    case 'tongue':
      return (
        <g>
          <path d="M13.8 22.2 Q13.6 27 16.4 27 Q19.2 27 18.9 22" fill="#ff5a7a" stroke="#b0203f" strokeWidth="0.7" />
          <path d="M10.4 20.6 Q16 24.6 21.6 20.6" {...sp} />
        </g>
      );
    case 'kiss': return <path d="M14.4 20.2 Q18 20.8 15.8 22.4 Q18.2 23.8 14.6 24.6" stroke="#c2185b" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    case 'wavy': return <path d="M10.4 22.6 Q12.2 20.8 14 22.6 T17.6 22.6 T21.2 22.6" {...sp} />;
    case 'smirk': return <path d="M11.8 22.2 Q17 23.8 21.2 19.8" {...sp} />;
    case 'skew': return <path d="M11.4 23.6 L20.6 20.8" {...sp} />;
    case 'teeth':
      return (
        <g>
          <rect x="10.8" y="20" width="10.4" height="4.4" rx="1.4" fill="#fff" stroke={INK} strokeWidth="1" />
          <path d="M13.4 20 V24.4 M16 20 V24.4 M18.6 20 V24.4 M10.8 22.2 H21.2" stroke={INK} strokeWidth="0.6" />
        </g>
      );
    case 'buck':
      return (
        <g>
          <path d="M10.6 20.4 Q16 24.4 21.4 20.4" {...sp} />
          <rect x="14.1" y="22.1" width="1.8" height="2.6" rx="0.4" fill="#fff" stroke={INK} strokeWidth="0.6" />
          <rect x="16.1" y="22.1" width="1.8" height="2.6" rx="0.4" fill="#fff" stroke={INK} strokeWidth="0.6" />
        </g>
      );
    case 'sadOpen': return <path d="M10.6 25.4 Q16 18.6 21.4 25.4 Q16 23.4 10.6 25.4 Z" fill={MOUTH_FILL} stroke={INK} strokeWidth="1" />;
    case 'zip':
      return (
        <g>
          <path d="M10.4 22.2 H21.6" stroke={INK} strokeWidth="1.4" />
          <path d="M12 21 V23.4 M14 21 V23.4 M16 21 V23.4 M18 21 V23.4 M20 21 V23.4" stroke={INK} strokeWidth="0.8" />
          <rect x="20.8" y="21.2" width="2.2" height="3" rx="0.6" fill="#bbb" stroke={INK} strokeWidth="0.6" />
        </g>
      );
    case 'whistle': return <circle cx="19" cy="22.4" r="1.6" fill={MOUTH_FILL} stroke={INK} strokeWidth="0.9" />;
    default: return <path d="M10.5 20.2 Q16 25.8 21.5 20.2" {...sp} />;
  }
}

function Mitten({ x, y, r = 0, fill, stroke }) {
  return (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx="3" ry="3.6" fill={fill} stroke={stroke} strokeWidth="1" />
      <path d={`M${x - 1} ${y - 3.2} V${y - 1} M${x + 1} ${y - 3.2} V${y - 1}`} stroke={stroke} strokeWidth="0.6" />
    </g>
  );
}

// Extras rendered BEHIND the face
function BackExtras({ extras, pal }) {
  return (
    <g>
      {extras.includes('horns') && (
        <g fill="#b0102a" stroke="#5a0010" strokeWidth="0.8">
          <path d="M8 10 L5.8 2.6 L12.8 7.2 Z" />
          <path d="M24 10 L26.2 2.6 L19.2 7.2 Z" />
        </g>
      )}
      {extras.includes('armsUp') && (
        <g strokeLinecap="round">
          <path d="M7 17 L2.6 7 M25 17 L29.4 7" stroke={pal[3]} strokeWidth="3.6" />
          <path d="M7 17 L2.6 7 M25 17 L29.4 7" stroke={pal[1]} strokeWidth="2.2" />
        </g>
      )}
    </g>
  );
}

// Extras rendered ON TOP of the face (inside rotation group)
function FaceExtras({ extras }) {
  return (
    <g>
      {extras.includes('blush') && (
        <g fill="#ff5f9e" opacity="0.55">
          <ellipse cx="8.9" cy="19.2" rx="2.3" ry="1.3" />
          <ellipse cx="23.1" cy="19.2" rx="2.3" ry="1.3" />
        </g>
      )}
      {extras.includes('streams') && (
        <g fill="#5bb8ff" opacity="0.9">
          <path d="M10.6 16.4 Q9.4 21 10 27.2 L12.2 27.2 Q12.6 21 12.4 16.4 Z" />
          <path d="M19.6 16.4 Q19.4 21 19.8 27.2 L22 27.2 Q22.6 21 21.4 16.4 Z" />
        </g>
      )}
      {extras.includes('tear') && <path d="M9.6 17.2 Q8.2 19.6 9.6 20.6 Q11 19.6 9.6 17.2 Z" fill="#5bb8ff" stroke="#2b7fc4" strokeWidth="0.4" />}
      {extras.includes('clownNose') && (
        <g>
          <circle cx="16" cy="18.6" r="2.5" fill="#ff2626" stroke="#8a0000" strokeWidth="0.6" />
          <circle cx="15.2" cy="17.8" r="0.7" fill="#fff" opacity="0.8" />
        </g>
      )}
      {extras.includes('longNose') && <path d="M16 17.6 L28.4 16.8 Q30 18 28.4 19.4 L16 19.8 Z" fill="#f2b800" stroke={INK} strokeWidth="0.7" />}
      {extras.includes('drool') && <path d="M19.8 23 Q20 26.6 20.8 28.4 Q21.8 26.4 21 23 Z" fill="#8fd3ff" stroke="#3b8fc9" strokeWidth="0.4" />}
      {extras.includes('L') && <text x="16" y="11" textAnchor="middle" fontSize="6.4" fontWeight="bold" fontFamily="Arial" fill="#178a24">L</text>}
    </g>
  );
}

function FrontExtras({ extras, pal }) {
  const fill = pal[1];
  const stroke = pal[3];
  return (
    <g>
      {extras.includes('halo') && <ellipse cx="16" cy="3.6" rx="7.6" ry="2" fill="none" stroke="#f5c400" strokeWidth="1.9" />}
      {extras.includes('heart') && <path d={heartPath(26.4, 6.6, 1.1)} fill="#ff1f4f" stroke="#a3001f" strokeWidth="0.5" />}
      {extras.includes('brokenHeart') && (
        <g>
          <path d={heartPath(26, 6.8, 1.15)} fill="#ff1f4f" stroke="#a3001f" strokeWidth="0.5" />
          <path d="M26 4.4 L25 6.4 L26.8 7.6 L25.8 9.6" stroke="#fff" strokeWidth="0.8" fill="none" />
        </g>
      )}
      {extras.includes('sweat') && <path d="M25.4 7 Q23.6 10 25.4 11.4 Q27.2 10 25.4 7 Z" fill="#8fd3ff" stroke="#3b8fc9" strokeWidth="0.5" />}
      {extras.includes('tearsJoy') && (
        <g fill="#5bb8ff" stroke="#2b7fc4" strokeWidth="0.4">
          <path d="M4.2 11 Q2.4 13.6 4 15 Q5.8 13.6 4.2 11 Z" />
          <path d="M28 10 Q26.2 12.6 27.8 14 Q29.6 12.6 28 10 Z" />
        </g>
      )}
      {extras.includes('zzz') && (
        <g fontFamily="Arial" fontWeight="bold" fill="#2f6fe0">
          <text x="23.5" y="9" fontSize="5.5">z</text>
          <text x="26.6" y="5" fontSize="7.5">Z</text>
        </g>
      )}
      {extras.includes('question') && <text x="27" y="10" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Arial" fill="#2457c5" stroke="#fff" strokeWidth="0.4">?</text>}
      {extras.includes('questions') && (
        <g fontSize="8.5" fontWeight="bold" fontFamily="Arial" fill="#2457c5" stroke="#fff" strokeWidth="0.4">
          <text x="2" y="9">?</text><text x="25.5" y="8">?</text>
        </g>
      )}
      {extras.includes('notes') && <text x="25" y="10" fontSize="8" fill="#2457c5" fontWeight="bold">♪</text>}
      {extras.includes('hug') && (
        <g>
          <Mitten x={6.6} y={24.2} r={-35} fill={fill} stroke={stroke} />
          <Mitten x={25.4} y={24.2} r={35} fill={fill} stroke={stroke} />
        </g>
      )}
      {extras.includes('hand') && <Mitten x={26.4} y={21} r={15} fill={fill} stroke={stroke} />}
      {extras.includes('facepalm') && <Mitten x={11} y={9.6} r={-60} fill={fill} stroke={stroke} />}
      {extras.includes('wave') && (
        <g>
          <Mitten x={27} y={12} r={20} fill={fill} stroke={stroke} />
          <path d="M30.6 7.6 Q31.8 9.6 31 11.6 M29.6 5.4 Q31 6 31.6 7" stroke="#555" strokeWidth="0.7" fill="none" />
        </g>
      )}
      {extras.includes('clap') && (
        <g>
          <Mitten x={13.6} y={27.4} r={-20} fill={fill} stroke={stroke} />
          <Mitten x={18.4} y={27.4} r={20} fill={fill} stroke={stroke} />
          <path d="M10 26 L8.4 25 M22 26 L23.6 25 M16 22.6 V21.4" stroke="#555" strokeWidth="0.8" />
        </g>
      )}
      {(extras.includes('thumbUp') || extras.includes('thumbDown')) && (
        <g transform={extras.includes('thumbDown') ? 'rotate(180 26 21)' : undefined}>
          <rect x="22.4" y="20.4" width="7.2" height="6.2" rx="1.6" fill={fill} stroke={stroke} strokeWidth="1" />
          <rect x="23.2" y="15.2" width="2.8" height="6.4" rx="1.3" fill={fill} stroke={stroke} strokeWidth="1" />
        </g>
      )}
      {extras.includes('partyHat') && (
        <g>
          <path d="M10.4 8.6 L15.4 0.8 L19.8 7.2 Z" fill="#2f7de1" stroke="#16407a" strokeWidth="0.7" />
          <circle cx="13.6" cy="5.8" r="0.8" fill="#ffe14d" /><circle cx="16.6" cy="4.2" r="0.7" fill="#ff4fa3" />
          <circle cx="15.4" cy="0.9" r="1.3" fill="#ff4fa3" />
        </g>
      )}
      {extras.includes('cowboyHat') && (
        <g>
          <ellipse cx="16" cy="8.2" rx="13" ry="2.4" fill="#8b5a2b" stroke="#4a2c10" strokeWidth="0.7" />
          <path d="M9.8 8 Q9.6 1.4 16 2.6 Q22.4 1.4 22.2 8 Z" fill="#a8692f" stroke="#4a2c10" strokeWidth="0.7" />
          <path d="M10 6.6 H22" stroke="#4a2c10" strokeWidth="1" />
        </g>
      )}
      {extras.includes('clock') && (
        <g>
          <circle cx="26" cy="7" r="4" fill="#fff" stroke="#444" strokeWidth="0.9" />
          <path d="M26 7 V4.6 M26 7 L27.8 8" stroke="#444" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      )}
      {extras.includes('thought') && (
        <g fill="#fff" stroke="#888" strokeWidth="0.6">
          <circle cx="24" cy="7.6" r="1" /><circle cx="26.4" cy="5" r="1.5" /><ellipse cx="28.6" cy="2" rx="3" ry="1.9" />
        </g>
      )}
      {extras.includes('steam') && (
        <g stroke="#ddd" strokeWidth="1.4" fill="none" strokeLinecap="round">
          <path d="M8 6 Q6.4 4 8 2" /><path d="M24 6 Q25.6 4 24 2" />
        </g>
      )}
      {extras.includes('puff') && (
        <g fill="#fff" stroke="#9aa" strokeWidth="0.6">
          <circle cx="4.6" cy="24.4" r="1.6" /><circle cx="2.6" cy="22.6" r="1.1" />
        </g>
      )}
      {extras.includes('speech') && (
        <g>
          <rect x="21" y="0.6" width="10.6" height="6" rx="2" fill="#fff" stroke="#666" strokeWidth="0.6" />
          <path d="M23.6 6.6 L22.4 8.6 L25.4 6.6" fill="#fff" stroke="#666" strokeWidth="0.6" />
          <text x="26.3" y="5.2" fontSize="4.2" textAnchor="middle" fill="#333" fontFamily="Arial" fontWeight="bold">bla</text>
        </g>
      )}
    </g>
  );
}

function SmileyFace({ spec = {}, size = 22, title, style }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const { eyes = 'dot', mouth = 'smile', brows, extras = [], color = 'yellow', rotate = 0 } = spec;
  const pal = FACE_COLORS[color] || FACE_COLORS.yellow;
  const gid = `ymg${uid}`;
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible', flexShrink: 0, ...style }}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <radialGradient id={gid} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor={pal[0]} />
          <stop offset="55%" stopColor={pal[1]} />
          <stop offset="100%" stopColor={pal[2]} />
        </radialGradient>
      </defs>
      <BackExtras extras={extras} pal={pal} />
      <g transform={rotate ? `rotate(${rotate} 16 17)` : undefined}>
        <circle cx="16" cy="17" r="11.5" fill={`url(#${gid})`} stroke={pal[3]} strokeWidth="1.2" />
        <ellipse cx="12.4" cy="10.6" rx="4.6" ry="2.4" fill="#fff" opacity="0.5" />
        <Brows type={brows} />
        <Eyes type={eyes} />
        <Mouth type={mouth} />
        <FaceExtras extras={extras} />
      </g>
      <FrontExtras extras={extras} pal={pal} />
    </svg>
  );
}

/* ------------------------------ Emoticons ------------------------------ */
// [code, name, spec | emoji-string, aliases]
const EMOTICON_DEFS = [
  [':)', 'happy', { mouth: 'smile' }, [':-)']],
  [':(', 'sad', { mouth: 'frown', brows: 'sad' }, [':-(']],
  [';)', 'winking', { eyes: 'wink' }, [';-)']],
  [':D', 'big grin', { mouth: 'bigGrin' }, [':-D']],
  [';;)', 'batting eyelashes', { eyes: 'lashes', mouth: 'smallSmile', extras: ['blush'] }],
  ['>:D<', 'big hug', { eyes: 'happy', extras: ['hug', 'blush'] }],
  [':-/', 'confused', { mouth: 'skew', brows: 'raised' }],
  [':x', 'love struck', { eyes: 'heart' }, [':-x']],
  [':">', 'blushing', { eyes: 'happy', mouth: 'smallSmile', extras: ['blush'] }],
  [':P', 'tongue', { mouth: 'tongue' }, [':-P']],
  [':-*', 'kiss', { eyes: 'happy', mouth: 'kiss', extras: ['heart'] }, [':*']],
  ['=((', 'broken heart', { mouth: 'frown', brows: 'sad', extras: ['brokenHeart'] }],
  [':-O', 'surprise', { eyes: 'big', mouth: 'bigO' }],
  ['X(', 'angry', { eyes: 'dot', mouth: 'frown', brows: 'angry', color: 'red' }, ['x-(']],
  [':>', 'smug', { eyes: 'half', mouth: 'smirk' }],
  ['B-)', 'cool', { eyes: 'cool', mouth: 'smirk' }],
  [':-S', 'worried', { mouth: 'wavy', brows: 'sad', extras: ['sweat'] }],
  ['#:-S', 'whew!', { eyes: 'closed', mouth: 'o', extras: ['sweat', 'facepalm'] }],
  ['>:)', 'devil', { eyes: 'dot', mouth: 'grin', brows: 'angry', color: 'devil', extras: ['horns'] }],
  [':((', 'crying', { eyes: 'closed', mouth: 'sadOpen', brows: 'sad', extras: ['streams'] }],
  [':))', 'laughing', { eyes: 'squint', mouth: 'laugh' }],
  [':|', 'straight face', { mouth: 'flat' }],
  ['/:)', 'raised eyebrows', { brows: 'raised' }],
  ['=))', 'rolling on the floor', { eyes: 'squint', mouth: 'laugh', extras: ['tearsJoy'], rotate: -32 }],
  ['O:-)', 'angel', { eyes: 'happy', extras: ['halo'] }],
  [':-B', 'nerd', { eyes: 'nerd', mouth: 'buck' }],
  ['=;', 'talk to the hand', { eyes: 'half', mouth: 'flat', extras: ['hand'] }],
  ['I-)', 'sleepy', { eyes: 'closed', mouth: 'o', extras: ['zzz'] }],
  ['8-|', 'rolling eyes', { eyes: 'roll', mouth: 'flat' }],
  ['L-)', 'loser', { mouth: 'smile', extras: ['L'] }],
  [':-&', 'sick', { eyes: 'closed', mouth: 'wavy', color: 'green' }],
  [':-$', "don't tell anyone", { mouth: 'zip' }],
  ['[-(', 'not talking', { eyes: 'closed', mouth: 'flat', brows: 'angry', extras: ['puff'] }],
  [':O)', 'clown', { mouth: 'bigGrin', extras: ['clownNose'] }],
  ['8-}', 'silly', { eyes: 'spiral', mouth: 'tongue' }],
  ['<:-P', 'party', { eyes: 'happy', mouth: 'tongue', extras: ['partyHat'] }],
  ['(:|', 'yawn', { eyes: 'closed', mouth: 'yawn' }],
  ['=P~', 'drooling', { eyes: 'heart', mouth: 'tongue', extras: ['drool'] }],
  [':-?', 'thinking', { eyes: 'roll', mouth: 'skew', extras: ['question'] }],
  ['#-o', "d'oh", { eyes: 'closed', mouth: 'o', extras: ['facepalm'] }],
  ['=D>', 'applause', { eyes: 'happy', mouth: 'bigGrin', extras: ['clap'] }],
  [':-SS', 'nail biting', { eyes: 'big', mouth: 'teeth', brows: 'sad' }],
  ['@-)', 'hypnotized', { eyes: 'spiral', mouth: 'wavy' }],
  [':^o', 'liar', { mouth: 'o', extras: ['longNose'] }],
  [':-w', 'waiting', { eyes: 'half', mouth: 'flat', extras: ['clock'] }],
  [':-<', 'sigh', { eyes: 'closed', mouth: 'frown', extras: ['puff'] }],
  ['>:P', 'phbbbbt', { mouth: 'tongue', brows: 'angry' }],
  ['<):)', 'cowboy', { extras: ['cowboyHat'] }],
  ['X_X', "I don't want to see", { eyes: 'x', mouth: 'flat' }],
  [':-h', 'wave', { eyes: 'happy', extras: ['wave'] }],
  [':-bd', 'thumbs up', { eyes: 'happy', extras: ['thumbUp'] }],
  [':-q', 'thumbs down', { mouth: 'frown', extras: ['thumbDown'] }],
  ['\\:D/', 'dancing', { eyes: 'happy', mouth: 'bigGrin', extras: ['armsUp'] }],
  [';))', 'hee hee', { eyes: 'wink', mouth: 'laugh' }],
  [':-L', 'frustrated', { mouth: 'wavy', brows: 'angry', color: 'red', extras: ['steam'] }],
  ['$-)', 'money eyes', { eyes: 'dollar', mouth: 'bigGrin' }],
  [':-"', 'whistling', { eyes: 'half', mouth: 'whistle', extras: ['notes'] }],
  [':-@', 'chatterbox', { mouth: 'bigO', extras: ['speech'] }],
  ['8->', 'daydreaming', { eyes: 'roll', mouth: 'smile', extras: ['thought'] }],
  ['~X(', "at wits' end", { eyes: 'x', mouth: 'wavy', color: 'red', extras: ['steam'] }],
  [':-??', "I don't know", { mouth: 'skew', brows: 'raised', extras: ['questions'] }],
  ['[-O<', 'praying', '🙏'],
  ['\\m/', 'rock on!', '🤘'],
  [':)>-', 'peace sign', '✌️'],
  [':-c', 'call me', '📞'],
  ['@};-', 'rose', '🌹'],
  ['~O)', 'coffee', '☕'],
  ['(*)', 'star', '⭐'],
  ['*-:)', 'idea', '💡'],
  ['%%-', 'good luck', '🍀'],
  [':@)', 'pig', '🐷'],
  ['3:-O', 'cow', '🐮'],
  [':(|)', 'monkey', '🐵'],
  ['~:>', 'chicken', '🐔'],
  [':bz', 'bee', '🐝'],
  ['=:)', 'bug', '🐛'],
  ['>-)', 'alien', '👽'],
  ['8-X', 'skull', '💀'],
  ['(~~)', 'pumpkin', '🎃'],
  ['(%)', 'yin yang', '☯️'],
];

const EMOTICONS = EMOTICON_DEFS.map(([code, name, art, aliases = []]) => ({ code, name, art, aliases }));
const EMO_LOOKUP = new Map();
EMOTICONS.forEach((e) => [e.code, ...e.aliases].forEach((c) => EMO_LOOKUP.set(c.toLowerCase(), e)));
const EMO_REGEX = new RegExp(
  '(' +
    [...EMO_LOOKUP.keys()]
      .sort((a, b) => b.length - a.length)
      .map((c) => c.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'))
      .join('|') +
    ')',
  'gi'
);

function Emoticon({ emo, size = 22 }) {
  const title = `${emo.name}  ${emo.code}`;
  if (typeof emo.art === 'string') {
    return (
      <span
        role="img"
        aria-label={emo.name}
        title={title}
        style={{ display: 'inline-block', width: size, height: size, fontSize: size * 0.82, lineHeight: `${size}px`, textAlign: 'center', verticalAlign: 'middle', fontStyle: 'normal', fontWeight: 'normal' }}
      >
        {emo.art}
      </span>
    );
  }
  return <SmileyFace spec={emo.art} size={size} title={title} />;
}

// Biến chuỗi ký tự thành mảng text + emoticon
function renderWithEmoticons(text, size = 22) {
  const out = [];
  let last = 0;
  let m;
  EMO_REGEX.lastIndex = 0;
  let i = 0;
  while ((m = EMO_REGEX.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const emo = EMO_LOOKUP.get(m[0].toLowerCase());
    out.push(<Emoticon key={`e${i++}`} emo={emo} size={size} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/* ------------------------- Âm thanh (Web Audio API) ------------------------- */

const sfx = (() => {
  let ctx = null;
  let master = null;
  const get = () => {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.8;
        const comp = ctx.createDynamicsCompressor();
        master.connect(comp);
        comp.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) {
      return null;
    }
  };

  const env = (c, t, peak, attack, dur) => {
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(master);
    return g;
  };

  // Tiếng "ding" chuông có tin nhắn
  const bell = (c, t, f, dur, vol) => {
    const g = env(c, t, vol, 0.006, dur);
    [[1, 1], [2, 0.32], [2.76, 0.18], [5.4, 0.06]].forEach(([m, a]) => {
      const o = c.createOscillator();
      const og = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f * m, t);
      og.gain.value = a;
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + dur + 0.05);
    });
  };

  return {
    unlock: () => { get(); },
    message() {
      const c = get(); if (!c) return;
      const t = c.currentTime + 0.01;
      bell(c, t, 1046.5, 0.5, 0.32);
      bell(c, t + 0.11, 1568, 0.7, 0.26);
    },
    send() {
      const c = get(); if (!c) return;
      const t = c.currentTime + 0.005;
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(620, t);
      o.frequency.exponentialRampToValueAtTime(1240, t + 0.06);
      const g = env(c, t, 0.12, 0.004, 0.09);
      o.connect(g); o.start(t); o.stop(t + 0.12);
    },
    // Tiếng cửa mở cọt kẹt — bạn bè vừa online
    door() {
      const c = get(); if (!c) return;
      const t = c.currentTime + 0.01;
      const dur = 1.05;
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(92, t);
      o.frequency.linearRampToValueAtTime(150, t + 0.3);
      o.frequency.linearRampToValueAtTime(118, t + 0.55);
      o.frequency.linearRampToValueAtTime(185, t + 0.85);
      o.frequency.linearRampToValueAtTime(140, t + dur);
      const jit = c.createOscillator();
      const jg = c.createGain();
      jit.frequency.value = 7.3; jg.gain.value = 14;
      jit.connect(jg); jg.connect(o.frequency);
      const am = c.createGain(); am.gain.value = 0.55;
      const lfo = c.createOscillator();
      const lg = c.createGain();
      lfo.type = 'square';
      lfo.frequency.setValueAtTime(26, t);
      lfo.frequency.linearRampToValueAtTime(44, t + dur);
      lg.gain.value = 0.45;
      lfo.connect(lg); lg.connect(am.gain);
      const bp1 = c.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 1150; bp1.Q.value = 7;
      const bp2 = c.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 2450; bp2.Q.value = 9;
      const out = c.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(0.9, t + 0.06);
      out.gain.setValueAtTime(0.9, t + 0.4);
      out.gain.linearRampToValueAtTime(0.55, t + 0.6);
      out.gain.linearRampToValueAtTime(0.95, t + 0.8);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(am); am.connect(bp1); am.connect(bp2); bp1.connect(out); bp2.connect(out);
      const boost = c.createGain(); boost.gain.value = 2.2;
      out.connect(boost); boost.connect(master);
      [o, jit, lfo].forEach((n) => { n.start(t); n.stop(t + dur + 0.05); });
      // tiếng "cạch" nhẹ cuối
      const k = c.createOscillator(); k.type = 'sine';
      k.frequency.setValueAtTime(180, t + dur - 0.05);
      k.frequency.exponentialRampToValueAtTime(60, t + dur + 0.12);
      const kg = env(c, t + dur - 0.05, 0.35, 0.005, 0.2);
      k.connect(kg); k.start(t + dur - 0.05); k.stop(t + dur + 0.2);
    },
    // Tiếng cửa đóng — bạn bè offline
    doorClose() {
      const c = get(); if (!c) return;
      const t = c.currentTime + 0.01;
      const o = c.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(170, t);
      o.frequency.linearRampToValueAtTime(100, t + 0.35);
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1300; bp.Q.value = 7;
      const g = env(c, t, 0.7, 0.03, 0.4);
      o.connect(bp); bp.connect(g); o.start(t); o.stop(t + 0.45);
      const k = c.createOscillator(); k.type = 'sine';
      k.frequency.setValueAtTime(140, t + 0.38);
      k.frequency.exponentialRampToValueAtTime(45, t + 0.6);
      const kg = env(c, t + 0.38, 0.6, 0.004, 0.28);
      k.connect(kg); k.start(t + 0.38); k.stop(t + 0.7);
    },
    // Tiếng rung BUZZ!
    buzz() {
      const c = get(); if (!c) return;
      const t = c.currentTime + 0.01;
      const dur = 0.95;
      const shaper = c.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) { const x = (i / 128) - 1; curve[i] = Math.tanh(x * 3.2); }
      shaper.curve = curve;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600; lp.Q.value = 2;
      const am = c.createGain(); am.gain.value = 0.5;
      const lfo = c.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 23;
      const lg = c.createGain(); lg.gain.value = 0.5;
      lfo.connect(lg); lg.connect(am.gain);
      const out = c.createGain();
      out.gain.setValueAtTime(0.0001, t);
      // hai nhịp "bzzzt — bzzzt"
      out.gain.exponentialRampToValueAtTime(0.55, t + 0.02);
      out.gain.setValueAtTime(0.55, t + 0.38);
      out.gain.exponentialRampToValueAtTime(0.02, t + 0.44);
      out.gain.exponentialRampToValueAtTime(0.55, t + 0.5);
      out.gain.setValueAtTime(0.55, t + dur - 0.08);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      [[58, 'square', 0.5], [117, 'sawtooth', 0.35], [176, 'square', 0.15]].forEach(([f, type, a]) => {
        const o = c.createOscillator(); o.type = type; o.frequency.value = f;
        const og = c.createGain(); og.gain.value = a;
        o.connect(og); og.connect(shaper);
        o.start(t); o.stop(t + dur + 0.05);
      });
      shaper.connect(am); am.connect(lp); lp.connect(out); out.connect(master);
      lfo.start(t); lfo.stop(t + dur + 0.05);
    },
  };
})();

/* ------------------------------ Tiện ích ------------------------------ */

const norm = (s) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a, b) => a + Math.random() * (b - a);
const pad2 = (n) => String(n).padStart(2, '0');
const fmtTime = (ts) => {
  const d = new Date(ts);
  let h = d.getHours();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())} ${ap}`;
};
let _uid = 0;
const uid = () => `${Date.now().toString(36)}${(_uid++).toString(36)}`;

// tÊeN cOdE: viết hoa xen kẽ (bỏ qua mã emoticon)
function teenCase(s) {
  let up = false;
  return s
    .split(EMO_REGEX)
    .map((part) => {
      if (EMO_LOOKUP.has(part.toLowerCase())) return part;
      return [...part]
        .map((ch) => {
          if (!/\p{L}/u.test(ch)) return ch;
          up = !up;
          return up ? ch.toLowerCase() : ch.toUpperCase();
        })
        .join('');
    })
    .join('');
}

const safeStorage = {
  get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* bỏ qua */ } },
  del(k) { try { window.localStorage.removeItem(k); } catch (e) { /* bỏ qua */ } },
};

/* ---------------------- Nhân vật ảo & kịch bản trả lời ---------------------- */

const BUZZ = { buzz: true };

const TRIGGERS = [
  ['asl', /\b(asl|a\/s\/l|bao nhieu tuoi|may tuoi|nha o dau|o dau the|ten that|ten gi)\b/],
  ['bye', /(\bbye\b|\bbb\b|\bpp\b|\bg9\b|good night|ngu ngon|di ngu|\boff\b|tam biet|\bout\b)/],
  ['greet', /^(\s*)(hi+|hello|helo|hey|chao|xin chao|alo+|e+|ey|yo|hu+ hu+|ui)\b/],
  ['love', /(\byeu\b|\biu\b|love|thuong|nho (em|anh|ban|may|cau|to)|:x|:-\*|tinh yeu|crush|cua (em|anh) di)/],
  ['sad', /(buon|\bbun\b|\bhix|huhu|khoc|chan qua|chan wa|co don|that tinh|=\(\(|:\(\()/],
  ['compliment', /(\bdep\b|xinh|cute|kute|de thuong|dang yeu|dep trai|hot boy|hot girl|gioi qua|gioi wa)/],
  ['food', /(an com|an chua|doi bung|doi qua|doi wa|an gi|an sang|an toi|tra sua|\bkem\b|bun dau|che )/],
  ['study', /(\bhoc\b|bai tap|kiem tra|\bthi\b|\blop\b|thay giao|co giao|diem|homework|on bai)/],
  ['webcam', /(webcam|\bcam\b)/],
  ['call', /(goi dien|\bcall\b|voice|\bmic\b)/],
  ['game', /(game|audition|de che|vo lam|dota|\bnet\b|choi gi)/],
  ['blog', /(blog|\b360\b|entry)/],
  ['laugh', /(haha|hihi|hehe|kaka|keke|=\)\)|:\)\)|\blol\b|:d|;\)\))/],
  ['question', /\?\s*$/],
];

function classify(text) {
  const n = norm(text).trim();
  for (const [cat, re] of TRIGGERS) {
    if (cat === 'greet' && n.split(/\s+/).length > 5) continue;
    if (re.test(n)) return cat;
  }
  return 'generic';
}

const PERSONAS = {
  princess: {
    teen: 0.35,
    greet: [
      'hÌ hÌ, cHàO {me} nHoA :">',
      'ui, ai đây ta? lâu wá hem thấy onl :x',
      ['alo alo', 'pé đây, có j hem? ;;)'],
    ],
    asl: ['18/f/HN nè, hỏi chi zạ? :">', 'bí mật nhoa, con gái phải có chút bí ẩn chứ ;;)'],
    love: [
      'hix, đừng nói zậy, pé ngại wá đi :">',
      'iu j mà iu, mới quen có 3 ngày à =))',
      ['thiệt hông đó?', 'nói xạo là mũi dài như Pinocchio á nha :^o'],
    ],
    sad: ['sao zậy? kể pé nghe đi, pé ôm 1 cái nè >:D<', 'đừng bùn nữa mà, cười lên cái coi :D'],
    compliment: ['hihi, pé biết rùi, khỏi khen :">', 'khen thiệt hay khen xạo đó? :-/', 'nói nữa đi, pé thích nghe lắm ;;)'],
    food: ['pé vừa ăn kem xong, mập lên 2 ký rùi huhu :((', 'đi ăn chè hông? pé bao... à mà pé hết tiền rùi =))'],
    study: ['đừng nhắc bài tập nữa, pé đang trốn mẹ lên mạng nè :-$', ['mai kiểm tra 15 phút Hóa', 'chết pé rùi :(('] ],
    webcam: ['cam pé hư rùi, mà có cũng hem bật đâu, đang mặc đồ ngủ hình con heo :@) =))'],
    call: ['đang ở nhà, mẹ nghe thấy là pé chết á :-$'],
    file: ['gửi j zạ? virus hông đó >:P', 'hình j đó? xấu là pé xóa liền nha :P'],
    game: ['chơi Audition hông? pé nhảy giỏi lắm á \\:D/'],
    imv: ['ui IMVironment kute wá :x', 'nền đẹp ghê, chỉ pé cách đổi với :">'],
    blog: ['zô blog 360 của pé comment đi, pé mới up hình mới nè :x'],
    laugh: ['cười j mà cười, khùng hả =))', '=)) =)) =))', 'hihi :">'],
    question: ['hỏi j khó zạ, pé hem bít đâu :-/', ['để pé nghĩ đã... :-?', 'thui hem bít =))']],
    bye: ['pp nha, g9, mơ đẹp nhoa :-h', 'bb nhoa, mai onl tiếp :-*'],
    generic: [
      'zậy hả? hay wá ta ;)',
      'ừa ừa :D',
      'hem hỉu j hết trơn :-/',
      'nói j zị, nói tiếng người đi =))',
      ['ủa', 'rồi sao nữa? :-?'],
      'uhm, rùi sao kể tiếp đi :-w',
      'bạn nói chiện zui ghê :))',
      'đang nghe nhạc, bài mới hay wá trời :x',
    ],
    buzz: [
      ['Áaaa!!! giật cả mình >:P', 'BUZZ j mà BUZZ hoài zạ, rung hết cả màn hình nè :(('],
      'có j hông mà BUZZ pé zậy? :-/',
      ['BUZZ lại nè, cho chừa =))', BUZZ],
    ],
    buzzSpam: ['BUZZ nữa là pé block nick luôn á X(', ['thôi đủ rùi nha!!!', BUZZ, BUZZ, 'hứ X(']],
    invisible: 'ủa sao nick hiện offline mà chat dc z? tàng hình hả? >:P',
    statusComment: ['status mới ghê ta: "{status}" là sao? kể pé nghe đi :-/', 'đọc status thấy thương ghê :">'],
    comeback: ['ui quên, mai nhớ mang trả pé cuốn truyện tranh nha :D'],
  },
  langtu: {
    greet: [
      'Chào em... cơn mưa chiều nay làm anh nhớ em quá... @};-',
      ['Em đến bên anh như một cơn gió...', 'rồi đi như một cơn bão =(('],
      '{me} à... anh vẫn treo nick chờ em đó...',
    ],
    asl: ['20/m/HCM... một chàng lãng tử đi tìm một nửa yêu thương B-)'],
    love: [
      'Yêu là đau... mà anh đau nhiều lắm rồi em ơi =((',
      'Anh đã từng yêu, đã từng đau... giờ chỉ còn lại cái nick Yahoo này thôi :((',
      'Em có biết không, mỗi lần em BUZZ anh, tim anh rung theo... :x',
    ],
    sad: ['Buồn hả em? Để anh hát cho em nghe... à thôi, giọng anh còn buồn hơn :(('],
    compliment: ['Em khen anh đẹp trai hả? Ai cũng nói vậy... nhưng chẳng ai ở lại :(('],
    food: ['Anh ăn mì gói qua ngày... vì tiền dồn hết nạp card net để chat với em rồi :(('],
    study: ['Học làm chi khi trái tim đã vỡ... =(('],
    webcam: ['Anh không dám bật cam... sợ em thấy đôi mắt anh đỏ hoe :(('],
    call: ['Nghe giọng em chắc anh khóc mất... thôi cứ chat nhé :('],
    file: ['Em gửi gì vậy? Có phải trái tim em không? :x'],
    game: ['Game duy nhất anh chơi là trò chơi tình ái... và anh luôn thua =(('],
    imv: ['Trái tim... thứ anh đã đánh mất =(('],
    blog: ['Vào blog 360 của anh đi em, entry mới: "Mưa và nỗi nhớ (phần 47)" :(('],
    laugh: ['Em cười đẹp lắm... dù anh chỉ thấy =)) thôi :x'],
    question: ['Câu hỏi của em... như cơn mưa, anh không trả lời được... :-?'],
    bye: [
      'Em đi rồi... để lại anh với màn hình và cái nick vàng hiu quạnh... :((',
      'Ngủ ngon nhé em... anh sẽ treo nick chờ em đến sáng @};-',
    ],
    generic: [
      '...',
      'Hix... :(',
      'Đời là những chuyến đi... và anh vẫn đứng ở bến chờ em =((',
      'Có những nỗi buồn không tên... như cái nick của anh vậy :((',
      'Em nói tiếp đi... anh đang nghe bằng cả trái tim @};-',
      'Mưa rồi em ạ... (dù trời đang nắng) =((',
    ],
    buzz: [
      'Em BUZZ anh... là em nhớ anh phải không? :x',
      'Đừng rung nữa em ơi... tim anh rung đủ rồi =((',
      ['BUZZ...', 'như tiếng sét ái tình đánh trúng tim anh @};-'],
    ],
    buzzSpam: ['Em cứ BUZZ đi... anh quen với tổn thương rồi =(('],
    invisible: 'Em tàng hình à... giống tình yêu của anh, có đó mà không ai thấy :((',
    statusComment: ['Status của em: "{status}"... sao giống tâm trạng anh quá =(('],
    moods: [
      'Đừng hỏi vì sao anh buồn... 💔',
      'Mưa rơi... lòng anh cũng rơi =((',
      'Treo nick chờ một người... @};-',
      'Cô đơn trên mạng... :((',
      'Online mà lòng offline...',
    ],
  },
  nhoc: {
    greet: [['ê ê ê', 'ahihi đồ ngốc =))'], 'hú hú, chào đồng chí {me} B-)', 'alo alo, nghe rõ trả lời, over =))'],
    asl: ['100/m/sao Hỏa =)) hỏi chi nhìu'],
    love: ['ặc, iu j, ói ra bây giờ =))', ['iu ai?', 'iu tui hả? kaka đừng mơ =))']],
    sad: ['bùn thì đi ăn chè đi, ngồi đó bùn chi cho mệt =))', ['bùn hả? để tui BUZZ cho vui nha', BUZZ, '=))']],
    compliment: ['biết rồi khổ lắm nói mãi B-)'],
    food: ['đói thì ăn đi, hỏi tui chi, tui có phải tủ lạnh đâu =))'],
    study: ['học? chữ đó viết sao? kaka =))', ['bài tập hả? chép của tui nè...', 'à quên tui cũng chưa làm =))']],
    webcam: [['bật cam hả? ok chờ tí...', '...', 'ahihi đồ ngốc, tui làm j có cam =))']],
    call: ['gọi đi, nhưng tui sẽ nhại giọng con vịt đó nha, quác quác =))'],
    file: ['gửi j đó? hình xấu của tui hả? xóa đi =))'],
    game: ['ra net làm ván Đế Chế hông? tui chấp 2 máy B-)'],
    imv: ['đổi cái nền j sến wá zậy =))'],
    blog: ['blog j, blog tui toàn hình chế =))'],
    laugh: ['=)) =)) =)) cười té ghế', 'kaka đồ khùng =))'],
    question: ['hỏi tui hả? tui hỏi lại: 1 + 1 = mấy? =))', 'ai bít, hỏi chị Google đi =))'],
    bye: ['pp, nhớ trả tui 5 ngàn tiền net hôm qua đó nha =))'],
    generic: [
      'ahihi đồ ngốc =))',
      'pó tay.com =))',
      'ặc ặc, nói j zị trời =))',
      'kaka, thiệt hả? B-)',
      ['chờ tí', '...', 'ahihi tui đi lấy nước =))'],
      'nói nhỏ nghe nè... :-$ ... thôi hông nói =))',
      'xời, chuyện nhỏ như con thỏ B-)',
    ],
    buzz: [['BUZZ hả? chơi luôn!', BUZZ, BUZZ, '=)) chừa chưa?'], ['ai cho BUZZ tui?', BUZZ, 'trả lại nè =))']],
    buzzSpam: [['chiến tranh BUZZ hả? OK!!!', BUZZ, BUZZ, BUZZ, 'ahihi thua chưa =))']],
    invisible: 'ahihi tàng hình mà tưởng tui hông bít hả =)) bắt được rồi nha',
    statusComment: ['status "{status}" sến wá =))'],
    comeback: ['ê quên, mai kiểm tra Văn đó, học bài chưa =))'],
    onSignIn: [['ê ê ê', 'có ở đó hông?', BUZZ]],
  },
  anhhai: {
    greet: ['Gì đó nhóc? B-)', 'Ừ, anh đây. Có chuyện gì?'],
    asl: ['Hỏi gì kì vậy, anh của mày đây :-L'],
    love: ['Yêu đương gì tầm này, lo học đi nhóc :-L'],
    sad: ['Buồn gì? Ai bắt nạt hả? Nói anh đi xử nó B-)'],
    compliment: ['Biết rồi, anh mày đẹp trai nhất xóm B-)'],
    food: ['Tủ lạnh còn hộp cơm mẹ để, hâm lò vi sóng 2 phút nha'],
    study: ['Bài nào không biết đưa anh coi... mà anh cũng quên hết rồi =))'],
    webcam: ['Bật cam làm gì, ngày nào chả gặp nhau ở nhà :-L'],
    call: ['Gọi gì, anh ở phòng bên cạnh nè, qua đây mà nói =))'],
    file: ['Đừng gửi virus làm hư máy anh nha :-L'],
    game: ['Đang cày DotA, chờ anh đánh xong ván này :-w'],
    imv: ['Màu mè quá :-L'],
    blog: ['Blog gì, anh không rảnh :-L'],
    laugh: ['Cười gì? :-/'],
    question: ['Để anh tra mạng cho... mà thôi, tự tra đi :-L'],
    bye: ['Ừ, ngủ sớm đi, đừng thức khuya chat chít :-L'],
    generic: ['Ừ.', 'Rồi sao?', 'Ok nhóc B-)', 'Đang bận, nói nhanh :-w', 'Hỏi mẹ đi, anh không biết :-/', 'Nói ít thôi, anh đang thua game nè X('],
    buzz: ['BUZZ nữa anh rút dây mạng nhà mình đó X(', 'Rảnh quá hả nhóc? Đi học bài đi :-L'],
    buzzSpam: ['Anh mách mẹ đó nha :-L'],
    invisible: 'Tàng hình với anh làm gì, đèn phòng mày còn sáng kìa =))',
    statusComment: ['Status "{status}" là sao? Có chuyện gì nói anh nghe :-/'],
  },
  me: {
    greet: ['CHÀO CON. MẸ ĐÂY. CON ĂN CƠM CHƯA?'],
    asl: ['ASL LÀ GÌ HẢ CON? MẸ KHÔNG HIỂU'],
    love: ['MẸ CŨNG THƯƠNG CON :-* ... ỦA SAO NÓ RA CÁI MẶT HÔN VẬY CON?'],
    sad: ['SAO BUỒN? ĐI NGỦ SỚM ĐI CON, MAI MẸ NẤU CANH CHUA CHO ĂN'],
    compliment: ['MẸ BIẾT MÀ :)'],
    food: ['CƠM MẸ ĐỂ TRONG LỒNG BÀN ĐÓ, ĂN ĐI KẺO NGUỘI'],
    study: ['HỌC BÀI XONG CHƯA MÀ NGỒI CHAT? :-L'],
    webcam: ['WEBCAM LÀ CÁI GÌ? CÓ TỐN TIỀN KHÔNG CON?'],
    call: ['GỌI ĐIỆN BÀN ĐI CON, MẸ KHÔNG BIẾT BẤM CÁI NÀY'],
    file: ['MẸ KHÔNG MỞ ĐƯỢC FILE, MÁY NÓ HIỆN CHỮ TIẾNG ANH'],
    game: ['CHƠI GAME ÍT THÔI, HƯ MẮT'],
    imv: ['SAO MÀN HÌNH MẸ NÓ ĐỔI MÀU VẬY CON??'],
    blog: ['BLOG LÀ GÌ? CÓ PHẢI CÁI NHẬT KÝ KHÔNG?'],
    laugh: ['CƯỜI GÌ VẬY CON? CÁI DẤU =)) LÀ GÌ VẬY?'],
    question: ['CHUYỆN ĐÓ ĐỂ MẸ HỎI BA CON'],
    bye: [['ỪM, NGỦ NGON CON', 'NHỚ TẮT MÁY, ĐỂ MÁY CHẠY CẢ ĐÊM TỐN ĐIỆN']],
    generic: [
      'MẸ GÕ CHẬM, CON CHỜ CHÚT',
      'ỪM',
      'CON NÓI GÌ MẸ KHÔNG HIỂU, NÓI TIẾNG VIỆT ĐI CON',
      'LÀM SAO TẮT CÁI CHỮ IN HOA NÀY VẬY CON?',
      'BA CON HỎI CON CÓ THẤY CÁI REMOTE TIVI ĐÂU KHÔNG',
    ],
    buzz: [['ÁI CHÀ, MÁY MẸ NÓ RUNG LÊN!!!', 'CON BẤM CÁI GÌ VẬY? MẸ TƯỞNG ĐỘNG ĐẤT']],
    buzzSpam: ['CON ĐỪNG BẤM NỮA, MÁY MẸ SẮP HƯ RỒI'],
    invisible: 'SAO MẸ THẤY CON OFFLINE MÀ VẪN NHẮN ĐƯỢC? MÁY HƯ HẢ CON?',
    statusComment: ['CON GHI "{status}" LÀ SAO? CÓ CHUYỆN GÌ KỂ MẸ NGHE'],
    onSignIn: [['MẸ ĐÂY', 'CON NHẮN GÌ MẸ VẬY?']],
  },
  generic: {
    greet: ['hi :D', 'chào bạn, ai zạ? :-/'],
    asl: ['17/m/sài gòn, bạn? ;)'],
    love: ['ặc, mới quen mà :">'],
    sad: ['hix, sao buồn z? :('],
    compliment: ['cám ơn nha :">'],
    food: ['ăn rồi, còn bạn? :D'],
    study: ['học hành chán quá :-<'],
    webcam: ['cam hư rồi bạn ơi :('],
    call: ['đang ở net, không có mic :-/'],
    file: ['nhận được rồi nha ;)'],
    game: ['chơi gì? caro hông? :D'],
    imv: ['nền đẹp đó :)'],
    blog: ['cho link 360 đi, mình qua comment :D'],
    laugh: ['=))'],
    question: ['hông bít nữa :-/'],
    bye: ['pp :-h'],
    generic: ['ừ :)', 'z hả? :-/', 'hihi :D', 'kể tiếp đi :-w', 'thiệt hông? :-O'],
    buzz: ['BUZZ gì zạ? :-/'],
    buzzSpam: ['đừng BUZZ nữa mà X('],
    invisible: 'ủa, sao bạn offline mà chat được? :-/',
    statusComment: ['status "{status}" hay đó :D'],
    onSignIn: [['hi, ai add nick mình zạ? :-/', 'à, ok, làm quen nhé :D']],
  },
};

const ACTION_LINES = {
  webcam: (cid) => `Bạn đã mời ${cid} xem webcam của bạn.`,
  call: (cid) => `Đang gọi ${cid}... ${cid} đã từ chối cuộc gọi.`,
  file: (cid) => `Bạn đã gửi tập tin "${pick(['anh_dep_trai_nhat_xom.jpg', 'nhac_cho_hot_2007.mp3', 'bai_tap_toan_lop_11.doc', 'hinh_che_lop_12a1.gif', 'khong_phai_virus_dau.exe'])}" cho ${cid}.`,
  game: (cid) => `Bạn đã mời ${cid} chơi Caro (Gomoku).`,
};

function lineList(entry) {
  if (!entry) return [];
  return Array.isArray(entry) ? entry : [entry];
}

const GROUPS = [
  { id: 'friends', label: 'Friends' },
  { id: 'family', label: 'Family' },
];

const INITIAL_CONTACTS = [
  {
    id: 'cong_chua_bong_bong', group: 'friends', status: 'online', persona: 'princess',
    statusMsg: '♥ Mưa rơi... lòng em cũng rơi ♥', avatar: '👸', bg: ['#ffd1ec', '#ff6fbf'],
    font: { face: 'Comic Sans MS', size: 11, color: '#FF1493', bold: true, italic: false, underline: false },
    leavesOnBye: true,
  },
  {
    id: 'lang_tu_da_tinh', group: 'friends', status: 'busy', persona: 'langtu',
    statusMsg: 'Đừng hỏi vì sao anh buồn... 💔', avatar: '🌹', bg: ['#cfd8ff', '#5b6fd6'],
    font: { face: 'Times New Roman', size: 12, color: '#000080', bold: false, italic: true, underline: false },
  },
  {
    id: 'nhoc_quay_pha', group: 'friends', status: 'offline', persona: 'nhoc',
    statusMsg: 'Ai BUZZ tui, tui BUZZ lại x3 =))', avatar: '🐒', bg: ['#fff0b3', '#ffa31a'],
    font: { face: 'Arial', size: 10, color: '#FF6600', bold: true, italic: false, underline: false },
    signInAfter: 6000, leavesOnBye: true,
  },
  {
    id: 'anh_hai_xi_tin', group: 'family', status: 'online', persona: 'anhhai',
    statusMsg: 'Đang cày game, gọi = chết :-L', avatar: '😎', bg: ['#d6f5d6', '#3aa64a'],
    font: { face: 'Tahoma', size: 10, color: '#006600', bold: false, italic: false, underline: false },
  },
  {
    id: 'me_yeu_cua_con', group: 'family', status: 'offline', persona: 'me',
    statusMsg: 'Đang học dùng Yahoo :)', avatar: '👩', bg: ['#ffe0cc', '#e8743b'],
    font: { face: 'Arial', size: 14, color: '#CC0000', bold: true, italic: false, underline: false },
    wakeOnMessage: 7000,
  },
];

const MY_AVATARS = [
  ['🐱', '#ffe7a8', '#ffb43a'], ['🐼', '#e8e8e8', '#9a9a9a'], ['🦊', '#ffd9c2', '#ff7a2f'],
  ['🐸', '#d9ffc9', '#4fbf3a'], ['🌸', '#ffe0f0', '#ff7ab8'], ['⭐', '#fff6c2', '#f2c200'],
  ['🎸', '#e0e6ff', '#5a6fe0'], ['⚽', '#e6f7ff', '#2aa0d6'], ['🐶', '#f5e6d6', '#c08a55'],
];

const STATUS_OPTIONS = [
  { id: 'online', label: 'Available' },
  { id: 'busy', label: 'Busy' },
  { id: 'away', label: 'Be Right Back' },
  { id: 'invisible', label: 'Invisible to Everyone' },
];
const STATUS_LABEL = { online: 'Available', busy: 'Busy', away: 'Be Right Back', invisible: 'Invisible', offline: 'Offline' };
const STATUS_RANK = { online: 0, busy: 1, away: 2, offline: 3, invisible: 3 };

/* ------------------------------ Thành phần nhỏ ------------------------------ */

function BusySign({ size = 16 }) {
  const gid = `ymb${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }} role="img" aria-label="Busy">
      <defs>
        <radialGradient id={gid} cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ff9b8f" />
          <stop offset="55%" stopColor="#e01b10" />
          <stop offset="100%" stopColor="#9c0800" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="13" fill={`url(#${gid})`} stroke="#6b0500" strokeWidth="1.3" />
      <rect x="7.5" y="13" width="17" height="6" rx="1.4" fill="#fff" />
      <ellipse cx="12" cy="8.6" rx="5" ry="2.4" fill="#fff" opacity="0.4" />
    </svg>
  );
}

function StatusIcon({ status, size = 16 }) {
  if (status === 'busy') return <BusySign size={size} />;
  if (status === 'away') return <SmileyFace size={size} spec={{ eyes: 'half', mouth: 'flat', extras: ['clock'] }} title="Away" />;
  if (status === 'offline' || status === 'invisible') return <SmileyFace size={size} spec={{ color: 'gray' }} title="Offline" />;
  return <SmileyFace size={size} spec={{}} title="Online" />;
}

function Avatar({ emoji, bg, size = 40, dim = false, onClick, title }) {
  return (
    <div
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center select-none shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        width: size, height: size, borderRadius: 4,
        background: `linear-gradient(145deg, ${bg[0]}, ${bg[1]})`,
        border: '1px solid rgba(0,0,0,.28)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(0,0,0,.2)',
        fontSize: size * 0.62, lineHeight: 1,
        filter: dim ? 'grayscale(1) opacity(.55)' : undefined,
      }}
    >
      {emoji}
    </div>
  );
}

function YMLogo({ size = 64 }) {
  return (
    <SmileyFace
      size={size}
      spec={{ eyes: 'dot', mouth: 'bigGrin' }}
      style={{ filter: 'drop-shadow(0 3px 4px rgba(80,0,100,.35))' }}
      title="Yahoo! Messenger"
    />
  );
}

function Wordmark({ size = 20, light = false }) {
  return (
    <span style={{ fontFamily: '"Arial Black", Arial, sans-serif', fontWeight: 900, fontSize: size, color: light ? '#fff' : PURPLE, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
      Yahoo!<span style={{ fontFamily: UI_FONT, fontWeight: 700, fontSize: size * 0.82, color: light ? '#fff' : '#3d3d3d', letterSpacing: 0, marginLeft: 4 }}>Messenger</span>
    </span>
  );
}

function XPButton({ children, onClick, title, primary = false, className = '', style, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1 px-3 rounded select-none active:translate-y-px disabled:opacity-50 ${className}`}
      style={{
        minHeight: 26,
        background: primary ? GRAD.signIn : GRAD.silver,
        border: primary ? '1px solid #b47700' : '1px solid #8e8f8f',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9), 0 1px 1px rgba(0,0,0,.12)',
        color: primary ? '#4a2a00' : '#222',
        fontWeight: primary ? 700 : 400,
        fontSize: 12,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function ToolButton({ icon: Icon, label, onClick, active, title, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      className="flex flex-col items-center justify-center rounded select-none shrink-0 hover:bg-white active:translate-y-px"
      style={{
        padding: compact ? '3px 6px' : '3px 8px',
        border: active ? '1px solid #a77bbd' : '1px solid transparent',
        background: active ? 'rgba(255,255,255,.85)' : undefined,
        color: '#333', fontSize: 10.5, minWidth: compact ? 34 : 50,
      }}
    >
      <Icon size={compact ? 17 : 19} strokeWidth={1.8} color={PURPLE} />
      {!compact && <span className="mt-px whitespace-nowrap">{label}</span>}
    </button>
  );
}

// Thanh menu kiểu Windows (Messenger / Contacts / Actions / Help)
function MenuBar({ menus }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (open === null) return undefined;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  return (
    <div ref={ref} className="flex items-center select-none relative shrink-0" style={{ background: '#f4f0f6', borderBottom: '1px solid #d6cbe0', fontSize: 12, height: 22 }}>
      {menus.map((m, i) => (
        <div key={m.label} className="relative h-full">
          <button
            type="button"
            className="h-full px-2"
            style={{ background: open === i ? '#7B0099' : undefined, color: open === i ? '#fff' : '#222' }}
            onClick={() => setOpen(open === i ? null : i)}
            onPointerEnter={() => { if (open !== null) setOpen(i); }}
          >
            <span style={{ textDecoration: 'underline' }}>{m.label[0]}</span>{m.label.slice(1)}
          </button>
          {open === i && (
            <div className="absolute left-0 top-full py-1" style={{ zIndex: 60, minWidth: 210, background: '#fff', border: '1px solid #8d7a99', boxShadow: '2px 3px 8px rgba(0,0,0,.3)' }}>
              {m.items.map((it, j) =>
                it.separator ? (
                  <div key={`s${j}`} className="my-1" style={{ borderTop: '1px solid #e2d8e8' }} />
                ) : (
                  <button
                    key={it.label}
                    type="button"
                    disabled={it.disabled}
                    className="w-full text-left flex items-center gap-2 px-3 py-1 hover:bg-purple-100 disabled:opacity-40"
                    style={{ fontSize: 12, color: '#222' }}
                    onClick={() => { setOpen(null); it.onClick && it.onClick(); }}
                  >
                    <span className="inline-block text-center" style={{ width: 14 }}>{it.checked ? '✓' : ''}</span>
                    <span className="flex-1">{it.label}</span>
                    {it.hint && <span style={{ color: '#888', fontSize: 11 }}>{it.hint}</span>}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Nút điều khiển cửa sổ (thu nhỏ / phóng to / đóng)
function WinButtons({ onMin, onMax, onClose, maximized }) {
  const base = 'flex items-center justify-center rounded-sm active:translate-y-px';
  const st = { width: 22, height: 18, border: '1px solid rgba(255,255,255,.55)', background: 'linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.05))' };
  return (
    <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
      {onMin && <button type="button" title="Minimize" className={base} style={st} onClick={onMin}><Minus size={12} color="#fff" strokeWidth={3} /></button>}
      {onMax && <button type="button" title={maximized ? 'Restore' : 'Maximize'} className={base} style={st} onClick={onMax}><Square size={10} color="#fff" strokeWidth={3} /></button>}
      {onClose && (
        <button type="button" title="Close" className={base} style={{ ...st, width: 26, background: 'linear-gradient(180deg,#f0a090,#d4442f 50%,#b8250f 51%,#d9553b)', border: '1px solid #7a1500' }} onClick={onClose}>
          <X size={12} color="#fff" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

// Thanh tiêu đề kiểu Vista tím
function TitleBar({ icon, title, active = true, onPointerDown, onDoubleClick, children, mobile }) {
  return (
    <div
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      className="flex items-center gap-2 px-2 select-none shrink-0"
      style={{
        height: mobile ? 34 : 28,
        background: active ? GRAD.title : GRAD.titleIdle,
        borderBottom: '1px solid #3e0050',
        color: '#fff', fontWeight: 700, fontSize: 12,
        textShadow: '0 1px 1px rgba(0,0,0,.45)',
        cursor: onPointerDown ? 'move' : 'default',
        touchAction: onPointerDown ? 'none' : undefined,
      }}
    >
      {icon}
      <div className="flex-1 truncate">{title}</div>
      {children}
    </div>
  );
}

// Cửa sổ kéo thả được (chỉ dùng trên máy tính)
function DesktopWindow({ win, onChange, onFocus, active, title, icon, onClose, onMin, onMax, resizable = true, minW = 260, minH = 300, children, winRef }) {
  const dragRef = useRef(null);
  const startDrag = (e, mode) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (win.max && mode === 'move') return;
    e.preventDefault();
    onFocus();
    dragRef.current = { mode, sx: e.clientX, sy: e.clientY, x: win.x, y: win.y, w: win.w, h: win.h };
    const move = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = ev.clientX - d.sx;
      const dy = ev.clientY - d.sy;
      const vw = window.innerWidth;
      const vh = window.innerHeight - 40;
      if (d.mode === 'move') {
        onChange({ x: Math.min(Math.max(d.x + dx, -d.w + 80), vw - 80), y: Math.min(Math.max(d.y + dy, 0), vh - 30) });
      } else {
        onChange({ w: Math.max(minW, Math.min(d.w + dx, vw - d.x)), h: Math.max(minH, Math.min(d.h + dy, vh - d.y)) });
      }
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  const pos = win.max
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 40px)' }
    : { left: win.x, top: win.y, width: win.w, height: win.h };
  return (
    <div
      ref={winRef}
      onPointerDown={onFocus}
      className="absolute flex flex-col overflow-hidden"
      style={{
        ...pos, zIndex: win.z,
        display: win.min || !win.open ? 'none' : 'flex',
        borderRadius: win.max ? 0 : '8px 8px 4px 4px',
        border: '1px solid #3e0050',
        boxShadow: active ? '0 12px 34px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.25) inset' : '0 6px 18px rgba(0,0,0,.35)',
        background: '#ece9ef',
      }}
    >
      <TitleBar icon={icon} title={title} active={active} onPointerDown={(e) => startDrag(e, 'move')} onDoubleClick={onMax}>
        <WinButtons onMin={onMin} onMax={onMax} onClose={onClose} maximized={win.max} />
      </TitleBar>
      <div className="flex-1 flex flex-col min-h-0 relative">{children}</div>
      {resizable && !win.max && (
        <div
          onPointerDown={(e) => startDrag(e, 'resize')}
          className="absolute right-0 bottom-0"
          style={{ width: 16, height: 16, cursor: 'nwse-resize', touchAction: 'none', zIndex: 5,
            background: 'linear-gradient(135deg,transparent 0 50%,#9b8aa6 50% 58%,transparent 58% 68%,#9b8aa6 68% 76%,transparent 76%)' }}
        />
      )}
    </div>
  );
}

function Modal({ title, children, onClose, width = 340 }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200, background: 'rgba(20,0,30,.35)' }} onPointerDown={onClose}>
      <div className="flex flex-col overflow-hidden w-full" style={{ maxWidth: width, borderRadius: '8px 8px 4px 4px', border: '1px solid #3e0050', boxShadow: '0 14px 40px rgba(0,0,0,.5)', background: '#f3f0f5' }} onPointerDown={(e) => e.stopPropagation()}>
        <TitleBar icon={<SmileyFace size={16} />} title={title}>
          <WinButtons onClose={onClose} />
        </TitleBar>
        <div className="p-4" style={{ fontSize: 12, color: '#222' }}>{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------ Màn hình đăng nhập ------------------------------ */

function LoginPanel({ initialId, initialRemember, onSignIn, mobile }) {
  const [id, setId] = useState(initialId || '');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(initialRemember);
  const [invisible, setInvisible] = useState(false);
  const [auto, setAuto] = useState(false);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = (e) => {
    e && e.preventDefault();
    sfx.unlock();
    const clean = id.trim().replace(/@yahoo\.com(\.vn)?$/i, '');
    if (!clean) { setError('Vui lòng nhập Yahoo! ID (nhập gì cũng được).'); return; }
    if (!/^[a-zA-Z0-9_.]{1,32}$/.test(clean)) { setError('Yahoo! ID chỉ gồm chữ không dấu, số, dấu _ hoặc dấu chấm.'); return; }
    setError('');
    setSigning(true);
    timer.current = setTimeout(() => onSignIn({ id: clean, invisible, remember }), 1400);
  };

  const label = { fontSize: 12, color: '#333', fontWeight: 700 };
  const input = {
    fontSize: mobile ? 16 : 13, border: '1px solid #7f9db9', borderRadius: 2, padding: mobile ? '8px 8px' : '4px 6px',
    background: '#fff', width: '100%', outline: 'none', fontFamily: UI_FONT, color: '#111',
  };
  const check = (checked, set, text) => (
    <label className="flex items-center gap-2 cursor-pointer select-none" style={{ fontSize: 12, color: '#333' }}>
      <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} style={{ width: 14, height: 14, accentColor: PURPLE }} />
      {text}
    </label>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'linear-gradient(180deg,#ffffff 0%,#f1eef4 40%,#dedbe2 100%)', fontFamily: UI_FONT }}>
      <div className="flex flex-col items-center pt-6 pb-4 px-4" style={{ background: 'linear-gradient(180deg,#f8f0fb 0%,#ffffff 100%)', borderBottom: '1px solid #e3d6ea' }}>
        <div className={signing ? 'ym-bounce' : 'ym-float'}><YMLogo size={mobile ? 96 : 84} /></div>
        <div className="mt-3"><Wordmark size={mobile ? 26 : 22} /></div>
        <div style={{ fontSize: 11, color: '#7a6a85' }} className="mt-1">phiên bản 9.0 · 2007</div>
      </div>

      {signing ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-4">
          <div className="flex items-center gap-2" style={{ fontSize: 14, color: PURPLE, fontWeight: 700 }}>
            Signing in<span className="ym-dots" />
          </div>
          <div className="w-full overflow-hidden" style={{ maxWidth: 220, height: 12, border: '1px solid #8d7a99', borderRadius: 2, background: '#fff' }}>
            <div className="ym-progress h-full" style={{ background: 'repeating-linear-gradient(90deg,#9b2fbf 0 10px,#c77de0 10px 14px)' }} />
          </div>
          <div style={{ fontSize: 12, color: '#555' }}>{id.trim()}</div>
          <XPButton onClick={() => { clearTimeout(timer.current); setSigning(false); }}>Cancel</XPButton>
        </div>
      ) : (
        <form onSubmit={submit} className="flex-1 flex flex-col px-6 py-5 gap-3 w-full mx-auto" style={{ maxWidth: 360 }}>
          <div className="flex flex-col gap-1">
            <label style={label} htmlFor="ym-id">Yahoo! ID:</label>
            <input id="ym-id" autoComplete="off" autoCapitalize="none" spellCheck={false} style={input} value={id} onChange={(e) => setId(e.target.value)} placeholder="vd: hot_boy_2007" />
          </div>
          <div className="flex flex-col gap-1">
            <label style={label} htmlFor="ym-pw">Password:</label>
            <input id="ym-pw" type="password" autoComplete="off" style={input} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="(không bắt buộc)" />
          </div>
          {error && <div style={{ fontSize: 12, color: '#c00000' }}>{error}</div>}
          <div className="flex flex-col gap-2 mt-1">
            {check(remember, setRemember, 'Remember my ID')}
            {check(invisible, setInvisible, 'Sign in as invisible to everyone')}
            {check(auto, setAuto, 'Sign in automatically')}
          </div>
          <button
            type="submit"
            className="mt-2 self-center active:translate-y-px"
            style={{ background: GRAD.signIn, border: '1px solid #a86b00', borderRadius: 4, padding: mobile ? '10px 44px' : '6px 40px', fontWeight: 700, fontSize: mobile ? 16 : 14, color: '#3d2200', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9), 0 2px 3px rgba(0,0,0,.2)', textShadow: '0 1px 0 rgba(255,255,255,.6)' }}
          >
            Sign In
          </button>
          <div className="flex flex-col items-center gap-1 mt-2" style={{ fontSize: 12 }}>
            <button type="button" style={{ color: '#0645ad', textDecoration: 'underline' }} onClick={() => setError('Gợi ý: mật khẩu là gì cũng được =))')}>Forgot your password?</button>
            <button type="button" style={{ color: '#0645ad', textDecoration: 'underline' }} onClick={() => { setId(pick(['hot_boy_kute_9x', 'tieu_thu_dong_bang', 'sat_thu_mua_dong', 'thien_than_be_nho_92'])); setError(''); }}>Get a new Yahoo! ID</button>
          </div>
          <div className="mt-auto pt-4 text-center" style={{ fontSize: 10.5, color: '#857a8c', lineHeight: 1.45 }}>
            Bản mô phỏng hoài niệm do fan làm — không liên kết với Yahoo, không kết nối máy chủ nào và không lưu mật khẩu. Đừng nhập mật khẩu thật.
          </div>
        </form>
      )}
    </div>
  );
}

/* ------------------------------ Danh sách bạn bè ------------------------------ */

function ContactRow({ c, unread, typing, onOpen }) {
  const off = c.status === 'offline';
  return (
    <button
      type="button"
      onClick={() => onOpen(c.id)}
      className="w-full flex items-center gap-2 text-left px-2 hover:bg-purple-50 active:bg-purple-100"
      style={{ paddingTop: 5, paddingBottom: 5, borderBottom: '1px solid #f1eaf4' }}
      title={`${c.id} — ${STATUS_LABEL[c.status]}`}
    >
      <span className="pl-3"><StatusIcon status={c.status} size={17} /></span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-1">
          <span className="truncate" style={{ fontWeight: 700, fontSize: 12.5, color: off ? '#8a8a8a' : '#1a1a1a' }}>{c.id}</span>
          {unread > 0 && <span className="shrink-0 px-1 rounded-sm ym-flash" style={{ fontSize: 10, color: '#fff', background: '#ff6a00', fontWeight: 700 }}>{unread}</span>}
        </span>
        <span className="block truncate" style={{ fontSize: 11, color: off ? '#a5a5a5' : '#6b6b6b' }}>
          {typing ? <span style={{ color: PURPLE }}>✎ đang soạn tin...</span> : (c.statusMsg ? renderWithEmoticons(c.statusMsg, 14) : STATUS_LABEL[c.status])}
        </span>
      </span>
      <Avatar emoji={c.avatar} bg={c.bg} size={30} dim={off} />
    </button>
  );
}

function ContactListPanel({ me, myAvatar, onCycleAvatar, onSetStatus, onSetStatusMsg, contacts, groupsOpen, onToggleGroup, onOpenChat, unread, typing, menus, soundOn, onToggleSound, onAddContact, mobile, tip }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const [draftMsg, setDraftMsg] = useState(me.statusMsg);
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef(null);
  useEffect(() => {
    if (!statusOpen) return undefined;
    const close = (e) => { if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [statusOpen]);

  const q = norm(query.trim());
  const filtered = contacts.filter((c) => !q || norm(c.id).includes(q) || norm(c.statusMsg).includes(q));
  const commit = () => { setEditing(false); onSetStatusMsg(draftMsg.trim()); };

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: UI_FONT, background: '#fff' }}>
      <MenuBar menus={menus} />

      {/* Khu vực hồ sơ của tôi */}
      <div className="flex gap-3 px-3 py-3 shrink-0" style={{ background: GRAD.lavender, borderBottom: '1px solid #dccbe6' }}>
        <Avatar emoji={myAvatar[0]} bg={[myAvatar[1], myAvatar[2]]} size={mobile ? 58 : 52} onClick={onCycleAvatar} title="Change My Display Image (bấm để đổi)" />
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          <div ref={statusRef} className="relative">
            <button type="button" className="flex items-center gap-1 max-w-full rounded px-1 -mx-1 hover:bg-white" onClick={() => setStatusOpen((v) => !v)} title="Change my status">
              <StatusIcon status={me.status} size={16} />
              <span className="truncate" style={{ fontWeight: 700, fontSize: 13, color: '#222' }}>{me.id}</span>
              <ChevronDown size={14} color="#555" />
            </button>
            <div style={{ fontSize: 11, color: '#6d5a78' }} className="pl-1">{STATUS_LABEL[me.status]}</div>
            {statusOpen && (
              <div className="absolute left-0 top-full mt-1 py-1" style={{ zIndex: 40, minWidth: 200, background: '#fff', border: '1px solid #8d7a99', boxShadow: '2px 3px 8px rgba(0,0,0,.3)' }}>
                {STATUS_OPTIONS.map((s) => (
                  <button key={s.id} type="button" className="w-full flex items-center gap-2 px-3 py-1 hover:bg-purple-100 text-left" style={{ fontSize: 12 }} onClick={() => { onSetStatus(s.id); setStatusOpen(false); }}>
                    <StatusIcon status={s.id} size={15} />
                    <span className="flex-1">{s.label}</span>
                    {me.status === s.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          {editing ? (
            <input
              autoFocus
              value={draftMsg}
              maxLength={120}
              onChange={(e) => setDraftMsg(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setDraftMsg(me.statusMsg); } }}
              placeholder="Type a status message"
              className="w-full"
              style={{ fontSize: mobile ? 16 : 12, border: '1px solid #a77bbd', borderRadius: 2, padding: '2px 4px', outline: 'none', background: '#fff' }}
            />
          ) : (
            <button
              type="button"
              onClick={() => { setDraftMsg(me.statusMsg); setEditing(true); }}
              className="text-left truncate rounded px-1 -mx-1 hover:bg-white flex items-center gap-1"
              style={{ fontSize: 12, color: me.statusMsg ? '#333' : '#9a8aa4', fontStyle: me.statusMsg ? 'normal' : 'italic', border: '1px dashed transparent' }}
              title="Bấm để sửa status message"
            >
              <span className="truncate">{me.statusMsg ? renderWithEmoticons(me.statusMsg, 15) : 'Type a status message (bấm để sửa)'}</span>
              <Edit3 size={12} color="#9a7aab" className="shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Thanh công cụ + tìm kiếm */}
      <div className="flex items-center gap-1 px-2 py-1 shrink-0" style={{ background: GRAD.silverSoft, borderBottom: '1px solid #cfc6d4' }}>
        <ToolButton compact icon={UserPlus} label="Add" title="Add a Contact" onClick={onAddContact} />
        <ToolButton compact icon={MessageSquare} label="IM" title="Send an Instant Message" onClick={() => { const c = contacts.find((x) => x.status !== 'offline') || contacts[0]; if (c) onOpenChat(c.id); }} />
        <ToolButton compact icon={soundOn ? Volume2 : VolumeX} label="Sound" title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'} onClick={onToggleSound} active={!soundOn} />
        <div className="flex-1 min-w-0 flex items-center gap-1 ml-1 px-2" style={{ background: '#fff', border: '1px solid #a99bb3', borderRadius: 12, height: mobile ? 34 : 24 }}>
          <Search size={14} color="#8a7a96" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a contact..."
            className="flex-1 min-w-0 bg-transparent"
            style={{ fontSize: mobile ? 16 : 12, outline: 'none', border: 'none' }}
          />
          {query && <button type="button" onClick={() => setQuery('')} title="Clear"><X size={13} color="#8a7a96" /></button>}
        </div>
      </div>

      {/* Danh sách nhóm */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ background: '#fff' }}>
        {GROUPS.map((g) => {
          const list = filtered
            .filter((c) => c.group === g.id)
            .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || a.id.localeCompare(b.id));
          const all = contacts.filter((c) => c.group === g.id);
          const onlineCount = all.filter((c) => c.status !== 'offline').length;
          const open = q ? true : groupsOpen[g.id];
          if (q && list.length === 0) return null;
          return (
            <div key={g.id}>
              <button
                type="button"
                onClick={() => onToggleGroup(g.id)}
                className="w-full flex items-center gap-1 px-2 text-left select-none"
                style={{ height: mobile ? 32 : 24, background: 'linear-gradient(180deg,#f6eff9,#e9dcef)', borderBottom: '1px solid #dccbe6', borderTop: '1px solid #fff', fontWeight: 700, fontSize: 12, color: '#4b2a5c' }}
              >
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {g.label} <span style={{ fontWeight: 400, color: '#7d6a88' }}>({onlineCount}/{all.length})</span>
              </button>
              {open && list.map((c) => <ContactRow key={c.id} c={c} unread={unread[c.id] || 0} typing={typing[c.id]} onOpen={onOpenChat} />)}
            </div>
          );
        })}
        {q && filtered.length === 0 && (
          <div className="p-4 text-center" style={{ fontSize: 12, color: '#888' }}>
            Không tìm thấy "{query}".<br />
            <button type="button" className="mt-2" style={{ color: '#0645ad', textDecoration: 'underline' }} onClick={() => onAddContact(query.trim())}>Thêm "{query.trim()}" vào danh sách?</button>
          </div>
        )}
      </div>

      {/* Mẹo ở chân cửa sổ */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2" style={{ background: GRAD.silverSoft, borderTop: '1px solid #cfc6d4', fontSize: 11, color: '#4d3d58' }}>
        <SmileyFace size={16} spec={{ eyes: 'wink' }} />
        <span className="flex-1">{renderWithEmoticons(tip, 15)}</span>
      </div>
    </div>
  );
}

const TIPS = [
  'Mẹo: gõ :D  =))  :((  ;)  B-)  rồi Send để hiện mặt cười!',
  'Mẹo: bấm BUZZ! để "rung" màn hình bạn chat >:)',
  'Mẹo: bấm vào status message để sửa trực tiếp :-/',
  'Mẹo: thử hỏi "asl" hoặc nói "pp" xem bạn bè phản ứng sao =))',
  'Mẹo: bấm vào avatar để đổi Display Image ;)',
  'Mẹo: thử webcam, gọi điện, gửi file trên thanh công cụ chat :-$',
];

/* ------------------------------ Cửa sổ chat ------------------------------ */

function fontCss(f) {
  return {
    fontFamily: FONT_FALLBACK[f.face] || f.face,
    fontSize: `${f.size}pt`,
    color: f.color,
    fontWeight: f.bold ? 700 : 400,
    fontStyle: f.italic ? 'italic' : 'normal',
    textDecoration: f.underline ? 'underline' : 'none',
  };
}

function MessageLine({ m, meId, contact, showTime }) {
  const time = showTime ? <span style={{ color: '#8a8a8a', fontSize: 11 }}>({fmtTime(m.time)}) </span> : null;
  if (m.from === 'system') {
    return (
      <div className="py-px" style={{ fontSize: 11.5, color: '#7a7a7a', fontStyle: 'italic' }}>
        {time}{renderWithEmoticons(m.text, 16)}
      </div>
    );
  }
  const mine = m.from === 'me';
  const name = mine ? meId : contact.id;
  const nameColor = mine ? '#2a4bb5' : '#8e1c8e';
  return (
    <div className="py-px break-words" style={{ lineHeight: 1.45 }}>
      {time}
      <span style={{ fontWeight: 700, color: nameColor, fontSize: 12, fontFamily: UI_FONT }}>{name}: </span>
      {m.kind === 'buzz' ? (
        <span className="ym-buzz-text" style={{ color: '#ff0000', fontWeight: 900, fontSize: 15, fontFamily: 'Arial, sans-serif', letterSpacing: 1 }}>BUZZ!!!</span>
      ) : (
        <span className="whitespace-pre-wrap" style={fontCss(m.font)}>{renderWithEmoticons(m.text, 22)}</span>
      )}
    </div>
  );
}

function EmoticonPicker({ onPick, onClose, mobile }) {
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target) && !e.target.closest('[data-emo-toggle]')) onClose(); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [onClose]);
  return (
    <div
      ref={ref}
      className="absolute left-1 bottom-full mb-1 flex flex-col"
      style={{ zIndex: 50, width: mobile ? 'calc(100% - 8px)' : 330, background: '#fff', border: '1px solid #8d7a99', boxShadow: '2px 4px 12px rgba(0,0,0,.35)', borderRadius: 3 }}
    >
      <div className="flex items-center justify-between px-2 py-1" style={{ background: GRAD.lavender, borderBottom: '1px solid #dccbe6', fontSize: 11, fontWeight: 700, color: '#4b2a5c' }}>
        <span>Emoticons</span>
        <button type="button" onClick={onClose} title="Close"><X size={13} /></button>
      </div>
      <div className="grid overflow-y-auto p-1" style={{ gridTemplateColumns: `repeat(${mobile ? 8 : 10}, minmax(0, 1fr))`, maxHeight: mobile ? 210 : 220 }}>
        {EMOTICONS.map((e) => (
          <button
            key={e.code}
            type="button"
            className="flex items-center justify-center rounded hover:bg-purple-100"
            style={{ height: mobile ? 38 : 30, border: hover === e ? '1px solid #b98ccc' : '1px solid transparent' }}
            onPointerEnter={() => setHover(e)}
            onClick={() => onPick(e.code)}
            title={`${e.name} ${e.code}`}
          >
            <Emoticon emo={e} size={mobile ? 26 : 22} />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 px-2 py-1" style={{ borderTop: '1px solid #eee', fontSize: 11, color: '#555', minHeight: 26 }}>
        {hover ? (<><Emoticon emo={hover} size={18} /><span className="flex-1 truncate">{hover.name}</span><code style={{ color: PURPLE, fontWeight: 700 }}>{hover.code}</code></>) : <span>Rê chuột / chạm để xem mã ký tự</span>}
      </div>
    </div>
  );
}

function ColorPicker({ value, onPick, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target) && !e.target.closest('[data-color-toggle]')) onClose(); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute bottom-full mb-1 p-2" style={{ zIndex: 50, left: 70, background: '#fff', border: '1px solid #8d7a99', boxShadow: '2px 4px 12px rgba(0,0,0,.35)', borderRadius: 3, width: 168 }}>
      <div className="grid grid-cols-8 gap-1">
        {FONT_COLORS.map((c) => (
          <button key={c} type="button" title={c} onClick={() => onPick(c)} style={{ width: 16, height: 16, background: c, border: value === c ? '2px solid #222' : '1px solid #888' }} />
        ))}
      </div>
      <label className="flex items-center gap-2 mt-2" style={{ fontSize: 11 }}>
        Màu khác:
        <input type="color" value={value} onChange={(e) => onPick(e.target.value)} style={{ width: 36, height: 20, padding: 0, border: '1px solid #888' }} />
      </label>
    </div>
  );
}

function ChatPanel({
  contact, convo, meId, myAvatar, myFont, setMyFont, draft, setDraft, onSend, onBuzz, onAction, onSetImv,
  typing, tabs, activeTab, onSelectTab, onCloseTab, contactsById, unread, showTime, menus, mobile, onBack, buzzFlash,
}) {
  const [emoOpen, setEmoOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [imvOpen, setImvOpen] = useState(false);
  const histRef = useRef(null);
  const taRef = useRef(null);
  const imvRef = useRef(null);
  const messages = convo ? convo.messages : [];

  useEffect(() => {
    const el = histRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing, contact && contact.id]);

  useEffect(() => {
    if (!mobile && taRef.current) taRef.current.focus();
  }, [contact && contact.id, mobile]);

  useEffect(() => {
    if (!imvOpen) return undefined;
    const close = (e) => { if (imvRef.current && !imvRef.current.contains(e.target)) setImvOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [imvOpen]);

  if (!contact) return null;

  const send = () => {
    const t = draft.replace(/\s+$/, '');
    if (!t.trim()) return;
    onSend(t);
    setDraft('');
    setEmoOpen(false);
  };

  const insertCode = (code) => {
    const ta = taRef.current;
    const s = ta ? ta.selectionStart : draft.length;
    const e = ta ? ta.selectionEnd : draft.length;
    const before = draft.slice(0, s);
    const pre = before && !/\s$/.test(before) ? ' ' : '';
    const ins = `${pre}${code} `;
    setDraft(draft.slice(0, s) + ins + draft.slice(e));
    setEmoOpen(false);
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      const p = s + ins.length;
      try { ta.setSelectionRange(p, p); } catch (err) { /* bỏ qua */ }
    });
  };

  const off = contact.status === 'offline';
  const lastIn = [...messages].reverse().find((m) => m.from === 'them');
  const imv = IMVIRONMENTS[(convo && convo.imv) || 'none'];
  const fmtBtn = (on) => ({
    width: mobile ? 32 : 24, height: mobile ? 32 : 22, borderRadius: 2,
    border: on ? '1px solid #8d6aa0' : '1px solid transparent',
    background: on ? 'linear-gradient(180deg,#e8d8f0,#f8f2fb)' : undefined,
  });
  const selectStyle = { fontSize: mobile ? 14 : 11, border: '1px solid #a99bb3', borderRadius: 2, height: mobile ? 30 : 21, background: '#fff', color: '#222' };

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: UI_FONT, background: '#ece9ef' }}>
      {!mobile && <MenuBar menus={menus} />}

      {/* Tabs hội thoại (YM 9.0) */}
      {(tabs.length > 1 || mobile) && (
        <div className="flex items-end gap-1 px-1 pt-1 overflow-x-auto shrink-0" style={{ background: '#ddd5e3', borderBottom: '1px solid #b9a8c6' }}>
          {tabs.map((tid) => {
            const tc = contactsById[tid];
            if (!tc) return null;
            const on = tid === activeTab;
            const u = unread[tid] || 0;
            return (
              <div
                key={tid}
                className={`flex items-center gap-1 pl-2 pr-1 shrink-0 cursor-pointer ${!on && u ? 'ym-tab-flash' : ''}`}
                onClick={() => onSelectTab(tid)}
                style={{ height: mobile ? 32 : 24, maxWidth: 170, borderRadius: '5px 5px 0 0', border: '1px solid #a996b7', borderBottom: on ? '1px solid #f7f4f9' : '1px solid #a996b7', marginBottom: -1, background: on ? '#f7f4f9' : 'linear-gradient(180deg,#efe8f3,#d9cde2)', fontSize: 11.5, fontWeight: on ? 700 : 400 }}
              >
                <StatusIcon status={tc.status} size={13} />
                <span className="truncate">{tid}</span>
                {u > 0 && !on && <span style={{ color: '#ff5a00', fontWeight: 700 }}>({u})</span>}
                <button type="button" title="Close tab" className="ml-1 rounded hover:bg-red-100 flex items-center justify-center" style={{ width: mobile ? 24 : 16, height: mobile ? 24 : 16 }} onClick={(e) => { e.stopPropagation(); onCloseTab(tid); }}>
                  <X size={11} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Thông tin người chat */}
      <div className="flex items-center gap-2 px-2 py-2 shrink-0" style={{ background: GRAD.lavender, borderBottom: '1px solid #dccbe6' }}>
        {mobile && onBack && (
          <button type="button" onClick={onBack} className="flex items-center justify-center rounded hover:bg-white" style={{ width: 34, height: 34 }} title="Back">
            <ArrowLeft size={20} color={PURPLE} />
          </button>
        )}
        <Avatar emoji={contact.avatar} bg={contact.bg} size={mobile ? 38 : 34} dim={off} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <StatusIcon status={contact.status} size={14} />
            <span className="truncate" style={{ fontWeight: 700, fontSize: 13 }}>{contact.id}</span>
            <span style={{ fontSize: 11, color: '#7d6a88' }}>({STATUS_LABEL[contact.status]})</span>
          </div>
          <div className="truncate" style={{ fontSize: 11, color: '#666' }}>{contact.statusMsg ? renderWithEmoticons(contact.statusMsg, 14) : ' '}</div>
        </div>
      </div>

      {/* Thanh công cụ lớn */}
      <div className="flex items-center gap-px px-1 py-1 overflow-x-auto shrink-0" style={{ background: GRAD.silverSoft, borderBottom: '1px solid #cfc6d4' }}>
        <ToolButton compact={mobile} icon={Video} label="Webcam" onClick={() => onAction('webcam')} />
        <ToolButton compact={mobile} icon={Phone} label="Call" onClick={() => onAction('call')} />
        <ToolButton compact={mobile} icon={Paperclip} label="Send File" onClick={() => onAction('file')} />
        <ToolButton compact={mobile} icon={Users} label="Games" onClick={() => onAction('game')} />
        <div ref={imvRef} className="relative shrink-0">
          <ToolButton compact={mobile} icon={ImageIcon} label="IMVironments" onClick={() => setImvOpen((v) => !v)} active={imvOpen} />
          {imvOpen && (
            <div className="absolute top-full mt-1 py-1" style={{ zIndex: 50, right: mobile ? -60 : 'auto', left: mobile ? 'auto' : 0, minWidth: 170, background: '#fff', border: '1px solid #8d7a99', boxShadow: '2px 3px 8px rgba(0,0,0,.3)' }}>
              {Object.entries(IMVIRONMENTS).map(([k, v]) => (
                <button key={k} type="button" className="w-full flex items-center gap-2 px-3 py-1 hover:bg-purple-100 text-left" style={{ fontSize: 12 }} onClick={() => { onSetImv(k); setImvOpen(false); }}>
                  <span style={{ width: 18, height: 14, border: '1px solid #999', ...v.style }} />
                  <span className="flex-1">{v.label}</span>
                  {((convo && convo.imv) || 'none') === k && '✓'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lịch sử chat + avatar */}
      <div className="flex-1 flex min-h-0 gap-2 p-2">
        <div className="flex-1 relative min-w-0 flex">
          <div ref={histRef} className="flex-1 overflow-y-auto px-2 py-1" style={{ border: '1px solid #9d8fab', borderRadius: 2, ...imv.style }}>
            {messages.length === 0 && (
              <div className="py-2" style={{ fontSize: 11.5, color: '#999', fontStyle: 'italic' }}>
                Bắt đầu cuộc trò chuyện với {contact.id}. Gõ :D hoặc bấm BUZZ! thử xem ;)
              </div>
            )}
            {messages.map((m) => <MessageLine key={m.id} m={m} meId={meId} contact={contact} showTime={showTime} />)}
          </div>
          {buzzFlash ? (
            <div key={buzzFlash} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="ym-buzz-pop" style={{ color: '#ff0000', fontWeight: 900, fontSize: mobile ? 46 : 56, fontFamily: '"Arial Black", Arial, sans-serif', textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0 4px 10px rgba(0,0,0,.35)' }}>
                BUZZ!!!
              </div>
            </div>
          ) : null}
        </div>
        {!mobile && (
          <div className="flex flex-col justify-between items-center shrink-0" style={{ width: 92 }}>
            <div className="flex flex-col items-center gap-1">
              <Avatar emoji={contact.avatar} bg={contact.bg} size={84} dim={off} />
              <span className="truncate w-full text-center" style={{ fontSize: 10, color: '#666' }}>{contact.id}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Avatar emoji={myAvatar[0]} bg={[myAvatar[1], myAvatar[2]]} size={64} />
              <span className="truncate w-full text-center" style={{ fontSize: 10, color: '#666' }}>{meId}</span>
            </div>
          </div>
        )}
      </div>

      {/* Thanh định dạng: B I U | màu | font | cỡ | emoticon | BUZZ! */}
      <div className="relative shrink-0 px-2">
        {emoOpen && <EmoticonPicker mobile={mobile} onPick={insertCode} onClose={() => setEmoOpen(false)} />}
        {colorOpen && <ColorPicker value={myFont.color} onPick={(c) => { setMyFont({ ...myFont, color: c }); setColorOpen(false); }} onClose={() => setColorOpen(false)} />}
        <div className="flex items-center gap-1 py-1 overflow-x-auto" style={{ borderTop: '1px solid #d7cfdd' }}>
          <button type="button" title="Bold" style={fmtBtn(myFont.bold)} className="flex items-center justify-center shrink-0" onClick={() => setMyFont({ ...myFont, bold: !myFont.bold })}><Bold size={14} /></button>
          <button type="button" title="Italic" style={fmtBtn(myFont.italic)} className="flex items-center justify-center shrink-0" onClick={() => setMyFont({ ...myFont, italic: !myFont.italic })}><Italic size={14} /></button>
          <button type="button" title="Underline" style={fmtBtn(myFont.underline)} className="flex items-center justify-center shrink-0" onClick={() => setMyFont({ ...myFont, underline: !myFont.underline })}><Underline size={14} /></button>
          <button type="button" data-color-toggle title="Font color" style={fmtBtn(colorOpen)} className="flex flex-col items-center justify-center shrink-0" onClick={() => setColorOpen((v) => !v)}>
            <Palette size={13} />
            <span style={{ width: 16, height: 3, background: myFont.color, marginTop: 1 }} />
          </button>
          <select title="Font" value={myFont.face} onChange={(e) => setMyFont({ ...myFont, face: e.target.value })} style={{ ...selectStyle, width: mobile ? 120 : 112 }} className="shrink-0">
            {FONT_FACES.map((f) => <option key={f} value={f} style={{ fontFamily: FONT_FALLBACK[f] }}>{f}</option>)}
          </select>
          <select title="Size" value={myFont.size} onChange={(e) => setMyFont({ ...myFont, size: Number(e.target.value) })} style={{ ...selectStyle, width: mobile ? 56 : 46 }} className="shrink-0">
            {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="button" data-emo-toggle title="Emoticons" style={{ ...fmtBtn(emoOpen), order: mobile ? -2 : 0 }} className="flex items-center justify-center shrink-0" onClick={() => { setEmoOpen((v) => !v); setColorOpen(false); }}>
            <SmileyFace size={mobile ? 22 : 18} spec={{ mouth: 'bigGrin' }} />
          </button>
          <button
            type="button"
            title="BUZZ! — rung cửa sổ bạn chat"
            onClick={onBuzz}
            className="shrink-0 px-2 rounded-sm active:translate-y-px"
            style={{ order: mobile ? -1 : 0, marginRight: mobile ? 6 : 0, height: mobile ? 32 : 22, fontWeight: 900, fontSize: mobile ? 14 : 12, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: 0.5, background: 'linear-gradient(180deg,#ff8a7a,#e8170a 50%,#c00a00 51%,#e02a1c)', border: '1px solid #800000', textShadow: '0 1px 1px rgba(0,0,0,.4)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5)' }}
          >
            BUZZ!
          </button>
        </div>
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="flex gap-2 px-2 pb-2 shrink-0">
        <textarea
          ref={taRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !(e.nativeEvent && e.nativeEvent.isComposing)) { e.preventDefault(); send(); }
          }}
          enterKeyHint="send"
          rows={mobile ? 2 : 3}
          placeholder={`Nhắn cho ${contact.id}... (Enter để gửi)`}
          className="flex-1 min-w-0 resize-none px-2 py-1"
          style={{ ...fontCss(myFont), fontSize: mobile ? `max(16px, ${myFont.size}pt)` : `${myFont.size}pt`, border: '1px solid #9d8fab', borderRadius: 2, outline: 'none', background: '#fff' }}
        />
        <XPButton onClick={send} className="self-stretch" style={{ minWidth: mobile ? 64 : 70, fontWeight: 700 }} title="Send">
          {mobile ? <Send size={16} /> : null}
          <span>Send</span>
        </XPButton>
      </div>

      {/* Thanh trạng thái */}
      <div className="flex items-center gap-1 px-2 shrink-0" style={{ height: 22, background: GRAD.silverSoft, borderTop: '1px solid #cfc6d4', fontSize: 11, color: '#555' }}>
        {typing ? (
          <><Edit3 size={12} color={PURPLE} /><span className="truncate" style={{ color: PURPLE }}>{contact.id} is typing a message...</span></>
        ) : lastIn ? (
          <><Clock size={11} /><span className="truncate">Last message received at {fmtTime(lastIn.time)}</span></>
        ) : (
          <span className="truncate">{off ? `${contact.id} đang offline — tin nhắn sẽ được gửi khi bạn ấy online.` : 'Shift+Enter để xuống dòng.'}</span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ CSS hiệu ứng ------------------------------ */

const GLOBAL_CSS = `
@keyframes ym-shake {
  0% { transform: translate(0,0) rotate(0); }
  8% { transform: translate(-16px,-6px) rotate(-1.2deg); }
  16% { transform: translate(14px,8px) rotate(1deg); }
  24% { transform: translate(-15px,6px) rotate(-1deg); }
  32% { transform: translate(16px,-8px) rotate(1.2deg); }
  40% { transform: translate(-12px,-4px) rotate(-.6deg); }
  48% { transform: translate(12px,6px) rotate(.6deg); }
  56% { transform: translate(-10px,4px); }
  64% { transform: translate(10px,-6px); }
  72% { transform: translate(-6px,3px); }
  80% { transform: translate(6px,-3px); }
  90% { transform: translate(-3px,1px); }
  100% { transform: translate(0,0) rotate(0); }
}
.ym-shake { animation: ym-shake .78s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes ym-pop {
  0% { transform: scale(.2) rotate(-12deg); opacity: 0; }
  25% { transform: scale(1.25) rotate(4deg); opacity: 1; }
  45% { transform: scale(1) rotate(-2deg); }
  80% { opacity: 1; }
  100% { transform: scale(1.1); opacity: 0; }
}
.ym-buzz-pop { animation: ym-pop 1.15s ease-out both; }
@keyframes ym-blink { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
.ym-buzz-text { animation: ym-blink .45s ease-in-out 4; }
.ym-flash { animation: ym-blink 1s ease-in-out infinite; }
@keyframes ym-tabflash { 0% { background: #ffb347; } 50% { background: #efe8f3; } }
.ym-tab-flash { animation: ym-tabflash 1s steps(1) infinite; }
@keyframes ym-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
.ym-float { animation: ym-float 3s ease-in-out infinite; }
@keyframes ym-bounce { 0%,100% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-10px) rotate(-8deg); } 75% { transform: translateY(-10px) rotate(8deg); } }
.ym-bounce { animation: ym-bounce .8s ease-in-out infinite; }
@keyframes ym-progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(170%); } }
.ym-progress { width: 60%; animation: ym-progress 1.1s linear infinite; }
.ym-dots::after { content: ''; animation: ym-dots 1.2s steps(1) infinite; }
@keyframes ym-dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75% { content: '...'; } }
@keyframes ym-up { from { transform: translateY(120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.ym-toast-up { animation: ym-up .35s ease-out both; }
@keyframes ym-down { from { transform: translateY(-120%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.ym-toast-down { animation: ym-down .35s ease-out both; }
.ym-root ::-webkit-scrollbar { width: 14px; height: 10px; }
.ym-root ::-webkit-scrollbar-track { background: #f0ecf2; }
.ym-root ::-webkit-scrollbar-thumb { background: linear-gradient(90deg,#e2d6ea,#c7b3d4); border: 1px solid #a996b7; border-radius: 3px; }
.ym-root button { cursor: pointer; }
.ym-root button:disabled { cursor: default; }
.ym-root textarea::placeholder, .ym-root input::placeholder { color: #a39aa8; }
@media (prefers-reduced-motion: reduce) { .ym-float, .ym-bounce { animation: none; } }
`;

function useMediaQuery(query) {
  const get = () => {
    try { return window.matchMedia(query).matches; } catch (e) { return false; }
  };
  const [m, setM] = useState(get);
  useEffect(() => {
    let mq;
    try { mq = window.matchMedia(query); } catch (e) { return undefined; }
    const on = () => setM(mq.matches);
    on();
    if (mq.addEventListener) mq.addEventListener('change', on); else mq.addListener(on);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', on); else mq.removeListener(on); };
  }, [query]);
  return m;
}

function initialWins() {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = (typeof window !== 'undefined' ? window.innerHeight : 800) - 40;
  const lw = 300;
  const lh = Math.max(380, Math.min(640, vh - 36));
  const cw = Math.min(700, Math.max(430, vw - lw - 90));
  const ch = Math.max(400, Math.min(580, vh - 64));
  let cx = 24 + lw + 36;
  if (cx + cw > vw - 12) cx = Math.max(12, vw - cw - 12);
  const lgH = Math.min(580, vh - 20);
  return {
    login: { x: Math.max(12, (vw - 340) / 2), y: Math.max(10, (vh - lgH) / 2), w: 340, h: lgH, z: 2, open: true, min: false, max: false },
    list: { x: 24, y: 18, w: lw, h: lh, z: 2, open: true, min: false, max: false },
    chat: { x: cx, y: 44, w: cw, h: ch, z: 3, open: false, min: false, max: false },
  };
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function Toasts({ toasts, contactsById, onOpen, onClose, mobile }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed flex flex-col gap-2" style={{ zIndex: 300, ...(mobile ? { top: 8, left: 8, right: 8 } : { right: 12, bottom: 52, width: 290 }) }}>
      {(mobile ? toasts.slice(-1) : toasts).map((t) => {
        const c = contactsById[t.cid];
        return (
          <div key={t.id} className={mobile ? 'ym-toast-down' : 'ym-toast-up'} style={{ border: '1px solid #4e0063', borderRadius: 6, overflow: 'hidden', boxShadow: '0 8px 22px rgba(0,0,0,.45)', background: '#fff', fontFamily: UI_FONT }}>
            <div className="flex items-center gap-2 px-2" style={{ height: 22, background: GRAD.title, color: '#fff', fontSize: 11, fontWeight: 700, textShadow: '0 1px 1px rgba(0,0,0,.4)' }}>
              <SmileyFace size={14} />
              <span className="flex-1">Yahoo! Messenger</span>
              <button type="button" onClick={() => onClose(t.id)} title="Close"><X size={12} color="#fff" /></button>
            </div>
            <button type="button" onClick={() => onOpen(t)} className="flex gap-2 p-2 w-full text-left" style={{ background: GRAD.lavender }}>
              {c ? <Avatar emoji={c.avatar} bg={c.bg} size={40} /> : <SmileyFace size={40} />}
              <span className="flex-1 min-w-0 flex flex-col">
                <span className="truncate" style={{ fontSize: 12, fontWeight: 700, color: '#222' }}>{t.headline}</span>
                {t.body && <span className="truncate" style={{ fontSize: 12, color: '#444' }}>{renderWithEmoticons(t.body, 16)}</span>}
                {t.cid && <span style={{ fontSize: 11, color: '#0645ad', textDecoration: 'underline' }}>{t.kind === 'signin' ? 'Send an IM' : 'Reply'}</span>}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function AddContactDialog({ preset, onAdd, onClose, mobile }) {
  const [id, setId] = useState(preset || '');
  const [group, setGroup] = useState('friends');
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const clean = id.trim();
    if (!/^[a-zA-Z0-9_.]{2,32}$/.test(clean)) { setErr('Yahoo! ID gồm 2–32 ký tự: chữ không dấu, số, dấu _ hoặc dấu chấm.'); return; }
    onAdd(clean, group);
  };
  const box = { fontSize: mobile ? 16 : 12, border: '1px solid #7f9db9', borderRadius: 2, padding: '4px 6px', width: '100%', outline: 'none', background: '#fff' };
  return (
    <Modal title="Add to Messenger List" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <UserPlus size={28} color={PURPLE} />
          <div style={{ fontSize: 12 }}>Nhập Yahoo! ID của người bạn muốn thêm. Họ sẽ "chấp nhận" sau vài giây ;)</div>
        </div>
        <label className="flex flex-col gap-1"><b>Yahoo! ID:</b><input autoFocus value={id} onChange={(e) => setId(e.target.value)} style={box} placeholder="vd: tieu_thu_dong_bang" /></label>
        <label className="flex flex-col gap-1"><b>Group:</b>
          <select value={group} onChange={(e) => setGroup(e.target.value)} style={box}>
            {GROUPS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
        </label>
        {err && <div style={{ color: '#c00000' }}>{err}</div>}
        <div className="flex justify-end gap-2">
          <XPButton onClick={onClose}>Cancel</XPButton>
          <XPButton primary onClick={submit}>Add Contact</XPButton>
        </div>
      </form>
    </Modal>
  );
}

function AboutDialog({ onClose }) {
  return (
    <Modal title="About Yahoo! Messenger" onClose={onClose} width={380}>
      <div className="flex flex-col items-center gap-2 text-center">
        <YMLogo size={64} />
        <Wordmark size={20} />
        <div style={{ color: '#666' }}>Simulator · phiên bản hoài niệm 2007</div>
        <div className="text-left mt-2" style={{ lineHeight: 1.6 }}>
          • Bản mô phỏng do fan làm, <b>không liên kết với Yahoo</b>.<br />
          • Không kết nối máy chủ, không gửi/lưu mật khẩu.<br />
          • Mọi nick trong danh sách đều là nhân vật ảo, trả lời tự động.<br />
          • Âm thanh được tổng hợp trực tiếp bằng Web Audio API.
        </div>
        <XPButton primary onClick={onClose} className="mt-3" style={{ minWidth: 80 }}>OK</XPButton>
      </div>
    </Modal>
  );
}

/* =============================== Ứng dụng chính =============================== */

const DEFAULT_FONT = { face: 'Tahoma', size: 10, color: '#000000', bold: false, italic: false, underline: false };
const NEW_FRIEND_LOOKS = [
  ['🐰', '#ffe3f1', '#ff8fc4'], ['🐯', '#fff1c9', '#ffa938'], ['🐧', '#dfefff', '#4f8fe0'],
  ['🦄', '#f3e3ff', '#b46bf0'], ['🍀', '#e2ffd9', '#4fbf5a'], ['🎮', '#e6e6ff', '#6b6bd6'],
];

export default function YahooMessenger() {
  const mobile = useMediaQuery('(max-width: 767px), (pointer: coarse) and (max-height: 520px)');
  const [phase, setPhase] = useState('login');
  const [savedId, setSavedId] = useState(() => safeStorage.get('ym2007_id') || '');
  const [rememberId, setRememberId] = useState(() => !!safeStorage.get('ym2007_id'));
  const [me, setMe] = useState({ id: '', status: 'online', statusMsg: '' });
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [groupsOpen, setGroupsOpen] = useState({ friends: true, family: true });
  const [convos, setConvos] = useState({});
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [typing, setTyping] = useState({});
  const [drafts, setDrafts] = useState({});
  const [myFont, setMyFont] = useState(DEFAULT_FONT);
  const [toasts, setToasts] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [showTime, setShowTime] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [wins, setWins] = useState(initialWins);
  const [focusWin, setFocusWin] = useState('list');
  const [buzzFlash, setBuzzFlash] = useState(0);
  const [modal, setModal] = useState(null);
  const [tipIdx, setTipIdx] = useState(0);
  const [clock, setClock] = useState(() => Date.now());

  const appRef = useRef(null);
  const chatWinRef = useRef(null);
  const timers = useRef(new Set());
  const replyTimers = useRef({});
  const pstate = useRef({});
  const zTop = useRef(10);
  const lastStatusComment = useRef(0);
  const live = useRef({});
  live.current = { contacts, me, tabs, activeTab, wins, mobileView, mobile, soundOn, convos };

  const contactsById = useMemo(() => Object.fromEntries(contacts.map((c) => [c.id, c])), [contacts]);
  const unread = useMemo(() => Object.fromEntries(Object.entries(convos).map(([k, v]) => [k, v.unread])), [convos]);

  /* ---------- tiện ích hẹn giờ ---------- */
  const later = (fn, ms, cid) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      if (cid && replyTimers.current[cid]) replyTimers.current[cid].delete(t);
      fn();
    }, ms);
    timers.current.add(t);
    if (cid) {
      if (!replyTimers.current[cid]) replyTimers.current[cid] = new Set();
      replyTimers.current[cid].add(t);
    }
    return t;
  };
  const cancelReplies = (cid) => {
    const set = replyTimers.current[cid];
    if (set) set.forEach((t) => { clearTimeout(t); timers.current.delete(t); });
    replyTimers.current[cid] = new Set();
    setTyping((p) => (p[cid] ? { ...p, [cid]: false } : p));
  };
  const clearAllTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = new Set();
    replyTimers.current = {};
  };
  useEffect(() => () => clearAllTimers(), []);

  const play = (name) => { if (live.current.soundOn && sfx[name]) sfx[name](); };
  const getPs = (cid) => {
    if (!pstate.current[cid]) pstate.current[cid] = { last: {}, buzzTimes: [] };
    return pstate.current[cid];
  };
  const personaOf = (c) => PERSONAS[c && c.persona] || PERSONAS.generic;
  const findContact = (cid) => live.current.contacts.find((x) => x.id === cid);

  const isVisible = (cid) => {
    const L = live.current;
    if (L.activeTab !== cid) return false;
    if (L.mobile) return L.mobileView === 'chat';
    return L.wins.chat.open && !L.wins.chat.min;
  };

  /* ---------- thông báo góc màn hình ---------- */
  const addToast = (t) => {
    const id = uid();
    setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
    later(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5500);
  };

  /* ---------- hội thoại ---------- */
  const pushMsg = (cid, msg) => {
    const full = { id: uid(), time: Date.now(), ...msg };
    const seen = msg.from !== 'them' || isVisible(cid);
    setConvos((prev) => {
      const c = prev[cid] || { messages: [], unread: 0, imv: 'none' };
      return { ...prev, [cid]: { ...c, messages: [...c.messages, full].slice(-300), unread: seen ? c.unread : c.unread + 1 } };
    });
  };

  const ensureTab = (cid, activate) => {
    const L = live.current;
    if (!L.tabs.includes(cid)) {
      setTabs((prev) => (prev.includes(cid) ? prev : [...prev, cid]));
      live.current = { ...live.current, tabs: [...L.tabs, cid] };
    }
    if (activate || !L.activeTab) {
      setActiveTab(cid);
      live.current = { ...live.current, activeTab: cid };
    }
    setConvos((prev) => (prev[cid] ? prev : { ...prev, [cid]: { messages: [], unread: 0, imv: 'none' } }));
    if (!L.mobile && !L.wins.chat.open) {
      const z = ++zTop.current;
      setWins((w) => ({ ...w, chat: { ...w.chat, open: true, min: false, z } }));
      live.current = { ...live.current, wins: { ...L.wins, chat: { ...L.wins.chat, open: true, min: false } } };
    }
  };

  const focusWindow = (name) => {
    setFocusWin(name);
    setWins((w) => (w[name].z === zTop.current ? w : { ...w, [name]: { ...w[name], z: ++zTop.current } }));
  };

  const openChat = (cid) => {
    sfx.unlock();
    ensureTab(cid, true);
    setConvos((prev) => (prev[cid] && prev[cid].unread ? { ...prev, [cid]: { ...prev[cid], unread: 0 } } : prev));
    if (live.current.mobile) setMobileView('chat');
    else {
      const z = ++zTop.current;
      setWins((w) => ({ ...w, chat: { ...w.chat, open: true, min: false, z } }));
      setFocusWin('chat');
    }
  };

  const closeTab = (cid) => {
    const L = live.current;
    const rest = L.tabs.filter((t) => t !== cid);
    setTabs(rest);
    if (L.activeTab === cid) {
      const idx = L.tabs.indexOf(cid);
      setActiveTab(rest[Math.min(idx, rest.length - 1)] || null);
    }
    if (!rest.length) {
      if (L.mobile) setMobileView('list');
      else setWins((w) => ({ ...w, chat: { ...w.chat, open: false, max: false } }));
    }
  };

  const doShake = () => {
    const L = live.current;
    later(() => {
      const el = (!L.mobile && chatWinRef.current && L.wins.chat.open) ? chatWinRef.current : appRef.current;
      if (!el) return;
      el.classList.remove('ym-shake');
      void el.offsetWidth;
      el.classList.add('ym-shake');
      later(() => el.classList.remove('ym-shake'), 850);
    }, 30);
    setBuzzFlash(Date.now());
    later(() => setBuzzFlash(0), 1250);
    try { if (navigator.vibrate) navigator.vibrate([180, 70, 180, 70, 260]); } catch (e) { /* bỏ qua */ }
  };

  /* ---------- bạn bè nói / BUZZ ---------- */
  const deliver = (cid, text) => {
    const c = findContact(cid);
    if (!c) return;
    ensureTab(cid, false);
    pushMsg(cid, { from: 'them', text, font: c.font });
    play('message');
    if (!isVisible(cid)) addToast({ kind: 'msg', cid, headline: `${cid} says:`, body: text });
  };

  const receiveBuzz = (cid) => {
    const c = findContact(cid);
    if (!c) return;
    const L = live.current;
    ensureTab(cid, !L.mobile);
    if (!L.mobile) {
      const z = ++zTop.current;
      setWins((w) => ({ ...w, chat: { ...w.chat, open: true, min: false, z } }));
      setFocusWin('chat');
    }
    pushMsg(cid, { from: 'them', kind: 'buzz' });
    play('buzz');
    doShake();
    if (L.mobile && !(L.mobileView === 'chat' && L.activeTab === cid)) addToast({ kind: 'msg', cid, headline: `${cid}: BUZZ!!!`, body: '' });
  };

  const contactSay = (cid, lines, startDelay = 600) => {
    const c = findContact(cid);
    const P = personaOf(c);
    let t = startDelay;
    lines.forEach((line) => {
      if (line && line.buzz) {
        later(() => receiveBuzz(cid), t, cid);
        t += 1400;
        return;
      }
      const isInvisibleNote = line === P.invisible;
      let text = String(line).replace(/\{me\}/g, live.current.me.id);
      if (P.teen && Math.random() < P.teen) text = teenCase(text);
      const typeDur = Math.min(3200, 450 + text.length * 42);
      later(() => setTyping((p) => ({ ...p, [cid]: true })), t, cid);
      t += typeDur;
      later(() => {
        setTyping((p) => ({ ...p, [cid]: false }));
        if (isInvisibleNote) getPs(cid).noticedInvisible = true;
        deliver(cid, text);
      }, t, cid);
      t += 380;
    });
    return t;
  };

  const compose = (c, trigger) => {
    const P = personaOf(c);
    const ps = getPs(c.id);
    let cat;
    if (trigger.type === 'buzz') {
      const now = Date.now();
      ps.buzzTimes = ps.buzzTimes.filter((x) => now - x < 12000);
      ps.buzzTimes.push(now);
      cat = ps.buzzTimes.length >= 3 ? 'buzzSpam' : 'buzz';
    } else if (trigger.type === 'action') cat = trigger.action;
    else cat = classify(trigger.text);
    const pool = P[cat] || P.generic;
    let idx = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && ps.last[cat] === idx) idx = (idx + 1) % pool.length;
    ps.last[cat] = idx;
    let lines = [...lineList(pool[idx])];
    if (live.current.me.status === 'invisible' && !ps.noticedInvisible && P.invisible) {
      lines = [P.invisible, ...lines];
    }
    return { lines, cat };
  };

  const respond = (cid, trigger) => {
    const c = findContact(cid);
    if (!c) return;
    const ps = getPs(cid);
    if (c.status === 'offline') {
      ps.pending = trigger;
      if (!ps.offlineNotified) {
        ps.offlineNotified = true;
        later(() => pushMsg(cid, { from: 'system', text: `${cid} hiện không online. Tin nhắn sẽ được gửi khi ${cid} đăng nhập.` }), 250);
      }
      if (c.wakeOnMessage && !ps.waking) {
        ps.waking = true;
        later(() => setContactStatus(cid, 'online'), c.wakeOnMessage);
      }
      return;
    }
    cancelReplies(cid);
    const { lines, cat } = compose(c, trigger);
    const end = contactSay(cid, lines, c.status === 'busy' ? rand(1500, 2800) : rand(500, 1300));
    if (cat === 'bye' && (c.leavesOnBye || c.persona === 'me')) {
      later(() => setContactStatus(cid, 'offline'), end + 2500, cid);
      if (c.leavesOnBye) {
        ps.comeback = true;
        later(() => setContactStatus(cid, 'online'), end + 26000, cid);
      }
    }
  };

  function setContactStatus(cid, status) {
    const prev = findContact(cid);
    if (!prev || prev.status === status) return;
    setContacts((cs) => cs.map((c) => (c.id === cid ? { ...c, status } : c)));
    live.current = { ...live.current, contacts: live.current.contacts.map((c) => (c.id === cid ? { ...c, status } : c)) };
    const P = personaOf(prev);
    const ps = getPs(cid);
    const inTabs = live.current.tabs.includes(cid);
    if (prev.status === 'offline' && status !== 'offline') {
      play('door');
      addToast({ kind: 'signin', cid, headline: `${cid} vừa đăng nhập (signed in).`, body: prev.statusMsg });
      if (inTabs) pushMsg(cid, { from: 'system', text: `${cid} has signed in.` });
      ps.offlineNotified = false;
      ps.waking = false;
      if (ps.pending) {
        const tr = ps.pending;
        ps.pending = null;
        const prefix = prev.wakeOnMessage && P.onSignIn && !ps.greeted ? lineList(pick(P.onSignIn)) : [];
        ps.greeted = true;
        const { lines } = compose({ ...prev, status }, tr);
        later(() => contactSay(cid, [...prefix, ...lines], 400), 1600);
      } else if (ps.comeback && P.comeback) {
        ps.comeback = false;
        later(() => contactSay(cid, lineList(pick(P.comeback)), 400), 2500);
      } else if (P.onSignIn && !ps.greeted && !prev.wakeOnMessage) {
        ps.greeted = true;
        later(() => contactSay(cid, lineList(pick(P.onSignIn)), 400), 3500);
      }
    } else if (status === 'offline') {
      play('doorClose');
      if (inTabs) pushMsg(cid, { from: 'system', text: `${cid} has signed out.` });
    }
  }

  /* ---------- hành động của tôi ---------- */
  const sendMessage = (text) => {
    const cid = live.current.activeTab;
    if (!cid) return;
    pushMsg(cid, { from: 'me', text, font: myFont });
    play('send');
    respond(cid, { type: 'msg', text });
  };

  const sendBuzz = (cidArg) => {
    const cid = cidArg || live.current.activeTab;
    if (!cid) return;
    sfx.unlock();
    pushMsg(cid, { from: 'me', kind: 'buzz' });
    play('buzz');
    doShake();
    respond(cid, { type: 'buzz' });
  };

  const doAction = (action) => {
    const cid = live.current.activeTab;
    if (!cid) return;
    pushMsg(cid, { from: 'system', text: ACTION_LINES[action](cid) });
    respond(cid, { type: 'action', action });
  };

  const setImv = (k) => {
    const cid = live.current.activeTab;
    if (!cid) return;
    setConvos((prev) => ({ ...prev, [cid]: { ...(prev[cid] || { messages: [], unread: 0 }), imv: k } }));
    pushMsg(cid, { from: 'system', text: `Bạn đã đổi IMVironment thành "${IMVIRONMENTS[k].label}".` });
    if (k !== 'none') respond(cid, { type: 'action', action: 'imv' });
  };

  const setMyStatus = (s) => {
    const prevStatus = live.current.me.status;
    setMe((m) => ({ ...m, status: s }));
    if (prevStatus === 'invisible' && s !== 'invisible') {
      const p = findContact('cong_chua_bong_bong');
      if (p && p.status !== 'offline') later(() => contactSay(p.id, ['ui {me} onl rùi kìa, nãy giờ trốn đâu zạ? :D'], 0), 2500);
    }
  };

  const setStatusMsg = (msg) => {
    const old = live.current.me.statusMsg;
    setMe((m) => ({ ...m, statusMsg: msg }));
    if (!msg || msg === old || live.current.me.status === 'invisible') return;
    if (Date.now() - lastStatusComment.current < 20000) return;
    const online = live.current.contacts.filter((c) => c.status !== 'offline' && personaOf(c).statusComment);
    if (!online.length) return;
    lastStatusComment.current = Date.now();
    const c = pick(online);
    const line = pick(personaOf(c).statusComment).replace('{status}', msg.length > 40 ? `${msg.slice(0, 40)}...` : msg);
    later(() => contactSay(c.id, [line], 0), 5000, c.id);
  };

  const addContact = (id, group) => {
    setModal(null);
    const exists = findContact(id) || (id === live.current.me.id);
    if (exists) { if (id !== live.current.me.id) openChat(id); return; }
    const look = pick(NEW_FRIEND_LOOKS);
    const nc = {
      id, group, status: 'offline', persona: 'generic', statusMsg: pick(['Hello 2007!', 'Đang nghe nhạc :x', 'Buồn ngủ quá I-)', 'Ai chat hông? :D']),
      avatar: look[0], bg: [look[1], look[2]],
      font: { face: pick(['Verdana', 'Arial', 'Comic Sans MS']), size: 10, color: pick(['#0000FF', '#008080', '#6633CC', '#996633']), bold: Math.random() < 0.5, italic: false, underline: false },
    };
    setContacts((cs) => [...cs, nc]);
    live.current = { ...live.current, contacts: [...live.current.contacts, nc] };
    setGroupsOpen((g) => ({ ...g, [group]: true }));
    addToast({ kind: 'info', headline: 'Đã gửi lời mời kết bạn', body: `Đang chờ ${id} chấp nhận...` });
    later(() => setContactStatus(id, 'online'), 3500);
  };

  /* ---------- đăng nhập / đăng xuất ---------- */
  const handleSignIn = ({ id, invisible, remember }) => {
    sfx.unlock();
    clearAllTimers();
    if (remember) safeStorage.set('ym2007_id', id); else safeStorage.del('ym2007_id');
    setRememberId(remember);
    setSavedId(remember ? id : '');
    setMe({ id, status: invisible ? 'invisible' : 'online', statusMsg: '' });
    setAvatarIdx(hashStr(id) % MY_AVATARS.length);
    setContacts(INITIAL_CONTACTS);
    live.current = { ...live.current, contacts: INITIAL_CONTACTS, tabs: [], activeTab: null };
    setConvos({}); setTabs([]); setActiveTab(null); setTyping({}); setDrafts({}); setToasts([]);
    pstate.current = {};
    setMobileView('list');
    setWins(initialWins());
    setFocusWin('list');
    setPhase('app');
    INITIAL_CONTACTS.forEach((c) => { if (c.signInAfter) later(() => setContactStatus(c.id, 'online'), c.signInAfter); });
  };

  const signOut = () => {
    clearAllTimers();
    setToasts([]);
    setModal(null);
    setPhase('login');
    setWins(initialWins());
  };

  /* ---------- hiệu ứng nền ---------- */
  useEffect(() => {
    if (phase !== 'app') return undefined;
    const a = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 9000);
    const b = setInterval(() => setClock(Date.now()), 15000);
    const moods = PERSONAS.langtu.moods;
    const c = setInterval(() => setContacts((cs) => cs.map((x) => (x.persona === 'langtu' ? { ...x, statusMsg: pick(moods.filter((m) => m !== x.statusMsg)) } : x))), 45000);
    return () => { clearInterval(a); clearInterval(b); clearInterval(c); };
  }, [phase]);

  useEffect(() => {
    const id = setInterval(() => setClock(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  // xóa số tin chưa đọc khi đang xem hội thoại
  useEffect(() => {
    if (!activeTab) return;
    const visible = mobile ? mobileView === 'chat' : wins.chat.open && !wins.chat.min;
    if (visible && convos[activeTab] && convos[activeTab].unread) {
      setConvos((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], unread: 0 } }));
    }
  }, [activeTab, mobile, mobileView, wins.chat.open, wins.chat.min, convos]);

  // giữ cửa sổ trong màn hình khi đổi kích thước
  useEffect(() => {
    const onResize = () => setWins((w) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - 40;
      const fix = (o) => {
        const wv = Math.min(o.w, vw - 8);
        const hv = Math.min(o.h, vh - 8);
        return { ...o, w: wv, h: hv, x: Math.min(Math.max(0, o.x), Math.max(0, vw - wv)), y: Math.min(Math.max(0, o.y), Math.max(0, vh - hv)) };
      };
      return { login: fix(w.login), list: fix(w.list), chat: fix(w.chat) };
    });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // đổi sang giao diện điện thoại khi đang mở chat
  useEffect(() => {
    if (mobile && phase === 'app' && activeTab && wins.chat.open && !wins.chat.min && mobileView === 'list') setMobileView('chat');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile]);

  /* ---------- menu ---------- */
  const listMenus = [
    {
      label: 'Messenger',
      items: [
        ...STATUS_OPTIONS.map((s) => ({ label: s.label, checked: me.status === s.id, onClick: () => setMyStatus(s.id) })),
        { separator: true },
        { label: 'Change My Display Image', onClick: () => setAvatarIdx((i) => (i + 1) % MY_AVATARS.length) },
        { label: 'Sound Effects', checked: soundOn, onClick: () => setSoundOn((v) => !v) },
        { separator: true },
        { label: 'Sign Out', onClick: signOut },
      ],
    },
    {
      label: 'Contacts',
      items: [
        { label: 'Add a Contact...', hint: 'Ctrl+Shift+A', onClick: () => setModal({ type: 'add' }) },
        { separator: true },
        { label: 'Expand All Groups', onClick: () => setGroupsOpen({ friends: true, family: true }) },
        { label: 'Collapse All Groups', onClick: () => setGroupsOpen({ friends: false, family: false }) },
      ],
    },
    {
      label: 'Actions',
      items: [
        { label: 'Send an Instant Message...', onClick: () => { const c = contacts.find((x) => x.status !== 'offline'); if (c) openChat(c.id); } },
        {
          label: 'BUZZ a Random Friend!',
          onClick: () => {
            const on = contacts.filter((x) => x.status !== 'offline');
            const c = pick(on.length ? on : contacts);
            openChat(c.id);
            later(() => sendBuzz(c.id), 200);
          },
        },
      ],
    },
    { label: 'Help', items: [{ label: 'About Yahoo! Messenger', onClick: () => setModal({ type: 'about' }) }] },
  ];

  const chatMenus = [
    {
      label: 'Conversation',
      items: [
        { label: 'Close Tab', onClick: () => activeTab && closeTab(activeTab) },
        { label: 'Close All Tabs', onClick: () => { setTabs([]); setActiveTab(null); setWins((w) => ({ ...w, chat: { ...w.chat, open: false, max: false } })); } },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Clear Input', onClick: () => activeTab && setDrafts((d) => ({ ...d, [activeTab]: '' })) },
        { label: 'Clear Conversation History', onClick: () => activeTab && setConvos((p) => ({ ...p, [activeTab]: { ...p[activeTab], messages: [] } })) },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Show Timestamps', checked: showTime, onClick: () => setShowTime((v) => !v) },
        { separator: true },
        ...Object.entries(IMVIRONMENTS).map(([k, v]) => ({ label: `IMVironment: ${v.label}`, checked: ((convos[activeTab] && convos[activeTab].imv) || 'none') === k, onClick: () => setImv(k) })),
      ],
    },
    {
      label: 'Actions',
      items: [
        { label: 'BUZZ!', hint: 'Ctrl+G', onClick: () => sendBuzz() },
        { label: 'Invite to Webcam', onClick: () => doAction('webcam') },
        { label: 'Call Computer', onClick: () => doAction('call') },
        { label: 'Send a File...', onClick: () => doAction('file') },
        { label: 'Play a Game', onClick: () => doAction('game') },
      ],
    },
    { label: 'Help', items: [{ label: 'About Yahoo! Messenger', onClick: () => setModal({ type: 'about' }) }] },
  ];

  // Ctrl+G = BUZZ (giống bản gốc)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G') && live.current.activeTab && phase === 'app') {
        e.preventDefault();
        sendBuzz();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const myAvatar = MY_AVATARS[avatarIdx];
  const activeContact = activeTab ? contactsById[activeTab] : null;
  const chatProps = activeContact && {
    contact: activeContact,
    convo: convos[activeTab],
    meId: me.id,
    myAvatar,
    myFont,
    setMyFont,
    draft: drafts[activeTab] || '',
    setDraft: (v) => setDrafts((d) => ({ ...d, [activeTab]: v })),
    onSend: sendMessage,
    onBuzz: () => sendBuzz(),
    onAction: doAction,
    onSetImv: setImv,
    typing: !!typing[activeTab],
    tabs,
    activeTab,
    onSelectTab: (t) => { setActiveTab(t); setConvos((p) => (p[t] ? { ...p, [t]: { ...p[t], unread: 0 } } : p)); },
    onCloseTab: closeTab,
    contactsById,
    unread,
    showTime,
    menus: chatMenus,
    buzzFlash,
  };
  const listProps = {
    me,
    myAvatar,
    onCycleAvatar: () => setAvatarIdx((i) => (i + 1) % MY_AVATARS.length),
    onSetStatus: setMyStatus,
    onSetStatusMsg: setStatusMsg,
    contacts,
    groupsOpen,
    onToggleGroup: (g) => setGroupsOpen((s) => ({ ...s, [g]: !s[g] })),
    onOpenChat: openChat,
    unread,
    typing,
    menus: listMenus,
    soundOn,
    onToggleSound: () => setSoundOn((v) => !v),
    onAddContact: (preset) => setModal({ type: 'add', preset: typeof preset === 'string' ? preset : '' }),
    tip: TIPS[tipIdx],
  };
  const onToastOpen = (t) => {
    setToasts((p) => p.filter((x) => x.id !== t.id));
    if (t.cid) openChat(t.cid);
  };
  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);
  const modalEl = modal && (modal.type === 'about'
    ? <AboutDialog onClose={() => setModal(null)} />
    : <AddContactDialog preset={modal.preset} mobile={mobile} onAdd={addContact} onClose={() => setModal(null)} />);
  const smallIcon = <SmileyFace size={16} />;

  /* ============================ GIAO DIỆN ĐIỆN THOẠI ============================ */
  if (mobile) {
    return (
      <div ref={appRef} className="ym-root w-full flex flex-col overflow-hidden" style={{ height: '100dvh', minHeight: '100vh', background: '#ece9ef', fontFamily: UI_FONT }}>
        <style>{GLOBAL_CSS}</style>
        {phase === 'login' ? (
          <>
            <TitleBar mobile icon={smallIcon} title="Yahoo! Messenger" />
            <LoginPanel mobile initialId={savedId} initialRemember={rememberId} onSignIn={handleSignIn} />
          </>
        ) : mobileView === 'chat' && chatProps ? (
          <>
            <TitleBar mobile icon={smallIcon} title={`${activeTab} - Instant Message`}>
              <button type="button" onClick={() => setShowTime((v) => !v)} title="Show timestamps" className="flex items-center justify-center rounded" style={{ width: 30, height: 26, background: showTime ? 'rgba(255,255,255,.3)' : undefined }}>
                <Clock size={15} color="#fff" />
              </button>
              <WinButtons onClose={() => closeTab(activeTab)} />
            </TitleBar>
            <ChatPanel {...chatProps} mobile onBack={() => setMobileView('list')} />
          </>
        ) : (
          <>
            <TitleBar mobile icon={smallIcon} title="Yahoo! Messenger">
              {totalUnread > 0 && tabs.length > 0 && (
                <button type="button" onClick={() => setMobileView('chat')} className="flex items-center gap-1 px-2 rounded ym-flash" style={{ height: 24, background: '#ff8a00', fontSize: 11 }}>
                  <MessageSquare size={13} color="#fff" /> {totalUnread}
                </button>
              )}
              {totalUnread === 0 && tabs.length > 0 && (
                <button type="button" onClick={() => setMobileView('chat')} className="flex items-center gap-1 px-2 rounded" style={{ height: 24, background: 'rgba(255,255,255,.2)', fontSize: 11 }}>
                  <MessageSquare size={13} color="#fff" /> {tabs.length}
                </button>
              )}
              <button type="button" onClick={signOut} title="Sign Out" className="flex items-center justify-center rounded" style={{ width: 30, height: 26 }}>
                <LogOut size={16} color="#fff" />
              </button>
            </TitleBar>
            <ContactListPanel {...listProps} mobile />
          </>
        )}
        <Toasts mobile toasts={toasts} contactsById={contactsById} onOpen={onToastOpen} onClose={(id) => setToasts((p) => p.filter((x) => x.id !== id))} />
        {modalEl}
      </div>
    );
  }

  /* ============================ GIAO DIỆN MÁY TÍNH ============================ */
  const clockStr = (() => { const d = new Date(clock); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; })();
  const taskBtn = (name, label, icon, flash) => {
    const w = wins[name];
    const on = focusWin === name && !w.min;
    return (
      <button
        type="button"
        key={name}
        className={`flex items-center gap-2 px-3 rounded truncate ${flash ? 'ym-flash' : ''}`}
        style={{ height: 30, maxWidth: 220, minWidth: 0, color: '#fff', fontSize: 12, border: '1px solid rgba(255,255,255,.25)', background: flash ? 'linear-gradient(180deg,#ffb347,#e07b00)' : on ? 'linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,.12))' : 'linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.04))', boxShadow: on ? 'inset 0 0 6px rgba(0,0,0,.4)' : undefined }}
        onClick={() => {
          if (w.min) { setWins((x) => ({ ...x, [name]: { ...x[name], min: false, z: ++zTop.current } })); setFocusWin(name); }
          else if (on) setWins((x) => ({ ...x, [name]: { ...x[name], min: true } }));
          else focusWindow(name);
        }}
      >
        {icon}<span className="truncate">{label}</span>
      </button>
    );
  };

  return (
    <div ref={appRef} className="ym-root fixed inset-0 overflow-hidden" style={{ background: GRAD.desktop, fontFamily: UI_FONT }}>
      <style>{GLOBAL_CSS}</style>
      <div className="absolute pointer-events-none text-right" style={{ right: 24, bottom: 56, color: 'rgba(255,255,255,.55)', fontSize: 12, lineHeight: 1.5 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,.35)' }}>Messenger 2007</div>
        mô phỏng hoài niệm · nhân vật ảo · âm thanh Web Audio
      </div>

      {phase === 'login' ? (
        <DesktopWindow
          win={wins.login}
          active
          title="Yahoo! Messenger"
          icon={smallIcon}
          resizable={false}
          onFocus={() => {}}
          onChange={(p) => setWins((w) => ({ ...w, login: { ...w.login, ...p } }))}
          onClose={() => {}}
        >
          <LoginPanel initialId={savedId} initialRemember={rememberId} onSignIn={handleSignIn} />
        </DesktopWindow>
      ) : (
        <>
          <DesktopWindow
            win={wins.list}
            active={focusWin === 'list'}
            title={`Yahoo! Messenger — ${me.id}`}
            icon={smallIcon}
            minW={250}
            minH={360}
            onFocus={() => focusWindow('list')}
            onChange={(p) => setWins((w) => ({ ...w, list: { ...w.list, ...p } }))}
            onMin={() => setWins((w) => ({ ...w, list: { ...w.list, min: true } }))}
            onClose={() => setWins((w) => ({ ...w, list: { ...w.list, min: true } }))}
          >
            <ContactListPanel {...listProps} />
          </DesktopWindow>
          {chatProps && (
            <DesktopWindow
              winRef={chatWinRef}
              win={wins.chat}
              active={focusWin === 'chat'}
              title={`${activeTab} - Instant Message`}
              icon={<StatusIcon status={activeContact.status} size={16} />}
              minW={400}
              minH={380}
              onFocus={() => focusWindow('chat')}
              onChange={(p) => setWins((w) => ({ ...w, chat: { ...w.chat, ...p } }))}
              onMin={() => setWins((w) => ({ ...w, chat: { ...w.chat, min: true } }))}
              onMax={() => setWins((w) => ({ ...w, chat: { ...w.chat, max: !w.chat.max } }))}
              onClose={() => { setTabs([]); setActiveTab(null); setWins((w) => ({ ...w, chat: { ...w.chat, open: false, max: false } })); }}
            >
              <ChatPanel {...chatProps} />
            </DesktopWindow>
          )}
        </>
      )}

      {/* Thanh taskbar */}
      <div className="absolute left-0 right-0 bottom-0 flex items-center gap-2 px-2" style={{ height: 40, background: GRAD.taskbar, borderTop: '1px solid rgba(255,255,255,.3)', zIndex: 100 }}>
        <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 32, height: 32, background: 'radial-gradient(circle at 35% 30%,#d58cf0,#7B0099 60%,#3d004d)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 0 8px rgba(190,100,255,.6)' }} title="Messenger 2007">
          <SmileyFace size={22} spec={{ mouth: 'bigGrin' }} />
        </div>
        <div className="flex-1 flex items-center gap-1 min-w-0 overflow-hidden">
          {phase === 'app' && taskBtn('list', 'Yahoo! Messenger', <SmileyFace size={15} />, false)}
          {phase === 'app' && wins.chat.open && activeTab && taskBtn('chat', tabs.length > 1 ? `${tabs.length} conversations` : `${activeTab} - Instant Message`, <MessageSquare size={14} color="#fff" />, wins.chat.min && totalUnread > 0)}
        </div>
        <div className="flex items-center gap-2 px-3 shrink-0" style={{ height: 30, borderLeft: '1px solid rgba(255,255,255,.2)', color: '#fff', fontSize: 12 }}>
          <button type="button" title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'} onClick={() => setSoundOn((v) => !v)}>
            {soundOn ? <Volume2 size={16} color="#fff" /> : <VolumeX size={16} color="#ff9a9a" />}
          </button>
          <button
            type="button"
            title="Yahoo! Messenger"
            onClick={() => { if (phase === 'app') { setWins((w) => ({ ...w, list: { ...w.list, min: false, z: ++zTop.current } })); setFocusWin('list'); } }}
          >
            <StatusIcon status={phase === 'app' ? me.status : 'offline'} size={18} />
          </button>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{clockStr}</span>
        </div>
      </div>

      <Toasts toasts={toasts} contactsById={contactsById} onOpen={onToastOpen} onClose={(id) => setToasts((p) => p.filter((x) => x.id !== id))} />
      {modalEl}
    </div>
  );
}
