import { TranslationBooks } from "@/types/bible/books.ts";

interface AlKitabListProps {
  kitab: TranslationBooks;
}
export function AlKitabBooksList({ kitab }: AlKitabListProps) {
  return (
    <div class="py-20 sm:py-10">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 class="text-center text-lg/8 font-semibold text-primary">{kitab.translation.name}</h2>
        <div class="mx-auto grid max-w-lg grid-cols-1 sm:grid-cols-3 items-center gap-x-8 gap-y-12 sm:max-w-xl lg:mx-0 lg:max-w-none">
          {kitab.books.map((book) => (
            <AlKitabBookItem key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function AlKitabBookItem({ book }: { book: TranslationBooks['books'][0] }) {
  return (
    <div class="bg-base-200 border rounded-selector w-full">
      <a class="group no-underline" href={`/alkitab/${book.id}`}>
        <div class="flex justify-between items-center py-4 px-5 hover:bg-accent/50 transition-colors duration-200">
          <div class="flex items-center">
            <div class="relative bg-base-300 flex items-center size-[calc(2.5*1rem)] rounded rotate-0 me-1 text-center before:absolute before:top-0 before:left-0 before:size-[calc(2.5*1rem)] before:bg-base-300 before:rotate-135 [&_p]:w-full [&_p]:z-10 [&_p]:font-bold">
              <p>{book.order}</p>
            </div>
            <h4 aria-label={book.name} class="ml-4 text-lg font-semibold">
              {book.commonName}
            </h4>
          </div>
          <Kitab chapterCount={book.numberOfChapters} />
        </div>
      </a>
    </div>
  )
}

function Kitab({ chapterCount }: { chapterCount: number }) {
  return (
    <div class="flex flex-col items-center">
      <span class="text-sm">{chapterCount} BAB</span>
    </div>
  )
}