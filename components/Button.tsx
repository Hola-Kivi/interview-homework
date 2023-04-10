import { cva, VariantProps } from 'class-variance-authority';
import classNames from 'classnames';
import { FC } from 'react';

const buttonClasses = cva(
  [
    'rounded-3xl',
    'font-bold',
    'hover:scale-110',
    'active:scale-100',
    'transition',
    'duration-200',
    'ease-in-out',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-violet-500',
          'text-white',
          'border-transparent',
          'hover:bg-violet-600',
        ],
        secondary: [
          'bg-violet-500',
          'text-white',
          'border-gray-400',
          'hover:bg-gray-100',
          'border-gray-800',
        ],
        secondaryBorder: [
          'bg-white',
          'text-black',
          'border-gray-400',
          'hover:bg-gray-100',
          'border-solid',
          'border-2',
        ],
        text: [
          'text-base',
          'bg-transparent',
          'text-black',
          'hover:bg-gray-100',
        ],
      },
      size: {
        small: ['text-sm', 'py-2', 'px-1'],
        medium: ['text-lg', 'px-6', 'py-2'],
        large: ['text-xlg', 'px-8', 'py-4'],
      },
      disabled: {
        true: ['button--disabled'],
        false: ['button--enabled'],
      },
      loading: {
        true: ['loading={true}'],
        false: ['loading={false}'],
      },
      type: {
        submit: ['type={submit}'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
      disabled: true,
      loading: false,
    },
  }
);

export interface ButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'disabled' | 'type'>,
    VariantProps<typeof buttonClasses> {
  children: React.ReactNode;
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  intent,
  size,
  disabled,
  loading,
  type,
  ...props
}) => {
  return (
    <button
      className={buttonClasses({ intent, size, disabled, loading, className })}
      {...props}
    >
      <span
        className={classNames(
          'leading-[1.25rem]',
          loading && 'text-transparent'
        )}
      >
        {children}
      </span>
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block w-4 h-4">
          <svg
            className="animate-spin"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="fill-current"
              d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"
            ></path>
          </svg>
          <span className="sr-only">Loading...</span>
        </span>
      )}
    </button>
  );
};

export default Button;
