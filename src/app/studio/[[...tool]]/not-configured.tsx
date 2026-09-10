export function StudioNotConfigured() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#faf8f4",
        color: "#1b1a17",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Studio not connected yet
        </h1>
        <p style={{ lineHeight: 1.6, color: "#6b6459" }}>
          Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> to your environment variables,
          then redeploy. See <strong>README → Connect the CMS</strong> for the
          step-by-step.
        </p>
      </div>
    </div>
  );
}
