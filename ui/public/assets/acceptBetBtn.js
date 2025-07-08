if (document.querySelectorAll(".accept-btn")) {
  document.querySelectorAll(".accept-btn").forEach(function (trigger) {
    let modal = document.getElementById("proposed-bet-details");
    let errorModal = document.getElementById("insufficient-bal-modal");
    trigger.addEventListener("click", function (e) {
      let dataItem = trigger.getAttribute("data-item");
      let proposedBet = null;
      if (dataItem !== null) proposedBet = JSON.parse(dataItem);
      if (proposedBet !== null && errorModal !== null && proposedBet.isBalSufficient === false) {
        let closeModalButton = document.getElementById("close-modal-insufficient");
        let cancelTransactionButton = document.getElementById("error-modal-cancel-btn");
        let addFundsButton = document.getElementById("add-funds-button");

        closeModalButton.addEventListener(
          "click",
          function (e) {
            console.log("close modal");
            showModal(errorModal, trigger);
          },
          { once: true }
        );
        cancelTransactionButton.addEventListener(
          "click",
          function (e) {
            console.log("close modal");
            showModal(errorModal, trigger);
          },
          { once: true }
        );
        addFundsButton.addEventListener(
          "click",
          function (e) {
            console.log("close modal");
            showModal(errorModal, trigger);
          },
          { once: true }
        );

        showModal(errorModal, trigger);
      } else {
        if (proposedBet !== null && modal !== null) {
          let league = modal.querySelector("[name='league']");
          league.value = proposedBet.leagueName;

          let dateTime = modal.querySelector("[name='dateTime']");
          const date = new Date(proposedBet.eventStartDateTime);
          const formatted = date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short", hour12: true });
          dateTime.value = formatted;

          let game = modal.querySelector("[name='game']");
          game.value = `${proposedBet.team1Name} vs ${proposedBet.team2Name}`;

          let proposedBy = modal.querySelector("[name='proposedby']");
          const userName = "*".repeat(4) + proposedBet.proposedBy.slice(-3);
          proposedBy.value = `${userName}`;

          let backerTeamPick = modal.querySelector("[name='backerTeamPick']");
          backerTeamPick.value = `${proposedBet.backerTeamPick} to win`;

          let stake = modal.querySelector("[name='stake']");
          stake.value = proposedBet.stake;

          let odds = proposedBet.odds.split(":");
          let odds1 = modal.querySelector("[name='odds1']");
          odds1.value = odds[0];

          let odds2 = modal.querySelector("[name='odds2']");
          odds2.value = odds[1];

          let layerLiablity = modal.querySelector("[id='layerLiability']");
          layerLiablity.textContent = ` £${proposedBet.layerLiability}`;

          let estPayoutCalc = parseFloat(proposedBet.stake) + parseFloat(proposedBet.layerLiability);
          let estPayout = modal.querySelector("[id='estPayout']");
          estPayout.textContent = ` £${estPayoutCalc}`;

          //---------------

          let button = document.getElementById("accept-bet-button");
          button.setAttribute("data-item", dataItem);

          button.addEventListener("click", function () {
            showModal(modal, trigger);
          });
        }
        showModal(modal, trigger);
      }
    });
  });
}

function showModal(modal, trigger) {
  if (modal.getAttribute("aria-hidden") == "true") {
    modal.setAttribute("aria-hidden", "false");
    let modal_backdrop = document.createElement("div");
    modal_backdrop.classList.add(
      "opacity-0",
      "z-990",
      "fixed",
      "bg-black",
      "top-0",
      "left-0",
      "w-screen",
      "h-screen",
      "transition-opacity",
      "ease-linear"
    );
    modal_backdrop.setAttribute("modal-backdrop", trigger.getAttribute("data-target"));
    document.body.appendChild(modal_backdrop);
    modal_backdrop.classList.add("opacity-50");
    modal_backdrop.classList.remove("opacity-0");
  } else {
    modal.setAttribute("aria-hidden", "true");
    let backdrop = document.querySelector("[modal-backdrop='" + trigger.getAttribute("data-target") + "']");
    backdrop.remove();
  }
  modal.classList.toggle("hidden");
  modal.classList.toggle("opacity-0");
  modal.classList.toggle("block");

  modal.firstElementChild.classList.toggle("-translate-y-13");
  modal.firstElementChild.classList.toggle("transform-none");
}
