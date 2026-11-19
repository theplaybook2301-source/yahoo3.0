import React, { useState, useEffect, useRef, useMemo, useId } from 'react';
import {
  Search, ChevronDown, ChevronRight, X, Minus, Square, Send, UserPlus, Volume2, VolumeX,
  Bold, Italic, Underline, MessageSquare, Phone, Video, Paperclip, ArrowLeft, Edit3,
  Palette, Image as ImageIcon, LogOut, Users, Clock, Camera, Mic, Music, Home, Bot, HelpCircle,
} from 'lucide-react';

/* =====================================================================
   Nhà Mình Messenger — messenger phong cách 2007 cho cả nhà.
   Chạy trong claude.ai Artifact: tin nhắn lưu bằng `db`, ai đang online
   bằng `room`, danh tính bằng `user`, ảnh bằng `assets`, bạn ảo trả lời
   bằng `sample` (AI). Không có khả năng đó thì chạy chế độ một mình.
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

// Biểu tượng ẩn: gõ đúng mã mới hiện, không có trong bảng chọn
const HIDDEN_EMOTICON_DEFS = [
  ['(pho)', 'phở', '🍜'], ['(banhmi)', 'bánh mì', '🥖'], ['(com)', 'cơm nhà', '🍚'], ['(tet)', 'lì xì Tết', '🧧'],
  ['(hoamai)', 'hoa mai', '🌼'], ['(xemay)', 'xe máy', '🛵'], ['(sinhnhat)', 'sinh nhật', '🎂'], ['(yeu)', 'thương lắm', '❤️'],
  ['(meo)', 'mèo', '🐱'], ['(cho)', 'cún', '🐶'], ['(mua)', 'trời mưa', '🌧️'], ['(ngu)', 'đi ngủ', '😴'],
];
const EMOTICONS = [
  ...EMOTICON_DEFS.map(([code, name, art, aliases = []]) => ({ code, name, art, aliases, hidden: false })),
  ...HIDDEN_EMOTICON_DEFS.map(([code, name, art]) => ({ code, name, art, aliases: [], hidden: true })),
];
const PICKER_EMOTICONS = EMOTICONS.filter((e) => !e.hidden);
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
    // ----- Audibles: hoạt hình kèm tiếng -----
    audible(kind) {
      const c = get(); if (!c) return;
      const t0 = c.currentTime + 0.02;
      const tone = (t, f1, f2, dur, type = 'sine', vol = 0.3) => {
        const o = c.createOscillator(); o.type = type;
        o.frequency.setValueAtTime(f1, t);
        o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
        const g = env(c, t, vol, 0.01, dur);
        o.connect(g); o.start(t); o.stop(t + dur + 0.05);
        return o;
      };
      const noise = (t, dur, freq, q, vol) => {
        const len = Math.floor(c.sampleRate * dur);
        const buf = c.createBuffer(1, len, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const src = c.createBufferSource(); src.buffer = buf;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
        const g = env(c, t, vol, 0.002, dur);
        src.connect(bp); bp.connect(g); src.start(t); src.stop(t + dur + 0.02);
      };
      if (kind === 'ga-gay') {
        // ò ó o: ba nhịp vút lên rồi kéo dài
        [[0, 0.16, 520, 900], [0.2, 0.18, 600, 1000], [0.42, 0.75, 700, 1150]].forEach(([dt, dur, a, b]) => {
          const o = tone(t0 + dt, a, b, dur, 'sawtooth', 0.12);
          const vib = c.createOscillator(); const vg = c.createGain();
          vib.frequency.value = 22; vg.gain.value = 35; vib.connect(vg); vg.connect(o.frequency);
          vib.start(t0 + dt); vib.stop(t0 + dt + dur + 0.05);
        });
      } else if (kind === 'vo-tay') {
        for (let i = 0; i < 9; i++) noise(t0 + i * 0.11 + Math.random() * 0.03, 0.07, 1500 + Math.random() * 900, 1.2, 0.5);
      } else if (kind === 'hon') {
        tone(t0, 1400, 300, 0.09, 'sine', 0.35);
        noise(t0 + 0.02, 0.05, 3000, 2, 0.25);
        tone(t0 + 0.22, 1500, 320, 0.09, 'sine', 0.35);
        noise(t0 + 0.24, 0.05, 3000, 2, 0.25);
      } else if (kind === 'cuoi') {
        [0, 0.17, 0.34, 0.51, 0.7].forEach((dt, i) => {
          const f = 330 - i * 18;
          const o = c.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(f, t0 + dt);
          o.frequency.linearRampToValueAtTime(f * 0.85, t0 + dt + 0.12);
          const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 3;
          const g = env(c, t0 + dt, 0.35, 0.01, 0.13);
          o.connect(bp); bp.connect(g); o.start(t0 + dt); o.stop(t0 + dt + 0.16);
        });
      } else if (kind === 'ngu-ngon') {
        [[523.3, 0], [659.3, 0.35], [784, 0.7], [659.3, 1.05], [523.3, 1.4]].forEach(([f, dt]) => bell(c, t0 + dt, f, 0.9, 0.18));
      } else if (kind === 'an-com') {
        [0, 0.6].forEach((dt) => {
          bell(c, t0 + dt, 196, 1.6, 0.35);
          bell(c, t0 + dt, 293.7, 1.4, 0.15);
        });
      }
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

const dayKey = (ts) => {
  const d = new Date(ts);
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};
const fmtLastSeen = (ts) => {
  if (!ts) return 'chưa đăng nhập lần nào';
  const d = new Date(ts);
  const today = dayKey(Date.now()) === dayKey(ts);
  return `online lần cuối ${pad2(d.getHours())}:${pad2(d.getMinutes())}${today ? ' hôm nay' : ` ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`}`;
};

const AUDIBLES = [
  { id: 'ga-gay', emoji: '🐓', label: 'Gà gáy', caption: 'Ò ó o! Dậy đi cả nhà ơi!' },
  { id: 'vo-tay', emoji: '👏', label: 'Vỗ tay', caption: 'Hoan hô! Giỏi quá!' },
  { id: 'hon', emoji: '😘', label: 'Thơm một cái', caption: 'Chụt chụt!' },
  { id: 'cuoi', emoji: '🤣', label: 'Cười lăn', caption: 'Ha ha ha ha!' },
  { id: 'ngu-ngon', emoji: '🌙', label: 'Chúc ngủ ngon', caption: 'Ngủ ngon nha, mơ đẹp!' },
  { id: 'an-com', emoji: '🍚', label: 'Về ăn cơm', caption: 'Cơm chín rồi, về ăn cơm thôi!' },
];
const AUDIBLE_BY_ID = Object.fromEntries(AUDIBLES.map((a) => [a.id, a]));

// Mô tả tính cách cho AI (bạn ảo)
const PERSONA_PROMPTS = {
  princess: 'cô gái điệu đà, dễ thương, tự xưng "pé", hay dùng teen code (j, zậy, wá, hem, nhoa, hihi), thỉnh thoảng gõ kiểu tÊeN cOdE xen kẽ hoa thường, thích kem, nhạc và blog.',
  langtu: 'chàng trai sến súa, lúc nào cũng buồn vì tình, nói chuyện như thơ, hay dùng "..." và các mặt cười =(( :(( @};-, xưng "anh" gọi "em".',
  nhoc: 'cậu nhóc quậy phá, hay trêu "ahihi đồ ngốc", cười =)) liên tục, thích ra net chơi game, hay BUZZ lại người khác.',
  anhhai: 'ông anh trai khó tính nhưng thương em, nói ngắn gọn, hay nhắc đi học bài, đang mải chơi game.',
  me: 'người mẹ mới học dùng máy tính, gõ toàn CHỮ IN HOA vì không biết tắt Caps Lock, hay hỏi đã ăn cơm chưa, học bài chưa, không hiểu teen code.',
};

// Bạn ảo — trả lời bằng AI (sample), không có AI thì dùng kịch bản có sẵn
const BOTS = [
  {
    id: 'cong_chua_bong_bong', status: 'online', persona: 'princess',
    statusMsg: '♥ Mưa rơi... lòng em cũng rơi ♥', avatar: '👸', bg: ['#ffd1ec', '#ff6fbf'],
    font: { face: 'Comic Sans MS', size: 11, color: '#FF1493', bold: true, italic: false, underline: false },
  },
  {
    id: 'lang_tu_da_tinh', status: 'busy', persona: 'langtu',
    statusMsg: 'Đừng hỏi vì sao anh buồn... 💔', avatar: '🌹', bg: ['#cfd8ff', '#5b6fd6'],
    font: { face: 'Times New Roman', size: 12, color: '#000080', bold: false, italic: true, underline: false },
  },
  {
    id: 'nhoc_quay_pha', status: 'online', persona: 'nhoc',
    statusMsg: 'Ai BUZZ tui, tui BUZZ lại x3 =))', avatar: '🐒', bg: ['#fff0b3', '#ffa31a'],
    font: { face: 'Arial', size: 10, color: '#FF6600', bold: true, italic: false, underline: false },
  },
  {
    id: 'anh_hai_xi_tin', status: 'online', persona: 'anhhai',
    statusMsg: 'Đang cày game, gọi = chết :-L', avatar: '😎', bg: ['#d6f5d6', '#3aa64a'],
    font: { face: 'Tahoma', size: 10, color: '#006600', bold: false, italic: false, underline: false },
  },
  {
    id: 'me_yeu_cua_con', status: 'away', persona: 'me',
    statusMsg: 'Đang học dùng máy tính :)', avatar: '👩', bg: ['#ffe0cc', '#e8743b'],
    font: { face: 'Arial', size: 14, color: '#CC0000', bold: true, italic: false, underline: false },
  },
];
const BOT_BY_ID = Object.fromEntries(BOTS.map((b) => [b.id, b]));

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
      title="Nhà Mình Messenger"
    />
  );
}

function Wordmark({ size = 20, light = false }) {
  return (
    <span style={{ fontFamily: '"Arial Black", Arial, sans-serif', fontWeight: 900, fontSize: size, color: light ? '#fff' : PURPLE, letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
      Nhà Mình<span style={{ fontFamily: UI_FONT, fontWeight: 700, fontSize: size * 0.82, color: light ? '#fff' : '#3d3d3d', letterSpacing: 0, marginLeft: 5 }}>Messenger</span>
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

/* ------------------------------ Tài khoản & bảo mật ------------------------------ */

const ID_RE = /^[a-z0-9_.]{3,24}$/;
const SECURITY_QUESTIONS = [
  'Tên con vật nuôi đầu tiên của bạn?',
  'Tên trường tiểu học của bạn?',
  'Món ăn bạn thích nhất hồi nhỏ?',
  'Tên người bạn thân nhất hồi nhỏ?',
  'Bạn sinh ra ở thành phố nào?',
  'Biệt danh ở nhà của bạn?',
];
const COMMON_PW = ['12345678', '123456789', 'password', 'matkhau', 'iloveyou', 'qwertyui', '11111111', 'abc12345', 'anhyeuem', 'emyeuanh'];
const PBKDF2_ITER = 150000;
const te = new TextEncoder();
const toB64 = (buf) => { let s = ''; new Uint8Array(buf).forEach((b) => { s += String.fromCharCode(b); }); return btoa(s); };
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const randB64 = (n) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return toB64(a); };
const hasCrypto = () => typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.getRandomValues === 'function';

async function pbkdf2(secret, saltB64, iter) {
  const key = await crypto.subtle.importKey('raw', te.encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromB64(saltB64), iterations: iter }, key, 256);
  return toB64(bits);
}
async function makeVerifier(secret) {
  const salt = randB64(16);
  return { salt, iter: PBKDF2_ITER, hash: await pbkdf2(secret, salt, PBKDF2_ITER) };
}
async function checkVerifier(secret, v) {
  if (!v || !v.salt || !v.hash) return false;
  const h = await pbkdf2(secret, v.salt, v.iter || PBKDF2_ITER);
  let diff = h.length ^ v.hash.length;
  for (let i = 0; i < Math.min(h.length, v.hash.length); i++) diff |= h.charCodeAt(i) ^ v.hash.charCodeAt(i);
  return diff === 0;
}
async function sha256b64(s) { return toB64(await crypto.subtle.digest('SHA-256', te.encode(s))); }
const normAnswer = (s) => norm(s).replace(/\s+/g, ' ').trim();

function pwProblem(pw, id) {
  if (pw.length < 8) return 'Mật khẩu cần ít nhất 8 ký tự.';
  if (id && pw.toLowerCase().includes(id.toLowerCase())) return 'Mật khẩu không được chứa ID.';
  if (COMMON_PW.includes(pw.toLowerCase())) return 'Mật khẩu này quá dễ đoán, chọn cái khác nhé.';
  return '';
}
function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 2) return { s, label: 'Yếu', color: '#d4442f' };
  if (s === 3) return { s, label: 'Trung bình', color: '#e08a00' };
  return { s, label: 'Mạnh', color: '#2a9d3a' };
}
function describeDevice() {
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
  const os = /iPhone|iPad|iPod/.test(ua) ? 'iPhone/iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X|Macintosh/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Thiết bị lạ';
  const br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'trình duyệt';
  return `${os} · ${br}`;
}
const fmtDateTime = (ts) => { if (!ts) return '—'; const d = new Date(ts); return `${pad2(d.getHours())}:${pad2(d.getMinutes())} ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`; };

function Captcha({ onCode, refreshKey }) {
  const ref = useRef(null);
  useEffect(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    onCode(code);
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext('2d');
    if (!g) return;
    g.fillStyle = '#f4ecf8'; g.fillRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${90 + Math.random() * 120},${40 + Math.random() * 80},${140 + Math.random() * 100},.35)`; g.fillRect(Math.random() * cv.width, Math.random() * cv.height, 2, 2); }
    [...code].forEach((ch, i) => {
      g.save();
      g.translate(16 + i * 25, 30 + Math.random() * 6 - 3);
      g.rotate((Math.random() - 0.5) * 0.7);
      g.font = `bold ${22 + Math.floor(Math.random() * 6)}px "Comic Sans MS", Georgia, serif`;
      g.fillStyle = ['#5a0073', '#7B0099', '#2a4bb5', '#a3135a'][i % 4];
      g.fillText(ch, 0, 0);
      g.restore();
    });
    for (let i = 0; i < 3; i++) {
      g.strokeStyle = 'rgba(123,0,153,.45)'; g.lineWidth = 1.4; g.beginPath();
      g.moveTo(0, Math.random() * cv.height);
      g.bezierCurveTo(50, Math.random() * cv.height, 100, Math.random() * cv.height, cv.width, Math.random() * cv.height);
      g.stroke();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);
  return <canvas ref={ref} width={140} height={44} style={{ border: '1px solid #a99bb3', borderRadius: 2, background: '#f4ecf8' }} aria-label="Mã xác nhận" />;
}

function PwField({ id, label, value, onChange, autoComplete, mobile, meter, idForCheck }) {
  const [show, setShow] = useState(false);
  const st = meter && value ? pwStrength(value) : null;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>{label}</label>
      <div className="flex items-center" style={{ border: '1px solid #7f9db9', borderRadius: 2, background: '#fff' }}>
        <input id={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 min-w-0" style={{ fontSize: mobile ? 16 : 13, padding: mobile ? '8px' : '4px 6px', border: 'none', outline: 'none', background: 'transparent', fontFamily: UI_FONT }} />
        <button type="button" onClick={() => setShow((v) => !v)} className="px-2" style={{ fontSize: 10.5, color: '#6d5a78' }} title={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{show ? 'Ẩn' : 'Hiện'}</button>
      </div>
      {st && (
        <div className="flex items-center gap-2" style={{ fontSize: 11 }}>
          <div className="flex gap-px flex-1" style={{ maxWidth: 160 }}>
            {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ flex: 1, height: 5, background: i < st.s ? st.color : '#e3dce8' }} />)}
          </div>
          <span style={{ color: st.color, fontWeight: 700 }}>{st.label}</span>
          {idForCheck !== undefined && pwProblem(value, idForCheck) ? <span style={{ color: '#a33' }}>{pwProblem(value, idForCheck)}</span> : null}
        </div>
      )}
    </div>
  );
}

function LoginPanel({ phase, member, account, profileName, takenNicks, solo, lastId, hasRememberedDevice, rememberPref, autoSignIn, kickedMsg, onSignIn, onRegister, onRecover, onSetPassword, mobile }) {
  const locked = phase === 'locked';
  const initialMode = locked ? 'signin' : !member ? 'register' : !(account && account.pw) ? 'setpw' : 'signin';
  const [mode, setMode] = useState(initialMode);
  const [id, setId] = useState(() => (member ? member.nick : lastId || ''));
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [displayName, setDisplayName] = useState(profileName || '');
  const [question, setQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [answer, setAnswer] = useState('');
  const [avatarIdx, setAvatarIdx] = useState(() => (member ? member.avatar || 0 : hashStr(profileName || 'x') % MY_AVATARS.length));
  const [remember, setRemember] = useState(rememberPref);
  const [auto, setAuto] = useState(autoSignIn);
  const [invisible, setInvisible] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaIn, setCaptchaIn] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const autoDone = useRef(false);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const run = async (fn) => {
    sfx.unlock();
    if (!hasCrypto()) { setError('Trình duyệt này không hỗ trợ mã hóa mật khẩu. Hãy dùng Chrome, Safari, Edge hoặc Firefox bản mới.'); return; }
    setError('');
    setBusy(true);
    const started = Date.now();
    let err = null;
    try { err = await fn(); } catch (e) { err = `Có lỗi (${(e && e.code) || (e && e.message) || 'không rõ'}). Thử lại nhé.`; }
    const wait = Math.max(0, 900 - (Date.now() - started));
    await new Promise((r) => setTimeout(r, wait));
    if (!alive.current) return;
    setBusy(false);
    if (err) { setError(err); setPw(''); setPw2(''); setCaptchaKey((k) => k + 1); setCaptchaIn(''); }
  };

  const useToken = hasRememberedDevice && rememberPref && !pw && !locked;
  const submitSignIn = (e) => {
    if (e) e.preventDefault();
    const clean = id.trim().toLowerCase();
    if (!clean) { setError('Nhập ID của bạn.'); return; }
    if (!pw && !useToken) { setError('Nhập mật khẩu.'); return; }
    run(() => onSignIn({ id: clean, password: pw, useToken, remember, auto: remember && auto, invisible }));
  };
  const checkNewPw = (cleanId) => {
    const p = pwProblem(pw, cleanId);
    if (p) return p;
    if (pw !== pw2) return 'Hai lần nhập mật khẩu chưa giống nhau.';
    if (normAnswer(answer).length < 2) return 'Nhập câu trả lời cho câu hỏi bảo mật.';
    if (captchaIn.trim().toUpperCase() !== captcha) return 'Mã xác nhận chưa đúng, nhìn kỹ lại nhé.';
    return '';
  };
  const submitRegister = (e) => {
    e.preventDefault();
    const clean = id.trim().toLowerCase();
    if (!ID_RE.test(clean)) { setError('ID gồm 3–24 ký tự: chữ thường không dấu, số, dấu _ hoặc dấu chấm.'); return; }
    if (takenNicks.has(clean)) { setError(`ID "${clean}" đã có người dùng, chọn ID khác nha.`); return; }
    const p = checkNewPw(clean);
    if (p) { setError(p); setCaptchaKey((k) => k + 1); setCaptchaIn(''); return; }
    run(() => onRegister({ id: clean, password: pw, displayName: displayName.trim(), question, answer, avatarIdx, invisible }));
  };
  const submitSetPw = (e) => {
    e.preventDefault();
    const p = checkNewPw(member ? member.nick : '');
    if (p) { setError(p); setCaptchaKey((k) => k + 1); setCaptchaIn(''); return; }
    run(() => onSetPassword({ password: pw, question, answer }));
  };
  const submitRecover = (e) => {
    e.preventDefault();
    const p = pwProblem(pw, member ? member.nick : '');
    if (normAnswer(answer).length < 1) { setError('Nhập câu trả lời bảo mật.'); return; }
    if (p) { setError(p); return; }
    if (pw !== pw2) { setError('Hai lần nhập mật khẩu chưa giống nhau.'); return; }
    run(() => onRecover({ answer, password: pw }));
  };

  // Tự đăng nhập bằng thiết bị đã ghi nhớ
  useEffect(() => {
    if (phase === 'login' && mode === 'signin' && autoSignIn && hasRememberedDevice && member && !autoDone.current) {
      autoDone.current = true;
      run(() => onSignIn({ id: member.nick, password: '', useToken: true, remember: true, auto: true, invisible: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode]);

  const label = { fontSize: 12, color: '#333', fontWeight: 700 };
  const input = { fontSize: mobile ? 16 : 13, border: '1px solid #7f9db9', borderRadius: 2, padding: mobile ? '8px' : '4px 6px', background: '#fff', width: '100%', outline: 'none', fontFamily: UI_FONT, color: '#111' };
  const check = (cid, checked, set, text, disabled) => (
    <label htmlFor={cid} className="flex items-center gap-2 cursor-pointer select-none" style={{ fontSize: 12, color: disabled ? '#aaa' : '#333' }}>
      <input id={cid} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => set(e.target.checked)} style={{ width: 14, height: 14, accentColor: PURPLE }} />
      {text}
    </label>
  );
  const link = (text, onClick) => <button type="button" style={{ color: '#0645ad', textDecoration: 'underline', fontSize: 12 }} onClick={() => { setError(''); setPw(''); setPw2(''); onClick(); }}>{text}</button>;
  const yellowBtn = (text) => (
    <button type="submit" disabled={busy} className="mt-1 self-center active:translate-y-px disabled:opacity-60" style={{ background: GRAD.signIn, border: '1px solid #a86b00', borderRadius: 4, padding: mobile ? '10px 40px' : '6px 36px', fontWeight: 700, fontSize: mobile ? 16 : 14, color: '#3d2200', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.9), 0 2px 3px rgba(0,0,0,.2)', textShadow: '0 1px 0 rgba(255,255,255,.6)' }}>{text}</button>
  );
  const sqFields = (
    <>
      <div className="flex flex-col gap-1">
        <label htmlFor="nm-sq" style={label}>Câu hỏi bảo mật (để lấy lại mật khẩu):</label>
        <select id="nm-sq" value={question} onChange={(e) => setQuestion(e.target.value)} style={input}>{SECURITY_QUESTIONS.map((q) => <option key={q} value={q}>{q}</option>)}</select>
        <input id="nm-sa" autoComplete="off" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Câu trả lời của bạn" style={input} />
      </div>
      <div className="flex flex-col gap-1">
        <span style={label}>Nhập mã xác nhận:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <Captcha onCode={setCaptcha} refreshKey={captchaKey} />
          <button type="button" onClick={() => setCaptchaKey((k) => k + 1)} style={{ fontSize: 11, color: '#0645ad', textDecoration: 'underline' }}>Đổi mã khác</button>
        </div>
        <input id="nm-captcha" autoComplete="off" autoCapitalize="characters" value={captchaIn} onChange={(e) => setCaptchaIn(e.target.value)} placeholder="5 ký tự trong hình" style={{ ...input, maxWidth: 160, textTransform: 'uppercase' }} />
      </div>
    </>
  );
  const av = MY_AVATARS[avatarIdx] || MY_AVATARS[0];

  let body;
  if (phase === 'connecting') {
    body = (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-10" style={{ color: PURPLE, fontWeight: 700, fontSize: 14 }}>
        <span>Đang kết nối<span className="ym-dots" /></span>
        <span style={{ fontSize: 11, color: '#777', fontWeight: 400 }}>Nếu được hỏi quyền, hãy bấm Cho phép.</span>
      </div>
    );
  } else if (busy) {
    body = (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-4">
        <div style={{ fontSize: 14, color: PURPLE, fontWeight: 700 }}>{mode === 'register' ? 'Đang tạo ID' : 'Signing in'}<span className="ym-dots" /></div>
        <div className="w-full overflow-hidden" style={{ maxWidth: 220, height: 12, border: '1px solid #8d7a99', borderRadius: 2, background: '#fff' }}>
          <div className="ym-progress h-full" style={{ background: 'repeating-linear-gradient(90deg,#9b2fbf 0 10px,#c77de0 10px 14px)' }} />
        </div>
        <div style={{ fontSize: 12, color: '#555' }}>{id.trim().toLowerCase()}</div>
      </div>
    );
  } else if (mode === 'signin') {
    body = (
      <form onSubmit={submitSignIn} className="flex-1 flex flex-col px-6 py-4 gap-3 w-full mx-auto" style={{ maxWidth: 360 }}>
        {locked && <div className="p-2 rounded flex items-center gap-2" style={{ fontSize: 12, background: '#f6f0fa', border: '1px solid #dccbe6', color: '#4b2a5c' }}>🔒 Messenger đã khóa vì lâu không dùng. Nhập mật khẩu để mở lại.</div>}
        {kickedMsg && !locked && <div className="p-2 rounded" style={{ fontSize: 12, lineHeight: 1.45, background: '#fff6d6', border: '1px solid #f0d27a', color: '#6b4a00' }}>{kickedMsg}</div>}
        <div className="flex flex-col gap-1">
          <label style={label} htmlFor="nm-id">Messenger ID:</label>
          <input id="nm-id" autoComplete="username" autoCapitalize="none" spellCheck={false} style={{ ...input, background: locked ? '#f2eef5' : '#fff' }} readOnly={locked} value={id} onChange={(e) => setId(e.target.value)} placeholder="vd: hot_boy_2007" />
        </div>
        <div className="flex flex-col gap-1">
          <label style={label} htmlFor="nm-pw">Password:</label>
          <input id="nm-pw" type="password" autoComplete="current-password" style={input} value={pw} onChange={(e) => setPw(e.target.value)} placeholder={useToken ? '•••••••• (đã ghi nhớ trên máy này)' : ''} />
        </div>
        {error && <div style={{ fontSize: 12, color: '#c00000' }}>{error}</div>}
        {!locked && (
          <div className="flex flex-col gap-2">
            {check('nm-remember', remember, setRemember, 'Remember my ID & password')}
            {check('nm-auto', remember && auto, setAuto, 'Sign in automatically', !remember)}
            {check('nm-invisible', invisible, setInvisible, 'Sign in as invisible to everyone')}
          </div>
        )}
        {yellowBtn(locked ? 'Unlock' : 'Sign In')}
        <div className="flex flex-col items-center gap-1 mt-1">
          {link('Forgot your password?', () => setMode('forgot'))}
          {!locked && !member && link('Get a new ID', () => setMode('register'))}
        </div>
      </form>
    );
  } else if (mode === 'register' || mode === 'setpw') {
    const isReg = mode === 'register';
    body = (
      <form onSubmit={isReg ? submitRegister : submitSetPw} className="flex-1 flex flex-col px-6 py-4 gap-3 w-full mx-auto" style={{ maxWidth: 380 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE }}>{isReg ? 'Đăng ký Messenger ID mới' : 'Đặt mật khẩu cho ID của bạn'}</div>
        {isReg ? (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="nm-newid" style={label}>Chọn ID:</label>
              <input id="nm-newid" autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={24} value={id} onChange={(e) => setId(e.target.value)} placeholder="vd: cong_chua_2007" style={input} />
              <span style={{ fontSize: 11, color: '#857a8c' }}>Người kia sẽ thấy ID này. Mỗi tài khoản Claude có một ID.</span>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="nm-dname" style={label}>Tên hiển thị:</label>
              <input id="nm-dname" autoComplete="off" maxLength={40} value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={input} />
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12 }}>ID: <b>{member && member.nick}</b></div>
        )}
        <PwField id="nm-newpw" label="Mật khẩu (ít nhất 8 ký tự):" value={pw} onChange={setPw} autoComplete="new-password" mobile={mobile} meter idForCheck={isReg ? id.trim().toLowerCase() : member && member.nick} />
        <PwField id="nm-newpw2" label="Nhập lại mật khẩu:" value={pw2} onChange={setPw2} autoComplete="new-password" mobile={mobile} />
        {sqFields}
        {isReg && (
          <div className="flex flex-col gap-1">
            <span style={label}>Display Image:</span>
            <div className="flex flex-wrap gap-1">
              {MY_AVATARS.map((a, i) => (
                <button key={a[0]} type="button" onClick={() => setAvatarIdx(i)} title="Chọn ảnh đại diện" className="rounded" style={{ padding: 2, border: i === avatarIdx ? `2px solid ${PURPLE}` : '2px solid transparent' }}>
                  <Avatar emoji={a[0]} bg={[a[1], a[2]]} size={mobile ? 34 : 28} />
                </button>
              ))}
            </div>
          </div>
        )}
        {error && <div style={{ fontSize: 12, color: '#c00000' }}>{error}</div>}
        {yellowBtn(isReg ? 'Tạo ID' : 'Lưu mật khẩu')}
        {isReg && member === null && <div className="flex justify-center">{link('Đã có ID? Sign In', () => setMode('signin'))}</div>}
      </form>
    );
  } else {
    const q = account && account.sq && account.sq.q;
    body = (
      <form onSubmit={submitRecover} className="flex-1 flex flex-col px-6 py-4 gap-3 w-full mx-auto" style={{ maxWidth: 380 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE }}>Lấy lại mật khẩu</div>
        {!member || !q ? (
          <div style={{ fontSize: 12 }}>Tài khoản Claude này chưa có ID hoặc chưa đặt câu hỏi bảo mật.</div>
        ) : (
          <>
            <div style={{ fontSize: 12 }}>ID: <b>{member.nick}</b></div>
            <div className="flex flex-col gap-1">
              <span style={label}>{q}</span>
              <input id="nm-ans" autoComplete="off" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Câu trả lời" style={input} />
            </div>
            <PwField id="nm-rpw" label="Mật khẩu mới:" value={pw} onChange={setPw} autoComplete="new-password" mobile={mobile} meter idForCheck={member.nick} />
            <PwField id="nm-rpw2" label="Nhập lại mật khẩu mới:" value={pw2} onChange={setPw2} autoComplete="new-password" mobile={mobile} />
            <div style={{ fontSize: 11, color: '#857a8c' }}>Đặt lại mật khẩu sẽ đăng xuất mọi thiết bị đang ghi nhớ.</div>
            {error && <div style={{ fontSize: 12, color: '#c00000' }}>{error}</div>}
            {yellowBtn('Đặt lại mật khẩu')}
          </>
        )}
        <div className="flex justify-center">{link('Quay lại Sign In', () => setMode(member && account && account.pw ? 'signin' : initialMode))}</div>
      </form>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ background: 'linear-gradient(180deg,#ffffff 0%,#f1eef4 40%,#dedbe2 100%)', fontFamily: UI_FONT }}>
      <div className="flex flex-col items-center pt-4 pb-3 px-4" style={{ background: 'linear-gradient(180deg,#f8f0fb 0%,#ffffff 100%)', borderBottom: '1px solid #e3d6ea' }}>
        <div className={busy || phase === 'connecting' ? 'ym-bounce' : 'ym-float'}>
          {member && mode !== 'register' ? <Avatar emoji={av[0]} bg={[av[1], av[2]]} size={mobile ? 72 : 60} /> : <YMLogo size={mobile ? 80 : 68} />}
        </div>
        <div className="mt-2"><Wordmark size={mobile ? 24 : 20} /></div>
        <div style={{ fontSize: 11, color: '#7a6a85' }} className="mt-1">phong cách 2007</div>
      </div>
      {body}
      <div className="pb-3 px-6 text-center" style={{ fontSize: 10.5, color: '#857a8c', lineHeight: 1.45 }}>
        {solo ? 'Chế độ một mình: tài khoản chỉ lưu trên máy này.' : 'Mật khẩu được mã hóa một chiều và lưu ở vùng riêng mà chỉ tài khoản Claude của bạn đọc được.'}
      </div>
    </div>
  );
}

function AccountDialog({ member, account, currentDeviceKey, autolock, onAutolock, onChangePassword, onChangeQuestion, onDisplayName, onForgetDevice, onForgetOthers, onClose, mobile }) {
  const [tab, setTab] = useState('info');
  const [name, setName] = useState((member && member.displayName) || '');
  const [cur, setCur] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [q, setQ] = useState((account && account.sq && account.sq.q) || SECURITY_QUESTIONS[0]);
  const [a, setA] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const input = { fontSize: mobile ? 16 : 12, border: '1px solid #7f9db9', borderRadius: 2, padding: '4px 6px', width: '100%', outline: 'none', background: '#fff' };
  const go = async (fn) => {
    setBusy(true); setMsg(null);
    let err = null;
    try { err = await fn(); } catch (e) { err = `Có lỗi (${(e && e.code) || 'không rõ'}).`; }
    setBusy(false);
    setMsg(err ? { bad: true, text: err } : { bad: false, text: 'Đã lưu.' });
    if (!err) { setCur(''); setPw(''); setPw2(''); setA(''); }
  };
  const devices = Object.entries((account && account.devices) || {});
  const tabBtn = (k, t) => <button type="button" onClick={() => { setTab(k); setMsg(null); }} className="px-3 py-1" style={{ fontSize: 12, fontWeight: tab === k ? 700 : 400, borderBottom: tab === k ? `2px solid ${PURPLE}` : '2px solid transparent', color: tab === k ? PURPLE : '#444' }}>{t}</button>;
  return (
    <Modal title="Account Info — Bảo mật tài khoản" onClose={onClose} width={460}>
      <div className="flex gap-1 mb-3" style={{ borderBottom: '1px solid #e3d6ea' }}>{tabBtn('info', 'Thông tin')}{tabBtn('pw', 'Mật khẩu')}{tabBtn('sec', 'Bảo mật')}</div>
      <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: '60vh' }}>
        {tab === 'info' && (
          <>
            <div style={{ lineHeight: 1.7 }}>
              ID: <b>{member && member.nick}</b><br />
              Ngày tạo ID: {fmtDateTime((account && account.createdAt) || (member && member.joinedAt))}<br />
              Đổi mật khẩu lần cuối: {fmtDateTime(account && account.pwChangedAt)}
            </div>
            <label htmlFor="nm-acc-name" className="flex flex-col gap-1"><b>Tên hiển thị</b><input id="nm-acc-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} style={input} /></label>
            <XPButton primary disabled={busy} onClick={() => go(() => onDisplayName(name.trim()))} className="self-start">Lưu tên</XPButton>
          </>
        )}
        {tab === 'pw' && (
          <>
            <PwField id="nm-acc-cur" label="Mật khẩu hiện tại:" value={cur} onChange={setCur} autoComplete="current-password" mobile={mobile} />
            <PwField id="nm-acc-new" label="Mật khẩu mới:" value={pw} onChange={setPw} autoComplete="new-password" mobile={mobile} meter idForCheck={member && member.nick} />
            <PwField id="nm-acc-new2" label="Nhập lại mật khẩu mới:" value={pw2} onChange={setPw2} autoComplete="new-password" mobile={mobile} />
            <div style={{ fontSize: 11, color: '#857a8c' }}>Đổi mật khẩu sẽ đăng xuất các thiết bị khác đang ghi nhớ.</div>
            <XPButton primary disabled={busy} className="self-start" onClick={() => go(() => {
              const p = pwProblem(pw, member && member.nick);
              if (p) return p;
              if (pw !== pw2) return 'Hai lần nhập mật khẩu mới chưa giống nhau.';
              return onChangePassword(cur, pw);
            })}>Đổi mật khẩu</XPButton>
            <div style={{ borderTop: '1px solid #e3d6ea' }} />
            <b>Câu hỏi bảo mật</b>
            <select id="nm-acc-q" value={q} onChange={(e) => setQ(e.target.value)} style={input}>{SECURITY_QUESTIONS.map((x) => <option key={x} value={x}>{x}</option>)}</select>
            <input id="nm-acc-a" value={a} onChange={(e) => setA(e.target.value)} placeholder="Câu trả lời mới" style={input} />
            <PwField id="nm-acc-cur2" label="Mật khẩu hiện tại (để xác nhận):" value={cur} onChange={setCur} autoComplete="current-password" mobile={mobile} />
            <XPButton disabled={busy} className="self-start" onClick={() => go(() => (normAnswer(a).length < 2 ? 'Nhập câu trả lời.' : onChangeQuestion(cur, q, a)))}>Lưu câu hỏi bảo mật</XPButton>
          </>
        )}
        {tab === 'sec' && (
          <>
            <div>
              <b>Lịch sử đăng nhập</b>
              <div className="mt-1" style={{ border: '1px solid #e3d6ea', borderRadius: 2 }}>
                {((account && account.logins) || []).map((l, i) => (
                  <div key={`${l.t}-${i}`} className="flex justify-between px-2 py-1" style={{ fontSize: 11.5, borderTop: i ? '1px solid #f1eaf4' : 'none', background: i === 0 ? '#f8f2fb' : '#fff' }}>
                    <span>{l.d}{i === 0 ? ' (lần này)' : ''}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtDateTime(l.t)}</span>
                  </div>
                ))}
                {!((account && account.logins) || []).length && <div className="px-2 py-1" style={{ fontSize: 11.5, color: '#888' }}>Chưa có.</div>}
              </div>
              <div className="mt-1" style={{ fontSize: 11, color: '#857a8c' }}>Thấy lần đăng nhập lạ? Đổi mật khẩu ngay.</div>
            </div>
            <div>
              <b>Thiết bị đã ghi nhớ</b>
              <div className="mt-1 flex flex-col gap-1">
                {devices.map(([k, d]) => (
                  <div key={k} className="flex items-center justify-between gap-2 px-2 py-1" style={{ fontSize: 11.5, border: '1px solid #e3d6ea', borderRadius: 2 }}>
                    <span>{d.d}{k === currentDeviceKey ? ' (máy này)' : ''}<br /><span style={{ color: '#888' }}>từ {fmtDateTime(d.t)}</span></span>
                    <XPButton disabled={busy} onClick={() => go(() => onForgetDevice(k))}>Quên</XPButton>
                  </div>
                ))}
                {!devices.length && <div style={{ fontSize: 11.5, color: '#888' }}>Không có thiết bị nào được ghi nhớ.</div>}
              </div>
              {devices.length > 0 && <XPButton disabled={busy} className="mt-2" onClick={() => go(onForgetOthers)}>Đăng xuất mọi thiết bị khác</XPButton>}
            </div>
            <label htmlFor="nm-autolock" className="flex flex-col gap-1">
              <b>Tự khóa khi không dùng (trên máy này)</b>
              <select id="nm-autolock" value={autolock} onChange={(e) => onAutolock(Number(e.target.value))} style={{ ...input, maxWidth: 200 }}>
                <option value={0}>Không tự khóa</option>
                <option value={5}>Sau 5 phút</option>
                <option value={15}>Sau 15 phút</option>
                <option value={30}>Sau 30 phút</option>
                <option value={60}>Sau 1 giờ</option>
              </select>
            </label>
          </>
        )}
        {msg && <div style={{ fontSize: 12, color: msg.bad ? '#c00000' : '#2a7a2a' }}>{msg.text}</div>}
      </div>
    </Modal>
  );
}

/* ------------------------------ Danh sách ------------------------------ */

const LIST_GROUPS = [
  { id: 'room', label: 'Phòng chat' },
  { id: 'family', label: 'Gia đình' },
  { id: 'bots', label: 'Bạn ảo (AI)' },
];

function ListRow({ e, onOpen, mobile }) {
  const off = e.status === 'offline' || e.status === 'invisible';
  return (
    <button
      type="button"
      onClick={() => onOpen(e.key)}
      className="w-full flex items-center gap-2 text-left hover:bg-purple-50 active:bg-purple-100"
      style={{ padding: mobile ? '7px 16px' : '5px 8px', borderBottom: '1px solid #f1eaf4' }}
      title={e.tooltip || e.name}
    >
      <span style={{ paddingLeft: mobile ? 0 : 12 }}>
        {e.group === 'room' ? <Home size={17} color={PURPLE} /> : e.group === 'bots' ? <StatusIcon status={e.status} size={17} /> : <StatusIcon status={e.status} size={17} />}
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-1">
          <span className="truncate" style={{ fontWeight: 700, fontSize: 12.5, color: off ? '#8a8a8a' : '#1a1a1a' }}>{e.name}</span>
          {e.group === 'bots' && <span className="shrink-0 px-1 rounded-sm" style={{ fontSize: 9, color: '#6d3b85', background: '#efe2f6', border: '1px solid #d9c2e6' }}>AI</span>}
          {e.unread > 0 && <span className="shrink-0 px-1 rounded-sm ym-flash" style={{ fontSize: 10, color: '#fff', background: '#ff6a00', fontWeight: 700 }}>{e.unread}</span>}
        </span>
        <span className="block truncate" style={{ fontSize: 11, color: off ? '#a5a5a5' : '#6b6b6b' }}>
          {e.typing ? <span style={{ color: PURPLE }}>✎ {e.typing}</span> : e.sub ? renderWithEmoticons(e.sub, 14) : ' '}
        </span>
      </span>
      <Avatar emoji={e.avatar} bg={e.bg} size={30} dim={off && e.group !== 'room'} />
    </button>
  );
}

function ContactListPanel({ me, myAvatar, onCycleAvatar, onSetStatus, onSetStatusMsg, entries, groupsOpen, onToggleGroup, onOpen, menus, soundOn, onToggleSound, mobile, tip, solo, onInviteHelp, onAudibleHelp }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const [draftMsg, setDraftMsg] = useState(me.statusMsg);
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef(null);
  useEffect(() => {
    if (!statusOpen) return undefined;
    const close = (ev) => { if (statusRef.current && !statusRef.current.contains(ev.target)) setStatusOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [statusOpen]);

  const q = norm(query.trim());
  const filtered = entries.filter((e) => !q || norm(e.name).includes(q) || norm(e.sub).includes(q));
  const commit = (v) => { setEditing(false); onSetStatusMsg((v !== undefined ? v : draftMsg).trim()); };
  const history = (me.statusHistory || []).filter((h) => h && h !== me.statusMsg).slice(0, 6);
  const familyCount = entries.filter((e) => e.group === 'family').length;

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: UI_FONT, background: '#fff' }}>
      <MenuBar menus={menus} />

      <div className="flex gap-3 py-3 shrink-0" style={{ paddingLeft: mobile ? 16 : 12, paddingRight: mobile ? 16 : 12, background: GRAD.lavender, borderBottom: '1px solid #dccbe6' }}>
        <Avatar emoji={myAvatar[0]} bg={[myAvatar[1], myAvatar[2]]} size={mobile ? 58 : 52} onClick={onCycleAvatar} title="Change My Display Image (bấm để đổi)" />
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          <div ref={statusRef} className="relative">
            <button type="button" className="flex items-center gap-1 max-w-full rounded px-1 -mx-1 hover:bg-white" onClick={() => setStatusOpen((v) => !v)} title="Change my status">
              <StatusIcon status={me.status} size={16} />
              <span className="truncate" style={{ fontWeight: 700, fontSize: 13, color: '#222' }}>{me.nick}</span>
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
            <div className="relative">
              <input
                id="nm-status-msg"
                autoFocus
                value={draftMsg}
                maxLength={120}
                onChange={(ev) => setDraftMsg(ev.target.value)}
                onBlur={() => commit()}
                onKeyDown={(ev) => { if (ev.key === 'Enter') commit(); if (ev.key === 'Escape') { setEditing(false); setDraftMsg(me.statusMsg); } }}
                placeholder="Type a status message"
                className="w-full"
                style={{ fontSize: mobile ? 16 : 12, border: '1px solid #a77bbd', borderRadius: 2, padding: '2px 4px', outline: 'none', background: '#fff' }}
              />
              {history.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-px py-1" style={{ zIndex: 40, background: '#fff', border: '1px solid #8d7a99', boxShadow: '2px 3px 8px rgba(0,0,0,.25)' }}>
                  <div className="px-2" style={{ fontSize: 10, color: '#8a7a96' }}>Status gần đây</div>
                  {history.map((h) => (
                    <button key={h} type="button" className="w-full text-left px-2 py-1 truncate hover:bg-purple-100" style={{ fontSize: 12 }} onPointerDown={(ev) => { ev.preventDefault(); setDraftMsg(h); commit(h); }}>
                      {renderWithEmoticons(h, 14)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setDraftMsg(me.statusMsg); setEditing(true); }}
              className="text-left truncate rounded px-1 -mx-1 hover:bg-white flex items-center gap-1"
              style={{ fontSize: 12, color: me.statusMsg ? '#333' : '#9a8aa4', fontStyle: me.statusMsg ? 'normal' : 'italic' }}
              title="Bấm để sửa status message"
            >
              <span className="truncate">{me.statusMsg ? renderWithEmoticons(me.statusMsg, 15) : 'Type a status message (bấm để sửa)'}</span>
              <Edit3 size={12} color="#9a7aab" className="shrink-0" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 py-1 shrink-0" style={{ paddingLeft: mobile ? 12 : 8, paddingRight: mobile ? 16 : 8, background: GRAD.silverSoft, borderBottom: '1px solid #cfc6d4' }}>
        <ToolButton compact icon={UserPlus} label="Mời" title="Mời người thân vào" onClick={onInviteHelp} />
        <ToolButton compact icon={Music} label="Audibles" title="Audibles là gì?" onClick={onAudibleHelp} />
        <ToolButton compact icon={soundOn ? Volume2 : VolumeX} label="Sound" title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'} onClick={onToggleSound} active={!soundOn} />
        <div className="flex-1 min-w-0 flex items-center gap-1 ml-1 px-2" style={{ background: '#fff', border: '1px solid #a99bb3', borderRadius: 12, height: mobile ? 34 : 24 }}>
          <Search size={14} color="#8a7a96" />
          <input id="nm-search" value={query} onChange={(ev) => setQuery(ev.target.value)} placeholder="Find a contact..." className="flex-1 min-w-0 bg-transparent" style={{ fontSize: mobile ? 16 : 12, outline: 'none', border: 'none' }} />
          {query && <button type="button" onClick={() => setQuery('')} title="Clear"><X size={13} color="#8a7a96" /></button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0" style={{ background: '#fff' }}>
        {LIST_GROUPS.map((g) => {
          const all = entries.filter((e) => e.group === g.id);
          const list = filtered.filter((e) => e.group === g.id);
          if (g.id === 'room' && all.length === 0) return null;
          if (q && list.length === 0) return null;
          const onlineCount = all.filter((e) => e.status !== 'offline' && e.status !== 'invisible').length;
          const open = q ? true : groupsOpen[g.id] !== false;
          return (
            <div key={g.id}>
              <button
                type="button"
                onClick={() => onToggleGroup(g.id)}
                className="w-full flex items-center gap-1 text-left select-none"
                style={{ height: mobile ? 32 : 24, paddingLeft: mobile ? 12 : 8, background: 'linear-gradient(180deg,#f6eff9,#e9dcef)', borderBottom: '1px solid #dccbe6', borderTop: '1px solid #fff', fontWeight: 700, fontSize: 12, color: '#4b2a5c' }}
              >
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {g.label} {g.id !== 'room' && <span style={{ fontWeight: 400, color: '#7d6a88' }}>({onlineCount}/{all.length})</span>}
              </button>
              {open && list.map((e) => <ListRow key={e.key} e={e} onOpen={onOpen} mobile={mobile} />)}
              {open && !q && g.id === 'family' && familyCount === 0 && (
                <div className="px-4 py-3" style={{ fontSize: 11.5, color: '#6d5a78', lineHeight: 1.5 }}>
                  {solo ? 'Chế độ một mình: chưa kết nối dữ liệu chung.' : 'Chưa có người thân nào vào. Mời cả nhà bằng nút Share của trang này (quyền Editor), rồi mỗi người mở link và Sign In.'}
                  {!solo && <><br /><button type="button" style={{ color: '#0645ad', textDecoration: 'underline' }} onClick={onInviteHelp}>Xem hướng dẫn mời người thân</button></>}
                </div>
              )}
            </div>
          );
        })}
        {q && filtered.length === 0 && <div className="p-4 text-center" style={{ fontSize: 12, color: '#888' }}>Không tìm thấy "{query}".</div>}
      </div>

      <div className="shrink-0 flex items-center gap-2 py-2" style={{ paddingLeft: mobile ? 16 : 12, paddingRight: mobile ? 16 : 12, background: GRAD.silverSoft, borderTop: '1px solid #cfc6d4', fontSize: 11, color: '#4d3d58' }}>
        <SmileyFace size={16} spec={{ eyes: 'wink' }} />
        <span className="flex-1">{renderWithEmoticons(tip, 15)}</span>
      </div>
    </div>
  );
}

const TIPS = [
  'Mẹo: gõ :D  =))  :((  ;)  B-)  rồi Send để hiện mặt cười!',
  'Mẹo: bấm BUZZ! để rung màn hình người nhận >:)',
  'Mẹo: bấm vào status message để sửa trực tiếp :-/',
  'Mẹo: thử gõ (pho) (tet) (com) — biểu tượng ẩn đó ;)',
  'Mẹo: nút 🎵 trong khung chat để gửi Audibles: gà gáy, vỗ tay, về ăn cơm...',
  'Mẹo: nút máy ảnh để chụp/gửi ảnh cho cả nhà :x',
  'Mẹo: Phòng chat Cả Nhà là nơi mọi người cùng nói chuyện =D>',
];

/* ------------------------------ Cửa sổ chat ------------------------------ */

function fontCss(f) {
  const ff = f || DEFAULT_FONT;
  return {
    fontFamily: FONT_FALLBACK[ff.face] || ff.face,
    fontSize: `${ff.size}pt`,
    color: ff.color,
    fontWeight: ff.bold ? 700 : 400,
    fontStyle: ff.italic ? 'italic' : 'normal',
    textDecoration: ff.underline ? 'underline' : 'none',
  };
}

const NAME_COLORS = ['#8e1c8e', '#b5470b', '#0b7a5a', '#a3135a', '#5a3fb5', '#9a6a00', '#0f6aa3'];
const nameColor = (name) => NAME_COLORS[hashStr(name || '') % NAME_COLORS.length];

function MessageLine({ m, showTime, onImage }) {
  const time = showTime ? <span style={{ color: '#8a8a8a', fontSize: 11 }}>({fmtTime(m.time)}) </span> : null;
  if (m.from === 'system') {
    return <div className="py-px" style={{ fontSize: 11.5, color: '#7a7a7a', fontStyle: 'italic' }}>{time}{renderWithEmoticons(m.text, 16)}</div>;
  }
  const mine = m.from === 'me';
  const who = <span style={{ fontWeight: 700, color: mine ? '#2a4bb5' : nameColor(m.name), fontSize: 12, fontFamily: UI_FONT }}>{m.name}: </span>;
  let body;
  if (m.kind === 'buzz') {
    body = <span className="ym-buzz-text" style={{ color: '#ff0000', fontWeight: 900, fontSize: 15, fontFamily: 'Arial, sans-serif', letterSpacing: 1 }}>BUZZ!!!</span>;
  } else if (m.kind === 'img') {
    body = m.img ? (
      <button type="button" onClick={() => onImage(m.img)} className="block mt-1" title="Bấm để xem ảnh lớn">
        <img src={m.img} alt="Ảnh đã gửi" style={{ maxWidth: 'min(240px, 100%)', maxHeight: 240, borderRadius: 3, border: '1px solid #c9bcd3', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
      </button>
    ) : <span style={{ color: '#888', fontStyle: 'italic' }}>đang gửi ảnh...</span>;
  } else if (m.kind === 'aud') {
    const a = AUDIBLE_BY_ID[m.au] || AUDIBLES[0];
    body = (
      <span className="inline-flex items-center gap-2 mt-1 px-2 py-1 rounded" style={{ background: '#fff7d6', border: '1px solid #f0d27a' }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{a.emoji}</span>
        <span><b style={{ color: '#7a4a00', fontSize: 12 }}>Audible: {a.label}</b><br /><span style={{ fontSize: 12, color: '#5a4a2a' }}>{a.caption}</span></span>
      </span>
    );
  } else {
    body = <span className="whitespace-pre-wrap" style={fontCss(m.font)}>{renderWithEmoticons(m.text || '', 22)}</span>;
  }
  return (
    <div className="py-px break-words" style={{ lineHeight: 1.45, opacity: m.pending ? 0.6 : 1 }}>
      {time}{who}{m.kind === 'img' || m.kind === 'aud' ? <br /> : null}{body}
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
    <div ref={ref} className="absolute left-1 bottom-full mb-1 flex flex-col" style={{ zIndex: 50, width: mobile ? 'calc(100% - 8px)' : 330, background: '#fff', border: '1px solid #8d7a99', boxShadow: '2px 4px 12px rgba(0,0,0,.35)', borderRadius: 3 }}>
      <div className="flex items-center justify-between px-2 py-1" style={{ background: GRAD.lavender, borderBottom: '1px solid #dccbe6', fontSize: 11, fontWeight: 700, color: '#4b2a5c' }}>
        <span>Emoticons</span>
        <button type="button" onClick={onClose} title="Close"><X size={13} /></button>
      </div>
      <div className="grid overflow-y-auto p-1" style={{ gridTemplateColumns: `repeat(${mobile ? 8 : 10}, minmax(0, 1fr))`, maxHeight: mobile ? 210 : 220 }}>
        {PICKER_EMOTICONS.map((e) => (
          <button key={e.code} type="button" className="flex items-center justify-center rounded hover:bg-purple-100" style={{ height: mobile ? 38 : 30, border: hover === e ? '1px solid #b98ccc' : '1px solid transparent' }} onPointerEnter={() => setHover(e)} onClick={() => onPick(e.code)} title={`${e.name} ${e.code}`}>
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
        {FONT_COLORS.map((c) => <button key={c} type="button" title={c} onClick={() => onPick(c)} style={{ width: 16, height: 16, background: c, border: value === c ? '2px solid #222' : '1px solid #888' }} />)}
      </div>
      <label htmlFor="nm-color" className="flex items-center gap-2 mt-2" style={{ fontSize: 11 }}>
        Màu khác:
        <input id="nm-color" type="color" value={value} onChange={(e) => onPick(e.target.value)} style={{ width: 36, height: 20, padding: 0, border: '1px solid #888' }} />
      </label>
    </div>
  );
}

function Popover({ onClose, children, style, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target) && !e.target.closest('[data-pop-toggle]')) onClose(); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [onClose]);
  return <div ref={ref} className={`absolute py-1 ${className}`} style={{ zIndex: 50, background: '#fff', border: '1px solid #8d7a99', boxShadow: '2px 3px 8px rgba(0,0,0,.3)', ...style }}>{children}</div>;
}

function ChatPanel({
  head, messages, myAvatar, myNick, myFont, setMyFont, draft, setDraft, onSend, onBuzz, onAction, onSendImage, onAudible,
  onSetImv, imv, typingText, tabs, activeKey, onSelectTab, onCloseTab, showTime, menus, mobile, onBack, buzzFlash, dictation, canImage,
}) {
  const [emoOpen, setEmoOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [pop, setPop] = useState(null); // 'imv' | 'aud'
  const [viewImg, setViewImg] = useState(null);
  const [listening, setListening] = useState(false);
  const histRef = useRef(null);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => { const el = histRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages.length, typingText, activeKey]);
  useEffect(() => { if (!mobile && taRef.current) taRef.current.focus(); }, [activeKey, mobile]);

  // Gõ bằng giọng nói (nếu trình xem hỗ trợ)
  useEffect(() => {
    if (!dictation) return undefined;
    const offs = [
      dictation.onFinal(({ text }) => { const cur = draftRef.current; setDraft(`${cur}${cur && !/\s$/.test(cur) ? ' ' : ''}${text}`); }),
      dictation.onState(({ state }) => setListening(state === 'listening' || state === 'starting')),
    ];
    return () => offs.forEach((off) => { try { off(); } catch (e) { /* bỏ qua */ } });
  }, [dictation, setDraft]);

  if (!head) return null;

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
    const ins = `${before && !/\s$/.test(before) ? ' ' : ''}${code} `;
    setDraft(draft.slice(0, s) + ins + draft.slice(e));
    setEmoOpen(false);
    requestAnimationFrame(() => { if (!ta) return; ta.focus(); const p = s + ins.length; try { ta.setSelectionRange(p, p); } catch (err) { /* bỏ qua */ } });
  };
  const toggleMic = () => {
    if (!dictation) return;
    if (listening) { dictation.stop().catch(() => {}); return; }
    dictation.start().catch(() => setListening(false));
  };

  const off = head.status === 'offline' || head.status === 'invisible';
  const lastIn = [...messages].reverse().find((m) => m.from === 'them');
  const imvStyle = (IMVIRONMENTS[imv] || IMVIRONMENTS.none).style;
  const fmtBtn = (on) => ({ width: mobile ? 32 : 24, height: mobile ? 32 : 22, borderRadius: 2, border: on ? '1px solid #8d6aa0' : '1px solid transparent', background: on ? 'linear-gradient(180deg,#e8d8f0,#f8f2fb)' : undefined });
  const selectStyle = { fontSize: mobile ? 14 : 11, border: '1px solid #a99bb3', borderRadius: 2, height: mobile ? 30 : 21, background: '#fff', color: '#222' };
  const gutter = mobile ? 12 : 8;

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ fontFamily: UI_FONT, background: '#ece9ef' }}>
      {!mobile && <MenuBar menus={menus} />}

      {(tabs.length > 1 || mobile) && (
        <div className="flex items-end gap-1 pt-1 overflow-x-auto shrink-0" style={{ paddingLeft: gutter, paddingRight: gutter, background: '#ddd5e3', borderBottom: '1px solid #b9a8c6' }}>
          {tabs.map((t) => {
            const on = t.key === activeKey;
            return (
              <div key={t.key} className={`flex items-center gap-1 pl-2 pr-1 shrink-0 cursor-pointer ${!on && t.unread ? 'ym-tab-flash' : ''}`} onClick={() => onSelectTab(t.key)}
                style={{ height: mobile ? 32 : 24, maxWidth: 170, borderRadius: '5px 5px 0 0', border: '1px solid #a996b7', borderBottom: on ? '1px solid #f7f4f9' : '1px solid #a996b7', marginBottom: -1, background: on ? '#f7f4f9' : 'linear-gradient(180deg,#efe8f3,#d9cde2)', fontSize: 11.5, fontWeight: on ? 700 : 400 }}>
                {t.isRoom ? <Home size={12} color={PURPLE} /> : <StatusIcon status={t.status} size={13} />}
                <span className="truncate">{t.title}</span>
                {t.unread > 0 && !on && <span style={{ color: '#ff5a00', fontWeight: 700 }}>({t.unread})</span>}
                <button type="button" title="Close tab" className="ml-1 rounded hover:bg-red-100 flex items-center justify-center" style={{ width: mobile ? 24 : 16, height: mobile ? 24 : 16 }} onClick={(e) => { e.stopPropagation(); onCloseTab(t.key); }}><X size={11} /></button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 py-2 shrink-0" style={{ paddingLeft: gutter, paddingRight: gutter, background: GRAD.lavender, borderBottom: '1px solid #dccbe6' }}>
        {mobile && onBack && (
          <button type="button" onClick={onBack} className="flex items-center justify-center rounded hover:bg-white" style={{ width: 34, height: 34 }} title="Back"><ArrowLeft size={20} color={PURPLE} /></button>
        )}
        <Avatar emoji={head.avatar} bg={head.bg} size={mobile ? 38 : 34} dim={off && !head.isRoom} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            {head.isRoom ? <Home size={14} color={PURPLE} /> : <StatusIcon status={head.status} size={14} />}
            <span className="truncate" style={{ fontWeight: 700, fontSize: 13 }}>{head.title}</span>
            {head.isBot && <span className="shrink-0 px-1 rounded-sm" style={{ fontSize: 9, color: '#6d3b85', background: '#efe2f6', border: '1px solid #d9c2e6' }}>AI</span>}
            {!head.isRoom && <span className="shrink-0" style={{ fontSize: 11, color: '#7d6a88' }}>({STATUS_LABEL[head.status]})</span>}
          </div>
          <div className="truncate" style={{ fontSize: 11, color: '#666' }}>{head.sub ? renderWithEmoticons(head.sub, 14) : ' '}</div>
        </div>
      </div>

      <div className="flex items-center gap-px py-1 overflow-x-auto shrink-0" style={{ paddingLeft: gutter - 4, paddingRight: gutter, background: GRAD.silverSoft, borderBottom: '1px solid #cfc6d4' }}>
        <input ref={fileRef} id="nm-file" type="file" accept="image/*" capture={mobile ? 'environment' : undefined} className="hidden" onChange={(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) onSendImage(f); }} />
        {canImage && <ToolButton compact={mobile} icon={Camera} label="Gửi ảnh" title="Chụp hoặc gửi ảnh" onClick={() => fileRef.current && fileRef.current.click()} />}
        <div className="relative shrink-0" data-pop-toggle>
          <ToolButton compact={mobile} icon={Music} label="Audibles" onClick={() => setPop(pop === 'aud' ? null : 'aud')} active={pop === 'aud'} />
          {pop === 'aud' && (
            <Popover onClose={() => setPop(null)} className="top-full mt-1" style={{ left: 0, minWidth: 210 }}>
              {AUDIBLES.map((a) => (
                <button key={a.id} type="button" className="w-full flex items-center gap-2 px-3 py-1 hover:bg-purple-100 text-left" style={{ fontSize: 12 }} onClick={() => { onAudible(a.id); setPop(null); }}>
                  <span style={{ fontSize: 18 }}>{a.emoji}</span><span className="flex-1">{a.label}</span>
                </button>
              ))}
            </Popover>
          )}
        </div>
        <div className="relative shrink-0" data-pop-toggle>
          <ToolButton compact={mobile} icon={ImageIcon} label="IMVironments" onClick={() => setPop(pop === 'imv' ? null : 'imv')} active={pop === 'imv'} />
          {pop === 'imv' && (
            <Popover onClose={() => setPop(null)} className="top-full mt-1" style={{ left: mobile ? -60 : 0, minWidth: 170 }}>
              {Object.entries(IMVIRONMENTS).map(([k, v]) => (
                <button key={k} type="button" className="w-full flex items-center gap-2 px-3 py-1 hover:bg-purple-100 text-left" style={{ fontSize: 12 }} onClick={() => { onSetImv(k); setPop(null); }}>
                  <span style={{ width: 18, height: 14, border: '1px solid #999', ...v.style }} /><span className="flex-1">{v.label}</span>{(imv || 'none') === k && '✓'}
                </button>
              ))}
            </Popover>
          )}
        </div>
        {head.isBot && <ToolButton compact={mobile} icon={Video} label="Webcam" onClick={() => onAction('webcam')} />}
        {head.isBot && <ToolButton compact={mobile} icon={Phone} label="Call" onClick={() => onAction('call')} />}
        {head.isBot && <ToolButton compact={mobile} icon={Users} label="Games" onClick={() => onAction('game')} />}
      </div>

      <div className="flex-1 flex min-h-0 gap-2 py-2" style={{ paddingLeft: gutter, paddingRight: gutter }}>
        <div className="flex-1 relative min-w-0 flex">
          <div ref={histRef} className="flex-1 overflow-y-auto px-2 py-1" style={{ border: '1px solid #9d8fab', borderRadius: 2, ...imvStyle }}>
            {messages.length === 0 && (
              <div className="py-2" style={{ fontSize: 11.5, color: '#999', fontStyle: 'italic' }}>
                {head.isRoom ? 'Phòng chat của cả nhà. Ai vào trang cũng thấy tin nhắn ở đây.' : `Bắt đầu trò chuyện với ${head.title}. Gõ :D hoặc bấm BUZZ! thử xem ;)`}
              </div>
            )}
            {messages.map((m) => <MessageLine key={m.id} m={m} showTime={showTime} onImage={setViewImg} />)}
          </div>
          {buzzFlash ? (
            <div key={buzzFlash} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="ym-buzz-pop" style={{ color: '#ff0000', fontWeight: 900, fontSize: mobile ? 46 : 56, fontFamily: '"Arial Black", Arial, sans-serif', textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0 4px 10px rgba(0,0,0,.35)' }}>BUZZ!!!</div>
            </div>
          ) : null}
        </div>
        {!mobile && (
          <div className="flex flex-col justify-between items-center shrink-0" style={{ width: 92 }}>
            <div className="flex flex-col items-center gap-1">
              <Avatar emoji={head.avatar} bg={head.bg} size={84} dim={off && !head.isRoom} />
              <span className="truncate w-full text-center" style={{ fontSize: 10, color: '#666' }}>{head.title}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Avatar emoji={myAvatar[0]} bg={[myAvatar[1], myAvatar[2]]} size={64} />
              <span className="truncate w-full text-center" style={{ fontSize: 10, color: '#666' }}>{myNick}</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative shrink-0" style={{ paddingLeft: gutter, paddingRight: gutter }}>
        {emoOpen && <EmoticonPicker mobile={mobile} onPick={insertCode} onClose={() => setEmoOpen(false)} />}
        {colorOpen && <ColorPicker value={myFont.color} onPick={(c) => { setMyFont({ ...myFont, color: c }); setColorOpen(false); }} onClose={() => setColorOpen(false)} />}
        <div className="flex items-center gap-1 py-1 overflow-x-auto" style={{ borderTop: '1px solid #d7cfdd' }}>
          <button type="button" title="Bold" style={fmtBtn(myFont.bold)} className="flex items-center justify-center shrink-0" onClick={() => setMyFont({ ...myFont, bold: !myFont.bold })}><Bold size={14} /></button>
          <button type="button" title="Italic" style={fmtBtn(myFont.italic)} className="flex items-center justify-center shrink-0" onClick={() => setMyFont({ ...myFont, italic: !myFont.italic })}><Italic size={14} /></button>
          <button type="button" title="Underline" style={fmtBtn(myFont.underline)} className="flex items-center justify-center shrink-0" onClick={() => setMyFont({ ...myFont, underline: !myFont.underline })}><Underline size={14} /></button>
          <button type="button" data-color-toggle title="Font color" style={fmtBtn(colorOpen)} className="flex flex-col items-center justify-center shrink-0" onClick={() => setColorOpen((v) => !v)}>
            <Palette size={13} /><span style={{ width: 16, height: 3, background: myFont.color, marginTop: 1 }} />
          </button>
          <select id="nm-font" title="Font" value={myFont.face} onChange={(e) => setMyFont({ ...myFont, face: e.target.value })} style={{ ...selectStyle, width: mobile ? 120 : 112 }} className="shrink-0">
            {FONT_FACES.map((f) => <option key={f} value={f} style={{ fontFamily: FONT_FALLBACK[f] }}>{f}</option>)}
          </select>
          <select id="nm-size" title="Size" value={myFont.size} onChange={(e) => setMyFont({ ...myFont, size: Number(e.target.value) })} style={{ ...selectStyle, width: mobile ? 56 : 46 }} className="shrink-0">
            {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="button" data-emo-toggle title="Emoticons" style={{ ...fmtBtn(emoOpen), order: mobile ? -2 : 0 }} className="flex items-center justify-center shrink-0" onClick={() => { setEmoOpen((v) => !v); setColorOpen(false); }}>
            <SmileyFace size={mobile ? 22 : 18} spec={{ mouth: 'bigGrin' }} />
          </button>
          <button type="button" title="BUZZ! — rung màn hình người nhận (Ctrl+G)" onClick={onBuzz} className="shrink-0 px-2 rounded-sm active:translate-y-px"
            style={{ order: mobile ? -1 : 0, marginRight: mobile ? 6 : 0, height: mobile ? 32 : 22, fontWeight: 900, fontSize: mobile ? 14 : 12, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: 0.5, background: 'linear-gradient(180deg,#ff8a7a,#e8170a 50%,#c00a00 51%,#e02a1c)', border: '1px solid #800000', textShadow: '0 1px 1px rgba(0,0,0,.4)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5)' }}>
            BUZZ!
          </button>
        </div>
      </div>

      <div className="flex gap-2 pb-2 shrink-0" style={{ paddingLeft: gutter, paddingRight: gutter }}>
        <textarea
          ref={taRef}
          id="nm-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !(e.nativeEvent && e.nativeEvent.isComposing)) { e.preventDefault(); send(); } }}
          enterKeyHint="send"
          rows={mobile ? 2 : 3}
          placeholder={listening ? 'Đang nghe... nói đi' : `Nhắn cho ${head.title}... (Enter để gửi)`}
          className="flex-1 min-w-0 resize-none px-2 py-1"
          style={{ ...fontCss(myFont), fontSize: mobile ? `max(16px, ${myFont.size}pt)` : `${myFont.size}pt`, border: listening ? '1px solid #d4442f' : '1px solid #9d8fab', borderRadius: 2, outline: 'none', background: '#fff' }}
        />
        <div className="flex flex-col gap-1 self-stretch">
          {dictation && (
            <XPButton onClick={toggleMic} title={listening ? 'Dừng nghe' : 'Nói để gõ chữ'} style={{ minWidth: mobile ? 64 : 70, background: listening ? 'linear-gradient(180deg,#ffd0c8,#ff8a7a)' : undefined }}>
              <Mic size={14} />{!mobile && <span>{listening ? 'Dừng' : 'Nói'}</span>}
            </XPButton>
          )}
          <XPButton onClick={send} className="flex-1" style={{ minWidth: mobile ? 64 : 70, fontWeight: 700 }} title="Send">
            {mobile ? <Send size={16} /> : null}<span>Send</span>
          </XPButton>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0" style={{ height: 22, paddingLeft: gutter, paddingRight: gutter, background: GRAD.silverSoft, borderTop: '1px solid #cfc6d4', fontSize: 11, color: '#555' }}>
        {typingText ? (
          <><Edit3 size={12} color={PURPLE} /><span className="truncate" style={{ color: PURPLE }}>{typingText}</span></>
        ) : lastIn ? (
          <><Clock size={11} /><span className="truncate">Last message received at {fmtTime(lastIn.time)}</span></>
        ) : (
          <span className="truncate">{off && !head.isRoom && !head.isBot ? `${head.title} đang offline — tin nhắn vẫn được lưu, lúc vào sẽ thấy.` : 'Shift+Enter để xuống dòng.'}</span>
        )}
      </div>

      {viewImg && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 400, background: 'rgba(10,0,20,.75)' }} onClick={() => setViewImg(null)}>
          <img src={viewImg} alt="Ảnh lớn" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,.6)' }} />
        </div>
      )}
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
@keyframes ym-aud { 0% { transform: scale(.3) translateY(40px); opacity: 0; } 20% { transform: scale(1.15) translateY(0); opacity: 1; } 35% { transform: scale(1) rotate(-6deg); } 50% { transform: rotate(6deg); } 65% { transform: rotate(-4deg); } 85% { opacity: 1; } 100% { transform: scale(1.05); opacity: 0; } }
.ym-aud { animation: ym-aud 2.6s ease-out both; }
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
      {toasts.map((t) => {
        const c = contactsById[t.cid];
        return (
          <div key={t.id} className={mobile ? 'ym-toast-down' : 'ym-toast-up'} style={{ border: '1px solid #4e0063', borderRadius: 6, overflow: 'hidden', boxShadow: '0 8px 22px rgba(0,0,0,.45)', background: '#fff', fontFamily: UI_FONT }}>
            <div className="flex items-center gap-2 px-2" style={{ height: 22, background: GRAD.title, color: '#fff', fontSize: 11, fontWeight: 700, textShadow: '0 1px 1px rgba(0,0,0,.4)' }}>
              <SmileyFace size={14} />
              <span className="flex-1">Nhà Mình Messenger</span>
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

function InviteHelpDialog({ onClose, isOwner }) {
  return (
    <Modal title="Mời người thân vào Nhà Mình" onClose={onClose} width={440}>
      <div className="flex flex-col gap-2" style={{ lineHeight: 1.55 }}>
        <div className="flex items-center gap-3"><UserPlus size={30} color={PURPLE} /><b>Mỗi người cần một tài khoản claude.ai và được mời vào trang này.</b></div>
        <ol className="list-decimal pl-5 flex flex-col gap-1">
          <li>{isOwner ? 'Bạn' : 'Chủ nhà (người tạo trang)'} bấm nút <b>Share</b> của artifact này.</li>
          <li>Thêm email từng người thân và chọn quyền <b>Editor</b>. Quyền thấp hơn (Viewer, Commenter) chỉ xem được, không gửi tin được.</li>
          <li><b>Đừng bật link công khai</b> (public link): khi bật, người ngoài tổ chức sẽ mất quyền gửi tin.</li>
          <li>Người thân mở đường link trong email, đăng nhập claude.ai, bấm <b>Cho phép</b> khi được hỏi, rồi bấm <b>Get a new ID</b> để tạo ID và mật khẩu riêng.</li>
        </ol>
        <div className="p-2 rounded" style={{ background: '#f6f0fa', border: '1px solid #dccbe6', fontSize: 11.5 }}>
          Tin nhắn riêng chỉ hiện trong khung chat của hai người, nhưng dữ liệu được lưu chung trong trang: người có quyền Editor về kỹ thuật vẫn đọc được. Đây là app cho gia đình tin tưởng nhau, đừng gửi mật khẩu hay thông tin nhạy cảm.
        </div>
        <XPButton primary onClick={onClose} className="self-end mt-1" style={{ minWidth: 80 }}>OK</XPButton>
      </div>
    </Modal>
  );
}

function AudibleHelpDialog({ onClose, onPreview }) {
  return (
    <Modal title="Audibles & biểu tượng ẩn" onClose={onClose} width={420}>
      <div className="flex flex-col gap-3">
        <div>
          <b>Audibles</b>: hoạt hình kèm âm thanh. Mở khung chat, bấm nút <b>Audibles</b> để gửi. Bấm thử bên dưới để nghe:
          <div className="grid grid-cols-3 gap-1 mt-2">
            {AUDIBLES.map((a) => (
              <button key={a.id} type="button" onClick={() => onPreview(a.id)} className="flex flex-col items-center p-1 rounded hover:bg-purple-100" style={{ border: '1px solid #e3d6ea' }}>
                <span style={{ fontSize: 24 }}>{a.emoji}</span><span style={{ fontSize: 11 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <b>Biểu tượng ẩn</b>: không có trong bảng chọn, gõ đúng mã mới hiện:
          <div className="flex flex-wrap gap-2 mt-2">
            {EMOTICONS.filter((e) => e.hidden).map((e) => (
              <span key={e.code} className="inline-flex items-center gap-1 px-1 rounded" style={{ background: '#f6f0fa', fontSize: 11 }}><Emoticon emo={e} size={18} /><code>{e.code}</code></span>
            ))}
          </div>
        </div>
        <XPButton primary onClick={onClose} className="self-end" style={{ minWidth: 80 }}>OK</XPButton>
      </div>
    </Modal>
  );
}

function AboutDialog({ onClose, solo }) {
  return (
    <Modal title="About Nhà Mình Messenger" onClose={onClose} width={400}>
      <div className="flex flex-col items-center gap-2 text-center">
        <YMLogo size={64} />
        <Wordmark size={20} />
        <div style={{ color: '#666' }}>Messenger riêng của gia đình · phong cách 2007</div>
        <div className="text-left mt-2" style={{ lineHeight: 1.6 }}>
          • Tin nhắn, ảnh và status được lưu trong trang, ai được mời mới vào được.<br />
          • Chấm vàng/đỏ/xám cho biết ai đang mở app ngay lúc này.<br />
          • Bạn ảo (AI) trả lời bằng Claude; nếu không dùng được AI thì trả lời theo kịch bản.<br />
          • Âm thanh tạo trực tiếp bằng Web Audio API.<br />
          • Bản tri ân phong cách messenger thập niên 2000, không liên kết với hãng nào.
          {solo ? <><br />• Đang ở chế độ một mình (chưa kết nối dữ liệu chung).</> : null}
        </div>
        <XPButton primary onClick={onClose} className="mt-3" style={{ minWidth: 80 }}>OK</XPButton>
      </div>
    </Modal>
  );
}

/* =============================== Ứng dụng chính =============================== */

const DEFAULT_FONT = { face: 'Tahoma', size: 10, color: '#000000', bold: false, italic: false, underline: false };
const ROOM_KEY = 'room:ca-nha';
const ROOM_CHAT = 'room~ca-nha';
const ROOM_HEAD = { title: 'Phòng chat Cả Nhà', avatar: '🏠', bg: ['#f3e3ff', '#b46bf0'], isRoom: true, status: 'online' };

function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}
const shortId = (u) => (u.length <= 60 ? u : `h${fnv(u)}${fnv(u.split('').reverse().join(''))}`);
const dmChatId = (a, b) => `dm~${[shortId(a), shortId(b)].sort().join('~')}`;

const PREFIX = 'nhaminh_';
const loadPref = (k, d) => { try { const v = window.localStorage.getItem(PREFIX + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const savePref = (k, v) => { try { window.localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch (e) { /* bỏ qua */ } };

async function compressImage(file) {
  if (file.type === 'image/gif' && file.size < 4 * 1024 * 1024) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const sc = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * sc));
    const h = Math.max(1, Math.round(img.naturalHeight * sc));
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    cv.getContext('2d').drawImage(img, 0, 0, w, h);
    const blob = await new Promise((res) => cv.toBlob(res, 'image/jpeg', 0.82));
    return blob || file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function buildBotPrompt(bot, meNick, transcript, event) {
  return [
    `Bạn đóng vai "${bot.id}", một người bạn chat trên một ứng dụng nhắn tin kiểu năm 2007 ở Việt Nam.`,
    `Tính cách: ${PERSONA_PROMPTS[bot.persona] || 'vui vẻ, thân thiện.'}`,
    'Phong cách: tiếng Việt kiểu teen 9x (ko, j, zậy, wá, hix, kaka...), câu ngắn, hài hước, thân thiện, trong sáng. Không nói tục, không nội dung người lớn, không nói chuyện chính trị.',
    'Dùng mã mặt cười kiểu cũ khi hợp: :D :)) =)) :(( ;) :x :-* B-) >:) :-/ :"> :P X( O:-) @};-',
    'Trả lời 1 đến 3 dòng ngắn, mỗi dòng là một tin nhắn riêng. Muốn BUZZ lại thì viết một dòng chỉ có [BUZZ]. Không giải thích, không nhắc mình là AI, không viết tên mình ở đầu dòng.',
    `Người đang chat với bạn có nick "${meNick}".`,
    transcript ? `Đoạn chat gần đây:\n${transcript}` : 'Đây là tin nhắn đầu tiên.',
    `Sự kiện mới: ${event}`,
    `Trả lời như ${bot.id}:`,
  ].join('\n');
}

function parseBotLines(text, botId) {
  const out = [];
  String(text || '').split(/\n+/).forEach((raw) => {
    let l = raw.trim().replace(/^["“”']+|["“”']+$/g, '');
    l = l.replace(new RegExp(`^${botId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*`, 'i'), '').trim();
    if (!l) return;
    if (/^\[?buzz!*\]?$/i.test(l)) out.push(BUZZ);
    else out.push(l.slice(0, 220));
  });
  return out.slice(0, 4);
}

export default function NhaMinhMessenger() {
  const mobile = useMediaQuery('(max-width: 767px), (pointer: coarse) and (max-height: 520px)');
  const [caps, setCaps] = useState({ ready: false });
  const [myId, setMyId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [members, setMembers] = useState({});
  const [peers, setPeers] = useState([]);
  const [buckets, setBuckets] = useState({});
  const [lastRead, setLastRead] = useState({});
  const [phase, setPhase] = useState('connecting');
  const [signedInAt, setSignedInAt] = useState(0);
  const [myStatus, setMyStatus] = useState('online');
  const [soloMe, setSoloMe] = useState(() => loadPref('solo_me', null));
  const [botConvos, setBotConvos] = useState(() => {
    const raw = loadPref('bots', {});
    const out = {};
    Object.entries(raw || {}).forEach(([k, list]) => {
      if (!BOT_BY_ID[k] || !Array.isArray(list)) return;
      out[k] = list.map((m) => (m.k === 'img' && String(m.u || '').startsWith('blob:') ? { ...m, k: 'msg', x: '[ảnh đã gửi]', u: null } : m));
    });
    return out;
  });
  const [botTyping, setBotTyping] = useState({});
  const [pendingImgs, setPendingImgs] = useState({});
  const [tabs, setTabs] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [myFont, setMyFontState] = useState(() => loadPref('font', DEFAULT_FONT));
  const [imvs, setImvs] = useState(() => loadPref('imv', {}));
  const [toasts, setToasts] = useState([]);
  const [soundOn, setSoundOnState] = useState(() => loadPref('sound', true));
  const [showTime, setShowTime] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [wins, setWins] = useState(initialWins);
  const [focusWin, setFocusWin] = useState('list');
  const [buzzFlash, setBuzzFlash] = useState(0);
  const [audFlash, setAudFlash] = useState(null);
  const [modal, setModal] = useState(null);
  const [tipIdx, setTipIdx] = useState(0);
  const [clock, setClock] = useState(() => Date.now());
  const [groupsOpen, setGroupsOpen] = useState({ room: true, family: true, bots: true });
  const [dbWarn, setDbWarn] = useState('');
  const [signedOutOnce, setSignedOutOnce] = useState(false);
  const [account, setAccount] = useState(null);
  const [accountLoaded, setAccountLoaded] = useState(false);
  const [kickedMsg, setKickedMsg] = useState('');
  const [autolock, setAutolockState] = useState(() => loadPref('autolock', 0));
  const accountRef = useRef(null);
  accountRef.current = account;
  const sessionId = useRef(uid());
  const lastActivity = useRef(Date.now());
  const autoAway = useRef(false);

  const appRef = useRef(null);
  const chatWinRef = useRef(null);
  const zTop = useRef(10);
  const timers = useRef(new Set());
  const writeChains = useRef({});
  const knownBuckets = useRef(new Set());
  const stateDocExists = useRef(false);
  const seenMsgs = useRef(new Set());
  const pendingRead = useRef({});
  const readTimer = useRef(null);
  const typingRef = useRef({ chat: null, timer: null });
  const prevOnline = useRef(null);
  const offlineSummaryDone = useRef(false);
  const botJobs = useRef({});
  const aiDenied = useRef(false);
  const lastBuzz = useRef({});
  const live = useRef({});

  const solo = caps.ready && (!caps.db || !myId);
  const inSession = phase === 'app' || phase === 'locked';
  const myMember = solo ? soloMe : members[myId] || null;
  const myNick = (myMember && myMember.nick) || 'tui';
  const myAvatarIdx = (myMember && myMember.avatar) || 0;
  const myAvatar = MY_AVATARS[myAvatarIdx] || MY_AVATARS[0];

  const setMyFont = (f) => { setMyFontState(f); savePref('font', f); };
  const setSoundOn = (fn) => setSoundOnState((v) => { const n = typeof fn === 'function' ? fn(v) : fn; savePref('sound', n); return n; });

  /* ---------- hẹn giờ ---------- */
  const later = (fn, ms) => {
    const t = setTimeout(() => { timers.current.delete(t); fn(); }, ms);
    timers.current.add(t);
    return t;
  };
  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);
  const play = (name, arg) => { if (live.current.soundOn && sfx[name]) sfx[name](arg); };

  /* ---------- kết nối khả năng của artifact ---------- */
  useEffect(() => {
    let alive = true;
    const c = typeof window !== 'undefined' ? window.claude : null;
    if (!c || typeof c.use !== 'function') { setCaps({ ready: true }); setPhase('login'); return undefined; }
    const names = ['db', 'user', 'room', 'sample', 'assets', 'dictation'];
    Promise.all(names.map((n) => Promise.resolve(c.use(n)).catch(() => null))).then(async (vals) => {
      if (!alive) return;
      const o = { ready: true };
      names.forEach((n, i) => { o[n] = vals[i] || null; });
      let id = null;
      let name = '';
      let owner = false;
      if (o.user) {
        try {
          id = await o.user.id();
          const me = await o.user.me();
          name = (me && me.name) || '';
          owner = !!(me && me.isOwner);
        } catch (e) { /* bỏ qua */ }
      }
      if (!alive) return;
      setMyId(id);
      setProfileName(name);
      setIsOwner(owner);
      setCaps(o);
      if (!o.db || !id) setPhase('login');
    });
    return () => { alive = false; };
  }, []);

  // Danh sách thành viên (nick, avatar, status)
  useEffect(() => {
    if (!caps.db || !myId) return undefined;
    const goLogin = () => setPhase((p) => (p === 'connecting' ? 'login' : p));
    const timer = setTimeout(() => { goLogin(); setDbWarn('Dữ liệu chung đang tải chậm, có thể chưa đầy đủ.'); }, 10000);
    let unsub = () => {};
    try {
      unsub = caps.db.collection('members').onSnapshot((snap) => {
        const m = {};
        snap.docs.forEach((d) => { if (d.exists) m[d.id] = d.data(); });
        setMembers(m);
        goLogin();
        if (!snap.metadata.fromCache) { clearTimeout(timer); setDbWarn(''); }
      }, (e) => { clearTimeout(timer); goLogin(); setDbWarn(`Không đọc được dữ liệu chung (${e.code}).`); });
    } catch (e) { clearTimeout(timer); goLogin(); setDbWarn('Không đọc được dữ liệu chung.'); }
    return () => { clearTimeout(timer); unsub(); };
  }, [caps.db, myId]);

  // Trạng thái riêng (đã đọc tới đâu)
  useEffect(() => {
    if (!caps.db || !myId) return undefined;
    let unsub = () => {};
    try {
      unsub = caps.db.doc(`data/users/${myId}/state`).onSnapshot((s) => {
        if (s.exists) {
          stateDocExists.current = true;
          const lr = (s.data() && s.data().lastRead) || {};
          setLastRead((prev) => {
            const n = { ...prev };
            Object.entries(lr).forEach(([k, v]) => { if (!n[k] || v > n[k]) n[k] = v; });
            return n;
          });
        }
      }, () => {});
    } catch (e) { /* bỏ qua */ }
    return () => unsub();
  }, [caps.db, myId]);

  // Tài khoản riêng (mật khẩu đã mã hóa, thiết bị ghi nhớ, lịch sử đăng nhập)
  useEffect(() => {
    if (!caps.ready) return undefined;
    if (solo) { setAccount(loadPref('solo_account', null)); setAccountLoaded(true); return undefined; }
    if (!caps.db || !myId) return undefined;
    let unsub = () => {};
    try {
      unsub = caps.db.doc(`data/users/${myId}/account`).onSnapshot((snap) => {
        setAccount(snap.exists ? snap.data() : null);
        setAccountLoaded(true);
      }, () => setAccountLoaded(true));
    } catch (e) { setAccountLoaded(true); }
    return () => unsub();
  }, [caps.ready, solo, caps.db, myId]);

  // Ai đang mở app (room presence)
  useEffect(() => {
    if (!caps.room) return undefined;
    const off = caps.room.onPeers((ch) => setPeers(ch.peers));
    return () => { try { off(); } catch (e) { /* bỏ qua */ } };
  }, [caps.room]);

  useEffect(() => {
    if (!caps.room) return;
    caps.room.presence({ status: phase === 'app' ? myStatus : phase === 'locked' ? 'away' : 'offline', typing: null, sid: sessionId.current, at: signedInAt }).catch(() => {});
  }, [caps.room, phase, myStatus, signedInAt]);

  const setTypingIn = (chat) => {
    const r = typingRef.current;
    clearTimeout(r.timer);
    if (chat) r.timer = setTimeout(() => setTypingIn(null), 3500);
    if (r.chat === chat || !caps.room) return;
    r.chat = chat;
    caps.room.presence({ typing: chat }).catch(() => {});
  };

  const onlineStatus = useMemo(() => {
    const rank = { online: 0, busy: 1, away: 2 };
    const out = {};
    peers.forEach((p) => {
      if (p.kind !== 'viewer' || !p.by || p.by === myId) return;
      const st = p.presence && p.presence.status;
      if (!(st in rank)) return;
      if (!out[p.by] || rank[st] < rank[out[p.by]]) out[p.by] = st;
    });
    return out;
  }, [peers, myId]);

  const typingBy = useMemo(() => {
    const out = {};
    peers.forEach((p) => {
      const ch = p.presence && p.presence.typing;
      if (!ch || !p.by || p.by === myId || p.kind !== 'viewer') return;
      (out[ch] = out[ch] || new Set()).add(p.by);
    });
    return out;
  }, [peers, myId]);

  /* ---------- hội thoại ---------- */
  const others = useMemo(
    () => Object.entries(members).filter(([id, m]) => id !== myId && m && m.nick).map(([id, m]) => ({ id, ...m })),
    [members, myId]
  );
  const chatIds = useMemo(() => (solo || !myId ? [] : [ROOM_CHAT, ...others.map((o) => dmChatId(myId, o.id))]), [solo, myId, others]);
  const chatKey = chatIds.join('|');

  useEffect(() => {
    if (!caps.db || !myId || !inSession || !chatKey) return undefined;
    const unsubs = chatKey.split('|').map((cid) => {
      try {
        return caps.db.collection(`chats/${cid}/b`).orderBy('day', 'desc').limit(40).onSnapshot((snap) => {
          const arr = [];
          snap.docs.forEach((d) => { if (d.exists) { arr.push({ id: d.id, ...d.data() }); knownBuckets.current.add(`chats/${cid}/b/${d.id}`); } });
          setBuckets((b) => ({ ...b, [cid]: arr }));
        }, (e) => setDbWarn(`Không tải được tin nhắn (${e.code}).`));
      } catch (e) { return () => {}; }
    });
    return () => unsubs.forEach((u) => u());
  }, [caps.db, myId, inSession, chatKey]);

  const chatMessages = useMemo(() => {
    const out = {};
    Object.entries(buckets).forEach(([cid, arr]) => {
      const list = [];
      arr.forEach((b) => Object.entries(b.msgs || {}).forEach(([mid, m]) => list.push({ mid, from: b.from, ...m })));
      (pendingImgs[cid] || []).forEach((m) => list.push(m));
      list.sort((a, b) => (a.t - b.t) || (a.mid < b.mid ? -1 : 1));
      out[cid] = list;
    });
    return out;
  }, [buckets, pendingImgs]);

  const chatOfKey = (key) => {
    if (!key) return null;
    if (key === ROOM_KEY) return ROOM_CHAT;
    if (key.startsWith('dm:') && myId) return dmChatId(myId, key.slice(3));
    return null;
  };
  const keyOfChat = (cid, fromId) => (cid === ROOM_CHAT ? ROOM_KEY : `dm:${fromId}`);

  const baseRead = (cid) => lastRead[cid] || (myMember && myMember.joinedAt) || 0;
  const unread = useMemo(() => {
    const u = {};
    Object.entries(chatMessages).forEach(([cid, list]) => {
      const base = lastRead[cid] || (myMember && myMember.joinedAt) || 0;
      u[cid] = list.filter((m) => m.from !== myId && m.t > base && !m.pending).length;
    });
    return u;
  }, [chatMessages, lastRead, myId, myMember]);
  const unreadOfKey = (key) => {
    if (key && key.startsWith('bot:')) return (botConvos[key.slice(4)] || []).filter((m) => m.unread).length;
    const cid = chatOfKey(key);
    return cid ? unread[cid] || 0 : 0;
  };

  live.current = { soundOn, phase, activeKey, wins, mobile, mobileView, tabs, signedInAt, members, myId, botConvos, myNick, myStatus, autolock, canLock: !!(account && account.pw) };

  const isVisible = (key) => {
    const L = live.current;
    if (L.activeKey !== key || L.phase !== 'app') return false;
    if (L.mobile) return L.mobileView === 'chat';
    return L.wins.chat.open && !L.wins.chat.min;
  };

  const addToast = (t0) => {
    const t = live.current.phase === 'locked' ? { kind: 'info', headline: 'Bạn có tin nhắn mới', body: 'Mở khóa Messenger để xem.' } : t0;
    const id = uid();
    setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
    later(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 6000);
  };

  const ensureTab = (key, activate) => {
    const L = live.current;
    if (!L.tabs.includes(key)) {
      setTabs((prev) => (prev.includes(key) ? prev : [...prev, key]));
      live.current = { ...live.current, tabs: [...L.tabs, key] };
    }
    if (activate || !L.activeKey) {
      setActiveKey(key);
      live.current = { ...live.current, activeKey: key };
    }
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

  const openChat = (key) => {
    sfx.unlock();
    ensureTab(key, true);
    if (live.current.mobile) setMobileView('chat');
    else {
      const z = ++zTop.current;
      setWins((w) => ({ ...w, chat: { ...w.chat, open: true, min: false, z } }));
      setFocusWin('chat');
    }
  };

  const closeTab = (key) => {
    const L = live.current;
    const rest = L.tabs.filter((t) => t !== key);
    setTabs(rest);
    if (L.activeKey === key) setActiveKey(rest[Math.min(L.tabs.indexOf(key), rest.length - 1)] || null);
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

  const showAudible = (id, from) => {
    const a = AUDIBLE_BY_ID[id];
    if (!a) return;
    play('audible', id);
    const k = Date.now();
    setAudFlash({ ...a, from, k });
    later(() => setAudFlash((cur) => (cur && cur.k === k ? null : cur)), 2700);
  };

  /* ---------- đánh dấu đã đọc ---------- */
  const enqueueWrite = (path, fn, onError) => {
    const prev = writeChains.current[path] || Promise.resolve();
    const next = prev.then(fn).catch((e) => { if (onError) onError(e); });
    writeChains.current[path] = next;
    return next;
  };

  const flushRead = () => {
    const batch = pendingRead.current;
    pendingRead.current = {};
    if (!caps.db || !myId || !Object.keys(batch).length) return;
    const path = `data/users/${myId}/state`;
    enqueueWrite(path, async () => {
      const ref = caps.db.doc(path);
      if (stateDocExists.current) await ref.update({ lastRead: batch });
      else { await ref.set({ lastRead: { ...live.current.lastReadAll, ...batch } }); stateDocExists.current = true; }
    });
  };
  live.current.lastReadAll = lastRead;

  const markRead = (cid, t) => {
    if (!t || (lastRead[cid] || 0) >= t) return;
    setLastRead((p) => ({ ...p, [cid]: t }));
    pendingRead.current[cid] = t;
    clearTimeout(readTimer.current);
    readTimer.current = setTimeout(flushRead, 1500);
  };

  // Đang xem hội thoại nào thì đánh dấu đã đọc
  useEffect(() => {
    if (phase !== 'app' || !activeKey) return;
    const visible = mobile ? mobileView === 'chat' : wins.chat.open && !wins.chat.min;
    if (!visible) return;
    if (activeKey.startsWith('bot:')) {
      const b = activeKey.slice(4);
      if ((botConvos[b] || []).some((m) => m.unread)) setBotConvos((p) => ({ ...p, [b]: p[b].map((m) => (m.unread ? { ...m, unread: false } : m)) }));
      return;
    }
    const cid = chatOfKey(activeKey);
    const list = (cid && chatMessages[cid]) || [];
    const last = list.length ? list[list.length - 1].t : 0;
    if (cid && last > baseRead(cid)) markRead(cid, last);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeKey, mobile, mobileView, wins.chat.open, wins.chat.min, chatMessages, botConvos]);

  /* ---------- tin nhắn mới đến ---------- */
  useEffect(() => {
    if (!inSession) return;
    const fresh = [];
    Object.entries(chatMessages).forEach(([cid, list]) => {
      list.forEach((m) => {
        if (seenMsgs.current.has(m.mid)) return;
        seenMsgs.current.add(m.mid);
        if (m.from !== myId && !m.pending && m.t > signedInAt - 2000) fresh.push({ cid, m });
      });
    });
    fresh.forEach(({ cid, m }) => {
      const key = keyOfChat(cid, m.from);
      const who = (members[m.from] && members[m.from].nick) || 'ai đó';
      const isRoom = cid === ROOM_CHAT;
      if (!isRoom) ensureTab(key, m.k === 'buzz' && !live.current.mobile);
      if (m.k === 'buzz') {
        if (!live.current.mobile && !isRoom) {
          const z = ++zTop.current;
          setWins((w) => ({ ...w, chat: { ...w.chat, open: true, min: false, z } }));
          setFocusWin('chat');
        }
        play('buzz');
        doShake();
      } else if (m.k === 'aud') {
        showAudible(m.au, who);
      } else {
        play('message');
      }
      if (!isVisible(key)) {
        const body = m.k === 'buzz' ? 'BUZZ!!!' : m.k === 'img' ? '[đã gửi một ảnh]' : m.k === 'aud' ? `[Audible: ${(AUDIBLE_BY_ID[m.au] || {}).label || ''}]` : m.x;
        addToast({ kind: 'msg', key, avatarOf: m.from, headline: isRoom ? `${who} (Phòng chat Cả Nhà):` : `${who} says:`, body });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages, inSession]);

  // Báo tin nhắn nhận được lúc vắng mặt
  useEffect(() => {
    if (phase !== 'app' || solo || offlineSummaryDone.current) return undefined;
    const t = setTimeout(() => {
      offlineSummaryDone.current = true;
      const total = Object.values(unread).reduce((a, b) => a + b, 0);
      if (total > 0) {
        play('message');
        addToast({ kind: 'info', headline: `Bạn có ${total} tin nhắn mới khi vắng mặt`, body: 'Xem các số màu cam trong danh sách.' });
      }
    }, 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, solo, unread]);

  // Người thân online → tiếng cửa mở + thông báo
  useEffect(() => {
    if (!inSession) { prevOnline.current = null; return; }
    const prev = prevOnline.current;
    prevOnline.current = onlineStatus;
    if (!prev || Date.now() - signedInAt < 4000) return;
    Object.keys(onlineStatus).forEach((id) => {
      if (!prev[id] && members[id]) {
        play('door');
        addToast({ kind: 'signin', key: `dm:${id}`, avatarOf: id, headline: `${members[id].nick} vừa online.`, body: members[id].statusMsg || '' });
      }
    });
    Object.keys(prev).forEach((id) => { if (!onlineStatus[id] && members[id]) play('doorClose'); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineStatus, inSession]);

  // Cùng ID đăng nhập ở nơi khác → phiên này bị đăng xuất (như ngày xưa)
  useEffect(() => {
    if (!inSession || !myId) return;
    const other = peers.find((p) => p.by === myId && !p.sameTab && p.kind === 'viewer' && p.presence && p.presence.sid
      && p.presence.sid !== sessionId.current && (p.presence.at || 0) > signedInAt && p.presence.status && p.presence.status !== 'offline');
    if (!other) return;
    const t = new Date(other.presence.at);
    forceSignOut(`Bạn vừa bị đăng xuất vì ID "${myNick}" đã đăng nhập ở nơi khác lúc ${pad2(t.getHours())}:${pad2(t.getMinutes())}. Nếu đó không phải bạn, hãy đổi mật khẩu ngay (Messenger → Account Info).`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peers, inSession, myId, signedInAt]);

  // Không thao tác: 10 phút tự chuyển "Be Right Back"; tự khóa nếu đã bật
  useEffect(() => {
    const mark = () => {
      lastActivity.current = Date.now();
      if (autoAway.current && live.current.phase === 'app') { autoAway.current = false; setMyStatus('online'); }
    };
    const evs = ['pointerdown', 'keydown', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    const iv = setInterval(() => {
      const L = live.current;
      if (L.phase !== 'app') return;
      const idle = Date.now() - lastActivity.current;
      if (L.autolock && L.canLock && idle > L.autolock * 60000) { lockApp(); return; }
      if (idle > 10 * 60000 && L.myStatus === 'online' && !autoAway.current) { autoAway.current = true; setMyStatus('away'); }
    }, 20000);
    return () => { evs.forEach((e) => window.removeEventListener(e, mark)); clearInterval(iv); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- gửi tin thật (lưu vào db) ---------- */
  const errToast = (e) => {
    const code = e && e.code;
    const body = code === 'quota_exceeded' ? 'Bộ nhớ chung của trang đã đầy.'
      : code === 'invalid_argument' ? 'Bạn chưa có quyền ghi dữ liệu. Nhờ chủ nhà mời bạn với quyền Editor.'
        : `Có lỗi (${code || 'không rõ'}). Thử lại sau nhé.`;
    addToast({ kind: 'info', headline: 'Chưa lưu được', body });
  };

  const sendReal = (cid, body) => {
    if (!caps.db || !myId) return null;
    const t = Date.now();
    const day = dayKey(t);
    const mid = uid();
    const path = `chats/${cid}/b/${shortId(myId)}~${day}`;
    const m = { t, ...body };
    seenMsgs.current.add(mid);
    enqueueWrite(path, async () => {
      const ref = caps.db.doc(path);
      const patch = { msgs: { [mid]: m } };
      if (knownBuckets.current.has(path)) { await ref.update(patch); return; }
      try {
        await ref.update(patch);
      } catch (e) {
        if (e && e.code === 'invalid_argument') await ref.set({ chat: cid, from: myId, day, msgs: { [mid]: m } });
        else throw e;
      }
      knownBuckets.current.add(path);
    }, errToast);
    return mid;
  };

  /* ---------- bạn ảo (AI) ---------- */
  useEffect(() => {
    const t = setTimeout(() => savePref('bots', botConvos), 800);
    return () => clearTimeout(t);
  }, [botConvos]);

  const pushBot = (botId, msg) => {
    setBotConvos((prev) => ({ ...prev, [botId]: [...(prev[botId] || []), { mid: uid(), t: Date.now(), ...msg }].slice(-150) }));
  };

  const scriptedReply = (bot, trigger) => {
    const P = PERSONAS[bot.persona] || PERSONAS.generic;
    const cat = trigger.type === 'buzz' ? 'buzz' : trigger.type === 'action' ? trigger.action : classify(trigger.text);
    const lines = [...lineList(pick(P[cat] || P.generic))];
    return P.teen ? lines.map((l) => (typeof l === 'string' && Math.random() < P.teen ? teenCase(l) : l)) : lines;
  };

  const deliverBot = (botId, text) => {
    const bot = BOT_BY_ID[botId];
    const key = `bot:${botId}`;
    ensureTab(key, false);
    const vis = isVisible(key);
    pushBot(botId, { from: 'bot', k: 'msg', x: text, f: bot.font, unread: !vis });
    play('message');
    if (!vis) addToast({ kind: 'msg', key, bot: botId, headline: `${botId} says:`, body: text });
  };

  const receiveBotBuzz = (botId) => {
    const key = `bot:${botId}`;
    ensureTab(key, !live.current.mobile);
    if (!live.current.mobile) {
      const z = ++zTop.current;
      setWins((w) => ({ ...w, chat: { ...w.chat, open: true, min: false, z } }));
      setFocusWin('chat');
    }
    pushBot(botId, { from: 'bot', k: 'buzz', unread: !isVisible(key) });
    play('buzz');
    doShake();
    if (!isVisible(key)) addToast({ kind: 'msg', key, bot: botId, headline: `${botId}: BUZZ!!!`, body: '' });
  };

  const botRespond = (botId, trigger) => {
    const bot = BOT_BY_ID[botId];
    if (!bot) return;
    const old = botJobs.current[botId];
    if (old) { old.cancelled = true; if (old.ctrl) old.ctrl.abort(); old.timers.forEach((t) => clearTimeout(t)); }
    const job = { cancelled: false, timers: [], ctrl: null };
    botJobs.current[botId] = job;
    const T = (fn, ms) => job.timers.push(setTimeout(() => { if (!job.cancelled) fn(); }, ms));
    const nick = live.current.myNick;
    T(() => setBotTyping((p) => ({ ...p, [botId]: true })), bot.status === 'busy' ? 1300 : 500);
    const events = {
      webcam: `${nick} mời bạn xem webcam`, call: `${nick} gọi điện cho bạn`, game: `${nick} mời bạn chơi cờ caro`,
      imv: `${nick} vừa đổi hình nền khung chat`, img: `${nick} vừa gửi cho bạn một tấm ảnh`,
      audible: `${nick} vừa gửi hoạt hình kèm tiếng "${trigger.label || ''}"`,
    };
    const event = trigger.type === 'buzz' ? `${nick} vừa BUZZ (rung màn hình) bạn` : trigger.type === 'action' ? events[trigger.action] || 'có chuyện mới' : `${nick} nhắn: "${trigger.text}"`;
    (async () => {
      let lines = null;
      if (caps.sample && !aiDenied.current) {
        const hist = (live.current.botConvos[botId] || []).slice(-12)
          .filter((m) => m.from !== 'system')
          .map((m) => `${m.from === 'me' ? nick : botId}: ${m.k === 'buzz' ? '[BUZZ]' : m.k === 'aud' ? '[hoạt hình]' : m.k === 'img' ? '[ảnh]' : m.x}`)
          .join('\n');
        job.ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
        try {
          const res = await caps.sample(buildBotPrompt(bot, nick, hist, event), { modelTier: 'quick', cache: false, signal: job.ctrl ? job.ctrl.signal : undefined });
          lines = parseBotLines(res && res.text, botId);
        } catch (e) {
          if (e && e.code === 'not_granted') aiDenied.current = true;
        }
      }
      if (job.cancelled) return;
      if (!lines || !lines.length) lines = scriptedReply(bot, trigger);
      let t = 250;
      lines.forEach((line) => {
        if (line && line.buzz) {
          T(() => { setBotTyping((p) => ({ ...p, [botId]: false })); receiveBotBuzz(botId); }, t);
          t += 1400;
          return;
        }
        const text = String(line).replace(/\{me\}/g, nick);
        T(() => setBotTyping((p) => ({ ...p, [botId]: true })), t);
        t += Math.min(2600, 300 + text.length * 35);
        T(() => { setBotTyping((p) => ({ ...p, [botId]: false })); deliverBot(botId, text); }, t);
        t += 350;
      });
      if (!lines.length) T(() => setBotTyping((p) => ({ ...p, [botId]: false })), t);
    })();
  };

  /* ---------- hành động của tôi ---------- */
  const botOf = (key) => (key && key.startsWith('bot:') ? key.slice(4) : null);

  const sendText = (text) => {
    const key = live.current.activeKey;
    if (!key) return;
    setTypingIn(null);
    play('send');
    const b = botOf(key);
    if (b) { pushBot(b, { from: 'me', k: 'msg', x: text, f: myFont }); botRespond(b, { type: 'msg', text }); return; }
    const cid = chatOfKey(key);
    if (cid) sendReal(cid, { k: 'msg', x: text, f: myFont });
  };

  const sendBuzz = () => {
    const key = live.current.activeKey;
    if (!key) return;
    const now = Date.now();
    if (now - (lastBuzz.current[key] || 0) < 2500) return;
    lastBuzz.current[key] = now;
    sfx.unlock();
    play('buzz');
    doShake();
    const b = botOf(key);
    if (b) { pushBot(b, { from: 'me', k: 'buzz' }); botRespond(b, { type: 'buzz' }); return; }
    const cid = chatOfKey(key);
    if (cid) sendReal(cid, { k: 'buzz' });
  };

  const sendAudible = (id) => {
    const key = live.current.activeKey;
    if (!key) return;
    showAudible(id, myNick);
    const b = botOf(key);
    if (b) { pushBot(b, { from: 'me', k: 'aud', au: id }); botRespond(b, { type: 'action', action: 'audible', label: (AUDIBLE_BY_ID[id] || {}).label }); return; }
    const cid = chatOfKey(key);
    if (cid) sendReal(cid, { k: 'aud', au: id });
  };

  const sendImage = async (file) => {
    const key = live.current.activeKey;
    if (!key) return;
    if (!file.type || !file.type.startsWith('image/')) { addToast({ kind: 'info', headline: 'Chỉ gửi được ảnh', body: 'Hãy chọn một tấm ảnh (jpg, png, gif...).' }); return; }
    const b = botOf(key);
    if (b) {
      pushBot(b, { from: 'me', k: 'img', u: URL.createObjectURL(file) });
      botRespond(b, { type: 'action', action: 'img' });
      return;
    }
    if (!caps.assets) { addToast({ kind: 'info', headline: 'Chưa gửi được ảnh', body: 'Cần quyền Editor để tải ảnh lên. Nhờ chủ nhà cấp quyền.' }); return; }
    const cid = chatOfKey(key);
    if (!cid) return;
    const tmp = { mid: `tmp${uid()}`, from: myId, t: Date.now(), k: 'img', pending: true };
    setPendingImgs((p) => ({ ...p, [cid]: [...(p[cid] || []), tmp] }));
    try {
      const blob = await compressImage(file);
      const res = await caps.assets.upload(blob);
      sendReal(cid, { k: 'img', a: res.id, u: res.url });
    } catch (e) {
      addToast({ kind: 'info', headline: 'Chưa gửi được ảnh', body: `Tải ảnh lên bị lỗi (${(e && e.code) || 'không rõ'}).` });
    } finally {
      setPendingImgs((p) => ({ ...p, [cid]: (p[cid] || []).filter((m) => m.mid !== tmp.mid) }));
    }
  };

  const doAction = (action) => {
    const b = botOf(live.current.activeKey);
    if (!b) return;
    pushBot(b, { from: 'system', x: ACTION_LINES[action](b) });
    botRespond(b, { type: 'action', action });
  };

  const setImv = (k) => {
    const key = live.current.activeKey;
    if (!key) return;
    setImvs((p) => { const n = { ...p, [key]: k }; savePref('imv', n); return n; });
    const b = botOf(key);
    if (b && k !== 'none') botRespond(b, { type: 'action', action: 'imv' });
  };

  const updateMe = (patch) => {
    if (solo) {
      setSoloMe((cur) => { const n = { ...(cur || {}), ...patch }; savePref('solo_me', n); return n; });
      return;
    }
    if (!caps.db || !myId || !members[myId]) return;
    setMembers((p) => ({ ...p, [myId]: { ...p[myId], ...patch } }));
    enqueueWrite(`members/${myId}`, () => caps.db.doc(`members/${myId}`).update(patch), errToast);
  };

  const setStatusMsg = (msg) => {
    const cur = myMember || {};
    if ((cur.statusMsg || '') === msg) return;
    const hist = msg ? [msg, ...(cur.statusHistory || []).filter((h) => h !== msg)].slice(0, 8) : cur.statusHistory || [];
    updateMe({ statusMsg: msg, statusHistory: hist });
  };
  const cycleAvatar = () => updateMe({ avatar: (myAvatarIdx + 1) % MY_AVATARS.length });

  /* ---------- tài khoản: đăng ký / đăng nhập / bảo mật ---------- */
  const acctPath = myId ? `data/users/${myId}/account` : null;
  const runWrite = (path, fn) => {
    const prev = writeChains.current[path] || Promise.resolve();
    const p = prev.catch(() => {}).then(fn);
    writeChains.current[path] = p.catch(() => {});
    return p;
  };
  const writeAccount = (data, replace) => {
    if (solo) {
      const n = replace ? data : { ...(accountRef.current || {}), ...data };
      savePref('solo_account', n);
      accountRef.current = n;
      setAccount(n);
      return Promise.resolve();
    }
    return runWrite(acctPath, async () => {
      const ref = caps.db.doc(acctPath);
      if (replace || !accountRef.current) await ref.set(data);
      else await ref.update(data);
    });
  };
  const errMsg = (e) => (e && e.code === 'invalid_argument'
    ? 'Bạn chưa có quyền ghi dữ liệu trong trang này. Nhờ chủ nhà mời bạn bằng email với quyền Editor.'
    : `Chưa lưu được (${(e && e.code) || 'lỗi'}). Thử lại nhé.`);
  const deviceKeyOf = async (token) => `d${fnv(await sha256b64(token))}`;
  const storedDevice = () => { const d = loadPref('device', null); return d && d.uid === (myId || 'solo') && d.token ? d : null; };
  const [currentDeviceKey, setCurrentDeviceKey] = useState(null);
  useEffect(() => {
    const d = storedDevice();
    if (d && hasCrypto()) deviceKeyOf(d.token).then(setCurrentDeviceKey).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const touchMember = () => {
    if (!solo && caps.db && myId && live.current.members[myId]) enqueueWrite(`members/${myId}`, () => caps.db.doc(`members/${myId}`).update({ lastSeen: Date.now() }));
  };

  const enterApp = (invisible, prevLogin) => {
    lastActivity.current = Date.now();
    autoAway.current = false;
    if (live.current.phase === 'locked') { setPhase('app'); return; }
    sessionId.current = uid();
    setMyStatus(invisible ? 'invisible' : 'online');
    setSignedInAt(Date.now());
    offlineSummaryDone.current = false;
    setKickedMsg('');
    setTabs([]);
    setActiveKey(null);
    setMobileView('list');
    setWins(initialWins());
    setFocusWin('list');
    setPhase('app');
    if (prevLogin) later(() => addToast({ kind: 'info', headline: 'Lần đăng nhập trước của bạn', body: `${fmtDateTime(prevLogin.t)} · ${prevLogin.d}` }), 1500);
  };

  const failAttempt = async (acc, what) => {
    const fails = (acc.fails || 0) + 1;
    try { await writeAccount(fails >= 5 ? { fails: 0, lockUntil: Date.now() + 5 * 60000 } : { fails }); } catch (e) { /* bỏ qua */ }
    return fails >= 5 ? `${what} sai 5 lần liên tiếp. ID bị khóa đăng nhập 5 phút.` : `${what} chưa đúng. Còn ${5 - fails} lần thử trước khi bị khóa tạm.`;
  };
  const lockedMsg = (acc) => (acc.lockUntil && acc.lockUntil > Date.now()
    ? `Thử sai quá nhiều lần. Thử lại sau ${Math.ceil((acc.lockUntil - Date.now()) / 60000)} phút.` : '');

  const doSignIn = async ({ id, password, useToken, remember, auto, invisible }) => {
    const me = myMember;
    if (!me) return 'Tài khoản Claude này chưa có ID. Bấm "Get a new ID" để đăng ký.';
    if (id !== me.nick) {
      return takenNicks.has(id)
        ? 'ID này thuộc người khác. Mỗi người chỉ đăng nhập được ID của chính mình (gắn với tài khoản Claude đang dùng).'
        : 'ID không tồn tại. Kiểm tra lại chính tả nhé.';
    }
    const acc = accountRef.current;
    if (!acc || !acc.pw) return 'ID này chưa đặt mật khẩu.';
    const lm = lockedMsg(acc);
    if (lm) return lm;
    let ok = false;
    const dev = storedDevice();
    if (useToken) {
      if (dev) {
        const k = await deviceKeyOf(dev.token);
        const rec = acc.devices && acc.devices[k];
        ok = !!rec && rec.hash === (await sha256b64(dev.token));
      }
      if (!ok) { savePref('device', null); setCurrentDeviceKey(null); return 'Máy này không còn được ghi nhớ. Nhập mật khẩu nhé.'; }
    } else {
      ok = await checkVerifier(password, acc.pw);
    }
    if (!ok) return failAttempt(acc, 'Mật khẩu');
    if (live.current.phase === 'locked') {
      if (acc.fails) writeAccount({ fails: 0 }).catch(() => {});
      enterApp(false);
      return null;
    }
    const now = Date.now();
    const device = describeDevice();
    const prevLogin = (acc.logins || [])[0] || null;
    const devices = { ...(acc.devices || {}) };
    if (remember && !useToken) {
      if (dev) delete devices[await deviceKeyOf(dev.token)];
      const token = randB64(24);
      const k = await deviceKeyOf(token);
      devices[k] = { hash: await sha256b64(token), d: device, t: now };
      savePref('device', { uid: myId || 'solo', token });
      setCurrentDeviceKey(k);
    } else if (!remember && dev) {
      delete devices[await deviceKeyOf(dev.token)];
      savePref('device', null);
      setCurrentDeviceKey(null);
    }
    const next = { ...acc, fails: 0, lockUntil: 0, devices, logins: [{ t: now, d: device }, ...(acc.logins || [])].slice(0, 10) };
    try { await writeAccount(next, true); } catch (e) { return errMsg(e); }
    savePref(`remember_${myId || 'solo'}`, !!remember);
    savePref(`auto_${myId || 'solo'}`, !!(remember && auto));
    savePref(`last_id_${myId || 'solo'}`, remember ? id : '');
    touchMember();
    enterApp(invisible, prevLogin);
    return null;
  };

  const newAccountDoc = async (password, question, answer, createdAt) => {
    const now = Date.now();
    return {
      pw: await makeVerifier(password),
      sq: { q: question, ...(await makeVerifier(normAnswer(answer))) },
      fails: 0, lockUntil: 0, devices: {}, logins: [{ t: now, d: describeDevice() }], createdAt: createdAt || now, pwChangedAt: now,
    };
  };

  const doRegister = async ({ id, password, displayName, question, answer, avatarIdx, invisible }) => {
    if (myMember && accountRef.current && accountRef.current.pw) return `Tài khoản Claude này đã có ID "${myMember.nick}". Mỗi người chỉ có một ID.`;
    if (takenNicks.has(id)) return `ID "${id}" đã có người dùng.`;
    const now = Date.now();
    try {
      await writeAccount(await newAccountDoc(password, question, answer, now), true);
      const prof = { nick: id, displayName: displayName || '', avatar: avatarIdx, statusMsg: '', statusHistory: [], joinedAt: now, lastSeen: now };
      if (solo) { setSoloMe(prof); savePref('solo_me', prof); } else await caps.db.doc(`members/${myId}`).set(prof);
    } catch (e) { return errMsg(e); }
    savePref(`last_id_${myId || 'solo'}`, id);
    enterApp(invisible, null);
    return null;
  };

  const doSetPassword = async ({ password, question, answer }) => {
    try { await writeAccount(await newAccountDoc(password, question, answer, myMember && myMember.joinedAt), true); } catch (e) { return errMsg(e); }
    touchMember();
    enterApp(false, null);
    return null;
  };

  const doRecover = async ({ answer, password }) => {
    const acc = accountRef.current;
    if (!acc || !acc.sq) return 'ID này chưa có câu hỏi bảo mật.';
    const lm = lockedMsg(acc);
    if (lm) return lm;
    if (!(await checkVerifier(normAnswer(answer), acc.sq))) return failAttempt(acc, 'Câu trả lời bảo mật');
    const now = Date.now();
    const next = { ...acc, pw: await makeVerifier(password), fails: 0, lockUntil: 0, devices: {}, pwChangedAt: now, logins: [{ t: now, d: `${describeDevice()} (đặt lại mật khẩu)` }, ...(acc.logins || [])].slice(0, 10) };
    try { await writeAccount(next, true); } catch (e) { return errMsg(e); }
    savePref('device', null);
    setCurrentDeviceKey(null);
    touchMember();
    enterApp(false, null);
    return null;
  };

  const changePassword = async (cur, nw) => {
    const acc = accountRef.current;
    if (!acc || !(await checkVerifier(cur, acc.pw))) return 'Mật khẩu hiện tại chưa đúng.';
    const keep = {};
    if (currentDeviceKey && acc.devices && acc.devices[currentDeviceKey]) keep[currentDeviceKey] = acc.devices[currentDeviceKey];
    try { await writeAccount({ ...acc, pw: await makeVerifier(nw), devices: keep, pwChangedAt: Date.now() }, true); } catch (e) { return errMsg(e); }
    return null;
  };
  const changeQuestion = async (cur, q, a) => {
    const acc = accountRef.current;
    if (!acc || !(await checkVerifier(cur, acc.pw))) return 'Mật khẩu hiện tại chưa đúng.';
    try { await writeAccount({ ...acc, sq: { q, ...(await makeVerifier(normAnswer(a))) } }, true); } catch (e) { return errMsg(e); }
    return null;
  };
  const forgetDevice = async (k) => {
    const acc = accountRef.current;
    const devices = { ...((acc && acc.devices) || {}) };
    delete devices[k];
    try { await writeAccount({ ...acc, devices }, true); } catch (e) { return errMsg(e); }
    if (k === currentDeviceKey) { savePref('device', null); setCurrentDeviceKey(null); }
    return null;
  };
  const forgetOthers = async () => {
    const acc = accountRef.current;
    const keep = {};
    if (currentDeviceKey && acc.devices && acc.devices[currentDeviceKey]) keep[currentDeviceKey] = acc.devices[currentDeviceKey];
    try { await writeAccount({ ...acc, devices: keep }, true); } catch (e) { return errMsg(e); }
    return null;
  };
  const setAutolock = (m) => { setAutolockState(m); savePref('autolock', m); };
  const lockApp = () => { setTypingIn(null); setModal(null); setPhase('locked'); };

  const signOut = (msg) => {
    setTypingIn(null);
    clearTimeout(readTimer.current);
    flushRead();
    touchMember();
    setSignedOutOnce(true);
    setToasts([]);
    setModal(null);
    setTabs([]);
    setActiveKey(null);
    setKickedMsg(typeof msg === 'string' ? msg : '');
    setPhase('login');
  };
  const forceSignOut = (msg) => { play('doorClose'); signOut(msg); };

  // Ghi "online lần cuối" khi rời trang
  useEffect(() => {
    if (phase !== 'app' || solo || !caps.db || !myId) return undefined;
    let last = 0;
    const onVis = () => {
      if (document.visibilityState !== 'hidden') return;
      clearTimeout(readTimer.current);
      flushRead();
      if (Date.now() - last < 60000 || !live.current.members[myId]) return;
      last = Date.now();
      enqueueWrite(`members/${myId}`, () => caps.db.doc(`members/${myId}`).update({ lastSeen: Date.now() }));
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, solo, caps.db, myId]);

  useEffect(() => {
    const a = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 9000);
    const b = setInterval(() => setClock(Date.now()), 15000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

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

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G') && live.current.activeKey && live.current.phase === 'app') { e.preventDefault(); sendBuzz(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });


  /* ---------- dữ liệu cho giao diện ---------- */
  const meOnline = phase === 'app' && myStatus !== 'invisible' ? 1 : 0;
  const headOf = (key) => {
    if (!key) return null;
    if (key === ROOM_KEY) return { ...ROOM_HEAD, sub: `${Object.keys(onlineStatus).length + meOnline} người đang online · ${others.length + 1} thành viên` };
    const b = botOf(key);
    if (b) { const bot = BOT_BY_ID[b]; return bot ? { title: bot.id, avatar: bot.avatar, bg: bot.bg, status: bot.status, sub: bot.statusMsg, isBot: true } : null; }
    if (key.startsWith('dm:')) {
      const id = key.slice(3);
      const m = members[id];
      if (!m) return null;
      const av = MY_AVATARS[m.avatar || 0] || MY_AVATARS[0];
      const st = onlineStatus[id] || 'offline';
      return { title: m.nick, avatar: av[0], bg: [av[1], av[2]], status: st, sub: m.statusMsg || (st === 'offline' ? fmtLastSeen(m.lastSeen) : '') };
    }
    return null;
  };

  const typingTextOf = (key) => {
    const b = botOf(key);
    if (b) return botTyping[b] ? `${b} is typing a message...` : '';
    const cid = chatOfKey(key);
    const set = cid && typingBy[cid];
    if (!set || !set.size) return '';
    const names = [...set].map((id) => (members[id] && members[id].nick) || 'ai đó');
    return key === ROOM_KEY ? `${names.join(', ')} đang soạn tin...` : `${names[0]} is typing a message...`;
  };

  const entries = [];
  if (!solo) {
    const rt = typingTextOf(ROOM_KEY);
    entries.push({ group: 'room', key: ROOM_KEY, name: ROOM_HEAD.title, sub: headOf(ROOM_KEY).sub, avatar: ROOM_HEAD.avatar, bg: ROOM_HEAD.bg, status: 'online', unread: unreadOfKey(ROOM_KEY), typing: rt });
    [...others]
      .sort((a, b) => STATUS_RANK[onlineStatus[a.id] || 'offline'] - STATUS_RANK[onlineStatus[b.id] || 'offline'] || a.nick.localeCompare(b.nick))
      .forEach((o) => {
        const st = onlineStatus[o.id] || 'offline';
        const av = MY_AVATARS[o.avatar || 0] || MY_AVATARS[0];
        entries.push({
          group: 'family', key: `dm:${o.id}`, name: o.nick, status: st, avatar: av[0], bg: [av[1], av[2]],
          sub: o.statusMsg || (st === 'offline' ? fmtLastSeen(o.lastSeen) : STATUS_LABEL[st]),
          unread: unreadOfKey(`dm:${o.id}`), typing: myId && typingBy[dmChatId(myId, o.id)] ? 'đang soạn tin...' : '',
          tooltip: `${o.nick} — ${STATUS_LABEL[st]} · ${fmtLastSeen(o.lastSeen)}`,
        });
      });
  }
  BOTS.forEach((b) => entries.push({ group: 'bots', key: `bot:${b.id}`, name: b.id, sub: b.statusMsg, status: b.status, avatar: b.avatar, bg: b.bg, unread: unreadOfKey(`bot:${b.id}`), typing: botTyping[b.id] ? 'đang soạn tin...' : '' }));
  const avatarByKey = Object.fromEntries(entries.map((e) => [e.key, { avatar: e.avatar, bg: e.bg }]));
  const totalUnread = entries.reduce((a, e) => a + (e.unread || 0), 0);
  const takenNicks = new Set(others.map((o) => o.nick));

  const activeMessages = useMemo(() => {
    if (!activeKey) return [];
    const b = activeKey.startsWith('bot:') ? activeKey.slice(4) : null;
    if (b) {
      return (botConvos[b] || []).map((m) => ({
        id: m.mid, from: m.from === 'me' ? 'me' : m.from === 'system' ? 'system' : 'them', name: m.from === 'me' ? myNick : b,
        kind: m.k || 'msg', text: m.x, font: m.f, img: m.u || null, au: m.au, time: m.t,
      }));
    }
    const cid = chatOfKey(activeKey);
    return ((cid && chatMessages[cid]) || []).map((m) => ({
      id: m.mid, from: m.from === myId ? 'me' : 'them', name: m.from === myId ? myNick : (members[m.from] && members[m.from].nick) || 'ai đó',
      kind: m.k || 'msg', text: m.x, font: m.f, img: m.u || (m.a ? `/_blob/${m.a}` : null), au: m.au, time: m.t, pending: m.pending,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, botConvos, chatMessages, members, myId, myNick]);

  const activeHead = headOf(activeKey);
  const tabViews = tabs.map((k) => { const h = headOf(k); return h && { key: k, title: h.title, status: h.status, isRoom: !!h.isRoom, unread: unreadOfKey(k) }; }).filter(Boolean);

  /* ---------- menu ---------- */
  const listMenus = [
    {
      label: 'Messenger',
      items: [
        ...STATUS_OPTIONS.map((s) => ({ label: s.label, checked: myStatus === s.id, onClick: () => setMyStatus(s.id) })),
        { separator: true },
        { label: 'Account Info (bảo mật)...', onClick: () => setModal('account') },
        { label: 'Khóa Messenger ngay', disabled: !(account && account.pw), onClick: lockApp },
        { label: 'Change My Display Image', onClick: cycleAvatar },
        { label: 'Sound Effects', checked: soundOn, onClick: () => setSoundOn((v) => !v) },
        { separator: true },
        { label: 'Sign Out', onClick: signOut },
      ],
    },
    {
      label: 'Contacts',
      items: [
        { label: 'Mời người thân vào...', onClick: () => setModal('invite') },
        { separator: true },
        { label: 'Expand All Groups', onClick: () => setGroupsOpen({ room: true, family: true, bots: true }) },
        { label: 'Collapse All Groups', onClick: () => setGroupsOpen({ room: false, family: false, bots: false }) },
      ],
    },
    {
      label: 'Actions',
      items: [
        { label: 'Vào Phòng chat Cả Nhà', disabled: solo, onClick: () => openChat(ROOM_KEY) },
        { label: 'Chat với bạn ảo ngẫu nhiên', onClick: () => openChat(`bot:${pick(BOTS).id}`) },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'Mời người thân vào', onClick: () => setModal('invite') },
        { label: 'Audibles & biểu tượng ẩn', onClick: () => setModal('audible') },
        { label: 'About Nhà Mình Messenger', onClick: () => setModal('about') },
      ],
    },
  ];
  const chatMenus = [
    {
      label: 'Conversation',
      items: [
        { label: 'Close Tab', onClick: () => activeKey && closeTab(activeKey) },
        { label: 'Close All Tabs', onClick: () => { setTabs([]); setActiveKey(null); setWins((w) => ({ ...w, chat: { ...w.chat, open: false, max: false } })); } },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Show Timestamps', checked: showTime, onClick: () => setShowTime((v) => !v) },
        { separator: true },
        ...Object.entries(IMVIRONMENTS).map(([k, v]) => ({ label: `IMVironment: ${v.label}`, checked: (imvs[activeKey] || 'none') === k, onClick: () => setImv(k) })),
      ],
    },
    {
      label: 'Actions',
      items: [
        { label: 'BUZZ!', hint: 'Ctrl+G', onClick: sendBuzz },
        { separator: true },
        ...AUDIBLES.map((a) => ({ label: `Audible: ${a.label}`, onClick: () => sendAudible(a.id) })),
      ],
    },
    { label: 'Help', items: [{ label: 'Audibles & biểu tượng ẩn', onClick: () => setModal('audible') }, { label: 'About Nhà Mình Messenger', onClick: () => setModal('about') }] },
  ];

  const chatProps = activeHead && {
    head: activeHead,
    messages: activeMessages,
    myAvatar,
    myNick,
    myFont,
    setMyFont,
    draft: drafts[activeKey] || '',
    setDraft: (v) => {
      setDrafts((d) => ({ ...d, [activeKey]: v }));
      const cid = chatOfKey(activeKey);
      if (cid) setTypingIn(v.trim() ? cid : null);
    },
    onSend: sendText,
    onBuzz: sendBuzz,
    onAction: doAction,
    onSendImage: sendImage,
    onAudible: sendAudible,
    onSetImv: setImv,
    imv: imvs[activeKey] || 'none',
    typingText: typingTextOf(activeKey),
    tabs: tabViews,
    activeKey,
    onSelectTab: (k) => setActiveKey(k),
    onCloseTab: closeTab,
    showTime,
    menus: chatMenus,
    buzzFlash,
    dictation: caps.dictation || null,
    canImage: activeKey && activeKey.startsWith('bot:') ? true : !!caps.assets,
  };
  const listProps = {
    me: { nick: myNick, status: myStatus, statusMsg: (myMember && myMember.statusMsg) || '', statusHistory: (myMember && myMember.statusHistory) || [] },
    myAvatar,
    onCycleAvatar: cycleAvatar,
    onSetStatus: setMyStatus,
    onSetStatusMsg: setStatusMsg,
    entries,
    groupsOpen,
    onToggleGroup: (g) => setGroupsOpen((s) => ({ ...s, [g]: s[g] === false })),
    onOpen: openChat,
    menus: listMenus,
    soundOn,
    onToggleSound: () => setSoundOn((v) => !v),
    tip: TIPS[tipIdx],
    solo,
    onInviteHelp: () => setModal('invite'),
    onAudibleHelp: () => setModal('audible'),
  };
  const loginPhase = phase === 'connecting' || (caps.ready && !accountLoaded) ? 'connecting' : phase;
  const loginProps = {
    phase: loginPhase,
    member: myMember,
    account,
    profileName,
    takenNicks,
    solo,
    lastId: loadPref(`last_id_${myId || 'solo'}`, ''),
    hasRememberedDevice: !!storedDevice(),
    rememberPref: !!loadPref(`remember_${myId || 'solo'}`, false),
    autoSignIn: !!loadPref(`auto_${myId || 'solo'}`, false) && !signedOutOnce,
    kickedMsg,
    onSignIn: doSignIn,
    onRegister: doRegister,
    onRecover: doRecover,
    onSetPassword: doSetPassword,
  };
  const loginKey = `${loginPhase}-${myMember ? 'm' : 'n'}-${account && account.pw ? 'p' : 'x'}`;
  const toastViews = toasts.map((t) => ({ ...t, cid: t.key }));
  const onToastOpen = (t) => { setToasts((p) => p.filter((x) => x.id !== t.id)); if (t.cid) openChat(t.cid); };
  const closeToast = (id) => setToasts((p) => p.filter((x) => x.id !== id));
  const modalEl = modal === 'invite' ? <InviteHelpDialog isOwner={isOwner} onClose={() => setModal(null)} />
    : modal === 'audible' ? <AudibleHelpDialog onClose={() => setModal(null)} onPreview={(id) => { sfx.unlock(); showAudible(id, myNick); }} />
      : modal === 'about' ? <AboutDialog solo={solo} onClose={() => setModal(null)} />
        : modal === 'account' && myMember ? (
          <AccountDialog member={myMember} account={account} currentDeviceKey={currentDeviceKey} autolock={autolock} onAutolock={setAutolock} mobile={mobile}
            onChangePassword={changePassword} onChangeQuestion={changeQuestion} onDisplayName={async (n) => { updateMe({ displayName: n }); return null; }}
            onForgetDevice={forgetDevice} onForgetOthers={forgetOthers} onClose={() => setModal(null)} />
        ) : null;
  const smallIcon = <SmileyFace size={16} />;
  const audEl = audFlash ? (
    <div key={audFlash.k} className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 350 }}>
      <div className="ym-aud flex flex-col items-center gap-2 px-6 py-4 rounded-xl" style={{ background: 'rgba(255,248,214,.95)', border: '2px solid #f0c040', boxShadow: '0 10px 30px rgba(0,0,0,.35)' }}>
        <span style={{ fontSize: 88, lineHeight: 1 }}>{audFlash.emoji}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#6b3a00', fontFamily: UI_FONT }}>{audFlash.caption}</span>
        {audFlash.from ? <span style={{ fontSize: 12, color: '#8a6a2a', fontFamily: UI_FONT }}>— {audFlash.from}</span> : null}
      </div>
    </div>
  ) : null;
  const warnEl = dbWarn && phase === 'app' ? (
    <div className="fixed left-1/2 px-3 py-1 rounded" style={{ top: 'calc(6px + env(safe-area-inset-top, 0px))', transform: 'translateX(-50%)', zIndex: 320, background: '#fff6d6', border: '1px solid #f0d27a', color: '#6b4a00', fontSize: 11, fontFamily: UI_FONT, maxWidth: '90%' }}>{dbWarn}</div>
  ) : null;

  /* ============================ ĐIỆN THOẠI ============================ */
  if (mobile) {
    return (
      <div ref={appRef} className="ym-root w-full h-full flex flex-col overflow-hidden" style={{ background: '#ece9ef', fontFamily: UI_FONT }}>
        <style>{GLOBAL_CSS}</style>
        {phase !== 'app' ? (
          <>
            <TitleBar mobile icon={smallIcon} title="Nhà Mình Messenger" />
            <LoginPanel key={loginKey} mobile {...loginProps} />
          </>
        ) : mobileView === 'chat' && chatProps ? (
          <>
            <TitleBar mobile icon={smallIcon} title={activeHead.isRoom ? activeHead.title : `${activeHead.title} - Instant Message`}>
              <button type="button" onClick={() => setShowTime((v) => !v)} title="Show timestamps" className="flex items-center justify-center rounded" style={{ width: 30, height: 26, background: showTime ? 'rgba(255,255,255,.3)' : undefined }}>
                <Clock size={15} color="#fff" />
              </button>
              <WinButtons onClose={() => closeTab(activeKey)} />
            </TitleBar>
            <ChatPanel {...chatProps} mobile onBack={() => setMobileView('list')} />
          </>
        ) : (
          <>
            <TitleBar mobile icon={smallIcon} title={solo ? 'Nhà Mình Messenger (một mình)' : 'Nhà Mình Messenger'}>
              {tabs.length > 0 && (
                <button type="button" onClick={() => setMobileView('chat')} className={`flex items-center gap-1 px-2 rounded ${totalUnread ? 'ym-flash' : ''}`} style={{ height: 24, background: totalUnread ? '#ff8a00' : 'rgba(255,255,255,.2)', fontSize: 11 }}>
                  <MessageSquare size={13} color="#fff" /> {totalUnread || tabs.length}
                </button>
              )}
              <button type="button" onClick={() => setModal('about')} title="Help" className="flex items-center justify-center rounded" style={{ width: 30, height: 26 }}><HelpCircle size={16} color="#fff" /></button>
              <button type="button" onClick={signOut} title="Sign Out" className="flex items-center justify-center rounded" style={{ width: 30, height: 26 }}><LogOut size={16} color="#fff" /></button>
            </TitleBar>
            <ContactListPanel {...listProps} mobile />
          </>
        )}
        <Toasts mobile toasts={toastViews} contactsById={avatarByKey} onOpen={onToastOpen} onClose={closeToast} />
        {audEl}
        {warnEl}
        {modalEl}
      </div>
    );
  }

  /* ============================ MÁY TÍNH ============================ */
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
    <div ref={appRef} className="ym-root relative w-full h-full overflow-hidden" style={{ background: GRAD.desktop, fontFamily: UI_FONT }}>
      <style>{GLOBAL_CSS}</style>
      <div className="absolute pointer-events-none text-right" style={{ right: 24, bottom: 56, color: 'rgba(255,255,255,.55)', fontSize: 12, lineHeight: 1.5 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,.35)' }}>Nhà Mình · 2007</div>
        messenger riêng của gia đình
      </div>

      {phase !== 'app' ? (
        <DesktopWindow win={wins.login} active title="Nhà Mình Messenger" icon={smallIcon} resizable={false} onFocus={() => {}} onChange={(p) => setWins((w) => ({ ...w, login: { ...w.login, ...p } }))} onClose={() => {}}>
          <LoginPanel key={loginKey} {...loginProps} />
        </DesktopWindow>
      ) : (
        <>
          <DesktopWindow
            win={wins.list}
            active={focusWin === 'list'}
            title={`Nhà Mình Messenger — ${myNick}${solo ? ' (một mình)' : ''}`}
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
              title={activeHead.isRoom ? activeHead.title : `${activeHead.title} - Instant Message`}
              icon={activeHead.isRoom ? <Home size={15} color="#fff" /> : <StatusIcon status={activeHead.status} size={16} />}
              minW={400}
              minH={380}
              onFocus={() => focusWindow('chat')}
              onChange={(p) => setWins((w) => ({ ...w, chat: { ...w.chat, ...p } }))}
              onMin={() => setWins((w) => ({ ...w, chat: { ...w.chat, min: true } }))}
              onMax={() => setWins((w) => ({ ...w, chat: { ...w.chat, max: !w.chat.max } }))}
              onClose={() => { setTabs([]); setActiveKey(null); setWins((w) => ({ ...w, chat: { ...w.chat, open: false, max: false } })); }}
            >
              <ChatPanel {...chatProps} />
            </DesktopWindow>
          )}
        </>
      )}

      <div className="absolute left-0 right-0 bottom-0 flex items-center gap-2 px-2" style={{ height: 40, background: GRAD.taskbar, borderTop: '1px solid rgba(255,255,255,.3)', zIndex: 100 }}>
        <button type="button" onClick={() => setModal('about')} className="flex items-center justify-center rounded-full shrink-0" style={{ width: 32, height: 32, background: 'radial-gradient(circle at 35% 30%,#d58cf0,#7B0099 60%,#3d004d)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 0 8px rgba(190,100,255,.6)' }} title="About">
          <SmileyFace size={22} spec={{ mouth: 'bigGrin' }} />
        </button>
        <div className="flex-1 flex items-center gap-1 min-w-0 overflow-hidden">
          {phase === 'app' && taskBtn('list', 'Nhà Mình Messenger', <SmileyFace size={15} />, false)}
          {phase === 'app' && wins.chat.open && activeHead && taskBtn('chat', tabs.length > 1 ? `${tabs.length} cuộc trò chuyện` : activeHead.title, <MessageSquare size={14} color="#fff" />, wins.chat.min && totalUnread > 0)}
        </div>
        <div className="flex items-center gap-2 px-3 shrink-0" style={{ height: 30, borderLeft: '1px solid rgba(255,255,255,.2)', color: '#fff', fontSize: 12 }}>
          <button type="button" title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'} onClick={() => setSoundOn((v) => !v)}>
            {soundOn ? <Volume2 size={16} color="#fff" /> : <VolumeX size={16} color="#ff9a9a" />}
          </button>
          <button type="button" title="Danh sách" onClick={() => { if (phase === 'app') { setWins((w) => ({ ...w, list: { ...w.list, min: false, z: ++zTop.current } })); setFocusWin('list'); } }}>
            <StatusIcon status={phase === 'app' ? myStatus : 'offline'} size={18} />
          </button>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{clockStr}</span>
        </div>
      </div>

      <Toasts toasts={toastViews} contactsById={avatarByKey} onOpen={onToastOpen} onClose={closeToast} />
      {audEl}
      {warnEl}
      {modalEl}
    </div>
  );
}
