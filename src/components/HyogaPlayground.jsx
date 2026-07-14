import React, {useEffect, useMemo, useState} from 'react';

const DEFAULT_HYOGA_SCRIPT = 'https://cdn.hyogaplayer.com/hyoga-web.min.js';
const DEFAULT_BOWSER_SCRIPT =
  'https://cdnjs.cloudflare.com/ajax/libs/bowser/2.11.0/bundled.min.js';

const PRESETS = {
  video: {
    id: 'hyogaManagerff55a6baec1675e0d593e783e25dcd7f',
    uid: 'ff55a6baec1675e0d593e783e25dcd7f',
    playerselector: 'hyogaPlayer-ff55a6baec1675e0d593e783e25dcd7f',
    videolibrary: 'videojs',
    sourcetype: 'sonic',
    playertype: 'videoPlayer',
    adsystem: 'fw',
    locale: 'it',
    globaleventsmanager: 'ff55a6baec1675e0d593e783e25dcd7f@lomaEventsManager',
    hyogamanager: 'hyogaManagerff55a6baec1675e0d593e783e25dcd7f',
    disableobserver: 'false',
    endpoint: 'https://public.aurora.enhanced.live',
    realm: 'it',
    assetid: '18322',
    playbacktype: 'video',
    sourceparams: '',
    autoplay: 'false',
    muted: 'true',
    deferredadinit: 'false',
    hideoverlay: 'false',
  },
  channel: {
    id: 'hyogaManager',
    uid: '1234',
    playerselector: 'videoPlayer',
    videolibrary: 'videojs',
    sourcetype: 'sonic',
    playertype: 'videoPlayer',
    adsystem: '',
    locale: 'it',
    globaleventsmanager: '',
    hyogamanager: 'hyogaManager',
    disableobserver: 'true',
    endpoint: 'https://stage-public.aurora.enhanced.live',
    realm: 'it',
    assetid: '6',
    playbacktype: 'channel',
    sourceparams: 'aws.manifestsettings=start:1740997225',
    autoplay: 'false',
    muted: 'true',
    deferredadinit: '',
    hideoverlay: '',
  },
};

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

export default function HyogaPlayground() {
  const [preset, setPreset] = useState('video');
  const [hyogaScript, setHyogaScript] = useState(DEFAULT_HYOGA_SCRIPT);
  const [bowserScript, setBowserScript] = useState(DEFAULT_BOWSER_SCRIPT);
  const [cfg, setCfg] = useState({...PRESETS.video});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  const rerenderKey = useMemo(() => Object.values(cfg).join('|'), [cfg]);

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
      <p>
        Runtime demo with real custom elements, based on your two base configs
        (video and channel).
      </p>

      <div style={{display: 'grid', gap: '0.75rem', maxWidth: 980}}>
        <label>
          Preset
          <select
            value={preset}
            onChange={(e) => {
              const selected = e.target.value;
              setPreset(selected);
              setCfg({...PRESETS[selected]});
            }}
            style={{display: 'block', width: '100%'}}>
            <option value="video">video preset (assetid 18322)</option>
            <option value="channel">channel preset (assetid 6)</option>
          </select>
        </label>

        <label>
          Hyoga script URL
          <input
            type="text"
            value={hyogaScript}
            onChange={(e) => setHyogaScript(e.target.value)}
            style={{display: 'block', width: '100%'}}
          />
        </label>

        <label>
          Bowser script URL
          <input
            type="text"
            value={bowserScript}
            onChange={(e) => setBowserScript(e.target.value)}
            style={{display: 'block', width: '100%'}}
          />
        </label>

        <div style={{display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr'}}>
          {Object.keys(cfg).map((key) => (
            <label key={key}>
              {key}
              <input
                type="text"
                value={cfg[key]}
                onChange={(e) => setCfg((x) => ({...x, [key]: e.target.value}))}
                style={{display: 'block', width: '100%'}}
              />
            </label>
          ))}
        </div>
      </div>

      {error ? (
        <p style={{color: '#b42318'}}>{error}</p>
      ) : (
        <p>{ready ? 'Scripts loaded. Player mounted below.' : 'Loading scripts...'}</p>
      )}

      <div
        style={{
          marginTop: 12,
          width: '100%',
          maxWidth: 960,
          aspectRatio: '16/9',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 8,
          overflow: 'hidden',
          background: '#000',
        }}>
        {ready && !error ? (
          <hyoga-player
            key={rerenderKey}
            id={cfg.id}
            uid={cfg.uid}
            playerselector={cfg.playerselector}
            videolibrary={cfg.videolibrary}
            sourcetype={cfg.sourcetype}
            playertype={valueOrUndefined(cfg.playertype)}
            adsystem={valueOrUndefined(cfg.adsystem)}
            locale={cfg.locale}
            globaleventsmanager={valueOrUndefined(cfg.globaleventsmanager)}
            hyogamanager={valueOrUndefined(cfg.hyogamanager)}
            disableobserver={valueOrUndefined(cfg.disableobserver)}
            endpoint={cfg.endpoint}
            realm={cfg.realm}
            assetid={cfg.assetid}
            playbacktype={cfg.playbacktype}
            sourceparams={valueOrUndefined(cfg.sourceparams)}
            autoplay={cfg.autoplay}
            muted={cfg.muted}
            deferredadinit={valueOrUndefined(cfg.deferredadinit)}
            hideoverlay={valueOrUndefined(cfg.hideoverlay)}
            style={{display: 'block', width: '100%', height: '100%'}}>
            <hyoga-videoplayer hyogamanager={cfg.id} />
          </hyoga-player>
        ) : null}
      </div>
    </div>
  );
}
