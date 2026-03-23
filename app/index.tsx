import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import ConvidadosScreen from '../screens/ConvidadosScreen';
import CardapioScreen, { CategoriaComSub } from '../screens/CardapioScreen';
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
        id: Date.now().toString(), nome,
        data: new Date().toLocaleDateString('pt-BR'),
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

  // ── Calcular ──────────────────────────────────────────────────────────────
  const calcular = (cardapioSimples: ItemCardapio[], categorias: CategoriaComSub[]) => {
    const adultos      = convidados.filter(c => c.categoria === 'adulto').length;
    const criancas     = convidados.filter(c => c.categoria === 'crianca').length;
    const vegetarianos = convidados.filter(c => c.categoria === 'vegetariano').length;
    const totalEq      = adultos * 1.0 + criancas * 0.5 + vegetarianos * 1.0;
    const total        = convidados.length;

    // ── Itens de carne com subitens ────────────────────────────────────────
    const itensCarne: any[] = [];
    categorias.forEach(cat => {
      if (!cat.ativo) return;
      cat.subitens.filter(s => s.selecionado).forEach(sub => {
        // vegetarianos não recebem bovinos e linguiça
        const baseEq = (cat.id === 'bovinos' || cat.id === 'linguica')
          ? adultos + criancas * 0.5
          : totalEq;

        const qtdG = sub.manual != null
          ? sub.manual * 1000
          : baseEq * sub.qtdPorPessoa;

        const qtdKg = qtdG / 1000;
        const custo = qtdKg * sub.preco;

        itensCarne.push({
          id: sub.id,
          emoji: cat.emoji,
          label: `${sub.label}`,
          qtdCalculada: qtdG,
          qtdDisplay: `${qtdKg.toFixed(1)} kg`,
          custo,
          categoria: cat.label,
        });
      });
    });

    // ── Itens simples ──────────────────────────────────────────────────────
    const itensSimples = cardapioSimples.filter(i => i.ativo).map(item => {
      const qtd = item.qtdPorPessoa * totalEq;
      let qtdDisplay = '';
      if (item.unidade === 'g')    qtdDisplay = qtd >= 1000 ? `${(qtd/1000).toFixed(1)} kg` : `${Math.ceil(qtd)} g`;
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

    const todosItens = [...itensCarne, ...itensSimples];
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
    setTela('resultado');
  };

  const resetar = () => {
    setNomeEvento(''); setVerba('');
    setConvidados([]); setResultado(null);
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
          onAtualizarHistorico={setHistorico}
        />
      );
    default:
      return null;
  }
}