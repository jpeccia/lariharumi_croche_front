# Lari faz Crochê!

## Descrição

O site **Lari faz Crochê!** é uma aplicação desenvolvida para servir como catalogo e forma de contato para uma crocheteira, onde tem um visual fofo, simples e divertido.

## Tecnologias Utilizadas

- **Front-end**: React, TypeScript
- **Bibliotecas Utilizadas**: Lucide-react, Axios
- **Gerenciamento de Estado**: Zustand para gerenciar o estado de autenticação
- **UI/UX**: Tailwind CSS para a estilização

## Instalação

### Requisitos

- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/jpeccia/lariharumi_croche_front.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd lariharumi
   ```

3. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias, como URL do back-end, credenciais do banco de dados, etc.

5. Execute o projeto:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## Como Usar

### Acesso ao Sistema

1. **Cadastro e Login**: Registre uma conta via back-end, e use a rota de login para logar com o usuário administrador e acessar a devida rota.
2. **Edição e criação de categorias e produtos**: Na página de admin, voce pode criar/editar produtos e categorias.

### Funcionalidades Principais

- **Catalogo**: Exibição de categorias e produtos.
- **Cuidados**: Exibição de cuidados com as peças.
- **Doação**: Faça doação via QRCode de Pix.
- **Contato**: Entre em contato com a crocheteira.


## Estrutura de Pastas

```
leveling-life/
│
├── public/                # Arquivos públicos como imagens e ícones
├── src/                   # Código fonte do projeto
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/             # Páginas principais do projeto
│   ├── services/               # Arquivos de configuração e helpers
│   ├── store/             # Gerenciamento de estado global
│   ├── styles/             # Gerenciamento de estado global
│   ├── types/             # Gerenciamento de estado global
│   └── App.tsx            # Componente principal
│
├── .env                   # Variáveis de ambiente
├── package.json           # Configuração do projeto e dependências
└── README.md              # Documentação do projeto
```

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch com sua nova funcionalidade (`git checkout -b feature/novo-recurso`).
3. Faça commit das suas alterações (`git commit -m 'Add new feature'`).
4. Faça o push para a branch (`git push origin feature/novo-recurso`).
5. Crie um Pull Request.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

## Autor    

- **João Otávio Peccia** - [GitHub](https://github.com/jpeccia)

---