import { useBreadcrumbs } from "../context/BreadcrumbContext";
import Breadcrumbs from "./BreadCrumbs";

export default function GlobalBreadcrumbBar() {
  const { items } = useBreadcrumbs();

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumbs
        items={items?.length ? items : [{ label: "Anasayfa", to: "/" }]}
      />
    </div>
  );
}
