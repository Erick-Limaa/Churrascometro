import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import ConvidadosScreen from '../screens/ConvidadosScreen';
import CardapioScreen from '../screens/CardapioScreen';
import ResultadoScreen from '../screens/ResultadoScreen';
import HistoricoScreen from '../screens/HistoricoScreen';

import {
  Convidado, ItemCardapio, Churras, ResultadoCalculo,
} from '../constants';

type Tela = 'home' | 'convidados' | 'cardapio' | 'resultado' | 'historico';

const STORAGE_KEY = '@churrascomentro_historico';

export default function Index() {
  const [tela, setTela] = useState<Tela>('home');
  const [nomeEvento, setNomeEvento] = useState('');
  const [verba, setVerba] = useState('');
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [cardapio, setCardapio] = useState<ItemCardapio[]>([]);
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);
  const [historico, setHistorico] = useState<Churras[]>([]);

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
        id: Date.now().toString(),
        nome,
        data: new Date().toLocaleDateString('pt-BR'),
        totalPessoas: res.total,
        adultos: res.adultos,
        criancas: res.criancas,
        vegetarianos: res.vegetarianos,
        custoEstimado: res.custoEstimado,
        verba: res.verba,
        verbaDefined: res.verbaDefined,
        saldo: res.saldo,
        rateio: res.rateio,
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

  // ── Calcular ─────────────────────────────────────────────────────────────
  const calcular = (cardapioAtual: ItemCardapio[]) => {
    setCardapio(cardapioAtual);

    const adultos      = convidados.filter(c => c.categoria === 'adulto').length;
    const criancas     = convidados.filter(c => c.categoria === 'crianca').length;
    const vegetarianos = convidados.filter(c => c.categoria === 'vegetariano').length;
    const totalEquivalente = adultos * 1.0 + criancas * 0.5 + vegetarianos * 1.0;
    const total = convidados.length;

    const itensCalculados = cardapioAtual.filter(i => i.ativo).map(item => {
      let qtd: number;
      if (item.manual != null) {
        qtd = item.manual;
      } else {
        const base = ['carne', 'linguica'].includes(item.id)
          ? (adultos + criancas * 0.5) * item.qtdPorPessoa
          : totalEquivalente * item.qtdPorPessoa;
        qtd = base;
      }

      let qtdDisplay = '';
      if (item.unidade === 'g')    qtdDisplay = qtd >= 1000 ? `${(qtd / 1000).toFixed(1)} kg` : `${Math.ceil(qtd)} g`;
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

    const custoTotal    = itensCalculados.reduce((s, i) => s + i.custo, 0);
    const verbaNumerica = parseFloat(verba.replace(',', '.')) || 0;
    const saldo         = verbaNumerica - custoTotal;

    const res: ResultadoCalculo = {
      total, adultos, criancas, vegetarianos,
      itens: itensCalculados,
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
    setTela('resultado');
  };

  const resetar = () => {
    setNomeEvento('');
    setVerba('');
    setConvidados([]);
    setCardapio([]);
    setResultado(null);
    setTela('home');
  };

  // ── Roteador ──────────────────────────────────────────────────────────────
  switch (tela) {
    case 'home':
      return (
        <HomeScreen
          historico={historico}
          onAvancar={(nome, v) => { setNomeEvento(nome); setVerba(v); setTela('convidados'); }}
          onHistorico={() => setTela('historico')}
        />
      );

    case 'convidados':
      return (
        <ConvidadosScreen
          nomeEvento={nomeEvento}
          onVoltar={() => setTela('home')}
          onAvancar={(lista) => { setConvidados(lista); setTela('cardapio'); }}
        />
      );

    case 'cardapio':
      return (
        <CardapioScreen
          convidados={convidados}
          onVoltar={() => setTela('convidados')}
          onCalcular={calcular}
        />
      );

    case 'resultado':
      return resultado ? (
        <ResultadoScreen
          nomeEvento={nomeEvento}
          convidados={convidados}
          resultado={resultado}
          onEditarCardapio={() => setTela('cardapio')}
          onNovoChurras={resetar}
        />
      ) : null;

    case 'historico':
      return (
        <HistoricoScreen
          historico={historico}
          onVoltar={() => setTela('home')}
          onLimpar={limparHistorico}
        />
      );

    default:
      return null;
  }
}