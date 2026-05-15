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
        fields: ["Origin country (always Thailand)", "Destination country", "Number of containers per ETD period (PxWy)"],
        arrow: "right",
      },
      {
        id: "f2",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Match to Cargoo GOT",
        detail: "Map PCH forecast to Cargoo lane structure",
        fields: ["Lane ID", "Port of loading / Port of destination", "Quarterly allocation per period/week"],
        arrow: "right",
      },
      {
        id: "f3",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Carrier allocation split",
        detail: "If multiple carriers serve same destination, split by allocation ratio",
        fields: [
          "Extract allocation per lane for the period",
          "Calculate % share: Lane allocation ÷ Total allocation",
          "Apply % to PCH forecast → containers per carrier",
        ],
        example: "10 ctns → Philippines P3W1\nMSC: 8/20 = 40% → 4 ctns\nMaersk: 12/20 = 60% → 6 ctns",
        arrow: "right",
      },
      {
        id: "f4",
        actor: "Carriers",
        actorColor: "#378ADD",
        title: "Space reservation",
        detail: "Allocated quantities shared with carriers to reserve vessel space",
        fields: [],
        arrow: "down",
      },
      {
        id: "f5",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Create forecast dashboard",
        detail: "Dashboard to track forecast → actual progression",
        fields: [
          "Line ID, Carrier, Origin, Destination",
          "POR, FND, Period",
          "Forecasted containers (PCH total)",
          "Allocated containers (after carrier split)",
          "Booking requested / Planned / Actual / Cancelled",
        ],
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
        fields: [
          "Lane ID, Country, Port, CV/return",
          "ETD period, ETA period",
          "Container type, Container qty, Ctn/booking",
          "Carrier",
        ],
        arrow: "right",
      },
      {
        id: "b2",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Transform to Cargoo shipments",
        detail: "Split booking lines into individual shipments",
        fields: [
          "Shipments = Container qty ÷ ctn/booking",
          "Each shipment inherits lane, port, ETD, ETA, carrier",
          "Assign unique booking ref: LineID-Carrier-Seq-Period",
        ],
        example: "1291-A, OOCL, 12 ctns, 4/booking\n→ 3 shipments: 001, 002, 003",
        arrow: "right",
      },
      {
        id: "b3",
        actor: "Cargoo",
        actorColor: "#0F6E56",
        title: "Store shipment data",
        detail: "Record all booking and transport plan data",
        fields: [
          "Requested ETD/ETA (period)",
          "Updated ETD/ETA (period)",
          "ETD/ETA from transport plan (actual dates)",
        ],
        arrow: "down",
      },
      {
        id: "b4",
        actor: "CSA TH",
        actorColor: "#534AB7",
        title: "Update booking dashboard",
        detail: "Capture granular booking-level tracking",
        fields: [
          "Forecast ref, Market, Booking unique ref",
          "Cargo ref, Booking ref",
          "POD, FND",
          "Initial & updated departure/arrival periods",
          "ETD/ETA from transport plan",
        ],
        arrow: "right",
      },
      {
        id: "b5",
        actor: "System",
        actorColor: "#BA7517",
        title: "Container pool created",
        detail: "Pool of confirmed containers available for PCH SKU planning",
        fields: [
          "Each container has unique Cargoo reference",
          "Known lane, carrier, departure window, arrival estimate",
          "Links back to forecast and booking dashboards",
        ],
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
        fields: [
          "Prof. Inv, ODN#, Agent, ETA",
          "Shipping type, Destination, Port",
          "Time In/Out, SO#, Total cases",
          "No. of SKUs, Container fill %",
          "Remarks (container ref e.g. JAP26P5W1-004)",
        ],
        arrow: "right",
      },
      {
        id: "p2",
        actor: "Cargoo",
        actorColor: "#0F6E56",
        title: "Generate container reference",
        detail: "Cargoo generates the reference — not PCH",
        fields: [
          "Reference must originate from Cargoo",
          "Maintains process integrity and traceability",
          "Links to booking ref and forecast ref",
        ],
        arrow: "right",
      },
      {
        id: "p3",
        actor: "PCH",
        actorColor: "#D85A30",
        title: "Share planning with warehouse",
        detail: "Planning information sent to warehouse for picking",
        fields: ["SKU list per container", "Container reference from Cargoo", "Picking instructions"],
        arrow: "down",
      },
      {
        id: "p4",
        actor: "Warehouse",
        actorColor: "#888780",
        title: "Execute picking",
        detail: "Warehouse performs physical picking and reports status",
        fields: [],
        arrow: "split",
      },
      {
        id: "p5a",
        actor: "Complete",
        actorColor: "#0F6E56",
        title: "Picking complete",
        detail: "All SKUs picked successfully",
        fields: [
          "Process continues — no amendments",
          "Container proceeds to loading",
          "Actual containers confirmed in dashboard",
        ],
        arrow: null,
      },
      {
        id: "p5b",
        actor: "Partial",
        actorColor: "#D85A30",
        title: "Picking partial",
        detail: "Not all SKUs available",
        fields: [
          "PCH decides: continue with partial load OR roll over",
          "If rolled over: cancelled count incremented, new booking created",
          "Must always reference back to original Cargoo container ref",
        ],
        arrow: null,
      },
    ],
  },
];

const actorLegend = [
  { name: "PCH (Mars)", color: "#D85A30" },
  { name: "CSA Thailand", color: "#534AB7" },
  { name: "Cargoo TMS", color: "#0F6E56" },
  { name: "Carriers", color: "#378ADD" },
  { name: "Container pool", color: "#BA7517" },
  { name: "Warehouse", color: "#888780" },
];

export default function ProcessFlow() {
  const [expandedStep, setExpandedStep] = useState(null);

  const toggle = (id) => setExpandedStep(expandedStep === id ? null : id);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif', sans-serif", maxWidth: 920, margin: "0 auto", padding: "0 8px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Legend */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24,
        padding: "12px 16px", borderRadius: 10,
        background: "var(--color-background-secondary)",
        border: "1px solid var(--color-border-tertiary)"
      }}>
        {actorLegend.map((a) => (
          <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: a.color }} />
            {a.name}
          </div>
        ))}
      </div>

      {phases.map((phase) => (
        <div key={phase.id} style={{
          marginBottom: 28,
          borderRadius: 14,
          border: `1.5px solid ${phase.color}22`,
          overflow: "hidden",
        }}>
          {/* Phase header */}
          <div style={{
            padding: "14px 20px",
            background: phase.color,
            color: "#fff",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 0.3,
          }}>
            {phase.title}
          </div>

          <div style={{ padding: "16px 16px 8px" }}>
            {phase.steps.map((step, idx) => {
              const isExpanded = expandedStep === step.id;
              const isSplit = step.arrow === "split";
              const isSplitChild = step.id.includes("5a") || step.id.includes("5b");

              if (isSplitChild) return null;

              const splitChildren = isSplit
                ? phase.steps.filter((s) => s.id.includes("5a") || s.id.includes("5b"))
                : [];

              return (
                <div key={step.id}>
                  {/* Step card */}
                  <div
                    onClick={() => toggle(step.id)}
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
                    <div style={{
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
                    }}>
                      {step.actor}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 600,
                        color: "var(--color-text-primary)",
                        marginBottom: 2,
                      }}>
                        <span style={{ color: phase.color, marginRight: 6, fontSize: 12, opacity: 0.6 }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {step.title}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                        {step.detail}
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div style={{ marginTop: 10 }}>
                          {step.fields.length > 0 && (
                            <div style={{
                              background: "var(--color-background-primary)",
                              borderRadius: 8,
                              padding: "10px 12px",
                              marginBottom: step.example ? 8 : 0,
                            }}>
                              {step.fields.map((f, i) => (
                                <div key={i} style={{
                                  fontSize: 12,
                                  color: "var(--color-text-secondary)",
                                  padding: "3px 0",
                                  borderBottom: i < step.fields.length - 1 ? "1px solid var(--color-border-tertiary)" : "none",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 6,
                                }}>
                                  <span style={{ color: phase.color, fontSize: 8, marginTop: 4 }}>●</span>
                                  {f}
                                </div>
                              ))}
                            </div>
                          )}
                          {step.example && (
                            <div style={{
                              background: phase.color + "0D",
                              borderLeft: `3px solid ${phase.color}`,
                              borderRadius: "0 8px 8px 0",
                              padding: "8px 12px",
                              fontSize: 11,
                              fontFamily: "var(--font-mono)",
                              color: "var(--color-text-secondary)",
                              whiteSpace: "pre-line",
                              lineHeight: 1.5,
                            }}>
                              {step.example}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expand icon */}
                    <div style={{
                      color: "var(--color-text-tertiary)",
                      fontSize: 16,
                      marginTop: 2,
                      transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}>
                      <i className="ti ti-chevron-down" />
                    </div>
                  </div>

                  {/* Arrow between steps */}
                  {step.arrow && !isSplit && (
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "2px 0",
                      marginLeft: 84,
                    }}>
                      <div style={{
                        width: 1.5,
                        height: 20,
                        background: `linear-gradient(to bottom, ${phase.color}44, ${phase.color}22)`,
                        position: "relative",
                      }}>
                        <div style={{
                          position: "absolute",
                          bottom: -4,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: 0,
                          borderLeft: "4px solid transparent",
                          borderRight: "4px solid transparent",
                          borderTop: `5px solid ${phase.color}44`,
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Split decision */}
                  {isSplit && splitChildren.length > 0 && (
                    <>
                      <div style={{
                        display: "flex", justifyContent: "center",
                        padding: "4px 0", marginLeft: 84,
                      }}>
                        <div style={{ width: 1.5, height: 16, background: phase.color + "33" }} />
                      </div>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                        marginLeft: 86,
                        marginRight: 14,
                        marginBottom: 8,
                      }}>
                        {splitChildren.map((child) => (
                          <div
                            key={child.id}
                            onClick={() => toggle(child.id)}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              cursor: "pointer",
                              border: `1.5px solid ${child.actorColor}33`,
                              background: expandedStep === child.id ? child.actorColor + "0A" : "transparent",
                              transition: "all 0.2s",
                            }}
                          >
                            <div style={{
                              display: "flex", alignItems: "center", gap: 6, marginBottom: 4,
                            }}>
                              <div style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: child.actorColor,
                              }} />
                              <span style={{
                                fontSize: 13, fontWeight: 600,
                                color: child.actorColor,
                              }}>
                                {child.title}
                              </span>
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>
                              {child.detail}
                            </div>
                            {expandedStep === child.id && child.fields.map((f, i) => (
                              <div key={i} style={{
                                fontSize: 11,
                                color: "var(--color-text-secondary)",
                                padding: "2px 0 2px 14px",
                                position: "relative",
                              }}>
                                <span style={{
                                  position: "absolute", left: 0,
                                  color: child.actorColor, fontSize: 7, top: 5,
                                }}>●</span>
                                {f}
                              </div>
                            ))}
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

      {/* Data flow summary */}
      <div style={{
        marginTop: 8,
        borderRadius: 14,
        border: "1px solid var(--color-border-tertiary)",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "12px 20px",
          background: "var(--color-background-secondary)",
          fontSize: 14, fontWeight: 600,
          color: "var(--color-text-primary)",
          borderBottom: "1px solid var(--color-border-tertiary)",
        }}>
          Data flow summary
        </div>
        <div style={{ padding: 16 }}>
          {[
            { from: "PCH", to: "CSA TH", data: "Forecast → origin, dest, containers/period", color: "#D85A30" },
            { from: "CSA TH", to: "Cargoo", data: "Lane matching, allocation split", color: "#534AB7" },
            { from: "CSA TH", to: "Carriers", data: "Allocated quantities for space reservation", color: "#534AB7" },
            { from: "PCH", to: "CSA TH", data: "Booking requests → lane, port, ETD, qty, ctn/booking", color: "#D85A30" },
            { from: "CSA TH", to: "Cargoo", data: "Individual shipments with booking refs", color: "#534AB7" },
            { from: "Cargoo", to: "PCH", data: "Container pool with unique references", color: "#0F6E56" },
            { from: "PCH", to: "Warehouse", data: "SKU assignments + picking instructions", color: "#D85A30" },
            { from: "Warehouse", to: "PCH", data: "Picking status → complete or partial", color: "#888780" },
          ].map((flow, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 0",
              borderBottom: i < 7 ? "1px solid var(--color-border-tertiary)" : "none",
              fontSize: 12,
            }}>
              <span style={{
                minWidth: 64,
                fontWeight: 600,
                color: flow.color,
                fontSize: 11,
              }}>{flow.from}</span>
              <i className="ti ti-arrow-right" style={{ fontSize: 12, color: "var(--color-text-tertiary)" }} />
              <span style={{
                minWidth: 64,
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                fontSize: 11,
              }}>{flow.to}</span>
              <span style={{ color: "var(--color-text-secondary)", flex: 1 }}>{flow.data}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
