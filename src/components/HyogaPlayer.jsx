import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CodeBlock from "@theme/CodeBlock";
import { useMemo, useState } from "react";
import ConfigForm from "./Hyoga/ConfigForm";
import {
  applyContentMode,
  applyVariant,
  buildGlobalBootstrapCode,
  CONTENT_MODE_DEFINITIONS,
  createEnvironmentConfig,
  DEFAULT_ENVIRONMENT_KEY,
  DEFAULT_HYOGA_SCRIPT,
  detectContentMode,
  getAvailableEnvironments,
  getAvailableVariants,
  getRuntimeContext,
} from "./Hyoga/configModel";
import Player from "./Hyoga/Player";

const PLAYER_ATTRIBUTE_ORDER = [
  "id",
  "uid",
  "playerselector",
  "videolibrary",
  "sourcetype",
  "src",
  "srctype",
  "title",
  "adsystem",
  "locale",
  "globaleventsmanager",
  "hyogamanager",
  "disableobserver",
  "endpoint",
  "realm",
  "assetid",
  "playbacktype",
  "sourceparams",
  "autoplay",
  "muted",
  "controls",
  "deferredadinit",
  "hideoverlay",
];

function escapeAttrValue(value) {
  return String(value).replace(/"/g, "&quot;");
}

function buildPlayerDomCode(config) {
  const attrs = PLAYER_ATTRIBUTE_ORDER.map((key) => [key, config[key]])
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `  ${key}="${escapeAttrValue(value)}"`)
    .join("\n");

  const manager = config.hyogamanager || config.id || "";

  return `<hyoga-player\n${attrs}\n>\n  <hyoga-videoplayer hyogamanager="${escapeAttrValue(manager)}" />\n</hyoga-player>`;
}

function SelectorBar({
  environments,
  variants,
  selectedEnvironmentKey,
  selectedVariantKey,
  contentMode,
  onEnvironmentChange,
  onVariantChange,
  onContentModeChange,
}) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
      <FormControl size="small" sx={{ minWidth: 160, flexGrow: 1 }}>
        <InputLabel>Content mode</InputLabel>
        <Select value={contentMode} label="Content mode" onChange={(e) => onContentModeChange(e.target.value)}>
          {Object.entries(CONTENT_MODE_DEFINITIONS).map(([key, mode]) => (
            <MenuItem key={key} value={key}>
              {mode.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {variants.length > 1 && (
        <FormControl size="small" sx={{ minWidth: 160, flexGrow: 1 }}>
          <InputLabel>Variant</InputLabel>
          <Select value={selectedVariantKey} label="Variant" onChange={(e) => onVariantChange(e.target.value)}>
            {variants.map((v) => (
              <MenuItem key={v.key} value={v.key}>
                {v.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {environments.length > 1 && (
        <FormControl size="small" sx={{ minWidth: 160, flexGrow: 1 }}>
          <InputLabel>Sonic Environment</InputLabel>
          <Select
            value={selectedEnvironmentKey}
            label="Sonic Environment"
            onChange={(e) => onEnvironmentChange(e.target.value)}
          >
            {environments.map((env) => (
              <MenuItem key={env.key} value={env.key}>
                {env.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}

function CodeOutput({ config, fullEmbedCode, displayJson, onDisplayJsonChange }) {
  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox size="small" checked={displayJson} onChange={(e) => onDisplayJsonChange(e.target.checked)} />
        }
        label="JSON"
      />
      <Box sx={{ mt: 1, width: "100%", overflow: "auto" }}>
        {displayJson ? (
          <CodeBlock language="json">{JSON.stringify(config, null, 2)}</CodeBlock>
        ) : (
          <CodeBlock language="html">{fullEmbedCode}</CodeBlock>
        )}
      </Box>
    </Box>
  );
}

function EditorLayout({
  config,
  fullEmbedCode,
  displayJson,
  onDisplayJsonChange,
  hyogaScript,
  runtimeContext,
  configFormProps,
}) {
  return (
    <Box sx={{ display: "flex", gap: 2, minHeight: 320, maxWidth: "var(--ifm-container-width-xl)" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 0,
          minWidth: 0,
          flex: 1,
          pt: 1,
        }}
      >
        <Player config={config} hyogaScript={hyogaScript} runtimeContext={runtimeContext} />
        <Box sx={{ overflow: "auto", flexShrink: 1, minHeight: 0 }}>
          <CodeOutput
            config={config}
            fullEmbedCode={fullEmbedCode}
            displayJson={displayJson}
            onDisplayJsonChange={onDisplayJsonChange}
          />
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", p: 0, minWidth: 0 }}>
        <ConfigForm {...configFormProps} />
      </Box>
    </Box>
  );
}

function PreviewLayout({ config, fullEmbedCode, displayJson, onDisplayJsonChange, hyogaScript, runtimeContext }) {
  return (
    <Stack sx={{ gap: 1, width: "100%", maxWidth: "var(--ifm-container-width-xl)" }}>
      <Player config={config} hyogaScript={hyogaScript} runtimeContext={runtimeContext} />
      <CodeOutput
        config={config}
        fullEmbedCode={fullEmbedCode}
        displayJson={displayJson}
        onDisplayJsonChange={onDisplayJsonChange}
      />
    </Stack>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function HyogaPlayer({
  initialVariantKey = "autoplayVideo",
  initialEnvironmentKey = DEFAULT_ENVIRONMENT_KEY,
  variantKeys = ["autoplayVideo"],
  environmentKeys = [DEFAULT_ENVIRONMENT_KEY],
  showConfigEditor = false,
  showScriptInputs = false,
}) {
  const variants = useMemo(() => getAvailableVariants(variantKeys), [variantKeys]);
  const environments = useMemo(() => getAvailableEnvironments(environmentKeys), [environmentKeys]);

  const [selectedEnvironmentKey, setSelectedEnvironmentKey] = useState(initialEnvironmentKey);
  const [selectedVariantKey, setSelectedVariantKey] = useState(initialVariantKey);

  const [config, setConfig] = useState(() => {
    let c = createEnvironmentConfig(initialEnvironmentKey);
    c = applyVariant(c, initialVariantKey);
    return c;
  });

  const [displayJson, setDisplayJson] = useState(false);
  const [contentMode, setContentMode] = useState(() => detectContentMode(config));

  const [hyogaScript, setHyogaScript] = useState(DEFAULT_HYOGA_SCRIPT);

  const selectedEnvironment = environments.find((env) => env.key === selectedEnvironmentKey);

  const runtimeContext = useMemo(
    () => getRuntimeContext(selectedEnvironmentKey, selectedVariantKey),
    [selectedEnvironmentKey, selectedVariantKey],
  );

  const globalBootstrapCode = useMemo(() => buildGlobalBootstrapCode(runtimeContext), [runtimeContext]);

  const domCode = useMemo(() => buildPlayerDomCode(config), [config]);

  const fullEmbedCode = useMemo(
    () => [globalBootstrapCode, domCode].filter(Boolean).join("\n\n"),
    [globalBootstrapCode, domCode],
  );

  function composeConfig(environmentKey, variantKey, modeKey) {
    let next = createEnvironmentConfig(environmentKey);
    next = applyVariant(next, variantKey);
    next = applyContentMode(next, modeKey);
    return next;
  }

  function handleEnvironmentChange(key) {
    const next = composeConfig(key, selectedVariantKey, contentMode);
    setSelectedEnvironmentKey(key);
    setConfig(next);
    setContentMode(detectContentMode(next));
  }

  function handleVariantChange(key) {
    setSelectedVariantKey(key);
    setConfig(composeConfig(selectedEnvironmentKey, key, contentMode));
  }

  function handleContentModeChange(mode) {
    setContentMode(mode);
    setConfig(composeConfig(selectedEnvironmentKey, selectedVariantKey, mode));
  }

  const sharedProps = {
    config,
    fullEmbedCode,
    displayJson,
    onDisplayJsonChange: setDisplayJson,
    hyogaScript,
    runtimeContext,
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box component="section" sx={{ display: "grid", gap: 1 }}>
        {!showConfigEditor && (
          <SelectorBar
            environments={environments}
            variants={variants}
            selectedEnvironmentKey={selectedEnvironmentKey}
            selectedVariantKey={selectedVariantKey}
            contentMode={contentMode}
            onEnvironmentChange={handleEnvironmentChange}
            onVariantChange={handleVariantChange}
            onContentModeChange={handleContentModeChange}
          />
        )}

        {selectedEnvironment?.description && <p style={{ margin: 0 }}>{selectedEnvironment.description}</p>}

        {showConfigEditor ? (
          <EditorLayout
            {...sharedProps}
            configFormProps={{
              config,
              onConfigChange: setConfig,
              hyogaScript,
              onHyogaScriptChange: setHyogaScript,
              showScriptInputs,
            }}
          />
        ) : (
          <PreviewLayout {...sharedProps} />
        )}
      </Box>
    </ThemeProvider>
  );
}
