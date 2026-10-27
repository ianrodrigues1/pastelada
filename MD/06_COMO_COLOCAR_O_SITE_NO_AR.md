# 🌐 COMO COLOCAR O SITE NO AR (HOSPEDAGEM CUSTO R$ 0)
**Pastelada — Sistema de Pedidos & Delivery**

Este guia ensina o passo a passo para disponibilizar o site na internet com o seu próprio domínio (ex: `www.pastelada.com.br`) de forma profissional, rápida e **sem pagar mensalidades de servidor**.

---

## 💡 Qual é o Custo Mensal de Hospedagem?

- **Hospedagem da Aplicação:** **R$ 0,00 / mês**. Plataformas como **Netlify** ou **Vercel** possuem planos gratuitos que suportam tranquilamente mais de 100.000 acessos por mês para restaurantes locais.
- **Domínio Próprio (`pastelada.com.br`):** Apenas cerca de **R$ 40,00 por ANO** (pago diretamente no [Registro.br](https://registro.br)).

---

## MÉTODO 1: Publicação por Arrastar e Soltar (Netlify Drop — 2 Minutos)

Este é o método mais simples do mundo para quem não é programador:

### Passo 1: Gerar os Arquivos Finais da Aplicação
1. No seu computador, abra a pasta do projeto.
2. Abra o terminal (ou Prompt de Comando) dentro da pasta e digite:
   ```bash
   npm run build
   ```
3. O sistema criará em poucos segundos uma pasta chamada **`dist`** dentro do projeto. Essa pasta contém todo o site pronto para a internet.

### Passo 2: Fazer o Upload no Netlify
1. Abra seu navegador e acesse: **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Se ainda não tiver conta, crie uma gratuitamente com seu e-mail ou Google.
3. Na tela do Netlify, você verá um círculo com a mensagem *"Drag and drop your site output folder here"*.
4. **Arraste a pasta `dist`** do seu computador para dentro desse círculo na tela do navegador!
5. **Pronto!** Em 15 segundos o seu site estará online com um link público seguro com HTTPS (cadeado verde).

---

## MÉTODO 2: Conectar com o Domínio Próprio (`www.pastelada.com.br`)

Depois de subir o site no Netlify:
1. No painel do seu site no Netlify, clique em **"Domain management"** e depois em **"Add domain"**.
2. Digite o seu domínio: `pastelada.com.br`.
3. O Netlify mostrará as instruções para apontar o DNS:
   - **Registro Tipo A:** Apontando para o endereço IP fornecido pelo Netlify.
   - **Registro Tipo CNAME (`www`):** Apontando para o seu subdomínio do Netlify.
4. Acesse o site onde você comprou o domínio (por exemplo, no [Registro.br](https://registro.br) ou na GoDaddy) e adicione esses dois apontamentos.
5. Em até algumas horas, quem digitar `www.pastelada.com.br` no celular ou computador cairá direto no seu delivery!

---

## MÉTODO 3: Hospedagem Tradicional cPanel (Hostgator / Locaweb / UOLHost)

Se você já paga uma hospedagem compartilhada com painel cPanel:

1. Gere a pasta `dist` rodando `npm run build`.
2. Acesse o **cPanel** da sua hospedagem e abra o **Gerenciador de Arquivos**.
3. Acesse a pasta raiz do seu domínio (geralmente chamada de **`public_html`**).
4. Envie todos os arquivos de dentro da pasta `dist` para dentro do `public_html`.
5. Garanta que exista um arquivo chamado `.htaccess` no `public_html` com as regras de redirecionamento (fornecidas no arquivo original do projeto).

---

## 💻 Como Rodar no Computador para Testar (Uso Local)

Se você quiser apenas abrir o site no seu computador para testar ou demonstrar para alguém:
- Dê **dois cliques** no arquivo **`iniciar_servidor_windows.bat`** na pasta principal do projeto.
- O sistema abre no seu navegador em: `http://localhost:3000`.
