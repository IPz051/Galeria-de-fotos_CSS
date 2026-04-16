# Portfólio de Fotografia Profissional

Este projeto consiste em um website completo, moderno e responsivo para um portfólio de fotografia, desenvolvido como parte do curso OneBitCode (Fullstack). O objetivo é demonstrar habilidades em HTML5 semântico e CSS3 moderno (Flexbox, Grid/Masonry, Variáveis CSS).

## 🎨 Design e Funcionalidades

- **Layout Masonry**: A galeria utiliza um layout estilo "masonry" (alvenaria) que se adapta perfeitamente a imagens de diferentes proporções (retrato, paisagem, quadrado).
- **Tema Escuro (Dark Mode)**: Uma paleta de cores escura e elegante (`#121212`) para destacar as fotografias, com detalhes em dourado (`#d4af37`) para um toque de sofisticação.
- **Tipografia**: Uso das fontes *Playfair Display* (serifada) para títulos e *Montserrat* (sans-serif) para corpo de texto.
- **Responsividade**: O layout se adapta a diferentes tamanhos de tela (Desktop, Tablet, Mobile).
- **Páginas**:
  - **Portfólio**: Galeria principal de imagens.
  - **Sobre**: Informações sobre o fotógrafo, com layout de imagem + texto.
  - **Contato**: Formulário de contato estilizado e informações de localização.
- **API Própria de Contato**: Envio assíncrono do formulário para um back-end local em Node.js.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica (`<header>`, `<main>`, `<section>`, `<form>`, `<footer>`).
- **CSS3**:
  - CSS Variables (`var(--bg-color)`) para fácil manutenção.
  - `column-count` para o layout masonry.
  - Flexbox para layouts gerais (nav, formulários, rodapé).
  - Media Queries para responsividade.
- **Google Fonts**: Integração de fontes web.
- **Unsplash Source**: Imagens de placeholder de alta qualidade.
- **Node.js**: Servidor HTTP local e endpoint `POST /api/contact`.

## 🚀 Como Executar Localmente

1. Clone ou baixe este repositório.
2. No terminal, acesse a pasta do projeto.
3. Execute `npm run dev`.
4. Abra `http://127.0.0.1:3000` no navegador.
5. Navegue entre as páginas através do menu superior.

## ▲ Deploy na Vercel

1. Importe o repositório na Vercel.
2. Mantenha a raiz do projeto como diretório de deploy.
3. As páginas principais ficam na raiz do projeto:
   - `/` -> `index.html`
   - `/sobre` -> `sobre.html`
   - `/contato` -> `contato.html`
4. A função serverless `api/contact.js` responderá em `POST /api/contact`.
5. Não é necessário configurar comando de build para este projeto estático.

## 📦 GitHub

- O repositório já pode ser enviado normalmente para o GitHub.
- O arquivo `.gitignore` ignora pastas e arquivos locais como `node_modules/` e `.vercel/`.
- O arquivo `data/messages.json` pode permanecer versionado com `[]` para manter a estrutura do projeto local.

## Formulário de Contato

- A página `Page/contato.html` envia os dados via `fetch()` para a rota `POST /api/contact`.
- O script front-end do formulário fica em `scripts/contact.js`.
- A função serverless da Vercel fica em `api/contact.js` e valida os campos obrigatórios (`name`, `email`, `message`).
- Em ambiente serverless, gravação permanente em arquivo local não é confiável; para persistência real, use banco de dados ou serviço de e-mail.
- O feedback de sucesso ou erro aparece na própria interface do formulário.

## 📝 Estrutura de Arquivos

```
/
├── index.html       # Página inicial na raiz para deploy
├── sobre.html       # Página Sobre na raiz para deploy
├── contato.html     # Página Contato na raiz para deploy
├── Page/
│   ├── index.html   # Versões organizadas das páginas
│   ├── sobre.html
│   └── contato.html
├── dev/
│   └── server.js    # Servidor local para desenvolvimento
├── api/
│   └── contact.js   # Função serverless da Vercel
├── scripts/
│   └── contact.js   # Script front-end do formulário
├── style/
│   └── style.css    # Estilização global
├── data/
│   └── messages.json
├── vercel.json      # Rotas de deploy na Vercel
├── package.json
├── .gitignore
└── README.md
```

## 👤 Autor

Desenvolvido durante o curso OneBitCode.
