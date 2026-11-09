(() => {
  // A US Cloudflare Web Analytics token is supplied only at build time.
  // Never reuse the UK site's token on this separate domain.
  const token = document.currentScript?.dataset.waiaUsToken;
  if (!/^[a-f0-9]{32}$/.test(token || "")) return;

  // A saved objection prevents the Cloudflare script from being requested.
  // If storage cannot be read, leave analytics off.
  try {
    if (window.localStorage.getItem("waia:analytics-objection") === "1") return;
  } catch {
    return;
  }

  const beacon = document.createElement("script");
  beacon.type = "module";
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  beacon.dataset.cfBeacon = JSON.stringify({
    token,
  });
  document.body.appendChild(beacon);
})();
