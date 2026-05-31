import React, { useMemo, useState } from 'react';
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
import { C, Convidado, ResultadoCalculo } from '../constants';

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

type Dica = { emoji: string; titulo: string; texto: string };

// ═══════════════════════════════════════════════════════════════════════════
// BANCO DE DICAS 
// ═══════════════════════════════════════════════════════════════════════════
const DICAS_CARNES: Record<string, Dica[]> = {
  picanha: [
    { emoji: '🥩', titulo: 'Picanha no ponto', texto: 'Sempre grelhe a picanha com a gordura pra cima primeiro a gordura desce e hidrata a carne. Use fogo alto para selar e depois fogo médio para atingir o ponto. Nunca fure com garfo!' },
    { emoji: '🧂', titulo: 'Sal na picanha', texto: 'Na picanha, o sal grosso vai só no lado da carne, nunca na gordura. Aplique 10 min antes de ir ao fogo and bate o excesso ao tirar.' }
  ],
  maminha: [
    { emoji: '🥩', titulo: 'Maminha Suculenta', texto: 'A maminha deve ser cortada contra a fibra para ficar bem macia. Grelhe em brasa forte para selar os dois lados e depois suba para o segundo andar da churrasqueira.' }
  ],
  fraldinha: [
    { emoji: '🥩', titulo: 'Fraldinha Rápida', texto: 'Por ser uma carne fina, a fraldinha assa rápido. Use fogo forte e curto. Fica excelente marinada com um pouco de alho, óleo e cerveja preta antes de salgar.' }
  ],
  contra_filet: [
    { emoji: '🥩', titulo: 'Contrafilé alto', texto: 'Corte bifes grossos (2 dedos). Sele em fogo fortíssimo (1-2 minutos de cada lado) e deixe descansar por 3 minutos antes de cortar para reter o suco.' }
  ],
  alcatra: [
    { emoji: '🥩', titulo: 'Alcatra Macia', texto: 'Evite fogo baixo por muito tempo para a alcatra não ressecar. É uma carne magra, por isso o ponto ideal é de malpassado para ao ponto.' }
  ],
  cupim: [
    { emoji: '⏳', titulo: 'Cupim Demorado', texto: 'Cupim exige paciência. O ideal é assar envolvido em várias voltas de papel celofane por pelo menos 3 horas em fogo brando no alto da churrasqueira.' }
  ],
  costela_boi: [
    { emoji: '🔥', titulo: 'Costela de Chão/Bafo', texto: 'O osso sempre fica virado para o fogo durante 80% do tempo de cozimento. Quando o osso começar a se soltar da carne, vire para dourar o outro lado.' }
  ],
  coracao: [
    { emoji: '🍢', titulo: 'Coração no Ponto', texto: 'Deixe marinar em cerveja, alho e sal por 30 min. Asse em fogo médio-alto revirando o espeto. Se passar do ponto, ele vira uma borracha!' }
  ],
  coxinha_frango: [
    { emoji: '🍗', titulo: 'Frango Dourado', texto: 'Asse na parte média da churrasqueira para cozinhar bem por dentro sem queimar a pele. O segredo é temperar com limão, alho e um toque de colorau para a cor.' }
  ],
  asa_frango: [
    { emoji: '🍗', titulo: 'Asinha Crocante', texto: 'As asas ficam ótimas se assadas em fogo médio. Perto do final, aproxime da brasa para pururucar e deixar a pele bem crocante.' }
  ],
  linguica: [
    { emoji: '🍢', titulo: 'Linguiça Perfeita', texto: 'Nunca fure a linguiça, senão ela perde todo o suco e fica seca. Asse em fogo médio e vire com pegador. Se o fogo subir com a gordura, afaste-a momentaneamente.' }
  ],
  pao_alho: [
    { emoji: '🥖', titulo: 'Pão de Alho Atento', texto: 'Coloque primeiro com o lado do recheio para cima até o pão inflar um pouco, depois vire para dourar o creme de alho. Cuidado: queima em segundos!' }
  ],
  queijo_coalho: [
    { emoji: '🧀', titulo: 'Queijo Coalho', texto: 'Brasa bem quente e rápida! Fique olhando fixamente, vire assim que dourar o primeiro lado. Se bobear, ele derrete todo e cai no carvão.' }
  ]
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
  const [modalVisible, setModalVisible] = useState(false);
  const [comprados, setComprados] = useState<Record<string, boolean>>({});

  const toggleComprado = (id: string) => {
    setComprados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const itensCompradosQtd = useMemo(() => {
    return resultado.itens.filter((i: any) => comprados[i.id]).length;
  }, [comprados, resultado.itens]);

  const dicasParaExibir = useMemo(() => {
    const lista: Dica[] = [];
    resultado.itens.forEach((it: any) => {
      if (DICAS_CARNES[it.id]) {
        lista.push(...DICAS_CARNES[it.id]);
      }
    });
    if (lista.length === 0) {
      lista.push({
        emoji: '🔥',
        titulo: 'Fogo Perfeito',
        texto: 'Acenda o carvão 30 minutos antes de colocar a primeira carne. O ponto ideal é quando se forma uma camada de cinzas cinzentas sobre as brasas vermelhas (sem labaredas).',
      });
    }
    return lista;
  }, [resultado.itens]);

  const handleCompartilhar = async () => {
    try {
      const listaStr = resultado.itens
        .map((i: any) => `• [${comprados[i.id] ? 'X' : ' '}] ${i.label}: ${i.qtdDisplay}`)
        .join('\n');

      const texto = `🔥 *${nomeEvento || 'Churrasco'}* 🔥\n📅 *Data:* ${dataEvento}\n👥 *Convidados:* ${resultado.total} (${resultado.adultos} Ad, ${resultado.criancas} Cr, ${resultado.vegetarianos} Veg)\n\n💰 *Custo Total Estimado:* R$ ${resultado.custoEstimado}\n👥 *Rateio por Pessoa:* R$ ${resultado.rateio}\n\n📋 *LISTA DE COMPRAS:*\n${listaStr}\n\nCalculado no Churrascômetro 🚀`;

      await Share.share({ message: texto });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0a00" />

      <ScrollView contentContainerStyle={styles.scroll}>
    
        <View style={styles.headerInfo}>
          <Text style={styles.eventoNome}>{nomeEvento || 'Meu Churrasco'}</Text>
          <Text style={styles.eventoData}>{dataEvento}</Text>
        </View>

        
        <View style={styles.mainCard}>
          <Text style={styles.mainCardTitle}>CUSTO TOTAL ESTIMADO</Text>
          <Text style={styles.mainCardValue}>R$ {resultado.custoEstimado}</Text>

          <View style={styles.divider} />

          <View style={styles.financeRow}>
            <View style={styles.financeCol}>
              <Text style={styles.finLabel}>Rateio / Pessoa</Text>
              <Text style={styles.finValue}>R$ {resultado.rateio}</Text>
            </View>
            <View style={[styles.financeCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.finLabel}>Total Pessoas</Text>
              <Text style={styles.finValue}>{resultado.total} convidados</Text>
            </View>
          </View>

          {resultado.verbaDefined && (
            <View style={styles.verbaContainer}>
              <View style={styles.verbaLine}>
                <Text style={styles.verbaLabel}>Sua Verba:</Text>
                <Text style={styles.verbaValue}>R$ {resultado.verba}</Text>
              </View>
              <View style={styles.verbaLine}>
                <Text style={styles.verbaLabel}>Saldo:</Text>
                <Text
                  style={[
                    styles.verbaValue,
                    { color: parseFloat(resultado.saldo) >= 0 ? '#4caf50' : '#f44336' },
                  ]}
                >
                  R$ {resultado.saldo}
                </Text>
              </View>
            </View>
          )}
        </View>

       
        <View style={styles.subCard}>
          <Text style={styles.subCardTitle}>Distribuição do Pessoal</Text>
          <Text style={styles.subCardText}>
            👨 {resultado.adultos} Adultos   |   👶 {resultado.criancas} Crianças   |   🥗 {resultado.vegetarianos} Vegetarianos
          </Text>
        </View>

       
        <TouchableOpacity style={styles.btnListaCheck} onPress={() => setModalVisible(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 20 }}>📋</Text>
            <View>
              <Text style={styles.btnListaCheckTitle}>Ver Lista de Compras</Text>
              <Text style={styles.btnListaCheckSub}>
                {comprados[resultado.itens[0]?.id] ? 'Itens sendo marcados...' : `${itensCompradosQtd} de ${resultado.itens.length} comprados`}
              </Text>
            </View>
          </View>
          <Text style={{ color: C.brasa2, fontWeight: '900' }}>→</Text>
        </TouchableOpacity>

        
        <View style={styles.chatContainer}>
          <Text style={styles.chatHeaderTitulo}>🤖 Assistente Churrasco IA</Text>
          <View style={styles.chatMensagens}>
            {chat.length === 0 ? (
              <Text style={styles.chatVazio}>
                Pergunte qualquer coisa! Ex: "Como mudo os itens se o dia amanhecer chovendo?" ou "Alguma dica para temperar a costela?"
              </Text>
            ) : (
              chat.map((msg, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.chatBubble,
                    msg.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleBot,
                  ]}
                >
                  <Text style={styles.chatAutor}>
                    {msg.role === 'user' ? 'Você' : 'Assistente'}
                  </Text>
                  <Text style={styles.chatTexto}>{msg.text}</Text>
                </View>
              ))
            )}

            {digitando && (
              <View style={[styles.chatBubble, styles.chatBubbleBot]}>
                <Text style={styles.chatAutor}>Assistente</Text>
                <Text style={styles.chatTexto}>Digitando{dots}</Text>
              </View>
            )}
          </View>

          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Digite sua dúvida sobre o churrasco..."
              placeholderTextColor="#8a6a50"
              value={mensagem}
              onChangeText={setMensagem}
            />
            <TouchableOpacity style={styles.chatBtnEnviar} onPress={enviarChat}>
              <Text style={styles.chatBtnEnviarTexto}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* ───────────────────────────────────────────────────────────────── */}

       
        <View style={{ marginTop: 10 }}>
          <Text style={styles.secaoTitulo}>🔥 Dicas do Mestre Churrasqueiro</Text>
          <View style={styles.dicasList}>
            {dicasParaExibir.map((dica, index) => (
              <View key={index} style={styles.dicaCard}>
                <View style={styles.dicaHeader}>
                  <Text style={styles.dicaEmoji}>{dica.emoji}</Text>
                  <Text style={styles.dicaTitulo}>{dica.titulo}</Text>
                </View>
                <Text style={styles.dicaTexto}>{dica.texto}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionBtnSec} onPress={onEditarCardapio}>
          <Text style={styles.actionBtnSecText}>Ajustar Itens</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnSec} onPress={handleCompartilhar}>
          <Text style={styles.actionBtnSecText}>Compartilhar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnPrim} onPress={onNovoChurras}>
          <Text style={styles.actionBtnPrimText}>Novo Churras</Text>
        </TouchableOpacity>
      </View>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>📋 Lista de Compras</Text>

            <ScrollView style={{ maxHeight: 300, marginBottom: 16 }}>
              {resultado.itens.map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalItemRow}
                  onPress={() => toggleComprado(item.id)}
                >
                  <Text style={{ fontSize: 18 }}>
                    {comprados[item.id] ? '✅' : '⬜'}
                  </Text>
                  <Text
                    style={[
                      styles.modalItemLabel,
                      comprados[item.id] && {
                        textDecorationLine: 'line-through',
                        color: '#664422',
                      },
                    ]}
                  >
                    {item.emoji || '🔸'} {item.label}
                  </Text>
                  <Text style={styles.modalItemQtd}>{item.qtdDisplay}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalBtnOk}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBtnOkText}>Fechar Lista</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  scroll: { padding: 20 },
  headerInfo: { marginBottom: 20, alignItems: 'center' },
  eventoNome: { color: '#fff', fontSize: 24, fontWeight: '900', textAlign: 'center' },
  eventoData: { color: C.brasa2, fontSize: 14, fontWeight: '600', marginTop: 4 },
  
  mainCard: {
    backgroundColor: '#2d1a0a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: C.brasa,
    marginBottom: 16,
  },
  mainCardTitle: { color: C.cinza, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  mainCardValue: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#4d2e10', marginVertical: 14 },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  financeCol: { flex: 1 },
  finLabel: { color: C.cinza, fontSize: 11, fontWeight: '600' },
  finValue: { color: C.brasa2, fontSize: 16, fontWeight: '800', marginTop: 2 },
  
  verbaContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#4d2e10',
    gap: 4,
  },
  verbaLine: { flexDirection: 'row', justifyContent: 'space-between' },
  verbaLabel: { color: C.cinza, fontSize: 13 },
  verbaValue: { color: '#fff', fontSize: 14, fontWeight: '700' },

  subCard: {
    backgroundColor: '#211206',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#3d220a',
    marginBottom: 16,
  },
  subCardTitle: { color: C.brasa2, fontSize: 13, fontWeight: '800', marginBottom: 4 },
  subCardText: { color: '#fff4e6', fontSize: 13 },

  btnListaCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3a220f',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.brasa,
    marginBottom: 20,
  },
  btnListaCheckTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnListaCheckSub: { color: C.cinza, fontSize: 12, marginTop: 2 },

  secaoTitulo: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 12 },
  dicasList: { gap: 10 },
  dicaCard: {
    backgroundColor: '#24160a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2d1a0a',
  },
  dicaHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  dicaEmoji: { fontSize: 20 },
  dicaTitulo: { color: C.brasa2, fontWeight: '800', fontSize: 14, flex: 1 },
  dicaTexto: { color: C.cinza, fontSize: 13, lineHeight: 20, paddingLeft: 28 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a0a00',
    padding: 16,
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#3d220a',
  },
  actionBtnSec: {
    flex: 1,
    backgroundColor: '#2d1a0a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.brasa,
  },
  actionBtnSecText: { color: C.brasa2, fontWeight: '800', fontSize: 13 },
  actionBtnPrim: {
    flex: 1.2,
    backgroundColor: C.brasa,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnPrimText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#2d1a0a', borderRadius: 16, padding: 24, width: '85%', borderWidth: 1, borderColor: C.brasa },
  modalTitle: { color: C.brasa2, fontWeight: '800', fontSize: 16, marginBottom: 14 },
  modalItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#3d220a' },
  modalItemLabel: { color: '#fff', fontSize: 14, marginLeft: 10, flex: 1 },
  modalItemQtd: { color: C.brasa2, fontWeight: '700', fontSize: 14 },
  modalBtnOk: { backgroundColor: C.brasa, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  modalBtnOkText: { color: '#fff', fontWeight: '800' },

  chatContainer: {
    backgroundColor: C.fumo,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4d2e10',
    padding: 14,
    marginBottom: 16,
  },
  chatHeaderTitulo: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
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