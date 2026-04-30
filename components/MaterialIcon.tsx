import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

interface MaterialIconProps {
  name: string;
  size?: 'inherit' | 'sm' | 'md' | 'lg' | number;
  className?: string;
  ariaLabel?: string;
  iconStyle?: CSSProperties;
}

const iconFileSuffixByFolder = {
  sm: '24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24',
  md: '28dp_E3E3E3_FILL0_wght400_GRAD0_opsz24',
  lg: '32dp_E3E3E3_FILL0_wght400_GRAD0_opsz40',
} as const;

const iconNameAliases: Record<string, string> = {
  stat_minus: 'stat_minus_1',
};

const sizeMap = {
  sm: 24,
  md: 28,
  lg: 32,
} as const;

type IconFolder = keyof typeof iconFileSuffixByFolder;

const resolveSize = (size?: MaterialIconProps['size']) => {
  if (typeof size === 'number') return size;
  if (!size || size === 'inherit') return null;
  return sizeMap[size];
};

const resolveFolder = (size?: MaterialIconProps['size']): IconFolder => {
  if (typeof size === 'number') {
    if (size <= 24) return 'sm';
    if (size <= 28) return 'md';
    return 'lg';
  }

  if (!size || size === 'inherit') return 'sm';

  return size;
};

export default function MaterialIcon({
  name,
  size = 'inherit',
  className = '',
  ariaLabel,
  iconStyle,
}: MaterialIconProps) {
  const folder = resolveFolder(size);
  const resolvedName = iconNameAliases[name] ?? name;
  const src = `/icons/${folder}/${resolvedName}_${iconFileSuffixByFolder[folder]}.svg`;
  const resolvedSize = resolveSize(size);

  const resolvedStyle: CSSProperties = {
    backgroundColor: 'currentColor',
    display: 'inline-block',
    flexShrink: 0,
    height: resolvedSize ? `${resolvedSize}px` : '1em',
    verticalAlign: 'middle',
    width: resolvedSize ? `${resolvedSize}px` : '1em',
    WebkitMaskImage: `url(${src})`,
    WebkitMaskPosition: 'center',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskImage: `url(${src})`,
    maskPosition: 'center',
    maskRepeat: 'no-repeat',
    maskSize: 'contain',
    ...iconStyle,
  };

  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn('align-middle', className)}
      style={resolvedStyle}
    />
  );
}
