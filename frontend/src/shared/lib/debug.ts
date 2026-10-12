import { useEffect } from "react";

export function DebugSafeArea() {
  useEffect(() => {
    const el = document.createElement("div");
    el.style.paddingBottom = "env(safe-area-inset-bottom)";
    document.body.appendChild(el);

    const styles = getComputedStyle(el);
    console.log("safe-area-inset-bottom:", styles.paddingBottom);
    document.body.removeChild(el);
  }, []);

  return null;
}
