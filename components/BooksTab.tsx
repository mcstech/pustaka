export function BooksTab(props: { option?: string }) {
  const option = props.option || "quran";

  return (
    <div role="tablist" class="tabs tabs-box tabs-lg">
      <a role="tab" class={`tab${option === "quran" ? " tab-active" : ""}`} href="?option=quran">Al-Quran</a>
      <a role="tab" class={`tab${option === "alkitab" ? " tab-active" : ""}`} href="?option=alkitab">Al-Kitab</a>
    </div>
  )
}