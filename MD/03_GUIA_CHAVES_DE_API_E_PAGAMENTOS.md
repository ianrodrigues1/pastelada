# 🔑 GUIA COMPLETO: COMO E O QUE COLOCAR NAS CHAVES DE API
**Pastelada — Sistema de Pagamentos & Notificações**

Este é o documento mais importante para a operação financeira do seu site. As **Chaves de API** são "senhas especiais de comunicação" que conectam a sua loja online diretamente à sua conta bancária do **Mercado Pago** e ao seu serviço de e-mails do **Resend**.

Ao configurar essas chaves, **100% do dinheiro das vendas feitas no site cai diretamente na sua conta**, sem passar por intermediários.

---

## 🧭 Onde você preenche essas chaves?

Você tem duas formas muito fáceis de preencher:

### Opção A — Diretamente pela Tela do Painel Admin (Mais Fácil)
1. Abra o site no seu navegador e entre no **Painel Admin** (no rodapé da página).
2. No menu lateral, clique na aba **"Integrações (2FA)"**.
3. Você verá os cartões com os campos prontos para digitar ou colar.
4. Ao lado de cada campo com pontinhos secretos, existe o botão de olho (**Visualizar / Ocultar**) para você conferir o que colou.
5. Clique em **"Salvar Chave"** em cada cartão (ou **"Salvar Todas as Chaves"** no topo).

### Opção B — No Arquivo `.env` (Para quando for colocar na Hospedagem)
Na pasta do projeto, você tem o arquivo `.env` (ou `.env.example`). Você pode abrir esse arquivo no Bloco de Notas ou VS Code e preencher as linhas correspondentes entre as aspas.

---

## 1. MERCADO PAGO (Para Receber PIX Instantâneo e Cartão)

### Passo a Passo para Criar sua Conta e Pegar as Chaves:

1. **Acesse o Portal de Desenvolvedores do Mercado Pago:**
   👉 Link: **[https://www.mercadopago.com.br/developers/panel/app](https://www.mercadopago.com.br/developers/panel/app)**
   *(Faça login com a mesma conta onde você recebe o dinheiro do Mercado Pago / Mercado Livre da sua pastelaria)*.

2. **Criar a Aplicação do seu Delivery:**
   - Clique no botão azul **"Criar aplicação"** (ou "+ Criar app").
   - **Nome da aplicação:** Digite `Pastelada`.
   - **Qual produto você vai integrar?** Escolha **"Checkout Transparente"** (ou "Pagamentos online").
   - **Você está usando uma plataforma de e-commerce?** Marque **"Não"** (código próprio).
   - Clique em **"Criar aplicação"**.

3. **Copiar as Credenciais:**
   - No menu lateral da sua nova aplicação, clique em **"Credenciais de produção"** (para receber pagamentos reais) ou **"Credenciais de teste"** (para testar primeiro).
   - Você verá os seguintes dados na tela:

---

### O que colocar em cada campo do Mercado Pago:

| Nome do Campo no Sistema | O que colocar aqui? | Exemplo Real |
| :--- | :--- | :--- |
| **Access Token** *(Obrigatório)* | É a chave mestra que liquida os pagamentos na sua conta bancária. Copie o campo **"Access Token"** do painel do Mercado Pago. | Começa com `APP_USR-...` (se for real) ou `TEST-...` (se for teste) |
| **Public Key** *(Obrigatório)* | É a chave pública que monta com segurança o formulário do cartão e o QR Code. Copie do campo **"Public key"**. | Começa com `APP_USR-...` ou `TEST-...` |
| **Chave PIX Oficial da Loja** | É a chave PIX onde você quer receber transferências diretas. Pode ser o telefone da pastelaria ou CNPJ. | Ex: `+5519982034637` ou `12.345.678/0001-90` |
| **Webhook Secret** | Código de segurança que o Mercado Pago usa para avisar seu site que o PIX acabou de ser pago no segundo exato. | Encontrado em "Notificações Webhook" (ex: `whsec_...`) |
| **Ambiente** | Alterne para **"Produção (Real)"** quando quiser começar a cobrar de verdade, ou deixe em **"Sandbox (Teste)"** para fazer pedidos simulados. | Seletor: `Sandbox` ou `Produção` |

---

## 2. RESEND (Para Enviar E-mails de Confirmação e Status)

O sistema envia automaticamente e-mails bonitos e profissionais para os clientes avisando:
- "Recebemos seu pedido #SP-1042!"
- "Seu pastel já foi para a fritadeira!"
- "O entregador acabou de sair com o seu pedido!"

### Passo a Passo para Pegar sua Chave do Resend (Gratuito):

1. **Acesse o site oficial do Resend:**
   👉 Link: **[https://resend.com/signup](https://resend.com/signup)**
   *(O plano gratuito inclui até 3.000 e-mails por mês, o que cobre com folga toda a demanda do restaurante).*

2. **Gerar a Chave:**
   - Faça login na sua conta no Resend.
   - No menu lateral esquerdo, clique em **"API Keys"**.
   - Clique no botão preto **"Create API Key"**.
   - Dê um nome (ex: `Site Pastelada`) e clique em **"Add"**.
   - **Copie a chave que vai aparecer na tela** (ela começa com `re_...`). *Atenção: o site só mostra essa chave uma vez!*

---

### O que colocar em cada campo do Resend:

| Nome do Campo no Sistema | O que colocar aqui? | Exemplo Real |
| :--- | :--- | :--- |
| **API Key do Resend** | Cole a chave que você acabou de copiar do painel do Resend. | Ex: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| **E-mail do Remetente (De:)** | O endereço de e-mail oficial que vai aparecer quando o cliente receber a mensagem na caixa de entrada. | Ex: `pedidos@example.com` ou `onboarding@resend.dev` |

---

## 3. GOOGLE CLOUD OAUTH (Login de Clientes com 1 Clique)

Permite que os clientes e você façam login no site clicando no botão oficial **"Entrar com o Google"**, sem precisar digitar senhas.

### Passo a Passo (Opcional - Já vem pré-configurado para testes):
1. Acesse: **[https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)**
2. Crie um projeto chamado `Pastelada`.
3. Vá em **Credenciais > Criar Credenciais > ID do cliente OAuth 2.0**.
4. Copie o **Client ID** e o **Client Secret** e cole nos respectivos campos no painel de integrações.

---

## 4. Teste de Conexão em Tempo Real

Depois de preencher e salvar as suas chaves:
1. Clique no botão **"Testar Conexão"** presente no cartão de cada integração.
2. O sistema fará um disparo de teste ao vivo:
   - Se estiver tudo correto, você verá a mensagem verde:
     ✅ *"Conexão validada com sucesso com Mercado Pago (45ms)."*
   - O indicador mudará de "Pendente" para **"Conectado"**!

---

## 5. Como Monitorar Falhas de Pedidos na Aba "Falhas de APIs"

Para que você nunca perca uma venda ou deixe um cliente sem resposta por instabilidade de internet ou chave vencida:

1. No topo do **Painel Admin**, se houver qualquer erro em pagamentos do Mercado Pago ou e-mails do Resend, um **botão vermelho pulsante** aparecerá:
   👉 **`⚠️ 1 Falha(s) de API`**
2. Clique nele ou acerte a aba **"Falhas de APIs"** no menu.
3. Você verá:
   - O código do pedido (ex: `#SP-1041`) e o nome do cliente afetado;
   - O serviço que falhou (Mercado Pago ou Resend) e o código do erro retornado;
   - O diagnóstico técnico e uma caixinha amarela explicando **"Como o Dono deve Resolver"**;
   - Botão para **"Marcar como Resolvido"** assim que você verificar a situação.
4. Você também pode clicar nos botões de teste **"+ Simular Erro MP"** ou **"+ Simular Erro Resend"** para testar a qualquer momento como o painel de monitoramento se comporta.

