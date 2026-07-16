export const DEFAULT_HYOGA_SCRIPT = "https://cdn.hyogaplayer.com/hyoga-web.min.js";

export const EXTERNAL_DEPENDENCIES = [
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/bowser/2.11.0/bundled.min.js" integrity="sha512-hsF/cpBvi/vjCP4Ps/MrPUFk6l4BqcGbzVUhqjJdX2SmAri1Oj8FBUGCvBiKHYd6gg3vLsV16CtIRNOvK5X4lQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>',
];

// Necessario per simulare consenso cookie accettato
const DEFAULT_TCF_RESPONSE = {
  cmpId: 28,
  cmpVersion: 1,
  gdprApplies: true,
  tcfPolicyVersion: 5,
  tcString:
    "CQRcrfAQRcrfAAcABBITBqFwAP_AAAAAABCYJwwCAAKgAgAEIAO8AjoC8wGMwTgBOEAAAAwSAKABUAEAAhAB3gLzHQBgAKgAgAHeAR0BeYE4SEAEAd5KAGAO8BeYE4SkAUACoAIAB3gEdAXmUAAgThAA.f_gAAAAAAAAA",
  eventStatus: "tcloaded",
  cmpStatus: "loaded",
  purpose: {
    consents: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
      10: true,
    },
  },
};

// FreeWheel Config
const DEFAULT_FW_CONFIG = {
  networkId: 386345,
  profile: "386345:DiscoverySBS_html5_live_secure",
  server: "https://5e529.v.fwmrm.net/ad/g/1",
  sitePrefix: "ITALY_VERTICAL_DMAX",
  fallbackSiteId: 16383109,
  splitHTML5: false,
  appendPrimary: true,
  dynamicSlots: true,
  videoJS: true,
  detectBC: true,
  scanDelay: 1000,
  dontUseDomReady: true,
  channelCaid: "LINEAR_CHANNEL_323",
  metaData: {
    foo: "",
  },
  pageMatch: {},
};

// FreeWheel Ad Meta
const DEFAULT_AD_META = {
  channel: "dmaxit",
  country: "it",
  pagetype: "showpage",
  pagename: "mr-oro-tutto-ha-un-prezzo",
  category: null,
};

// Necessario per Tracker Adobe
const DEFAULT_DIGITAL_DATA = {
  environment: {
    // NON VIENE USATO SU dmax.it
    //siteId: "tlc",
    //languageCode: "de",
    //countryCode: "DE",
    //versionNum: "4.6.0",
    //appType: "web",
    //timestamp: "11:00 am:wednesday",
  },
};

const DEFAULT_TRACKERS = [
  {
    name: "VideoDebugger",
    class: "VideoDebugger",
    events: [
      "load",
      "loadstart",
      "sourceloaded",
      "durationchange",
      "loadedmetadata",
      "loadeddata",
      "canplay",
      "play",
      "playing",
      "pause",
      "seeking",
      "seeked",
      "waiting",
      "ended",
      "play-request",
      "dispose",
      "ads-load",
      "ads-request-init",
      "ads-request-success",
      "ads-request-error",
      "ads-has-linearslots",
      "ads-no-linearslots",
      "ads-has-preroll",
      "ads-no-preroll",
      "ads-has-midroll",
      "ads-no-midroll",
      "ads-has-postroll",
      "ads-no-postroll",
      "ads-has-overlay",
      "ads-no-overlay",
      "ads-playprerolls",
      "ads-endedprerolls",
      "ads-playmidrolls",
      "ads-endedmidrolls",
      "ads-playpostrolls",
      "ads-endedpostrolls",
      "ads-playoverlays",
      "ads-endedoverlays",
      "ads-pod-started",
      "ads-pod-ended",
      "ads-ad-started",
      "ads-first-quartile",
      "ads-midpoint",
      "ads-third-quartile",
      "ads-ad-ended",
      "ads-play",
      "ads-pause",
      "ads-click",
      "ads-error",
    ],
  },
];

const LOMA_EVENTS_MANAGER_SNIPPET = [].join("\n");

function deepMerge(baseValue, overrideValue) {
  if (Array.isArray(baseValue) || Array.isArray(overrideValue)) {
    return overrideValue !== undefined ? overrideValue : baseValue;
  }

  if (baseValue && overrideValue && typeof baseValue === "object" && typeof overrideValue === "object") {
    const merged = { ...baseValue };

    Object.keys(overrideValue).forEach((key) => {
      merged[key] = deepMerge(baseValue[key], overrideValue[key]);
    });

    return merged;
  }

  return overrideValue !== undefined ? overrideValue : baseValue;
}

function cloneValue(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function createCurrentTimestamp() {
  const now = new Date();
  const time = now.toLocaleString("en-US", { timeStyle: "short" }).toLowerCase();
  const weekday = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
  return `${time}:${weekday}`;
}

function withDynamicDigitalData(baseValue) {
  return {
    ...cloneValue(baseValue),
    environment: {
      ...cloneValue(baseValue.environment),
      timestamp: createCurrentTimestamp(),
    },
  };
}

export const GLOBAL_MODULE_DEFINITIONS = {
  lomaEventsManager: {
    label: "Loma events manager shim",
    code: LOMA_EVENTS_MANAGER_SNIPPET,
  },
  consentStub: {
    label: "TCF consent stub",
    globals: {
      __tcfapiResponse: DEFAULT_TCF_RESPONSE,
    },
    code: [
      "window.__tcfapi = (command, version, callback) => {",
      "  if (typeof callback === 'function') callback(window.__tcfapiResponse, true);",
      "};",
    ].join("\n"),
  },
  freewheelConfig: {
    label: "FreeWheel config",
    globals: {
      fwConfigOpts: DEFAULT_FW_CONFIG,
      adMeta: DEFAULT_AD_META,
    },
  },
  analyticsContext: {
    label: "Analytics context",
    globals: {
      //digitalData: DEFAULT_DIGITAL_DATA,
    },
    transformGlobals(globals) {
      return {
        ...globals,
        //digitalData: withDynamicDigitalData(globals.digitalData),
      };
    },
  },
  trackers: {
    label: "Video trackers",
    globals: {
      _eventsVideoTrackers: DEFAULT_TRACKERS,
    },
  },
  gtag: {
    label: "Google Tag Manager bridge",
    globals: {
      useGTM: true,
      dataLayer: [],
      gtagConfig: {
        measurementId: "G-TGE3CT7CP4",
        options: {
          custom_map: {
            dimension1: "adblock",
            dimension2: "player_show_name",
            dimension3: "player_video_name",
          },
          user_properties: {
            session_id: "1234",
          },
        },
      },
    },
    code: [
      "window.dataLayer = window.dataLayer || [];",
      "window.gtag = window.gtag || function gtag() {",
      "  window.dataLayer.push(arguments);",
      "};",
      "window.gtag('js', new Date());",
      "if (window.gtagConfig?.measurementId) {",
      "  window.gtag('config', window.gtagConfig.measurementId, window.gtagConfig.options || {});",
      "}",
    ].join("\n"),
  },
};

/**
 * Field metadata: defines input type and allowed values for each attribute.
 * - type: 'select' renders a dropdown, 'text' renders a free-text input
 * - options: array of allowed values (only for 'select' fields)
 * - required: whether the attribute is required
 * - description: short description for tooltips/docs
 */
export const FIELD_META = {
  // Identity
  id: { type: "text", required: true, description: "Unique Hyoga manager identifier" },
  uid: { type: "text", required: true, description: "Player UID, used as key in the EventsManager" },
  playerselector: { type: "text", required: false, description: "CSS selector for the inner video element" },
  hyogamanager: { type: "text", required: false, description: "Hyoga manager reference" },
  globaleventsmanager: { type: "text", required: true, description: "Format <uid>@<globalVarName>" },
  // Runtime
  videolibrary: {
    type: "select",
    required: false,
    options: ["videojs", "dashjs", "hlsjs"],
    description: "Underlying player engine",
  },
  sourcetype: { type: "select", required: false, options: ["sonic", "direct"], description: "Content source type" },
  locale: { type: "text", required: false, description: "Language code (2 letters)" },
  realm: { type: "text", required: true, description: "Sonic realm" },
  endpoint: { type: "text", required: true, description: "Sonic API endpoint URL" },
  // Source
  assetid: { type: "text", required: true, description: "Sonic video/channel ID" },
  playbacktype: { type: "select", required: false, options: ["video", "channel"], description: "Playback type" },
  sourceparams: { type: "text", required: false, description: "Custom query params appended to the playback URL" },
  // Behavior
  autoplay: { type: "select", required: false, options: ["true", "false"], description: "Auto-start playback" },
  muted: { type: "select", required: false, options: ["true", "false"], description: "Start muted" },
  hideoverlay: {
    type: "select",
    required: false,
    options: ["true", "false"],
    description: "Hide the default Hyoga overlay",
  },
  disableobserver: {
    type: "select",
    required: false,
    options: ["true", "false"],
    description: "Disable IntersectionObserver-based pause/resume",
  },
  // Ads
  adsystem: { type: "select", required: false, options: ["", "fw", "ima"], description: "Ad system" },
  deferredadinit: {
    type: "select",
    required: false,
    options: ["true", "false"],
    description: "Defer ad request until user interaction",
  },
};

export const CONFIG_FIELDS_BY_DOMAIN = {
  identity: ["id", "uid", "playerselector", "hyogamanager", "globaleventsmanager"],
  runtime: ["videolibrary", "sourcetype", "locale", "realm", "endpoint"],
  source: ["assetid", "playbacktype", "sourceparams"],
  behavior: ["autoplay", "muted", "hideoverlay", "disableobserver"],
  ads: [
    //  "adsystem", "deferredadinit"
  ],
};

export const DOMAIN_LABELS = {
  identity: "Identity",
  runtime: "Runtime",
  source: "Source",
  behavior: "Behavior",
  ads: "Advertising",
};

export const BASE_CONFIG_BY_DOMAIN = {
  identity: {
    id: "hyogaManager-player-uuid-0",
    uid: "player-uuid-0",
    playerselector: "hyogaPlayer-player-uuid-0",
    hyogamanager: "hyogaManager-player-uuid-0",
    globaleventsmanager: "uuid-0@lomaEventsManager",
  },
  runtime: {
    videolibrary: "videojs",
    sourcetype: "sonic",
    locale: "it",
    realm: "it",
    endpoint: "https://public.aurora.enhanced.live",
  },
  source: {
    playbacktype: "video",
    assetid: "18322",
    sourceparams: "",
  },
  behavior: {
    autoplay: "true",
    muted: "true",
    hideoverlay: "false",
    disableobserver: "false",
  },
  ads: {
    adsystem: "",
    deferredadinit: "false",
  },
};

export const DEFAULT_ENVIRONMENT_KEY = "auroraProd";

export const ENVIRONMENT_DEFINITIONS = {
  auroraProd: {
    label: "Aurora CMS (Prod)",
    description: "",
    globalModules: ["analyticsContext"],
    domains: {
      runtime: {
        sourcetype: "sonic",
        endpoint: "https://public.aurora.enhanced.live",
        realm: "it",
      },
      source: {
        assetid: "23799",
        playbacktype: "video",
        sourceparams: "",
      },
    },
  },
  auroraStage: {
    label: "Aurora CMS (Stage)",
    description: "",
    globalModules: ["analyticsContext"],
    domains: {
      runtime: {
        sourcetype: "sonic",
        endpoint: "https://stage-public.aurora.enhanced.live",
        realm: "it",
      },
      source: {
        playbacktype: "channel",
        assetid: "6",
        sourceparams: "aws.manifestsettings=start:1740997225",
      },
    },
  },
  sonic: {
    label: "Sonic CMS (Legacy)",
    description: "",
    globalModules: ["analyticsContext"],
    domains: {
      runtime: {
        sourcetype: "sonic",
        endpoint: "https://eu1-prod.disco-api.com",
        realm: "dplay",
      },
      source: {
        assetid: "7932722",
        playbacktype: "video",
        sourceparams: "",
      },
    },
  },
};

export const VARIANT_DEFINITIONS = {
  autoplayVideo: {
    label: "Autoplay video baseline",
    description: "",
    globalModules: ["lomaEventsManager"],
    domains: {
      behavior: {
        autoplay: "true",
      },
    },
  },
  withAds: {
    label: "With FreeWheel ADs",
    description: "",
    globalModules: ["lomaEventsManager", "consentStub", "freewheelConfig"],
    domains: {
      ads: {
        adsystem: "fw",
        deferredadinit: "false",
      },
    },
  },
  withAdsDeferred: {
    label: "With FreeWheel ADs + Deferred AD Request",
    description: "",
    globalModules: ["lomaEventsManager", "consentStub", "freewheelConfig"],
    domains: {
      ads: {
        adsystem: "fw",
        deferredadinit: "true",
      },
    },
  },
  withTracker: {
    label: "With Trackers",
    description: "",
    globalModules: ["lomaEventsManager", "trackers"],
    domains: {},
  },
  withGtag: {
    label: "With Google Tag Manager",
    description: "",
    globalModules: ["lomaEventsManager", "analyticsContext", "gtag"],
    domains: {},
  },
};

export const CONTENT_MODE_DEFINITIONS = {
  video: {
    label: "Video",
    domains: {
      source: {
        playbacktype: "video",
        assetid: "18322",
        sourceparams: "",
      },
    },
  },
  channel: {
    label: "Channel",
    domains: {
      runtime: {
        sourcetype: "sonic",
        endpoint: "https://stage-public.aurora.enhanced.live",
        realm: "it",
      },
      source: {
        playbacktype: "channel",
        assetid: "6",
        sourceparams: "aws.manifestsettings=start:1740997225",
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
      flatConfig[field] = domains[domain]?.[field] ?? "";
    });
  });

  return flatConfig;
}

function buildPartialFlatConfigFromDomains(domains) {
  const partialConfig = {};

  Object.keys(domains || {}).forEach((domain) => {
    const domainFields = CONFIG_FIELDS_BY_DOMAIN[domain] || [];
    domainFields.forEach((field) => {
      if (Object.hasOwn(domains[domain], field)) {
        partialConfig[field] = domains[domain][field];
      }
    });
  });

  return partialConfig;
}

export function createEnvironmentConfig(environmentKey = DEFAULT_ENVIRONMENT_KEY) {
  const environment = ENVIRONMENT_DEFINITIONS[environmentKey] || ENVIRONMENT_DEFINITIONS[DEFAULT_ENVIRONMENT_KEY];
  const domains = mergeDomains(BASE_CONFIG_BY_DOMAIN, environment.domains);
  return buildFlatConfigFromDomains(domains);
}

export function createVariantConfig(variantKey) {
  const baseConfig = createEnvironmentConfig(DEFAULT_ENVIRONMENT_KEY);
  return applyVariant(baseConfig, variantKey);
}

export function applyEnvironment(config, environmentKey) {
  const environment = ENVIRONMENT_DEFINITIONS[environmentKey] || ENVIRONMENT_DEFINITIONS[DEFAULT_ENVIRONMENT_KEY];
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
  if (!config?.endpoint && config?.sourcetype === "sonic") {
    return "sonic";
  }

  if (String(config?.endpoint || "").includes("stage-public.aurora.enhanced.live")) {
    return "auroraStage";
  }

  return DEFAULT_ENVIRONMENT_KEY;
}

export function detectContentMode(config) {
  return config?.playbacktype === "channel" ? "channel" : "video";
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

export function getRuntimeContext(environmentKey, variantKey) {
  const environment = ENVIRONMENT_DEFINITIONS[environmentKey] || ENVIRONMENT_DEFINITIONS[DEFAULT_ENVIRONMENT_KEY];
  const variant = VARIANT_DEFINITIONS[variantKey] || VARIANT_DEFINITIONS.autoplayVideo;
  const moduleKeys = [...new Set([...(environment.globalModules || []), ...(variant.globalModules || [])])];

  let globals = {};
  const codeBlocks = [];

  moduleKeys.forEach((moduleKey) => {
    const moduleDefinition = GLOBAL_MODULE_DEFINITIONS[moduleKey];
    if (!moduleDefinition) return;

    if (moduleDefinition.globals) {
      globals = deepMerge(globals, cloneValue(moduleDefinition.globals));
    }

    if (typeof moduleDefinition.transformGlobals === "function") {
      globals = moduleDefinition.transformGlobals(globals);
    }

    if (moduleDefinition.code) {
      codeBlocks.push(moduleDefinition.code);
    }
  });

  return {
    moduleKeys,
    globals,
    codeBlocks,
  };
}

function serializeValue(value, indentLevel = 0) {
  const indent = "  ".repeat(indentLevel);
  const nestedIndent = "  ".repeat(indentLevel + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";

    return `[
${value.map((item) => `${nestedIndent}${serializeValue(item, indentLevel + 1)}`).join(",\n")}
${indent}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";

    return `{
${entries
  .map(([key, entryValue]) => `${nestedIndent}${key}: ${serializeValue(entryValue, indentLevel + 1)}`)
  .join(",\n")}
${indent}}`;
  }

  return JSON.stringify(value);
}

export function buildGlobalBootstrapCode(runtimeContext) {
  const assignmentLines = Object.entries(runtimeContext.globals || {}).map(
    ([key, value]) => `window.${key} = ${serializeValue(value)};`,
  );

  const blocks = [...assignmentLines, ...(runtimeContext.codeBlocks || [])].filter(Boolean);

  const parts = [...EXTERNAL_DEPENDENCIES];

  if (blocks.length > 0) {
    parts.push(`<script>\n${blocks.join("\n\n")}\n</script>`);
  }

  return parts.join("\n");
}
