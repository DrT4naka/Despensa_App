# 🏠 Pantry App

Aplicação de gestão de despensa doméstica com sincronização familiar, plano de refeições e chef IA.

## Funcionalidades

- **Despensa sincronizada** — todos os membros do agregado vêem o mesmo stock
- **5 idiomas** — Português, Espanhol, Francês, Alemão e Inglês
- **Periodicidade inteligente** — aviso quando produtos estão a acabar com base no consumo estimado
- **Validade** — registo de validade em dias ou meses, com lembretes visuais
- **Catálogo de produtos** — 80+ produtos pré-definidos com emojis adequados
- **Produtos personalizados** — adiciona produtos novos com emoji automático (varinha mágica 🪄)
- **Lista de compras** — produtos passam automaticamente para a lista quando acabam, com botão "Comprei Tudo"
- **Plano semanal de refeições** — com opções Manual, Refeição Fora e Chef IA
- **Chef IA** — gera receitas com base nos produtos da despensa, ajustando quantidades ao nº de pessoas
- **Restrições alimentares** — recolhe restrições de cada membro no registo

## Tecnologias

- **React 18** + **Vite 5** (build tool rápido)
- **Firebase** (preparado — ativar com credenciais)
- **localStorage** para persistência local
- **CSS puro** (sem frameworks — design mobile-first escuro)

## Instalação e Arranque

```bash
# Instalar dependências
npm install

# Arrancar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

Abre **http://localhost:3000** no browser.

## Estrutura do Projeto

```
src/
├── App.jsx                    # Componente principal (routing & state)
├── main.jsx                   # Ponto de entrada React
├── styles/
│   └── index.css              # Estilos globais
├── components/
│   ├── NavBtn.jsx             # Botão de navegação
│   └── modlas/                # Modais
│       ├── AddCategoryModal.jsx
│       ├── AddProductModal.jsx
│       ├── ConfirmModal.jsx
│       └── LogoutModal.jsx
├── data/
│   ├── catalog.js             # Catálogo de 80+ produtos
│   ├── languages.js           # Traduções (PT, ES, EN, FR, DE)
│   └── smartMappings.js       # Mapeamento inteligente de emojis
├── firebase/
│   ├── client.js              # Config Firebase (preparado)
│   └── path.js                # Caminhos da base de dados
├── hooks/                     # (preparado para custom hooks)
├── screens/
│   ├── LogicScreen.jsx        # Login / criar / entrar despensa
│   ├── DashboardScreen.jsx    # Visão da despensa (stock)
│   ├── ShopScreen.jsx         # Catálogo para adicionar produtos
│   ├── ListScreen.jsx         # Lista de compras
│   ├── PlanScreen.jsx         # Plano semanal de refeições
│   └── CookScreen.jsx         # Visualização de receita
├── services/
│   ├── chefService.js         # Gerador de receitas (Chef IA)
│   └── pantryService.js       # CRUD despensa (localStorage)
└── utils/
    ├── date.js                # Utilitários de data
    ├── id.js                  # Gerador de IDs e códigos
    └── units.js               # Formatação de quantidades
```

## Como Contribuir

1. Faz fork do repositório
2. Cria um branch para a tua feature (`git checkout -b feature/nova-feature`)
3. Faz commit das mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faz push para o branch (`git push origin feature/nova-feature`)
5. Abre um Pull Request

## Próximos Passos

Ver ficheiro [TODO.md](TODO.md) para a lista completa de tarefas.
