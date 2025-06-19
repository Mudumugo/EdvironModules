import logoPath from "@assets/lg (2)_1750302459566.png";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl'
};

export function Logo({ 
  size = 'md', 
  className = '', 
  showText = false, 
  textClassName = '' 
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoPath} 
        alt="Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <span className={`font-bold text-blue-600 ${textSizeClasses[size]} ${textClassName}`}>
          Learning Portal
        </span>
      )}
    </div>
  );
}