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

  const renderSection = (step: any, sectionKey: string, section: any, phaseColor: string) => {
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
        {/* Section header - clickable */}
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
          <span
            style={{
              fontSize: 12,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>
        </div>

        {/* Section content */}
        {isExpanded && (
          <div style={{ padding: "12px", fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            <SectionContent section={section} sectionKey={sectionKey} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1000, margin: "0 auto", padding: "16px 8px" }}>
      <div style={{ marginBottom: 24, padding: "16px", background: "var(--color-background-secondary)", borderRadius: 10 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>PCH Process Flow — Detailed Breakdown</h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          Each step includes Input, Output, Deliverables, Communication, Timeline, Dependencies, SLAs, Owner, and Data Lineage.
          Click sections to expand details.
        </p>
      </div>

      {phases.map((phase) => (
        <div
          key={phase.id}
          style={{
            marginBottom: 32,
            borderRadius: 14,
            border: `1.5px solid ${phase.color}22`,
            overflow: "hidden",
          }}
        >
          {/* Phase header */}
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

          <div style={{ padding: "16px 16px 8px" }}>
            {phase.steps.map((step, idx) => {
              const isExpanded = expandedStep === step.id;
              const isSplit = step.arrow === "split";
              const isSplitChild = step.id.includes("5a") || step.id.includes("5b");

              if (isSplitChild) return null;

              const splitChildren = isSplit ? phase.steps.filter((s) => s.id.includes("5a") || s.id.includes("5b")) : [];

              return (
                <div key={step.id}>
                  {/* Step card */}
                  <div
                    onClick={() => toggleStep(step.id)}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px 14px",
                      marginBottom: 4,
                      borderRadius: 10,
                      cursor: "pointer",
                      background: isExpanded ? phase.bgColor : "transparent",
                      border: isExpanded ? `1px solid ${phase.color}33` : "1px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Actor badge */}
                    <div
                      style={{
                        minWidth: 72,
                        height: 26,
                        borderRadius: 6,
                        background: step.actorColor + "18",
                        color: step.actorColor,
                        fontSize: 10,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 2,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {step.actor}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            color: phase.color,
                            marginRight: 6,
                            fontSize: 12,
                            opacity: 0.6,
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {step.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.4,
                        }}
                      >
                        {step.detail}
                      </div>
                    </div>

                    {/* Expand icon */}
                    <div
                      style={{
                        color: "var(--color-text-tertiary)",
                        fontSize: 16,
                        marginTop: 2,
                        transition: "transform 0.2s",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </div>
                  </div>

                  {/* Expanded sections */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "12px 14px 16px",
                        background: phase.bgColor + "40",
                        borderTop: `1px solid ${phase.color}22`,
                      }}
                    >
                      {Object.entries(step.sections).map(([sectionKey, section]) =>
                        renderSection(step, sectionKey, section, phase.color),
                      )}
                    </div>
                  )}

                  {/* Arrow between steps */}
                  {step.arrow && !isSplit && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "2px 0",
                        marginLeft: 84,
                      }}
                    >
                      <div
                        style={{
                          width: 1.5,
                          height: 20,
                          background: `linear-gradient(to bottom, ${phase.color}44, ${phase.color}22)`,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            bottom: -4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "4px solid transparent",
                            borderRight: "4px solid transparent",
                            borderTop: `5px solid ${phase.color}44`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Split decision */}
                  {isSplit && splitChildren.length > 0 && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "4px 0",
                          marginLeft: 84,
                        }}
                      >
                        <div style={{ width: 1.5, height: 16, background: phase.color + "33" }} />
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                          marginLeft: 86,
                          marginRight: 14,
                          marginBottom: 8,
                        }}
                      >
                        {splitChildren.map((child) => (
                          <div
                            key={child.id}
                            onClick={() => toggleStep(child.id)}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              cursor: "pointer",
                              border: `1.5px solid ${child.actorColor}33`,
                              background: expandedStep === child.id ? child.actorColor + "0A" : "transparent",
                              transition: "all 0.2s",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginBottom: 4,
                              }}
                            >
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: child.actorColor,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: child.actorColor,
                                }}
                              >
                                {child.title}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--color-text-secondary)",
                                marginBottom: 4,
                              }}
                            >
                              {child.detail}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
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
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
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

        {section.frequency && (
          <p>
            <strong>Frequency:</strong> {section.frequency}
          </p>
        )}

        {section.source && (
          <p>
            <strong>Source:</strong> {section.source}
          </p>
        )}

        {section.escalation && (
          <div style={{ marginTop: 12, padding: "10px", background: "#ff4444" + "10", borderRadius: 6, borderLeft: "3px solid #ff4444" }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Escalation Protocol:</p>
            <p>
              <strong>Trigger:</strong> {section.escalation.trigger}
            </p>
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

  if (sectionKey === "output") {
    return <div>{section.description}</div>;
  }

  if (sectionKey === "deliverables") {
    return (
      <div>
        {section.format && (
          <p>
            <strong>Format:</strong> {section.format}
          </p>
        )}
        {section.method && (
          <p>
            <strong>Method:</strong> {section.method}
          </p>
        )}
        {section.recipient && (
          <p>
            <strong>Recipient:</strong> {section.recipient}
          </p>
        )}
        {section.confirmation && (
          <p>
            <strong>Confirmation:</strong> {section.confirmation}
          </p>
        )}
      </div>
    );
  }

  if (sectionKey === "communication") {
    return (
      <div>
        {section.sender && (
          <p>
            <strong>Sender:</strong> {section.sender.actor} ({section.sender.contact})
          </p>
        )}
        {section.receiver && (
          <p>
            <strong>Receiver:</strong> {section.receiver.actor} ({section.receiver.contact})
          </p>
        )}
        {section.confirmationRequired !== undefined && (
          <p>
            <strong>Confirmation Required:</strong> {section.confirmationRequired ? "Yes" : "No"}
          </p>
        )}
        {section.confirmationMethod && (
          <p>
            <strong>Confirmation Method:</strong> {section.confirmationMethod}
          </p>
        )}
      </div>
    );
  }

  if (sectionKey === "timeline") {
    return (
      <div>
        {section.frequency && (
          <p>
            <strong>Frequency:</strong> {section.frequency}
          </p>
        )}
        {section.relativeToETD && (
          <p>
            <strong>Relative to ETD:</strong> {section.relativeToETD}
          </p>
        )}
        {section.additionalConstraints && (
          <p>
            <strong>Additional Constraints:</strong> {section.additionalConstraints}
          </p>
        )}
      </div>
    );
  }

  if (sectionKey === "dependencies") {
    return (
      <div>
        {section.upstream && (
          <p>
            <strong>Upstream Dependencies:</strong> {section.upstream}
          </p>
        )}
        {section.blockedBy && section.blockedBy.length > 0 && (
          <p>
            <strong>Blocked By:</strong> {section.blockedBy.join(", ")}
          </p>
        )}
      </div>
    );
  }

  if (sectionKey === "slas") {
    return (
      <div>
        {section.frequency && (
          <p>
            <strong>Frequency:</strong> {section.frequency}
          </p>
        )}
        {section.maxCompletionTime && (
          <p>
            <strong>Max Completion Time:</strong> {section.maxCompletionTime}
          </p>
        )}
        {section.escalationSLAminutes && (
          <p>
            <strong>Escalation SLA:</strong> {section.escalationSLADescription}
          </p>
        )}
      </div>
    );
  }

  if (sectionKey === "owner") {
    return (
      <div>
        {section.organization && (
          <p>
            <strong>Organization:</strong> {section.organization}
          </p>
        )}
        {section.contact && (
          <p>
            <strong>Contact:</strong> {section.contact}
          </p>
        )}
        {section.responsibility && (
          <p>
            <strong>Responsibility:</strong> {section.responsibility}
          </p>
        )}
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
