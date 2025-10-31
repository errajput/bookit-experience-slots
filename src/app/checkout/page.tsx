import { Suspense } from "react";
import CheckoutClient from "../../components/CheckoutClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading ...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
