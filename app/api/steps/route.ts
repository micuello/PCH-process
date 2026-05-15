import { kv } from "@vercel/kv";
import { getDefaultPhases } from "@/lib/defaultData";

export async function GET() {
  try {
    const data = await kv.get("pch-process-flow");
    if (data) {
      return Response.json(data);
    }
  } catch (error) {
    console.error("KV fetch error:", error);
  }

  return Response.json(getDefaultPhases());
}
