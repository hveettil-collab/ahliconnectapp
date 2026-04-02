import { clsx } from 'clsx';

interface AvatarProps {
  initials: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  image?: string;
}

const SIZES = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
const DOT_SIZES = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3', xl: 'w-3.5 h-3.5' };

export default function Avatar({ initials, color = '#1B3A6B', size = 'md', online, image }: AvatarProps) {
  return (
    <div className="relative inline-flex shrink-0">
      {image ? (
        <img
          src={image}
          alt={initials}
          className={clsx('rounded-full object-cover', SIZES[size])}
        />
      ) : (
        <div
          className={clsx('rounded-full flex items-center justify-center font-semibold text-white', SIZES[size])}
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span className={clsx('absolute bottom-0 right-0 rounded-full border-2 border-white', DOT_SIZES[size], online ? 'bg-green-500' : 'bg-gray-300')} />
      )}
    </div>
  );
}
