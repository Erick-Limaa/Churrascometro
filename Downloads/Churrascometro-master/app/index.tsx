import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, Dimensions, Easing, StyleSheet, View } from 'react-native';

import CardapioScreen, { CategoriaComSub } from '../screens/CardapioScreen';
import ConvidadosScreen from '../screens/ConvidadosScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import HomeScreen from '../screens/HomeScreen';
import ResultadoScreen from '../screens/ResultadoScreen';
import SplashAnimadaScreen from '../screens/SplashAnimadaScreen';


import { enviarMensagem } from '@/services/gemini';

import {
  CARDAPIO_DEFAULT,
  Churras,
  Convidado, ItemCardapio,
  ResultadoCalculo,
} from '../constants';

type Tela = 'home' | 'convidados' | 'cardapio' | 'resultado' | 'historico';

const STORAGE_KEY = '@churrascomentro_historico';

export default function Index() {
  const [splashVista, setSplashVista] = useState(false);

  
  const [tela, setTela] = useState<Tela>('home');
  const [nomeEvento, setNomeEvento] = useState('');
  const [verba, setVerba] = useState('');
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [categorias, setCategorias] = useState<CategoriaComSub[]>([]);
  const [cardapioSimples, setCardapioSimples] = useState<ItemCardapio[]>(
    CARDAPIO_DEFAULT.filter(i => !['carne', 'frango', 'linguica'].includes(i.id))
  );
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [dataEvento, setDataEvento] = useState(new Date().toLocaleDateString('pt-BR'));
  const [historico, setHistorico] = useState<Churras[]>([]);

 
  const [chat, setChat] = useState<{ role: string; text: string }[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [digitando, setDigitando] = useState(false);
  const [dots, setDots] = useState('.');

  
  const slideAnim  = useRef(new Animated.Value(0)).current;
  const SCREEN_W   = Dimensions.get('window').width;
  const ORDEM: Tela[] = ['home', 'convidados', 'cardapio', 'resultado', 'historico'];

  const proximaTela  = useRef<Tela | null>(null);
  const direcaoAnim  = useRef<number>(0);

  const navegarPara = (proxTela: Tela) => {
    const idxAtual  = ORDEM.indexOf(tela);
    const idxProx   = ORDEM.indexOf(proxTela);
    const avancando = idxProx > idxAtual || proxTela === 'historico';

    proximaTela.current  = proxTela;
    direcaoAnim.current  = avancando ? SCREEN_W : -SCREEN_W;

    Animated.timing(slideAnim, {
      toValue: avancando ? -SCREEN_W * 0.3 : SCREEN_W * 0.3,
      duration: 200,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(direcaoAnim.current);
      setTela(proxTela);
    });
  };

  useLayoutEffect(() => {
    if (proximaTela.current === null) return;
    proximaTela.current = null;
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [tela]);

  // ── BackHandler ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onBackPress = () => {
      if (tela === 'home') {
        Alert.alert(
          'Sair do app',
          'Tem certeza que quer sair do Churrascômetro?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      }
      if (tela === 'convidados') { navegarPara('home');       return true; }
      if (tela === 'cardapio')   { navegarPara('convidados'); return true; }
      if (tela === 'resultado')  { navegarPara('cardapio');   return true; }
      if (tela === 'historico')  { navegarPara('home');       return true; }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [tela]);

  // ── Histórico ────────────────────────────────────────────────────────────
  useEffect(() => { carregarHistorico(); }, []);

  const carregarHistorico = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setHistorico(JSON.parse(raw));
    } catch {}
  };

  const salvarNoHistorico = async (res: ResultadoCalculo, nome: string) => {
    try {
      const novo: Churras = {
        id: Date.now().toString(), nome,
        data: dataEvento,
        totalPessoas: res.total,
        adultos: res.adultos, criancas: res.criancas, vegetarianos: res.vegetarianos,
        custoEstimado: res.custoEstimado,
        verba: res.verba, verbaDefined: res.verbaDefined,
        saldo: res.saldo, rateio: res.rateio,
        itens: res.itens,
        comprados: {},
      };
      const lista = [novo, ...historico].slice(0, 20);
      setHistorico(lista);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {}
  };

  const limparHistorico = async () => {
    setHistorico([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };


  useEffect(() => {
    if (!digitando) {
      setDots('.');
      return;
    }

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [digitando]);

  const enviarChat = async () => {
    if (!mensagem.trim() || !resultado) return;

    const texto = mensagem.trim();

    setChat(prev => [
      ...prev,
      { role: 'user', text: texto }
    ]);

    setMensagem('');
    setDigitando(true);

    try {
      const carnesEscolhidas = resultado.itens
        .map((item: any) => `${item.label}: ${item.qtdDisplay}`)
        .join(', ');

      const contexto = `
Você é um assistente de churrasco.
Responda em português do Brasil, com emojis.

REGRAS IMPORTANTES:
- Responda apenas em texto simples
- Não use Markdown
- Não use *
- Não use **
- Não use listas
- Não use formatação

Responda como se fosse uma mensagem normal de WhatsApp.

Dados:
Evento: ${nomeEvento}
Pessoas: ${resultado.total}
Carnes e itens: ${carnesEscolhidas}

Pergunta:
${texto}
`;

      const resposta = await enviarMensagem(contexto);

      setChat(prev => [
        ...prev,
        { role: 'bot', text: resposta }
      ]);
    } catch {
      setChat(prev => [
        ...prev,
        { role: 'bot', text: 'Erro ao falar com a IA' }
      ]);
    } finally {
      setDigitando(false);
    }
  };

  const gerarDicasAutomaticas = async (resultadoAtual: ResultadoCalculo) => {
    setDigitando(true);
    try {
      const carnesEscolhidas = resultadoAtual.itens
        .map((item: any) => `${item.label}: ${item.qtdDisplay}`)
        .join(', ');

      const prompt = `
Você é um assistente de churrasco.
Responda em português do Brasil, com emojis.

REGRAS IMPORTANTES:
- Responda apenas em texto simples
- Não use Markdown
- Não use *
- Não use **
- Não use listas
- Não use formatação

Responda como se fosse uma mensagem normal de WhatsApp.

Dados:
Evento: ${nomeEvento}
Pessoas: ${resultadoAtual.total}
Adultos: ${resultadoAtual.adultos}
Crianças: ${resultadoAtual.criancas}
Vegetarianos: ${resultadoAtual.vegetarianos}
Carnes e itens: ${carnesEscolhidas}

Dê dicas curtas sobre:
- ordem da grelha
- tempero
- tempo de preparo
- uma dica extra
`;

      const resposta = await enviarMensagem(prompt);

      setChat([
        { role: 'bot', text: resposta }
      ]);
    } catch {
      setChat([
        { role: 'bot', text: 'Não consegui gerar as dicas automáticas agora 😢' }
      ]);
    } finally {
      setDigitando(false);
    }
  };

  // ── Calcular ─────────────────────────────────────────────────────────────
  const calcular = (simplesAtual: ItemCardapio[], categoriasAtual: CategoriaComSub[]) => {
    setCardapioSimples(simplesAtual);
    setCategorias(categoriasAtual);

    const adultos      = convidados.filter(c => c.categoria === 'adulto').length;
    const criancas     = convidados.filter(c => c.categoria === 'crianca').length;
    const vegetarianos = convidados.filter(c => c.categoria === 'vegetariano').length;
    const totalEq      = adultos * 1.0 + criancas * 0.5 + vegetarianos * 1.0;
    const total        = convidados.length;

    const itensCarne: any[] = [];
    categoriasAtual.forEach(cat => {
      if (!cat.ativo) return;
      cat.subitens.filter(s => s.selecionado).forEach(sub => {
        const baseEq = (cat.id === 'bovinos' || cat.id === 'linguica')
          ? adultos + criancas * 0.5
          : totalEq;
        const qtdG   = sub.manual != null ? sub.manual * 1000 : baseEq * sub.qtdPorPessoa;
        const qtdKg  = qtdG / 1000;
        const custo  = qtdKg * sub.preco;
        itensCarne.push({
          id: sub.id, emoji: cat.emoji, label: sub.label,
          qtdCalculada: qtdG, qtdDisplay: `${qtdKg.toFixed(1)} kg`, custo,
        });
      });
    });

    const itensSimples = simplesAtual.filter(i => i.ativo).map(item => {
      const qtd = item.qtdPorPessoa * totalEq;
      let qtdDisplay = '';
      if (item.unidade === 'g')         qtdDisplay = qtd >= 1000 ? `${(qtd/1000).toFixed(1)} kg` : `${Math.ceil(qtd)} g`;
      else if (item.unidade === 'L')    qtdDisplay = `${qtd.toFixed(1)} L`;
      else if (item.unidade === 'lata') qtdDisplay = `${Math.ceil(qtd)} latas`;
      else if (item.unidade === 'pct')  qtdDisplay = `${Math.ceil(qtd)} pct`;
      else qtdDisplay = `${Math.ceil(qtd)} ${item.unidade}`;
      let custo = 0;
      if (item.unidade === 'g') custo = (qtd / 1000) * item.preco;
      else if (item.unidade === 'L') custo = qtd * item.preco;
      else custo = Math.ceil(qtd) * item.preco;
      return { ...item, qtdCalculada: qtd, qtdDisplay, custo };
    });

    const todosItens    = [...itensCarne, ...itensSimples];
    const custoTotal    = todosItens.reduce((s, i) => s + i.custo, 0);
    const verbaNumerica = parseFloat(verba.replace(',', '.')) || 0;
    const saldo         = verbaNumerica - custoTotal;

    const res: ResultadoCalculo = {
      total, adultos, criancas, vegetarianos,
      itens: todosItens,
      custoEstimado: custoTotal.toFixed(2),
      verba: verbaNumerica.toFixed(2),
      saldo: saldo.toFixed(2),
      verbaDefined: verbaNumerica > 0,
      rateio: verbaNumerica > 0
        ? (verbaNumerica / total).toFixed(2)
        : (custoTotal / total).toFixed(2),
    };

    salvarNoHistorico(res, nomeEvento);
    setResultado(res);
    
  
    setChat([]);
    gerarDicasAutomaticas(res);
    
    navegarPara('resultado');
  };

  const resetar = () => {
    setNomeEvento(''); setVerba('');
    setConvidados([]); setCategorias([]);
    setCardapioSimples(CARDAPIO_DEFAULT.filter(i => !['carne', 'frango', 'linguica'].includes(i.id)));
    setResultado(null);
    

    setChat([]);
    setMensagem('');
    
    navegarPara('home');
  };


  if (!splashVista) {
    return <SplashAnimadaScreen onFim={() => setSplashVista(true)} />;
  }


  const renderTela = () => {
    switch (tela) {
      case 'home':
        return (
          <HomeScreen
            historico={historico}
            onAvancar={(nome, v, d) => { setNomeEvento(nome); setVerba(v); setDataEvento(d); navegarPara('convidados'); }}
            onHistorico={() => navegarPara('historico')}
          />
        );
      case 'convidados':
        return (
          <ConvidadosScreen
            nomeEvento={nomeEvento}
            convidadosIniciais={convidados}
            onVoltar={() => navegarPara('home')}
            onAvancar={(lista) => { setConvidados(lista); navegarPara('cardapio'); }}
          />
        );
      case 'cardapio':
        return (
          <CardapioScreen
            convidados={convidados}
            categoriasIniciais={categorias}
            cardapioSimplesInicial={cardapioSimples}
            onVoltar={() => navegarPara('convidados')}
            onCalcular={calcular}
          />
        );
      case 'resultado':
        return resultado ? (
          <ResultadoScreen
            nomeEvento={nomeEvento}
            dataEvento={dataEvento}
            convidados={convidados}
            resultado={resultado}
            onEditarCardapio={() => navegarPara('cardapio')}
            onNovoChurras={resetar}
       
            chat={chat}
            mensagem={mensagem}
            setMensagem={setMensagem}
            enviarChat={enviarChat}
            digitando={digitando}
            dots={dots}
          />
        ) : null;
      case 'historico':
        return (
          <HistoricoScreen
            historico={historico}
            onVoltar={() => navegarPara('home')}
            onLimpar={limparHistorico}
            onAtualizarHistorico={setHistorico}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.screen, { transform: [{ translateX: slideAnim }] }]}>
        {renderTela()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  screen:    { flex: 1 },
});