import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
}

const SIZES = { sm: 28, md: 34, lg: 42 };

export default function Logo({ size = 'md', showText = true, textColor, subtextColor }: LogoProps) {
  const px = SIZES[size];
  return (
    <div className="flex items-center gap-2.5">
      <Image src="/logo.svg" alt="Ahli Connect" width={px} height={px} priority />
      {showText && (
        <div>
          <span
            className="text-[15px] font-bold tracking-tight leading-tight block"
            style={{ color: textColor || 'var(--text-primary)' }}
          >
            Ahli Connect
          </span>
          <p
            className="text-[10px] leading-none mt-0.5"
            style={{ color: subtextColor || 'var(--text-muted)' }}
          >
            by IHC Group
          </p>
        </div>
      )}
    </div>
  );
}
