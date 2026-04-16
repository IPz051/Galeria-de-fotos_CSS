const http = require("http");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const ROUTE_MAP = {
    "/": "/Page/index.html",
    "/sobre": "/Page/sobre.html",
    "/contato": "/Page/contato.html"
};

const CONTENT_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".gif": "image/gif",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
};

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8"
    });

    response.end(JSON.stringify(payload));
}

async function ensureStorage() {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
        await fs.access(MESSAGES_FILE);
    } catch {
        await fs.writeFile(MESSAGES_FILE, "[]\n", "utf8");
    }
}

async function readRequestBody(request) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let totalLength = 0;

        request.on("data", (chunk) => {
            totalLength += chunk.length;

            if (totalLength > 1_000_000) {
                reject(new Error("Payload muito grande."));
                request.destroy();
                return;
            }

            chunks.push(chunk);
        });

        request.on("end", () => {
            resolve(Buffer.concat(chunks).toString("utf8"));
        });

        request.on("error", reject);
    });
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
            id: crypto.randomUUID(),
            name,
            email,
            subject,
            message,
            createdAt: new Date().toISOString()
        }
    };
}

async function saveMessage(message) {
    await ensureStorage();

    const currentContent = await fs.readFile(MESSAGES_FILE, "utf8");
    const currentMessages = JSON.parse(currentContent);

    currentMessages.push(message);

    await fs.writeFile(
        MESSAGES_FILE,
        `${JSON.stringify(currentMessages, null, 2)}\n`,
        "utf8"
    );
}

async function handleContactRequest(request, response) {
    if (request.method !== "POST") {
        sendJson(response, 405, { message: "Metodo nao permitido." });
        return;
    }

    try {
        const rawBody = await readRequestBody(request);
        const payload = JSON.parse(rawBody || "{}");
        const validation = validateContactPayload(payload);

        if (validation.error) {
            sendJson(response, 400, { message: validation.error });
            return;
        }

        await saveMessage(validation.data);

        sendJson(response, 201, {
            message: "Mensagem enviada com sucesso. Retornaremos em breve."
        });
    } catch (error) {
        const isSyntaxError = error instanceof SyntaxError;
        const isPayloadTooLarge = error.message === "Payload muito grande.";
        const statusCode = isSyntaxError ? 400 : isPayloadTooLarge ? 413 : 500;
        const message = isSyntaxError
            ? "Nao foi possivel interpretar os dados enviados."
            : isPayloadTooLarge
                ? error.message
                : "Erro interno ao processar sua mensagem.";

        sendJson(response, statusCode, { message });
    }
}

function getSafeFilePath(requestUrl) {
    const normalizedPath = ROUTE_MAP[requestUrl] || requestUrl;
    const relativePath = normalizedPath.replace(/^\/+/, "");
    const filePath = path.resolve(ROOT_DIR, relativePath);

    if (!filePath.startsWith(ROOT_DIR)) {
        return null;
    }

    if (filePath.startsWith(DATA_DIR)) {
        return null;
    }

    return filePath;
}

async function serveStaticFile(requestUrl, response) {
    const filePath = getSafeFilePath(requestUrl);

    if (!filePath) {
        sendJson(response, 403, { message: "Acesso negado." });
        return;
    }

    try {
        const content = await fs.readFile(filePath);
        const extension = path.extname(filePath).toLowerCase();
        const contentType = CONTENT_TYPES[extension] || "application/octet-stream";

        response.writeHead(200, { "Content-Type": contentType });
        response.end(content);
    } catch (error) {
        if (error.code === "ENOENT") {
            sendJson(response, 404, { message: "Arquivo nao encontrado." });
            return;
        }

        sendJson(response, 500, { message: "Erro ao carregar o arquivo." });
    }
}

const server = http.createServer(async (request, response) => {
    if (!request.url) {
        sendJson(response, 400, { message: "Requisicao invalida." });
        return;
    }

    const requestUrl = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);

    if (requestUrl.pathname === "/api/contact") {
        await handleContactRequest(request, response);
        return;
    }

    await serveStaticFile(requestUrl.pathname, response);
});

server.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
