import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StatusBar, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { S } from '../constants/styles';
import { Churras } from '../constants';

type Props = {
  historico: Churras[];
  onAvancar: (nome: string, verba: string) => void;
  onHistorico: () => void;
};

export default function HomeScreen({ historico, onAvancar, onHistorico }: Props) {
  const [nomeEvento, setNomeEvento] = useState('');
  const [verba, setVerba] = useState('');

  return (
    <KeyboardAvoidingView style={S.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor="#1a0a00" barStyle="light-content" />
      <ScrollView style={S.container} contentContainerStyle={S.homeContent} keyboardShouldPersistTaps="handled">
        <View style={S.headerBrand}>
          <Text style={S.flame}>🔥</Text>
          <Text style={S.brandTitle}>CHURRASCÔMETRO</Text>
          <Text style={S.brandSub}>Organizador de Churras</Text>
        </View>

        <View style={S.card}>
          <Text style={S.cardLabel}>📋 Nome do Evento</Text>
          <TextInput
            style={S.input}
            placeholder="Ex: Churras do Zé — Sábado"
            placeholderTextColor="#8a6a50"
            value={nomeEvento}
            onChangeText={setNomeEvento}
          />
          <Text style={S.cardLabel}>💰 Verba Total (R$)</Text>
          <TextInput
            style={S.input}
            placeholder="Ex: 500,00  (opcional)"
            placeholderTextColor="#8a6a50"
            value={verba}
            onChangeText={setVerba}
            keyboardType="numeric"
          />
          <Text style={S.inputHint}>Deixe em branco para calcular só as quantidades</Text>
        </View>

        <TouchableOpacity
          style={S.btnPrimary}
          onPress={() => {
            if (!nomeEvento.trim()) { Alert.alert('Atenção', 'Dê um nome pro seu churras!'); return; }
            onAvancar(nomeEvento, verba);
          }}
        >
          <Text style={S.btnPrimaryText}>MONTAR A LISTA 🥩</Text>
        </TouchableOpacity>

        {historico.length > 0 && (
          <TouchableOpacity style={[S.btnSecondary, { marginHorizontal: 16 }]} onPress={onHistorico}>
            <Text style={S.btnSecondaryText}>📜 Histórico ({historico.length})</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}