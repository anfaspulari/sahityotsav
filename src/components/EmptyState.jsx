export default function EmptyState({ icon = '📭', title = 'Nothing here', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
      <span className="text-5xl">{icon}</span>
      <p className="font-semibold text-gray-700 mt-2">{title}</p>
      {description && <p className="text-sm text-gray-400 max-w-xs">{description}</p>}
    </div>
  )
}
