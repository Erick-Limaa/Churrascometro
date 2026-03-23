import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StatusBar, Alert, Switch, Modal, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import { S } from '../constants/styles';
import { C, Convidado, CARDAPIO_DEFAULT, ItemCardapio } from '../constants';

// ─── Subtipos por categoria ────────────────────────────────────────────────
type SubItem = {
  id: string;
  label: string;
  preco: number;
  qtdPorPessoa: number; // em gramas
  selecionado: boolean;
  manual?: number | null;
};

type CategoriaComSub = {
  id: string;
  emoji: string;
  label: string;
  ativo: boolean;
  expandido: boolean;
  subitens: SubItem[];
};

const CATEGORIAS_COM_SUB: CategoriaComSub[] = [
  {
    id: 'bovinos', emoji: '🥩', label: 'Carne Bovina', ativo: true, expandido: false,
    subitens: [
      { id: 'picanha',    label: 'Picanha',         preco: 80,  qtdPorPessoa: 400, selecionado: false, manual: null },
      { id: 'fraldinha',  label: 'Fraldinha',       preco: 55,  qtdPorPessoa: 400, selecionado: false, manual: null },
      { id: 'maminha',    label: 'Maminha',         preco: 50,  qtdPorPessoa: 400, selecionado: false, manual: null },
      { id: 'costela',    label: 'Costela',         preco: 40,  qtdPorPessoa: 500, selecionado: false, manual: null },
      { id: 'alcatra',    label: 'Alcatra',         preco: 58,  qtdPorPessoa: 400, selecionado: false, manual: null },
      { id: 'ancho',      label: 'Ancho',           preco: 70,  qtdPorPessoa: 400, selecionado: false, manual: null },
      { id: 'cupim',      label: 'Cupim',           preco: 45,  qtdPorPessoa: 350, selecionado: false, manual: null },
      { id: 'contrafile', label: 'Contrafilé',      preco: 48,  qtdPorPessoa: 400, selecionado: false, manual: null },
    ],
  },
  {
    id: 'frango', emoji: '🍗', label: 'Frango', ativo: true, expandido: false,
    subitens: [
      { id: 'coxa_sobrecoxa', label: 'Coxa e Sobrecoxa', preco: 16, qtdPorPessoa: 250, selecionado: false, manual: null },
      { id: 'asa',            label: 'Asa / Coxinha da asa', preco: 14, qtdPorPessoa: 200, selecionado: false, manual: null },
      { id: 'peito',          label: 'Peito',              preco: 20, qtdPorPessoa: 200, selecionado: false, manual: null },
      { id: 'file_frango',    label: 'Filé de frango',     preco: 22, qtdPorPessoa: 200, selecionado: false, manual: null },
      { id: 'coracao',        label: 'Coração',            preco: 18, qtdPorPessoa: 150, selecionado: false, manual: null },
      { id: 'frango_inteiro', label: 'Frango inteiro',     preco: 15, qtdPorPessoa: 300, selecionado: false, manual: null },
    ],
  },
  {
    id: 'linguica', emoji: '🌭', label: 'Linguiça', ativo: true, expandido: false,
    subitens: [
      { id: 'ling_toscana',   label: 'Linguiça Toscana',       preco: 28, qtdPorPessoa: 120, selecionado: false, manual: null },
      { id: 'ling_calabresa', label: 'Linguiça Calabresa',     preco: 25, qtdPorPessoa: 120, selecionado: false, manual: null },
      { id: 'ling_frango',    label: 'Linguiça de Frango',     preco: 22, qtdPorPessoa: 120, selecionado: false, manual: null },
      { id: 'ling_defumada',  label: 'Linguiça Defumada',      preco: 30, qtdPorPessoa: 100, selecionado: false, manual: null },
      { id: 'chorizo',        label: 'Chorizo',                preco: 35, qtdPorPessoa: 100, selecionado: false, manual: null },
    ],
  },
];

type Props = {
  convidados: Convidado[];
  onVoltar: () => void;
  onCalcular: (cardapio: ItemCardapio[], categorias: CategoriaComSub[]) => void;
};

export default function CardapioScreen({ convidados, onVoltar, onCalcular }: Props) {
  const [categorias, setCategorias] = useState<CategoriaComSub[]>(CATEGORIAS_COM_SUB);
  const [cardapio, setCardapio] = useState<ItemCardapio[]>(
    CARDAPIO_DEFAULT.filter(i => !['carne', 'frango', 'linguica'].includes(i.id))
  );
  const [modalPreco, setModalPreco] = useState<{ catId: string; subId: string; label: string; preco: number } | null>(null);
  const [modalQtd, setModalQtd] = useState<{ catId: string; subId: string; label: string; qtd: number; auto: number } | null>(null);
  const [modalPrecoSimples, setModalPrecoSimples] = useState<ItemCardapio | null>(null);
  const [tempPreco, setTempPreco] = useState('');
  const [tempQtd, setTempQtd] = useState('');

  // ── Helpers categorias ────────────────────────────────────────────────────
  const toggleCategoria = (catId: string) => {
    setCategorias(prev => prev.map(c => c.id === catId ? { ...c, ativo: !c.ativo } : c));
  };

  const toggleExpandir = (catId: string) => {
    setCategorias(prev => prev.map(c => c.id === catId ? { ...c, expandido: !c.expandido } : c));
  };

  const toggleSubitem = (catId: string, subId: string) => {
    setCategorias(prev => prev.map(c =>
      c.id === catId ? {
        ...c,
        subitens: c.subitens.map(s =>
          s.id === subId ? { ...s, selecionado: !s.selecionado } : s
        )
      } : c
    ));
  };

  const salvarPrecoSub = () => {
    if (!modalPreco) return;
    const val = parseFloat(tempPreco.replace(',', '.'));
    if (isNaN(val) || val <= 0) { Alert.alert('Valor inválido'); return; }
    setCategorias(prev => prev.map(c =>
      c.id === modalPreco.catId ? {
        ...c,
        subitens: c.subitens.map(s =>
          s.id === modalPreco.subId ? { ...s, preco: val } : s
        )
      } : c
    ));
    setModalPreco(null);
  };

  const salvarQtdSub = () => {
    if (!modalQtd) return;
    const val = parseFloat(tempQtd.replace(',', '.'));
    if (isNaN(val) || val <= 0) { Alert.alert('Valor inválido'); return; }
    setCategorias(prev => prev.map(c =>
      c.id === modalQtd.catId ? {
        ...c,
        subitens: c.subitens.map(s =>
          s.id === modalQtd.subId ? { ...s, manual: val } : s
        )
      } : c
    ));
    setModalQtd(null);
  };

  // ── Helpers cardápio simples ──────────────────────────────────────────────
  const toggleItem = (id: string) => {
    setCardapio(prev => prev.map(i => i.id === id ? { ...i, ativo: !i.ativo } : i));
  };

  const salvarPrecoSimples = () => {
    if (!modalPrecoSimples) return;
    const val = parseFloat(tempPreco.replace(',', '.'));
    if (isNaN(val) || val <= 0) { Alert.alert('Valor inválido'); return; }
    setCardapio(prev => prev.map(i => i.id === modalPrecoSimples.id ? { ...i, preco: val } : i));
    setModalPrecoSimples(null);
  };

  // ── Validar e calcular ────────────────────────────────────────────────────
  const handleCalcular = () => {
    const algumSelecionado = categorias.some(c =>
      c.ativo && c.subitens.some(s => s.selecionado)
    );
    if (!algumSelecionado) {
      Alert.alert('Atenção', 'Selecione pelo menos um tipo de carne, frango ou linguiça!');
      return;
    }
    onCalcular(cardapio, categorias);
  };

  // ── Contagem de selecionados por categoria ───────────────────────────────
  const contarSelecionados = (cat: CategoriaComSub) =>
    cat.subitens.filter(s => s.selecionado).length;

  return (
    <View style={S.flex1}>
      <StatusBar backgroundColor="#1a0a00" barStyle="light-content" />
      <View style={S.container}>
        <TopBar titulo="⚙️ Cardápio" onVoltar={onVoltar} />

        <ScrollView
          contentContainerStyle={{ padding: 14, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={S.cardapioHint}>Selecione os tipos de carne e configure os demais itens</Text>

          {/* ── CATEGORIAS COM SUBMENU ── */}
          {categorias.map(cat => {
            const selecionados = contarSelecionados(cat);
            return (
              <View key={cat.id} style={ls.catContainer}>
                {/* Header da categoria */}
                <View style={ls.catHeader}>
                  <Switch
                    value={cat.ativo}
                    onValueChange={() => toggleCategoria(cat.id)}
                    trackColor={{ false: C.fumo2, true: C.brasa + '88' }}
                    thumbColor={cat.ativo ? C.brasa : '#555'}
                  />
                  <Text style={ls.catEmoji}>{cat.emoji}</Text>
                  <TouchableOpacity
                    style={ls.catLabelBtn}
                    onPress={() => cat.ativo && toggleExpandir(cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[ls.catLabel, !cat.ativo && { color: '#5a3010' }]}>
                      {cat.label}
                    </Text>
                    {selecionados > 0 && (
                      <View style={ls.countBadge}>
                        <Text style={ls.countBadgeText}>{selecionados} selecionado{selecionados > 1 ? 's' : ''}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  {cat.ativo && (
                    <TouchableOpacity onPress={() => toggleExpandir(cat.id)} style={ls.expandBtn}>
                      <Ionicons
                        name={cat.expandido ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={C.brasa2}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Subitens */}
                {cat.ativo && cat.expandido && (
                  <View style={ls.subitemsContainer}>
                    {cat.subitens.map((sub, idx) => {
                      const autoQtd = ((sub.qtdPorPessoa * convidados.length) / 1000).toFixed(1);
                      return (
                        <View
                          key={sub.id}
                          style={[ls.subItem, idx === cat.subitens.length - 1 && { borderBottomWidth: 0 }]}
                        >
                          {/* Checkbox */}
                          <TouchableOpacity
                            style={[ls.checkbox, sub.selecionado && ls.checkboxChecked]}
                            onPress={() => toggleSubitem(cat.id, sub.id)}
                          >
                            {sub.selecionado && (
                              <Ionicons name="checkmark" size={14} color="#fff" />
                            )}
                          </TouchableOpacity>

                          {/* Nome */}
                          <TouchableOpacity
                            style={ls.subLabelBtn}
                            onPress={() => toggleSubitem(cat.id, sub.id)}
                          >
                            <Text style={[ls.subLabel, sub.selecionado && { color: C.branco }]}>
                              {sub.label}
                            </Text>
                            <Text style={ls.subQtdAuto}>
                              {sub.manual != null ? `${sub.manual} kg` : `~${autoQtd} kg`}
                            </Text>
                          </TouchableOpacity>

                          {/* Botões de edição */}
                          {sub.selecionado && (
                            <View style={ls.subAcoes}>
                              <TouchableOpacity
                                style={ls.tagBtn}
                                onPress={() => {
                                  setModalQtd({
                                    catId: cat.id, subId: sub.id,
                                    label: sub.label,
                                    qtd: sub.manual ?? 0,
                                    auto: parseFloat(autoQtd),
                                  });
                                  setTempQtd(sub.manual != null ? String(sub.manual) : '');
                                }}
                              >
                                <Text style={ls.tagBtnText}>
                                  {sub.manual != null ? `📏 ${sub.manual}kg` : '📏 auto'}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={ls.tagBtn}
                                onPress={() => {
                                  setModalPreco({ catId: cat.id, subId: sub.id, label: sub.label, preco: sub.preco });
                                  setTempPreco(String(sub.preco));
                                }}
                              >
                                <Text style={ls.tagBtnText}>R${sub.preco}/kg</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}

          {/* ── ITENS SIMPLES (sem submenu) ── */}
          <Text style={ls.sectionLabel}>🔧 OUTROS ITENS</Text>
          {cardapio.map(item => (
            <View key={item.id} style={[S.cardapioRow, !item.ativo && S.cardapioRowOff]}>
              <Switch
                value={item.ativo}
                onValueChange={() => toggleItem(item.id)}
                trackColor={{ false: C.fumo2, true: C.brasa + '88' }}
                thumbColor={item.ativo ? C.brasa : '#555'}
              />
              <Text style={S.cardapioEmoji}>{item.emoji}</Text>
              <Text style={[S.cardapioLabel, !item.ativo && { color: '#5a3010' }]}>{item.label}</Text>
              {item.ativo && (
                <TouchableOpacity
                  style={S.tagBtn}
                  onPress={() => { setModalPrecoSimples(item); setTempPreco(String(item.preco)); }}
                >
                  <Text style={S.tagBtnText}>R${item.preco}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={S.bottomBar}>
          <TouchableOpacity style={[S.btnPrimary, { marginHorizontal: 0 }]} onPress={handleCalcular}>
            <Text style={S.btnPrimaryText}>CALCULAR CHURRAS 🔥</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Preço Subitem */}
      <Modal visible={!!modalPreco} transparent animationType="fade">
        <View style={S.modalOverlay}>
          <View style={S.modalBox}>
            <Text style={S.modalTitle}>💰 Preço — {modalPreco?.label}</Text>
            <Text style={S.modalSub}>Por kg (R$/kg)</Text>
            <TextInput
              style={S.modalInput} value={tempPreco} onChangeText={setTempPreco}
              keyboardType="numeric" placeholder="Ex: 80.00"
              placeholderTextColor="#8a6a50" autoFocus
            />
            <View style={S.modalBtns}>
              <TouchableOpacity style={S.modalBtnCancel} onPress={() => setModalPreco(null)}>
                <Text style={S.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.modalBtnOk} onPress={salvarPrecoSub}>
                <Text style={S.modalBtnOkText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Quantidade Subitem */}
      <Modal visible={!!modalQtd} transparent animationType="fade">
        <View style={S.modalOverlay}>
          <View style={S.modalBox}>
            <Text style={S.modalTitle}>📏 Quantidade — {modalQtd?.label}</Text>
            <Text style={S.modalSub}>Total em kg — automático: {modalQtd?.auto} kg</Text>
            <TextInput
              style={S.modalInput} value={tempQtd} onChangeText={setTempQtd}
              keyboardType="numeric" placeholder="Ex: 2.5"
              placeholderTextColor="#8a6a50" autoFocus
            />
            <View style={S.modalBtns}>
              <TouchableOpacity style={S.modalBtnCancel} onPress={() => {
                setCategorias(prev => prev.map(c =>
                  c.id === modalQtd?.catId ? {
                    ...c, subitens: c.subitens.map(s =>
                      s.id === modalQtd?.subId ? { ...s, manual: null } : s
                    )
                  } : c
                ));
                setModalQtd(null);
              }}>
                <Text style={S.modalBtnCancelText}>Resetar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.modalBtnOk} onPress={salvarQtdSub}>
                <Text style={S.modalBtnOkText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Preço Item Simples */}
      <Modal visible={!!modalPrecoSimples} transparent animationType="fade">
        <View style={S.modalOverlay}>
          <View style={S.modalBox}>
            <Text style={S.modalTitle}>💰 Preço — {modalPrecoSimples?.label}</Text>
            <Text style={S.modalSub}>Por {modalPrecoSimples?.precoUnidade}</Text>
            <TextInput
              style={S.modalInput} value={tempPreco} onChangeText={setTempPreco}
              keyboardType="numeric" placeholder="Ex: 8.00"
              placeholderTextColor="#8a6a50" autoFocus
            />
            <View style={S.modalBtns}>
              <TouchableOpacity style={S.modalBtnCancel} onPress={() => setModalPrecoSimples(null)}>
                <Text style={S.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.modalBtnOk} onPress={salvarPrecoSimples}>
                <Text style={S.modalBtnOkText}>Salvar</Text>
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
  sectionLabel: {
    color: C.brasa2, fontSize: 11, fontWeight: '800',
    letterSpacing: 2, marginTop: 20, marginBottom: 8,
  },
  catContainer: {
    backgroundColor: C.fumo,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3d2510',
    overflow: 'hidden',
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  catEmoji: { fontSize: 20, width: 28 },
  catLabelBtn: { flex: 1, gap: 4 },
  catLabel: { color: C.cinza, fontSize: 14, fontWeight: '600' },
  countBadge: {
    backgroundColor: C.brasa + '33',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  countBadgeText: { color: C.brasa, fontSize: 11, fontWeight: '700' },
  expandBtn: { padding: 4 },

  subitemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2d1a0a',
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d1a0a',
    gap: 10,
  },
  checkbox: {
    width: 22, height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#5a3010',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: C.brasa,
    borderColor: C.brasa,
  },
  subLabelBtn: { flex: 1 },
  subLabel: { color: '#8a6a50', fontSize: 13, fontWeight: '600' },
  subQtdAuto: { color: '#5a3a20', fontSize: 11, marginTop: 2 },
  subAcoes: { flexDirection: 'row', gap: 6 },
  tagBtn: {
    backgroundColor: '#3d2510',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  tagBtnText: { color: C.brasa2, fontSize: 10, fontWeight: '700' },
});

export type { CategoriaComSub };