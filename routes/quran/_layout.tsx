import type { PageProps } from "fresh";
import { Drawer } from "@/components/drawer.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <Drawer>
      <Component />
    </Drawer>
  );
}