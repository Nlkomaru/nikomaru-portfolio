// default open-next.config.ts file created by @opennextjs/cloudflare

import cache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: async () => cache,
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
