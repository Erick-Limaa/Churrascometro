import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StatusBar, Alert, Vibration, KeyboardAvoidingView, Platform,
} from 'react-native';
import TopBar from '../components/TopBar';
import { S } from '../constants/styles';
import { Convidado, Categoria, CAT_CONFIG } from '../constants';

type Props = {
  nomeEvento: string;
  onVoltar: () => void;
  onAvancar: (convidados: Convidado[]) => void;
};

export default function ConvidadosScreen({ nomeEvento, onVoltar, onAvancar }: Props) {
  const [novoConvidado, setNovoConvidado] = useState('');
  const [catSelecionada, setCatSelecionada] = useState<Categoria>('adulto');
  const [convidados, setConvidados] = useState<Convidado[]>([]);

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

  const renderItem = useCallback(({ item, index }: { item: Convidado; index: number }) => (
    <View style={S.convidadoRow}>
      <Text style={[S.convidadoIndex, { color: CAT_CONFIG[item.categoria].cor }]}>{index + 1}</Text>
      <Text style={S.convidadoEmoji}>{CAT_CONFIG[item.categoria].emoji}</Text>
      <Text style={S.convidadoNome}>{item.nome}</Text>
      <Text style={[S.convidadoCat, { color: CAT_CONFIG[item.categoria].cor }]}>
        {CAT_CONFIG[item.categoria].label}
      </Text>
      <TouchableOpacity onPress={() => removerConvidado(item.id)}>
        <Text style={S.removeBtn}>✕</Text>
      </TouchableOpacity>
    </View>
  ), [removerConvidado]);

  const header = (
    <>
      {/* Seletor de categoria */}
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

      {/* Resumo */}
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

      {/* Input */}
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
      <Text style={S.btnPrimaryText}>CONFIGURAR CARDÁPIO ({convidados.length}) ⚙️</Text>
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
    </KeyboardAvoidingView>
  );
}