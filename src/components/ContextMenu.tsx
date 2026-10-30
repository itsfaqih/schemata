import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { ElementType, MouseEvent, ReactElement, useRef } from 'react';
import { Menu } from './Menu';

type ContextMenuProps = {
  menu: {
    label: string;
    icon?: ElementType;
    onClick?: (event: MouseEvent) => void;
    disabled?: boolean;
    kbd?: string;
    'data-test'?: string;
  }[];
  children: ReactElement;
  disabled?: boolean;
};

export function ContextMenu({ menu, children, disabled = false }: ContextMenuProps) {
  // Focus goes back to whatever held it before the menu opened, or stays put when nothing did.
  // Base UI would otherwise focus the first tabbable element inside the trigger, which on the
  // canvas is an unrelated table.
  const focusedBeforeOpen = useRef<HTMLElement | null>(null);

  return (
    <BaseContextMenu.Root
      disabled={disabled}
      onOpenChange={(open) => {
        if (!open) return;

        const { activeElement } = document;

        focusedBeforeOpen.current =
          activeElement instanceof HTMLElement && activeElement !== document.body
            ? activeElement
            : null;
      }}
    >
      <BaseContextMenu.Trigger render={children} />

      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner side="right" sideOffset={2} collisionPadding={0}>
          <BaseContextMenu.Popup
            render={<Menu.Content />}
            finalFocus={() => focusedBeforeOpen.current ?? false}
            onKeyDown={(event) => event.stopPropagation()}
          >
            {menu.map((item, index) => (
              <BaseContextMenu.Item
                key={index}
                onClick={item.onClick}
                disabled={item.disabled ?? false}
                render={<Menu.Item icon={item.icon} kbd={item.kbd} data-test={item['data-test']} />}
              >
                {item.label}
              </BaseContextMenu.Item>
            ))}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </BaseContextMenu.Root>
  );
}
