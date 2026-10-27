# Pastelada

Aplicação web de pastelaria com cardápio digital, montagem personalizada de pastéis, carrinho, checkout demonstrativo, acompanhamento de pedidos e painel administrativo para operação da loja.

## Requisitos

- Node.js LTS e npm
- Windows, macOS ou Linux

## Começar

```bash
npm install
npm run dev
```

Abra http://localhost:3000. No Windows, também é possível iniciar com `iniciar_servidor_windows.bat`.

Para produção local:

```bash
npm run build
npm run preview
```

`npm run lint` verifica os tipos TypeScript.

## Configuração e segurança

- `.env.example` contém somente valores fictícios. Copie para `.env` e preencha apenas as integrações que for usar.
- `.env` está no `.gitignore`; nunca envie credenciais ao GitHub, nem em exemplos, screenshots ou logs.
- As integrações do painel começam sem chaves configuradas. Cadastre credenciais de teste ou produção diretamente no ambiente apropriado.
- O projeto atual é um protótipo frontend: dados de operação ficam no armazenamento local do navegador. Integrações de pagamento e autenticação precisam de um backend seguro para uso real; não exponha segredos no código do cliente.
- Se alguma chave real já foi publicada em um commit, revogue/rotacione-a no provedor. Remover do arquivo atual não apaga o histórico Git; limpe o histórico antes de tornar público o repositório.

## Estrutura

- `src/components/`: interface pública, checkout e painel administrativo.
- `src/data/seedData.ts`: catálogo fictício e dados iniciais sem credenciais.
- `src/services/storeService.ts`: regras da loja e persistência local.
- `MD/`: manuais operacionais e de configuração.
- `index.html`: metadados e ponto de entrada.

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento na porta 3000 |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a compilação de produção |
| `npm run lint` | Verifica tipos TypeScript |

## Preparar commits

Organize as alterações em commits pequenos e revise o conteúdo de cada um antes de enviar:

```bash
git status --short
git diff --check
git diff

git add README.md MD/ index.html metadata.json package.json package-lock.json iniciar_servidor_windows.bat
git commit -m "docs: atualizar identidade e guia do projeto"

git add src/index.css src/App.tsx src/components/ src/types/
git commit -m "feat: atualizar marca e identidade visual para Pastelada"

git add src/data/seedData.ts src/services/ .env.example .gitignore
git commit -m "fix: remover credenciais de demonstração"

# Só depois de revisar que .env não está listado:
git status --short
git push -u origin HEAD
```

Se a branch ainda não existir no remoto, o `git push -u origin HEAD` cria o vínculo com o nome atual da branch. Nunca use `git add .env`.
