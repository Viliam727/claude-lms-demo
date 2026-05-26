import {
  getExpectedTenantKeyPrefix,
  getLmsApiKeyPrefix,
} from "@/lib/lms-env";
import { getTenant } from "@/lib/lms-client";

export async function TenantNotice() {
  let tenantName: string | undefined;
  let tenantId: string | undefined;
  let loadError: string | undefined;

  try {
    const tenant = await getTenant();
    tenantName = tenant.name;
    tenantId = tenant.id;
  } catch {
    loadError = "Nepodarilo sa načítať tenant z API";
  }

  const keyPrefix = getLmsApiKeyPrefix();
  const expectedPrefix = getExpectedTenantKeyPrefix();
  const wrongTenant =
    expectedPrefix !== undefined && keyPrefix !== expectedPrefix;

  if (!wrongTenant && tenantId === "tenant_demo" && !loadError) {
    return (
      <p className="text-xs text-gray-400 mb-6">
        Tenant: <span className="font-medium text-gray-600">{tenantName}</span>{" "}
        · API key {keyPrefix}…
      </p>
    );
  }

  return (
    <div
      className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
        wrongTenant || tenantId === "tenant_01"
          ? "border-amber-300 bg-amber-50 text-amber-950"
          : "border-gray-200 bg-white text-gray-600"
      }`}
    >
      {loadError ? (
        <p>{loadError}</p>
      ) : (
        <p>
          Aktívny tenant:{" "}
          <strong>
            {tenantName} ({tenantId})
          </strong>
        </p>
      )}
      <p className="mt-1 text-xs opacity-90">
        API key prefix: <code>{keyPrefix}</code>
        {expectedPrefix ? (
          <>
            {" "}
            · očakávané pre demo: <code>{expectedPrefix}</code>
          </>
        ) : null}
      </p>
      {wrongTenant || tenantId === "tenant_01" ? (
        <p className="mt-2 text-xs">
          Demo musí používať tenant <strong>lms_demo</strong>. Worker secret{" "}
          <code>LMS_API_KEY</code> nesedí — kurzy sa môžu stratiť alebo meniť po
          deployi. Nastav správny kľúč cez{" "}
          <code>wrangler secret put LMS_API_KEY</code> (bez prepisovania v CI).
        </p>
      ) : null}
    </div>
  );
}
