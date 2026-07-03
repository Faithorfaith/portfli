import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { generateSamplePdf } from "./pdf";

const adapter = new PrismaLibSql({ url: `file:${process.cwd()}/prisma/dev.db` });
const prisma = new PrismaClient({ adapter });

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function pdfFor(title: string, author: string, blurb: string) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `seed-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}.pdf`;
  await writeFile(path.join(UPLOAD_DIR, fileName), generateSamplePdf(title, author, blurb));
  return `/uploads/${fileName}`;
}

async function main() {
  console.log("Seeding OpenShelf...");

  await prisma.tip.deleteMany();
  await prisma.report.deleteMany();
  await prisma.guestbookEntry.deleteMany();
  await prisma.savedBook.deleteMany();
  await prisma.rewardLog.deleteMany();
  await prisma.book.deleteMany();
  await prisma.shelf.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: { name: "Admin Reviewer", email: "admin@openshelf.app", role: "ADMIN", isVerified: true, points: 0 },
  });

  const [amara, tunde, chika, funke, reader] = await Promise.all([
    prisma.user.create({
      data: { name: "Amara Nwosu", email: "amara@openshelf.app", isVerified: true, points: 260, earnings: 3200 },
    }),
    prisma.user.create({
      data: { name: "Tunde Bakare", email: "tunde@openshelf.app", isVerified: true, points: 610, earnings: 8800 },
    }),
    prisma.user.create({
      data: { name: "Chika Obi", email: "chika@openshelf.app", isVerified: false, points: 60 },
    }),
    prisma.user.create({
      data: { name: "Funke Adeyemi", email: "funke@openshelf.app", isVerified: true, points: 140, earnings: 1500 },
    }),
    prisma.user.create({
      data: { name: "Demo Reader", email: "reader.demo@openshelf.app", isVerified: false, points: 15 },
    }),
  ]);

  const shelfDefs = [
    { name: "Independent Authors", description: "Original work published directly by the people who wrote it." },
    { name: "School Notes & Guides", description: "Study guides, revision notes, and course companions." },
    { name: "Faith & Devotionals", description: "Devotionals, sermons, and books of reflection." },
    { name: "Public Domain Classics", description: "Timeless works whose copyright has expired." },
    { name: "Fiction & Literature", description: "Novels, short stories, and literary fiction." },
    { name: "Business & Self-Growth", description: "Practical guides for work, money, and personal growth." },
  ];

  const shelves: Record<string, Awaited<ReturnType<typeof prisma.shelf.create>>> = {};
  for (let i = 0; i < shelfDefs.length; i++) {
    const s = shelfDefs[i];
    const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    shelves[s.name] = await prisma.shelf.create({ data: { ...s, slug, order: i } });
  }

  const bookDefs = [
    {
      title: "The Weight of Small Things",
      author: "Amara Nwosu",
      owner: amara,
      shelf: "Independent Authors",
      ownership: "WROTE" as const,
      description: "A quiet novel about a family rebuilding after loss, told over one Lagos harmattan season.",
      reads: 420,
      saves: 58,
      tipEligible: true,
      tips: [500, 1000, 200],
    },
    {
      title: "Letters I Never Sent",
      author: "Tunde Bakare",
      owner: tunde,
      shelf: "Independent Authors",
      ownership: "WROTE" as const,
      description: "A collection of unsent letters exploring grief, ambition, and the roads not taken.",
      reads: 890,
      saves: 130,
      tipEligible: true,
      tips: [1000, 1000, 500, 200, 100],
    },
    {
      title: "Organic Chemistry Made Simple",
      author: "Chika Obi",
      owner: chika,
      shelf: "School Notes & Guides",
      ownership: "WROTE" as const,
      description: "A revision guide covering core reactions and mechanisms for undergraduate chemistry.",
      reads: 610,
      saves: 210,
      tipEligible: false,
      tips: [],
    },
    {
      title: "Mathematics for WAEC: Complete Notes",
      author: "Funke Adeyemi",
      owner: funke,
      shelf: "School Notes & Guides",
      ownership: "WROTE" as const,
      description: "Worked examples and past-question breakdowns for senior secondary mathematics.",
      reads: 1250,
      saves: 340,
      tipEligible: true,
      tips: [200, 200, 100],
    },
    {
      title: "Quiet Mornings With Scripture",
      author: "Funke Adeyemi",
      owner: funke,
      shelf: "Faith & Devotionals",
      ownership: "WROTE" as const,
      description: "Thirty short devotionals for starting the day with stillness and intention.",
      reads: 340,
      saves: 90,
      tipEligible: true,
      tips: [500],
    },
    {
      title: "Parables for the Present Day",
      author: "Tunde Bakare",
      owner: tunde,
      shelf: "Faith & Devotionals",
      ownership: "PERMISSION" as const,
      description: "Modern retellings of familiar parables, adapted with permission from the original sermons.",
      reads: 205,
      saves: 44,
      tipEligible: true,
      tips: [200],
    },
    {
      title: "Meditations",
      author: "Marcus Aurelius",
      owner: admin,
      shelf: "Public Domain Classics",
      ownership: "PUBLIC_DOMAIN" as const,
      description: "The private reflections of a Roman emperor on duty, mortality, and self-discipline.",
      reads: 980,
      saves: 260,
      tipEligible: false,
      tips: [],
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      owner: admin,
      shelf: "Public Domain Classics",
      ownership: "PUBLIC_DOMAIN" as const,
      description: "Wit, romance, and social maneuvering in Regency England.",
      reads: 1490,
      saves: 410,
      tipEligible: false,
      tips: [],
    },
    {
      title: "The Art of War",
      author: "Sun Tzu",
      owner: admin,
      shelf: "Public Domain Classics",
      ownership: "PUBLIC_DOMAIN" as const,
      description: "Ancient strategy still quoted in boardrooms and playbooks today.",
      reads: 720,
      saves: 190,
      tipEligible: false,
      tips: [],
    },
    {
      title: "Harmattan Season",
      author: "Amara Nwosu",
      owner: amara,
      shelf: "Fiction & Literature",
      ownership: "WROTE" as const,
      description: "Three interconnected short stories set during a dusty December in Kano.",
      reads: 150,
      saves: 32,
      tipEligible: true,
      tips: [100],
    },
    {
      title: "Building Without Burning Out",
      author: "Chika Obi",
      owner: chika,
      shelf: "Business & Self-Growth",
      ownership: "WROTE" as const,
      description: "A practical guide to sustainable ambition for early-career founders.",
      reads: 300,
      saves: 70,
      tipEligible: false,
      tips: [],
    },
    {
      title: "The Freelancer's Ledger",
      author: "Funke Adeyemi",
      owner: funke,
      shelf: "Business & Self-Growth",
      ownership: "FREE_LICENSED" as const,
      description: "A Creative Commons-licensed handbook for pricing, invoicing, and client conversations.",
      reads: 95,
      saves: 20,
      tipEligible: false,
      tips: [],
    },
  ];

  const createdBooks: { id: string; title: string; ownerId: string }[] = [];

  for (const def of bookDefs) {
    const fileUrl = await pdfFor(def.title, def.author, def.description);
    const book = await prisma.book.create({
      data: {
        title: def.title,
        authorName: def.author,
        description: def.description,
        shelfId: shelves[def.shelf].id,
        ownershipType: def.ownership,
        status: "APPROVED",
        tipEligible: def.tipEligible,
        reads: def.reads,
        saveCount: def.saves,
        fileUrl,
        fileType: ".pdf",
        submittedById: def.owner.id,
      },
    });
    createdBooks.push({ id: book.id, title: book.title, ownerId: def.owner.id });

    for (const amount of def.tips) {
      const tipper = amount % 2 === 0 ? reader : chika;
      await prisma.tip.create({
        data: { bookId: book.id, fromUserId: tipper.id, toUserId: def.owner.id, amount },
      });
    }
  }

  await prisma.rewardLog.createMany({
    data: [
      { userId: amara.id, action: 'Approved: "The Weight of Small Things"', points: 50 },
      { userId: amara.id, action: 'Approved: "Harmattan Season"', points: 50 },
      { userId: tunde.id, action: 'Approved: "Letters I Never Sent"', points: 50 },
      { userId: tunde.id, action: "Accurate metadata bonus", points: 10 },
      { userId: funke.id, action: 'Approved: "Mathematics for WAEC: Complete Notes"', points: 50 },
      { userId: chika.id, action: 'Approved: "Organic Chemistry Made Simple"', points: 50 },
    ],
  });

  // A couple of pending submissions for the admin queue
  const pendingFile = await pdfFor(
    "Notes on Nigerian Constitutional Law",
    "Chika Obi",
    "An overview of constitutional principles for undergraduate law students."
  );
  await prisma.book.create({
    data: {
      title: "Notes on Nigerian Constitutional Law",
      authorName: "Chika Obi",
      description: "An overview of constitutional principles for undergraduate law students.",
      shelfId: shelves["School Notes & Guides"].id,
      ownershipType: "WROTE",
      status: "UNDER_REVIEW",
      fileUrl: pendingFile,
      fileType: ".pdf",
      submittedById: chika.id,
    },
  });

  const changesFile = await pdfFor(
    "Fragments of Faith",
    "Funke Adeyemi",
    "A short devotional collection awaiting a clearer description from the author."
  );
  await prisma.book.create({
    data: {
      title: "Fragments of Faith",
      authorName: "Funke Adeyemi",
      description: "TBD",
      shelfId: shelves["Faith & Devotionals"].id,
      ownershipType: "WROTE",
      status: "NEEDS_CHANGES",
      reviewNote: "Please expand the description and confirm this doesn't duplicate an earlier submission.",
      fileUrl: changesFile,
      fileType: ".pdf",
      submittedById: funke.id,
    },
  });

  const rejectedFile = await pdfFor("Untitled Draft", "Anonymous", "A rough draft with unclear ownership.");
  await prisma.book.create({
    data: {
      title: "Untitled Draft",
      authorName: "Anonymous",
      description: "A rough draft with unclear ownership.",
      shelfId: shelves["Fiction & Literature"].id,
      ownershipType: "PERMISSION",
      status: "REJECTED",
      reviewNote: "No evidence of permission from the rights holder. Please provide documentation and resubmit.",
      fileUrl: rejectedFile,
      fileType: ".pdf",
      submittedById: reader.id,
    },
  });

  // Guestbook entries
  const featured = createdBooks[1];
  await prisma.guestbookEntry.createMany({
    data: [
      { bookId: featured.id, userId: reader.id, note: "This collection stayed with me for days.", type: "note", helpfulCount: 6, rewarded: true },
      { bookId: featured.id, userId: chika.id, note: "“Some doors close so quietly you don't hear it happen.”", type: "quote", helpfulCount: 2 },
    ],
  });

  // An open + a resolved report
  const rejectedDraft = await prisma.book.findFirst({ where: { title: "Untitled Draft" } });
  if (rejectedDraft) {
    await prisma.report.create({
      data: {
        targetType: "book",
        targetId: rejectedDraft.id,
        bookId: rejectedDraft.id,
        reason: "This looks like it was copied from another site without credit.",
        reportedById: amara.id,
        status: "open",
      },
    });
  }
  await prisma.report.create({
    data: {
      targetType: "book",
      targetId: createdBooks[0].id,
      bookId: createdBooks[0].id,
      reason: "Cover image seems unrelated to the book.",
      reportedById: reader.id,
      status: "resolved",
    },
  });

  console.log(`Seeded ${createdBooks.length + 3} books, ${Object.keys(shelves).length} shelves, 6 users.`);
  console.log("Sign in as admin: admin@openshelf.app (or use the 'Continue as admin' demo button).");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
