import TOC from "./TOC";

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex">
      <div className="flex-shrink-0 p-4">
        <TOC />
      </div>
      <div className="flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
}
