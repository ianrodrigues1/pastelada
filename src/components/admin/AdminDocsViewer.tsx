import React, { useState } from 'react';
import { BookOpen, Key, ShieldCheck, FileCheck, ExternalLink, ListChecks, CheckCircle2 } from 'lucide-react';

export const AdminDocsViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<
    'config_obrigatoria' | 'guia_chaves' | 'inventario' | 'checklist' | 'lgpd'
  >('config_obrigatoria');

  return (
    <div className="space-y-6 font-dm text-xs">
      <div className="card-hard bg-[#fffaf2] p-5">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-[#24352b]" />
          <h3 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
            Manuais de Operação & Documentação do Sistema
          </h3>
        </div>
        <p className="text-zinc-600">
          Documentos de ativação para o proprietário, guias práticos de credenciais e conformidade jurídica do
          Pastelada.
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-200 mt-3">
          <button
            onClick={() => setActiveDoc('config_obrigatoria')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer flex items-center gap-1 ${
              activeDoc === 'config_obrigatoria'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b] shadow-xs'
                : 'bg-white border-zinc-300 hover:border-black'
            }`}
          >
            <ListChecks size={14} className="text-red-700" />
            <span className="font-black">🔴 Configurações Obrigatórias</span>
          </button>

          <button
            onClick={() => setActiveDoc('guia_chaves')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer ${
              activeDoc === 'guia_chaves'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b]'
                : 'bg-white border-zinc-300'
            }`}
          >
            <Key size={13} className="inline mr-1" /> Guia de Troca de Chaves
          </button>

          <button
            onClick={() => setActiveDoc('inventario')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer ${
              activeDoc === 'inventario'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b]'
                : 'bg-white border-zinc-300'
            }`}
          >
            Inventário de Segredos
          </button>

          <button
            onClick={() => setActiveDoc('checklist')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer ${
              activeDoc === 'checklist'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b]'
                : 'bg-white border-zinc-300'
            }`}
          >
            <FileCheck size={13} className="inline mr-1" /> Checklist de Entrega Segura
          </button>

          <button
            onClick={() => setActiveDoc('lgpd')}
            className={`px-3 py-1.5 font-barlow font-bold text-xs uppercase border-2 cursor-pointer ${
              activeDoc === 'lgpd'
                ? 'bg-[#e8874a] text-[#24352b] border-[#24352b]'
                : 'bg-white border-zinc-300'
            }`}
          >
            <ShieldCheck size={13} className="inline mr-1" /> Conformidade LGPD
          </button>
        </div>
      </div>

      {/* Document Content Container */}
      <div className="card-hard bg-[#fffaf2] p-6 text-zinc-800 leading-relaxed space-y-4">
        {activeDoc === 'config_obrigatoria' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#24352b] pb-4">
              <div>
                <span className="px-2 py-0.5 bg-red-600 text-white font-barlow font-bold text-[10px] uppercase rounded">
                  Documento Oficial de Ativação
                </span>
                <h2 className="font-barlow font-black text-2xl uppercase text-[#24352b] mt-1">
                  Guia de Configurações Obrigatórias do Administrador
                </h2>
                <p className="text-zinc-600 text-xs">
                  Tempo estimado: 10 a 15 minutos · Pastelada (Hortolândia-SP)
                </p>
              </div>
              <span className="text-[11px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1">
                Arquivo: MD/02_CONFIGURACOES_OBRIGATORIAS_DO_ADMIN.md
              </span>

            </div>

            <div className="p-4 bg-amber-50 border-2 border-[#e8874a] rounded text-zinc-800 text-xs">
              <strong className="text-amber-950 font-bold block mb-1">
                👋 Olá, Proprietário do Pastelada!
              </strong>
              O sistema já vem pronto e funcional com dados de exemplo de Hortolândia. Para abrir a loja e
              receber pagamentos reais diretamente na sua conta bancária, basta conferir os 5 pontos abaixo.
            </div>

            {/* Checklist Cards */}
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="p-4 bg-white border-2 border-[#24352b] shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-barlow font-bold text-base uppercase text-[#24352b]">
                      Ativar Pagamentos Reais via Mercado Pago (PIX)
                    </h3>
                    <p className="text-zinc-600 text-xs">
                      <strong>Onde:</strong> Aba <em>Integrações (2FA)</em>.
                    </p>
                    <p className="text-zinc-700 text-xs">
                      Altere o seletor de <em>Sandbox</em> para <strong>Produção</strong>, cole o seu{' '}
                      <strong>Access Token de Produção</strong> oficial (<code>APP_USR-...</code>) gerado em{' '}
                      <a
                        href="https://www.mercadopago.com.br/developers"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline font-bold"
                      >
                        mercadopago.com.br/developers
                      </a>{' '}
                      e digite a Chave PIX da pastelaria. Clique em &quot;Salvar&quot; e depois em &quot;Testar Conexão&quot;.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-4 bg-white border-2 border-[#24352b] shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-barlow font-bold text-base uppercase text-[#24352b]">
                      WhatsApp de Atendimento & Endereço da Pastelaria
                    </h3>
                    <p className="text-zinc-600 text-xs">
                      <strong>Onde:</strong> Aba <em>Loja & Horários</em>.
                    </p>
                    <p className="text-zinc-700 text-xs">
                      Preencha o número do WhatsApp com DDD (ex: <code>(19) 99876-5432</code>), confira o endereço
                      completo em Hortolândia (que sai no topo da comanda impressa) e ajuste os horários de
                      abertura/fechamento.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-4 bg-white border-2 border-[#24352b] shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-barlow font-bold text-base uppercase text-[#24352b]">
                      Conferir Preços dos Pastéis Tubete e Convencional
                    </h3>
                    <p className="text-zinc-600 text-xs">
                      <strong>Onde:</strong> Aba <em>Cardápio & Preços</em>.
                    </p>
                    <p className="text-zinc-700 text-xs">
                      Revise os valores dos tamanhos <strong>Tubete (150g)</strong> e{' '}
                      <strong>Convencional (240g)</strong>. Se faltar algum recheio no dia, basta desmarcar a chave
                      &quot;Disponível&quot; para pausar as vendas daquele pastel imediatamente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="p-4 bg-white border-2 border-[#24352b] shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-barlow font-bold text-base uppercase text-[#24352b]">
                      Taxas de Entrega dos Bairros de Hortolândia
                    </h3>
                    <p className="text-zinc-600 text-xs">
                      <strong>Onde:</strong> Aba <em>Loja & Horários</em> (Seção Bairros Atendidos).
                    </p>
                    <p className="text-zinc-700 text-xs">
                      Ajuste as taxas para bairros como Centro, Jd. Amanda, Jd. Rosolém, etc., conforme o valor
                      pago aos motoboys. Você também pode adicionar novos bairros ou excluir os que não atende.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 5 */}
              <div className="p-4 bg-white border-2 border-[#24352b] shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    5
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-barlow font-bold text-base uppercase text-[#24352b]">
                      Definir Usuário do Proprietário e Acessos da Cozinha
                    </h3>
                    <p className="text-zinc-600 text-xs">
                      <strong>Onde:</strong> Aba <em>Equipe & Permissões</em>.
                    </p>
                    <p className="text-zinc-700 text-xs">
                      Confirme seus dados de proprietário. Se tiver tablet ou tela na cozinha, crie um acesso com o
                      perfil <strong>&quot;Cozinha&quot;</strong> para a equipe ver apenas as comandas com som de alerta,
                      sem acesso ao faturamento da empresa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border-2 border-emerald-600 rounded text-emerald-950 flex items-center justify-between gap-4">
              <div>
                <strong className="font-barlow font-black text-base uppercase block">
                  🎉 Pronto! Após esses 5 passos, a loja está pronta para lucrar!
                </strong>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Nenhuma taxa sobre vendas será cobrada de terceiros. Todo o faturamento é 100% da pastelaria.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'guia_chaves' && (
          <div className="space-y-4">
            <h2 className="font-barlow font-black text-2xl uppercase text-[#24352b]">

              Guia Prático: Como Trocar as Chaves do Pastelada
            </h2>

            <div className="p-4 bg-red-50 border-2 border-red-600 text-red-950">
              <h4 className="font-bold text-sm uppercase mb-1">
                ⚡ Suspeitei de Invasão: O que Fazer em 10 Minutos
              </h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  Acesse <strong>Loja & Horários</strong> e clique em{' '}
                  <strong>&quot;Pausar Loja Agora&quot;</strong>.
                </li>
                <li>
                  Clique em <strong>&quot;Encerrar Todas as Sessões Ativas&quot;</strong> para
                  derrubar qualquer invasor.
                </li>
                <li>
                  Acesse <strong>Integrações</strong> e renove a chave do Mercado Pago.
                </li>
                <li>Altere a senha do seu e-mail Google em myaccount.google.com/security.</li>
                <li>
                  Consulte a aba <strong>Auditoria</strong> para verificar os IPs e horários do
                  incidente.
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-barlow font-bold text-lg uppercase text-[#24352b]">
                1. Troca de Chave do Mercado Pago (PIX e Cartão)
              </h3>
              <p>
                Acesse o painel do Mercado Pago com sua conta bancária → Seu Negócio → Configurações
                → Credenciais → Renovar Access Token. Em seguida, na aba Integrações deste painel,
                clique em &quot;Trocar Chave (2FA)&quot;, cole a nova chave e confirme com seu código
                do autenticador.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-barlow font-bold text-lg uppercase text-[#24352b]">
                2. Troca de Chave do Resend (E-mail Transacional)
              </h3>
              <p>
                Acesse resend.com → API Keys → Create API Key. Cole na aba Integrações com validação
                2FA. O sistema testa a conexão antes de substituir a chave anterior.
              </p>
            </div>
          </div>
        )}

        {activeDoc === 'inventario' && (
          <div className="space-y-4">
            <h2 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              Inventário Geral de Segredos
            </h2>
            <p>
              Relação de credenciais de produção e periodicidade recomendada de troca conforme
              exigido pelas diretrizes de segurança da Seção 14.2:
            </p>
            <div className="border border-zinc-300 p-3 bg-zinc-50 space-y-2 font-mono text-[11px]">
              <div>
                • <strong>MERCADO_PAGO_ACCESS_TOKEN:</strong> Liquidação direta na conta do dono ·
                Troca semestral · 2FA obrigatório
              </div>
              <div>
                • <strong>RESEND_API_KEY:</strong> E-mails de notificação de pedidos · Troca anual ·
                2FA obrigatório
              </div>
              <div>
                • <strong>GOOGLE_CLIENT_SECRET:</strong> Login via Google OAuth · Troca anual
              </div>
              <div>
                • <strong>APP_MASTER_ENCRYPTION_KEY:</strong> Cifrador AES-256-GCM no servidor
              </div>
            </div>
          </div>
        )}

        {activeDoc === 'checklist' && (
          <div className="space-y-4">
            <h2 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              Checklist de Entrega Segura (Dev → Proprietário)
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>
                  <strong>Titularidade Exclusiva:</strong> Domínio, hospedagem, e-mail e Mercado
                  Pago vinculados diretamente ao CNPJ/CPF do dono.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>
                  <strong>Desenvolvedor Sem Acesso:</strong> Nenhuma chave de produção ou credencial
                  permanece com quem vendeu o site.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                <span>
                  <strong>Defesa Contra Adulteração:</strong> Preços e totais calculados
                  exclusivamente no servidor/lógica interna.
                </span>
              </li>
            </ul>
          </div>
        )}

        {activeDoc === 'lgpd' && (
          <div className="space-y-4">
            <h2 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              Conformidade LGPD (Lei 13.709/2018)
            </h2>
            <p>
              O sistema cumpre integralmente os requisitos da Lei Geral de Proteção de Dados:
            </p>
            <div className="space-y-2">
              <div>
                • <strong>Autoatendimento:</strong> Todo cliente cadastrado pode exportar seus dados
                em JSON ou solicitar a eliminação imediata em Minha Conta.
              </div>
              <div>
                • <strong>Canal do Encarregado (DPO):</strong> Endereço oficial configurável no
                rodapé e registrado nos termos.
              </div>
              <div>
                • <strong>Minimização:</strong> Nenhum dado de cartão de crédito é armazenado na
                base de dados.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
