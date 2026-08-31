"use client";

import { useState, useTransition, type FormEvent } from "react";
import {
  registerDelegates,
  type DelegateRegistrationState,
} from "@/app/delegates/register/actions";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";
import type { DelegateEntryInput } from "@/lib/validation/delegate";

const emptyDelegate: DelegateEntryInput = {
  name: "",
  email: "",
  delegateType: "present",
};

export function DelegateRegistrationForm() {
  const [churchName, setChurchName] = useState("");
  const [cityState, setCityState] = useState("");
  const [pastorName, setPastorName] = useState("");
  const [youthLeaderName, setYouthLeaderName] = useState("");
  const [registeredByName, setRegisteredByName] = useState("");
  const [registeredByEmail, setRegisteredByEmail] = useState("");
  const [delegates, setDelegates] = useState<DelegateEntryInput[]>([{ ...emptyDelegate }]);
  const [result, setResult] = useState<DelegateRegistrationState | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateDelegate(index: number, patch: Partial<DelegateEntryInput>) {
    setDelegates((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  function addDelegate() {
    setDelegates((prev) => [...prev, { ...emptyDelegate }]);
  }

  function removeDelegate(index: number) {
    setDelegates((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const res = await registerDelegates({
        churchName,
        cityState,
        pastorName,
        youthLeaderName,
        registeredByName,
        registeredByEmail,
        delegates,
      });
      setResult(res);
    });
  }

  if (result?.status === "success") {
    return <Banner tone="success">{result.message}</Banner>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {result?.status === "error" && <Banner tone="error">{result.message}</Banner>}

      <fieldset className="space-y-4">
        <legend className="mb-1 font-semibold text-ink">Church information</legend>
        <div>
          <Label htmlFor="churchName">Church name</Label>
          <Input
            id="churchName"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="cityState">City, State</Label>
          <Input
            id="cityState"
            value={cityState}
            onChange={(e) => setCityState(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="pastorName">Pastor&apos;s name</Label>
          <Input
            id="pastorName"
            value={pastorName}
            onChange={(e) => setPastorName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="youthLeaderName">Youth leader&apos;s name</Label>
          <Input
            id="youthLeaderName"
            value={youthLeaderName}
            onChange={(e) => setYouthLeaderName(e.target.value)}
            required
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 font-semibold text-ink">Submitted by</legend>
        <div>
          <Label htmlFor="registeredByName">Your name</Label>
          <Input
            id="registeredByName"
            value={registeredByName}
            onChange={(e) => setRegisteredByName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="registeredByEmail">Your email</Label>
          <Input
            id="registeredByEmail"
            type="email"
            value={registeredByEmail}
            onChange={(e) => setRegisteredByEmail(e.target.value)}
            required
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 font-semibold text-ink">Delegates</legend>
        <div className="space-y-3">
          {delegates.map((delegate, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 rounded-md border border-hairline p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
            >
              <Input
                placeholder="Full name"
                value={delegate.name}
                onChange={(e) => updateDelegate(index, { name: e.target.value })}
                required
              />
              <Input
                placeholder="Email"
                type="email"
                value={delegate.email}
                onChange={(e) => updateDelegate(index, { email: e.target.value })}
                required
              />
              <select
                value={delegate.delegateType}
                onChange={(e) =>
                  updateDelegate(index, {
                    delegateType: e.target.value as "present" | "absentee",
                  })
                }
                className="rounded-md border border-hairline bg-surface text-ink px-2 py-2 text-sm"
              >
                <option value="present">Present</option>
                <option value="absentee">Absentee</option>
              </select>
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeDelegate(index)}
                disabled={delegates.length === 1}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" onClick={addDelegate}>
          Add another delegate
        </Button>
      </fieldset>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit delegates"}
      </Button>
    </form>
  );
}
