import SideNav from "./SideNav";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-on-surface">
      <SideNav />
      <main className="flex-1 flex flex-col md:ml-64 relative">{children}</main>
    </div>
  );
}
