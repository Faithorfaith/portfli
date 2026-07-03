import { signIn, demoSignIn } from "@/lib/actions/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="mb-2 text-xs tracking-[0.2em] text-ink-muted uppercase">
        Welcome to OpenShelf
      </p>
      <h1 className="font-display text-3xl">Sign in to your reading desk</h1>
      <p className="mt-3 text-sm text-ink-muted">
        No password needed for this preview build — just tell us who you are.
        We&apos;ll remember you on this device.
      </p>

      <form action={signIn} className="mt-8 space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            name="name"
            required
            placeholder="Ada Lovelace"
            className="w-full rounded-lg border border-shelf-line bg-paper-raised px-4 py-2.5 outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="ada@example.com"
            className="w-full rounded-lg border border-shelf-line bg-paper-raised px-4 py-2.5 outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-accent py-2.5 font-medium text-paper-raised transition hover:bg-accent-hover"
        >
          Enter the library
        </button>
      </form>

      <div className="mt-8 border-t border-shelf-line pt-6">
        <p className="mb-3 text-xs tracking-[0.15em] text-ink-muted uppercase">
          Quick demo access
        </p>
        <div className="flex gap-3">
          <form action={demoSignIn.bind(null, "READER")} className="flex-1">
            <button className="w-full rounded-lg border border-shelf-line bg-paper-raised py-2 text-sm hover:border-accent">
              Continue as reader
            </button>
          </form>
          <form action={demoSignIn.bind(null, "ADMIN")} className="flex-1">
            <button className="w-full rounded-lg border border-shelf-line bg-paper-raised py-2 text-sm hover:border-accent">
              Continue as admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
