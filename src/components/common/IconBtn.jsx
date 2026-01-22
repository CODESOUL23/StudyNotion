export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center justify-center ${
        outline 
          ? "border border-yellow-50 bg-transparent hover:bg-yellow-50/10" 
          : "bg-gradient-to-r from-yellow-50 to-yellow-25 hover:shadow-lg hover:shadow-yellow-50/25"
      } cursor-pointer gap-x-2 rounded-lg py-2.5 px-5 font-semibold text-richblack-900 
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98] ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={`${outline && "text-yellow-50"}`}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  )
}
