import { Suspense } from "react";
import ExperiencesClient from "@/components/ExperiencesClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading ...</div>}>
      <ExperiencesClient />
    </Suspense>
  );
}
