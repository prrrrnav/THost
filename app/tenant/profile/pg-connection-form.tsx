"use client"

import { useState, useTransition } from "react"
import { joinPgByCode } from "@/app/actions/profile"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface PgConnectionFormProps {
  currentPgName: string | null
  currentJoiningCode: string | null
}

export function PgConnectionForm({ currentPgName, currentJoiningCode }: PgConnectionFormProps) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ error?: string; pgName?: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setResult(null)
    startTransition(async () => {
      const res = await joinPgByCode(formData)
      setResult(res)
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Currently Connected PG */}
      {currentPgName && (
        <div className="flex items-center gap-3 rounded-xl border border-teal-500/20 bg-teal-500/5 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-400" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-100">{currentPgName}</span>
            {currentJoiningCode && (
              <span className="text-xs text-zinc-500">Code: {currentJoiningCode}</span>
            )}
          </div>
          <span className="ml-auto rounded-full bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold text-teal-400">
            Connected
          </span>
        </div>
      )}

      {/* Connection Code Input */}
      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label
            htmlFor="joiningCode"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            {currentPgName ? "Change PG Connection Code" : "Enter PG Connection Code"}
          </Label>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              id="joiningCode"
              name="joiningCode"
              placeholder="e.g. MRK123"
              className="h-11 border-white/10 bg-zinc-900/50 pl-9 text-zinc-100 uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal focus-visible:ring-teal-500/50"
              style={{ textTransform: "uppercase" }}
              disabled={isPending}
            />
          </div>
          <p className="text-xs text-zinc-600">
            This code is given to you by your PG owner. It connects your account to their PG so you receive their updates.
          </p>
        </div>

        {/* Feedback Messages */}
        {result?.pgName && (
          <div className="flex items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/5 px-4 py-2.5 text-sm text-teal-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Connected to <strong className="font-semibold">{result.pgName}</strong>!
          </div>
        )}
        {result?.error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2.5 text-sm text-rose-400">
            <XCircle className="h-4 w-4 shrink-0" />
            {result.error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="group relative h-11 overflow-hidden rounded-xl bg-teal-600 px-8 text-white transition-all hover:bg-teal-500 hover:shadow-[0_0_20px_-5px_rgba(20,184,166,0.5)] focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50"
          >
            <div className="flex items-center gap-2 font-bold tracking-wide">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  Connect to PG
                </>
              )}
            </div>
          </button>
        </div>
      </form>
    </div>
  )
}
