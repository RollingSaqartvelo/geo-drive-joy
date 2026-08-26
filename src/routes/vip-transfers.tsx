import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { VipTransfersSection } from "@/components/VipTransfersSection";

export const Route = createFileRoute("/vip-transfers")({
  head: () => ({
    meta: [
      { title: "VIP Transfers & Executive Protection in Georgia | GEOrent" },
      { name: "description", content: "VIP transfers, wedding cortèges, event logistics and executive protection across Georgia. Discreet, professional close-protection team, 24/7." },
      { property: "og:title", content: "VIP Transfers & Executive Protection | GEOrent" },
      { property: "og:description", content: "VIP transfers and personal security across Georgia, 24/7." },
    ],
  }),
  component: VipPage,
});

function VipPage() {
  return (
    <SiteLayout>
      <VipTransfersSection />
    </SiteLayout>
  );
}
