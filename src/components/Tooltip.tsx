import { clsx } from '@/utils/clsx';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { ReactElement } from 'react';

type TooltipProps = {
  text: string;
  children: ReactElement;
  disabled?: boolean;
};

export function Tooltip({ text, children, disabled = false }: TooltipProps) {
  return (
    <BaseTooltip.Root disabled={disabled} disableHoverablePopup>
      <BaseTooltip.Trigger delay={0} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner collisionPadding={0}>
          <BaseTooltip.Popup
            role="tooltip"
            className={clsx(
              'rounded-sm border border-gray-700 bg-gray-900 py-2.5 px-3 text-xs text-white shadow-xs',
              '[&[data-open]:not([data-instant])]:animate-in [&[data-open]:not([data-instant])]:zoom-in-95',
            )}
          >
            {text}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
