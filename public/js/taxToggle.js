let taxTogel = document.getElementById("flexSwitchCheckDefault");

taxTogel.addEventListener("click", () => {
  console.log("Clicked");
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});
