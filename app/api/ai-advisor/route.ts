import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  buildAdvisorPayload,
  buildGroqMessages,
  getLocalAdvisorAnswer,
  type ComplaintInput,
  type ExpenseInput,
  type PgPropertyInput,
  type TenantInput,
} from "@/lib/ai/pg-advisor"

export const runtime = "nodejs"

async function fetchOwnedProperties(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const withCapacity = await supabase
    .from("pg_details")
    .select("id, name, total_beds")
    .eq("owner_id", userId)

  if (!withCapacity.error) {
    return (withCapacity.data || []) as PgPropertyInput[]
  }

  const basic = await supabase
    .from("pg_details")
    .select("id, name")
    .eq("owner_id", userId)

  return (basic.data || []).map((pg) => ({ ...pg, total_beds: 0 })) as PgPropertyInput[]
}

async function fetchTenants(
  supabase: Awaited<ReturnType<typeof createClient>>,
  propertyIds: string[],
) {
  if (propertyIds.length > 0) {
    const ownedTenantResult = await supabase
      .from("tenants")
      .select("id, rent_amount, status, pg_id, created_at")
      .in("pg_id", propertyIds)
      .limit(300)

    if (!ownedTenantResult.error) {
      return (ownedTenantResult.data || []) as TenantInput[]
    }
  }

  const fallbackTenantResult = await supabase
    .from("tenants")
    .select("id, rent_amount, status, pg_id, created_at")
    .limit(300)

  return (fallbackTenantResult.data || []) as TenantInput[]
}

async function callGroq(question: string, payload: ReturnType<typeof buildAdvisorPayload>) {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  const model = process.env.GROQ_MODEL || process.env.AI_MODEL || "llama-3.3-70b-versatile"

  if (!apiKey) {
    return {
      answer: getLocalAdvisorAnswer(question, payload),
      source: "Local benchmark advisor",
      model: "local-fallback",
      missingApiKey: true,
    }
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: buildGroqMessages(question, payload),
      temperature: 0.35,
      max_completion_tokens: 1200,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Groq API error:", response.status, errorText)

    return {
      answer: getLocalAdvisorAnswer(question, payload),
      source: "Groq failed, local fallback shown",
      model: "local-fallback",
      groqError: errorText.slice(0, 600),
      groqStatus: response.status,
      usedFallback: true,
    }
  }

  const data = await response.json()
  const answer = data?.choices?.[0]?.message?.content

  return {
    answer: answer || getLocalAdvisorAnswer(question, payload),
    source: answer ? "Groq" : "Local benchmark advisor",
    model: answer ? model : "local-fallback",
    usedFallback: !answer,
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 },
      )
    }

    const body = await request.json().catch(() => ({}))
    const question =
      typeof body.question === "string" && body.question.trim().length > 0
        ? body.question.trim()
        : "How can this PG get more traffic, bookings, good customer reviews, revenue, and profit?"

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const properties = await fetchOwnedProperties(supabase, user.id)
    const propertyIds = properties.map((property) => property.id)
    const tenants = await fetchTenants(supabase, propertyIds)

    const [{ data: expenses }, { data: complaints }] = await Promise.all([
      supabase
        .from("expenses")
        .select("amount, category, expense_date")
        .limit(300),
      supabase
        .from("complaints")
        .select("status, created_at")
        .limit(200),
    ])

    const payload = buildAdvisorPayload({
      properties,
      tenants,
      expenses: (expenses || []) as ExpenseInput[],
      complaints: (complaints || []) as ComplaintInput[],
    })
    const result = await callGroq(question, payload)

    return NextResponse.json({
      ...result,
      snapshot: payload.ownerSnapshot,
      benchmarkSampleSize: payload.benchmarkSummary.sampleSize,
    })
  } catch (error) {
    console.error("AI advisor error:", error)
    return NextResponse.json(
      { error: "AI advisor failed to generate advice." },
      { status: 500 },
    )
  }
}
