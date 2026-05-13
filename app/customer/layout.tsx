import CustomerGuard from "@/app/components/CustomerGuard";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerGuard>{children}</CustomerGuard>;
}
