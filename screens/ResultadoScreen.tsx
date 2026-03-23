import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StatusBar,
  Share, StyleSheet, Modal, TextInput,
} from 'react-native';
import { S } from '../constants/styles';
import { C, CAT_CONFIG, Convidado, ResultadoCalculo } from '../constants';

type Props = {
  nomeEvento: string;
  convidados: Convidado[];
  resultado: ResultadoCalculo;
  onEditarCardapio: () => void;
  onNovoChurras: () => void;
};

type Dica = { emoji: string; titulo: string; texto: string };

// ═══════════════════════════════════════════════════════════════════════════
// BANCO DE DICAS
// ═══════════════════════════════════════════════════════════════════════════

// ── Dicas por tipo de carne ────────────────────────────────────────────────
const DICAS_CARNES: Record<string, Dica[]> = {
  picanha: [
    { emoji: '🥩', titulo: 'Picanha no ponto', texto: 'Sempre grelhe a picanha com a gordura pra cima primeiro a gordura desce e hidrata a carne. Use fogo alto para selar e depois fogo médio para atingir o ponto. Nunca fure com garfo!' },
    { emoji: '🧂', titulo: 'Sal na picanha', texto: 'Na picanha, o sal grosso vai só no lado da carne, nunca na gordura. Aplique 10 min antes de ir para a grelha. A gordura já tempera a carne naturalmente durante o assado.' },
    { emoji: '🔪', titulo: 'Corte da picanha', texto: 'Corte a picanha sempre contra as fibras para garantir maciez. Fatias de 2 a 3 cm são ideais. Deixe descansar 5 min coberta com papel alumínio antes de fatiar.' },
  ],
  fraldinha: [
    { emoji: '🥩', titulo: 'Fraldinha é rápida', texto: 'A fraldinha é um corte mais fino vai pra grelha em fogo alto por no máximo 5 min de cada lado. Tem muita gordura entremeada que derrete e torna a carne extremamente saborosa.' },
    { emoji: '🌿', titulo: 'Tempero da fraldinha', texto: 'A fraldinha aceita muito bem marinada: alho, azeite, alecrim e sal por 2 horas antes. O resultado é uma carne muito mais aromática do que só com sal grosso.' },
  ],
  costela: [
    { emoji: '⏰', titulo: 'Costela precisa de tempo', texto: 'Costela bovina no fogo direto leva de 4 a 6 horas. A dica é começar com fogo baixo e indireto, embrulhada em papel alumínio com um fio de azeite, por 3h. Depois finaliza na grelha aberta por mais 1h.' },
    { emoji: '🔥', titulo: 'Costela na brasa', texto: 'O segredo da costela é paciência o colágeno derrete lentamente e cria aquela textura que desfia. Não tente acelerar com fogo alto, vai ressecar e endurecer.' },
  ],
  maminha: [
    { emoji: '🥩', titulo: 'Maminha: corte completo', texto: 'A maminha é um dos cortes mais versáteis. Grelhe inteira em fogo médio por cerca de 40 min, virando a cada 10 min. Fatie apenas na hora de servir para manter o suco.' },
  ],
  alcatra: [
    { emoji: '🥩', titulo: 'Alcatra bem temperada', texto: 'A alcatra tem sabor mais suave e combina muito bem com temperos. Experimente esfregar alho amassado com azeite antes do sal grosso o resultado é surpreendente.' },
  ],
  ancho: [
    { emoji: '🥩', titulo: 'Ancho: o mais marmoreado', texto: 'O ancho (entrecôte) é um dos cortes com mais gordura entremeada do boi. Grelhe em fogo alto por 3-4 min de cada lado para ao ponto. Evite bem passado desperdiça toda a gordura que faz ele ser especial.' },
  ],
  cupim: [
    { emoji: '⏰', titulo: 'Cupim pede paciência', texto: 'O cupim tem muito colágeno e gordura precisa de pelo menos 4 horas em fogo baixo. A técnica ideal é embrulhar em papel alumínio com caldo de carne e assar lentamente antes de finalizar na grelha.' },
  ],
  contrafile: [
    { emoji: '🥩', titulo: 'Contrafilé no ponto', texto: 'O contrafilé tem uma capa de gordura lateral mantenha ela na hora de grelhar, é ela que protege a carne e dá sabor. Corte depois de pronto. Grelhe em fogo alto por 4 min cada lado para ao ponto.' },
  ],
  coxa_sobrecoxa: [
    { emoji: '🍗', titulo: 'Frango sem queimar', texto: 'Coxa e sobrecoxa têm mais gordura vão para fogo médio-baixo por 20 a 25 min virando com frequência. Se colocar em fogo alto vai queimar por fora e ficar cru por dentro.' },
    { emoji: '🌶️', titulo: 'Tempero para o frango', texto: 'Deixe o frango marinando na véspera com limão, alho, azeite e ervas. Na hora da grelha, seque bem antes de colocar frango muito molhado cozinha no vapor em vez de grelhar.' },
  ],
  asa: [
    { emoji: '🍗', titulo: 'Coxinha da asa crocante', texto: 'Para asas crocantes, seque bem e tempere com sal, páprica e alho em pó. Grelhe em fogo médio virando sempre. Os últimos 5 min em fogo alto deixam a pele dourada e crocante.' },
  ],
  coracao: [
    { emoji: '🍗', titulo: 'Coração de frango', texto: 'Corações de frango são rápidos 5 a 7 min em fogo alto já bastam. Tempere com azeite, sal, alho e louro. Cuidado para não passar do ponto, ficam borrachudos.' },
  ],
  ling_toscana: [
    { emoji: '🌭', titulo: 'Toscana no ponto certo', texto: 'A linguiça toscana precisa de fogo médio por 15 a 20 min, virando sempre. Faça pequenos furos com palito antes de grelhar para não explodir. Cuidado para não ressecar.' },
  ],
  ling_calabresa: [
    { emoji: '🌭', titulo: 'Calabresa defumada', texto: 'A calabresa já é parcialmente curada precisa de menos tempo que a toscana. Cerca de 10-12 min em fogo médio. Pode servir fatiada com cebola refogada na manteiga como entrada.' },
  ],
  chorizo: [
    { emoji: '🌭', titulo: 'Chorizo argentino', texto: 'O chorizo tem mais gordura que as linguiças brasileiras use fogo médio-baixo por 20 min virando sempre. Sirva com chimichurri para uma experiência completa.' },
  ],
};

// ── Dicas por tamanho do grupo ─────────────────────────────────────────────
const DICAS_GRUPO_PEQUENO: Dica[] = [
  { emoji: '👥', titulo: 'Grupo pequeno, mais capricho', texto: 'Com poucas pessoas você tem mais controle sobre o ponto de cada um. Aproveite para perguntar a preferência de cada convidado antes de tirar a carne da grelha mal passado, ao ponto ou bem passado.' },
  { emoji: '🔥', titulo: 'Uma grelha basta', texto: 'Para grupos pequenos, uma grelha bem organizada é suficiente. Deixe um lado da churrasqueira em fogo alto para selar e o outro em fogo baixo para finalizar o chamado método indireto.' },
  { emoji: '🍷', titulo: 'Capriche na apresentação', texto: 'Grupo pequeno combina com churras mais caprichado uma tábua de frios, pão de alho artesanal e uma boa bebida elevam muito a experiência sem custo extra grande.' },
];

const DICAS_GRUPO_MEDIO: Dica[] = [
  { emoji: '📋', titulo: 'Organize as levas', texto: 'Com um grupo médio, divida a carne em duas ou três levas. Comece com os cortes que demoram mais (costela, cupim) e vá adicionando os mais rápidos por último. Avise os convidados a ordem de chegada.' },
  { emoji: '🌽', titulo: 'Entradas para distrair', texto: 'Enquanto a carne assa, sirva entradas para segurar a fome: pão de alho, queijo coalho grelhado e linguiça fatiada funcionam muito bem e mantêm o clima animado.' },
  { emoji: '⏰', titulo: 'Calcule bem o tempo', texto: 'Para 10 a 20 pessoas, comece a grelhar pelo menos 1h antes de querer servir. O tempo de preparação sempre aumenta quando a quantidade aumenta.' },
];

const DICAS_GRUPO_GRANDE: Dica[] = [
  { emoji: '👨‍🍳', titulo: 'Divida a função', texto: 'Em grupos grandes, delegue funções uma pessoa cuida da grelha, outra das bebidas, outra serve. Churrasqueiro que faz tudo sozinho para mais de 20 pessoas costuma se estressar e atrasar.' },
  { emoji: '🔥', titulo: 'Duas grelhas se possível', texto: 'Se tiver dois churrasqueiros ou duas grades, use as duas. Uma para selar em fogo alto e outra para finalizar em fogo médio. A produção dobra e a qualidade mantém.' },
  { emoji: '📦', titulo: 'Compras antecipadas', texto: 'Para grupos grandes, compre tudo na véspera mercados podem não ter a quantidade que você precisa no dia. Especialmente carvão, cerveja e carnes especiais como picanha.' },
  { emoji: '🍽️', titulo: 'Sirva em etapas', texto: 'Não espere ter tudo pronto para servir. Comece com linguiça, frango e pão de alho enquanto as carnes bovinas ainda estão assando. O pessoal fica satisfeito e você tem mais tempo.' },
];

// ── Dicas por estação ──────────────────────────────────────────────────────
const getMesAtual = () => new Date().getMonth(); // 0-11

function getEstacao(): 'verao' | 'outono' | 'inverno' | 'primavera' {
  const mes = getMesAtual();
  // Hemisfério Sul
  if (mes >= 11 || mes <= 1) return 'verao';
  if (mes >= 2 && mes <= 4)  return 'outono';
  if (mes >= 5 && mes <= 7)  return 'inverno';
  return 'primavera';
}

const DICAS_ESTACAO: Record<string, Dica[]> = {
  verao: [
    { emoji: '☀️', titulo: 'Churras no verão', texto: 'No verão, a cerveja esfria mais rápido no isopor com água gelada. Prefira grelhar no início da tarde ou fim do dia para evitar o pico de calor. Ofereça água mineral em abundância para manter todos hidratados.' },
    { emoji: '🧊', titulo: 'Isopor no verão', texto: 'No calor, o gelo dura menos. Use isopores maiores ou dois menores e evite abrir com frequência. Uma dica é colocar a cerveja mais fria na véspera para reduzir o consumo de gelo no dia.' },
    { emoji: '🌿', titulo: 'Saladas no verão', texto: 'No verão, acompanhamentos frescos fazem toda a diferença salada de maionese, vinagrete bem temperado e farofa são itens que completam o churras e diminuem o peso da carne no calor.' },
  ],
  outono: [
    { emoji: '🍂', titulo: 'Outono é tempo de churras', texto: 'O outono é a estação perfeita para churras temperatura amena, sem chuva excessiva. Aproveite para fazer cortes mais demorados como costela e cupim que pedem mais tempo de fogo.' },
    { emoji: '🌡️', titulo: 'Temperatura do outono', texto: 'No outono, o carvão dura mais porque o ambiente é mais frio. Você pode economizar um pouco na quantidade a brasa se mantém por mais tempo que no verão.' },
  ],
  inverno: [
    { emoji: '🧥', titulo: 'Churras no inverno', texto: 'No inverno, a churrasqueira demora mais para atingir a temperatura ideal acenda o carvão com pelo menos 1h de antecedência. A brasa resfria mais rápido, então mantenha sempre brasa nova no braseiro.' },
    { emoji: '🍺', titulo: 'Bebidas no inverno', texto: 'No inverno, cerveja gelada pode não ser a preferência de todos. Considere ter vinho tinto, quentão ou cerveja em temperatura ambiente como opções. O consumo de bebida quente aumenta bastante.' },
    { emoji: '🔥', titulo: 'Aproveite o frio', texto: 'O frio do inverno é ótimo para churras as pessoas ficam mais próximas da churrasqueira, o clima é mais aconchegante e a carne assando aquece o ambiente. É a estação favorita dos churrasqueiros tradicionais.' },
  ],
  primavera: [
    { emoji: '🌸', titulo: 'Primavera e chuvinhas', texto: 'Na primavera, fique de olho na previsão do tempo chuvas rápidas são comuns. Tenha uma cobertura de lona ou gazebo disponível para não ser pego de surpresa no meio do churras.' },
    { emoji: '🌬️', titulo: 'Vento na primavera', texto: 'O vento da primavera pode atrapalhar o carvão posicione a churrasqueira em local protegido ou use uma proteção lateral. Vento forte também espalha cinzas, cuidado com os convidados próximos.' },
  ],
};

// ── Dicas financeiras ──────────────────────────────────────────────────────
const DICAS_ECONOMIA: Dica[] = [
  { emoji: '💡', titulo: 'Misture os cortes', texto: 'Combinar picanha com fraldinha ou maminha reduz o custo sem comprometer a qualidade. A maioria dos convidados não nota a diferença quando os cortes são bem preparados.' },
  { emoji: '🛒', titulo: 'Compre no atacado', texto: 'Para grupos grandes, supermercados atacadistas costumam ter preços 20 a 30% menores que mercados comuns. Vale a viagem, especialmente para carne, bebida e carvão.' },
  { emoji: '🐔', titulo: 'Frango é aliado do bolso', texto: 'Aumentar a proporção de frango e linguiça reduz bastante o custo total sem diminuir a quantidade. Coxa e sobrecoxa bem temperadas fazem muito sucesso e custam menos que qualquer corte bovino.' },
];

const DICAS_UPGRADE: Dica[] = [
  { emoji: '🥩', titulo: 'Upgrade possível', texto: 'Com a verba sobrando, considere adicionar um corte premium como ancho ou picanha importada. A diferença de qualidade é perceptível e transforma o churras em algo especial.' },
  { emoji: '🍷', titulo: 'Eleve as bebidas', texto: 'Parte da sobra pode ir para bebidas premium um vinho tinto encorpado, uma cerveja artesanal ou um uísque para o pós-churras elevam muito a experiência sem grande custo.' },
  { emoji: '🧀', titulo: 'Mesa de frios', texto: 'Uma mesa de entrada com queijos, presunto, azeitonas e pão artesanal transforma o churras em um evento mais completo. Custa pouco e impressiona muito.' },
];

// ── Dicas gerais (pool rotativo) ───────────────────────────────────────────
const DICAS_GERAIS: Dica[] = [
  { emoji: '🔥', titulo: 'Temperatura da grelha', texto: 'A grelha está no ponto quando você consegue manter a mão a 10 cm dela por no máximo 3 segundos. Mais que isso é fogo fraco; menos é fogo forte. Calibre assim antes de colocar a carne.' },
  { emoji: '🪨', titulo: 'Qualidade do carvão', texto: 'Carvão de eucalipto é o mais indicado para churras brasa uniforme, menos fumaça e duração maior. Carvão barato tem muito pó e apaga fácil. Vale pagar um pouco mais.' },
  { emoji: '🧂', titulo: 'Quando salar', texto: 'Sal grosso vai na carne 10 min antes da grelha para carnes vermelhas. Para frango e linguiça, tempere com antecedência de pelo menos 2 horas para o sal penetrar.' },
  { emoji: '🍋', titulo: 'O limão no frango', texto: 'Limão no frango antes de grelhar parece inofensivo, mas o ácido cozinha parcialmente a carne e pode ressecar. Prefira usar como tempero de marinada com antecedência, nunca na hora.' },
  { emoji: '🌬️', titulo: 'Cuidado com a fumaça', texto: 'Fumaça excessiva geralmente significa gordura caindo nas brasas. Posicione a carne um pouco afastada do centro da brasa ou use um prato para aparar o excesso de gordura.' },
  { emoji: '🍖', titulo: 'Osso conduz calor', texto: 'Cortes com osso (costela, coxinha da asa) levam mais tempo para assar porque o osso conduz menos calor. Sempre coloque esses cortes mais cedo ou em fogo mais baixo.' },
  { emoji: '🧈', titulo: 'Manteiga na grelha', texto: 'Uma técnica pouco conhecida: passe manteiga de ervas na carne nos últimos 2 minutos de grelha. O resultado é uma casquinha caramelizada e um aroma irresistível.' },
  { emoji: '💧', titulo: 'Não jogue água no carvão', texto: 'Nunca jogue água nas brasas para controlar o fogo a fumaça que isso gera contamina o sabor da carne. Para reduzir o fogo, tampe a churrasqueira parcialmente ou afaste as brasas.' },
  { emoji: '📏', titulo: 'Espessura ideal', texto: 'A espessura ideal para cortes bovinos grelhados é entre 2,5 e 4 cm. Mais fino resseca rápido demais; mais grosso fica difícil de controlar o ponto interno sem queimar o exterior.' },
  { emoji: '🌿', titulo: 'Chimichurri caseiro', texto: 'Chimichurri caseiro transforma qualquer corte: salsa, alho, orégano, azeite, vinagre, sal e pimenta. Faça na véspera para os sabores se integrarem. Combina especialmente bem com fraldinha e chorizo.' },
  { emoji: '🕐', titulo: 'Descanso pós-grelha', texto: 'Toda carne deve descansar coberta com papel alumínio por 5 a 10 min após sair da grelha. Os sucos redistribuem pelas fibras e a carne fica mais suculenta do que servida imediatamente.' },
  { emoji: '🔪', titulo: 'Faca afiada é essencial', texto: 'Uma faca mal afiada esmaga as fibras e faz o suco escorrer todo. Antes do churras, afie a faca ou use um chaira. A diferença no corte e na apresentação é enorme.' },
];

// ── Função principal de geração de dicas ──────────────────────────────────
function gerarDicas(resultado: ResultadoCalculo): Dica[] {
  const dicas: Dica[] = [];
  const saldoNum = parseFloat(resultado.saldo);
  const custoNum = parseFloat(resultado.custoEstimado);
  const estacao = getEstacao();

  // IDs das carnes selecionadas
  const idsCarnes = resultado.itens.map((i: any) => i.id);

  // 1. Dica específica por tipo de carne (pega a primeira que tiver no banco)
  let dicaCarneSorteada: Dica | null = null;
  for (const id of idsCarnes) {
    if (DICAS_CARNES[id] && DICAS_CARNES[id].length > 0) {
      const pool = DICAS_CARNES[id];
      dicaCarneSorteada = pool[Math.floor(Math.random() * pool.length)];
      break;
    }
  }
  if (dicaCarneSorteada) dicas.push(dicaCarneSorteada);

  // 2. Dica por tamanho do grupo
  let poolGrupo: Dica[];
  if (resultado.total <= 8)       poolGrupo = DICAS_GRUPO_PEQUENO;
  else if (resultado.total <= 20) poolGrupo = DICAS_GRUPO_MEDIO;
  else                            poolGrupo = DICAS_GRUPO_GRANDE;
  dicas.push(poolGrupo[Math.floor(Math.random() * poolGrupo.length)]);

  // 3. Dica da estação do ano
  const poolEstacao = DICAS_ESTACAO[estacao];
  dicas.push(poolEstacao[Math.floor(Math.random() * poolEstacao.length)]);

  // 4. Dica financeira contextual
  if (resultado.verbaDefined && saldoNum < 0) {
    dicas.push(DICAS_ECONOMIA[Math.floor(Math.random() * DICAS_ECONOMIA.length)]);
  } else if (resultado.verbaDefined && saldoNum > custoNum * 0.25) {
    dicas.push(DICAS_UPGRADE[Math.floor(Math.random() * DICAS_UPGRADE.length)]);
  } else {
    // Sem verba ou verba ok: dica geral rotativa
    const usadas = new Set(dicas.map(d => d.titulo));
    const disponiveis = DICAS_GERAIS.filter(d => !usadas.has(d.titulo));
    dicas.push(disponiveis[Math.floor(Math.random() * disponiveis.length)]);
  }

  // 5. Dica geral rotativa (sempre diferente das anteriores)
  const usadas = new Set(dicas.map(d => d.titulo));
  const disponiveis = DICAS_GERAIS.filter(d => !usadas.has(d.titulo));
  dicas.push(disponiveis[Math.floor(Math.random() * disponiveis.length)]);

  return dicas.slice(0, 5);
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function ResultadoScreen({
  nomeEvento, convidados, resultado, onEditarCardapio, onNovoChurras,
}: Props) {
  const [nomeLocal, setNomeLocal] = useState(nomeEvento);
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeTemp, setNomeTemp] = useState(nomeEvento);

  // useMemo garante que as dicas só são geradas uma vez por resultado
  const dicas = useMemo(() => gerarDicas(resultado), [resultado]);

  const saldoPositivo = parseFloat(resultado.saldo) >= 0;
  const pctVerba = resultado.verbaDefined
    ? Math.min(parseFloat(resultado.custoEstimado) / parseFloat(resultado.verba), 1)
    : 0;

  const salvarNome = () => {
    if (nomeTemp.trim()) setNomeLocal(nomeTemp.trim());
    setEditandoNome(false);
  };

  const compartilhar = async () => {
    let txt = `🔥 *${nomeLocal}* 🔥\n📅 ${new Date().toLocaleDateString('pt-BR')}\n`;
    txt += `👥 ${resultado.total} pessoas`;
    if (resultado.adultos)      txt += ` · ${resultado.adultos} adultos`;
    if (resultado.criancas)     txt += ` · ${resultado.criancas} crianças`;
    if (resultado.vegetarianos) txt += ` · ${resultado.vegetarianos} veg.`;
    txt += `\n\n🛒 *LISTA DE COMPRAS*\n`;
    resultado.itens.forEach((i: any) => { txt += `${i.emoji} ${i.label}: ${i.qtdDisplay}\n`; });
    txt += `\n💰 Custo estimado: R$ ${resultado.custoEstimado}\n`;
    if (resultado.verbaDefined) {
      txt += `${saldoPositivo ? '✅ Sobra' : '⚠️ Falta'}: R$ ${Math.abs(parseFloat(resultado.saldo)).toFixed(2)}\n`;
    }
    txt += `💸 Rateio/pessoa: R$ ${resultado.rateio}\n\n👥 *CONVIDADOS*\n`;
    convidados.forEach((c, i) => { txt += `${i + 1}. ${c.nome} ${CAT_CONFIG[c.categoria].emoji}\n`; });
    txt += `\n🏆 *DICAS DO MESTRE*\n`;
    dicas.forEach(d => { txt += `${d.emoji} *${d.titulo}*: ${d.texto}\n`; });
    txt += `\n_Gerado pelo Churrascômetro 🔥_`;
    await Share.share({ message: txt });
  };

  return (
    <View style={S.flex1}>
      <StatusBar backgroundColor="#1a0a00" barStyle="light-content" />
      <ScrollView style={S.container} contentContainerStyle={S.resultContent}>

        {/* Header com nome editável */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => { setNomeTemp(nomeLocal); setEditandoNome(true); }}
            activeOpacity={0.7}
          >
            <Text style={S.resultTitle}>🔥 {nomeLocal}</Text>
            <Text style={ls.editNomeHint}>✏️ toque para editar</Text>
          </TouchableOpacity>
          <View style={S.catBadgeRow}>
            {resultado.adultos > 0 && (
              <View style={[S.catBadge, { backgroundColor: C.brasa + '33' }]}>
                <Text style={[S.catBadgeText, { color: C.brasa }]}>🧑 {resultado.adultos} adultos</Text>
              </View>
            )}
            {resultado.criancas > 0 && (
              <View style={[S.catBadge, { backgroundColor: C.azul + '33' }]}>
                <Text style={[S.catBadgeText, { color: C.azul }]}>👧 {resultado.criancas} crianças</Text>
              </View>
            )}
            {resultado.vegetarianos > 0 && (
              <View style={[S.catBadge, { backgroundColor: C.verde + '33' }]}>
                <Text style={[S.catBadgeText, { color: C.verde }]}>🥗 {resultado.vegetarianos} veg.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Financeiro */}
        <View style={[S.financeCard, resultado.verbaDefined && (saldoPositivo ? S.financeOk : S.financeWarn)]}>
          <Text style={S.financeTitle}>💰 FINANCEIRO</Text>
          {resultado.verbaDefined && (
            <>
              <View style={S.financeRow}>
                <Text style={S.financeLabel}>Verba disponível</Text>
                <Text style={S.financeValue}>R$ {resultado.verba}</Text>
              </View>
              <View style={S.progressBar}>
                <View style={[S.progressFill, {
                  width: `${pctVerba * 100}%` as any,
                  backgroundColor: saldoPositivo ? C.verde : C.vermelho,
                }]} />
              </View>
              <Text style={S.progressLabel}>{(pctVerba * 100).toFixed(0)}% da verba utilizada</Text>
            </>
          )}
          <View style={S.financeRow}>
            <Text style={S.financeLabel}>Custo estimado</Text>
            <Text style={S.financeValue}>R$ {resultado.custoEstimado}</Text>
          </View>
          {resultado.verbaDefined && (
            <View style={[S.financeRow, S.financeSaldo]}>
              <Text style={S.financeLabel}>{saldoPositivo ? '✅ Sobra' : '⚠️ Falta'}</Text>
              <Text style={[S.financeValue, saldoPositivo ? S.saldoPos : S.saldoNeg]}>
                R$ {Math.abs(parseFloat(resultado.saldo)).toFixed(2)}
              </Text>
            </View>
          )}
          <View style={S.rateioDivider} />
          <Text style={S.rateioText}>
            💸 Rateio por pessoa: <Text style={S.rateioValor}>R$ {resultado.rateio}</Text>
          </Text>
        </View>

        {/* Lista de compras */}
        <Text style={S.sectionTitle}>🛒 LISTA DE COMPRAS</Text>
        <View style={S.itemsCard}>
          {resultado.itens.map((item: any) => (
            <View key={item.id} style={S.itemRow}>
              <Text style={S.itemEmoji}>{item.emoji}</Text>
              <Text style={S.itemLabel}>{item.label}</Text>
              <View style={S.itemRight}>
                <Text style={S.itemValor}>{item.qtdDisplay}</Text>
                <Text style={S.itemCusto}>R$ {item.custo.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={ls.checklistHint}>💡 Acesse o Histórico para marcar os itens comprados</Text>

        {/* Convidados */}
        <Text style={S.sectionTitle}>👥 LISTA ({convidados.length})</Text>
        <View style={S.itemsCard}>
          {convidados.map((c, i) => (
            <View key={c.id} style={S.guestItem}>
              <Text style={S.guestIndex}>{i + 1}.</Text>
              <Text style={S.guestEmoji}>{CAT_CONFIG[c.categoria].emoji}</Text>
              <Text style={S.guestName}>{c.nome}</Text>
              <Text style={[S.guestCat, { color: CAT_CONFIG[c.categoria].cor }]}>{CAT_CONFIG[c.categoria].label}</Text>
              <Text style={S.guestChk}>✓</Text>
            </View>
          ))}
        </View>

        {/* Dicas do Mestre */}
        <View style={ls.dicasTopo}>
          <Text style={S.sectionTitle}>🏆 DICAS DO MESTRE</Text>
          <View style={ls.estacaoBadge}>
            <Text style={ls.estacaoBadgeText}>
              {{ verao: '☀️ Verão', outono: '🍂 Outono', inverno: '🌨️ Inverno', primavera: '🌸 Primavera' }[getEstacao()]}
            </Text>
          </View>
        </View>

        <View style={ls.dicasContainer}>
          {dicas.map((dica, i) => (
            <View key={i} style={[ls.dicaItem, i === dicas.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={ls.dicaHeader}>
                <Text style={ls.dicaEmoji}>{dica.emoji}</Text>
                <Text style={ls.dicaTitulo}>{dica.titulo}</Text>
              </View>
              <Text style={ls.dicaTexto}>{dica.texto}</Text>
            </View>
          ))}
        </View>

        {/* Ações */}
        <TouchableOpacity style={S.btnShare} onPress={compartilhar}>
          <Text style={S.btnShareText}>📤 Compartilhar via WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={S.btnSecondary} onPress={onEditarCardapio}>
          <Text style={S.btnSecondaryText}>← Editar Cardápio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={S.btnDanger} onPress={onNovoChurras}>
          <Text style={S.btnDangerText}>🔄 Novo Churras</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal editar nome */}
      <Modal visible={editandoNome} transparent animationType="fade">
        <View style={ls.modalOverlay}>
          <View style={ls.modalBox}>
            <Text style={ls.modalTitle}>✏️ Editar nome do evento</Text>
            <TextInput
              style={ls.modalInput}
              value={nomeTemp}
              onChangeText={setNomeTemp}
              placeholder="Nome do evento"
              placeholderTextColor="#8a6a50"
              autoFocus
              onSubmitEditing={salvarNome}
              returnKeyType="done"
            />
            <View style={ls.modalBtns}>
              <TouchableOpacity style={ls.modalBtnCancel} onPress={() => setEditandoNome(false)}>
                <Text style={ls.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ls.modalBtnOk} onPress={salvarNome}>
                <Text style={ls.modalBtnOkText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ── Estilos locais ────────────────────────────────────────────────────────────
const ls = StyleSheet.create({
  editNomeHint: {
    color: '#5a3a20',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  checklistHint: {
    color: '#5a3a20',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  dicasTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
  },
  estacaoBadge: {
    backgroundColor: C.fumo2,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#4d2e10',
  },
  estacaoBadgeText: {
    color: C.cinza,
    fontSize: 11,
    fontWeight: '700',
  },
  dicasContainer: {
    backgroundColor: C.fumo,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4d2e10',
    overflow: 'hidden',
  },
  dicaItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2d1a0a',
  },
  dicaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dicaEmoji:  { fontSize: 20 },
  dicaTitulo: { color: C.brasa2, fontWeight: '800', fontSize: 14, flex: 1 },
  dicaTexto:  { color: C.cinza, fontSize: 13, lineHeight: 20, paddingLeft: 28 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#2d1a0a',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    borderWidth: 1,
    borderColor: C.brasa,
  },
  modalTitle: {
    color: C.brasa2,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#1a0a00',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff4e6',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#5a3010',
    marginBottom: 16,
  },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5a3010',
    alignItems: 'center',
  },
  modalBtnCancelText: { color: '#8a6a50', fontWeight: '700' },
  modalBtnOk: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: C.brasa,
    alignItems: 'center',
  },
  modalBtnOkText: { color: '#fff', fontWeight: '800' },
});