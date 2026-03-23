export type Categoria = 'adulto' | 'crianca' | 'vegetariano';

export type Convidado = {
  id: string;
  nome: string;
  categoria: Categoria;
};

export type ItemCardapio = {
  id: string;
  emoji: string;
  label: string;
  qtdPorPessoa: number;
  unidade: string;
  preco: number;
  precoUnidade: string;
  ativo: boolean;
  manual?: number | null;
};

export type Churras = {
  id: string;
  nome: string;
  data: string;
  totalPessoas: number;
  adultos: number;
  criancas: number;
  vegetarianos: number;
  custoEstimado: string;
  verba: string;
  verbaDefined: boolean;
  saldo: string;
  rateio: string;
  itens: any[];
  comprados: Record<string, boolean>;
};

export type ResultadoCalculo = {
  total: number;
  adultos: number;
  criancas: number;
  vegetarianos: number;
  itens: any[];
  custoEstimado: string;
  verba: string;
  saldo: string;
  verbaDefined: boolean;
  rateio: string;
};

export const C = {
  brasa: '#e85d04',
  brasa2: '#f48c06',
  carvao: '#1a0a00',
  fumo: '#2d1a0a',
  fumo2: '#3d2510',
  cinza: '#c9a882',
  branco: '#fff4e6',
  verde: '#81c784',
  vermelho: '#e57373',
  azul: '#64b5f6',
};

export const CAT_CONFIG: Record<Categoria, { label: string; emoji: string; cor: string; mult: number }> = {
  adulto:      { label: 'Adulto',      emoji: '🧑', cor: C.brasa, mult: 1.0 },
  crianca:     { label: 'Criança',     emoji: '👧', cor: C.azul,  mult: 0.5 },
  vegetariano: { label: 'Vegetariano', emoji: '🥗', cor: C.verde, mult: 1.0 },
};

export const CARDAPIO_DEFAULT: ItemCardapio[] = [
  { id: 'carne',    emoji: '🥩', label: 'Carne bovina',  qtdPorPessoa: 400,  unidade: 'g',    preco: 45,  precoUnidade: 'kg',   ativo: true, manual: null },
  { id: 'frango',   emoji: '🍗', label: 'Frango',        qtdPorPessoa: 200,  unidade: 'g',    preco: 18,  precoUnidade: 'kg',   ativo: true, manual: null },
  { id: 'linguica', emoji: '🌭', label: 'Linguiça',      qtdPorPessoa: 100,  unidade: 'g',    preco: 22,  precoUnidade: 'kg',   ativo: true, manual: null },
  { id: 'pao',      emoji: '🧄', label: 'Pão de alho',   qtdPorPessoa: 2,    unidade: 'un',   preco: 3,   precoUnidade: 'un',   ativo: true, manual: null },
  { id: 'cerveja',  emoji: '🍺', label: 'Cerveja 350ml', qtdPorPessoa: 3,    unidade: 'lata', preco: 5,   precoUnidade: 'un',   ativo: true, manual: null },
  { id: 'refri',    emoji: '🥤', label: 'Refrigerante',  qtdPorPessoa: 1.5,  unidade: 'L',    preco: 8,   precoUnidade: '2L',   ativo: true, manual: null },
  { id: 'agua',     emoji: '💧', label: 'Água mineral',  qtdPorPessoa: 1,    unidade: 'L',    preco: 3,   precoUnidade: '1.5L', ativo: true, manual: null },
  { id: 'carvao',   emoji: '🪨', label: 'Carvão',        qtdPorPessoa: 0.5,  unidade: 'kg',   preco: 28,  precoUnidade: '5kg',  ativo: true, manual: null },
  { id: 'sal',      emoji: '🧂', label: 'Sal grosso',    qtdPorPessoa: 0.01, unidade: 'pct',  preco: 2.5, precoUnidade: 'pct',  ativo: true, manual: null },
];