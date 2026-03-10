const output = document.getElementById("output");
const randomizeBtn = document.getElementById("randomize");
const copyBtn = document.getElementById("copy");

function setOutput(text) {
  output.textContent = text || "";
}

randomizeBtn.addEventListener("click", async () => {
  console.log("[Randomizer] Randomize clicked");
  randomizeBtn.disabled = true;
  setOutput("…");
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.log("[Randomizer] Active tab:", tab?.id, tab?.url);
    if (!tab?.id) {
      setOutput("No active tab.");
      return;
    }
    const result = await chrome.tabs.sendMessage(tab.id, {
      action: "randomize",
    });
    console.log("[Randomizer] Result:", result);
    if (result.ok) {
      const lines = [].concat(
        (result.order || []).map((name, i) => `${i + 1}. ${name}`)
      );
      setOutput(lines.join("\n"));
    } else {
      setOutput(result.message || "Something went wrong.");
    }
  } catch (e) {
    console.error("[Randomizer] Error:", e);
    setOutput(
      "Open a Google Meet call page and try again.\n\n(Extension only works on meet.google.com)\n\nError: " +
        (e?.message || String(e))
    );
  } finally {
    randomizeBtn.disabled = false;
  }
});

copyBtn.addEventListener("click", async () => {
  const text = output.textContent.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const label = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = label), 1500);
  } catch (e) {
    setOutput((output.textContent || "") + "\n\nCopy failed.");
  }
});
