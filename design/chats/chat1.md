# OpenShelf Digital Library

_Started 2026-07-03 21:37 UTC_

---

## User

**PRD: OpenShelf Digital Library**

**1. Product Summary**
OpenShelf is a calm digital library where users can read approved books for free, submit books to be reviewed, earn rewards for useful contributions, and receive tips when they are verified as the author/owner. The interface should feel like a real library shelf: books are displayed on actual digital shelves, not ordinary cards.

**2. Core Idea**
Users do not “upload to a database.” They **submit a book to earn a place on the public shelf**. Every book must be reviewed before appearing publicly.

**3. Primary Users**

| User                  | Goal                                                          |
| --------------------- | ------------------------------------------------------------- |
| Reader                | Browse shelves, read books, save books, tip verified authors  |
| Contributor           | Submit books, earn points, build reputation                   |
| Verified Author/Owner | Publish owned books and receive tips                          |
| Admin/Reviewer        | Review submissions, approve books, manage reports and shelves |

**4. MVP Goals**

* Allow anyone to browse and read approved books.
* Allow users to submit books for review.
* Display books on actual digital shelves.
* Add admin review before books go live.
* Add reward points for approved contributions.
* Allow tipping only for verified owners/authors.
* Add guestbook notes/reactions per book.

**5. Main Navigation**

| Nav Item    | Function                                       |
| ----------- | ---------------------------------------------- |
| **Shelf**   | Main digital library view                      |
| **Search**  | Search books, authors, categories              |
| **Submit**  | Upload a book for review                       |
| **Rewards** | Points, badges, contributor ranking            |
| **Profile** | Optional account, uploads, wallet, saved books |

**6. Main Shelf Page Structure**

```text
Floating Top Nav
Hero Intro Text
Search Bar
Library Room / Shelf Area

Shelf 1: Featured Books
Shelf 2: New Arrivals
Shelf 3: Most Read
Shelf 4: Independent Authors
Shelf 5: School Notes & Guides
Shelf 6: Faith & Devotionals
Shelf 7: Public Domain Classics
Shelf 8: Top Tipped Books
```

Each shelf must look like a real shelf row:

* shelf label
* short description
* physical shelf base/line
* standing book covers
* “View All” action
* book count

**7. Book Cover Behaviour**
Default state:

* book cover
* small badge: `Verified`, `Original`, `Public Domain`, `Free Licensed`
* subtle shadow on shelf

Hover/click state:

* book lifts slightly
* title appears
* actions appear: `Read`, `Save`, `Tip`, `Details`

**8. Book Detail Page**
Required sections:

* book cover
* title
* author/contributor
* ownership badge
* description
* shelf/category
* reads, saves, tips count
* `Read Book` button
* `Tip Owner` button, only if tip-eligible
* guestbook notes
* similar books from same shelf
* report button

**9. Reader Page**
The reader should feel like opening a book.

Required features:

* back to shelf
* book title
* page/PDF viewer
* reading progress
* bookmark/save
* leave guestbook note
* tip owner
* report book
* minimal controls, no heavy dashboard UI

**10. Submit Book Flow**
Step 1: Upload

* PDF/EPUB upload
* file size/type validation

Step 2: Book Info

* title
* author
* description
* language
* shelf/category
* cover image

Step 3: Rights & Ownership
User must select one:

* I wrote this book
* I have permission to upload this book
* This book is public domain
* This book is free licensed

Step 4: Submit for Review
Submission status becomes `Under Review`.

**11. Review Statuses**

| Status        | Meaning                          |
| ------------- | -------------------------------- |
| Draft         | Upload started but not submitted |
| Under Review  | Waiting for admin check          |
| Needs Changes | Admin requires edits             |
| Approved      | Book is live on shelf            |
| Rejected      | Book cannot be published         |
| Removed       | Book was taken down after report |

**12. Rewards System**
Rewards should only apply after approval.

| Action                      | Reward       |
| --------------------------- | ------------ |
| Approved book upload        | +50 points   |
| Accurate metadata           | +10 points   |
| Helpful summary             | +10 points   |
| Valid report                | +20 points   |
| Helpful guestbook note      | +5 points    |
| Book reaches read milestone | Bonus points |

Rewards should include:

* points balance
* badges
* contributor level
* leaderboard
* approved uploads count

**13. Tipping System**
Readers can tip only verified authors/owners.

Tip options:

* ₦100
* ₦200
* ₦500
* ₦1,000
* custom amount

Rules:

* public domain books should not receive personal tips
* random uploaded PDFs cannot receive tips
* only verified original/permission-approved books can receive tips
* platform may take a small commission
* minimum payout threshold should exist

**14. Guestbook Feature**
Each book has a guestbook where readers can:

* leave short notes
* add favourite quotes
* write reactions
* mark notes as helpful
* report bad notes

Guestbook entries should be moderated if reported.

**15. Admin Dashboard**
Sidebar:

* Overview
* Pending Books
* Approved Books
* Rejected Books
* Reports
* Contributors
* Tips/Wallet
* Shelves/Categories
* Settings

Admin can:

* preview uploaded file
* check metadata
* verify ownership claim
* approve to shelf
* reject submission
* request changes
* mark as tip-eligible
* remove reported books

**16. Design Direction**

* Real digital shelves, not normal card grids
* Warm off-white background
* Floating top navigation
* Soft shadows
* Minimal typography
* Book covers standing on shelf lines
* Smooth book lift/open animations
* Calm, library-like feeling
* Avoid noisy dashboards or marketplace styling

**17. MVP Pages**

1. Shelf/Home
2. Full Shelf Category Page
3. Book Detail Page
4. Reader Page
5. Submit Book Page
6. Rewards Page
7. Profile/Dashboard
8. Admin Review Dashboard

**18. Success Metrics**

* number of approved books
* number of active readers
* completed reads
* submitted books
* approval rate
* guestbook notes
* tips sent
* repeat contributors
* reports resolved

**19. Key Rule**
No book should appear publicly until reviewed. No user should receive tips unless ownership is verified.


book opening should be like the attached video, entire website strivturte should bne like the attached imnage, admin can be hosted anywhere else as a separate platfoerm

## Assistant

_[tool: list_files]_

_[tool: view_image]_

_[tool: questions_v2]_

## User

Questions answered:
- scope: Reader flow: Home → Book Detail → Reader
- fidelity: Clickable hi-fi prototype (working navigation, hover states, animations)
- book_open: 1 and 2
- shelf_look: Realistic: wood-toned shelf ledge with depth and cast shadows
- covers: Design fictional covers in HTML/CSS (varied spines, colors, type)
- content: Keep it generic/international
- shelf_count: Decide for me
- variations: One strong direction
- platform: Both (responsive)
- reader_format: Paged book spread (two facing pages, page-turn)
- tone: Plain and quiet — minimal microcopy
- video: uploads/video-1783114758390.mov

## Assistant

_[tool: read_skill_prompt]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

Done — `OpenShelf.dc.html` is the full reader flow:

- **Shelf/Home** — floating pill nav, centered search, 4 wood-ledge shelves (24 fictional CSS covers with varied spines/palettes, badges). Hover lifts a book and reveals Read/Details.
- **Book Detail** — large cover on its own ledge, badge, stats, description, Read/Save/Tip (tips disabled on public-domain books), working guestbook (add notes, mark helpful), similar-shelf row, report.
- **Reader** — book swings open + zooms into a two-page spread with page-turn animation, arrow-key nav, progress bar, bookmarking.

Tweaks available: open animation style (swing+zoom / zoom only), reduce motion, show badges.

Next steps when you're ready: Submit flow, Rewards, Profile, full-shelf category page — and the admin dashboard as a separate design.

## User

we need a real shelf like this that shows the book side like how a real shelf works

## Assistant

Real bookcase it is — dark wood frame, back panels, shelf boards, and books spine-out that pull forward on hover. I'll keep a copy of the current version first.

_[tool: copy_files]_

Now rewriting with both changes: real bookcase (spine-out books, wood frame, back panels) and a back-cover ending in the reader.

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

All three changes are in:

- **Real bookcase** — dark espresso wood frame like your photo, shadowed back panels, shelf boards, and books stored **spine-out** with vertical titles (one leaning book per shelf). Hovering pulls a book up and shows a small label card.
- **Preview modal** — clicking a book now "takes it off the shelf": a quick overlay with the front cover, badge, stats, blurb, Read/Save/Tip, and a compact guestbook. Close with ✕, backdrop, or Esc — you never leave the shelf.
- **Back cover at the end** — turning past the last page shows the book's back cover ("The end", blurb, author) with Back to shelf / Leave a note / Tip actions.

The old front-cover version is preserved as `OpenShelf v1 (front covers).dc.html`.

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Fixed both: shelf rows no longer show the white scrollbar (vertical overflow clipped, scrollbar hidden), and long spine titles now stay in a single clean column with an ellipsis instead of clipped fragments.

## User

remove the shelf, search, rewards profilew on the nav

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Done — the nav is now just "Open shelf" and the Submit a book button, matching your wireframe.

## User

make the search on the homepage work

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Search works now — as you type, the bookcase collapses to a single "Search results" shelf matching titles, authors, badges (try "verified"), or shelf names, with a quiet empty-shelf message when nothing matches. Clearing the field brings all shelves back.

## User

there is an element that appears on hover of the elements -- idk what tat is -- remove it

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Removed — that was a hover info card above each book. Now hovering just lifts the book slightly; clicking opens the preview modal.

