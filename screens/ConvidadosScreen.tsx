import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import TopBar from '../components/TopBar';
import { C, CAT_CONFIG, Categoria, Convidado } from '../constants';
import { S } from '../constants/styles';

type Props = {
  nomeEvento: string;
  convidadosIniciais: Convidado[];  // preserva o progresso
  onVoltar: () => void;
  onAvancar: (convidados: Convidado[]) => void;
};

const ls = StyleSheet.create({
  editHint: { color: '#4a2a10', fontSize: 9, marginTop: 1 },
  modalOverlay: {
    flex: 1, backgroundColor: '#000000aa',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#2d1a0a', borderRadius: 16,
    padding: 24, width: '85%', borderWidth: 1, borderColor: C.brasa,
  },
  modalTitle: { color: C.brasa2, fontWeight: '800', fontSize: 16, marginBottom: 14 },
  modalInput: {
    backgroundColor: '#1a0a00', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    color: '#fff4e6', fontSize: 16,
    borderWidth: 1, borderColor: '#5a3010', marginBottom: 16,
  },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalBtnCancel: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#5a3010', alignItems: 'center',
  },
  modalBtnCancelText: { color: '#8a6a50', fontWeight: '700' },
  modalBtnOk: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    backgroundColor: C.brasa, alignItems: 'center',
  },
  modalBtnOkText: { color: '#fff', fontWeight: '800' },
});

export default function ConvidadosScreen({ nomeEvento, convidadosIniciais, onVoltar, onAvancar }: Props) {
  // Inicializa com o estado preservado
  const [novoConvidado, setNovoConvidado] = useState('');
  const [catSelecionada, setCatSelecionada] = useState<Categoria>('adulto');
  const [convidados, setConvidados] = useState<Convidado[]>(convidadosIniciais);
  const [editando, setEditando] = useState<Convidado | null>(null);
  const [nomeEditado, setNomeEditado] = useState('');

  const adicionarConvidado = useCallback(() => {
    const nome = novoConvidado.trim();
    if (!nome) return;
    setConvidados(prev => [...prev, { id: Date.now().toString(), nome, categoria: catSelecionada }]);
    setNovoConvidado('');
    Vibration.vibrate(40);
  }, [novoConvidado, catSelecionada]);

  const removerConvidado = useCallback((id: string) => {
    Vibration.vibrate(60);
    setConvidados(prev => prev.filter(c => c.id !== id));
  }, []);

  const abrirEdicao = useCallback((c: Convidado) => {
    setEditando(c);
    setNomeEditado(c.nome);
  }, []);

  const salvarEdicao = useCallback(() => {
    const nome = nomeEditado.trim();
    if (!nome) { Alert.alert('Atenção', 'O nome não pode ser vazio!'); return; }
    setConvidados(prev => prev.map(c => c.id === editando?.id ? { ...c, nome } : c));
    setEditando(null);
    Vibration.vibrate(40);
  }, [editando, nomeEditado]);

  const renderItem = useCallback(({ item, index }: { item: Convidado; index: number }) => (
    <View style={S.convidadoRow}>
      <Text style={[S.convidadoIndex, { color: CAT_CONFIG[item.categoria].cor }]}>{index + 1}</Text>
      <Text style={S.convidadoEmoji}>{CAT_CONFIG[item.categoria].emoji}</Text>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => abrirEdicao(item)} activeOpacity={0.7}>
        <Text style={S.convidadoNome}>{item.nome}</Text>
        <Text style={ls.editHint}>toque para editar</Text>
      </TouchableOpacity>
      <Text style={[S.convidadoCat, { color: CAT_CONFIG[item.categoria].cor }]}>
        {CAT_CONFIG[item.categoria].label}
      </Text>
      <TouchableOpacity onPress={() => removerConvidado(item.id)}>
        <Text style={S.removeBtn}>✕</Text>
      </TouchableOpacity>
    </View>
  ), [removerConvidado, abrirEdicao]);

  const header = (
    <>
      <View style={S.catRow}>
        {(Object.keys(CAT_CONFIG) as Categoria[]).map(cat => (
          <TouchableOpacity
            key={cat}
            style={[S.catBtn, catSelecionada === cat && { backgroundColor: CAT_CONFIG[cat].cor + '33', borderColor: CAT_CONFIG[cat].cor }]}
            onPress={() => setCatSelecionada(cat)}
          >
            <Text style={S.catEmoji}>{CAT_CONFIG[cat].emoji}</Text>
            <Text style={[S.catLabel, catSelecionada === cat && { color: CAT_CONFIG[cat].cor }]}>
              {CAT_CONFIG[cat].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {convidados.length > 0 && (
        <View style={S.catResumo}>
          {(Object.keys(CAT_CONFIG) as Categoria[]).map(cat => {
            const count = convidados.filter(c => c.categoria === cat).length;
            if (!count) return null;
            return (
              <Text key={cat} style={[S.catResumoText, { color: CAT_CONFIG[cat].cor }]}>
                {CAT_CONFIG[cat].emoji} {count}
              </Text>
            );
          })}
        </View>
      )}

      <View style={S.addRow}>
        <TextInput
          style={S.inputAdd}
          placeholder="Nome do convidado..."
          placeholderTextColor="#8a6a50"
          value={novoConvidado}
          onChangeText={setNovoConvidado}
          onSubmitEditing={adicionarConvidado}
          returnKeyType="done"
          blurOnSubmit={false}
        />
        <TouchableOpacity style={S.btnAdd} onPress={adicionarConvidado}>
          <Text style={S.btnAddText}>+</Text>
        </TouchableOpacity>
      </View>

      {convidados.length === 0 && (
        <View style={S.emptyBox}>
          <Text style={S.emptyIcon}>🍖</Text>
          <Text style={S.emptyText}>Adicione os convidados acima!</Text>
        </View>
      )}
    </>
  );

  const footer = convidados.length > 0 ? (
    <TouchableOpacity
      style={[S.btnPrimary, { marginHorizontal: 0, marginTop: 16, marginBottom: 16 }]}
      onPress={() => onAvancar(convidados)}
    >
      <Text style={S.btnPrimaryText}>CONFIGURAR CARDÁPIO ({convidados.length})</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <KeyboardAvoidingView style={S.flex1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor="#1a0a00" barStyle="light-content" />
      <View style={S.container}>
        <TopBar
          titulo="👥 Convidados"
          onVoltar={onVoltar}
          direita={<Text style={S.topBarCount}>{convidados.length} 🥩</Text>}
        />
        <Text style={S.eventoNome}>{nomeEvento}</Text>
        <FlatList
          data={convidados}
          keyExtractor={i => i.id}
          style={S.listFlex}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 14 }}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          renderItem={renderItem}
        />
      </View>

      <Modal visible={!!editando} transparent animationType="fade">
        <View style={ls.modalOverlay}>
          <View style={ls.modalBox}>
            <Text style={ls.modalTitle}>✏️ Editar nome</Text>
            <TextInput
              style={ls.modalInput}
              value={nomeEditado}
              onChangeText={setNomeEditado}
              placeholder="Nome do convidado"
              placeholderTextColor="#8a6a50"
              autoFocus
              onSubmitEditing={salvarEdicao}
              returnKeyType="done"
            />
            <View style={ls.modalBtns}>
              <TouchableOpacity style={ls.modalBtnCancel} onPress={() => setEditando(null)}>
                <Text style={ls.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ls.modalBtnOk} onPress={salvarEdicao}>
                <Text style={ls.modalBtnOkText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}