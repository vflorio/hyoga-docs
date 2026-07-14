import React, {useEffect, useMemo, useState} from 'react';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-hyoga-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.hyogaSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

function valueOrUndefined(value) {
  return value === '' ? undefined : value;
}

export default function HyogaRuntimePlayer({
  config,
  hyogaScript,
  bowserScript,
  maxWidth = 960,
}) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  const rerenderKey = useMemo(() => Object.values(config).join('|'), [config]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setReady(false);
      setError('');

      try {
        await loadScript(bowserScript);
        await loadScript(hyogaScript);
        if (!mounted) return;

        const hasHyoga =
          typeof window !== 'undefined' &&
          window.customElements &&
          window.customElements.get('hyoga-player') &&
          window.customElements.get('hyoga-videoplayer');

        if (!hasHyoga) {
          throw new Error('Hyoga custom elements are not available after script load');
        }

        setReady(true);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Unknown script load error');
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [hyogaScript, bowserScript]);

  return (
    <div>
      {error ? (
        <p style={{color: '#b42318'}}>{error}</p>
      ) : (
        <p>{ready ? 'Scripts loaded. Player mounted below.' : 'Loading scripts...'}</p>
      )}

      <div
        style={{
          marginTop: 12,
          width: '100%',
          maxWidth,
          aspectRatio: '16/9',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 8,
          overflow: 'hidden',
          background: '#000',
        }}>
        {ready && !error ? (
          <hyoga-player
            key={rerenderKey}
            id={config.id}
            uid={config.uid}
            playerselector={config.playerselector}
            videolibrary={config.videolibrary}
            sourcetype={config.sourcetype}
            playertype={valueOrUndefined(config.playertype)}
            adsystem={valueOrUndefined(config.adsystem)}
            locale={config.locale}
            globaleventsmanager={valueOrUndefined(config.globaleventsmanager)}
            hyogamanager={valueOrUndefined(config.hyogamanager)}
            disableobserver={valueOrUndefined(config.disableobserver)}
            endpoint={config.endpoint}
            realm={config.realm}
            assetid={config.assetid}
            playbacktype={config.playbacktype}
            sourceparams={valueOrUndefined(config.sourceparams)}
            autoplay={config.autoplay}
            muted={config.muted}
            deferredadinit={valueOrUndefined(config.deferredadinit)}
            hideoverlay={valueOrUndefined(config.hideoverlay)}
            waitforgtag={valueOrUndefined(config.waitforgtag)}
            gtagreadyvar={valueOrUndefined(config.gtagreadyvar)}
            style={{display: 'block', width: '100%', height: '100%'}}>
            <hyoga-videoplayer hyogamanager={config.hyogamanager || config.id} />
          </hyoga-player>
        ) : null}
      </div>
    </div>
  );
}
