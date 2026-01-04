interface HeaderProps {
  class?: string;
}

export function Header(props: HeaderProps) {
  return (
    <header class={`flex items-center justify-between p-4 lg:p-3 ${props.class ?? ""}`}>
      <div class="inline-flex pt-[.3rem] pr-[.3rem] pb-[.3rem] pl-[1.1rem] backdrop-blur-md border border-gray-100 rounded-[6.25rem] justify-start items-center">
        <h3 class="text-[.8rem] tracking-[1.2px] leading-none text-pretty text-primary-foreground">RUH KUDUS</h3>
      </div>
      {/* <div class="inline-flex p-[.3rem] backdrop-blur-md border border-gray-100 rounded-[6.25rem] justify-start items-center">
        
      </div> */}
    </header>
  )
}