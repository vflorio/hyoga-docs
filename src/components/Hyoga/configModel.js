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
  ads: ['adsystem', 'deferredadinit'],
  tracking: ['globaleventsmanager'],
};

export const DOMAIN_LABELS = {
  identity: 'Identity',
  runtime: 'Runtime',
  source: 'Source',
  behavior: 'Behavior',
  ads: 'Advertising',
  tracking: 'Tracking',
};

export const BASE_CONFIG_BY_DOMAIN = {
  // ----- Identity block -----
  identity: {
    id: 'hyogaManager-player-uuid-0',
    uid: 'player-uuid-0',
    playerselector: 'hyogaPlayer-player-uuid-0',
    playertype: 'videoPlayer',
    hyogamanager: 'hyogaManager-player-uuid-0',
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

  // ----- ads block -----
  ads: {
    adsystem: '',
    deferredadinit: 'false',
  },

  // ----- Tracking block -----
  tracking: {
    globaleventsmanager: '',
  },
};

export const DEFAULT_ENVIRONMENT_KEY = 'auroraProd';

export const ENVIRONMENT_DEFINITIONS = {
  auroraProd: {
    label: 'Aurora CMS (Prod)',
    description: "" ,
    domains: {
      runtime: {
        sourcetype: 'sonic',
        endpoint: 'https://public.aurora.enhanced.live',
        realm: 'it',
      },
      source: {
        assetid: '18322',
        playbacktype: 'video',
        sourceparams: '',
      },
      behavior: {
        autoplay: 'true',
        disableobserver: 'false',
      },
    },
  },
  auroraStage: {
    label: 'Aurora CMS (Stage)',
    description: "" ,
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
  sonic: {
    label: 'Sonic CMS',
    description: "" ,
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
};

export const VARIANT_DEFINITIONS = {
  autoplayVideo: {
    label: 'Autoplay video baseline',
    description: "" ,
    domains: {
      behavior: {
        autoplay: 'true',
      },
    },
  },
  withAds: {
    label: 'With FreeWheel ADs',
    description: "" ,
    domains: {
      ads: {
        adsystem: 'fw',
      },
    },
  },
  withAdsDeferred: {
    label: 'With FreeWheel ADs + Deferred AD Request',
    description: "" ,
    domains: {
      ads: {
        adsystem: 'fw',
        deferredadinit: 'true',
      },
    },
  },
  withTracker: {
    label: 'With Trackers',
    description: "" ,
    domains: {
      tracking: {
        globaleventsmanager: 'player-uuid-0@lomaEventsManager',
      },
    },
  },
  withGtag: {
    label: 'With Google Tag Manager',
    description: "",
    domains: {
      behavior: {
        autoplay: 'false',
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

function buildPartialFlatConfigFromDomains(domains) {
  const partialConfig = {};

  Object.keys(domains || {}).forEach((domain) => {
    const domainFields = CONFIG_FIELDS_BY_DOMAIN[domain] || [];
    domainFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(domains[domain], field)) {
        partialConfig[field] = domains[domain][field];
      }
    });
  });

  return partialConfig;
}

export function createEnvironmentConfig(environmentKey = DEFAULT_ENVIRONMENT_KEY) {
  const environment =
    ENVIRONMENT_DEFINITIONS[environmentKey] || ENVIRONMENT_DEFINITIONS[DEFAULT_ENVIRONMENT_KEY];
  const domains = mergeDomains(BASE_CONFIG_BY_DOMAIN, environment.domains);
  return buildFlatConfigFromDomains(domains);
}

export function createVariantConfig(variantKey) {
  const baseConfig = createEnvironmentConfig(DEFAULT_ENVIRONMENT_KEY);
  return applyVariant(baseConfig, variantKey);
}

export function applyEnvironment(config, environmentKey) {
  const environment =
    ENVIRONMENT_DEFINITIONS[environmentKey] || ENVIRONMENT_DEFINITIONS[DEFAULT_ENVIRONMENT_KEY];
  const environmentPatch = buildPartialFlatConfigFromDomains(environment.domains);

  return {
    ...config,
    ...environmentPatch,
  };
}

export function applyVariant(config, variantKey) {
  const variant = VARIANT_DEFINITIONS[variantKey] || VARIANT_DEFINITIONS.autoplayVideo;
  const variantPatch = buildPartialFlatConfigFromDomains(variant.domains);

  return {
    ...config,
    ...variantPatch,
  };
}

export function detectEnvironment(config) {
  if (!config?.endpoint && config?.sourcetype === 'sonic') {
    return 'sonic';
  }

  if (String(config?.endpoint || '').includes('stage-public.aurora.enhanced.live')) {
    return 'auroraStage';
  }

  return DEFAULT_ENVIRONMENT_KEY;
}

export function detectContentMode(config) {
  return config?.playbacktype === 'channel' ? 'channel' : 'video';
}

export function applyContentMode(config, contentModeKey) {
  const mode = CONTENT_MODE_DEFINITIONS[contentModeKey] || CONTENT_MODE_DEFINITIONS.video;
  const modeFlatConfig = buildPartialFlatConfigFromDomains(mode.domains);

  return {
    ...config,
    ...modeFlatConfig,
  };
}

export function getAvailableEnvironments(environmentKeys) {
  return environmentKeys
    .map((key) => ({
      key,
      ...ENVIRONMENT_DEFINITIONS[key],
    }))
    .filter((environment) => Boolean(environment.label));
}

export function getAvailableVariants(variantKeys) {
  return variantKeys
    .map((key) => ({
      key,
      ...VARIANT_DEFINITIONS[key],
    }))
    .filter((variant) => Boolean(variant.label));
}
