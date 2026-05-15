"use client";

import { useState } from "react";

const phases = [
  {
    id: "forecast",
    title: "Phase 1 — Forecasting",
    color: "#0F6E56",
    bgColor: "#E1F5EE",
    steps: [
      {
        id: "f1",
        actor: "PCH",
        actorColor: "#D85A30",
        title: "Share forecast",
        detail: "PCH sends demand forecast to CSA TH",
        sections: {
          input: {
            description: "PCH sends the following forecast data",
            dataElements: [
              { name: "Origin country", description: "Always Thailand" },
              { name: "Destination country", description: "Country-level (except where specific port is designated)" },
              { name: "Number of containers", description: "Total container count per destination" },
              { name: "ETD period", description: "Requested departure period (e.g. P3W1)" },
            ],
            frequency: "Once per month, 3 months before ETD",
            source: "PCH team (contact: Hut)",
            escalation: {
              trigger: "If forecast doesn't arrive on schedule",
              level1: { to: "Hut (PCH)", method: "Email", action: "Resend forecast immediately" },
              level2: { to: "Sukumar/KT", method: "Email", action: "Escalate and coordinate resend", timeToLevel2: "2 hours after Level 1" },
            },
          },
          output: {
            description: "CSA TH confirms receipt of the forecast data. No transformation happens at this step — it is purely receive and acknowledge.",
          },
          deliverables: {
            format: "Excel file",
            method: "Email",
            recipient: "CSA TH team inbox (picked up by Mui)",
            confirmation: "Mui sends email confirmation back to Hut acknowledging receipt",
          },
          communication: {
            sender: { actor: "PCH", contact: "Hut" },
            receiver: { actor: "CSA TH", contact: "Mui" },
            confirmationRequired: true,
            confirmationMethod: "Email acknowledgment",
          },
          timeline: {
            frequency: "Once per month",
            relativeToETD: "3 months before ETD",
            additionalConstraints: "None beyond the monthly cadence",
          },
          dependencies: {
            upstream: "None — this is the initiation step of the entire process",
            blockedBy: [],
          },
          slas: {
            frequency: "Once per month",
            maxCompletionTime: null,
            escalationSLAminutes: 240,
            escalationSLADescription: "If not received within expected monthly window, escalate within 4 hours",
          },
          owner: {
            organization: "CSA TH",
            contact: "Mui",
            responsibility: "Receiving and validating forecast data",
          },
          lineage: {
            outputFields: [
              { field: "Origin country", flowsTo: "f2 — match to GOT origin" },
              { field: "Destination country", flowsTo: "f2 — match to GOT destination → determines which lanes apply" },
              { field: "Number of containers", flowsTo: "f3 — input for carrier allocation split calculation" },
              { field: "ETD period", flowsTo: "f2 — match to GOT period/week allocation; f3 — determines which period's allocation ratios to use" },
            ],
          },
        },
        arrow: "right",
      },
      {
        id: "f2",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Match to Cargoo GOT",
        detail: "Map PCH forecast to Cargoo lane structure",
        sections: {
          input: { description: "Receiving output from f1" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "Depends on f1 completion" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "right",
      },
      {
        id: "f3",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Carrier allocation split",
        detail: "If multiple carriers serve same destination, split by allocation ratio",
        sections: {
          input: { description: "Receiving output from f1 and f2" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "Depends on f1 and f2 completion" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "right",
      },
      {
        id: "f4",
        actor: "Carriers",
        actorColor: "#378ADD",
        title: "Space reservation",
        detail: "Allocated quantities shared with carriers to reserve vessel space",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "down",
      },
      {
        id: "f5",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Create forecast dashboard",
        detail: "Dashboard to track forecast → actual progression",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: null,
      },
    ],
  },
  {
    id: "booking",
    title: "Phase 2 — Booking process",
    color: "#534AB7",
    bgColor: "#EEEDFE",
    steps: [
      {
        id: "b1",
        actor: "PCH",
        actorColor: "#D85A30",
        title: "Send booking requests",
        detail: "PCH submits formal booking instructions",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "right",
      },
      {
        id: "b2",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Transform to Cargoo shipments",
        detail: "Split booking lines into individual shipments",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "right",
      },
      {
        id: "b3",
        actor: "Cargoo",
        actorColor: "#0F6E56",
        title: "Store shipment data",
        detail: "Record all booking and transport plan data",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "down",
      },
      {
        id: "b4",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Update booking dashboard",
        detail: "Capture granular booking-level tracking",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "right",
      },
      {
        id: "b5",
        actor: "System",
        actorColor: "#BA7517",
        title: "Container pool created",
        detail: "Pool of confirmed containers available for PCH SKU planning",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: null,
      },
    ],
  },
  {
    id: "planning",
    title: "Phase 3 — Planning & warehouse execution",
    color: "#BA7517",
    bgColor: "#FAEEDA",
    steps: [
      {
        id: "p1",
        actor: "PCH",
        actorColor: "#D85A30",
        title: "Assign SKUs to containers",
        detail: "PCH selects containers from pool and assigns product",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "right",
      },
      {
        id: "p2",
        actor: "Cargoo",
        actorColor: "#0F6E56",
        title: "Generate container reference",
        detail: "Cargoo generates the reference — not PCH",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "right",
      },
      {
        id: "p3",
        actor: "PCH",
        actorColor: "#D85A30",
        title: "Share planning with warehouse",
        detail: "Planning information sent to warehouse for picking",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "down",
      },
      {
        id: "p4",
        actor: "Warehouse",
        actorColor: "#888780",
        title: "Execute picking",
        detail: "Warehouse performs physical picking and reports status",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: "split",
      },
      {
        id: "p5a",
        actor: "Complete",
        actorColor: "#0F6E56",
        title: "Picking complete",
        detail: "All SKUs picked successfully",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: null,
      },
      {
        id: "p5b",
        actor: "Partial",
        actorColor: "#D85A30",
        title: "Picking partial",
        detail: "Not all SKUs available",
        sections: {
          input: { description: "TBD" },
          output: { description: "TBD" },
          deliverables: { description: "TBD" },
          communication: { description: "TBD" },
          timeline: { description: "TBD" },
          dependencies: { description: "TBD" },
          slas: { description: "TBD" },
          owner: { description: "TBD" },
          lineage: { description: "TBD" },
        },
        arrow: null,
      },
    ],
  },
];

const sectionTitles = {
  input: "📥 Input",
  output: "📤 Output",
  deliverables: "📦 Deliverables",
  communication: "💬 Communication",
  timeline: "⏰ Timeline",
  dependencies: "🔗 Dependencies",
  slas: "⚡ SLAs",
  owner: "👤 Owner",
  lineage: "🔀 Data Lineage",
};

function getArrowLabel(step: any): string {
  const lineage = step.sections?.lineage;
  if (!lineage?.outputFields || lineage.outputFields.length === 0) return "";
  const fields = lineage.outputFields as Array<{ field: string }>;
  if (fields.length === 1) return fields[0].field;
  if (fields.length === 2) return `${fields[0].field} · ${fields[1].field}`;
  return `${fields[0].field} +${fields.length - 1}`;
}

function renderSection(
  step: any,
  sectionKey: string,
  section: any,
  phaseColor: string,
  isSectionExpanded: (stepId: string, key: string) => boolean,
  toggleSection: (stepId: string, key: string) => void,
) {
  const isExpanded = isSectionExpanded(step.id, sectionKey);

  return (
    <div
      key={sectionKey}
      style={{
        marginBottom: 12,
        borderRadius: 8,
        border: `1px solid ${phaseColor}22`,
        overflow: "hidden",
      }}
    >
      <div
        onClick={() => toggleSection(step.id, sectionKey)}
        style={{
          padding: "10px 12px",
          background: isExpanded ? phaseColor + "08" : "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.2s",
          borderBottom: isExpanded ? `1px solid ${phaseColor}22` : "none",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: phaseColor,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {sectionTitles[sectionKey as keyof typeof sectionTitles]}
        </span>
        <span style={{ fontSize: 12, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div style={{ padding: "12px", fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          <SectionContent section={section} sectionKey={sectionKey} />
        </div>
      )}
    </div>
  );
}

function SectionContent({ section, sectionKey }: { section: any; sectionKey: string }) {
  if (sectionKey === "input") {
    return (
      <div>
        {section.description && <p style={{ marginBottom: 12 }}>{section.description}</p>}
        {section.dataElements && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Data Elements:</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <tbody>
                {section.dataElements.map((el: any, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--color-border-tertiary)" }}>
                    <td style={{ padding: "6px 8px", fontWeight: 500, width: "30%" }}>{el.name}</td>
                    <td style={{ padding: "6px 8px", color: "var(--color-text-secondary)" }}>{el.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {section.frequency && <p><strong>Frequency:</strong> {section.frequency}</p>}
        {section.source && <p><strong>Source:</strong> {section.source}</p>}
        {section.escalation && (
          <div style={{ marginTop: 12, padding: "10px", background: "#ff4444" + "10", borderRadius: 6, borderLeft: "3px solid #ff4444" }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Escalation Protocol:</p>
            <p><strong>Trigger:</strong> {section.escalation.trigger}</p>
            <p style={{ marginTop: 6 }}>
              <strong>Level 1:</strong> To {section.escalation.level1.to} via {section.escalation.level1.method} — {section.escalation.level1.action}
            </p>
            <p style={{ marginTop: 6 }}>
              <strong>Level 2:</strong> To {section.escalation.level2.to} via {section.escalation.level2.method} — {section.escalation.level2.action}{" "}
              ({section.escalation.level2.timeToLevel2})
            </p>
          </div>
        )}
      </div>
    );
  }

  if (sectionKey === "output") return <div>{section.description}</div>;

  if (sectionKey === "deliverables") {
    return (
      <div>
        {section.format && <p><strong>Format:</strong> {section.format}</p>}
        {section.method && <p><strong>Method:</strong> {section.method}</p>}
        {section.recipient && <p><strong>Recipient:</strong> {section.recipient}</p>}
        {section.confirmation && <p><strong>Confirmation:</strong> {section.confirmation}</p>}
      </div>
    );
  }

  if (sectionKey === "communication") {
    return (
      <div>
        {section.sender && <p><strong>Sender:</strong> {section.sender.actor} ({section.sender.contact})</p>}
        {section.receiver && <p><strong>Receiver:</strong> {section.receiver.actor} ({section.receiver.contact})</p>}
        {section.confirmationRequired !== undefined && <p><strong>Confirmation Required:</strong> {section.confirmationRequired ? "Yes" : "No"}</p>}
        {section.confirmationMethod && <p><strong>Confirmation Method:</strong> {section.confirmationMethod}</p>}
      </div>
    );
  }

  if (sectionKey === "timeline") {
    return (
      <div>
        {section.frequency && <p><strong>Frequency:</strong> {section.frequency}</p>}
        {section.relativeToETD && <p><strong>Relative to ETD:</strong> {section.relativeToETD}</p>}
        {section.additionalConstraints && <p><strong>Additional Constraints:</strong> {section.additionalConstraints}</p>}
      </div>
    );
  }

  if (sectionKey === "dependencies") {
    return (
      <div>
        {section.upstream && <p><strong>Upstream Dependencies:</strong> {section.upstream}</p>}
        {section.blockedBy && section.blockedBy.length > 0 && <p><strong>Blocked By:</strong> {section.blockedBy.join(", ")}</p>}
      </div>
    );
  }

  if (sectionKey === "slas") {
    return (
      <div>
        {section.frequency && <p><strong>Frequency:</strong> {section.frequency}</p>}
        {section.maxCompletionTime && <p><strong>Max Completion Time:</strong> {section.maxCompletionTime}</p>}
        {section.escalationSLAminutes && <p><strong>Escalation SLA:</strong> {section.escalationSLADescription}</p>}
      </div>
    );
  }

  if (sectionKey === "owner") {
    return (
      <div>
        {section.organization && <p><strong>Organization:</strong> {section.organization}</p>}
        {section.contact && <p><strong>Contact:</strong> {section.contact}</p>}
        {section.responsibility && <p><strong>Responsibility:</strong> {section.responsibility}</p>}
      </div>
    );
  }

  if (sectionKey === "lineage") {
    return (
      <div>
        {section.outputFields && (
          <div>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Data Flow:</p>
            {section.outputFields.map((flow: any, i: number) => (
              <p key={i} style={{ marginBottom: 6 }}>
                <strong>{flow.field}</strong> → {flow.flowsTo}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <p>{section.description || "TBD"}</p>;
}

function StepNode({
  step,
  phaseColor,
  index,
  isActive,
  onClick,
}: {
  step: any;
  phaseColor: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 150,
        minWidth: 150,
        flexShrink: 0,
        borderRadius: 10,
        border: `1.5px solid ${isActive ? phaseColor : phaseColor + "44"}`,
        background: "white",
        cursor: "pointer",
        transition: "all 0.2s",
        overflow: "hidden",
        boxShadow: isActive ? `0 0 0 2px ${phaseColor}` : "none",
      }}
    >
      <div style={{ height: 5, background: step.actorColor, width: "100%" }} />
      <div style={{ padding: "10px 10px 8px" }}>
        <div style={{ fontSize: 10, opacity: 0.5, color: phaseColor, fontWeight: 600, marginBottom: 2 }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
          {step.title}
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "2px 7px",
            borderRadius: 99,
            background: step.actorColor + "18",
            color: step.actorColor,
            fontSize: 9,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {step.actor}
        </div>
      </div>
    </div>
  );
}

function ArrowConnector({ label, phaseColor }: { label: string; phaseColor: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        minWidth: 56,
        flexShrink: 0,
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%", position: "relative" }}>
        <div style={{ flex: 1, height: 2, background: phaseColor + "66" }} />
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderLeft: `7px solid ${phaseColor}66`,
          }}
        />
      </div>
      {label && (
        <div
          style={{
            position: "absolute",
            top: -18,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 9,
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: phaseColor,
            background: "white",
            padding: "1px 4px",
            borderRadius: 3,
            border: `1px solid ${phaseColor}33`,
            maxWidth: 120,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

function SplitBranch({
  splitChildren,
  phaseColor,
  expandedStep,
  onToggleStep,
}: {
  splitChildren: any[];
  phaseColor: string;
  expandedStep: string | null;
  onToggleStep: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <div style={{ width: 2, height: 20, background: phaseColor + "66" }} />

      <div style={{ display: "flex", width: "100%", position: "relative", height: 20, alignItems: "stretch" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ width: 2, height: "100%", background: phaseColor + "66" }} />
          <div style={{ fontSize: 8, color: phaseColor, position: "absolute", bottom: -12 }}>✓</div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: "25%",
            right: "25%",
            height: 2,
            background: phaseColor + "66",
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ width: 2, height: "100%", background: phaseColor + "66" }} />
          <div style={{ fontSize: 8, color: phaseColor, position: "absolute", bottom: -12 }}>◐</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 12 }}>
        {splitChildren.map((child, idx) => (
          <StepNode
            key={child.id}
            step={child}
            phaseColor={phaseColor}
            index={idx}
            isActive={expandedStep === child.id}
            onClick={() => onToggleStep(child.id)}
          />
        ))}
      </div>
    </div>
  );
}

function DetailPanel({
  step,
  phase,
  expandedSections,
  toggleSection,
  isSectionExpanded,
  onClose,
}: {
  step: any;
  phase: any;
  expandedSections: Record<string, boolean>;
  toggleSection: (stepId: string, key: string) => void;
  isSectionExpanded: (stepId: string, key: string) => boolean;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        borderTop: `2px solid ${phase.color}`,
        background: phase.color + "08",
        padding: "20px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "inline-block",
              padding: "2px 7px",
              borderRadius: 99,
              background: step.actorColor + "18",
              color: step.actorColor,
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {step.actor}
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
            {step.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: "var(--color-text-secondary)",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {Object.entries(step.sections).map(([sectionKey, section]) =>
          renderSection(step, sectionKey, section as any, phase.color, isSectionExpanded, toggleSection),
        )}
      </div>
    </div>
  );
}

function PhaseRow({
  phase,
  expandedStep,
  onToggleStep,
  expandedSections,
  toggleSection,
  isSectionExpanded,
}: {
  phase: any;
  expandedStep: string | null;
  onToggleStep: (id: string) => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (stepId: string, key: string) => void;
  isSectionExpanded: (stepId: string, key: string) => boolean;
}) {
  const splitChildren = phase.steps.filter((s: any) => s.id.includes("5a") || s.id.includes("5b"));
  const mainSteps = phase.steps.filter((s: any) => !s.id.includes("5a") && !s.id.includes("5b"));
  const activeStep = phase.steps.find((s: any) => s.id === expandedStep) ?? null;

  return (
    <div
      style={{
        marginBottom: 32,
        borderRadius: 14,
        border: `1.5px solid ${phase.color}22`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          background: phase.color,
          color: "#fff",
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        {phase.title}
      </div>

      <div style={{ overflowX: "auto", overflowY: "visible", padding: "24px 20px 16px", minHeight: 240 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, width: "max-content" }}>
          {mainSteps.map((step: any, idx: number) => (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              <StepNode
                step={step}
                phaseColor={phase.color}
                index={idx}
                isActive={expandedStep === step.id}
                onClick={() => onToggleStep(step.id)}
              />
              {idx < mainSteps.length - 1 && (
                <ArrowConnector label={getArrowLabel(step)} phaseColor={phase.color} />
              )}
              {step.arrow === "split" && splitChildren.length > 0 && (
                <SplitBranch
                  splitChildren={splitChildren}
                  phaseColor={phase.color}
                  expandedStep={expandedStep}
                  onToggleStep={onToggleStep}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {activeStep && (
        <DetailPanel
          step={activeStep}
          phase={phase}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          isSectionExpanded={isSectionExpanded}
          onClose={() => onToggleStep(activeStep.id)}
        />
      )}
    </div>
  );
}

export default function ProcessFlow() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => setExpandedStep(expandedStep === id ? null : id);
  const toggleSection = (stepId: string, sectionKey: string) => {
    const key = `${stepId}-${sectionKey}`;
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const isSectionExpanded = (stepId: string, sectionKey: string) => {
    return expandedSections[`${stepId}-${sectionKey}`] || false;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1100, margin: "0 auto", padding: "16px 8px" }}>
      <div style={{ marginBottom: 24, padding: "16px", background: "var(--color-background-secondary)", borderRadius: 10 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>PCH Process Flow — Visual Diagram</h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          Click any step node to view detailed sections: Input, Output, Deliverables, Communication, Timeline, Dependencies, SLAs, Owner, and Data Lineage.
        </p>
      </div>

      {phases.map((phase) => (
        <PhaseRow
          key={phase.id}
          phase={phase}
          expandedStep={expandedStep}
          onToggleStep={toggleStep}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          isSectionExpanded={isSectionExpanded}
        />
      ))}
    </div>
  );
}
