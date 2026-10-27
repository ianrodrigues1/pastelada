# 📋 GUIA DE CONFIGURAÇÕES OBRIGATÓRIAS DO ADMINISTRADOR
**Pastelada — Hortolândia-SP**
*Documento de ativação rápida para o proprietário começar a vender e receber pagamentos na vida real.*

---

## ⏱️ Tempo estimado para concluir: 10 a 15 minutos
Siga este roteiro passo a passo antes de divulgar o link para os clientes. Todas as configurações são feitas diretamente pelo **Painel Admin**.

---

## 🔴 ETAPA 1: Ativar Pagamentos Reais via Mercado Pago (PIX)
*Sem esta etapa, os pedidos via PIX continuarão gerando cobranças de teste em ambiente Sandbox.*

### O que fazer:
1. Acesse o **Painel Admin** e clique na aba **"Integrações (2FA)"**.
2. No cartão **Mercado Pago (PIX e Cartão)**:
   - Altere o seletor de ambiente de **Sandbox** para **Produção**.
   - No campo **Access Token**, apague o valor de teste inicial (`TEST-...`) e cole o seu **Access Token de Produção** oficial (`APP_USR-...`).
   - No campo **Chave PIX Oficial**, digite a chave PIX da sua empresa (CNPJ, celular, e-mail ou chave aleatória).
3. Clique em **"Salvar Chaves com Autenticação"**.
4. Clique no botão **"Testar Conexão"** para validar se o Mercado Pago respondeu com sucesso.

> **Onde pegar o seu Access Token de Produção:**
> 1. Acesse: **[https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)**
> 2. Faça login com a mesma conta Mercado Pago / Mercado Livre da sua pastelaria.
> 3. Vá em **Suas Aplicações** > Crie uma aplicação chamada `Pastelada`.
> 4. Clique em **Credenciais de Produção** e copie o **Access Token**.

---

## 🔴 ETAPA 2: Configurar WhatsApp e Endereço da Loja
*Garante que os clientes falem com o número certo e que a comanda saia com os dados corretos.*

### O que fazer:
1. No **Painel Admin**, clique na aba **"Loja & Horários"**.
2. **Número de WhatsApp de Atendimento:**
   - Preencha o número com DDD (ex: `(19) 99876-5432`). Este é o número que receberá mensagens de suporte e dúvidas de pedidos.
3. **Endereço Físico em Hortolândia:**
   - Preencha a rua, número e bairro da sua loja. Este endereço sai impresso no topo das comandas térmicas da cozinha.
4. **Horários de Abertura e Fechamento:**
   - Defina os dias que a pastelaria abre (ex: Terça a Domingo) e o horário (ex: das 18:00 às 23:30).
   - Se a loja fechar antes por falta de massa ou feriado, basta clicar no botão vermelho **"Pausar Loja Agora"** no topo da tela.
5. **Tempo Médio de Preparo / Entrega:**
   - Ajuste o tempo estimado informado aos clientes (ex: `40 a 55 min`).
6. Clique em **"Salvar Configurações da Loja"**.

---

## 🔴 ETAPA 3: Conferir Cardápio, Sabores e Preços
*Garante que o cliente compre pelos valores vigentes e que sabores esgotados não sejam pedidos.*

### O que fazer:
1. No **Painel Admin**, clique na aba **"Cardápio & Preços"**.
2. **Revisar Preços dos Pastéis:**
   - Verifique os preços dos tamanhos **Tubete (150g)** e **Convencional (240g)** de cada categoria (Pastéis Salgados, Doces, Especiais).
   - Clique em **"Editar"** caso queira alterar valores individuais, nome ou descrição.
3. **Pausar Sabores Esgotados:**
   - Se o recheio de palmito ou camarão acabou no dia, abra a edição do produto e desmarque a opção **"Disponível"**. Ele ficará marcado como "Esgotado" na hora para o cliente.
4. **Trocar Fotos (Opcional, mas muito fácil!):**
   - Na edição de qualquer pastel, clique em **"Alterar Foto"**.
   - Você pode tirar uma foto na hora com o celular da pastelaria ou escolher um arquivo da galeria.

---

## 🔴 ETAPA 4: Definir Taxas de Entrega dos Bairros de Hortolândia
*Garante que o cliente pague a taxa de frete correta conforme a distância até a sua pastelaria.*

### O que fazer:
1. No **Painel Admin**, vá na aba **"Loja & Horários"** e role até a seção **"Bairros Atendidos e Taxas de Entrega"**.
2. O sistema já vem com mais de 10 bairros de Hortolândia pré-cadastrados (Jd. Amanda, Jd. Rosolém, Parque Ortolândia, Centro, Vila Real, etc.).
3. Edite os valores das taxas para refletir o que você paga aos seus motoboys (ex: Centro: R$ 5,00 / Jd. Amanda: R$ 9,00).
4. Se houver algum bairro que você **não atende**, basta clicar no ícone de lixeira para removê-lo.

---

## 🔴 ETAPA 5: Definir Usuários e Senhas da Equipe
*Protege os dados financeiros da sua empresa contra acessos indevidos.*

### O que fazer:
1. No **Painel Admin**, clique na aba **"Equipe & Permissões"**.
2. Localize o usuário **Proprietário** e confirme se o seu e-mail e nome estão preenchidos.
3. Se você for colocar um computador ou tablet na cozinha para a equipe acompanhar os pedidos no painel KDS:
   - Clique em **"Novo Membro / Convite"**;
   - Escolha o cargo **"Cozinha"**;
   - Os funcionários da cozinha terão acesso **apenas** à tela de pedidos e som da comanda, ficando proibidos de ver relatórios de faturamento, dados de clientes ou alterar chaves do Mercado Pago.

---

## 🟡 ETAPA BÔNUS (Opcional): Impressora de Comandas da Cozinha
*Se você usa impressora térmica tipo cupom fiscal (Daruma, Bematech, Elgin, Epson de 80mm ou 58mm):*

1. Na tela **"Pedidos ao Vivo"**, quando um pedido for recebido, clique em **"Imprimir Comanda"**.
2. Na janela de impressão do navegador:
   - Escolha a impressora térmica conectada via USB ou Wi-Fi;
   - Desmarque a opção "Cabeçalho e rodapé";
   - A comanda sairá no formato oficial com código do pedido, itens, adicionais, observações e dados do cliente para o motoboy.

---

## ✅ Resumo do Checklist de Ativação

| Item | Onde Configurar | Status |
| :--- | :--- | :---: |
| 1. Chave de Produção do Mercado Pago | *Integrações (2FA)* | [ ] |
| 2. Chave PIX da Pastelaria | *Integrações (2FA)* | [ ] |
| 3. WhatsApp de Atendimento | *Loja & Horários* | [ ] |
| 4. Horários de Funcionamento | *Loja & Horários* | [ ] |
| 5. Preços dos Pastéis Tubete e Convencional | *Cardápio & Preços* | [ ] |
| 6. Taxas dos Bairros de Hortolândia | *Loja & Horários* | [ ] |
| 7. Senha do Proprietário | *Equipe & Permissões* | [ ] |

Assim que esses 7 itens estiverem conferidos, seu delivery próprio estará **100% pronto para vender e faturar**!
