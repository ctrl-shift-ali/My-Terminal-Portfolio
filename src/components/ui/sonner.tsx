import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#111111",
          color: "#e5e5e5",
          border: "1px solid rgba(255,255,255,0.1)",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          fontSize: "13px",
        },
      }}
    />
  );
}
