import { cookies } from "next/headers";

export const GUEST_COOKIE = "os_guest";

/** Reads the anonymous guest id set by proxy.ts. Every request is guaranteed to have one. */
export async function getGuestId(): Promise<string> {
  const store = await cookies();
  const id = store.get(GUEST_COOKIE)?.value;
  if (!id) throw new Error("Guest cookie missing — proxy.ts should have set it.");
  return id;
}
