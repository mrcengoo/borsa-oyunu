import {
  Fuel,
  Boxes,
  Hammer,
  Zap,
  Disc,
  Cpu,
  Server,
  FlaskConical,
  Atom,
  Leaf,
  Layers,
  Shield,
  BatteryCharging,
} from 'lucide-react';

interface ProductIconProps {
  type: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProductIcon({ type, className = '', size = 'md' }: ProductIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size];

  switch (type) {
    case 'cement':
      return <Boxes className={`${sizeClasses} text-stone-600 ${className}`} />;
    case 'oil':
      return <Fuel className={`${sizeClasses} text-amber-500 ${className}`} />;
    case 'steel':
      return <Hammer className={`${sizeClasses} text-blue-500 ${className}`} />;
    case 'copper':
      return <Zap className={`${sizeClasses} text-orange-500 ${className}`} />;
    case 'wafer':
      return <Disc className={`${sizeClasses} text-cyan-500 ${className}`} />;
    case 'chip':
      return <Cpu className={`${sizeClasses} text-emerald-500 ${className}`} />;
    case 'memory':
      return <Server className={`${sizeClasses} text-indigo-500 ${className}`} />;
    case 'api':
      return <FlaskConical className={`${sizeClasses} text-purple-500 ${className}`} />;
    case 'polymer':
      return <Atom className={`${sizeClasses} text-teal-500 ${className}`} />;
    case 'bio':
      return <Leaf className={`${sizeClasses} text-lime-500 ${className}`} />;
    case 'carbon':
      return <Layers className={`${sizeClasses} text-sky-500 ${className}`} />;
    case 'titanium':
      return <Shield className={`${sizeClasses} text-rose-500 ${className}`} />;
    case 'battery':
      return <BatteryCharging className={`${sizeClasses} text-amber-400 ${className}`} />;
    default:
      return <Boxes className={`${sizeClasses} text-slate-500 ${className}`} />;
  }
}
