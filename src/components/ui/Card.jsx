export default function Card({ className = '', children, title, footer }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 ${className}`}>
      {title && <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>{footer}</div>}
      {title ? <div>{children}</div> : children}
    </div>
  )
}
