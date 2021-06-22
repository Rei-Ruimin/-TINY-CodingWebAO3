// Initialize button with user's preferred color
let addTerminal_btn = document.getElementById("addTerminal");
let reset_btn = document.getElementById("reset");


// When the button is clicked, inject setPageBackgroundColor into current page
addTerminal_btn.addEventListener("click", function () { handleClickBtn(reloadTerminalsToArticle); });
reset_btn.addEventListener("click", function () { handleClickBtn(removeTerminalsFromArticle); });

// Reacts to a button click by marking the selected button and saving
// the selection
async function handleClickBtn(callbackfunction) {
  // test the correct webpage
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // not single chapter in AO3
  if (/^https:\/\/archiveofourown\.org\/works\/.*view_full_work=true$/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        alert("Please choose a chapter! \nConsidering some articles is too long (the extension may stuck for seconds), full work is not supported yet...");
      },
    });
  }
  // YESSS
  else if (/^https:\/\/archiveofourown\.org\/works\//.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: callbackfunction,
    });
  }
  // not even in AO3
  else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        alert("Please open an AO3 work page with url ike following one~ \nhttps://archiveofourown.org/works/...");
      },
    });
  }
}

// The body of this function will be executed as a content script inside the
// current page
function reloadTerminalsToArticle() {
  // remove all div added
  document.querySelectorAll('[role="article"] div')
    .forEach((div) => {
      if (div.classList.contains("codestuff")) {
        div.remove();
      }
    });

  // get all keys
  chrome.storage.local.get(null, function (items) {
    let terminal_html = items['terminal_html']
    let div = document.createElement('div');
    div.innerHTML = terminal_html.trim();
    let terminal_list = div.children;
    
    document.querySelectorAll('[role="article"] p')
      .forEach((p) => {
        let terminal_div = document.createElement('div');
        terminal_div.classList.add("codestuff");
        
        let randomIndex = Math.floor(Math.random() * div.childElementCount);
        //!!! if not cloned the terminal_div.appendChild(terminal_list[randomIndex]); will move child from the terminal_list
        terminal_div.appendChild(terminal_list[randomIndex].cloneNode(true));
        p.insertAdjacentElement('afterend', terminal_div);
      });
  });
}

function removeTerminalsFromArticle() {
  // get all keys
  document.querySelectorAll('[role="article"] div')
    .forEach((div) => {
      if (div.classList.contains("codestuff")) {
        div.remove();
      }
    });
}