import { Check } from 'phosphor-react';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton } from './IconButton';
import { useSaveLocalSchema } from '@/mutations/useSaveLocalSchema';
import { EditorPanelContainer } from './EditorPanelContainer';
import { SchemaSchema, SchemaType } from '@/schemas/schema';
import { Textbox } from './Textbox';
import FocusLock from 'react-focus-lock';

type GeneralPropsPanelProps = {
  schema: SchemaType;
};

const RenameSchema = SchemaSchema.pick({ name: true });

type RenameType = Pick<SchemaType, 'name'>;

export function GeneralPropsPanel({ schema }: GeneralPropsPanelProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const { mutateAsync: saveDatabaseLocal } = useSaveLocalSchema(schema.id);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<RenameType>({
    resolver: zodResolver(RenameSchema),
    defaultValues: { name: schema.name },
  });

  const onSubmit = handleSubmit(async ({ name }) => {
    await saveDatabaseLocal((currentSchema) => ({ ...currentSchema, name }));

    setIsRenaming(false);
  });

  const handleRename = () => {
    setIsRenaming(true);
  };

  useEffect(() => {
    reset({ name: schema.name });
  }, [reset, schema.name]);

  return (
    <EditorPanelContainer className="flex items-center">
      {isRenaming ? (
        <FocusLock>
          <form
            onSubmit={onSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                void onSubmit();
              }
            }}
            autoComplete="off"
            className="flex items-center gap-x-1"
          >
            <Textbox
              label="Name"
              {...register('name')}
              disabled={isSubmitting}
              autoFocus
              srOnlyLabel
            />
            <IconButton
              type="submit"
              label="Save (ENTER)"
              icon={Check}
              severity="primary"
              loading={isSubmitting}
              data-test="submit-schema"
              filled
            />
          </form>
        </FocusLock>
      ) : (
        <>
          <span data-test="schema-name" className="px-3 py-2 text-gray-800">
            {schema.name}
          </span>
          <IconButton
            label="Change title"
            icon={PencilSquareIcon}
            onClick={handleRename}
            data-test="edit-schema-button"
            filled
            className="ml-2"
          />
        </>
      )}
    </EditorPanelContainer>
  );
}
