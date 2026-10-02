// Customer-facing wording for the three request statuses.
export const STATUS_LABELS = {
  pending: 'Received',
  researching: 'Being researched',
  completed: 'Ready',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`status status--${status}`}>{STATUS_LABELS[status] ?? status}</span>
  )
}
