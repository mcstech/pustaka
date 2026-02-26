import type { PageProps } from "fresh";
import { define } from "@/utils.ts";

export default define.layout(({ Component }: PageProps) => {
  return (
    <>
      <Component />
    </>
  );
});