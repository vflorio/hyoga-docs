import React, {useMemo, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import ConfigForm from './Hyoga/ConfigForm';
import Player from './Hyoga/Player';
import {
  CONTENT_MODE_DEFINITIONS,
  applyContentMode,
  detectContentMode,
  DEFAULT_BOWSER_SCRIPT,
  DEFAULT_HYOGA_SCRIPT,
  createVariantConfig,
  getAvailableVariants,
} from './Hyoga/configModel';

const PLAYER_ATTRIBUTE_ORDER = [
  'id',
  'uid',
  'playerselector',
  'videolibrary',
  'sourcetype',
  'playertype',
  'adsystem',
  'locale',
  'globaleventsmanager',
  'hyogamanager',
  'disableobserver',
  'endpoint',
  'realm',
  'assetid',
  'playbacktype',
  'sourceparams',
  'autoplay',
  'muted',
  'deferredadinit',
  'hideoverlay',
  'waitforgtag',
  'gtagreadyvar',
];

function escapeAttrValue(value) {
  return String(value).replace(/"/g, '&quot;');
}

function buildPlayerDomCode(config) {
  const attrs = PLAYER_ATTRIBUTE_ORDER.map((key) => [key, config[key]])
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `  ${key}="${escapeAttrValue(value)}"`)
    .join('\n');

  const manager = config.hyogamanager || config.id || '';

  return `<hyoga-player\n${attrs}\n>\n  <hyoga-videoplayer hyogamanager="${escapeAttrValue(manager)}" />\n</hyoga-player>`;
}

export default function Experience({
  title = 'Hyoga Player',
  subtitle = '',
  initialVariantKey = 'autoplayVideo',
  variantKeys = ['autoplayVideo'],
  showConfigEditor = false,
  showScriptInputs = false,
}) {
  const variants = useMemo(() => getAvailableVariants(variantKeys), [variantKeys]);

  const [selectedVariantKey, setSelectedVariantKey] = useState(initialVariantKey);
  const [config, setConfig] = useState(() => createVariantConfig(initialVariantKey));
  const [contentMode, setContentMode] = useState(() =>
    detectContentMode(createVariantConfig(initialVariantKey))
  );
  const [hyogaScript, setHyogaScript] = useState(DEFAULT_HYOGA_SCRIPT);
  const [bowserScript, setBowserScript] = useState(DEFAULT_BOWSER_SCRIPT);

  const selectedVariant = variants.find((variant) => variant.key === selectedVariantKey);
  const domCode = useMemo(() => buildPlayerDomCode(config), [config]);

  return (
    <section style={{display: 'grid', gap: '1rem'}}>
      <div>
        <h2 style={{marginBottom: '0.35rem'}}>{title}</h2>
        {subtitle ? <p style={{margin: 0}}>{subtitle}</p> : null}
      </div>

      {variants.length > 1 ? (
        <label style={{maxWidth: 480}}>
          Variant
          <select
            value={selectedVariantKey}
            onChange={(e) => {
              const nextKey = e.target.value;
              const nextConfig = createVariantConfig(nextKey);
              setSelectedVariantKey(nextKey);
              setConfig(nextConfig);
              setContentMode(detectContentMode(nextConfig));
            }}
            style={{display: 'block', width: '100%'}}>
            {variants.map((variant) => (
              <option key={variant.key} value={variant.key}>
                {variant.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {selectedVariant?.description ? (
        <p style={{margin: 0}}>{selectedVariant.description}</p>
      ) : null}

      {showConfigEditor ? (
        <label style={{maxWidth: 320}}>
          Content mode
          <select
            value={contentMode}
            onChange={(e) => {
              const nextMode = e.target.value;
              setContentMode(nextMode);
              setConfig((prev) => applyContentMode(prev, nextMode));
            }}
            style={{display: 'block', width: '100%'}}>
            {Object.entries(CONTENT_MODE_DEFINITIONS).map(([modeKey, mode]) => (
              <option key={modeKey} value={modeKey}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {showConfigEditor ? (
        <ConfigForm
          config={config}
          onConfigChange={setConfig}
          hyogaScript={hyogaScript}
          onHyogaScriptChange={setHyogaScript}
          bowserScript={bowserScript}
          onBowserScriptChange={setBowserScript}
          showScriptInputs={showScriptInputs}
        />
      ) : null}

      <Player
        config={config}
        hyogaScript={hyogaScript}
        bowserScript={bowserScript}
      />

        <div style={{marginTop: '0.75rem', maxWidth: '960px'}}>
          <CodeBlock language="html">{domCode}</CodeBlock>
        </div>

      <details>
        <summary>Applied settings</summary>
        <pre
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            borderRadius: 8,
            background: 'var(--ifm-code-background)',
            overflowX: 'auto',
          }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </details>


    </section>
  );
}
