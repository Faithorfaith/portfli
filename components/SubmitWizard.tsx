"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileUp, Image as ImageIcon } from "lucide-react";
import { uploadBookFile, uploadCoverImage } from "@/lib/actions/upload";
import { submitBook } from "@/lib/actions/books";
import { OWNERSHIP_LABEL } from "@/lib/format";

type Shelf = { id: string; name: string };

const OWNERSHIP_OPTIONS: { value: keyof typeof OWNERSHIP_LABEL; hint: string }[] = [
  { value: "WROTE", hint: "You are the original author of this work." },
  { value: "PERMISSION", hint: "The author or rights holder gave you permission to upload it." },
  { value: "PUBLIC_DOMAIN", hint: "Copyright has expired or was never claimed." },
  { value: "FREE_LICENSED", hint: "Distributed under a license like Creative Commons." },
];

const STEPS = ["Upload", "Book Info", "Rights & Ownership", "Submit"];

export default function SubmitWizard({ shelves }: { shelves: Shelf[] }) {
  const [step, setStep] = useState(0);
  const [fileState, uploadFileAction, filePending] = useActionState(uploadBookFile, {});
  const [coverState, uploadCoverAction, coverPending] = useActionState(uploadCoverImage, {});
  const [submitState, submitAction, submitPending] = useActionState(submitBook, {});

  const [form, setForm] = useState({
    title: "",
    authorName: "",
    description: "",
    language: "English",
    shelfId: shelves[0]?.id ?? "",
    ownershipType: "" as string,
  });
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  if (fileState.url && fileUrl !== fileState.url) {
    setFileUrl(fileState.url);
    setFileName(fileState.fileName ?? null);
  }
  if (coverState.url && coverUrl !== coverState.url) {
    setCoverUrl(coverState.url);
  }

  if (submitState.bookId) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-verified" />
        <h1 className="font-display text-2xl">Submitted for review</h1>
        <p className="mt-3 text-ink-muted">
          Your book&apos;s status is now <strong>Under Review</strong>. Our reviewers check every
          submission before it goes live — you&apos;ll earn 50 points the moment it&apos;s approved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/profile" className="rounded-full bg-accent px-5 py-2.5 text-paper-raised hover:bg-accent-hover">
            View in profile
          </Link>
          <Link href="/" className="rounded-full border border-shelf-line px-5 py-2.5 hover:border-accent">
            Back to shelf
          </Link>
        </div>
      </div>
    );
  }

  const canGoStep1 = Boolean(fileUrl);
  const canGoStep2 =
    form.title.trim() && form.authorName.trim() && form.description.trim() && form.shelfId;
  const canGoStep3 = Boolean(form.ownershipType);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display mb-2 text-3xl">Submit a book</h1>
      <p className="mb-8 text-ink-muted">
        Every submission earns a place on the shelf only after review — this keeps OpenShelf calm
        and trustworthy for readers.
      </p>

      <ol className="mb-10 flex items-center gap-2 text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                i === step
                  ? "border-accent bg-accent text-paper-raised"
                  : i < step
                    ? "border-verified bg-verified text-paper-raised"
                    : "border-shelf-line text-ink-muted"
              }`}
            >
              {i + 1}
            </span>
            <span className={i === step ? "text-ink" : "text-ink-muted"}>{label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-shelf-line" />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-dashed border-shelf-line bg-paper-raised p-8 text-center">
            <FileUp className="mx-auto mb-3 h-8 w-8 text-ink-muted" />
            <p className="mb-4 text-sm text-ink-muted">Upload your manuscript as a PDF or EPUB (max 30MB).</p>
            <form action={uploadFileAction} className="flex flex-col items-center gap-3">
              <input
                type="file"
                name="file"
                accept=".pdf,.epub"
                required
                className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-1.5 file:text-paper-raised"
              />
              <button
                type="submit"
                disabled={filePending}
                className="rounded-full border border-shelf-line px-4 py-1.5 text-sm hover:border-accent disabled:opacity-60"
              >
                {filePending ? "Uploading…" : "Upload file"}
              </button>
            </form>
            {fileState.error && <p className="mt-2 text-sm text-accent">{fileState.error}</p>}
            {fileUrl && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-verified">
                <CheckCircle2 className="h-4 w-4" /> Uploaded {fileName}
              </p>
            )}
          </div>
          <StepNav onNext={() => setStep(1)} nextDisabled={!canGoStep1} />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Author">
            <input
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Language">
              <input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Shelf / Category">
              <select
                value={form.shelfId}
                onChange={(e) => setForm({ ...form, shelfId: e.target.value })}
                className="input"
              >
                {shelves.map((shelf) => (
                  <option key={shelf.id} value={shelf.id}>
                    {shelf.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="rounded-xl border border-dashed border-shelf-line bg-paper-raised p-4">
            <p className="mb-2 flex items-center gap-1.5 text-sm text-ink-muted">
              <ImageIcon className="h-4 w-4" /> Cover image (optional — we&apos;ll generate one if you skip this)
            </p>
            <form action={uploadCoverAction} className="flex items-center gap-3">
              <input type="file" name="file" accept=".jpg,.jpeg,.png,.webp" className="text-sm" />
              <button
                type="submit"
                disabled={coverPending}
                className="shrink-0 rounded-full border border-shelf-line px-3 py-1 text-xs hover:border-accent disabled:opacity-60"
              >
                {coverPending ? "Uploading…" : "Upload cover"}
              </button>
            </form>
            {coverState.error && <p className="mt-2 text-sm text-accent">{coverState.error}</p>}
            {coverUrl && <p className="mt-2 text-sm text-verified">Cover uploaded</p>}
          </div>

          <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!canGoStep2} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          {OWNERSHIP_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`block cursor-pointer rounded-xl border p-4 ${
                form.ownershipType === option.value ? "border-accent bg-accent/5" : "border-shelf-line"
              }`}
            >
              <input
                type="radio"
                name="ownershipType"
                value={option.value}
                className="mr-2"
                checked={form.ownershipType === option.value}
                onChange={() => setForm({ ...form, ownershipType: option.value })}
              />
              <span className="font-medium">{OWNERSHIP_LABEL[option.value]}</span>
              <p className="mt-1 ml-6 text-sm text-ink-muted">{option.hint}</p>
            </label>
          ))}
          <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} nextDisabled={!canGoStep3} />
        </div>
      )}

      {step === 3 && (
        <form action={submitAction} className="space-y-4">
          <input type="hidden" name="title" value={form.title} />
          <input type="hidden" name="authorName" value={form.authorName} />
          <input type="hidden" name="description" value={form.description} />
          <input type="hidden" name="language" value={form.language} />
          <input type="hidden" name="shelfId" value={form.shelfId} />
          <input type="hidden" name="ownershipType" value={form.ownershipType} />
          <input type="hidden" name="fileUrl" value={fileUrl ?? ""} />
          <input type="hidden" name="coverUrl" value={coverUrl ?? ""} />

          <div className="rounded-xl border border-shelf-line bg-paper-raised p-5">
            <h3 className="font-display mb-3 text-lg">Review your submission</h3>
            <dl className="space-y-1.5 text-sm">
              <Row label="Title" value={form.title} />
              <Row label="Author" value={form.authorName} />
              <Row label="Language" value={form.language} />
              <Row label="Shelf" value={shelves.find((s) => s.id === form.shelfId)?.name ?? ""} />
              <Row label="Ownership" value={OWNERSHIP_LABEL[form.ownershipType]} />
              <Row label="File" value={fileName ?? "—"} />
            </dl>
          </div>

          {submitState.error && <p className="text-sm text-accent">{submitState.error}</p>}

          <StepNav
            onBack={() => setStep(2)}
            nextLabel={submitPending ? "Submitting…" : "Submit for review"}
            nextType="submit"
            nextDisabled={submitPending}
          />
        </form>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--shelf-line);
          background: var(--paper);
          padding: 0.55rem 0.9rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
  nextType = "button",
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  nextType?: "button" | "submit";
}) {
  return (
    <div className="flex justify-between pt-2">
      {onBack ? (
        <button type="button" onClick={onBack} className="rounded-full border border-shelf-line px-4 py-2 text-sm hover:border-accent">
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type={nextType}
        onClick={onNext}
        disabled={nextDisabled}
        className="rounded-full bg-accent px-5 py-2 text-sm text-paper-raised hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {nextLabel}
      </button>
    </div>
  );
}
