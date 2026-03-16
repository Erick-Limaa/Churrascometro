import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StatusBar,
  Share, StyleSheet,
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

// ── Gera dicas dinâmicas baseadas nos dados reais do churras ─────────────────
function gerarDicas(resultado: ResultadoCalculo): Dica[] {
  const dicas: Dica[] = [];
  const saldoNum = parseFloat(resultado.saldo);
  const custoNum = parseFloat(resultado.custoEstimado);
  const carneItem  = resultado.itens.find((i: any) => i.id === 'carne');
  const cervejaItem = resultado.itens.find((i: any) => i.id === 'cerveja');
  const carvaoItem = resultado.itens.find((i: any) => i.id === 'carvao');

  // Carvão e tempo
  if (carvaoItem) {
    const kg = carvaoItem.qtdCalculada ?? 0;
    const min = resultado.total <= 10 ? 40 : resultado.total <= 20 ? 50 : 60;
    dicas.push({
      emoji: '🪨',
      titulo: 'Hora de acender',
      texto: `Com ${kg.toFixed(0)} kg de carvão para ${resultado.total} pessoas, acenda a churrasqueira ${min} minutos antes de servir. Use papel e gravetos no fundo — nunca álcool, que queima rápido e deixa gosto na carne.`,
    });
  }

  // Carne
  if (carneItem) {
    const kg = (carneItem.qtdCalculada ?? 0) / 1000;
    dicas.push({
      emoji: '🥩',
      titulo: 'Segredo da carne',
      texto: `Para ${kg.toFixed(1)} kg de carne, aplique sal grosso apenas 10 minutos antes de grelhar — mais cedo resseca. Sele em fogo alto 3 min de cada lado, depois abaixe o fogo para atingir o ponto. Deixe descansar 5 min antes de fatiar.`,
    });
  }

  // Cerveja
  if (cervejaItem) {
    const qtd = Math.ceil(cervejaItem.qtdCalculada ?? 0);
    dicas.push({
      emoji: '🍺',
      titulo: 'Cerveja no ponto',
      texto: `${qtd} latas para ${resultado.total} pessoas. Coloque no gelo pelo menos 2 horas antes — ideal entre −2°C e 0°C. Dica: misture água com gelo no isopor, gela 3× mais rápido do que gelo seco.`,
    });
  }

  // Vegetarianos
  if (resultado.vegetarianos > 0) {
    dicas.push({
      emoji: '🥗',
      titulo: `${resultado.vegetarianos} vegetariano${resultado.vegetarianos > 1 ? 's' : ''} na área`,
      texto: `Reserve uma grelha separada — contato com gordura animal pode incomodar. Campeões na brasa: abobrinha, berinjela, pimentão com azeite e alho, milho e queijo coalho. Tempere igual à carne, fica incrível.`,
    });
  }

  // Crianças
  if (resultado.criancas > 0) {
    dicas.push({
      emoji: '👧',
      titulo: `${resultado.criancas} criança${resultado.criancas > 1 ? 's' : ''} no churras`,
      texto: `Frango e linguiça são os favoritos das crianças — evite cortes duros como costela. Separe refri e suco extra, o cálculo de bebida é feito para adultos. Corte a carne em pedaços menores antes de servir.`,
    });
  }

  // Verba curta
  if (resultado.verbaDefined && saldoNum < 0) {
    dicas.push({
      emoji: '💸',
      titulo: `Faltam R$ ${Math.abs(saldoNum).toFixed(2)} — sem pânico`,
      texto: `Reduza a carne bovina e aumente frango e linguiça — igualmente saborosos e bem mais baratos. Outra saída: combine um rateio extra de R$ ${(Math.abs(saldoNum) / resultado.total).toFixed(2)} por pessoa e o churras está coberto.`,
    });
  }

  // Verba sobrando bastante
  if (resultado.verbaDefined && saldoNum > custoNum * 0.25) {
    dicas.push({
      emoji: '⭐',
      titulo: `Sobram R$ ${saldoNum.toFixed(2)} — hora do upgrade`,
      texto: `Com essa sobra dá pra caprichar! Considere trocar parte da carne por picanha ou ancho, adicionar costela suína (faz sucesso) ou investir em mesa de frios e pão de alho artesanal como entrada.`,
    });
  }

  // Timing para grupos grandes
  if (resultado.total >= 15) {
    dicas.push({
      emoji: '⏱️',
      titulo: 'Planejamento do tempo',
      texto: `Com ${resultado.total} pessoas, asse em levas — não jogue tudo na grelha de uma vez. Ordem ideal: costela primeiro (demora mais), depois linguiça e frango, e por último a carne bovina. Tudo chega quente e no ponto.`,
    });
  }

  // Regra dos 10% (sempre presente)
  dicas.push({
    emoji: '📏',
    titulo: 'Regra dos 10%',
    texto: `Compre sempre 10% a mais de carne do que o calculado — imprevistos acontecem e convidado com fome extra também. É melhor sobrar um pouco. O que sobrar vira sanduíche no dia seguinte 😄`,
  });

  return dicas.slice(0, 5);
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function ResultadoScreen({
  nomeEvento, convidados, resultado, onEditarCardapio, onNovoChurras,
}: Props) {
  const dicas = gerarDicas(resultado);
  const saldoPositivo = parseFloat(resultado.saldo) >= 0;
  const pctVerba = resultado.verbaDefined
    ? Math.min(parseFloat(resultado.custoEstimado) / parseFloat(resultado.verba), 1)
    : 0;

  const compartilhar = async () => {
    let txt = `🔥 *${nomeEvento}* 🔥\n📅 ${new Date().toLocaleDateString('pt-BR')}\n`;
    txt += `👥 ${resultado.total} pessoas`;
    if (resultado.adultos) txt += ` · ${resultado.adultos} adultos`;
    if (resultado.criancas) txt += ` · ${resultado.criancas} crianças`;
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

        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={S.resultTitle}>🔥 {nomeEvento}</Text>
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
        <Text style={S.sectionTitle}>🏆 DICAS DO MESTRE</Text>
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
    </View>
  );
}

const ls = StyleSheet.create({
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
});