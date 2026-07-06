export default function LoadingMessage({ message = 'Loading...' }) {
  return (
    <div className="py-12 text-center text-sm text-gray-400">{message}</div>
  )
}
