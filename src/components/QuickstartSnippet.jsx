import CodeBlock from "@theme/CodeBlock";
import { useMemo } from "react";
import { BASE_CONFIG_BY_DOMAIN, DEFAULT_HYOGA_SCRIPT, EXTERNAL_DEPENDENCIES } from "./Hyoga/configModel";

function buildQuickstartHtml() {
  const id = BASE_CONFIG_BY_DOMAIN.identity;
  const rt = BASE_CONFIG_BY_DOMAIN.runtime;
  const src = BASE_CONFIG_BY_DOMAIN.source;
  const beh = BASE_CONFIG_BY_DOMAIN.behavior;

  const depTags = EXTERNAL_DEPENDENCIES.map((tag) => `    ${tag}`).join("\n");

  return `<!DOCTYPE html>
<html lang="${rt.locale}">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hyoga Player — Quickstart</title>

    <!-- Dependencies -->
${depTags}

    <!-- Hyoga Player -->
    <script src="${DEFAULT_HYOGA_SCRIPT}"></script>

    <style>
        body { margin: 0; background: #111; display: flex; justify-content: center; align-items: start; min-height: 100vh; }
        .player-container { width: 100%; max-width: 960px; aspect-ratio: 16/9; margin-top: 2rem; }
    </style>
</head>
<body>
    <div class="player-container">
        <hyoga-player
            id="${id.id}"
            uid="${id.uid}"
            playerselector="${id.playerselector}"
            hyogamanager="${id.hyogamanager}"
            videolibrary="${rt.videolibrary}"
            sourcetype="${rt.sourcetype}"
            locale="${rt.locale}"
            realm="${rt.realm}"
            endpoint="${rt.endpoint}"
            assetid="${src.assetid}"
            playbacktype="${src.playbacktype}"
            autoplay="${beh.autoplay}"
            muted="${beh.muted}"
        >
            <hyoga-videoplayer hyogamanager="${id.hyogamanager}" />
        </hyoga-player>
    </div>
</body>
</html>`;
}

export default function QuickstartSnippet() {
  const html = useMemo(() => buildQuickstartHtml(), []);

  return (
    <CodeBlock language="html" title="index.html">
      {html}
    </CodeBlock>
  );
}
