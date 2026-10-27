# 🛡️ SEGURANÇA, LGPD & INVENTÁRIO DE SEGREDOS
**Pastelada — Hortolândia-SP**

Este documento detalha o inventário de chaves criptografadas, os procedimentos de emergência para rotação de credenciais, a conformidade jurídica com a LGPD e o protocolo de entrega limpa.

---

## 🔑 1. Inventário Geral de Segredos & Chaves

| Nome do Segredo | Serviço / Finalidade | Onde Fica Armazenado | Quem Pode Alterar | Frequência Recomendada | Procedimento de Troca |
|---|---|---|---|---|---|
| `MERCADO_PAGO_ACCESS_TOKEN` | Liquidação de pagamentos via PIX e Cartão | Tela de Integrações (cifrado AES-256-GCM) | Apenas OWNER com 2FA | A cada 6 meses ou saída de membro | Painel Mercado Pago → Credenciais |
| `MERCADO_PAGO_PUBLIC_KEY` | Formulário seguro de cartão | Tela de Integrações | Apenas OWNER com 2FA | A cada 6 meses | Painel Mercado Pago → Credenciais |
| `RESEND_API_KEY` | Envio de e-mails transacionais de pedidos | Tela de Integrações (cifrado) | Apenas OWNER com 2FA | A cada 12 meses | Painel Resend → API Keys |
| `GOOGLE_CLIENT_SECRET` | Autenticação Google OAuth dos clientes e equipe | Variáveis de Ambiente da Hospedagem | Apenas OWNER no Cloud Console | A cada 12 meses | Google Cloud Console → Credenciais |
| `APP_MASTER_ENCRYPTION_KEY` | Chave AES-256-GCM para criptografia em repouso | Variáveis de Ambiente do Servidor | Engenheiro / Hospedagem | Anual | Gerar chave aleatória 256 bits |
| `DATABASE_URL` | Conexão com banco relacional (se ativado) | Variáveis de Ambiente do Servidor | OWNER / Hospedagem | A cada 12 meses | Painel do PostgreSQL → Reset Password |

---

## ⚡ 2. Protocolo de Emergência: Suspeita de Invasão (Ação em 10 Minutos)

Caso desconfie que alguém não autorizado obteve acesso às suas credenciais:

1. **Pausar a Loja Imediatamente:**
   No Painel Admin → Vá em **Loja & Horários** → Clique em **"Pausar Loja Agora"**.
2. **Derrubar Sessões Conectadas:**
   Clique em **"Encerrar Todas as Sessões Ativas"** para desconectar imediatamente qualquer invasor.
3. **Rotacionar a Chave do Mercado Pago:**
   Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers), clique em **Renovar Access Token** e atualize na aba **Integrações** do Painel Admin.
4. **Conferir a Trilha de Auditoria:**
   Acesse a aba **"Trilha de Auditoria"** no painel administrativo para verificar os IPs, horários e ações executadas recentemente.

---

## ⚖️ 3. Conformidade com a LGPD (Lei Geral de Proteção de Dados)

O sistema foi concebido sob o princípio de **Privacy by Design**:

1. **Minimização de Dados:**
   Apenas são coletados o nome, telefone/WhatsApp e endereço estritamente necessários para a entrega do pedido e emissão do comprovante.
2. **Canal de Autoatendimento do Titular:**
   O cliente pode a qualquer momento consultar o painel de privacidade no rodapé do site para solicitar:
   - Cópia dos seus dados cadastrais em formato exportável JSON;
   - Anonimização ou exclusão definitiva do seu cadastro.
3. **Exclusão Segura (Soft Delete):**
   Ao remover um produto ou cliente, o sistema preserva os relatórios contábeis e fiscais históricos, anonimizando dados sensíveis sem corromper o histórico de faturamento.

---

## 🤝 4. Certificado de Transferência Limpa

- [x] O desenvolvedor **não conserva** nenhuma cópia de chaves de produção de pagamentos ou e-mails.
- [x] Todas as senhas provisórias de homologação foram descartadas.
- [x] O dinheiro das vendas via PIX cai diretamente na conta bancária do titular do CNPJ/CPF do restaurante.
