import Image from 'next/image';

interface LogoProps {
  className?: string;
  height?: number;
}

export default function Logo({ className = '', height = 40 }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`} style={{ height: `${height}px`, maxHeight: `${height}px` }}>
      <div className="relative" style={{ height: `${height}px`, maxHeight: `${height}px`, width: 'auto' }}>
        <Image
          src="/logo.png"
          alt="Formula IHU Logo"
          height={height}
          width={height * 4}
          className="h-full w-auto object-contain"
          style={{ maxHeight: `${height}px`, maxWidth: '100%' }}
          priority
        />
      </div>
    </div>
  );
}
