import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView, StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { C, Churras } from '../constants';
import { S } from '../constants/styles';

type Props = {
  historico: Churras[];
  onAvancar: (nome: string, verba: string, data: string) => void;
  onHistorico: () => void;
};

export default function HomeScreen({ historico, onAvancar, onHistorico }: Props) {
  const [nomeEvento, setNomeEvento] = useState('');
  const [verba, setVerba] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const formatarData = (d: Date) =>
    d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });

  const onChangeData = (event: any, dataSelecionada?: Date) => {
    // No Android o picker fecha sozinho
    if (Platform.OS === 'android') setMostrarPicker(false);
    if (dataSelecionada) setData(dataSelecionada);
  };

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
          {/* Nome do evento + botão calendário */}
          <Text style={S.cardLabel}>📋 Nome do Evento</Text>
          <View style={ls.inputRow}>
            <TextInput
              style={[S.input, { flex: 1, marginRight: 8 }]}
              placeholder="Ex: Churras do Zé"
              placeholderTextColor="#8a6a50"
              value={nomeEvento}
              onChangeText={setNomeEvento}
            />
            <TouchableOpacity
              style={ls.calendarBtn}
              onPress={() => setMostrarPicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={22} color={C.brasa2} />
            </TouchableOpacity>
          </View>

          {/* Data selecionada */}
          <TouchableOpacity
            style={ls.dataRow}
            onPress={() => setMostrarPicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={14} color={C.brasa} />
            <Text style={ls.dataTexto}>{formatarData(data)}</Text>
          </TouchableOpacity>

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
            onAvancar(nomeEvento, verba, formatarData(data));
          }}
        >
          <Text style={S.btnPrimaryText}>MONTAR A LISTA</Text>
        </TouchableOpacity>

        {historico.length > 0 && (
          <TouchableOpacity style={[S.btnSecondary, { marginHorizontal: 16 }]} onPress={onHistorico}>
            <Text style={S.btnSecondaryText}>📜 Histórico ({historico.length})</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Date Picker — Android abre nativo, iOS abre em modal */}
      {mostrarPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={onChangeData}
          minimumDate={new Date()}
          locale="pt-BR"
        />
      )}

      {/* iOS: modal com picker inline */}
      {Platform.OS === 'ios' && (
        <Modal visible={mostrarPicker} transparent animationType="slide">
          <View style={ls.modalOverlay}>
            <View style={ls.modalBox}>
              <View style={ls.modalHeader}>
                <Text style={ls.modalTitulo}>📅 Data do Churras</Text>
                <TouchableOpacity onPress={() => setMostrarPicker(false)}>
                  <Text style={ls.modalFechar}>Pronto</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={data}
                mode="date"
                display="spinner"
                onChange={onChangeData}
                minimumDate={new Date()}
                locale="pt-BR"
                style={{ backgroundColor: C.fumo }}
              />
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const ls = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarBtn: {
    backgroundColor: C.fumo,
    borderWidth: 1,
    borderColor: '#5a3010',
    borderRadius: 10,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginBottom: 4,
  },
  dataTexto: {
    color: C.cinza,
    fontSize: 12,
    flex: 1,
  },
  dataEditar: {
    color: C.brasa,
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: C.fumo,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderTopWidth: 2,
    borderColor: C.brasa,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitulo: {
    color: C.brasa2,
    fontWeight: '800',
    fontSize: 15,
  },
  modalFechar: {
    color: C.brasa,
    fontWeight: '700',
    fontSize: 15,
  },
});