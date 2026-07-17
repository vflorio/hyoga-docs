import { useEffect, useMemo, useState } from "react";
import { EXTERNAL_DEPENDENCIES } from "./configModel";

const EXTERNAL_DEPENDENCY_URLS = EXTERNAL_DEPENDENCIES.map((tag) => {
  const match = tag.match(/src="([^"]+)"/);
  return match ? match[1] : null;
}).filter(Boolean);

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-hyoga-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.hyogaSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}
function cloneValue(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function applyRuntimeContext(runtimeContext) {
  if (typeof window === "undefined" || !runtimeContext) return;

  Object.entries(runtimeContext.globals || {}).forEach(([key, value]) => {
    window[key] = cloneValue(value);
  });

  (runtimeContext.codeBlocks || []).forEach((codeBlock) => {
    if (!codeBlock) return;
    // biome-ignore lint/security/noGlobalEval: <global config>
    window.eval(codeBlock);
  });
}

export default function HyogaRuntimePlayer({ config, hyogaScript, runtimeContext }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const rerenderKey = useMemo(() => Object.values(config).join("|"), [config]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setReady(false);
      setError("");

      try {
        applyRuntimeContext(runtimeContext);
        for (const depUrl of EXTERNAL_DEPENDENCY_URLS) {
          await loadScript(depUrl);
        }
        await loadScript(hyogaScript);
        if (!mounted) return;

        const hasHyoga =
          typeof window !== "undefined" &&
          window.customElements &&
          window.customElements.get("hyoga-player") &&
          window.customElements.get("hyoga-videoplayer");

        if (!hasHyoga) {
          throw new Error("Hyoga custom elements are not available after script load");
        }

        setReady(true);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Unknown script load error");
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [hyogaScript, runtimeContext]);

  const isValidAttrbute = ([_, value]) => value !== undefined && value !== null && value !== "";

  const attributes = Object.fromEntries(
    Object.entries({
      id: config.id,
      uid: config.uid,
      playerselector: config.playerselector,
      videolibrary: config.videolibrary,
      sourcetype: config.sourcetype,
      adsystem: config.adsystem,
      locale: config.locale,
      globaleventsmanager: config.globaleventsmanager,
      hyogamanager: config.hyogamanager,
      disableobserver: config.disableobserver,
      endpoint: config.endpoint,
      realm: config.realm,
      assetid: config.assetid,
      playbacktype: config.playbacktype,
      sourceparams: config.sourceparams,
      autoplay: config.autoplay,
      muted: config.muted,
      deferredadinit: config.deferredadinit,
      hideoverlay: config.hideoverlay,
    }).filter(isValidAttrbute),
  );

  return (
    <>
      {error ? <p style={{ color: "#b42318" }}>{error}</p> : !ready ? <p>Loading scripts...</p> : null}
      <div
        style={{
          width: "100%",
          maxHeight: "60vh",
          aspectRatio: "16/9",
          border: "1px solid var(--ifm-color-emphasis-300)",
          borderRadius: 8,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {}
        {ready && !error ? (
          <hyoga-player key={rerenderKey} {...attributes} style={{ display: "block", width: "100%", height: "100%" }}>
            <hyoga-videoplayer hyogamanager={config.hyogamanager || config.id} />
          </hyoga-player>
        ) : null}
      </div>
    </>
  );
}
