(function () {
  "use strict";

  const forms = document.querySelectorAll(".php-email-form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const thisForm = this;

      const loading = thisForm.querySelector(".loading");
      const errorMessage = thisForm.querySelector(".error-message");
      const sentMessage = thisForm.querySelector(".sent-message");

      loading.classList.add("d-block");
      errorMessage.classList.remove("d-block");
      sentMessage.classList.remove("d-block");

      // Make sure your inputs have these *name* attributes:
      // name="name", name="email", name="subject", name="message"
      const name = (thisForm.querySelector('[name="name"]')?.value || "").trim();
      const email = (thisForm.querySelector('[name="email"]')?.value || "").trim();
      const subject = (thisForm.querySelector('[name="subject"]')?.value || "").trim();
      const message = (thisForm.querySelector('[name="message"]')?.value || "").trim();

      // Send as x-www-form-urlencoded to guarantee PHP fills $_POST
      const params = new URLSearchParams();
      params.set("name", name);
      params.set("email", email);
      params.set("subject", subject);
      params.set("message", message);

      fetch(thisForm.action, {
        method: "POST",
        body: params.toString(),
        headers: {
          // Simple request → no preflight
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json"
        },
        credentials: "omit"
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          // Try to parse JSON; if not JSON, throw to show raw text
          const text = await response.text();
          try {
            return JSON.parse(text);
          } catch {
            throw new Error(text || "Unexpected non-JSON response");
          }
        })
        .then((data) => {
          loading.classList.remove("d-block");
          if (data.status === "success") {
            sentMessage.classList.add("d-block");
            thisForm.reset();
          } else {
            throw new Error(data.message || "Unknown error occurred");
          }
        })
        .catch((error) => {
          loading.classList.remove("d-block");
          errorMessage.textContent = error.message;
          errorMessage.classList.add("d-block");
          console.error("Error:", error);
        });
    });
  });
})();
