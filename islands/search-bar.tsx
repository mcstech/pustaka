export function SearchBar() {
  return (
    <div class="relative">
      <SearchBarTrigger />
      <SearchBarModal />
    </div>
  )
}

export function SearchBarTrigger() {
  const handleOpenModal = () => {
    const dialog = document.getElementById("docFind") as HTMLDialogElement | null;

    if (!dialog) return;
    if (dialog.open) return; // guard against repeated showModal calls throwing

    dialog.showModal();
  };

  return (
    <div class="input input-sm drop-shadow-md" role="search" aria-label="Open search dialog" onClick={handleOpenModal}>
      <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        type="search"
        class="grow"
        placeholder="Cari"
        onClick={handleOpenModal}
        onFocus={handleOpenModal}
        readOnly
      />
      <kbd class="kbd kbd-sm">⌘</kbd>
      <kbd class="kbd kbd-sm">K</kbd>
    </div>
  )
}

export function SearchBarModal() {
  const results = [
    {
      title: "Profiles in Visual Studio Code • Doc Writer Profile Template",
      desc: "The Doc Writer profile is a good lightweight setup for writing documentation. It comes with the following extensions: Code Spell Checker - Spelling checker for source code. Markdown Checkboxes - Add...",
      section: "DOCUMENTATION",
      active: true,
    },
    {
      title: "Markdown and Visual Studio Code • Doc Writer profile template",
      desc: "Profiles let you quickly switch your extensions, settings, and UI layout depending on your current project or task. To help you get started with editing Markdown, you can use the Doc Writer profile ...",
      section: "DOCUMENTATION",
      active: false,
    },
    {
      title: "Visual Studio Code on macOS • Install VS Code on macOS",
      desc: "Download Visual Studio Code for macOS. Open the browser's download list and locate the downloaded app or archive. If archive, extract the archive contents. Use double-click for some browsers or selec...",
      section: "DOCUMENTATION",
      active: false,
    },
    {
      title: "Visual Studio Code FAQ",
      desc: "Our docs contain a Common questions section as needed for specific topics. We've captured items here that don't fit in the other topics. If you don't see an answer to your question here, check our p...",
      section: "DOCUMENTATION",
      active: false,
    },
    {
      title: "September 2020 (version 1.50) • Docs View",
      desc: "The new release includes an experimental Markdown Docs View. Details inside...",
      section: "UPDATES",
      active: false,
    },
  ];

  const handleClose = () => {
    const dialog = document.getElementById("docFind") as HTMLDialogElement | null;
    if (!dialog) return;
    
    if (dialog.open) {
      console.log("closing dialog", dialog);
      dialog.close();
    }
  };

  const handleDialogClick = (event: MouseEvent) => {
    const dialog = event.currentTarget as HTMLDialogElement;
    const rect = dialog.getBoundingClientRect();
    // Close if click is outside the modal-box (on backdrop)
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      handleClose();
    }
  };

  return (
    <dialog
      id="docFind"
      class="modal modal-bottom sm:modal-middle"
      onClick={handleDialogClick}
    >
      <div class="modal-box p-0 overflow-hidden">
        <div class="flex items-center gap-3 border-b border-base-300 px-4 py-3">
          <svg class="h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            class="input input-ghost flex-1 text-base"
            placeholder="Search documentation"
            autoFocus
          />
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div class="px-4 pt-4 text-xs font-semibold text-neutral">Documentation</div>
          <div class="mt-2">
            {results.filter((r) => r.section === "DOCUMENTATION").map((item) => (
              <div
                class={`px-4 py-3 cursor-pointer transition hover:bg-base-200 ${item.active ? "bg-primary text-primary-content" : ""}`}
              >
                <div class="text-sm font-semibold leading-tight">{item.title}</div>
                <div class={`mt-1 text-sm leading-snug ${item.active ? "text-primary-content/80" : "text-neutral"}`}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          <div class="px-4 pt-4 text-xs font-semibold text-neutral">Updates</div>
          <div class="mt-2">
            {results.filter((r) => r.section === "UPDATES").map((item) => (
              <div class="px-4 py-3 cursor-pointer transition hover:bg-base-200">
                <div class="text-sm font-semibold leading-tight">{item.title}</div>
                <div class="mt-1 text-sm leading-snug text-neutral">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button type="reset">close</button></form>
    </dialog>
  )
}