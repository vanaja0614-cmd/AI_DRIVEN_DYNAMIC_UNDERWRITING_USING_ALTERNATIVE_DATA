import { Link } from "react-router-dom";
import SideNav from "../components/layout/SideNav";

// Placeholder page. Swap this out once you've generated the "Compliance
// Center" Stitch screen (Prompt 4 from earlier) and sent me the HTML —
// I'll convert it the same way as the other pages.
export default function ComplianceCenter() {
  return (
    <div className="flex min-h-screen w-full bg-background text-on-background">
      <SideNav />
      <main className="flex-1 md:ml-64 p-margin-desktop">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">
          Compliance Center
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
          This screen hasn't been generated in Stitch yet. Once you send its
          HTML export, it'll be converted here — for now, here's the detail
          view for a single withdrawal request.
        </p>
        <Link
          to="/compliance/withdrawal/TF-9975"
          className="text-primary hover:underline font-label-md text-label-md"
        >
          View sample withdrawal request →
        </Link>
      </main>
    </div>
  );
}
