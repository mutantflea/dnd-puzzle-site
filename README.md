# The Tablets — Puzzle Helper

A little static site to help me and my friends crack the stone-tablet puzzle. A
big editable **5×5 grid** of movable letter tiles sits in the centre, with the
clue tablets recreated alongside.

## The puzzle

The clues are photographed stone tablets (kept private — not committed, since one
photo shows a real address). The site shows clean recreations of each:

| Tablet | Meaning |
| --- | --- |
| **Bernadette** | The 5×5 grid of engraved letters — the starting board. |
| **Fenrick** | Two tiles move left. |
| **Aurélia** | Two tiles move up. |
| **Bjorn/Astrid** | `O ↔ X` / `X ↔ O` — two horizontal swaps. |
| **Rook Wood** | `XX XX XX XX` — the odd one out (eight marks in four pairs) + a red envelope. |
| **Ailbhe** | A Webdings substitution cipher — decodes to "The celestial light heralds dawn on Midgard". |
| **? ? ?** | Sealed — one final clue still to be revealed. |

The clue tablets look like transformation rules applied to Bernadette's grid — the
site lets everyone experiment with moving/swapping tiles to test theories.

## Using the tool

- **Drag** a tile onto an empty square to move it; drop it onto another tile to **swap** them.
- **Click** a square and **type** a letter to set it (creating a tile), or press
  **Backspace/Delete** to clear it. Arrow keys move between squares.
- **Auto-save** — your board is kept in the browser (localStorage) across refreshes.
- **Reset to original** — snap back to Bernadette's starting letters.
- **Copy shareable link** — encodes the current board into the URL so friends see the same board.

## Tech

- **Vite + React + TypeScript** — builds to a static `dist/` folder.
- **@dnd-kit/core** — drag-and-drop for the tiles.
- Plain **CSS Modules** for the stone-tablet look.

## Local development

Open the repo in the devcontainer (`.devcontainer/`), or with Node 20 installed:

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs static site to dist/
npm run preview  # serve the production build locally
```

## Deployment (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and deploys it to GitHub Pages.

**One-time setup:** in the repo on GitHub, go to **Settings → Pages → Build and
deployment → Source** and select **GitHub Actions**. After the first successful
run, the site is live at `https://<your-user>.github.io/<repo>/`.

`vite.config.ts` uses `base: "./"` (relative asset paths), so the build works at
that project URL without hardcoding the repo name.
