import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { READER_PAGES } from "../src/lib/readerPages";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

type BookSeed = {
  title: string;
  author: string;
  badge: string;
  bg: string;
  ink: string;
  accent: string;
  styleIndex: number;
  dimIndex: number;
  reads: number;
  saveCount: number;
  tipCount: number;
  description: string;
};

function b(
  title: string,
  author: string,
  badge: string,
  bg: string,
  ink: string,
  accent: string,
  styleIndex: number,
  dimIndex: number,
  reads: number,
  saveCount: number,
  tipCount: number,
  description: string
): BookSeed {
  return { title, author, badge, bg, ink, accent, styleIndex, dimIndex, reads, saveCount, tipCount, description };
}

const SHELVES: { id: string; label: string; description: string; order: number; books: BookSeed[] }[] = [
  {
    id: "featured",
    label: "Featured",
    description: "Hand-picked by the librarians",
    order: 0,
    books: [
      b("The Quiet Harbor", "Nadia Osei", "Original", "#29524A", "#F0E8D6", "#C9A26B", 0, 0, 12400, 890, 214, "A fishing town learns to keep its secrets after the lighthouse goes dark for exactly one hour — and the sea goes quiet with it."),
      b("Letters from the Interior", "M. J. Whitfield", "Verified", "#6B2F2A", "#F5E4D3", "#D9A05B", 1, 1, 8900, 610, 158, "Twelve years of letters between two sisters, one of whom never left home. A slow correspondence about distance, weather, and what gets said last."),
      b("A Field Guide to Slow Mornings", "Tomas Lindgren", "Free Licensed", "#D8C49A", "#3A2F1B", "#A65A41", 3, 2, 15200, 1300, 0, "Essays on coffee, windows, and doing one thing at a time. Freely licensed by the author for any quiet room."),
      b("The Cartographer's Daughter", "Elena Marsh", "Verified", "#23395B", "#E6E1D3", "#C9A26B", 2, 3, 7100, 540, 96, "She inherited every map her father ever drew — and the one he hid. A story about the places that refuse to be charted."),
      b("Small Rituals", "Priya Raman", "Original", "#C08A3E", "#2E2412", "#FBF6EA", 1, 4, 10800, 970, 187, "Notes on the tiny ceremonies that hold a day together: the first cup, the last light, the walk that goes nowhere on purpose."),
      b("The Glass Orchard", "Samuel Adeyemi", "Verified", "#4A3350", "#EFE2ED", "#C9A26B", 0, 5, 6300, 410, 74, "A family estate, a greenhouse of rare fruit, and a will nobody expected. Three siblings return home to divide what cannot be divided."),
    ],
  },
  {
    id: "new",
    label: "New Arrivals",
    description: "Approved this week",
    order: 1,
    books: [
      b("Notes on Rain", "Harriet Blume", "Original", "#5B7A99", "#F1EEE6", "#C9A26B", 2, 1, 900, 120, 18, "A season of weather diaries from a town where it rains two hundred days a year, and nobody would live anywhere else."),
      b("The Borrowed House", "Ade Bakare", "Verified", "#A65A41", "#F7E9DC", "#3A2F1B", 0, 3, 1400, 210, 32, "A caretaker moves into a house between owners and finds the previous lives still folded into the cupboards."),
      b("The Arithmetic of Birds", "Cecilia Ortiz", "Free Licensed", "#5A5F3C", "#EFEADA", "#C9A26B", 3, 0, 760, 90, 0, "Counting starlings taught her more about crowds than any city did. Field notes from ten years of looking up."),
      b("Midnight Ferry", "Jonas Keller", "Original", "#2E2B28", "#E8E1D2", "#C9A26B", 1, 2, 1100, 160, 26, "The last crossing of the night carries the same seven passengers all winter. None of them will say why."),
      b("The Gardener's Almanac", "Rose Whitcombe", "Free Licensed", "#7D8C6F", "#F2F0E6", "#3A2F1B", 0, 4, 650, 80, 0, "A year in a walled garden, month by month, written for people who kill houseplants and want to stop."),
      b("Paper Boats", "Lena Okafor", "Verified", "#EFE6D2", "#3B3428", "#A65A41", 1, 5, 980, 140, 21, "Short stories set along one river, each one launched from the same bridge, each one landing somewhere new."),
    ],
  },
  {
    id: "mostread",
    label: "Most Read",
    description: "What the town keeps returning to",
    order: 2,
    books: [
      b("How to Read a River", "Whit Emerson", "Original", "#2F4A38", "#EDE8D8", "#C9A26B", 3, 1, 31000, 2400, 412, "Currents, eddies, and the slow art of standing still in moving water. The shelf's most-finished book two years running."),
      b("The Long Table", "Marguerite Deniau", "Verified", "#96432E", "#F6E7DC", "#D9A05B", 0, 0, 27400, 2100, 388, "Forty years of one family's Sunday lunches, told through the chairs that were added and the ones left empty."),
      b("Salt & Season", "Ama Boateng", "Original", "#CBB07E", "#33291A", "#96432E", 1, 3, 24800, 1900, 301, "A cook's memoir in twelve meals, from a coastal kitchen where the menu is whatever the morning boats bring in."),
      b("The Night Librarian", "Theo Brandt", "Verified", "#202B45", "#E4E0D2", "#C9A26B", 2, 2, 22300, 1700, 264, "The library closes at nine. What gets shelved after that is another matter entirely."),
      b("Walking Home", "Ines Duarte", "Free Licensed", "#7B7294", "#F0EDF3", "#33291A", 0, 5, 19600, 1500, 0, "One woman, one coastline, seven hundred kilometres on foot. An account of what falls away when you slow to walking pace."),
      b("Common Threads", "David Achebe", "Original", "#4E6E81", "#EDEFEA", "#C9A26B", 3, 4, 18200, 1400, 229, "Interviews with the tailors, menders, and weavers of one market street, and the century of cloth that passed through their hands."),
    ],
  },
  {
    id: "classics",
    label: "Public Domain Classics",
    description: "Old friends, free forever",
    order: 3,
    books: [
      b("Meditations", "Marcus Aurelius", "Public Domain", "#A99877", "#2F2A20", "#6B2F2A", 0, 2, 45000, 3800, 0, "The private notebook of a Roman emperor: reminders to himself about patience, mortality, and getting out of bed."),
      b("Persuasion", "Jane Austen", "Public Domain", "#7A3B47", "#F2E5D9", "#C9A26B", 2, 0, 38000, 3100, 0, "Eight years after refusing him, Anne Elliot meets Captain Wentworth again. Austen's last and quietest novel."),
      b("Walden", "Henry David Thoreau", "Public Domain", "#3E5641", "#EAE6D4", "#C9A26B", 0, 3, 41000, 3300, 0, "Two years in a cabin by a pond, and the case for living deliberately. Still the shelf's most-bookmarked book."),
      b("The Awakening", "Kate Chopin", "Public Domain", "#55707D", "#EEEAE0", "#C9A26B", 2, 4, 26000, 2000, 0, "A summer on Grand Isle unsettles everything Edna Pontellier thought she had agreed to."),
      b("Sonnets", "William Shakespeare", "Public Domain", "#34302B", "#E4D9BF", "#C9A26B", 0, 5, 52000, 4600, 0, "A hundred and fifty-four poems on love, time, and the strange business of being remembered."),
      b("The Prophet", "Kahlil Gibran", "Public Domain", "#8A6D3B", "#F4EAD6", "#2F2A20", 2, 1, 36000, 2900, 0, "Before leaving the city of Orphalese, Almustafa answers the people's questions — on love, work, joy, and sorrow."),
    ],
  },
];

// Same rotating template used by the prototype so every book launches with a starter guestbook.
const NOTE_TEMPLATES = [
  { name: "A quiet reader", note: "Read this in two sittings by the window. It stays with you.", helpful: 12 },
  { name: "Amara", note: "“We kept the small hours like coins.” Underlining everything.", helpful: 9 },
  { name: "J.", note: "Slow in the best way.", helpful: 5 },
  { name: "Bea", note: "Recommended by a stranger on shelf three. They were right.", helpful: 14 },
  { name: "An old friend", note: "The chapter on winter alone is worth the visit.", helpful: 7 },
  { name: "T. O.", note: "Left a bookmark here so I remember to come back.", helpful: 3 },
];

async function main() {
  await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  let bookId = 1;
  for (const shelf of SHELVES) {
    await db.shelf.upsert({
      where: { id: shelf.id },
      update: { label: shelf.label, description: shelf.description, order: shelf.order },
      create: { id: shelf.id, label: shelf.label, description: shelf.description, order: shelf.order },
    });

    for (let i = 0; i < shelf.books.length; i++) {
      const book = shelf.books[i];
      // Ported from the prototype: one leaning spine per shelf, rotating position.
      const leanIndex = (shelf.order + 2) % 5;
      const created = await db.book.create({
        data: {
          id: bookId,
          shelfId: shelf.id,
          order: i,
          lean: i === leanIndex,
          ...book,
        },
      });

      await db.page.createMany({
        data: READER_PAGES.map((text, index) => ({ bookId: created.id, index, text })),
      });

      await db.note.createMany({
        data: [0, 1, 2].map((i2) => {
          const template = NOTE_TEMPLATES[(created.id + i2 * 2) % NOTE_TEMPLATES.length];
          return { bookId: created.id, name: template.name, note: template.note, helpful: template.helpful };
        }),
      });

      bookId++;
    }
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
