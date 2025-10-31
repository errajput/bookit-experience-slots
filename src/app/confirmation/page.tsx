import { Suspense } from "react";
import ConfirmationClient from "@/components/ConfirmationClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading ...</div>}>
      <ConfirmationClient />
    </Suspense>
  );
}
