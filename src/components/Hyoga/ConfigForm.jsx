import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { CONFIG_FIELDS_BY_DOMAIN, DOMAIN_LABELS } from "./configModel";

const UID_DERIVED_FIELDS = {
  id: (uid) => `hyogaManager-${uid}`,
  playerselector: (uid) => `hyogaPlayer-${uid}`,
  hyogamanager: (uid) => `hyogaManager-${uid}`,
  globaleventsmanager: (uid) => `${uid}@lomaEventsManager`,
};

function handleUidChange(newUid, onConfigChange) {
  onConfigChange((prev) => {
    const updates = { uid: newUid };
    for (const [field, derive] of Object.entries(UID_DERIVED_FIELDS)) {
      updates[field] = derive(newUid);
    }
    return { ...prev, ...updates };
  });
}

export default function ConfigForm({
  config,
  onConfigChange,
  hyogaScript,
  onHyogaScriptChange,
  bowserScript,
  onBowserScriptChange,
  showScriptInputs = true,
}) {
  return (
    <Box sx={{ display: "grid", gap: 2, maxWidth: 980 }}>
      {showScriptInputs && (
        <Box sx={{ display: "grid", gap: 1.5 }}>
          <TextField
            label="Hyoga script URL"
            size="small"
            fullWidth
            value={hyogaScript}
            onChange={(e) => onHyogaScriptChange(e.target.value)}
          />
          <TextField
            label="Bowser script URL"
            size="small"
            fullWidth
            value={bowserScript}
            onChange={(e) => onBowserScriptChange(e.target.value)}
          />
        </Box>
      )}

      {Object.keys(CONFIG_FIELDS_BY_DOMAIN)
        .filter((fieldKey) => CONFIG_FIELDS_BY_DOMAIN[fieldKey].length > 0)
        .map((domain) => (
          <Box
            key={domain}
            component="fieldset"
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              p: 1.5,
            }}
          >
            <Typography component="legend" variant="subtitle2" sx={{ px: 0.5 }}>
              {DOMAIN_LABELS[domain]}
            </Typography>

            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "1fr 1fr" }}>
              {CONFIG_FIELDS_BY_DOMAIN[domain].map((fieldKey) => (
                <TextField
                  key={fieldKey}
                  label={fieldKey}
                  size="small"
                  value={config[fieldKey] ?? ""}
                  sx={{ mt: 0.5 }}
                  disabled={domain === "identity" && fieldKey in UID_DERIVED_FIELDS}
                  onChange={(e) => {
                    if (fieldKey === "uid") {
                      handleUidChange(e.target.value, onConfigChange);
                    } else {
                      onConfigChange((prev) => ({
                        ...prev,
                        [fieldKey]: e.target.value,
                      }));
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
    </Box>
  );
}
