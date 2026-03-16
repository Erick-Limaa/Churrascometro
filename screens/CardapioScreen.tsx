import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StatusBar, Alert, Switch, Modal,
} from 'react-native';
import TopBar from '../components/TopBar';
import { S } from '../constants/styles';
import { ItemCardapio, Convidado, CARDAPIO_DEFAULT } from '../constants';

type Props = {
  convidados: Convidado[];
  onVoltar: () => void;
  onCalcular: (cardapio: ItemCardapio[]) => void;
};

export default function CardapioScreen({ convidados, onVoltar, onCalcular }: Props) {
  const [cardapio, setCardapio] = useState<ItemCardapio[]>(CARDAPIO_DEFAULT);
  const [modalPreco, setModalPreco] = useState<ItemCardapio | null>(null);
  const [modalQtd, setModalQtd] = useState<ItemCardapio | null>(null);
  const [tempPreco, setTempPreco] = useState('');
  const [tempQtd, setTempQtd] = useState('');

  const toggleItem = (id: string) => {
    setCardapio(prev => prev.map(i => i.id === id ? { ...i, ativo: !i.ativo } : i));
  };

  const salvarPreco = () => {
    if (!modalPreco) return;
    const val = parseFloat(tempPreco.replace(',', '.'));
    if (isNaN(val) || val <= 0) { Alert.alert('Valor inválido'); return; }
    setCardapio(prev => prev.map(i => i.id === modalPreco.id ? { ...i, preco: val } : i));
    setModalPreco(null);
  };

  const salvarQtd = () => {
    if (!modalQtd) return;
    const val = parseFloat(tempQtd.replace(',', '.'));
    if (isNaN(val) || val <= 0) { Alert.alert('Valor inválido'); return; }
    setCardapio(prev => prev.map(i => i.id === modalQtd.id ? { ...i, manual: val } : i));
    setModalQtd(null);
  };

  return (
    <View style={S.flex1}>
      <StatusBar backgroundColor="#1a0a00" barStyle="light-content" />
      <View style={S.container}>
        <TopBar titulo="⚙️ Cardápio" onVoltar={onVoltar} />
        <ScrollView
          contentContainerStyle={{ padding: 14, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={S.cardapioHint}>Ative/desative itens, ajuste preços e quantidades</Text>

          {cardapio.map(item => (
            <View key={item.id} style={[S.cardapioRow, !item.ativo && S.cardapioRowOff]}>
              <Switch
                value={item.ativo}
                onValueChange={() => toggleItem(item.id)}
                trackColor={{ false: '#3d2510', true: '#e85d0488' }}
                thumbColor={item.ativo ? '#e85d04' : '#555'}
              />
              <Text style={S.cardapioEmoji}>{item.emoji}</Text>
              <Text style={[S.cardapioLabel, !item.ativo && { color: '#5a3010' }]}>{item.label}</Text>
              <View style={S.cardapioAcoes}>
                {item.ativo && (
                  <>
                    <TouchableOpacity
                      style={S.tagBtn}
                      onPress={() => { setModalQtd(item); setTempQtd(item.manual != null ? String(item.manual) : ''); }}
                    >
                      <Text style={S.tagBtnText}>{item.manual != null ? `📏 ${item.manual}` : '📏 auto'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={S.tagBtn}
                      onPress={() => { setModalPreco(item); setTempPreco(String(item.preco)); }}
                    >
                      <Text style={S.tagBtnText}>R${item.preco}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={S.bottomBar}>
          <TouchableOpacity style={[S.btnPrimary, { marginHorizontal: 0 }]} onPress={() => onCalcular(cardapio)}>
            <Text style={S.btnPrimaryText}>CALCULAR CHURRAS 🔥</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Preço */}
      <Modal visible={!!modalPreco} transparent animationType="fade">
        <View style={S.modalOverlay}>
          <View style={S.modalBox}>
            <Text style={S.modalTitle}>💰 Preço — {modalPreco?.label}</Text>
            <Text style={S.modalSub}>Por {modalPreco?.precoUnidade}</Text>
            <TextInput
              style={S.modalInput}
              value={tempPreco}
              onChangeText={setTempPreco}
              keyboardType="numeric"
              placeholder="Ex: 45.90"
              placeholderTextColor="#8a6a50"
              autoFocus
            />
            <View style={S.modalBtns}>
              <TouchableOpacity style={S.modalBtnCancel} onPress={() => setModalPreco(null)}>
                <Text style={S.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.modalBtnOk} onPress={salvarPreco}>
                <Text style={S.modalBtnOkText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Quantidade */}
      <Modal visible={!!modalQtd} transparent animationType="fade">
        <View style={S.modalOverlay}>
          <View style={S.modalBox}>
            <Text style={S.modalTitle}>📏 Quantidade — {modalQtd?.label}</Text>
            <Text style={S.modalSub}>
              Total manual ({modalQtd?.unidade}) — automático: {((modalQtd?.qtdPorPessoa ?? 0) * convidados.length).toFixed(1)} {modalQtd?.unidade}
            </Text>
            <TextInput
              style={S.modalInput}
              value={tempQtd}
              onChangeText={setTempQtd}
              keyboardType="numeric"
              placeholder="Deixe vazio para automático"
              placeholderTextColor="#8a6a50"
              autoFocus
            />
            <View style={S.modalBtns}>
              <TouchableOpacity
                style={S.modalBtnCancel}
                onPress={() => {
                  setCardapio(prev => prev.map(i => i.id === modalQtd?.id ? { ...i, manual: null } : i));
                  setModalQtd(null);
                }}
              >
                <Text style={S.modalBtnCancelText}>Resetar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={S.modalBtnOk} onPress={salvarQtd}>
                <Text style={S.modalBtnOkText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}