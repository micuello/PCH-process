import { kv } from "@vercel/kv";
import { getDefaultPhases } from "@/lib/defaultData";

export async function PATCH(
  req: Request,
  { params }: { params: { stepId: string; sectionKey: string } }
) {
  try {
    const newSectionData = await req.json();

    let current = await kv.get("pch-process-flow");
    if (!current) {
      current = getDefaultPhases();
    }

    // Update the specific section in the phases array
    const updated = (current as any[]).map((phase) => ({
      ...phase,
      steps: phase.steps.map((step: any) =>
        step.id === params.stepId
          ? {
              ...step,
              sections: {
                ...step.sections,
                [params.sectionKey]: newSectionData,
              },
            }
          : step
      ),
    }));

    await kv.set("pch-process-flow", updated);

    return Response.json({ ok: true, data: updated });
  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}
