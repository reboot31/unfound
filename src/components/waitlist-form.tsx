"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Intent = "hiring" | "open";

const FIELD =
  "h-12 rounded-none border-0 border-b border-white/20 bg-transparent px-0 text-base text-paper placeholder:text-white/35 shadow-none dark:bg-transparent focus-visible:border-white/70 focus-visible:ring-0 md:text-base";

export function WaitlistForm() {
  const [intent, setIntent] = useState<Intent>("open");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          intent,
          company: form.get("company"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <p className="font-serif text-2xl leading-snug text-paper">
        You&rsquo;re on the list.
        <span className="mt-3 block font-sans text-base text-white/55">
          We open in small batches. You&rsquo;ll hear from a person, not a
          sequence.
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      {/* ponytail: honeypot. Real people never see or fill this. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-px w-px opacity-0"
      />
      <fieldset className="space-y-4">
        <legend className="eyebrow mb-4 text-white/45">
          Which side are you on
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["open", "I'm open to opportunities"],
              ["hiring", "I'm hiring"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="cursor-pointer rounded-sm border border-white/20 px-4 py-4 text-[0.9375rem] text-white/60 transition-colors has-[:checked]:border-white/70 has-[:checked]:text-paper hover:border-white/40"
            >
              <input
                type="radio"
                name="intent"
                value={value}
                checked={intent === value}
                onChange={() => setIntent(value)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="eyebrow text-white/45">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={FIELD}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="eyebrow text-white/45">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={FIELD}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={pending}
          className="h-12 rounded-sm bg-paper px-8 text-[0.9375rem] font-medium text-ink hover:bg-white disabled:opacity-60"
        >
          {pending ? "Sending" : "Request an invitation"}
        </Button>
        <p className="text-sm text-white/45">
          No newsletter. We write when there is something to say.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-white/80">
          {error}
        </p>
      )}
    </form>
  );
}
