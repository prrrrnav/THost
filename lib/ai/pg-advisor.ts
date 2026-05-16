export type PgPropertyInput = {
  id: string
  name?: string | null
  total_beds?: number | null
}

export type TenantInput = {
  id?: string
  rent_amount?: number | null
  status?: string | null
  pg_id?: string | null
  created_at?: string | null
}

export type ExpenseInput = {
  amount?: number | null
  category?: string | null
  expense_date?: string | null
}

export type ComplaintInput = {
  status?: string | null
  created_at?: string | null
}

type BenchmarkPg = {
  city: string
  beds: number
  occupancyRate: number
  avgRent: number
  monthlyExpenses: number
  leadCount: number
  bookingCount: number
  reviewRating: number
  reviewCount: number
  responseMinutes: number
  collectionRate: number
  listingScore: number
  referralShare: number
  profitMargin: number
  practices: string[]
}

export type AdvisorPayload = {
  ownerSnapshot: {
    propertyCount: number
    totalBeds: number
    occupiedBeds: number
    occupancyRate: number
    avgRent: number
    monthlyRevenue: number
    monthlyExpenses: number
    monthlyProfit: number
    profitMargin: number
    paidTenants: number
    pendingTenants: number
    overdueTenants: number
    overdueRentAtRisk: number
    topExpenseCategories: { category: string; amount: number }[]
    complaintCount: number
    unresolvedComplaintCount: number
  }
  benchmarkSummary: ReturnType<typeof analyzeBenchmarkData>
}

const cityRentBase: Record<string, number> = {
  Bengaluru: 11500,
  Pune: 9800,
  Hyderabad: 9500,
  Chennai: 9000,
  Mumbai: 14500,
  Delhi: 10500,
  Gurgaon: 12500,
  Noida: 9200,
}

const practicePool = [
  "reply to every lead within 10 minutes",
  "keep Google Business Profile photos fresh",
  "publish room videos and transparent pricing",
  "ask happy tenants for reviews after issue resolution",
  "track food feedback weekly",
  "offer referral rewards",
  "separate recurring and one-time expenses",
  "inspect bathrooms and Wi-Fi every week",
  "collect rent digitally before the due date",
  "show occupancy and availability clearly",
  "bundle laundry or meals for higher ARPU",
  "resolve complaints within 24 hours",
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function round(value: number, digits = 0) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function generateBenchmarkPgData(): BenchmarkPg[] {
  const cities = Object.keys(cityRentBase)

  return Array.from({ length: 128 }, (_, index) => {
    const city = cities[index % cities.length]
    const beds = 18 + ((index * 7) % 83)
    const operatorQuality = ((index * 17) % 100) / 100
    const listingScore = round(clamp(52 + operatorQuality * 41 + ((index % 5) - 2) * 2, 45, 98), 1)
    const responseMinutes = Math.round(clamp(55 - operatorQuality * 48 + (index % 7), 3, 65))
    const reviewRating = round(clamp(3.4 + operatorQuality * 1.35 + ((index % 6) - 2) * 0.04, 3.2, 4.9), 1)
    const reviewCount = Math.round(clamp(12 + beds * 0.8 + operatorQuality * 105 + (index % 9) * 3, 8, 230))
    const leadCount = Math.round(clamp(beds * (1.2 + operatorQuality * 2.2) + (listingScore - 50) * 1.1, 20, 380))
    const conversionRate = clamp(0.16 + operatorQuality * 0.22 + (reviewRating - 4) * 0.05, 0.12, 0.48)
    const bookingCount = Math.round(leadCount * conversionRate)
    const occupancyRate = round(clamp(0.58 + operatorQuality * 0.35 + reviewRating * 0.012, 0.55, 0.98), 3)
    const avgRent = Math.round(cityRentBase[city] * (0.9 + operatorQuality * 0.22 + ((index % 4) - 1) * 0.025))
    const revenue = beds * occupancyRate * avgRent
    const monthlyExpenses = Math.round(revenue * clamp(0.38 - operatorQuality * 0.12 + (index % 6) * 0.01, 0.24, 0.48))
    const profitMargin = round((revenue - monthlyExpenses) / revenue, 3)
    const collectionRate = round(clamp(0.82 + operatorQuality * 0.16, 0.8, 0.995), 3)
    const referralShare = round(clamp(0.04 + operatorQuality * 0.2, 0.03, 0.28), 3)
    const start = index % practicePool.length

    return {
      city,
      beds,
      occupancyRate,
      avgRent,
      monthlyExpenses,
      leadCount,
      bookingCount,
      reviewRating,
      reviewCount,
      responseMinutes,
      collectionRate,
      listingScore,
      referralShare,
      profitMargin,
      practices: [
        practicePool[start],
        practicePool[(start + 3) % practicePool.length],
        practicePool[(start + 7) % practicePool.length],
      ],
    }
  })
}

export function analyzeBenchmarkData(data = generateBenchmarkPgData()) {
  const ranked = [...data].sort((a, b) => b.profitMargin - a.profitMargin)
  const topQuartile = ranked.slice(0, Math.ceil(ranked.length / 4))
  const average = (items: BenchmarkPg[], key: keyof BenchmarkPg) =>
    round(items.reduce((sum, item) => sum + Number(item[key]), 0) / items.length, 2)

  const practiceCounts = new Map<string, number>()
  topQuartile.forEach((pg) => {
    pg.practices.forEach((practice) => {
      practiceCounts.set(practice, (practiceCounts.get(practice) || 0) + 1)
    })
  })

  return {
    sampleSize: data.length,
    topQuartileAverages: {
      occupancyRate: average(topQuartile, "occupancyRate"),
      avgRent: average(topQuartile, "avgRent"),
      reviewRating: average(topQuartile, "reviewRating"),
      responseMinutes: average(topQuartile, "responseMinutes"),
      listingScore: average(topQuartile, "listingScore"),
      collectionRate: average(topQuartile, "collectionRate"),
      referralShare: average(topQuartile, "referralShare"),
      profitMargin: average(topQuartile, "profitMargin"),
    },
    commonGrowthPractices: [...practiceCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([practice]) => practice),
    cityBenchmarks: Object.keys(cityRentBase).map((city) => {
      const cityItems = data.filter((pg) => pg.city === city)
      return {
        city,
        avgRent: average(cityItems, "avgRent"),
        occupancyRate: average(cityItems, "occupancyRate"),
        reviewRating: average(cityItems, "reviewRating"),
        profitMargin: average(cityItems, "profitMargin"),
      }
    }),
  }
}

export function buildAdvisorPayload(input: {
  properties: PgPropertyInput[]
  tenants: TenantInput[]
  expenses: ExpenseInput[]
  complaints?: ComplaintInput[]
}): AdvisorPayload {
  const totalBeds = input.properties.reduce((sum, pg) => sum + Number(pg.total_beds || 0), 0)
  const occupiedBeds = input.tenants.length
  const monthlyRevenue = input.tenants.reduce((sum, tenant) => sum + Number(tenant.rent_amount || 0), 0)
  const monthlyExpenses = input.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const monthlyProfit = monthlyRevenue - monthlyExpenses
  const statusCounts = input.tenants.reduce(
    (counts, tenant) => {
      const status = (tenant.status || "Pending").toLowerCase()
      if (status === "paid") counts.paid += 1
      else if (status === "overdue") counts.overdue += 1
      else counts.pending += 1
      return counts
    },
    { paid: 0, pending: 0, overdue: 0 },
  )
  const expensesByCategory = new Map<string, number>()
  input.expenses.forEach((expense) => {
    const category = expense.category || "Other"
    expensesByCategory.set(category, (expensesByCategory.get(category) || 0) + Number(expense.amount || 0))
  })
  const unresolvedComplaintCount = (input.complaints || []).filter((complaint) => {
    const status = (complaint.status || "Pending").toLowerCase()
    return status !== "resolved" && status !== "closed"
  }).length
  const capacityBase = totalBeds > 0 ? totalBeds : Math.max(occupiedBeds, 1)

  return {
    ownerSnapshot: {
      propertyCount: input.properties.length,
      totalBeds,
      occupiedBeds,
      occupancyRate: round(occupiedBeds / capacityBase, 3),
      avgRent: occupiedBeds ? Math.round(monthlyRevenue / occupiedBeds) : 0,
      monthlyRevenue,
      monthlyExpenses,
      monthlyProfit,
      profitMargin: monthlyRevenue > 0 ? round(monthlyProfit / monthlyRevenue, 3) : 0,
      paidTenants: statusCounts.paid,
      pendingTenants: statusCounts.pending,
      overdueTenants: statusCounts.overdue,
      overdueRentAtRisk: input.tenants
        .filter((tenant) => (tenant.status || "").toLowerCase() === "overdue")
        .reduce((sum, tenant) => sum + Number(tenant.rent_amount || 0), 0),
      topExpenseCategories: [...expensesByCategory.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([category, amount]) => ({ category, amount })),
      complaintCount: input.complaints?.length || 0,
      unresolvedComplaintCount,
    },
    benchmarkSummary: analyzeBenchmarkData(),
  }
}

export function buildGroqMessages(question: string, payload: AdvisorPayload) {
  return [
    {
      role: "system",
      content:
        "You are an AI growth advisor for Indian PG and hostel owners. Give practical, numeric, owner-friendly advice to increase traffic, bookings, reviews, revenue, and profit. Use only the provided owner metrics and benchmark summary. Do not invent exact facts that are not present. Format with short sections and prioritized actions.",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          question,
          ownerMetrics: payload.ownerSnapshot,
          benchmarkDataSummary: payload.benchmarkSummary,
          requestedOutput:
            "Answer as a PG business advisor. Include diagnosis, top opportunities, next 7 day actions, next 30 day actions, review strategy, booking strategy, and profit levers.",
        },
        null,
        2,
      ),
    },
  ]
}

export function getLocalAdvisorAnswer(question: string, payload: AdvisorPayload) {
  const owner = payload.ownerSnapshot
  const benchmark = payload.benchmarkSummary.topQuartileAverages
  const gaps = [
    owner.occupancyRate < benchmark.occupancyRate
      ? `Occupancy is ${round(owner.occupancyRate * 100, 1)}%, below the top benchmark of ${round(benchmark.occupancyRate * 100, 1)}%.`
      : `Occupancy is near strong-operator range at ${round(owner.occupancyRate * 100, 1)}%.`,
    owner.profitMargin < benchmark.profitMargin
      ? `Profit margin is ${round(owner.profitMargin * 100, 1)}%, below the top benchmark of ${round(benchmark.profitMargin * 100, 1)}%.`
      : `Profit margin is healthy at ${round(owner.profitMargin * 100, 1)}%.`,
    owner.overdueTenants > 0
      ? `${owner.overdueTenants} tenants are overdue, putting Rs ${owner.overdueRentAtRisk.toLocaleString("en-IN")} at risk.`
      : "No overdue tenants are visible in the current snapshot.",
  ]

  return `AI Advisor\n\nQuestion: ${question}\n\nDiagnosis\n${gaps.map((gap) => `- ${gap}`).join("\n")}\n\nBest growth practices from ${payload.benchmarkSummary.sampleSize} benchmark PGs\n${payload.benchmarkSummary.commonGrowthPractices
    .slice(0, 5)
    .map((practice) => `- ${practice}`)
    .join("\n")}\n\nNext 7 days\n- Update Google Business Profile, PG listing photos, room videos, pricing, facilities, food photos, and live vacancy.\n- Reply to every inquiry within 10 minutes and keep a simple lead sheet with source, budget, visit date, and close status.\n- Ask the 5 happiest tenants for a Google review after you solve a small request for them.\n- Call overdue tenants and offer a clear payment date instead of waiting until month end.\n\nNext 30 days\n- Raise traffic with referral rewards, local college/office WhatsApp groups, broker follow-up, and weekly listing refreshes.\n- Improve booking conversion with video tours, transparent deposit rules, same-day visit slots, and clear room-wise pricing.\n- Protect profit by reviewing the top expense category first: ${owner.topExpenseCategories[0]?.category || "no expense category found"}.\n- Track three numbers weekly: occupancy, lead-to-booking conversion, and review rating.`
}
