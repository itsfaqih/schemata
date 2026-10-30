import { Menu as BaseMenu } from '@base-ui/react/menu';
import { ElementType, ReactElement, ReactNode } from 'react';
import { Menu } from './Menu';

type DropdownMenuProps = {
  trigger: ReactElement;
  items: { label: ReactNode; icon?: ElementType; kbd?: string; onClick?: () => void }[];
};

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner collisionPadding={0}>
          <BaseMenu.Popup render={<Menu.Content />}>
            {items.map((item, index) => (
              <BaseMenu.Item
                key={index}
                onClick={item.onClick}
                render={<Menu.Item icon={item.icon} kbd={item.kbd} />}
              >
                {item.label}
              </BaseMenu.Item>
            ))}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
