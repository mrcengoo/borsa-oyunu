export interface MtgCardArtProps {
  symbol: string;
  name: string;
  colorIdentity?: string;
  className?: string;
}

export function MtgCardArt({ symbol, colorIdentity = 'artifact', className = '' }: MtgCardArtProps) {
  // NVDA: Neural AI Tensor Core / Emerald Supercomputing Monolith
  if (symbol === 'NVDA') {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#021f12] via-[#053d24] to-[#01140b] flex items-center justify-center ${className}`}>
        {/* Background Grid & Particles */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="nvdaCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
            <filter id="nvdaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Circuit Traces */}
          <path d="M40 110 H140 L180 70 H220 L260 110 H360" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
          <path d="M80 180 L140 130 H260 L320 180" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
          <path d="M120 30 L160 70 V150 L120 190" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
          <path d="M280 30 L240 70 V150 L280 190" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
          
          {/* Central Monolithic Tensor Core */}
          <polygon points="200,35 270,75 270,155 200,195 130,155 130,75" fill="url(#nvdaCoreGrad)" stroke="#6ee7b7" strokeWidth="2.5" filter="url(#nvdaGlow)" />
          <polygon points="200,55 250,85 250,145 200,175 150,145 150,85" fill="#012015" stroke="#34d399" strokeWidth="1.5" />
          <circle cx="200" cy="115" r="28" fill="#10b981" fillOpacity="0.25" stroke="#a7f3d0" strokeWidth="2" />
          <circle cx="200" cy="115" r="14" fill="#6ee7b7" />
          {/* Energy Beams */}
          <line x1="200" y1="15" x2="200" y2="35" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" />
          <line x1="200" y1="195" x2="200" y2="215" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" />
          <line x1="110" y1="115" x2="130" y2="115" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" />
          <line x1="270" y1="115" x2="290" y2="115" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // MSFT: Cloud Sovereign Citadel / Azorius Sky Monolith
  if (symbol === 'MSFT') {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#082f49] via-[#0369a1] to-[#0f172a] flex items-center justify-center ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:14px_14px] opacity-20" />
        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="msftSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="msftGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Celestial Clouds & Sunburst */}
          <circle cx="200" cy="70" r="45" fill="#f8fafc" fillOpacity="0.15" filter="url(#msftGlow)" />
          {/* Floating Spire Citadel */}
          <polygon points="200,20 220,120 235,210 165,210 180,120" fill="url(#msftSkyGrad)" stroke="#e0f2fe" strokeWidth="2" />
          <polygon points="140,80 160,150 170,210 130,210" fill="#0369a1" stroke="#7dd3fc" strokeWidth="1.5" />
          <polygon points="260,80 240,150 230,210 270,210" fill="#0369a1" stroke="#7dd3fc" strokeWidth="1.5" />
          {/* Windows / Runes */}
          <rect x="196" y="55" width="8" height="25" rx="4" fill="#38bdf8" />
          <rect x="196" y="95" width="8" height="25" rx="4" fill="#38bdf8" />
          <rect x="196" y="135" width="8" height="35" rx="4" fill="#bae6fd" />
          {/* Data Leylines */}
          <ellipse cx="200" cy="115" rx="140" ry="35" fill="none" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.6" />
        </svg>
      </div>
    );
  }

  // ASML: Extreme Ultraviolet Laser / Quantum Wafer Titan
  if (symbol === 'ASML') {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#0f0e26] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <radialGradient id="asmlPurple" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="40%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#4338ca" />
            </radialGradient>
            <filter id="laserGlow">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Concentric Silicon Wafer Rings */}
          <circle cx="200" cy="110" r="85" fill="#18182b" stroke="#818cf8" strokeWidth="2.5" />
          <circle cx="200" cy="110" r="65" fill="#242147" stroke="#c084fc" strokeWidth="1.5" />
          <circle cx="200" cy="110" r="45" fill="#3b2d69" stroke="#f472b6" strokeWidth="2" />
          {/* EUV 13.5nm Violet Beam */}
          <line x1="200" y1="0" x2="200" y2="110" stroke="#f43f5e" strokeWidth="4" filter="url(#laserGlow)" />
          <line x1="200" y1="0" x2="200" y2="110" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="200" cy="110" r="12" fill="url(#asmlPurple)" filter="url(#laserGlow)" />
          {/* Nanometer Prisms */}
          <polygon points="120,40 135,70 105,70" fill="#a855f7" fillOpacity="0.5" stroke="#c084fc" />
          <polygon points="280,40 295,70 265,70" fill="#a855f7" fillOpacity="0.5" stroke="#c084fc" />
          <polygon points="120,180 135,150 105,150" fill="#a855f7" fillOpacity="0.5" stroke="#c084fc" />
          <polygon points="280,180 295,150 265,150" fill="#a855f7" fillOpacity="0.5" stroke="#c084fc" />
        </svg>
      </div>
    );
  }

  // LLY: Alchemical Life Elixir & Biopharmaceutical Helix
  if (symbol === 'LLY') {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#14532d] via-[#15803d] to-[#052e16] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="llyFlaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <filter id="bioGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Flask Contour */}
          <path d="M185 30 H215 V75 L260 170 C265 185 250 195 235 195 H165 C150 195 135 185 140 170 L185 75 Z" fill="#064e3b" stroke="#86efac" strokeWidth="2.5" />
          {/* Bioluminescent Potion */}
          <path d="M152 145 Q200 130 248 145 L258 170 C262 182 250 190 235 190 H165 C150 190 138 182 142 170 Z" fill="url(#llyFlaskGrad)" filter="url(#bioGlow)" />
          {/* Rising Healing Orbs */}
          <circle cx="185" cy="165" r="6" fill="#f0fdf4" />
          <circle cx="215" cy="155" r="4" fill="#f0fdf4" />
          <circle cx="200" cy="120" r="5" fill="#86efac" filter="url(#bioGlow)" />
          <circle cx="195" cy="85" r="4" fill="#bbf7d0" />
          {/* Arcane Healing Sigil */}
          <circle cx="200" cy="115" r="70" fill="none" stroke="#86efac" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.4" />
        </svg>
      </div>
    );
  }

  // PWR: High Voltage Power Grid / Boros Grid Engineers
  if (symbol === 'PWR') {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#451a03] via-[#9a3412] to-[#1c1917] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <filter id="pwrGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Mountain Silhouette */}
          <polygon points="0,220 110,140 190,190 290,120 400,220" fill="#292524" />
          {/* High Voltage Pylon Tower */}
          <line x1="200" y1="20" x2="200" y2="200" stroke="#fde047" strokeWidth="3" />
          <line x1="140" y1="60" x2="260" y2="60" stroke="#fde047" strokeWidth="2.5" />
          <line x1="150" y1="100" x2="250" y2="100" stroke="#fde047" strokeWidth="2.5" />
          <line x1="165" y1="140" x2="235" y2="140" stroke="#fde047" strokeWidth="2.5" />
          <line x1="170" y1="200" x2="200" y2="20" stroke="#facc15" strokeWidth="2" />
          <line x1="230" y1="200" x2="200" y2="20" stroke="#facc15" strokeWidth="2" />
          {/* Lightning Arcs */}
          <path d="M140 60 Q100 80 40 90" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 3" filter="url(#pwrGlow)" fill="none" />
          <path d="M260 60 Q300 80 360 90" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 3" filter="url(#pwrGlow)" fill="none" />
          <polygon points="200,10 205,25 195,28 202,40" fill="#fef08a" filter="url(#pwrGlow)" />
        </svg>
      </div>
    );
  }

  // CNQ: Petrochemical Titan & Oil Sands Drilling Rig
  if (symbol === 'CNQ') {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#3b0764] via-[#581c87] to-[#18181b] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#c026d3" />
            </linearGradient>
          </defs>
          {/* Tundra Rift */}
          <polygon points="0,170 80,160 160,175 250,165 400,180 400,220 0,220" fill="#18181b" />
          {/* Heavy Drilling Rig Structure */}
          <polygon points="200,30 230,170 170,170" fill="none" stroke="#f472b6" strokeWidth="2.5" />
          <line x1="180" y1="90" x2="220" y2="90" stroke="#e879f9" strokeWidth="2" />
          <line x1="175" y1="130" x2="225" y2="130" stroke="#e879f9" strokeWidth="2" />
          <line x1="170" y1="170" x2="230" y2="90" stroke="#a21caf" strokeWidth="1.5" />
          <line x1="230" y1="170" x2="170" y2="90" stroke="#a21caf" strokeWidth="1.5" />
          {/* Flame Flare */}
          <path d="M200 30 Q215 15 200 0 Q185 15 200 30 Z" fill="url(#oilGrad)" />
          {/* Underground Oil Reservoir Pools */}
          <ellipse cx="200" cy="195" rx="80" ry="15" fill="#09090b" stroke="#e879f9" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // GH: Genomic Oracle & Liquid Biopsy Crystal
  if (symbol === 'GH') {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#134e4a] via-[#0f766e] to-[#042f2e] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <filter id="ghGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Cosmic DNA Helix */}
          <path d="M120 40 Q200 110 280 40" stroke="#5eead4" strokeWidth="2" fill="none" opacity="0.4" />
          <path d="M120 180 Q200 110 280 180" stroke="#5eead4" strokeWidth="2" fill="none" opacity="0.4" />
          {/* Central Floating Diagnostic Prismatic Gem */}
          <polygon points="200,45 250,110 200,175 150,110" fill="#115e59" stroke="#2dd4bf" strokeWidth="2.5" filter="url(#ghGlow)" />
          <polygon points="200,65 230,110 200,155 170,110" fill="#042f2e" stroke="#99f6e4" strokeWidth="1.5" />
          <circle cx="200" cy="110" r="10" fill="#ccfbf1" filter="url(#ghGlow)" />
          {/* Optical Scan Rings */}
          <circle cx="200" cy="110" r="55" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.7" />
          <circle cx="200" cy="110" r="75" fill="none" stroke="#5eead4" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>
    );
  }

  // ENSG: Citadel of Healing Sanctuary
  if (symbol === 'ENSG') {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#164e63] via-[#0e7490] to-[#083344] flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
          <defs>
            <filter id="ensgGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Sunbeams */}
          <polygon points="200,20 130,220 270,220" fill="#cffafe" fillOpacity="0.1" />
          {/* Sanctuary Fortress */}
          <rect x="150" y="80" width="100" height="130" rx="4" fill="#0e7490" stroke="#67e8f9" strokeWidth="2" />
          {/* Central Cathedral Arch */}
          <path d="M180 210 V135 A20 20 0 0 1 220 135 V210 Z" fill="#083344" stroke="#a5f3fc" strokeWidth="2" />
          {/* Healing Shield Emblems */}
          <polygon points="200,45 225,65 225,95 200,115 175,95 175,65" fill="#22d3ee" stroke="#ecfeff" strokeWidth="2" filter="url(#ensgGlow)" />
          <circle cx="200" cy="80" r="8" fill="#ffffff" />
          {/* Ramparts */}
          <rect x="110" y="120" width="40" height="90" fill="#155e75" stroke="#67e8f9" strokeWidth="1.5" />
          <rect x="250" y="120" width="40" height="90" fill="#155e75" stroke="#67e8f9" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // POWL: Arc Voltage Juggernaut & Electrical Switchgear
  return (
    <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-[#7c2d12] via-[#ea580c] to-[#1c1917] flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 400 220" className="w-full h-full relative z-10">
        <defs>
          <filter id="powlGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Massive Steel Switchgear Vault Door */}
        <circle cx="200" cy="110" r="75" fill="#292524" stroke="#fdba74" strokeWidth="3" />
        <circle cx="200" cy="110" r="50" fill="#44403c" stroke="#f97316" strokeWidth="2" />
        {/* Arc Electrodes */}
        <rect x="90" y="95" width="45" height="30" rx="3" fill="#ea580c" stroke="#ffedd5" strokeWidth="2" />
        <rect x="265" y="95" width="45" height="30" rx="3" fill="#ea580c" stroke="#ffedd5" strokeWidth="2" />
        {/* High-Voltage Arc Lightning */}
        <path d="M135 110 L160 85 L180 120 L210 90 L235 125 L265 110" stroke="#fef08a" strokeWidth="3.5" fill="none" filter="url(#powlGlow)" />
        <path d="M135 110 L160 85 L180 120 L210 90 L235 125 L265 110" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <circle cx="200" cy="110" r="14" fill="#fed7aa" filter="url(#powlGlow)" />
      </svg>
    </div>
  );
}
