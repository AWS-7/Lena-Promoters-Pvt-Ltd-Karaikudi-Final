"use client";

import dynamic from "next/dynamic";

const EnquiryPopup = dynamic(() => import("@/components/EnquiryPopup"), {
  ssr: false,
});

export default function DeferredEnquiryPopup() {
  return <EnquiryPopup />;
}
