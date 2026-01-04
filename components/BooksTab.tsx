export function BooksTab(props: { option?: string }) {
  const option = props.option || "quran";

  return (
    <div role="tablist" class="tabs tabs-box tabs-lg">
      <div class="tab" aria-selected={option === "quran" ? "true" : "false"} role="tab"><form method="GET"><input type="hidden" name="option" value="quran" /><button type="submit" aria-label="Al-Quran">Al-Quran</button></form></div>
      <div class="tab" aria-selected={option === "alkitab" ? "true" : "false"} role="tab"><form method="GET"><input type="hidden" name="option" value="alkitab" /><button type="submit" aria-label="Al-Kitab">Al-Kitab</button></form></div>
    </div>
  )
}