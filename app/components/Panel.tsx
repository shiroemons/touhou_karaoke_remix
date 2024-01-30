export function Panel({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-2 my-4">
        <div className="ais-Panel">
          {header && <div className="ais-Panel-header">{header}</div>}
          <div className="ais-Panel-body">{children}</div>
          {footer && <div className="ais-Panel-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}