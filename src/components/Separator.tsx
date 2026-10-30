import { clsx } from '@/utils/clsx';
import * as RadixSeparator from '@radix-ui/react-separator';

type SeparatorProps = Pick<RadixSeparator.SeparatorProps, 'orientation'> & {
  className?: string;
};

export function Separator({ className, ...rootProps }: SeparatorProps) {
  return (
    <RadixSeparator.Root
      {...rootProps}
      className={clsx([
        'bg-gray-200',
        'rdx-orientation-horizontal:h-px rdx-orientation-horizontal:w-full',
        'rdx-orientation-vertical:h-full rdx-orientation-vertical:w-px',
        className,
      ])}
    />
  );
}
