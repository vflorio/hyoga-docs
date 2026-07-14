export const DEFAULT_HYOGA_SCRIPT = 'https://cdn.hyogaplayer.com/hyoga-web.min.js';
export const DEFAULT_BOWSER_SCRIPT =
  'https://cdnjs.cloudflare.com/ajax/libs/bowser/2.11.0/bundled.min.js';

export const CONFIG_FIELDS_BY_DOMAIN = {
  identity: [
    'id',
    'uid',
    'playerselector',
    'playertype',
    'hyogamanager',
  ],
  runtime: ['videolibrary', 'sourcetype', 'locale', 'realm', 'endpoint'],
  source: ['assetid', 'playbacktype', 'sourceparams'],
  behavior: ['autoplay', 'muted', 'hideoverlay', 'disableobserver'],
  monetization: ['adsystem', 'deferredadinit'],
  tracking: ['globaleventsmanager', 'waitforgtag', 'gtagreadyvar'],
};

export const DOMAIN_LABELS = {
  identity: 'Identity',
  runtime: 'Runtime',
  source: 'Source',
  behavior: 'Behavior',
  monetization: 'Monetization',
  tracking: 'Tracking',
};

export const BASE_CONFIG_BY_DOMAIN = {
  // ----- Identity block -----
  identity: {
    id: 'hyogaManagerff55a6baec1675e0d593e783e25dcd7f',
    uid: 'ff55a6baec1675e0d593e783e25dcd7f',
    playerselector: 'hyogaPlayer-ff55a6baec1675e0d593e783e25dcd7f',
    playertype: 'videoPlayer',
    hyogamanager: 'hyogaManagerff55a6baec1675e0d593e783e25dcd7f',
  },

  // ----- Runtime block -----
  runtime: {
    videolibrary: 'videojs',
    sourcetype: 'sonic',
    locale: 'it',
    realm: 'it',
    endpoint: 'https://public.aurora.enhanced.live',
  },

  // ----- Source block -----
  source: {
    assetid: '18322',
    playbacktype: 'video',
    sourceparams: '',
  },

  // ----- Behavior block -----
  behavior: {
    autoplay: 'true',
    muted: 'true',
    hideoverlay: 'false',
    disableobserver: 'false',
  },

  // ----- Monetization block -----
  monetization: {
    adsystem: '',
    deferredadinit: 'false',
  },

  // ----- Tracking block -----
  tracking: {
    globaleventsmanager: '',
    waitforgtag: 'false',
    gtagreadyvar: '',
  },
};

export const VARIANT_DEFINITIONS = {
  autoplayVideo: {
    label: 'Autoplay Video (default home)',
    description: 'Preconfigured autoplay video on Aurora production.',
    domains: {},
  },
  auroraProd: {
    label: 'Aurora prod',
    description: 'Production endpoint with video playback.',
    domains: {
      runtime: {
        endpoint: 'https://public.aurora.enhanced.live',
      },
      source: {
        assetid: '18322',
        playbacktype: 'video',
      },
    },
  },
  auroraStage: {
    label: 'Aurora stage',
    description: 'Stage endpoint with channel playback and source params.',
    domains: {
      runtime: {
        endpoint: 'https://stage-public.aurora.enhanced.live',
      },
      source: {
        assetid: '6',
        playbacktype: 'channel',
        sourceparams: 'aws.manifestsettings=start:1740997225',
      },
      behavior: {
        autoplay: 'false',
      },
    },
  },
  sonic: {
    label: 'Sonic',
    description:
      'Sonic placeholder variant. Keep implementation details empty for now.',
    domains: {
      runtime: {
        sourcetype: 'sonic',
        endpoint: '',
        realm: '',
      },
      source: {
        assetid: '',
        playbacktype: 'video',
        sourceparams: '',
      },
    },
  },
  withAds: {
    label: 'With FreeWheel ADs',
    description: 'Enable ad system on top of autoplay video.',
    domains: {
      monetization: {
        adsystem: 'fw',
      },
    },
  },
  withAdsDeferred: {
    label: 'With FreeWheel ADs + Deferred AD Request',
    description: 'Enable ad system and defer ad init.',
    domains: {
      monetization: {
        adsystem: 'fw',
        deferredadinit: 'true',
      },
    },
  },
  withTracker: {
    label: 'With tracker',
    description: 'Attach a global events manager for trackers integration.',
    domains: {
      tracking: {
        globaleventsmanager: 'ff55a6baec1675e0d593e783e25dcd7f@lomaEventsManager',
      },
    },
  },
  withGtag: {
    label: 'With G-TAG',
    description:
      'Placeholder variant: playback is expected to wait for a Google tag readiness variable on window.',
    domains: {
      behavior: {
        autoplay: 'false',
      },
      tracking: {
        waitforgtag: 'true',
        gtagreadyvar: '__HYOGA_GTAG_READY__',
      },
    },
  },
};

export const CONTENT_MODE_DEFINITIONS = {
  video: {
    label: 'Video',
    domains: {
      source: {
        playbacktype: 'video',
        assetid: '18322',
        sourceparams: '',
      },
      behavior: {
        autoplay: 'true',
        disableobserver: 'false',
      },
    },
  },
  channel: {
    label: 'Channel',
    // Values derived from /home/vflorio/dev/wbd/hyoga/index-videojs.html sample
    domains: {
      runtime: {
        sourcetype: 'sonic',
        endpoint: 'https://stage-public.aurora.enhanced.live',
        realm: 'it',
      },
      source: {
        playbacktype: 'channel',
        assetid: '6',
        sourceparams: 'aws.manifestsettings=start:1740997225',
      },
      behavior: {
        autoplay: 'false',
        disableobserver: 'true',
      },
    },
  },
};

function mergeDomains(baseDomains, overrideDomains = {}) {
  const merged = {};

  Object.keys(baseDomains).forEach((domain) => {
    merged[domain] = {
      ...baseDomains[domain],
      ...(overrideDomains[domain] || {}),
    };
  });

  return merged;
}

export function buildFlatConfigFromDomains(domains) {
  const flatConfig = {};

  Object.keys(CONFIG_FIELDS_BY_DOMAIN).forEach((domain) => {
    CONFIG_FIELDS_BY_DOMAIN[domain].forEach((field) => {
      flatConfig[field] = domains[domain]?.[field] ?? '';
    });
  });

  return flatConfig;
}

export function createVariantConfig(variantKey) {
  const variant = VARIANT_DEFINITIONS[variantKey] || VARIANT_DEFINITIONS.autoplayVideo;
  const domains = mergeDomains(BASE_CONFIG_BY_DOMAIN, variant.domains);
  return buildFlatConfigFromDomains(domains);
}

export function detectContentMode(config) {
  return config?.playbacktype === 'channel' ? 'channel' : 'video';
}

export function applyContentMode(config, contentModeKey) {
  const mode = CONTENT_MODE_DEFINITIONS[contentModeKey] || CONTENT_MODE_DEFINITIONS.video;
  const modeFlatConfig = buildFlatConfigFromDomains(mode.domains);

  return {
    ...config,
    ...modeFlatConfig,
  };
}

export function getAvailableVariants(variantKeys) {
  return variantKeys
    .map((key) => ({
      key,
      ...VARIANT_DEFINITIONS[key],
    }))
    .filter((variant) => Boolean(variant.label));
}
