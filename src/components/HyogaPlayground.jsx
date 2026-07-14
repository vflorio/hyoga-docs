import React from 'react';
import HyogaExperience from './HyogaExperience';

export default function HyogaPlayground() {
  return (
    <HyogaExperience
      title="Hyoga Runtime Playground"
      subtitle="Declarative config model with grouped domains and runtime variants."
      initialVariantKey="autoplayVideo"
      variantKeys={[
        'autoplayVideo',
        'auroraProd',
        'auroraStage',
        'sonic',
        'withAds',
        'withAdsDeferred',
        'withTracker',
        'withGtag',
      ]}
      showConfigEditor
      showScriptInputs
    />
  );
}
