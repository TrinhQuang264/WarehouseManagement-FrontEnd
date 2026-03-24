export default function PaginationBar({ info, children, className = '' }) {
  const classes = ['pagination-container', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {typeof info === 'string' ? <span className="pagination-info">{info}</span> : info}
      {children}
    </div>
  );
}
