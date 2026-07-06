export default function Table({ columns, data, rowKey, renderRow, className = '' }) {
  const tableClassName = className.replace(/min-w-[^\s]+/g, '').trim()

  return (
    <div className="overflow-x-auto">
      <table className={`w-full min-w-[720px] text-sm ${tableClassName}`}>
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400 dark:border-gray-700">
            {columns.map((col) => (
              <th key={col.key} className="pb-3 font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  )
}
