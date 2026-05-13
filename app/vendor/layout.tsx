import VendorLayoutWrapper from "@/app/components/vendor/VendorLayoutWrapper";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorLayoutWrapper>{children}</VendorLayoutWrapper>;
}
