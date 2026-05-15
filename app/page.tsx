"use client";

import { useState, useEffect } from "react";
import { getDefaultPhases } from "@/lib/defaultData";

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

function EditForm({
  section,
  onSave,
  onCancel,
  phaseColor,
}: {
  section: any;
  onSave: (newData: any) => void;
  onCancel: () => void;
  phaseColor: string;
}) {
  const [editData, setEditData] = useState(JSON.parse(JSON.stringify(section)));

  const handleChange = (path: string, value: any) => {
    const keys = path.split(".");
    const newData = JSON.parse(JSON.stringify(editData));
    let obj = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setEditData(newData);
  };

  return (
    <div style={{ background: "white", border: `1px solid ${phaseColor}33`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
      {typeof editData === "object" && editData !== null && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {Object.entries(editData).map(([key, value]) => (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 600, color: phaseColor, display: "block", marginBottom: 4 }}>
                {key}
              </label>
              {typeof value === "string" ? (
                <textarea
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    width: "100%",
                    padding: 6,
                    borderRadius: 4,
                    border: `1px solid ${phaseColor}22`,
                    fontSize: 11,
                    fontFamily: "monospace",
                    minHeight: 60,
                  }}
                />
              ) : typeof value === "boolean" ? (
                <select
                  value={value ? "true" : "false"}
                  onChange={(e) => handleChange(key, e.target.value === "true")}
                  style={{ width: "100%", padding: 6, borderRadius: 4, border: `1px solid ${phaseColor}22`, fontSize: 11 }}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <textarea
                  value={JSON.stringify(value, null, 2)}
                  onChange={(e) => {
                    try {
                      handleChange(key, JSON.parse(e.target.value));
                    } catch (e) {
                      // JSON parse error, ignore
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: 6,
                    borderRadius: 4,
                    border: `1px solid ${phaseColor}22`,
                    fontSize: 11,
                    fontFamily: "monospace",
                    minHeight: 80,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={() => onSave(editData)}
          style={{
            padding: "6px 12px",
            background: phaseColor,
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ✓ Save
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "6px 12px",
            background: "transparent",
            color: phaseColor,
            border: `1px solid ${phaseColor}`,
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ✕ Cancel
        </button>
      </div>
    </div>
  );
}

function renderSection(
  step: any,
  sectionKey: string,
  section: any,
  phaseColor: string,
  isSectionExpanded: (stepId: string, key: string) => boolean,
  toggleSection: (stepId: string, key: string) => void,
  editingSection: string | null,
  setEditingSection: (key: string | null) => void,
  onSaveSection: (stepId: string, sectionKey: string, data: any) => Promise<void>,
  savingSection: string | null,
) {
  const isExpanded = isSectionExpanded(step.id, sectionKey);
  const isEditing = editingSection === `${step.id}-${sectionKey}`;
  const isSaving = savingSection === `${step.id}-${sectionKey}`;

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
        <div
          onClick={() => toggleSection(step.id, sectionKey)}
          style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: phaseColor,
            }}
          >
            {sectionTitles[sectionKey as keyof typeof sectionTitles]}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isSaving && <span style={{ fontSize: 10, color: phaseColor }}>💾 Saving...</span>}
          <button
            onClick={() => setEditingSection(isEditing ? null : `${step.id}-${sectionKey}`)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              color: phaseColor,
              opacity: 0.7,
            }}
          >
            ✎
          </button>
          <span
            onClick={() => toggleSection(step.id, sectionKey)}
            style={{ fontSize: 12, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", cursor: "pointer" }}
          >
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: "12px", fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          {isEditing ? (
            <EditForm
              section={section}
              onSave={(newData) => {
                onSaveSection(step.id, sectionKey, newData).then(() => {
                  setEditingSection(null);
                });
              }}
              onCancel={() => setEditingSection(null)}
              phaseColor={phaseColor}
            />
          ) : (
            <SectionContent section={section} sectionKey={sectionKey} />
          )}
        </div>
      )}
    </div>
  );
}

// Rest of the components (StepNode, ArrowConnector, SplitBranch, DetailPanel, PhaseRow) - unchanged

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
  toggleSection,
  isSectionExpanded,
  onClose,
  editingSection,
  setEditingSection,
  onSaveSection,
  savingSection,
}: {
  step: any;
  phase: any;
  toggleSection: (stepId: string, key: string) => void;
  isSectionExpanded: (stepId: string, key: string) => boolean;
  onClose: () => void;
  editingSection: string | null;
  setEditingSection: (key: string | null) => void;
  onSaveSection: (stepId: string, sectionKey: string, data: any) => Promise<void>;
  savingSection: string | null;
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
          renderSection(step, sectionKey, section as any, phase.color, isSectionExpanded, toggleSection, editingSection, setEditingSection, onSaveSection, savingSection),
        )}
      </div>
    </div>
  );
}

function PhaseRow({
  phase,
  expandedStep,
  onToggleStep,
  toggleSection,
  isSectionExpanded,
  editingSection,
  setEditingSection,
  onSaveSection,
  savingSection,
}: {
  phase: any;
  expandedStep: string | null;
  onToggleStep: (id: string) => void;
  toggleSection: (stepId: string, key: string) => void;
  isSectionExpanded: (stepId: string, key: string) => boolean;
  editingSection: string | null;
  setEditingSection: (key: string | null) => void;
  onSaveSection: (stepId: string, sectionKey: string, data: any) => Promise<void>;
  savingSection: string | null;
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
          toggleSection={toggleSection}
          isSectionExpanded={isSectionExpanded}
          onClose={() => onToggleStep(activeStep.id)}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          onSaveSection={onSaveSection}
          savingSection={savingSection}
        />
      )}
    </div>
  );
}

export default function ProcessFlow() {
  const [phases, setPhases] = useState<any[]>(getDefaultPhases());
  const [loading, setLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/steps")
      .then((r) => r.json())
      .then((data) => {
        setPhases(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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

  const saveSection = async (stepId: string, sectionKey: string, newData: any) => {
    setSavingSection(`${stepId}-${sectionKey}`);
    try {
      const response = await fetch(`/api/steps/${stepId}/${sectionKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (!response.ok) throw new Error("Save failed");

      const result = await response.json();
      setPhases(result.data || phases);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1100, margin: "0 auto", padding: "16px 8px" }}>
      <div style={{ marginBottom: 24, padding: "16px", background: "var(--color-background-secondary)", borderRadius: 10 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>PCH Process Flow — Editable Diagram</h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          Click any step to expand. Click the ✎ pencil icon on any section to edit it. Changes sync to all team members.
        </p>
        {loading && <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>Loading...</p>}
      </div>

      {phases.map((phase) => (
        <PhaseRow
          key={phase.id}
          phase={phase}
          expandedStep={expandedStep}
          onToggleStep={toggleStep}
          toggleSection={toggleSection}
          isSectionExpanded={isSectionExpanded}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          onSaveSection={saveSection}
          savingSection={savingSection}
        />
      ))}
    </div>
  );
}
