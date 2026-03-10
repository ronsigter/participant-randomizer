(function () {
  const PANEL_NOT_FOUND_HINT =
    "Open the Participants panel (click 'People' or the participant count in the top bar) and try again.";

  function runRandomize() {
    const participantsPanel = document.querySelector(
      '[aria-label*="In call"] [aria-label*="Participants"]'
    );

    if (!participantsPanel) {
      return {
        ok: false,
        message:
          "Participants panel not found. Make sure it is open! " +
          PANEL_NOT_FOUND_HINT,
      };
    }

    const nameElements = Array.from(
      participantsPanel.querySelectorAll('div[role="listitem"][aria-label]')
    ).filter((el) => el.getAttribute("aria-label")?.trim() !== "");

    const names = nameElements.map((el) => el.getAttribute("aria-label"));

    if (names.length === 0) {
      return {
        ok: false,
        message: "No participant names found in the panel.",
      };
    }

    // Fisher-Yates shuffle
    for (let i = names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [names[i], names[j]] = [names[j], names[i]];
    }

    return {
      ok: true,
      message: `Found ${names.length} participants.`,
      order: names,
    };
  }

  /** If the People button exists, click it to open the Participants panel. Returns true if clicked. */
  function tryOpenParticipantsPanel() {
    const peopleButton = document.querySelector('button[aria-label*="People"]');
    if (!peopleButton) return false;
    peopleButton.click();
    return true;
  }

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action !== "randomize") {
      return true;
    }

    function doRandomize() {
      let result = runRandomize();
      if (
        !result.ok &&
        result.message.includes("Participants panel not found")
      ) {
        if (tryOpenParticipantsPanel()) {
          return null; // signal: we clicked, caller should wait and retry
        }
      }
      return result;
    }

    let result = doRandomize();
    if (result !== null) {
      sendResponse(result);
      return true;
    }

    // Panel wasn't open; we clicked People — wait for panel then retry
    setTimeout(() => {
      sendResponse(runRandomize());
    }, 700);
    return true;
  });
})();
