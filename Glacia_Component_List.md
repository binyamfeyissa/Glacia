# Glacia — Full Component List

Date: 2026-11-09
Source for the shadcn list: https://ui.shadcn.com/docs/components + the live registry index https://ui.shadcn.com/r/index.json (fetched 2026-11-09 — **65 components**).
Source for Glisse (the glass engine): https://github.com/0kzh/glisse (9 components).

## In plain words

This is the full menu for the Glacia website. It copies shadcn's menu, but every item is Liquid Glass.

A visitor opens the site, picks a component from the list, sees it working live, and copies it into their own website or phone app. The list below is everything that will be on that site, in order of what gets built first.

## Two rules the builder must follow

### Rule 1 — It must work in all browsers. You are right, Glisse does not.

You were right to flag this. Glisse's full bending-glass effect only works in Chrome / Edge / Brave / Arc (Chromium browsers). It does **not** work in Safari or Firefox.

Why, in plain words: the bend uses a special trick (`backdrop-filter` with an SVG filter). Only Chromium understands that trick. Safari has an open bug about it (WebKit bug 245510, still open) and Firefox has the same gap. The plain frosted blur underneath *does* work everywhere — Chrome 76+, Safari 9+, Firefox 103+.

So Glacia is built in two layers, and the second layer must never break the first:

- **Layer 1 — works in ALL browsers (Chrome, Edge, Safari, Firefox, phone browsers too):** frosted blur + tint + a bright rim around the edge + soft shadow. This is the glass look. Every component must look good and be readable with Layer 1 alone.
- **Layer 2 — the bend, Chromium only:** the backdrop visibly bends at the edges, like real glass. This is switched on only when the browser says it can do it (`@supports` check). Safari and Firefox simply skip Layer 2 and keep Layer 1. They never get a blank box, never lose the blur, never look broken.

One trap to avoid: if you write the bend and the blur in one line without that check, Safari throws away the whole line — blur included. Always keep them separate, bend behind the check.

For later (not V1): there are two ways to get the bend in Safari/Firefox too — WebGL2, or bending the component's own content with a normal filter instead of the backdrop. Research those in V2. Do not promise them in V1, and do not delay V1 waiting for them.

**Test rule:** every component must be opened and clicked in Chrome, Safari, and Firefox before it counts as done. Same layout, same text readable, in all three. Chrome gets the extra bend; Safari/Firefox get the same glass without the bend.

### Rule 2 — React Native too, but not everything at once

Web and phone apps share the same names and the same look, but they are built with different tools underneath (web uses Glisse, phones use Apple's real glass on iPhone). So the list below has a "Phone app?" column:

- **Yes** = it is in the phone version too (V1 phone list: Glass, Button, Switch, Slider, Segmented Control, Tab Bar, Card).
- **Web first** = website first, phone version later.
- **Web only** = it does not make sense as a phone component in the same form.

On iPhone the real glass only appears on iOS 26 and newer. Older iPhones and Android get the same layout with a plain see-through tint — nothing moves, nothing breaks. Phone apps need a proper build (not Expo Go) to show the real glass.

---

## Part 1 — All 65 shadcn components, as Glacia versions

"Already in Glisse" means the glass engine already has it — we keep it and rename it. "New" means we have to build it in glass.

### Buttons and actions

| # | Component | What it is, in plain words | Glacia status | Phone app? | Wave |
|---|---|---|---|---|---|
| 1 | Button | The main clickable button | Already in Glisse | Yes | 1 |
| 2 | Button Group | Several buttons joined together | New | Web first | 2 |
| 3 | Toggle | A button that stays on or off | New | Web first | 2 |
| 4 | Toggle Group | A row of on/off buttons, pick one or many | New | Web first | 3 |

### Text and forms — typing, picking, choosing

| # | Component | What it is, in plain words | Glacia status | Phone app? | Wave |
|---|---|---|---|---|---|
| 5 | Text / Typography | Headings, paragraphs, text styles (shadcn calls this Typeset — it is styles, not a button, but the site needs it) | New | Yes | 1 |
| 6 | Input | A box you type in | Already in Glisse | Web first | 1 |
| 7 | Input Group | An input with something attached (icon, button, text) | New | Web first | 2 |
| 8 | Input OTP | Boxes for a one-time code, e.g. 6 digits | New | Web first | 3 |
| 9 | Textarea | A big box for longer writing | New | Web first | 1 |
| 10 | Label | The small text above a box | New | Web first | 1 |
| 11 | Field | Label + box + help text + error, bundled together | New | Web first | 2 |
| 12 | Form | A whole form with checking (is the email real, is the password long enough) | New | Web first | 2 |
| 13 | Checkbox | A tick box | New | Web first | 1 |
| 14 | Radio Group | Pick one from a list (round buttons) | New | Web first | 1 |
| 15 | Select | A dropdown list to pick from | New | Web first | 1 |
| 16 | Native Select | The phone/browser's own dropdown, in glass style | New | Yes | 2 |
| 17 | Combobox | A box you type in that also suggests options | New | Web first | 2 |
| 18 | Slider | Drag a handle to pick a number | Already in Glisse | Yes | 1 |
| 19 | Switch | An on/off switch, like on iPhone settings | Already in Glisse | Yes | 1 |
| 20 | Calendar | A date picker calendar | New | Web first | 2 |
| 21 | Search Field | A search box with icon + clear button | Already in Glisse | Web first | 1 |
| 22 | Command | The quick-search popup (press a key, type, jump anywhere) | New | Web first | 3 |

### Showing things — cards, pictures, numbers

| # | Component | What it is, in plain words | Glacia status | Phone app? | Wave |
|---|---|---|---|---|---|
| 23 | Card | A glass panel with a title, body, and bottom part | New | Yes | 1 |
| 24 | Avatar | A round photo / initials for a person | New | Yes | 1 |
| 25 | Badge | A small label, e.g. "New" or "Pro" | New | Yes | 1 |
| 26 | Separator | A thin line that divides sections | New | Web first | 1 |
| 27 | Skeleton | A grey shimmer shape shown while content loads | New | Web first | 1 |
| 28 | Spinner | A spinning circle shown while something loads | New | Yes | 1 |
| 29 | Progress | A bar that fills up, e.g. 60% done | New | Yes | 1 |
| 30 | Chart | Bar / line / pie charts | New | Web first | 2 |
| 31 | Carousel | Pictures you swipe through | New | Web first | 3 |
| 32 | Aspect Ratio | A box that keeps its shape (e.g. always 16:9 video) | New | Web first | 3 |
| 33 | Empty | A friendly "nothing here yet" screen | New | Web first | 2 |
| 34 | Item | One row in a list (icon + text + button) | New | Web first | 2 |
| 35 | Kbd | Shows a keyboard key, e.g. `⌘ K` | New | Web only | 3 |
| 36 | Code Block | Shows code with colours, like on the docs site itself | New | Web only | 3 |
| 37 | Marker | A small highlight / pin on text or a map | New | Web first | 3 |

### Popups, menus and floating things

| # | Component | What it is, in plain words | Glacia status | Phone app? | Wave |
|---|---|---|---|---|---|
| 38 | Dialog (Popup) | A popup box in the middle of the screen | New | Web first | 1 |
| 39 | Alert Dialog | A popup that asks "Are you sure?" with Yes / No | New | Web first | 1 |
| 40 | Drawer | A panel that slides in from the side or bottom | New | Web first | 2 |
| 41 | Sheet | A side panel, like a drawer (shadcn keeps both) | New | Web first | 2 |
| 42 | Popover | A small popup attached to a button | New | Web first | 1 |
| 43 | Hover Card | A card that appears when you hover over something | New | Web only | 2 |
| 44 | Dropdown Menu | A menu that drops down from a button | New | Web first | 1 |
| 45 | Context Menu | A menu that appears on right-click | New | Web only | 2 |
| 46 | Menubar | A row of menus at the top, like in an app | New | Web only | 3 |
| 47 | Menu | The iPhone-style pop-out menu (from Glisse) | Already in Glisse | Web first | 1 |
| 48 | Tooltip | A small hint that appears when you hover | New | Web only | 1 |
| 49 | Sonner (Toast) | A small message that pops up at the bottom, e.g. "Saved!" | New | Yes | 1 |
| 50 | Toast | Same idea as Sonner — shadcn keeps both, we ship one first (Sonner) then Toast | New | Web first | 2 |

### Moving around — navigation and layout

| # | Component | What it is, in plain words | Glacia status | Phone app? | Wave |
|---|---|---|---|---|---|
| 51 | Tabs | Tabs to switch between pages/sections | New | Web first | 1 |
| 52 | Segmented Control | A pill with options you slide between (iPhone style) | Already in Glisse | Yes | 1 |
| 53 | Tab Bar | The iPhone bottom bar with icons (from Glisse) | Already in Glisse | Yes | 1 |
| 54 | Breadcrumb | Shows where you are: Home / Settings / Profile | New | Web first | 2 |
| 55 | Navigation Menu | The big menu at the top of a website | New | Web only | 2 |
| 56 | Pagination | Page numbers at the bottom: 1, 2, 3… | New | Web first | 2 |
| 57 | Sidebar | The side menu for a dashboard / app | New | Web first | 1 |
| 58 | Scroll Area | A scrollable area with a pretty scrollbar | New | Web first | 1 |
| 59 | Resizable | Panels you can drag to make bigger / smaller | New | Web only | 3 |
| 60 | Collapsible | A section you can open and close | New | Web first | 2 |
| 61 | Accordion | A list where you open one section at a time | New | Web first | 1 |
| 62 | Table | A table with rows and columns | New | Web first | 1 |
| 63 | Data Table | A table with sorting, searching, and pages — built from Table + more (this is a Block as well, see Part 2) | New | Web first | 2 |

### Chat / AI — shadcn's newer additions (2026)

These are newer shadcn items for AI chat apps. Build them after the everyday ones. Check each one's shadcn docs page before building — they are newer and their exact shape changes faster than the older ones.

| # | Component | What it is, in plain words | Glacia status | Phone app? | Wave |
|---|---|---|---|---|---|
| 64 | Message / Bubble | One chat message, in a bubble | New | Web first | 3 |
| 65 | Message Scroller | The chat list that scrolls to the newest message | New | Web first | 3 |
| 66 | Attachment | Attaching a file / picture to a chat message | New | Web first | 3 |
| 67 | Questionnaire | A chat that asks you questions step by step | New | Web first | 3 |
| 68 | Trace | Shows the steps an AI took (for AI apps) | New | Web only | 3 |

### Small extras in the shadcn list

| # | Component | What it is, in plain words | Glacia status | Phone app? | Wave |
|---|---|---|---|---|---|
| 69 | Direction | Helps the site work right-to-left (Arabic, Hebrew) — a helper, not a visible component | New | Web first | 3 |
| 70 | Glass (primitive) | The glass panel itself — everything else is built from this. Glisse-only, shadcn has no match. This is Glacia's special piece. | Already in Glisse | Yes | 1 |

Count check: 65 shadcn registry items + Text/Typography + Glass primitive + Data Table as its own line = the list above is the comprehensive set. Do not claim a bigger number on the site than what is actually built and working.

---

## Part 2 — Ready-made pages (Blocks): login, dashboard, and more

Components are single pieces. Blocks are whole pages made from those pieces, ready to copy. This is what you asked for with login pages and admin dashboards.

Build these from Glacia components only — never from plain shadcn components, or the page will not look like glass.

### First to build (these are the ones you named)

| Block | What it is | Made from |
|---|---|---|
| Login Page | Sign-in page: email + password, "forgot password", sign in with Google / GitHub buttons. Two styles: centred card, and split screen (picture on one side, form on the other). | Card, Input, Button, Label, Checkbox, Separator |
| Signup Page | Create-account page: name, email, password, agree to terms, sign up with Google / GitHub. | Card, Input, Button, Label, Checkbox |
| Admin Dashboard | The main dashboard: sidebar on the left, top bar, small stat cards (sales, users, orders), a chart, and a data table underneath. | Sidebar, Card, Chart, Data Table, Badge, Button |
| Settings Page | Grouped settings with a save button, and a danger zone at the bottom. | Card, Input, Switch, Select, Button, Separator |
| Profile Page | A person's page: photo, name, details, recent activity. | Avatar, Card, Badge, Button |

### Next

| Block | What it is |
|---|---|
| Sidebar layouts | Different side menus: collapsible, floating, with icons, with search (shadcn's blocks page shows Sidebar as its own section) |
| Calendar Page | A full calendar with events |
| Data Table Page | A full table page with search, sort, and filters |
| Forms Page | A long form page (contact, checkout, onboarding) |
| Pricing Page | Price plans, monthly / yearly switch |
| Landing Page | A simple marketing page (hero + features + footer) in glass |
| Forgot Password / OTP Page | Reset password + the 6-digit code page |
| Error Pages | "Page not found" (404) and "Something went wrong" pages in glass |

Note on shadcn's own blocks: shadcn's blocks page (ui.shadcn.com/blocks) lists Featured, Sidebar, Login, and Signup sections, with dashboard examples built from sidebar + charts + data table. Exact block numbers change as shadcn adds more — check the live blocks page when building each Glacia block, and do not copy shadcn's block numbers into Glacia's docs as if they were Glacia's.

---

## Build order — in waves, so the site is useful early

- **Wave 1 — first (33 items):** Glass, Button, Text, Input, Textarea, Label, Card, Badge, Avatar, Separator, Skeleton, Spinner, Progress, Switch, Slider, Search Field, Checkbox, Radio Group, Select, Tabs, Segmented Control, Tab Bar, Accordion, Dialog, Alert Dialog, Popover, Dropdown Menu, Menu, Tooltip, Sonner, Table, Sidebar, Scroll Area. Plus the Login Page and Admin Dashboard blocks. This is the first version people can actually use.
- **Wave 2 — next (~22 items):** Button Group, Toggle, Input Group, Field, Form, Combobox, Calendar, Chart, Empty, Item, Hover Card, Context Menu, Drawer, Sheet, Toast, Breadcrumb, Navigation Menu, Pagination, Collapsible, Data Table, Native Select, and the Settings + Profile + Signup blocks.
- **Wave 3 — last (~20 items):** Toggle Group, Input OTP, Command, Carousel, Aspect Ratio, Kbd, Code Block, Marker, Menubar, Resizable, Message, Bubble, Message Scroller, Attachment, Questionnaire, Trace, Direction, and the remaining blocks (Calendar Page, Pricing, Landing, Forgot Password / OTP, Error Pages).

Rule: a wave is only done when every item in it is on the site, works in Chrome + Safari + Firefox, and can be copied and used. Do not start Wave 2 with Wave 1 half-finished.

---

## What "done" means for every component on this list

1. It is on the site with a live demo you can click, over a busy photo (so the glass is visible).
2. It looks right and the text is readable in Chrome, Safari, and Firefox.
3. It works with a keyboard, not only a mouse.
4. It has a dark version as well as a light version.
5. It can be installed two ways: `npm install glacia` and through the shadcn-style copy command.
6. If it is marked "Phone app? Yes", it also works in the phone version (real glass on iPhone iOS 26+, plain tint fallback on Android / older iPhones).
