import React from 'react';
import {
  CONFIG_FIELDS_BY_DOMAIN,
  DOMAIN_LABELS,
} from './configModel';

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
    <div style={{display: 'grid', gap: '0.75rem', maxWidth: 980}}>
      {showScriptInputs ? (
        <>
          <label>
            Hyoga script URL
            <input
              type="text"
              value={hyogaScript}
              onChange={(e) => onHyogaScriptChange(e.target.value)}
              style={{display: 'block', width: '100%'}}
            />
          </label>

          <label>
            Bowser script URL
            <input
              type="text"
              value={bowserScript}
              onChange={(e) => onBowserScriptChange(e.target.value)}
              style={{display: 'block', width: '100%'}}
            />
          </label>
        </>
      ) : null}

      {Object.keys(CONFIG_FIELDS_BY_DOMAIN).map((domain) => (
        <fieldset
          key={domain}
          style={{
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: 8,
            padding: '0.75rem',
          }}>
          <legend style={{padding: '0 0.25rem', fontWeight: 600}}>
            {DOMAIN_LABELS[domain]}
          </legend>

          <div style={{display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr'}}>
            {CONFIG_FIELDS_BY_DOMAIN[domain].map((fieldKey) => (
              <label key={fieldKey}>
                {fieldKey}
                <input
                  type="text"
                  value={config[fieldKey]}
                  onChange={(e) =>
                    onConfigChange((prev) => ({
                      ...prev,
                      [fieldKey]: e.target.value,
                    }))
                  }
                  style={{display: 'block', width: '100%'}}
                />
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
