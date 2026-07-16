import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { CONFIG_FIELDS_BY_DOMAIN, DOMAIN_LABELS, FIELD_META } from "./configModel";

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
              {CONFIG_FIELDS_BY_DOMAIN[domain].map((fieldKey) => {
                const meta = FIELD_META[fieldKey];
                const isDisabled = domain === "identity" && fieldKey in UID_DERIVED_FIELDS;
                const value = config[fieldKey] ?? "";
                const handleChange = (e) => {
                  if (fieldKey === "uid") {
                    handleUidChange(e.target.value, onConfigChange);
                  } else {
                    onConfigChange((prev) => ({
                      ...prev,
                      [fieldKey]: e.target.value,
                    }));
                  }
                };

                if (meta?.type === "select" && meta.options) {
                  return (
                    <TextField
                      key={fieldKey}
                      label={fieldKey}
                      size="small"
                      select
                      value={value}
                      sx={{ mt: 0.5 }}
                      disabled={isDisabled}
                      helperText={meta.description}
                      onChange={handleChange}
                    >
                      {meta.options.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt || <em>none</em>}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }

                return (
                  <TextField
                    key={fieldKey}
                    label={fieldKey}
                    size="small"
                    value={value}
                    sx={{ mt: 0.5 }}
                    disabled={isDisabled}
                    helperText={meta?.description}
                    onChange={handleChange}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
    </Box>
  );
}
