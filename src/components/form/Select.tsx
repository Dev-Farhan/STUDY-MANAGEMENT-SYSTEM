interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  value?: Option | null;
  onChange: (option: Option | null) => void;
  className?: string;
  defaultValue?: string;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value = null,
  success = false,
  error = false,
  hint,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption =
      options.find((opt) => opt.value === e.target.value) || null;
    onChange(selectedOption);
  };
  console.log("hintttttttttt", error, hint);
  return (
    <div className="w-full">
      <select
        className={`h-11 w-full appearance-none rounded-lg border bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10"
          }
          dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 
          ${
            value
              ? "text-gray-800 dark:text-white/90"
              : "text-gray-400 dark:text-gray-400"
          } 
          ${className}`}
        value={value?.value || ""}
        onChange={handleChange}
      >
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Select;
