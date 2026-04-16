function sendJson(response, statusCode, payload) {
    response.status(statusCode).json(payload);
}

function parseBody(body) {
    if (!body) {
        return {};
    }

    if (typeof body === "string") {
        return JSON.parse(body);
    }

    return body;
}

function validateContactPayload(payload) {
    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim();
    const subject = String(payload.subject || "").trim() || "outro";
    const message = String(payload.message || "").trim();

    if (!name || !email || !message) {
        return { error: "Preencha nome, e-mail e mensagem." };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return { error: "Informe um e-mail valido." };
    }

    return {
        data: {
            name,
            email,
            subject,
            message,
            createdAt: new Date().toISOString()
        }
    };
}

module.exports = async (request, response) => {
    if (request.method !== "POST") {
        sendJson(response, 405, { message: "Metodo nao permitido." });
        return;
    }

    try {
        const payload = parseBody(request.body);
        const validation = validateContactPayload(payload);

        if (validation.error) {
            sendJson(response, 400, { message: validation.error });
            return;
        }

        console.log("Nova mensagem de contato:", validation.data);

        sendJson(response, 201, {
            message: "Mensagem enviada com sucesso. Retornaremos em breve."
        });
    } catch {
        sendJson(response, 400, {
            message: "Nao foi possivel interpretar os dados enviados."
        });
    }
};
