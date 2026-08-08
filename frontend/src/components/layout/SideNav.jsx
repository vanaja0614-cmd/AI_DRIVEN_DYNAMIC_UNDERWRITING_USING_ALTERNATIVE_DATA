import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApplication } from "../../context/ApplicationContext";

const LINKS = [
  { to: "/application", label: "Application", icon: "assignment" },
  { to: "/consent", label: "Consent", icon: "verified_user" },
  { to: "/results", label: "Results", icon: "analytics" },
  { to: "/users", label: "Firebase Users", icon: "group" },
  { to: "/compliance", label: "Compliance", icon: "gavel" },
  { to: "/reporting", label: "Reporting", icon: "assessment" },
];

export default function SideNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { triggerRefresh } = useApplication();

  const handleRefresh = () => {
    if (pathname !== "/results") {
      navigate("/results");
    }
    triggerRefresh();
  };

  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full flex-col py-lg bg-surface-container-low w-64 border-r border-outline-variant/20 z-10">
      <div className="px-md mb-8">
        <div className="flex items-center gap-xs">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-sm">
              shield
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-black text-on-surface leading-none">
              TrustFlow AI
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Underwriting Engine
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-sm">
        <ul className="space-y-2">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.to);
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-xs py-3 px-4 rounded-r-xl font-label-md text-label-md transition-all duration-300 ${
                    active
                      ? "bg-primary-container text-on-primary-container border-l-4 border-primary"
                      : "text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="px-sm mt-auto">
        <button
          onClick={handleRefresh}
          className="w-full bg-surface-variant text-on-surface font-label-md text-label-md py-2 rounded-lg mb-4 flex items-center justify-center gap-xs hover:bg-surface-bright transition-colors"
        >
          <span className="material-symbols-outlined">refresh</span>
          Refresh Data
        </button>
        <ul className="space-y-2 border-t border-outline-variant pt-4">
          <li>
            <a
              href="#"
              className="flex items-center gap-xs text-on-surface-variant hover:bg-surface-container-high py-3 px-4 rounded-r-xl font-label-md text-label-md transition-all duration-300"
            >
              <span className="material-symbols-outlined">help</span>
              Help Center
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-xs text-on-surface-variant hover:bg-surface-container-high py-3 px-4 rounded-r-xl font-label-md text-label-md transition-all duration-300"
            >
              <span className="material-symbols-outlined">logout</span>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
