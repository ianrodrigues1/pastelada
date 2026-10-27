import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { StoreService } from '../../services/storeService';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const settings = StoreService.getSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#fffaf2] card-hard-lg my-8 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#e8874a] border-b-[3px] border-[#24352b] shrink-0">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? <ShieldCheck size={24} /> : <FileText size={24} />}
            <h2 className="font-barlow font-black text-2xl uppercase text-[#24352b]">
              {type === 'privacy'
                ? `Política de Privacidade (LGPD v${settings.privacyVersion})`
                : 'Termos e Condições de Uso'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-[#24352b] bg-[#fffaf2] hover:bg-zinc-100 shadow-[2px_2px_0px_#24352b] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-dm text-xs text-zinc-800 leading-relaxed bg-[#f8f1e7]/40">
          {type === 'privacy' ? (
            <>
              <p>
                A presente Política de Privacidade regula o tratamento dos dados pessoais coletados
                pela pastelaria <strong>{settings.name}</strong>, sediada em Hortolândia - SP, na
                qualidade de <strong>Controladora</strong> de dados, em estrito cumprimento à Lei
                Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
              </p>

              <h4 className="font-barlow font-bold text-base uppercase text-[#24352b] pt-2">
                1. Dados Coletados & Finalidades
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Identificação e Contato:</strong> Nome completo, e-mail e telefone/WhatsApp,
                  utilizados para processamento, confirmação e comunicação sobre o status do pedido
                  (Base Legal: Execução de Contrato - Art. 7º, V da LGPD).
                </li>
                <li>
                  <strong>Endereço de Entrega:</strong> Logradouro, número, bairro em Hortolândia e
                  ponto de referência, utilizados exclusivamente para o deslocamento dos motoboys
                  parceiros até o local informado.
                </li>
                <li>
                  <strong>Dados de Pagamento:</strong> Transações são processadas por instituições de
                  pagamento autorizadas pelo Banco Central (Mercado Pago).{' '}
                  <strong>Nenhum número de cartão de crédito é armazenado em nossos servidores</strong>.
                </li>
                <li>
                  <strong>Dados de Conexão:</strong> Endereço IP, data e hora da transação, mantidos
                  para cumprimento de obrigação legal (Art. 15 do Marco Civil da Internet).
                </li>
              </ul>

              <h4 className="font-barlow font-bold text-base uppercase text-[#24352b] pt-2">
                2. Compartilhamento com Terceiros
              </h4>
              <p>
                Os dados pessoais apenas são compartilhados com parceiros estritamente necessários para
                a operação: gateways de pagamento homologados, serviços de mensageria para entrega e
                provedores de hospedagem com criptografia e segurança de ponta.
              </p>

              <h4 className="font-barlow font-bold text-base uppercase text-[#24352b] pt-2">
                3. Seus Direitos como Titular (Autoatendimento)
              </h4>
              <p>
                Você possui controle total sobre suas informações. Através do menu{' '}
                <strong>Minha Conta</strong>, você pode:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Acessar e confirmar seus dados pessoais a qualquer tempo;</li>
                <li>
                  Solicitar a <strong>Portabilidade</strong> dos dados em formato estruturado (JSON);
                </li>
                <li>
                  Solicitar a <strong>Eliminação e Anonimização</strong> da sua conta cadastrada;
                </li>
                <li>Revogar autorizações de cookies analíticos e de marketing.</li>
              </ul>

              <h4 className="font-barlow font-bold text-base uppercase text-[#24352b] pt-2">
                4. Canal do Encarregado de Proteção de Dados (DPO)
              </h4>
              <p>
                Para exercer qualquer direito ou sanar dúvidas relacionadas à privacidade, entre em
                contato diretamente com nosso Encarregado através do e-mail:{' '}
                <a href={`mailto:${settings.dpoEmail}`} className="text-[#24352b] font-bold underline">
                  {settings.dpoEmail}
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <p>
                Bem-vindo ao serviço de pedidos online do <strong>{settings.name}</strong>. Ao
                utilizar nossa plataforma, você concorda expressamente com os seguintes termos:
              </p>

              <h4 className="font-barlow font-bold text-base uppercase text-[#24352b] pt-2">
                1. Horários de Funcionamento e Pedidos
              </h4>
              <p>
                Os pedidos online somente são aceitos e encaminhados para a cozinha dentro dos
                horários comerciais cadastrados no estabelecimento. Pedidos efetuados durante períodos
                de pausa temporária ou fora do expediente serão automaticamente sinalizados ao
                cliente.
              </p>

              <h4 className="font-barlow font-bold text-base uppercase text-[#24352b] pt-2">
                2. Montagem e Personalização dos Pastéis
              </h4>
              <p>
                Cada pastel montado no fluxo &quot;Do Seu Jeito&quot; é preparado artesanalmente e
                individualmente conforme a seleção de recheios, complementos e adicionais registrada
                no momento da finalização da compra.
              </p>

              <h4 className="font-barlow font-bold text-base uppercase text-[#24352b] pt-2">
                3. Venda de Bebidas Alcoólicas (+18)
              </h4>
              <p>
                Em conformidade com o Artigo 243 da Lei nº 8.069/1990 (Estatuto da Criança e do
                Adolescente), a venda de bebidas alcoólicas é terminantemente proibida para menores de
                18 anos. É obrigatória a apresentação de documento de identidade com foto no momento
                da entrega ou retirada.
              </p>

              <h4 className="font-barlow font-bold text-base uppercase text-[#24352b] pt-2">
                4. Cancelamento e Reembolso
              </h4>
              <p>
                Por se tratar de alimentos preparados sob demanda e de consumo imediato, o
                cancelamento após o início do preparo na cozinha requer contato imediato com a loja
                pelo WhatsApp oficial ({settings.phone}).
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#fffaf2] border-t-2 border-[#24352b] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="btn-hard bg-[#e8874a] text-[#24352b] px-6 py-2 text-sm cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
