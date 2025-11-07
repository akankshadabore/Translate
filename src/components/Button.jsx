export default function Button({ onClick, disabled, children, variant = "primary", className = "" }) {
  const baseStyles = "py-3 px-6 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]";
  
  const variants = {
    primary: `bg-indigo-500 hover:from-indigo-700  text-white shadow-lg hover:shadow-xl focus:ring-indigo-500 ${disabled ? '' : 'hover:shadow-indigo-200'}`,
    secondary: `bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-200 hover:border-gray-300 focus:ring-gray-500`,
    danger: `bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500`,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}