import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("bags").select("count").limit(1)

    if (error) {
      return NextResponse.json(
        { status: "degraded", database: "error", timestamp: new Date().toISOString() },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { status: "error", database: "error", timestamp: new Date().toISOString() },
      { status: 503 }
    )
  }
}
