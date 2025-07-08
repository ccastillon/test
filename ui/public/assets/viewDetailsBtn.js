if (document.querySelectorAll(".view-details-btn")) {
  document.querySelectorAll(".view-details-btn").forEach(function (trigger) {
    let modal = document.getElementById("user-bet-details");
    trigger.addEventListener("click", function (e) {
      let dataItem = trigger.getAttribute("data-item");
      let userBet = null;
      if (dataItem !== null) userBet = JSON.parse(dataItem);

      if (userBet !== null && modal !== null) {
        let league = modal.querySelector("[name='league']");
        league.value = userBet.leagueName;

        let dateTime = modal.querySelector("[name='dateTime']");
        const date = new Date(userBet.eventStartDateTime);
        const formatted = date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short", hour12: true });
        dateTime.value = formatted;

        let game = modal.querySelector("[name='game']");
        game.value = `${userBet.team1Name} vs ${userBet.team2Name}`;

        if (userBet.status.toLowerCase() !== "withdrawn") {
          let acceptedByUser = modal.querySelector("[name='acceptedByUser']");
          const userName = "*".repeat(4) + userBet.acceptedByUser.slice(-3);
          acceptedByUser.value = `${userName}`;
         } 
        
        let stake = modal.querySelector("[name='stake']");
        stake.value = userBet.stake;

        let odds = userBet.odds.split(":");
        let odds1 = modal.querySelector("[name='odds1']");
        odds1.value = odds[0];

        let odds2 = modal.querySelector("[name='odds2']");
        odds2.value = odds[1];

        modal.querySelector("#breakdown-container")?.classList.remove("hidden");
        modal.querySelector("#bet-against-container")?.classList.remove("hidden");
        //---------------

        let betBreakdown = modal.querySelector("#bet-breakdown");
        if (betBreakdown !== null && userBet.status.toLowerCase() === "won") {
          betBreakdown.innerHTML = "Winnings Breakdown"
        } 

        let betResult = modal.querySelector("#bet-result");
        if (betResult !== null && userBet.status.toLowerCase() === "lost") {
          betResult.innerHTML = `<span class="text-red-600">Lost</span>`;
          modal.querySelector("#breakdown-container")?.classList.add("hidden");
        } else if (betResult !== null && userBet.status.toLowerCase() === "won") {
          betResult.innerHTML = `<span class="text-green-600">Congrats, you won!</span>`;
        }       
          else if (betResult !== null && userBet.status.toLowerCase() === "withdrawn") {
            modal.querySelector("#bet-against-container")?.classList.add("hidden")
          betResult.innerHTML = "Withdrawn, no takers";
          }
            
        // else if (betResult !== null)  
        //   // modal.querySelector("#bet-against-container")?.classList.add("hidden");
        //   betResult.innerHTML = "Withdrawn, no takers";
          

        if (userBet.status.toLowerCase() === "withdrawn" || userBet.status.toLowerCase() === "won") {
          let stakeBreakdown = modal.querySelector("#breakdown-stake-amt");
          if (stakeBreakdown !== null) stakeBreakdown.innerHTML = `£ ${userBet.stake}`;

          let winnings = modal.querySelector("#breakdown-winnings");
          if (winnings !== null) winnings.innerHTML = `£ ${userBet.winnings}`;

          let rake = modal.querySelector("#breakdown-rake");
          if (rake !== null && userBet.status.toLowerCase() === "won") rake.innerHTML = `- £ ${userBet.rake}`;
          else if (rake !== null) rake.innerHTML = `£ ${userBet.rake}`;

          let refundedAmt = modal.querySelector("#refunded-amount");
          if (refundedAmt !== null) refundedAmt.innerHTML = `<strong>£ ${userBet.amount}</strong>`;
        }
      }

      showModal(modal, trigger);
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
