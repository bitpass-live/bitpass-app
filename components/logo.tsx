import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('font-bold text-white flex items-center', className)}>
      <span className='text-primary'>Bit</span>Pass
    </div>
  );
}
