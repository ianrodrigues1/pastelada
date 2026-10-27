# ✅ CHECKLIST EXECUTIVO DE ENTREGA COMERCIAL
**Pastelada — Sistema de Pedidos, Delivery & Painel Admin**

Utilize este roteiro prático antes, durante e após a entrega do sistema ao proprietário para garantir que nenhum detalhe passe despercebido e que a transação ocorra com total segurança técnica e jurídica.

---

## 🛠️ FASE 1: Validação Técnica Pré-Download

- [x] **Código compilando sem erros:** `npm run build` e `npm run lint` testados com 100% de sucesso.
- [x] **Script Windows executável pronto:** Arquivo `iniciar_servidor_windows.bat` presente na raiz.
- [x] **README.md principal atualizado:** Passo a passo detalhado para o cliente instalar dependências e configurar o `.env`.
- [x] **Pasta `MD/` completa com todos os 7 manuais:**
  - [x] `01_COMECE_AQUI.md`
  - [x] `02_GUIA_CHAVES_DE_API_E_PAGAMENTOS.md` (com instruções de Mercado Pago, Resend e monitoramento de falhas)
  - [x] `03_COMO_COLOCAR_O_SITE_NO_AR.md` (hospedagem custo R$ 0)
  - [x] `04_MANUAL_DO_CARDAPIO_E_FOTOS.md` (fotos pelo celular e preços Tubete/Convencional)
  - [x] `05_OPERACAO_DE_PEDIDOS_KDS_E_ENTREGAS.md` (operação da cozinha com alerta sonoro)
  - [x] `06_TERMO_DE_ENTREGA_E_QUITACAO.md` (contrato formal)
  - [x] `07_CONFIGURACOES_OBRIGATORIAS_DO_ADMINISTRADOR.md` (guia rápido de 10 minutos para abrir a loja)
- [x] **Sistema de monitoramento de erros de API integrado:** Aba "Falhas de APIs" pronta no AdminDashboard para registrar alertas caso falte chave ou dê timeout no Mercado Pago/Resend.


---

## 📦 FASE 2: Download do AI Studio & Montagem do Arquivo ZIP

- [ ] **1. Baixar o arquivo do AI Studio:**
  - Clique no menu de opções superior (`...` ou ícone de download) e selecione **"Download ZIP"**.
- [ ] **2. Extrair a pasta no seu computador:**
  - Descompacte o arquivo baixado em uma pasta de trabalho (ex: `Desktop\Pastelada_Entrega`).
- [ ] **3. Higienizar a pasta (Importante!):**
  - Certifique-se de que a pasta **`node_modules`** e pastas ocultas como **`.git`** **NÃO** estejam dentro do ZIP que você vai enviar. Isso garante um arquivo super leve de apenas **5 a 10 MB**.
- [ ] **4. Gerar o ZIP oficial de entrega:**
  - Compacte os arquivos e renomeie para:
    👉 **`Sistema_Pastelada_Entrega_Oficial.zip`**

---

## 🤝 FASE 3: Demonstração e Apresentação ao Cliente

- [ ] **1. Apresentar a interface do cliente:**
  - Abra o link compartilhado do applet no celular ou notebook.
  - Mostre os tamanhos **Tubete (150g)** e **Convencional (240g)**, personalização de adicionais e cálculo de entrega para bairros de Hortolândia.
- [ ] **2. Fazer um pedido de teste ao vivo:**
  - Adicione um pastel ao carrinho, simule o pagamento PIX e finalize.
  - Deixe o som da campainha tocar na tela da cozinha (KDS) para impressionar o dono com a agilidade do sistema.
- [ ] **3. Demonstrar o Painel Admin:**
  - Mostre a facilidade de trocar a foto de um pastel com imagem da câmera do celular.
  - Mostre a aba de **Reajuste de Preços em Massa** com 1 clique.
  - Mostre a aba **"Falhas de APIs"** e o botão de simulação para ele ver como o sistema o protege de erros de pagamento.
- [ ] **4. Apresentar a pasta de manuais `MD/`:**
  - Abra o arquivo `01_COMECE_AQUI.md` e mostre que ele tem guias visuais para cada dúvida futura.

---

## 💰 FASE 4: Quitação Financeira & Entrega do ZIP

- [ ] **1. Colher o pagamento do projeto:**
  - Receba o valor integral acordado pela licença definitiva do software.
- [ ] **2. Assinar o Termo de Entrega:**
  - Abra o arquivo `MD/06_TERMO_DE_ENTREGA_E_QUITACAO.md`, imprima ou assine digitalmente (gov.br ou Docusign) em conjunto com o responsável pelo Pastelada.
  - Isso protege você juridicamente, atesta a posse do código pelo cliente e define os custos de hospedagem/domínio como responsabilidade dele.
- [ ] **3. Enviar o arquivo ZIP:**
  - Envie o arquivo `Sistema_Pastelada_Entrega_Oficial.zip` por Google Drive, WeTransfer, Pendrive ou WhatsApp Web.

---

## 🛡️ FASE 5: Pós-Entrega & Suporte de 30 Dias

- [ ] **Auxiliar no primeiro teste local:**
  - Acompanhe o dono dando dois cliques no `iniciar_servidor_windows.bat` no computador dele.
- [ ] **Auxiliar na configuração das chaves de produção:**
  - Se solicitado, acompanhe o preenchimento do Access Token do Mercado Pago e da chave do Resend conforme o guia `MD/02_GUIA_CHAVES_DE_API_E_PAGAMENTOS.md`.
- [ ] **Publicar no domínio final (Opcional):**
  - Se contratado para colocar online, siga o guia `MD/03_COMO_COLOCAR_O_SITE_NO_AR.md` para publicar gratuitamente no Netlify e apontar para `pastelada.com.br`.

---

*Tudo pronto! Parabéns pelo fechamento e entrega deste projeto comercial de alto nível!*
