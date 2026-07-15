import React, { useMemo, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';
import ConfigForm from './Hyoga/ConfigForm';
import Player from './Hyoga/Player';
import {
  CONTENT_MODE_DEFINITIONS,
  DEFAULT_ENVIRONMENT_KEY,
  applyVariant,
  applyContentMode,
  detectContentMode,
  DEFAULT_BOWSER_SCRIPT,
  DEFAULT_HYOGA_SCRIPT,
  createEnvironmentConfig,
  getAvailableVariants,
  getAvailableEnvironments,
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

export default function HyogaExperience({
  title = '',
  subtitle = '',
  initialVariantKey = 'autoplayVideo',
  initialEnvironmentKey = DEFAULT_ENVIRONMENT_KEY,
  variantKeys = ['autoplayVideo'],
  environmentKeys = [DEFAULT_ENVIRONMENT_KEY],
  showConfigEditor = false,
  showScriptInputs = false,
}) {
  const variants = useMemo(() => getAvailableVariants(variantKeys), [variantKeys]);
  const environments = useMemo(
    () => getAvailableEnvironments(environmentKeys),
    [environmentKeys]
  );

  const [selectedEnvironmentKey, setSelectedEnvironmentKey] = useState(initialEnvironmentKey);
  const [selectedVariantKey, setSelectedVariantKey] = useState(initialVariantKey);
  const [config, setConfig] = useState(() => {
    let initialConfig = createEnvironmentConfig(initialEnvironmentKey);
    initialConfig = applyVariant(initialConfig, initialVariantKey);
    return initialConfig;
  });

  const [displayJson, setDisplayJson] = useState(false);
  const [contentMode, setContentMode] = useState(() =>
    detectContentMode(config)
  );
  const [hyogaScript, setHyogaScript] = useState(DEFAULT_HYOGA_SCRIPT);
  const [bowserScript, setBowserScript] = useState(DEFAULT_BOWSER_SCRIPT);

  const selectedVariant = variants.find((variant) => variant.key === selectedVariantKey);
  const selectedEnvironment = environments.find(
    (environment) => environment.key === selectedEnvironmentKey
  );
  const domCode = useMemo(() => buildPlayerDomCode(config), [config]);

  function composeConfig(environmentKey, variantKey, modeKey) {
    let next = createEnvironmentConfig(environmentKey);
    next = applyVariant(next, variantKey);
    next = applyContentMode(next, modeKey);
    return next;
  }

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      {variants.length > 1 ? (
        <label style={{ maxWidth: 480 }}>
          Variant
          <select
            value={selectedVariantKey}
            onChange={(e) => {
              const nextKey = e.target.value;
              setSelectedVariantKey(nextKey);
              setConfig(composeConfig(selectedEnvironmentKey, nextKey, contentMode));
            }}
            style={{ display: 'block', width: '100%' }}>
            {variants.map((variant) => (
              <option key={variant.key} value={variant.key}>
                {variant.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {selectedVariant?.description ? (
        <p style={{ margin: 0 }}>{selectedVariant.description}</p>
      ) : null}

      {environments.length > 1 ? (
        <label style={{ maxWidth: 480 }}>
          Environment
          <select
            value={selectedEnvironmentKey}
            onChange={(e) => {
              const nextEnvironmentKey = e.target.value;
              const nextConfig = composeConfig(
                nextEnvironmentKey,
                selectedVariantKey,
                contentMode
              );
              setSelectedEnvironmentKey(nextEnvironmentKey);
              setConfig(nextConfig);
              setContentMode(detectContentMode(nextConfig));
            }}
            style={{ display: 'block', width: '100%' }}>
            {environments.map((environment) => (
              <option key={environment.key} value={environment.key}>
                {environment.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {selectedEnvironment?.description ? (
        <p style={{ margin: 0 }}>{selectedEnvironment.description}</p>
      ) : null}

      {showConfigEditor ? (
        <label style={{ maxWidth: 320 }}>
          Content mode
          <select
            value={contentMode}
            onChange={(e) => {
              const nextMode = e.target.value;
              setContentMode(nextMode);
              setConfig(composeConfig(selectedEnvironmentKey, selectedVariantKey, nextMode));
            }}
            style={{ display: 'block', width: '100%' }}>
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

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',
      }}>
        <Player
          config={config}
          hyogaScript={hyogaScript}
          bowserScript={bowserScript}
        />
        <div>
          <form>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={displayJson}
                onChange={(e) => setDisplayJson(e.target.checked)}
              />
              JSON
            </label>
          </form>
          <div style={{ marginTop: '0.75rem', maxWidth: '900px', minWidth: '300px' }}>
            {displayJson ? (
              <CodeBlock language={"json"}>{JSON.stringify(config, null, 2)}</CodeBlock>
            ) :
              <CodeBlock language={"html"}>{domCode}</CodeBlock>
            }
          </div>
        </div>
      </div>
    </section>
  );
}
