# 🔥 Churrascômetro

Organizador de churrasco para Android feito com **React Native + Expo**.  
Calcula quantidades de comida, bebida, custo estimado, rateio por pessoa e muito mais.

---

## 📱 Funcionalidades

- **Categorias de convidados** — Adulto, Criança (50% da porção) e Vegetariano
- **Cardápio configurável** — Ative/desative itens, edite preços e quantidades manualmente
- **Cálculo inteligente** — Quantidades ajustadas por categoria de convidado
- **Financeiro completo** — Verba, custo estimado, saldo, barra de progresso e rateio por pessoa
- **Dicas do Mestre** — Dicas personalizadas baseadas no seu churras (verba, categorias, tamanho do grupo)
- **Histórico** — Salva automaticamente os últimos 20 churras com todos os detalhes
- **Compartilhar** — Envia lista completa formatada via WhatsApp ou qualquer app
- **Animações** — Transições suaves entre telas
- **Vibração** — Feedback tátil ao adicionar/remover convidados

---

## 📁 Estrutura do Projeto

```
app/
  index.tsx           ← Roteador principal de telas
  _layout.tsx         ← Layout do Expo Router (headerShown: false)

screens/
  HomeScreen.tsx      ← Tela inicial (nome do evento + verba)
  ConvidadosScreen.tsx← Lista de convidados com categorias
  CardapioScreen.tsx  ← Configuração de itens, preços e quantidades
  ResultadoScreen.tsx ← Resultado completo com dicas
  HistoricoScreen.tsx ← Histórico de churras salvos

components/
  TopBar.tsx          ← Barra de navegação reutilizável

constants/
  index.ts            ← Tipos, cores, cardápio padrão e configurações
  styles.ts           ← Estilos compartilhados entre telas
```

---

## 🚀 Como rodar

### Pré-requisitos
- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Erick-Limaa/Churrascometro.git
cd churrascometro

# 2. Instale as dependências
npm install

# 3. Instale o AsyncStorage
npx expo install @react-native-async-storage/async-storage

# 4. Inicie o projeto
npx expo start
```

Escaneie o QR Code com o app **Expo Go** (Android/iOS) e pronto! 🎉

---

## 📡 Compartilhar com amigos (sem mesma rede Wi-Fi)

```bash
npx expo start --tunnel
```

Gera um QR Code público acessível de qualquer rede.  
Se pedir autenticação do ngrok, crie uma conta grátis em [ngrok.com](https://ngrok.com) e rode:

```bash
npx ngrok authtoken SEU_TOKEN_AQUI
npx expo start --tunnel
```

---

## 🧮 Tabela de cálculo por pessoa

| Item | Quantidade | Base de cálculo |
|------|-----------|-----------------|
| 🥩 Carne bovina | 400g | Adultos + Crianças (50%) |
| 🍗 Frango | 200g | Todos |
| 🌭 Linguiça | 100g | Adultos + Crianças (50%) |
| 🧄 Pão de alho | 2 un | Todos |
| 🍺 Cerveja 350ml | 3 latas | Todos |
| 🥤 Refrigerante | 1,5L | Todos |
| 💧 Água mineral | 1L | Todos |
| 🪨 Carvão | 0,5kg | Todos |
| 🧂 Sal grosso | fixo | — |

> Vegetarianos não recebem carne bovina nem linguiça no cálculo.  
> Todos os valores são editáveis dentro do app.

---

## 🗂️ Histórico

O app salva automaticamente cada churras calculado com:
- Nome e data
- Total de pessoas por categoria
- Custo estimado, verba, saldo e rateio por pessoa

Os dados ficam salvos no dispositivo via `AsyncStorage` (sem necessidade de internet).

---

## 🛠️ Personalização

Edite as constantes em `constants/index.ts`:

```ts
export const CARDAPIO_DEFAULT: ItemCardapio[] = [
  { id: 'carne', emoji: '🥩', label: 'Carne bovina',
    qtdPorPessoa: 400, unidade: 'g', preco: 45, ... },
  // adicione ou remova itens aqui
];
```

---

## 📦 Dependências principais

| Pacote | Uso |
|--------|-----|
| `expo` | Framework principal |
| `react-native` | Base do app |
| `expo-router` | Navegação entre telas |
| `@react-native-async-storage/async-storage` | Salvar histórico no dispositivo |

---

## 📄 Licença

MIT — use à vontade! 🔥
