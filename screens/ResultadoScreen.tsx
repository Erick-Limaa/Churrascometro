import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { C, CAT_CONFIG, Convidado, ResultadoCalculo } from '../constants';
import { S } from '../constants/styles';

type Props = {
  nomeEvento: string;
  dataEvento: string;
  convidados: Convidado[];
  resultado: ResultadoCalculo;
  onEditarCardapio: () => void;
  onNovoChurras: () => void;

  chat: { role: string; text: string }[];
  mensagem: string;
  setMensagem: (texto: string) => void;
  enviarChat: () => void;
  digitando: boolean;
  dots: string;
};

export default function ResultadoScreen({
  nomeEvento,
  dataEvento,
  convidados,
  resultado,
  onEditarCardapio,
  onNovoChurras,
  chat,
  mensagem,
  setMensagem,
  enviarChat,
  digitando,
  dots,
}: Props) {
  const [nomeLocal, setNomeLocal] = useState(nomeEvento);
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeTemp, setNomeTemp] = useState(nomeEvento);

  const salvarNome = () => {
    if (nomeTemp.trim()) setNomeLocal(nomeTemp.trim());
    setEditandoNome(false);
  };

  const compartilhar = async () => {
    try {
      let txt = `🔥 *${nomeLocal.trim()}* 🔥\n📅 ${dataEvento}\n`;
      txt += `👥 ${resultado.total} pessoas`;
      if (resultado.adultos)      txt += ` · ${resultado.adultos} adultos`;
      if (resultado.criancas)     txt += ` · ${resultado.criancas} crianças`;
      if (resultado.vegetarianos) txt += ` · ${resultado.vegetarianos} veg.`;
      txt += `\n\n🛒 *LISTA DE COMPRAS*\n`;
      resultado.itens.forEach((i: any) => { txt += `${i.emoji} ${i.label}: ${i.qtdDisplay}\n`; });
      txt += `\n💰 Custo estimado: R$ ${resultado.custoEstimado}\n`;
      txt += `💸 Rateio/pessoa: R$ ${resultado.rateio}\n\n👥 *CONVIDADOS*\n`;
      convidados.forEach((c, i) => { txt += `${i + 1}. ${c.nome} ${CAT_CONFIG[c.categoria].emoji}\n`; });
      txt += `\n_Gerado pelo Churrascômetro 🔥_`;
      await Share.share({ message: txt });
    } catch {}
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

        {/* Financeiro*/}
        <View style={S.financeCard}>
          <Text style={S.financeTitle}>💰 FINANCEIRO</Text>
          
          <View style={S.financeRow}>
            <Text style={S.financeLabel}>Custo estimado</Text>
            <Text style={S.financeValue}>R$ {resultado.custoEstimado}</Text>
          </View>

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

        {/* 🤖 Assistente Chat de IA*/}
        <Text style={S.sectionTitle}>🤖 ASSISTENTE CHURRASCO IA</Text>
        <View style={ls.chatContainer}>
          <View style={ls.chatMensagens}>
            {chat.length === 0 ? (
              <Text style={ls.chatVazio}>
                Pergunte qualquer coisa! Ex: "Como adapto o cardápio se chover?" ou "Qual a melhor ordem para assar as carnes?"
              </Text>
            ) : (
              chat.map((msg, idx) => (
                <View
                  key={idx}
                  style={[
                    ls.chatBubble,
                    msg.role === 'user' ? ls.chatBubbleUser : ls.chatBubbleBot,
                  ]}
                >
                  <Text style={ls.chatAutor}>
                    {msg.role === 'user' ? 'Você' : 'Assistente'}
                  </Text>
                  <Text style={ls.chatTexto}>{msg.text}</Text>
                </View>
              ))
            )}

            {digitando && (
              <View style={[ls.chatBubble, ls.chatBubbleBot]}>
                <Text style={ls.chatAutor}>Assistente</Text>
                <Text style={ls.chatTexto}>Digitando{dots}</Text>
              </View>
            )}
          </View>

          <View style={ls.chatInputRow}>
            <TextInput
              style={ls.chatInput}
              placeholder="Digite sua dúvida sobre o churrasco..."
              placeholderTextColor="#8a6a50"
              value={mensagem}
              onChangeText={setMensagem}
            />
            <TouchableOpacity style={ls.chatBtnEnviar} onPress={enviarChat}>
              <Text style={ls.chatBtnEnviarTexto}>Enviar</Text>
            </TouchableOpacity>
          </View>
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

  
  chatContainer: {
    backgroundColor: C.fumo,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4d2e10',
    padding: 14,
    marginBottom: 20,
  },
  chatMensagens: {
    marginBottom: 12,
  },
  chatVazio: {
    color: C.cinza,
    fontSize: 13,
    lineHeight: 20,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  chatBubbleUser: {
    backgroundColor: '#3a220f',
  },
  chatBubbleBot: {
    backgroundColor: '#24160a',
  },
  chatAutor: {
    color: C.brasa2,
    fontWeight: '800',
    fontSize: 11,
    marginBottom: 2,
  },
  chatTexto: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#1a0a00',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#fff4e6',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#5a3010',
    height: 40,
  },
  chatBtnEnviar: {
    backgroundColor: C.brasa,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBtnEnviarTexto: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
});