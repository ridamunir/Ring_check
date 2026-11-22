export default function StatusBadge({ status }) {
  const colors = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    unpublished: "bg-gray-200 text-gray-700",
  };
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Draft";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || colors.draft}`}>
      {label}
    </span>
  );
}
