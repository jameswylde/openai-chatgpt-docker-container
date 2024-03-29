let conversationHistory = [];
let temperatureButton;

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/< /g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function handleFormSubmit(event) {
  event.preventDefault();
  const inputText = document.getElementById("input-text").value;
  conversationHistory.push({
    role: "user",
    content: inputText,
  });

  const formattedInputText = inputText.replace(/\n/g, "<br>");

  const userMessageElement = document.createElement("div");
  userMessageElement.className = "response user-response";
  userMessageElement.innerHTML = ` ${formattedInputText}`;
  document.getElementById("response-container").appendChild(userMessageElement);

  document.getElementById("input-text").value = "";

  fetch("/api/chatgpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: conversationHistory,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Sorry, OpenAI's API is having problems - please try again"
        );
      }
      return response.json();
    })
    .then((data) => {
      const genieResponseElement = document.createElement("div");
      genieResponseElement.className = "response genie-response";

      const escapedOutput = escapeHtml(data.output);
      const formattedOutput = escapedOutput.replace(/\n/g, "<br>");

      const codeBlockRegex = /```([\s\S]*?)```/g;
      const formattedOutputWithCodeBlocks = formattedOutput.replace(
        codeBlockRegex,
        (match, p1) => {
          return `<div class="code-block-container"><pre class="code-block"><code>${p1}</code></pre><button class="copy-code-button" onclick="copyCodeToClipboard(this)"><i class="fas fa-clipboard"></i></button></div>`;
        }
      );

      genieResponseElement.innerHTML = ` ${formattedOutputWithCodeBlocks}`;

      document
        .getElementById("response-container")
        .appendChild(genieResponseElement);

      conversationHistory.push({
        role: "assistant",
        content: data.output,
      });

      document.getElementById("response-container").scrollTop =
        document.getElementById("response-container").scrollHeight;
    })
    .catch((error) => {
      console.error(error);
      const genieResponseElement = document.createElement("div");
      genieResponseElement.className = "response genie-response error-response";
      genieResponseElement.innerHTML = `Error - ${error.message}`;
      document
        .getElementById("response-container")
        .appendChild(genieResponseElement);
    });
}

function copyCodeToClipboard(button) {
  const codeBlock = button.previousElementSibling.querySelector("code");
  const range = document.createRange();
  range.selectNode(codeBlock);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  button.innerHTML = '<i class="fas fa-check"></i>';
  setTimeout(() => {
    button.innerHTML = '<i class="fas fa-clipboard"></i>';
  }, 2000);
}

function changeModel() {
  const modelSelect = document.getElementById("model-select");
  const selectedModel = modelSelect.options[modelSelect.selectedIndex].value;

  fetch("/api/set_model", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedModel,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      const responseContainer = document.getElementById("response-container");
      responseContainer.innerHTML = "";
      conversationHistory = [];
    });
}

function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    handleFormSubmit(event);
  }
}

function clearConversation() {
  document.getElementById("response-container").innerHTML = "";
  conversationHistory = [];
}

document.addEventListener("DOMContentLoaded", function () {
  const modelSelect = document.getElementById("model-select");
  modelSelect.addEventListener("change", changeModel);

  const inputText = document.getElementById("input-text");
  inputText.addEventListener("keypress", handleKeyPress);

  temperatureButton = document.getElementById("temperature-button");

  document.body.classList.add("dark-mode");

  document.querySelector(".dark-mode-toggle").classList.add("dark");

  document
    .querySelector(".dark-mode-toggle")
    .addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      this.classList.toggle("dark");
    });

  const betaPopup = document.getElementById("beta-popup");
  const acceptBetaButton = document.getElementById("accept-beta");

  const betaAccepted = document.cookie.includes("betaAccepted=true");

  if (!betaAccepted) {
    betaPopup.style.display = "flex";
  }

  acceptBetaButton.addEventListener("click", function () {
    betaPopup.style.display = "none";

    document.cookie = "betaAccepted=true; max-age=2592000";
  });

  const popup = document.getElementById("temperature-popup");
  const popupSlider = document.getElementById("popup-temperature-slider");
  const popupTemperatureValue = document.getElementById("popup-temperature-value");
  const applyPopupButton = document.getElementById("apply-popup-temperature");
  const closeButton = document.getElementById("close-popup");

  temperatureButton.addEventListener("click", function () {
    popup.style.display = "block";
  });

  closeButton.addEventListener("click", function () {
    popup.style.display = "none";
  });

  popupSlider.addEventListener("input", function () {
    popupTemperatureValue.textContent = popupSlider.value;
  });

  applyPopupButton.addEventListener("click", function () {
    const selectedPopupTemperature = parseFloat(popupSlider.value);
    const selectedModel = modelSelect.options[modelSelect.selectedIndex].value;

    fetch("/api/set_model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        temperature: selectedPopupTemperature,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        const responseContainer = document.getElementById("response-container");
        responseContainer.innerHTML = "";
        conversationHistory = [];

        popup.style.display = "none";
      });
  });
});
