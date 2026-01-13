import type { ComponentChildren } from "preact";
import { HeaderDrawer } from "./header.tsx";
import { BookToCProps, DrawerBookSelector, BookToC } from "./book-selector.tsx";

interface DrawerProps extends BookToCProps {
  children?: ComponentChildren;
  isQuran?: boolean;
}

export function Drawer({ children, isQuran, data, selected }: DrawerProps) {
  return (
    <div class="drawer lg:drawer-open">
      <input id="quran-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <HeaderDrawer />
        {children}
      </div>

      <DrawerSidebar isQuran={isQuran} data={data} selected={selected}>
        <li class="mt-auto">
          <button type="button" class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
            <i class="ph-duotone ph-identification-badge text-xl" />
            <span class="is-drawer-close:hidden">Nama User</span>
          </button>
        </li>
      </DrawerSidebar>
    </div>
  )
}

export function DrawerSidebar({ isQuran, data, selected, children }: DrawerProps) {
  return (
    <div class="drawer-side is-drawer-close:overflow-visible">
      <label for="quran-drawer" aria-label="close sidebar" class="drawer-overlay" />
      <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-5/6 is-drawer-open:sm:w-80">
        <ul class="menu w-full grow">
          <li class="sm:hidden">
            <DrawerBookSelector isQuran={isQuran} />
          </li>
          <li class="is-drawer-open:-mx-2">
            <BookToC data={data} selected={selected} />
          </li>
          {children}
        </ul>
      </div>
    </div>
  )
}