import { clsx } from '@/utils/clsx';
import { Separator as BaseSeparator } from '@base-ui/react/separator';

type SeparatorProps = Pick<BaseSeparator.Props, 'orientation'> & {
  className?: string;
};

export function Separator({ className, ...rootProps }: SeparatorProps) {
  return (
    <BaseSeparator
      {...rootProps}
      className={clsx([
        'bg-gray-200',
        'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      ])}
    />
  );
}
