if (document.querySelectorAll(".create-details-btn")) {
  document.querySelectorAll(".create-details-btn").forEach(function (trigger) {
    let modal = document.getElementById("create-bet-details");
    let errorModal = document.getElementById("insufficient-bal-modal");

    trigger.addEventListener("click", function (e) {
      sessionStorage.setItem("modalStatus", "false");
      let dataItem = trigger.getAttribute("data-item");
      let createBet = null;
      if (dataItem !== null) createBet = JSON.parse(dataItem);
      let userBalance = sessionStorage.getItem("userBalance");

      if (createBet !== null && errorModal !== null && userBalance <= 0) {
        let closeModalButton = document.getElementById("close-modal-insufficient");
        let cancelTransactionButton = document.getElementById("error-modal-cancel-btn");
        let addFundsButton = document.getElementById("add-funds-button");

        closeModalButton.addEventListener(
          "click",
          function (e) {
            showModal(errorModal, trigger);
          },
          { once: true }
        );
        cancelTransactionButton.addEventListener(
          "click",
          function (e) {
            showModal(errorModal, trigger);
          },
          { once: true }
        );
        addFundsButton.addEventListener(
          "click",
          function (e) {
            showModal(errorModal, trigger);
          },
          { once: true }
        );

        showModal(errorModal, trigger);
      } else {
        if (createBet !== null && modal !== null) {
          let league = modal.querySelector("[name='league']");
          // league.value = createBet.Team1.League.Name;
          league.value = createBet.leagueName;

          let dateTime = modal.querySelector("[name='dateTime']");
          const date = new Date(createBet.startDateTime);
          // const date = new Date(createBet.StartDateTime);
          const formatted = date.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
            hour12: true,
          });
          dateTime.value = formatted;

          let game = modal.querySelector("[name='game']");
          // game.value = `${createBet.Team1.Name} vs ${createBet.Team2.Name}`;
          game.value = `${createBet.team1Name} vs ${createBet.team2Name}`;

          let team1 = modal.querySelector("[id='team1Dropdown']");
          let team2 = modal.querySelector("[id='team2Dropdown']");

          team1.textContent = `${createBet.team1Name}`;
          team2.textContent = `${createBet.team2Name}`;
          team1.value = "TEAM1WINS";
          team2.value = "TEAM2WINS";
        }

        let createBetBtn = document.getElementById("create-bet-btn");
        createBetBtn.setAttribute("data-item", dataItem);

        createBetBtn.addEventListener("click", function () {
          let modalStatus = sessionStorage.getItem("modalStatus");
          if (modalStatus === "false") {
            return;
          } else if (modalStatus === "true") {
            sessionStorage.setItem("modalStatus", "false");
            showModal(modal, trigger);
          }
        });

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
