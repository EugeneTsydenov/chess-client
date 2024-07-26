'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { InputHTMLAttributes } from 'react';
import {
  Control,
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';

import { cn } from '../lib';

import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

interface FormFieldInputProps {
  placeholder?: string;
  label?: string;
  description?: string;
  type: InputHTMLAttributes<unknown>['type'];
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
  control?: Control<any>;
  name: string;
}

const FormFieldInput = ({
  control,
  name,
  placeholder,
  label,
  description,
  type,
  className,
  labelClassName,
  controlClassName,
  inputClassName,
  descriptionClassName,
  messageClassName,
}: FormFieldInputProps) => {
  return (
    <FormField
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl className={controlClassName}>
            <Input
              className={inputClassName}
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormDescription className={descriptionClassName}>
            {description}
          </FormDescription>
          <FormMessage className={messageClassName} />
        </FormItem>
      )}
      name={name}
    />
  );
};

interface FormFieldCheckboxProps {
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
  control?: Control<any>;
  name: string;
}

const FormFieldCheckbox = ({
  control,
  name,
  label,
  description,
  className,
  labelClassName,
  controlClassName,
  inputClassName,
  descriptionClassName,
  messageClassName,
}: FormFieldCheckboxProps) => {
  return (
    <FormField
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center gap-2">
            <FormControl className={controlClassName}>
              <Checkbox
                className={inputClassName}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className={labelClassName}>{label}</FormLabel>
          </div>
          <FormDescription className={descriptionClassName}>
            {description}
          </FormDescription>
          <FormMessage className={messageClassName} />
        </FormItem>
      )}
      name={name}
    />
  );
};

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormFieldCheckbox,
  FormFieldInput,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
