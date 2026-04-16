const form = document.querySelector("[data-contact-form]");
const statusMessage = document.querySelector("[data-form-status]");

if (form && statusMessage) {
    const submitButton = form.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton.textContent;

    const updateStatus = (message, type) => {
        statusMessage.textContent = message;
        statusMessage.className = `form-status ${type}`;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        updateStatus("Enviando sua mensagem...", "loading");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Nao foi possivel enviar a mensagem.");
            }

            form.reset();
            updateStatus(result.message, "success");
        } catch (error) {
            updateStatus(error.message, "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = defaultButtonText;
        }
    });
}
