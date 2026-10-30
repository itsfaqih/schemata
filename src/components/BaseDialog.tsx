import { ReactElement, ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Modal } from './Modal';
import { IconButton } from './IconButton';
import { XMarkIcon } from '@heroicons/react/24/outline';

type BaseDialogProps = Pick<Dialog.Root.Props, 'open' | 'onOpenChange'> & {
  title: string;
  children: ReactNode;
  trigger?: ReactElement;
  closeOnInteractOutside?: boolean;
};

export function BaseDialog({
  title,
  children,
  trigger,
  closeOnInteractOutside = false,
  ...rootProps
}: BaseDialogProps) {
  return (
    <Dialog.Root {...rootProps} disablePointerDismissal={!closeOnInteractOutside}>
      {trigger && <Dialog.Trigger render={trigger} />}
      <Dialog.Portal>
        <Dialog.Viewport render={<Modal.Overlay />}>
          <Dialog.Popup render={<Modal.Content />}>
            <div className="flex items-center justify-between">
              <Dialog.Title render={<Modal.Title />}>{title}</Dialog.Title>
              <Dialog.Close render={<IconButton icon={XMarkIcon} label="Close" />} />
            </div>
            {children}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
