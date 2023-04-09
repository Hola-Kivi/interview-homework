import clsx from 'clsx';

type Props = {
  className?: string;
  props?: [];
  placeholder?: string;
  value?: string;
  type?: string;
  role?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({
  className,
  placeholder,
  value,
  type,
  role,
  required = true,
  onChange,
  ...props
}: Props) => {
  return (
    <input
      value={value}
      type={type}
      role={role}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx(
        'border-solid border-gray border-1 px-6 py-2 text-lg rounded-3xl w-full bg-gray-100 focus:shadow focus:bg-white focus:outline-none',
        className
      )}
      {...props}
    />
  );
};

export default Input;
