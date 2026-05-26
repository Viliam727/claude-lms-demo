import { getCloudflareContext } from "@opennextjs/cloudflare";

type LmsEnv = Record<string, unknown>;

export function getLmsEnv(): LmsEnv {
  const { env } = getCloudflareContext();
  return env as LmsEnv;
}

/** Runtime Worker secret first; process.env only for local `next dev`. */
export function getLmsApiKey(): string {
  const env = getLmsEnv();
  const fromWorker = env.LMS_API_KEY;
  if (typeof fromWorker === "string" && fromWorker.length > 0) {
    return fromWorker;
  }

  const fromProcess = process.env.LMS_API_KEY;
  if (typeof fromProcess === "string" && fromProcess.length > 0) {
    return fromProcess;
  }

  throw new Error(
    "LMS_API_KEY is not configured. Set it as a Cloudflare Worker secret (tenant lms_demo)."
  );
}

export function getLmsApiKeyPrefix(): string {
  return getLmsApiKey().slice(0, 8);
}

export function getExpectedTenantKeyPrefix(): string | undefined {
  const env = getLmsEnv();
  const fromWorker = env.LMS_TENANT_KEY_PREFIX;
  if (typeof fromWorker === "string" && fromWorker.length > 0) {
    return fromWorker;
  }
  return process.env.LMS_TENANT_KEY_PREFIX;
}

export function getLmsServiceBinding(): {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
} {
  const binding = getLmsEnv().LMS_API;
  if (!binding || typeof binding !== "object" || !("fetch" in binding)) {
    throw new Error("LMS_API service binding is not configured");
  }
  return binding as {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  };
}
