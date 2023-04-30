




let cardBackgroundGuide = {"Monster": "monster_card.jpg", "Trap": "trap_card.jpg", "Spell": "spell_card.jpg"};





let cards = null;
let cardNames = [];
async function setup() {
  await fetch(browser.runtime.getURL("cards.json")).then((res) => res.json().then((jsonRes) => {
    cards = jsonRes;
    //console.log(cards["Jerry Beans Man"]);
    //console.log(Object.keys(cards))
    for (let index = 0; index < cards.length; index++) {
      let name = cards[index]["n"] + "^" + index;
      console.log(name)
      cardNames.push(name);
    };
  }));
};

setup().then(() => {

function setText(ele) {
  ele.style.whiteSpace = "nowrap";
  ele.style.transform = "scaleX(1)";
  if (ele.scrollWidth > ele.clientWidth) {
    ele.style.transformOrigin = "left top 0px";
    ele.style.transform = "scaleX(" + (ele.clientWidth / ele.scrollWidth) + ")";
  }
};

function cardNameSearch(soughtString) {
  let appendedNames = [];
  let loweredString = soughtString.toLowerCase();
  for (let index = 0; (appendedNames.length < 20) && (index < cardNames.length); index++) {
    if (cardNames[index].split("^")[0].toLowerCase().match(loweredString) != null) {
      appendedNames.push(cardNames[index]);
    };
  }
  return appendedNames;
};

function updateCardImage(card, name) {
  fetch(`localhost:80/card/${fetched_name}`).then((res) => res.json().then((jsonRes) => {
    card.style.backgroundImage = jsonRes;      
  }));
}


function createCardSearchField(searchedCardsSection, section="searchers") {
  let cardCreateMethod = null;
  if (section == "combo") {
    cardCreateMethod = (name, number) => createComboLineCard(name, number, cardSearchField.cardGroup);
  }
  else {
    cardCreateMethod = createCard;
  }
  const cardSearchField = document.createElement("input");
    cardSearchField.type = "text";
    cardSearchField.classList.add("tooltipSpan", "cardSearchField");
    cardSearchField.addEventListener("input", () => {
      let searchedCards = cardNameSearch(cardSearchField.value);
      while (searchedCardsSection.firstChild) {
        searchedCardsSection.removeChild(searchedCardsSection.firstChild)
      };
      for (let index = 0; index < searchedCards.length; index++) {
        let [name, number] = searchedCards[index].split("^");
        const card = cardCreateMethod(name, number);
        searchedCardsSection.appendChild(card);
      }
    });

  return cardSearchField
}

function createAddonField() {
  const addonField = document.createElement("div");
  addonField.id = "addonField";

  addonField.addEventListener("transitionend", () => {
    if (addonField.dataset.open == "false") {
      addonField.style.display = "none";
    };

    $("#infoHelperTool").attr("data-toggle_locked", "false"); 
  });
  return addonField;
}


function createYugipediaSection() {
  const yugipediaSection = document.createElement("section");
  yugipediaSection.id = "yugipediaSection";

  const yugipediaIconBackdrop = document.createElement("div");
  yugipediaIconBackdrop.id = "yugipediaIconBackdrop";

  const yugipediaIcon = document.createElement("div");
  yugipediaIcon.id = "yugipediaIcon";
  yugipediaIcon.style.backgroundImage = `url(${browser.runtime.getURL("icons/yugipedia_icon.png")}`;

  const diagonalLine = document.createElement("div");
  diagonalLine.className = "diagonalLine";

  const yugipediaSectionSpanBlock = document.createElement("div");
  yugipediaSectionSpanBlock.className = "sectionSpanBlock";
  yugipediaSectionSpanBlock.style.left = "36.25%";
  yugipediaSectionSpanBlock.style.width = "63.78%";

  const yugipediaLinkSpan = document.createElement("span");
  yugipediaLinkSpan.id = "yugipediaLinkSpan";

  yugipediaSection.appendChild(yugipediaIconBackdrop);
  yugipediaSection.appendChild(yugipediaIcon);
  yugipediaSection.appendChild(diagonalLine);
  yugipediaSectionSpanBlock.appendChild(yugipediaLinkSpan);
  yugipediaSection.appendChild(yugipediaSectionSpanBlock);

  return [yugipediaSection, yugipediaLinkSpan];
};


function createComboLineBlock(comboID, cardNames, cardIndexes, referenceIDs, cardGroups) {
  const comboLineBlock = document.createElement("section");
  comboLineBlock.className = "comboLineBlock";

  const materialSectionsBinder = document.createElement("div");
  materialSectionsBinder.className = "materialSectionsBinder";
  materialSectionsBinder.addEventListener("click", (e) => {
    if (e.currentTarget.dataset.expanded == "true" && (e.target == requiredMaterialsSection | e.target == comboResultSection)) {
      e.currentTarget.dataset.expanded = "false";
      comboLineBlock.dataset.expanded = "false";
    }
    else {
      e.currentTarget.dataset.expanded = "true";
      comboLineBlock.dataset.expanded = "true";
      
      document.getElementById("comboLinesCombosSection").scroll({left: 0, top: comboLineBlock.offsetTop, behavior: "smooth"});
      if (comboLineBlock.dataset.openedPreviously == undefined) {
        comboLineBlock.dataset.openedPreviously = "true";
        fetch(`http://localhost:80/getCombo/${comboID}`).then((res) => res.json().then((jsonRes) => {
          let stepNumbers = JSON.parse(jsonRes[0]["StepNumbers"]);
          let stepTexts = JSON.parse(jsonRes[0]["StepTexts"]);
          let referenceIDs = JSON.parse(jsonRes[0]["ReferenceIDs"]);
          let currentStepNumber = 0;
          let currentStep = null;

          for (let index = 0; index < stepNumbers.length; index++ ) {
            let targetStepNumber = stepNumbers[index];
            if (targetStepNumber > currentStepNumber) {
              currentStep = document.createElement("div");
              currentStep.className = "comboStep";
              currentStep.dataset.test = "";
              currentStep.pointerReferences = [];

              let stepSpan = document.createElement("span");
              stepSpan.className = "comboCreationStepSpan";
              stepSpan.innerText = targetStepNumber;
              currentStep.appendChild(stepSpan);

              let stepDescriptionBlock = document.createElement("div");
              stepDescriptionBlock.className = "stepDescriptionBlock";
              let descriptionBlockSpan = document.createElement("span");
              descriptionBlockSpan.className = "generalSpan";
              descriptionBlockSpan.innerText = stepTexts[index];
              stepDescriptionBlock.appendChild(descriptionBlockSpan);
              currentStep.appendChild(stepDescriptionBlock);
      
              currentStep.addEventListener("mouseenter", (e) => {
                for (let reference of e.currentTarget.pointerReferences) {
                  reference.dataset.pointer_mode = "true";
                }
              });

              currentStep.addEventListener("mouseleave", (e) => {
                for (let reference of e.currentTarget.pointerReferences) {
                  reference.dataset.pointer_mode = "false";
                }
              });
              comboBlockStepsSection.appendChild(currentStep);
              currentStepNumber = targetStepNumber;
            };
            
            currentStep.pointerReferences.push(document.getElementById(referenceIDs[index]));
            currentStep.dataset.test += referenceIDs[index] + ", "
          }
        }));
      }
      
    }
  });

  const requiredMaterialsSection = document.createElement("section");
  requiredMaterialsSection.className = "requiredMaterialsSection";

  const comboResultSection = document.createElement("section");
  comboResultSection.className = "comboResultSection";
  comboResultSection.dataset.expanded = "true";

  const comboBlockStepsSection = document.createElement("section");
  comboBlockStepsSection.className = "comboBlockStepsSection";
  comboBlockStepsSection.stepCount = 0;
  comboBlockStepsSection.addEventListener("click", () => {
    if (comboBlockStepsSection.dataset.expanded != "true") {
      comboBlockStepsSection.dataset.expanded = "true";
      comboCreationStartingCardsSection.dataset.retracted = "true";
      comboCreationProductCardsSection.dataset.retracted = "true";
    }
    else {
      delete comboBlockStepsSection.dataset.expanded;
      delete comboCreationStartingCardsSection.dataset.retracted;
      delete comboCreationProductCardsSection.dataset.retracted;
    }
  });

  for (let index=0; index < cardNames.length; index++) {
    let targetCardName = cardNames[index];
    let targetCardIndex = cardIndexes[index];
    let targetCardID = referenceIDs[index];
    let targetCardGroup = cardGroups[index];
    
    let card = createCard(targetCardName, targetCardIndex);
    card.id = targetCardID;
    if (targetCardGroup == "startingCard") {
      requiredMaterialsSection.appendChild(card);
    }
    else {
      comboResultSection.appendChild(card);
    }

  };

  materialSectionsBinder.appendChild(requiredMaterialsSection);
  materialSectionsBinder.appendChild(comboResultSection);
  comboLineBlock.appendChild(materialSectionsBinder);
  comboLineBlock.appendChild(comboBlockStepsSection);

  return comboLineBlock;
}

function populateComboLinesCombosSection() {
  fetch(`http://localhost:80/getCombos/${helperTool.dataset.current_card_name}/${helperTool.dataset.current_card_id}`, {
            method: "GET",
            mode: "cors"
          }).then((res) => res.json().then((jsonRes) => {
            let comboLinesCombosSection = document.getElementById("comboLinesCombosSection");
            for (let index=0; index < jsonRes.length; index++) {
              let comboID = jsonRes[index]["ComboID"];
              let parsedCardNames = JSON.parse(jsonRes[index]["CardNames"]);
              let parsedCardIndexes = JSON.parse(jsonRes[index]["CardIndexes"]);
              let parsedReferenceIDs = JSON.parse(jsonRes[index]["ReferenceIDs"]);
              let parsedCardGroups = JSON.parse(jsonRes[index]["CardGroups"]);

              let comboBlock = createComboLineBlock(comboID, parsedCardNames, parsedCardIndexes, parsedReferenceIDs, parsedCardGroups);
              comboLinesCombosSection.appendChild(comboBlock);
            }
    
          }));
}


function createSearchersSection() {
  const searchersSection = document.createElement("section");
    searchersSection.id = "searchersSection";

    const searchSectionSpanBlock = document.createElement("div");
    searchSectionSpanBlock.className = "sectionSpanBlock";

    const searchSectionText = document.createElement("span");
    searchSectionText.className = "sectionSpan";
    searchSectionText.innerText = "Direct Searchers";

    const expandedSection = document.createElement("section");
    expandedSection.className = "expandedSection";
    const expandedSectionOptions = document.createElement("section");
    expandedSectionOptions.id = "expandedSectionOptions";

    const returnOption = document.createElement("div");
    returnOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/return_sign.png")})`;
    returnOption.addEventListener("click", () => {
      $("#yugipediaSection").attr("data-retracting", "false");
      $("#comboLinesSection").attr("data-retracting", "false");
      searchersSection.dataset.expanded = "false";
      searchSectionSpanBlock.dataset.hiding = "false";

      if ($("#addCardOption").attr("data-adding") == "true") {
        addCardOption.click();
      }

    });
    
    const returnOverlay = document.createElement("div");
    returnOverlay.className = "returnOptionOverlay";
    const returnTooltip = document.createElement("div");
    returnTooltip.classList.add("returnTooltip", "untransformedTooltip");
    const returnTooltipSpan = document.createElement("span");
    returnTooltipSpan.className = "tooltipSpan";
    returnTooltipSpan.innerText = "Return";
    returnTooltipSpan.dataset.not_constrained_by_xtevens_fuckery = "true";

    returnTooltip.appendChild(returnTooltipSpan);
    returnOverlay.appendChild(returnTooltip);
    returnOption.appendChild(returnOverlay);

    const addCardOption = document.createElement("div");
    addCardOption.id = "addCardOption";
    addCardOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/plus_sign.webp")})`;
    const addCardOverlay = document.createElement("div");
    addCardOverlay.id = "addCardOverlay";
    const addCardTooltip = document.createElement("div");
    addCardTooltip.id = "addCardTooltip";
    addCardTooltip.className = "untransformedTooltip";
    const tooltipSpan = document.createElement("span");
    tooltipSpan.className = "tooltipSpan";
    tooltipSpan.innerText = "Add Searcher";
    tooltipSpan.dataset.not_constrained_by_xtevens_fuckery = "true";

    const searchedCardsSection = document.createElement("section");
    searchedCardsSection.id = "searchedCardsSection";
    const cardSearchField = createCardSearchField(searchedCardsSection);

    addCardOption.addEventListener("click", () => {
      if (addCardOption.dataset.adding != "true") {
        $("#cardsSection").css("display", "none");
        $("#searchedCardsSection").css("display", "flex");
        document.getElementById("expandedSectionOptions").getElementsByClassName("cardSearchField")[0].style.display = "block";
        addCardOption.dataset.adding = "true";
        tooltipSpan.innerText = "View Searchers";
        addCardOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/view_sign.png")})`;
      }
      else {
        $("#searchedCardsSection").css("display", "none");
        $("#cardsSection").css("display", "flex");
        document.getElementById("expandedSectionOptions").getElementsByClassName("cardSearchField")[0].style.display = "none";
        addCardOption.dataset.adding = "false";
        tooltipSpan.innerText = "Add Searcher";
        addCardOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/plus_sign.webp")})`;
      }
    });

    addCardTooltip.appendChild(tooltipSpan);
    addCardOverlay.appendChild(addCardTooltip);
    addCardOption.appendChild(addCardOverlay)
    

    expandedSectionOptions.appendChild(returnOption);
    expandedSectionOptions.appendChild(addCardOption);
    expandedSectionOptions.append(cardSearchField);


    const cardsSection = document.createElement("section")
    cardsSection.id = "cardsSection";

    for (let index = 0; index < 60; index++) {
      let number = Math.floor(Math.random() * 13981);
      
      let fetched_name = cards[number]["n"];
      const card = createCard(fetched_name, number);
      cardsSection.appendChild(card);
    };


    expandedSection.appendChild(expandedSectionOptions);
    expandedSection.appendChild(cardsSection);
    expandedSection.append(searchedCardsSection);


    searchSectionSpanBlock.append(searchSectionText);
    searchersSection.appendChild(searchSectionSpanBlock);
    searchersSection.appendChild(expandedSection);

    searchersSection.addEventListener("click", (e) => {
      if ([searchSectionSpanBlock, searchersSection, searchSectionText].includes(e.target)) {

        if (searchersSection.dataset.expanded != "true") {
          $("#yugipediaSection").attr("data-retracting", "true");
          $("#comboLinesSection").attr("data-retracting", "true");
          searchersSection.dataset.expanded = "true";
          searchSectionSpanBlock.dataset.hiding = "true";
        }
        else {
          $("#yugipediaSection").attr("data-retracting", "false");
          $("#comboLinesSection").attr("data-retracting", "false");
          searchersSection.dataset.expanded = "false";
          searchSectionSpanBlock.dataset.hiding = "false";
        }
        
      }
    });
    
    return searchersSection;
};


function createComboLineCard(cardName, index, cardGroup) {
  if (cardGroup == "startingCard") {

  }
  else if (cardGroup == "productCard") {
    onClickFunction = function() {

    }
  }

  const card = document.createElement("div");
  card.className = "falseCard";
  card.dataset.group = cardGroup;
  let cardId = cards[index]["id"];
  card.id = crypto.randomUUID();
  let cardType = cards[index]["c"];
  card.style.backgroundImage = `url(${browser.runtime.getURL("card_appearances/" + cardBackgroundGuide[cardType])})`;
  card.dataset.name = cardName;
  card.dataset.index = index;
  const cardLabel = document.createElement("div");
  cardLabel.className = "untransformedTooltip";
  cardLabel.dataset.on_card = "true";
  cardLabel.dataset.index = index;
  const cardLabelSpan = document.createElement("span");
  cardLabelSpan.className = "tooltipSpan";
  cardLabelSpan.dataset.not_constrained_by_xtevens_fuckery = "true";
  cardLabelSpan.textContent = cardName;
 
  //cardGroup is used to distinguish whether the card is being used to search or a searched card that was already added.
  // this can be done because only cards that arent already added have their card group specified.
  if (cardGroup != undefined ) {
    card.addEventListener("click", () => dbSearchCard(cardName));

  }
  else {
    card.addEventListener("click", (e) => {
      let comboCreationSection = document.getElementById("comboCreationSection");
      let comboLinesOptionsSection = document.getElementById("comboLinesOptionsSection");
      let establishStepOption = document.getElementById("establishStepOverlay");
      if (comboCreationSection.pointerMode == undefined) {
        e.stopPropagation();
        card.dataset.pointer_mode = "true";
        function stopPointerMode(e) {
          if (e.target == establishStepOption) {
            return 0
          };

          card.dataset.pointer_mode = "false";
          document.removeEventListener("click", stopPointerMode);
          delete comboCreationSection.pointerMode;
          comboCreationSection.pointerReferences = [];
          delete comboCreationSection.pointer;
          comboLinesOptionsSection.dataset.pointer_mode = "false";
        }
        document.addEventListener("click", stopPointerMode);
        comboCreationSection.pointerMode = "true";
        comboCreationSection.pointer = card;
        comboLinesOptionsSection.dataset.pointer_mode = "true";
      }
      else if (e.currentTarget != comboCreationSection.pointer) {
        e.stopPropagation();
        card.dataset.pointer_mode = "true";
        function stopPointerMode(e) {
          if (e.target == establishStepOption) {
            return 0
          };

          card.dataset.pointer_mode = "false";
          document.removeEventListener("click", stopPointerMode);
          delete comboCreationSection.pointerMode;
          comboCreationSection.pointerReferences = [];
          comboLinesOptionsSection.dataset.pointer_mode = "false";
        }
        document.addEventListener("click", stopPointerMode);
        comboCreationSection.pointerReferences.push(card);
      }
      
    })
  }

  card.addEventListener("mouseenter", () => {
    overlayCardInfo(cardName, index, cardArtwork);
  });


  card.addEventListener("mouseleave", () => restoreDefaultCardDisplay());

  card.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextualizeContextMenu(card);
    cardRevealContextMenu(e, cardName, index)
    contextMenu.addStartingCardFunction = () => addStartingCard(cardName, index);
    contextMenu.addProductCardFunction  = () => addProductCard(cardName, index)
    contextMenu.removeStartingCardFunction = () => removeStartingCard(card);

  });

  const cardArtwork = document.createElement("div");
  cardArtwork.className = "cardArtwork";
  cardArtwork.style.backgroundImage = `url(${browser.runtime.getURL("card_appearances/9917.jpg")})`;
  fetch("http://localhost:80/card/" + cardId, {mode: "cors"
  }).then((res) => res.blob().then((blobRes) => {
    let URLHolder = URL.createObjectURL(blobRes);
    cardArtwork.style.backgroundImage = `url(${URLHolder})`;
  }));

  cardLabel.appendChild(cardLabelSpan);
  card.appendChild(cardLabel);
  card.appendChild(cardArtwork);

  return card;

};

function clearComboCreationSection() {
  
  let startingCardsSection = document.getElementById("comboCreationStartingCardsSection");
  let productCardsSection = document.getElementById("comboCreationProductCardsSection");

  for (let cardsContainer of [startingCardsSection, productCardsSection]) {
    let falseCards = cardsContainer.getElementsByClassName("falseCard");
    while(falseCards.length > 0) {
      cardsContainer.removeChild(falseCards[0]);
    }
  }

  let comboCreationSection = document.getElementById("comboCreationSection");
  comboCreationSection.pointerReferences = [];

  let comboLinesOptionsSection = document.getElementById("comboLinesOptionsSection");
  comboLinesOptionsSection.dataset.steps_inserted = "false";

  let comboCreationStepsSection = document.getElementById("comboCreationStepsSection");
  comboCreationStepsSection.stepCount = 0;

  let comboCreationStepsBuffer = document.getElementById("comboCreationStepsBuffer");
  while (comboCreationStepsBuffer.firstChild) {
    comboCreationStepsBuffer.removeChild(comboCreationStepsBuffer.firstChild);
  }

}

function createcomboLinesSection() {
  const comboLinesSection = document.createElement("section");
    comboLinesSection.id = "comboLinesSection";
    comboLinesSection.addEventListener("click", (e) => {
      if ([comboLinesSection, comboSpanBlock, comboSectionText].includes(e.target)) {

        if (comboLinesSection.dataset.expanded != "true") {
          $("#yugipediaSection").attr("data-retracting", "true");
          $("#searchersSection").attr("data-retracting", "true");
          comboLinesSection.dataset.expanded = "true";
          comboSpanBlock.dataset.hiding = "true";
          while (comboLinesCombosSection.firstChild) {
            comboLinesCombosSection.removeChild(comboLinesCombosSection.firstChild);
          }
          populateComboLinesCombosSection();
        }
        else {
          $("#yugipediaSection").attr("data-retracting", "false");
          $("#searchersSection").attr("data-retracting", "false");
          comboLinesSection.dataset.expanded = "false";
          comboSpanBlock.dataset.hiding = "false";
        }
        
      }
    });
    const comboSpanBlock = document.createElement("div");
    comboSpanBlock.className = "sectionSpanBlock";
    const comboSectionText = document.createElement("span");
    comboSectionText.className = "sectionSpan";
    comboSectionText.innerText = "Combo Lines";

    const comboExpandedSection = document.createElement("section");
    comboExpandedSection.className = "expandedSection";
    comboExpandedSection.id = "expandedComboSection";

    const comboLinesOptionsSection = document.createElement("section");
    comboLinesOptionsSection.id = "comboLinesOptionsSection";



    const returnOption = document.createElement("div");
    returnOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/return_sign.png")})`;
    returnOption.addEventListener("click", () => {
      $("#yugipediaSection").attr("data-retracting", "false");
      $("#searchersSection").attr("data-retracting", "false");
      comboLinesSection.dataset.expanded = "false";
      comboSpanBlock.dataset.hiding = "false";


    });

    const returnOverlay = document.createElement("div");
    returnOverlay.className = "returnOptionOverlay";
    const returnTooltip = document.createElement("div");
    returnTooltip.classList.add("returnTooltip", "untransformedTooltip");
    const returnTooltipSpan = document.createElement("span");
    returnTooltipSpan.className = "tooltipSpan";
    returnTooltipSpan.innerText = "Return";
    returnTooltipSpan.dataset.not_constrained_by_xtevens_fuckery = "true";

    returnTooltip.appendChild(returnTooltipSpan);
    returnOverlay.appendChild(returnTooltip);
    returnOption.appendChild(returnOverlay);
    comboLinesOptionsSection.append(returnOption)


    const addComboOption = document.createElement("div");
    addComboOption.id = "addComboOption";
    addComboOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/combo_sign.png")})`;
    const addComboOverlay = document.createElement("div");
    addComboOverlay.id = "addComboOverlay";
    const addComboTooltip = document.createElement("div");
    addComboTooltip.id = "addComboTooltip";
    addComboTooltip.className = "untransformedTooltip";
    const tooltipSpan = document.createElement("span");
    tooltipSpan.className = "tooltipSpan";
    tooltipSpan.innerText = "Add Combo";
    tooltipSpan.dataset.not_constrained_by_xtevens_fuckery = "true";

    addComboOption.addEventListener("click", () => {
      if (addComboOption.dataset.adding != "true") {
        addComboOption.dataset.adding = "true";
        addComboOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/view_sign.png")})`;
        tooltipSpan.innerText = "View Combos";
        comboCreationSection.style.display = "flex";
        comboLinesCombosSection.style.display = "none";
        comboLinesOptionsSection.dataset.viewing_combos = "false";
      }
      else {
        addComboOption.dataset.adding = "false";
        addComboOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/combo_sign.png")})`;
        tooltipSpan.innerText = "Add Combo";
        comboCreationSection.style.display = "none";
        comboLinesCombosSection.style.display = "flex";
        comboLinesOptionsSection.dataset.viewing_combos = "true";
      }
    });

    addComboTooltip.appendChild(tooltipSpan);
    addComboOverlay.appendChild(addComboTooltip);
    addComboOption.appendChild(addComboOverlay);
    comboLinesOptionsSection.appendChild(addComboOption);


    const submitComboOption = document.createElement("div");
    submitComboOption.className = "optionOverlay";
    submitComboOption.id = "submitComboOverlay";
    submitComboOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/submit_combo_icon.png")})`;
    submitComboOption.addEventListener("click", () => {
      let form = new FormData();
      const cardsUsed = [];
      for (let cardElement of comboCreationSection.getElementsByClassName("falseCard")) {
        let cardGroup = null;
        if (cardElement.parentElement == comboCreationStartingCardsSection) {
          cardGroup = "startingCard";
        }
        else if (cardElement.parentElement == comboCreationProductCardsSection) {
          cardGroup = "productCard";
        }
        cardsUsed.push([cardElement.dataset.name, cardElement.dataset.index, cardElement.id, cardGroup]);
      }
      const steps = [];
      const stepReferences = [];
      let stepElements = comboCreationStepsBuffer.getElementsByClassName("comboCreationStep");
      for (let stepElement of stepElements) {
        let stepNumber = stepElement.dataset.step_number;
        let innerText = stepElement.getElementsByClassName("generalSpan")[0].innerText;
        for (let reference of stepElement.referenceSet) {
          stepReferences.push([stepNumber, reference.id]);
        }
        steps.push([stepElement.dataset.step_number, innerText]);
      };
      form.append("steps", JSON.stringify(steps));
      form.append("stepReferences", JSON.stringify(stepReferences));
      form.append("cardsUsed", JSON.stringify(cardsUsed));
      
      fetch(`http://localhost:80/addCombo/${helperTool.dataset.current_card_name}/${helperTool.dataset.current_card_id}`, {
        method: "POST",
        mode: "cors",
        body: form
      }).then((res) => res.json().then((jsonRes) => {
        if (jsonRes.result == "successful") {
          clearComboCreationSection();
        }
      }));
    })

    const submitComboOptionTooltip = document.createElement("div");
    submitComboOptionTooltip.className = "untransformedTooltip";
    const submitComboOptionSpan = document.createElement("span");
    submitComboOptionSpan.className = "tooltipSpan";
    submitComboOptionSpan.dataset.not_constrained_by_xtevens_fuckery = "true";
    submitComboOptionSpan.innerText = "Submit Combo";
    submitComboOptionTooltip.appendChild(submitComboOptionSpan);
    submitComboOption.appendChild(submitComboOptionTooltip);
    comboLinesOptionsSection.appendChild(submitComboOption);

    const establishStepOption = document.createElement("div");
    establishStepOption.className = "optionOverlay";
    establishStepOption.id = "establishStepOverlay";
    establishStepOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/create_step_icon.gif")})`;
    establishStepOption.addEventListener("click", () => {
      let stepInputCluster = document.getElementById("stepInputCluster");
      function closeStepInputCluster(e) {
        e.stopPropagation();
        stepInputCluster.style.display = "none";
        document.removeEventListener("click", closeStepInputCluster);
      }
      stepInputCluster.style.display = "flex";
      setTimeout(() => {
        document.addEventListener("click", closeStepInputCluster);
      }, 5);
    })

    const establishStepOptionTooltip = document.createElement("div");
    establishStepOptionTooltip.className = "untransformedTooltip";
    const establishStepOptionSpan = document.createElement("span");
    establishStepOptionSpan.className = "tooltipSpan";
    establishStepOptionSpan.dataset.not_constrained_by_xtevens_fuckery = "true";
    establishStepOptionSpan.innerText = "Create Step";
    establishStepOptionTooltip.appendChild(establishStepOptionSpan);
    establishStepOption.appendChild(establishStepOptionTooltip);
    comboLinesOptionsSection.appendChild(establishStepOption);



    const comboLinesCombosSection = document.createElement("section");
    comboLinesCombosSection.id = "comboLinesCombosSection";

    const comboCreationSection = document.createElement("section");
    comboCreationSection.id = "comboCreationSection";
    comboCreationSection.pointerReferences = [];

    const comboCreationStartingCardsSection = document.createElement("section");
    comboCreationStartingCardsSection.id = "comboCreationStartingCardsSection";
    const comboCreationProductCardsSection = document.createElement("section");
    comboCreationProductCardsSection.id = "comboCreationProductCardsSection";
    comboCreationSection.appendChild(comboCreationStartingCardsSection);
    comboCreationSection.appendChild(comboCreationProductCardsSection);

    const comboCreationStepsSection = document.createElement("section");
    comboCreationStepsSection.id = "comboCreationStepsSection";
    comboCreationStepsSection.stepCount = 0;
    comboCreationStepsSection.addEventListener("click", () => {
      if (comboCreationStepsSection.dataset.expanded != "true") {
        comboCreationStepsSection.dataset.expanded = "true";
        comboCreationStartingCardsSection.dataset.retracted = "true";
        comboCreationProductCardsSection.dataset.retracted = "true";
      }
      else {
        delete comboCreationStepsSection.dataset.expanded;
        delete comboCreationStartingCardsSection.dataset.retracted;
        delete comboCreationProductCardsSection.dataset.retracted;
      }
    })
    comboCreationSection.appendChild(comboCreationStepsSection);

    const comboCreationStepsBuffer = document.createElement("section");
    comboCreationStepsBuffer.id = "comboCreationStepsBuffer";
    comboCreationStepsSection.appendChild(comboCreationStepsBuffer);

    const comboCreationCardsHolder = document.createElement("comboCreationCardsHolder");
    comboCreationCardsHolder.id = "comboCreationCardsHolder";
    
    function addingComboCard(cardGroup) {
      if (comboCreationSection.dataset.adding != "true") {
        comboSectionSearchField.style.display = "block";
        comboCreationSection.dataset.adding = "true";
        comboCreationSection.style.display = "none";
        comboCreationCardsHolder.style.display = "flex";
        closeComboSearchFieldOption.style.display = "block";

        let searchedCards = comboCreationCardsHolder.getElementsByClassName("falseCard");
        for (let searchedCard of searchedCards) {
          searchedCard.dataset.group = cardGroup;
        };
        
      }
      else {
        comboSectionSearchField.style.display = "none";
        comboCreationSection.dataset.adding = "false";
        comboCreationSection.style.display = "flex";
        comboCreationCardsHolder.style.display = "none";
        closeComboSearchFieldOption.style.display = "none";
      }    
    };
      

    const addStartingCard = document.createElement("div");
    addStartingCard.id = "addStartingCard";
    addStartingCard.addEventListener("click", () => {
      comboSectionSearchField.cardGroup = "startingCard";
      addingComboCard("startingCard");
      
    });
    
    const addStartingCardTooltip = document.createElement("div")
    addStartingCardTooltip.className = "untransformedTooltip";
    const addStartingCardSpan = document.createElement("span");
    addStartingCardSpan.className = "tooltipSpan";
    addStartingCardSpan.innerText = "Add Starting Cards";
    addStartingCardSpan.dataset.not_constrained_by_xtevens_fuckery = "true";
    addStartingCardTooltip.appendChild(addStartingCardSpan);
    addStartingCard.appendChild(addStartingCardTooltip);
    comboCreationStartingCardsSection.appendChild(addStartingCard);

    const addProductCard = document.createElement("div");
    addProductCard.id = "addProductCard";
    addProductCard.addEventListener("click", () => {
      comboSectionSearchField.cardGroup = "productCard";
      addingComboCard("productCard");
    });
    const addProductCardTooltip = document.createElement("div");
    addProductCardTooltip.className = "untransformedTooltip";
    const addProductCardSpan = document.createElement("span");
    addProductCardSpan.className = "tooltipSpan";
    addProductCardSpan.innerText = "Add Product Card";
    addProductCardSpan.dataset.not_constrained_by_xtevens_fuckery = "true";
    addProductCardTooltip.appendChild(addProductCardSpan);
    addProductCard.appendChild(addProductCardTooltip);
    comboCreationProductCardsSection.appendChild(addProductCard);

    const comboSectionSearchField = createCardSearchField(comboCreationCardsHolder, "combo");
    comboLinesOptionsSection.appendChild(comboSectionSearchField);

    const closeComboSearchFieldOption = document.createElement("div");
    closeComboSearchFieldOption.id = "closeComboSearchFieldOption";
    closeComboSearchFieldOption.style.backgroundImage = `url(${browser.runtime.getURL("icons/cancel_icon.png")})`;
    const closeComboSearchFieldOverlay = document.createElement("div");
    closeComboSearchFieldOverlay.className = "optionOverlay";
    const closeComboSearchFieldTooltip = document.createElement("div");
    closeComboSearchFieldTooltip.className = "untransformedTooltip";
    closeComboSearchFieldTooltip.dataset.leftmost = "true";
    const closeComboSearchFieldtooltipSpan = document.createElement("span");
    closeComboSearchFieldtooltipSpan.className = "tooltipSpan";
    closeComboSearchFieldtooltipSpan.innerText = "Cancel Search";
    closeComboSearchFieldtooltipSpan.dataset.not_constrained_by_xtevens_fuckery = "true";

    closeComboSearchFieldOption.addEventListener("click", () => {
      addStartingCard.click();
    })
    closeComboSearchFieldTooltip.appendChild(closeComboSearchFieldtooltipSpan);
    closeComboSearchFieldOverlay.appendChild(closeComboSearchFieldTooltip);
    closeComboSearchFieldOption.appendChild(closeComboSearchFieldOverlay);
    comboLinesOptionsSection.appendChild(closeComboSearchFieldOption);


    const stepInputCluster = document.createElement("section");
    stepInputCluster.id = "stepInputCluster";
    stepInputCluster.className = "inputCluster";

    const stepDescriptionInputField = document.createElement("textarea");
    stepDescriptionInputField.id = "stepDescriptionInputField";
    stepDescriptionInputField.className = "inputClusterTextField";
    stepDescriptionInputField.addEventListener("click", (e) => {
      e.stopPropagation();
    })
    stepInputCluster.appendChild(stepDescriptionInputField);

    const establishPointerLink = document.createElement("div");
    establishPointerLink.id = "establishPointerLink";
    establishPointerLink.className = "inputClusterSubmit";  
    establishPointerLink.addEventListener("click", () => {
      let step = document.createElement("div");
      step.className = "comboCreationStep";
      step.dataset.step_number = comboCreationStepsSection.stepCount + 1;
      let pointer = comboCreationSection.pointer;
      let pointerReferences = [];
      
      if (comboCreationSection.pointerReferences != undefined) {
        for (let reference of comboCreationSection.pointerReferences) {
          pointerReferences.push(reference); 
          // this is to create a new list that avoids creating a dead reference
        }
      }
  
      step.referenceSet = [];
      step.referenceSet.push(pointer, ...pointerReferences);

      step.addEventListener("mouseenter", () => {
        pointer.dataset.pointer_mode = "true";
        for (let reference of pointerReferences) {
          reference.dataset.pointer_mode = "true";
        }
      });

      step.addEventListener("mouseleave", () => {
        pointer.dataset.pointer_mode = "false";
        for (let reference of pointerReferences) {
          reference.dataset.pointer_mode = "false";
        }
      });

      step.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        CSContextMenu.deleteStepFunction = () => {
          comboCreationStepsBuffer.removeChild(step);
          const steps = document.getElementsByClassName("comboCreationStep");
          deleteStepCorrection(step.dataset.step_number, steps)
          
        };
        let targetLeft = parseInt(window.getComputedStyle(addonField).getPropertyValue("left").slice(0, -2));
        let CSContextWidth = parseInt(window.getComputedStyle(CSContextMenu).getPropertyValue("width").slice(0, -2))
        let deck_constructor_width = parseInt($("#deck_constructor").css("width").slice(0, -2));
        let deck_constructor_margin = (window.innerWidth - deck_constructor_width) / 2;
        let CSContextMenuHeight = parseInt(window.getComputedStyle(CSContextMenu).getPropertyValue("height").slice(0, -2))
        let chosenTop = e.clientY;
    
        if (chosenTop + CSContextMenuHeight > window.innerHeight) {
          chosenTop = chosenTop - ((chosenTop + CSContextMenuHeight) - window.innerHeight);
        };
        CSContextMenu.style.top = chosenTop + "px";
        CSContextMenu.style.left = (e.clientX - deck_constructor_margin - targetLeft - (CSContextWidth / 2)) + "px";
        CSContextMenu.dataset.revealed = "true";

        CSContextMenu.openModificationFunction = () => {
          stepModificationDescriptionInputField.value = descriptionBlockSpan.innerText;
        }
        CSContextMenu.modificationFunction = () => {
          descriptionBlockSpan.innerText = stepModificationDescriptionInputField.value;
        }
        

        document.addEventListener("mousedown", closeComboStepContextMenu)
      });

      let stepSpan = document.createElement("span");
      stepSpan.className = "comboCreationStepSpan";
      stepSpan.innerText = comboCreationStepsSection.stepCount + 1;
      step.appendChild(stepSpan);

      let stepDescriptionBlock = document.createElement("div");
      stepDescriptionBlock.className = "stepDescriptionBlock";
      let descriptionBlockSpan = document.createElement("span");
      descriptionBlockSpan.className = "generalSpan";
      descriptionBlockSpan.innerText = stepDescriptionInputField.value;
      stepDescriptionBlock.appendChild(descriptionBlockSpan);
      step.appendChild(stepDescriptionBlock);

      comboCreationStepsBuffer.appendChild(step)
      comboCreationStepsSection.stepCount += 1;
      stepDescriptionInputField.value = "";
      if (comboCreationStepsSection.stepCount == 1 ) {
        comboLinesOptionsSection.dataset.steps_inserted = "true";
      };
    })
    const establishPointerLinkSpan = document.createElement("span");
    establishPointerLinkSpan.className = "tooltipSpan";
    establishPointerLinkSpan.innerText = "Establish Step";
    establishPointerLink.appendChild(establishPointerLinkSpan);
    stepInputCluster.appendChild(establishPointerLink);
    comboCreationSection.appendChild(stepInputCluster);


    const stepModificationInputCluster = document.createElement("section");
    stepModificationInputCluster.id = "stepModificationInputCluster";
    stepModificationInputCluster.className = "inputCluster";

    const stepModificationDescriptionInputField = document.createElement("textarea");
    stepModificationDescriptionInputField.id = "stepModificationDescriptionInputField";
    stepModificationDescriptionInputField.className = "inputClusterTextField";
    stepModificationDescriptionInputField.addEventListener("click", (e) => {
      e.stopPropagation();
    })
    stepModificationInputCluster.appendChild(stepModificationDescriptionInputField);

    const establishModification = document.createElement("div");
    establishModification.id = "establishModification";
    establishModification.className = "inputClusterSubmit";
    establishModification.addEventListener("click", () => {
      CSContextMenu.modificationFunction();
    });
    
    const establishModificationSpan = document.createElement("span");
    establishModificationSpan.className = "tooltipSpan";
    establishModificationSpan.innerText = "Commit Changes";
    establishModification.appendChild(establishModificationSpan);
    stepModificationInputCluster.appendChild(establishModification);
    comboCreationSection.appendChild(stepModificationInputCluster);
    
    
    comboExpandedSection.appendChild(comboLinesOptionsSection);
    comboExpandedSection.appendChild(comboLinesCombosSection);
    comboExpandedSection.appendChild(comboCreationSection);
    comboExpandedSection.appendChild(comboCreationCardsHolder);
    comboSpanBlock.appendChild(comboSectionText);
    comboLinesSection.appendChild(comboExpandedSection);
    comboLinesSection.appendChild(comboSpanBlock);
    return comboLinesSection;
};


function createHelperTool(addonField, yugipediaLinkSpan, previewedCard, deckConstructorBG) {
  let helperTool = document.createElement("div");
  helperTool.id = "infoHelperTool";
 
  helperTool.addEventListener("click", (e) => {
    e.stopPropagation();
    if (helperTool.dataset.toggle_locked != "true") {

      if (addonField.dataset.open != "true") {
        helperTool.dataset.toggle_locked = "true";
        $("#addonField").css("display", "block").promise().done(() => {
          setTimeout(() => addonField.dataset.open = "true", 10);
        });
        

        let cardName = previewedCard.innerText;
        let modifiedName = previewedCard.innerText.replaceAll(" ", "_");
        yugipediaLinkSpan.innerText = `https://yugipedia.com/wiki/${modifiedName}`;
        yugipediaLinkSpan.onclick = () => window.open(`https://yugipedia.com/wiki/${modifiedName}`, "_blank");

        let potentialCards = cardNameSearch(cardName);
        for (let index = 0; index < potentialCards.length; index++) {
          if (potentialCards[index].split("^")[0] == cardName) {
            helperTool.dataset.current_card_id = potentialCards[index].split("^")[1];
            break;
          }
        };
        let cardsSection = document.getElementById("cardsSection");
        let comboLinesCombosSection = document.getElementById("comboLinesCombosSection");
        let comboLinesSection = document.getElementById("comboLinesSection");
        
        let oldCardName = helperTool.dataset.current_card_name;
        helperTool.dataset.current_card_name = cardName;
        helperTool.dataset.current_card_text = previewTextSection.innerText;
        helperTool.dataset.current_card_text_color = previewedCard.style.color;
        helperTool.dataset.current_card_src = previewImageSection.src;
        if (oldCardName != cardName) {
          for (let container of [cardsSection, comboLinesCombosSection]) {
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }
          }

        fetch("http://localhost:80/get_direct_searchers/" + helperTool.dataset.current_card_id, {method: "GET", mode: "cors"})//
        .then((res) => res.json().then((jsonRes) => {
          let searchers = jsonRes["direct_searchers"];
          for (const searcher of searchers) {
            let card = createCard(searcher["CardName"], searcher["CardIndex"]);
            cardsSection.append(card);
          }
          }));

          clearComboCreationSection();

          if (comboLinesSection.dataset.expanded == "true") {
            populateComboLinesCombosSection();
          }
        }


        // 549px 464px width & height at 244px 5px left & top
        //deckConstructorBG.style.clipPath = "polygon(144px 5px, 144px 469px, 793px 469px, 793px 5px)";
        deckConstructorBG.style.transition = ".75s";
        deckConstructorBG.style.opacity = 0;
        deckConstructor.dataset.obscuring_all = "true";
        screenshotButton.dataset.obscuring = "true";
        helperTool.style.backgroundImage = `url(${browser.runtime.getURL("icons/x_sign.png")})`;
      }
      else {
        helperTool.dataset.toggle_locked = "true";
        deckConstructorBG.style.opacity = 1;
        addonField.dataset.open = "false";
        helperTool.style.backgroundImage = `url(${browser.runtime.getURL("icons/question_mark.png")})`;
        deckConstructor.dataset.obscuring_all = "false";
        screenshotButton.dataset.obscuring = "false";

      }
    }
  });

  let helperToolOverlay = document.createElement("div");

  helperToolOverlay.id = "infoHelperToolOverlay";
  helperTool.appendChild(helperToolOverlay);

  let tooltip = document.createElement("div");
  tooltip.id = "infoHelperToolTooltip";
  let tooltipSpan = document.createElement("span");
  tooltipSpan.className = "tooltipSpan";
  tooltipSpan.innerText = "Card Info";
  tooltip.appendChild(tooltipSpan);
  helperTool.appendChild(tooltip);

  helperTool.style.backgroundImage = `url(${browser.runtime.getURL("icons/question_mark.png")})`;
  return helperTool;
};


function addStartingCard(cardName, index) {
  let comboCreationSection = document.getElementById("comboCreationSection");
  let comboCreationStartingCardsSection = document.getElementById("comboCreationStartingCardsSection");
  comboCreationStartingCardsSection.appendChild(createComboLineCard(cardName, index));
}


function removeStartingCard(card) {
  let comboCreationStartingCardsSection = document.getElementById("comboCreationStartingCardsSection");
  comboCreationStartingCardsSection.removeChild(card);

  let comboCreationStepsBuffer = document.getElementById("comboCreationStepsBuffer");
  let steps = comboCreationStepsBuffer.getElementsByClassName("comboCreationStep");
  for (let step of steps) {
    for (let reference of step.referenceSet) {
      if (reference == card) {
        comboCreationStepsBuffer.removeChild(step);
        deleteStepCorrection(step.dataset.step_number, steps);
        break;
      }
    }
  }
  
}

function addProductCard(cardName, index) {
  let comboCreationSection = document.getElementById("comboCreationSection");
  let comboCreationProductCardsSection = document.getElementById("comboCreationProductCardsSection");
  comboCreationProductCardsSection.appendChild(createComboLineCard(cardName, index));
}


function createContextMenu(cardName) {
  const contextMenu = document.createElement("section");
  contextMenu.id = "contextMenu";

  const addOption = document.createElement("div");
  addOption.className = "contextMenuOption";
  addOption.id = "contextMenuAddOption";
  const addOptionSpan = document.createElement("span");
  addOptionSpan.className = "tooltipSpan";
  addOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true"
  addOptionSpan.innerText = "Add card";
  addOption.appendChild(addOptionSpan);

  addOption.addEventListener("click", () => {
    contextMenu.addFunction();
    document.dispatchEvent(new Event("mousedown"));
  })

  const removeOption = document.createElement("div");
  removeOption.className = "contextMenuOption";
  removeOption.id = "contextMenuRemoveOption";
  const removeOptionSpan = document.createElement("span");
  removeOptionSpan.className = "tooltipSpan";
  removeOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true"
  removeOptionSpan.innerText = "Remove card";
  removeOption.appendChild(removeOptionSpan);

  removeOption.addEventListener("click", () => {
    contextMenu.removeFunction();
    document.dispatchEvent(new Event("mousedown"));
  })


  const addStartingCardOption = document.createElement("div");
  addStartingCardOption.className = "contextMenuOption";
  addStartingCardOption.id = "contextMenuAddStartingCardOption";
  const addStartingCardOptionSpan = document.createElement("span");
  addStartingCardOptionSpan.className = "tooltipSpan";
  addStartingCardOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true"
  addStartingCardOptionSpan.innerText = "Add Starting Card";
  addStartingCardOption.appendChild(addStartingCardOptionSpan);

  addStartingCardOption.addEventListener("click", () => {
    contextMenu.addStartingCardFunction();
    document.dispatchEvent(new Event("mousedown"));
  })

  const removeStartingCardOption = document.createElement("div");
  removeStartingCardOption.className = "contextMenuOption";
  removeStartingCardOption.id = "contextMenuRemoveStartingCardOption";
  const removeStartingCardOptionSpan = document.createElement("span");
  removeStartingCardOptionSpan.className = "tooltipSpan";
  removeStartingCardOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true"
  removeStartingCardOptionSpan.innerText = "Remove Starting Card";
  removeStartingCardOption.appendChild(removeStartingCardOptionSpan);

  removeStartingCardOption.addEventListener("click", () => {
    contextMenu.removeStartingCardFunction();
    document.dispatchEvent(new Event("mousedown"));
  })


  const addProductCardOption = document.createElement("div");
  addProductCardOption.className = "contextMenuOption";
  addProductCardOption.id = "contextMenuAddProductCardOption";
  const addProductCardOptionSpan = document.createElement("span");
  addProductCardOptionSpan.className = "tooltipSpan";
  addProductCardOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true"
  addProductCardOptionSpan.innerText = "Add Product Card";
  addProductCardOption.appendChild(addProductCardOptionSpan);

  addProductCardOption.addEventListener("click", () => {
    contextMenu.addProductCardFunction();
    document.dispatchEvent(new Event("mousedown"));
  })

  const removeProductCardOption = document.createElement("div");
  removeProductCardOption.className = "contextMenuOption";
  removeProductCardOption.id = "contextMenuRemoveProductCardOption";
  const removeProductCardOptionSpan = document.createElement("span");
  removeProductCardOptionSpan.className = "tooltipSpan";
  removeProductCardOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true"
  removeProductCardOptionSpan.innerText = "Remove Product Card";
  removeProductCardOption.appendChild(removeProductCardOptionSpan);

  removeProductCardOption.addEventListener("click", () => {
    contextMenu.removeProductCardFunction();
    document.dispatchEvent(new Event("mousedown"));
  })
  

  const yugipediaOption = document.createElement("div");
  yugipediaOption.className = "contextMenuOption";
  yugipediaOption.id = "contextMenuYugipediaOption";
  const yugipediaOptionSpan = document.createElement("span");
  yugipediaOptionSpan.className = "tooltipSpan";
  yugipediaOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true"
  yugipediaOptionSpan.innerText = "Yugipedia";
  yugipediaOption.appendChild(yugipediaOptionSpan);
  yugipediaOption.onclick = () => {
    window.open(`https://yugipedia.com/wiki/${yugipediaOption.dataset.targetName}`, "_blank");
    document.dispatchEvent(new Event("mousedown"));
    
  }
  
  contextMenu.appendChild(addOption);
  contextMenu.appendChild(removeOption);
  contextMenu.appendChild(addStartingCardOption);
  contextMenu.appendChild(removeStartingCardOption);
  contextMenu.appendChild(addProductCardOption);
  contextMenu.appendChild(removeProductCardOption);
  contextMenu.appendChild(yugipediaOption);
  return contextMenu
}

function closeContextMenu(e) {
  if (contextMenu == e.target || contextMenu.contains(e.target)) {
    return 0
  }
  contextMenu.dataset.revealed = "false";
  e.currentTarget.removeEventListener("mousedown", closeContextMenu)
}

function contextualizeContextMenu(card) {
  if (card.parentElement.id == "cardsSection") {
    contextMenu.dataset.context = "cardsSection";
  }
  else if (card.parentElement.id == "searchedCardsSection") {
    contextMenu.dataset.context = "searchedCardsSection";
  }

  else if (card.parentElement.id == "comboCreationStartingCardsSection") {
    contextMenu.dataset.context = "comboCreationStartingCardsSection";
  }

  else if (card.parentElement.id == "comboCreationProductCardsSection") {
    contextMenu.dataset.context = "comboCreationProductCardsSection";
  }

  else if (card.dataset.group == "startingCard") {
    contextMenu.dataset.context = "addingStartingCardsSection";
  }

  else if (card.dataset.group == "productCard") {
    contextMenu.dataset.context = "addingProductCardsSection";
  }

  else {
    delete contextMenu.dataset.context;
  }

  document.getElementById("contextMenuYugipediaOption").dataset.targetName = card.dataset.name.replaceAll(" ", "_");

}


function deleteStepCorrection(stepNumber, steps) {
  let comboCreationStepsSection = document.getElementById("comboCreationStepsSection");
  let comboLinesOptionsSection = document.getElementById("comboLinesOptionsSection");
  
  comboCreationStepsSection.stepCount -= 1;
  for (let comparedStep of steps) {
    if (comparedStep.dataset.step_number > stepNumber) {
      comparedStep.dataset.step_number -= 1;
      comparedStep.getElementsByClassName("comboCreationStepSpan")[0].innerText = comparedStep.dataset.step_number;
    }
  }
  if (comboCreationStepsSection.stepCount == 0) {
    comboLinesOptionsSection.dataset.steps_inserted = "false";
  }
}


function createComboStepContextMenu() {
  let CSContextMenu = document.createElement("div");
  CSContextMenu.id = "comboStepContextMenu";

  let modifyTextOption = document.createElement("div");
  modifyTextOption.className = "contextMenuOption";

  modifyTextOption.addEventListener("click", () => {
    let stepModificationInputCluster = document.getElementById("stepModificationInputCluster");
    function closeStepInputCluster(e) {
      e.stopPropagation();
      stepModificationInputCluster.style.display = "none";
      document.removeEventListener("click", closeStepInputCluster);
    }
    stepModificationInputCluster.style.display = "flex";
    CSContextMenu.openModificationFunction();
    setTimeout(() => {
      document.addEventListener("click", closeStepInputCluster);
    }, 5);
  })
  
  let modifyTextOptionSpan = document.createElement("span");
  modifyTextOptionSpan.className = "tooltipSpan";
  modifyTextOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true";
  modifyTextOptionSpan.innerText = "Modify Text"
  modifyTextOption.appendChild(modifyTextOptionSpan);

  let deleteStepOption = document.createElement("div");
  deleteStepOption.className = "contextMenuOption";
  deleteStepOption.addEventListener("click", () => {
    CSContextMenu.deleteStepFunction();
    document.dispatchEvent(new Event("mousedown"));
  });
  let deleteStepOptionSpan = document.createElement("span");
  deleteStepOptionSpan.className = "tooltipSpan";
  deleteStepOptionSpan.dataset.not_constrained_by_xtevens_fuckery= "true";
  deleteStepOptionSpan.innerText = "Delete Step"
  deleteStepOption.appendChild(deleteStepOptionSpan);


  CSContextMenu.appendChild(modifyTextOption);
  CSContextMenu.appendChild(deleteStepOption);

  return CSContextMenu;
}

function closeComboStepContextMenu(e) {
  if (CSContextMenu == e.target || CSContextMenu.contains(e.target)) {
    return 0
  }
  CSContextMenu.dataset.revealed = "false";
  e.currentTarget.removeEventListener("mousedown", closeComboStepContextMenu);
}


function dbSearchCard(cardName) {
  let searchInputField = document.getElementById("search").getElementsByClassName("name_txt")[0];
  let searchInputProxy = document.getElementById("search").getElementsByClassName("textinput")[0];
  let searchButton = document.getElementById("search").getElementsByClassName("search_btn")[0];
  searchInputProxy.value = cardName;
  searchInputField.value = cardName;
  searchInputField.textContent = cardName;
  searchInputProxy.textContent = cardName;
  searchButton.click();
};


function restoreDefaultCardDisplay() {
  previewTextSection.innerText = helperTool.dataset.current_card_text;
  previewImageSection.src = helperTool.dataset.current_card_src;
  previewedCard.innerText = helperTool.dataset.current_card_name;
  previewedCard.style.color = helperTool.dataset.current_card_text_color;
  previewColor.dataset.overlaying = null;
  setText(previewedCard);
};


function addCard(cardName, index) {
  fetch("http://localhost:80/add_direct_searcher/" + cardName +"/" + index + "/" + $("#infoHelperTool").attr("data-current_card_id"), 
  {
    method: "POST", mode: "cors"}).then((res) => res.json().then((jsonRes) => {
      if (jsonRes["result"] == "successful") {
        let card = createCard(cardName, index);
        document.getElementById("cardsSection").appendChild(card);
      }
    })
    )
};

function cardRevealContextMenu(e, cardName, index) {
  let targetLeft = parseInt(window.getComputedStyle(addonField).getPropertyValue("left").slice(0, -2));
  let contextWidth = parseInt(window.getComputedStyle(contextMenu).getPropertyValue("width").slice(0, -2))
  let deck_constructor_width = parseInt($("#deck_constructor").css("width").slice(0, -2));
  let deck_constructor_margin = (window.innerWidth - deck_constructor_width) / 2;
  let contextMenuHeight = parseInt(window.getComputedStyle(contextMenu).getPropertyValue("height").slice(0, -2))
  let chosenTop = e.clientY;
  if (chosenTop + contextMenuHeight > window.innerHeight) {
    chosenTop = chosenTop - ((chosenTop + contextMenuHeight) - window.innerHeight);
  };

  contextMenu.style.top = chosenTop + "px";
  contextMenu.style.left = (e.clientX - deck_constructor_margin - targetLeft - (contextWidth / 2)) + "px";
  contextMenu.dataset.revealed = "true";

  document.addEventListener("mousedown", closeContextMenu);
};


function overlayCardInfo(cardName, index, cardArtwork) {
  previewedCard.innerText = cardName;
  previewedCard.style.color = "rgb(150, 150, 250)";
  previewTextSection.innerText = cards[index]["e"];
  previewImageSection.style.backgroundImage = cardArtwork.style.backgroundImage;
  previewImageSection.src = "";
  previewColor.dataset.overlaying = "true";
  setText(previewedCard);
};

function createCard(cardName, index) {
  const card = document.createElement("div");
  
  card.className = "falseCard";
  let cardId = cards[index]["id"];
  let cardType = cards[index]["c"];
  card.style.backgroundImage = `url(${browser.runtime.getURL("card_appearances/" + cardBackgroundGuide[cardType])})`;
  card.dataset.name = cardName;
  const cardLabel = document.createElement("div");
  cardLabel.className = "untransformedTooltip";
  cardLabel.dataset.on_card = "true";
  cardLabel.dataset.index = index;
  const cardLabelSpan = document.createElement("span");
  cardLabelSpan.className = "tooltipSpan";
  cardLabelSpan.dataset.not_constrained_by_xtevens_fuckery = "true";
  cardLabelSpan.textContent = cardName;


  function removeCard() {
    fetch("http://localhost:80/remove_direct_searcher/" + cardName +"/" + index + "/" + $("#infoHelperTool").attr("data-current_card_id"), 
    {
      method: "POST", mode: "cors"}).then((res) => res.json().then((jsonRes) => {
        const cardsSection = document.getElementById("cardsSection");
        cardsSection.removeChild(card);
      })
      )
  };


  card.addEventListener("click", () => dbSearchCard(cardName));

  card.addEventListener("mouseenter", () => {
    overlayCardInfo(cardName, index, cardArtwork)
  });


  card.addEventListener("mouseleave", () => restoreDefaultCardDisplay());

  card.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    contextualizeContextMenu(card);

    contextMenu.addFunction = () => addCard(cardName, index);
    contextMenu.removeFunction = removeCard;
    cardRevealContextMenu(e, cardName, index)
  });

  const cardArtwork = document.createElement("div");
  cardArtwork.className = "cardArtwork";
  cardArtwork.style.backgroundImage = `url(${browser.runtime.getURL("card_appearances/9917.jpg")})`;
  fetch("http://localhost:80/card/" + cardId, {mode: "cors"
  }).then((res) => res.blob().then((blobRes) => {
    let URLHolder = URL.createObjectURL(blobRes);
    cardArtwork.style.backgroundImage = `url(${URLHolder})`;
  }));

  cardLabel.appendChild(cardLabelSpan);
  card.appendChild(cardLabel);
  card.appendChild(cardArtwork);
  return card;
};


const config = { attributes: true, childList: true, subtree: true };
window.helperToolDisabled = false;


function callback(mutationList, observer) {
  if (previewSection.parentElement.parentElement.id == "deck_constructor" 
      && window.helperToolDisabled == false) {
    helperTool.style.display = "block";
  }

  else {
    helperTool.style.display = "none";
  }
};




const deckConstructor = document.getElementById("deck_constructor");
const screenshotButton = document.getElementById("screenshot_btn");
const addonField = createAddonField();

const contextMenu = createContextMenu();
addonField.appendChild(contextMenu);

const CSContextMenu = createComboStepContextMenu();
addonField.appendChild(CSContextMenu);

const [yugipediaSection, yugipediaLinkSpan] = createYugipediaSection();
addonField.appendChild(yugipediaSection);

const searchersSection = createSearchersSection();
addonField.appendChild(searchersSection);

const comboLinesSection = createcomboLinesSection();
addonField.appendChild(comboLinesSection);

deckConstructor.appendChild(addonField); 
const previewSection = document.getElementById("preview");
const exitButton = deckConstructor.getElementsByClassName("room_exit_btn")[0];
exitButton.addEventListener("click", () => {
  addonField.dataset.open = "false";
  helperTool.style.backgroundImage = `url(${browser.runtime.getURL("icons/question_mark.png")})`;
  deckConstructorBG.style.opacity = 1;
  deckConstructor.dataset.obscuring_all = "false";
  screenshotButton.dataset.obscuring = "false";
  $("#infoHelperTool").attr("data-toggle_locked", "false"); 
    
  
})

const previewedCard = previewSection.getElementsByClassName("name_txt")[0];
const previewTextSection = document.getElementById("preview_txt").getElementsByClassName("os-textarea")[0];
const previewImageSection = previewSection.getElementsByClassName("pic")[0];
previewImageSection.style.backgroundSize = "cover";
previewImageSection.style.backgroundPosition = "center";
previewImageSection.style.backgroundRepeat = "no-repeat";


const previewColor = previewSection.getElementsByClassName("card_color")[0]

const deckConstructorBG = deckConstructor.getElementsByClassName("deck_constructor")[0];

const helperTool = createHelperTool(addonField, yugipediaLinkSpan, previewedCard, deckConstructorBG);

previewSection.getElementsByClassName("cardfront_content")[0].appendChild(helperTool);


//240 px is the distance from the leftmost side of the side of the screen to the area where cards are displayed.
// because the screen maintains an aspect ratio, the value can be gauged by comparing the screen's size to its default.


previewSection.addEventListener("click", () => {
  if (previewSection.parentElement.parentElement.id == "deck_constructor") {
    if (window.helperToolDisabled == false) {
      window.helperToolDisabled = true;
      helperTool.style.display = "none";
    }

    else {
      window.helperToolDisabled = false;
      helperTool.style.display = "block";
    }
  }
  

});




const mObserver = new MutationObserver(callback);

mObserver.observe(previewedCard, config);
})
