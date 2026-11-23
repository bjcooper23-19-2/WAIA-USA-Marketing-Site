(() => {
  // Tokens are redeemed only on the existing UK service. This page neither
  // validates nor sends them to any US endpoint or analytics service.
  const values = new URLSearchParams(window.location.search).getAll("token");
  const token = values.length === 1 ? values[0] : "";
  if (!/^[a-f0-9]{96}$/.test(token)) {
    document.getElementById("access-message").textContent =
      "This link is incomplete. Request a new access link to continue.";
    return;
  }
  window.location.replace(
    `https://waia.co.uk/workplace-ai-visibility-check/access/?token=${token}`,
  );
})();
