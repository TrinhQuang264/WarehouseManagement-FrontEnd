export default function DataTableCard({ children, className = '' }) {
  const classes = ['data-table-card', className].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}
