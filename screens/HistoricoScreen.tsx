import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StatusBar,
  Alert, Modal, ScrollView, StyleSheet,
} from 'react-native';
import TopBar from '../components/TopBar';
import { S } from '../constants/styles';
import { C, CAT_CONFIG, Churras } from '../constants';

type Props = {
  historico: Churras[];
  onVoltar: () => void;
  onLimpar: () => void;
};

export default function HistoricoScreen({ historico, onVoltar, onLimpar }: Props) {
  const [selecionado, setSelecionado] = useState<Churras | null>(null);

  const confirmarLimpar = () => {
    Alert.alert('Limpar histórico', 'Tem certeza? Todos os churras salvos serão apagados.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: onLimpar },
    ]);
  };

  return (
    <View style={S.flex1}>
      <StatusBar backgroundColor="#1a0a00" barStyle="light-content" />
      <TopBar titulo="📜 Histórico" onVoltar={onVoltar} />

      <FlatList
        data={historico}
        keyExtractor={i => i.id}
        style={S.listFlex}
        contentContainerStyle={{ padding: 14 }}
        ListEmptyComponent={
          <View style={S.emptyBox}>
            <Text style={S.emptyIcon}>📭</Text>
            <Text style={S.emptyText}>Nenhum churras salvo ainda!</Text>
          </View>
        }
        renderItem={({ item }) => {
          const saldoPos = parseFloat(item.saldo) >= 0;
          return (
            <TouchableOpacity style={ls.card} onPress={() => setSelecionado(item)} activeOpacity={0.75}>
              {/* Linha superior */}
              <View style={ls.cardTop}>
                <Text style={ls.cardNome} numberOfLines={1}>{item.nome}</Text>
                <Text style={ls.cardData}>📅 {item.data}</Text>
              </View>

              {/* Badges de categorias */}
              <View style={ls.badgeRow}>
                {item.adultos > 0 && (
                  <View style={[ls.badge, { backgroundColor: C.brasa + '22' }]}>
                    <Text style={[ls.badgeText, { color: C.brasa }]}>🧑 {item.adultos}</Text>
                  </View>
                )}
                {item.criancas > 0 && (
                  <View style={[ls.badge, { backgroundColor: C.azul + '22' }]}>
                    <Text style={[ls.badgeText, { color: C.azul }]}>👧 {item.criancas}</Text>
                  </View>
                )}
                {item.vegetarianos > 0 && (
                  <View style={[ls.badge, { backgroundColor: C.verde + '22' }]}>
                    <Text style={[ls.badgeText, { color: C.verde }]}>🥗 {item.vegetarianos}</Text>
                  </View>
                )}
              </View>

              {/* Linha financeira */}
              <View style={ls.cardBottom}>
                <Text style={ls.cardCusto}>💰 R$ {item.custoEstimado}</Text>
                <Text style={ls.cardRateio}>💸 R$ {item.rateio}/pessoa</Text>
                {item.verbaDefined && (
                  <Text style={[ls.cardSaldo, { color: saldoPos ? C.verde : C.vermelho }]}>
                    {saldoPos ? '✅' : '⚠️'} R$ {Math.abs(parseFloat(item.saldo)).toFixed(2)}
                  </Text>
                )}
              </View>

              <Text style={ls.verTudo}>Ver detalhes →</Text>
            </TouchableOpacity>
          );
        }}
      />

      {historico.length > 0 && (
        <View style={S.bottomBar}>
          <TouchableOpacity style={[S.btnDanger, { marginTop: 0 }]} onPress={confirmarLimpar}>
            <Text style={S.btnDangerText}>🗑️ Limpar histórico</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de detalhes */}
      <Modal visible={!!selecionado} transparent animationType="slide">
        <View style={ls.modalOverlay}>
          <View style={ls.modalBox}>
            {selecionado && <DetalheChurras churras={selecionado} onFechar={() => setSelecionado(null)} />}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Componente de detalhe ────────────────────────────────────────────────────
function DetalheChurras({ churras, onFechar }: { churras: Churras; onFechar: () => void }) {
  const saldoPos = parseFloat(churras.saldo) >= 0;
  const pctVerba = churras.verbaDefined
    ? Math.min(parseFloat(churras.custoEstimado) / parseFloat(churras.verba), 1)
    : 0;

  return (
    <ScrollView contentContainerStyle={ls.detalheContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={ls.detalheHeader}>
        <Text style={ls.detalheTitulo}>🔥 {churras.nome}</Text>
        <Text style={ls.detalheData}>📅 {churras.data}</Text>
      </View>

      {/* Badges */}
      <View style={ls.badgeRow}>
        {churras.adultos > 0 && (
          <View style={[ls.badge, { backgroundColor: C.brasa + '33' }]}>
            <Text style={[ls.badgeText, { color: C.brasa }]}>🧑 {churras.adultos} adulto{churras.adultos > 1 ? 's' : ''}</Text>
          </View>
        )}
        {churras.criancas > 0 && (
          <View style={[ls.badge, { backgroundColor: C.azul + '33' }]}>
            <Text style={[ls.badgeText, { color: C.azul }]}>👧 {churras.criancas} criança{churras.criancas > 1 ? 's' : ''}</Text>
          </View>
        )}
        {churras.vegetarianos > 0 && (
          <View style={[ls.badge, { backgroundColor: C.verde + '33' }]}>
            <Text style={[ls.badgeText, { color: C.verde }]}>🥗 {churras.vegetarianos} veg.</Text>
          </View>
        )}
      </View>

      {/* Card financeiro */}
      <View style={[ls.finCard, churras.verbaDefined && (saldoPos ? ls.finCardOk : ls.finCardWarn)]}>
        <Text style={ls.finTitulo}>💰 FINANCEIRO</Text>

        {churras.verbaDefined && (
          <>
            <View style={ls.finRow}>
              <Text style={ls.finLabel}>Verba disponível</Text>
              <Text style={ls.finValor}>R$ {churras.verba}</Text>
            </View>
            <View style={ls.progressBar}>
              <View style={[ls.progressFill, {
                width: `${pctVerba * 100}%` as any,
                backgroundColor: saldoPos ? C.verde : C.vermelho,
              }]} />
            </View>
            <Text style={ls.progressLabel}>{(pctVerba * 100).toFixed(0)}% da verba utilizada</Text>
          </>
        )}

        <View style={ls.finRow}>
          <Text style={ls.finLabel}>Custo estimado</Text>
          <Text style={ls.finValor}>R$ {churras.custoEstimado}</Text>
        </View>

        <View style={ls.finRow}>
          <Text style={ls.finLabel}>Total de pessoas</Text>
          <Text style={ls.finValor}>👥 {churras.totalPessoas}</Text>
        </View>

        {churras.verbaDefined && (
          <View style={ls.finRow}>
            <Text style={ls.finLabel}>{saldoPos ? '✅ Sobrou' : '⚠️ Faltou'}</Text>
            <Text style={[ls.finValor, { color: saldoPos ? C.verde : C.vermelho }]}>
              R$ {Math.abs(parseFloat(churras.saldo)).toFixed(2)}
            </Text>
          </View>
        )}

        <View style={ls.divisor} />
        <Text style={ls.rateioTexto}>
          💸 Rateio por pessoa: <Text style={ls.rateioValor}>R$ {churras.rateio}</Text>
        </Text>
      </View>

      <TouchableOpacity style={ls.btnFechar} onPress={onFechar}>
        <Text style={ls.btnFecharText}>Fechar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Estilos locais ─────────────────────────────────────────────────────────
const ls = StyleSheet.create({
  card: {
    backgroundColor: C.fumo,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3d2510',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardNome: { color: C.branco, fontWeight: '800', fontSize: 15, flex: 1, marginRight: 8 },
  cardData: { color: '#6a4a30', fontSize: 12 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 8 },
  cardCusto: { color: C.cinza, fontSize: 12 },
  cardRateio: { color: C.cinza, fontSize: 12 },
  cardSaldo: { fontSize: 12, fontWeight: '700' },
  verTudo: { color: C.brasa, fontSize: 12, fontWeight: '700', textAlign: 'right' },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000bb',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: C.carvao,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    borderTopWidth: 2,
    borderColor: C.brasa,
  },
  detalheContent: { padding: 24, paddingBottom: 40 },
  detalheHeader: { alignItems: 'center', marginBottom: 16 },
  detalheTitulo: { color: C.brasa, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  detalheData: { color: '#6a4a30', fontSize: 13, marginTop: 4 },

  finCard: {
    backgroundColor: C.fumo2,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: C.brasa,
  },
  finCardOk:   { borderColor: C.verde },
  finCardWarn: { borderColor: C.vermelho },
  finTitulo: { color: C.brasa2, fontWeight: '800', fontSize: 13, letterSpacing: 2, marginBottom: 12 },
  finRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  finLabel:  { color: C.cinza, fontSize: 14 },
  finValor:  { color: C.branco, fontWeight: '700', fontSize: 14 },

  progressBar:   { height: 8, backgroundColor: '#1a0a00', borderRadius: 4, marginVertical: 8, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 4 },
  progressLabel: { color: '#6a4a30', fontSize: 11, textAlign: 'right', marginBottom: 8 },

  divisor:     { borderTopWidth: 1, borderTopColor: '#4d2e10', marginVertical: 12 },
  rateioTexto: { color: C.cinza, fontSize: 14, textAlign: 'center' },
  rateioValor: { color: C.brasa2, fontWeight: '900', fontSize: 16 },

  btnFechar: {
    backgroundColor: C.fumo2,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: C.brasa,
  },
  btnFecharText: { color: C.brasa, fontWeight: '700', fontSize: 15 },
});