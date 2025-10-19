# Catálogo Virtual - Dona Cesta

Este projeto implementa um catálogo virtual completo utilizando HTML, CSS e JavaScript puro, conforme os requisitos de responsividade, filtros e funcionalidade de carrinho de compras (Pedido por WhatsApp).

## Como Executar

1.  Salve todos os arquivos nas pastas indicadas acima.
2.  Abra o arquivo `index.html` diretamente no seu navegador.
3.  Para visualizar corretamente, adicione as imagens na pasta `/images` ou mantenha o código de fallback para placeholders.

## Funcionalidades Implementadas

- **Responsividade:** Layout totalmente adaptável para mobile, tablet e desktop.
- **Destaques:** Seção de produtos em destaque no topo da página.
- **Filtros Avançados:** Busca por texto, filtro por categoria e faixa de preço, com indicadores visuais (badges/chips) de filtros ativos.
- **Carrinho de Compras:** Possibilidade de adicionar múltiplos itens ao carrinho e enviar um pedido resumido para o WhatsApp.
- **Animações:** Transições suaves e animação de entrada com fade-in e translate nos cards.

## Correção do products.js (Linhas 218 e 227)

A versão anterior do `products.js` possuía uma falha de sintaxe JavaScript que normalmente se manifesta ao final de grandes arrays, como o `products`.

**Changelog:**

1.  **Linhas 218/227 (Aproximadas):** O erro era, provavelmente, um problema estrutural no fechamento do array, como um ponto-e-vírgula (`;`) faltante ou um caractere extra logo após o último objeto, ou ainda, uma vírgula extra após o último objeto que causava erros em navegadores mais antigos.
2.  **Ação:** Garantido o fechamento correto do último objeto do array (produto de `id: 24`), seguido pelo fechamento do array ( `]` ) e o ponto-e-vírgula ( `; `), conforme:
    ```javascript
    // ... [dados do produto 24]
    {
        // ...
        isFeatured: true
    } // Não há vírgula aqui
    ]; // Fechamento do array seguido por ponto e vírgula.
    ```
3.  **Teste de Correção (Snippet JS Console):**
    ```javascript
    // No console do navegador após carregar main.js e products.js:
    console.log(products[products.length - 1].name); // Saída: "Cesta Old Parr (Whisky)"
    // Se o array fosse carregado incorretamente, esta linha falharia.
    ```

# Catálogo Virtual - Dona Cesta | Flores e Presentes

Um catálogo virtual _single-page_ (SPA) interativo e responsivo, focado em visualização de produtos, filtragem e checkout rápido e simplificado via WhatsApp.

---

## 🛍️ 1. Propósito e Principais Funcionalidades

O objetivo deste projeto é fornecer uma vitrine digital eficiente para a loja **Dona Cesta**, permitindo que os clientes naveguem pelos produtos e montem um pedido de forma intuitiva, finalizando-o diretamente com o vendedor através do WhatsApp.

### ✨ Funcionalidades

- **Listagem Dinâmica:** Exibição do catálogo completo de produtos e uma seção de Destaques.
- **Filtros e Busca:** Busca em tempo real por nome/tags e filtragem por categoria e faixa de preço.
- **Sistema de Carrinho:** Adição, remoção e ajuste de quantidade de itens com persistência via **Local Storage**.
- **Modais Interativos:**

  - Modal do Carrinho de Compras.
  - Modal de Detalhes do Produto (com imagem expandida e informações adicionais).
  - LightBox para visualização de imagens em tela cheia.

- **Checkout via WhatsApp:** Geração automática de uma mensagem formatada com produtos e valor total, enviada diretamente para o número configurado.
- **Design Responsivo:** Layout adaptável a dispositivos móveis e desktops.

---

## 🧩 2. Tecnologias Utilizadas

O projeto é construído apenas com tecnologias _front-end_ puras, sem frameworks complexos.

| Tecnologia                  | Descrição                                                                              |
| :-------------------------- | :------------------------------------------------------------------------------------- |
| **HTML5**                   | Estrutura semântica do catálogo e modais.                                              |
| **CSS3**                    | Estilização completa, incluindo variáveis e design responsivo (_Mobile-First_).        |
| **JavaScript (Vanilla JS)** | Lógica para filtros, renderização, carrinho (Local Storage) e integração com WhatsApp. |
| **Font Awesome**            | Ícones (v6) para botões e ações.                                                       |
| **Google Fonts**            | Fonte “Poppins” para o design moderno e limpo.                                         |

---

## 📁 3. Estrutura de Pastas e Arquivos

```
.
├── css/
│   └── style.css          # Estilos principais do layout e componentes.
├── images/
│   ├── logo.png           # Logomarca da loja.
│   └── (produtos)         # Diretório com imagens dos produtos.
├── index.html             # Estrutura principal do catálogo.
├── main.js                # Lógica do sistema (filtros, carrinho, modais, WhatsApp).
└── products.js            # Base local de produtos (Array JavaScript).
```

---

## ⚙️ 4. Instalação e Execução

O projeto não requer instalação de dependências nem compilação.

1. **Clone o repositório**:

   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   ```

2. **Abra o arquivo `index.html`** diretamente no navegador.

💡 _Dica:_ Para evitar problemas de cache ou carregamento de imagens, use um servidor local simples (ex: extensão **Live Server** no VS Code).

---

## 🔧 5. Configurações Adicionais

### 5.1. Número de WhatsApp

O número de contato deve ser configurado no arquivo `main.js`.

```javascript
// --- CONFIGURAÇÃO ---
// Substitua pelo número real da loja no formato internacional:
const WHATSAPP_NUMBER = "5599999999999"; // Exemplo
const URL_BASE = "exemplo.com.br";
```

**Formato esperado:** `Código do país + DDD + número`
Exemplo: `5599999999999`

---

### 5.2. Gerenciamento de Produtos

Os produtos estão definidos no array `products` do arquivo `products.js`.

- Para **adicionar, editar ou remover** produtos, edite o array diretamente.
- O campo `image` deve corresponder ao nome do arquivo na pasta `images/`.
- Produtos com `isFeatured: true` aparecem na seção de _Destaques_.

```javascript
{
  id: 1,
  name: "Cesta Romântica",
  price: 129.90,
  category: "Presentes",
  image: "cesta_romantica.png",
  description: "Cesta com flores e chocolates.",
  isFeatured: true
}
```

---

## 💾 6. Persistência de Dados

O conteúdo do carrinho é automaticamente salvo no **Local Storage**.
Mesmo ao atualizar ou fechar o navegador, os produtos adicionados permanecem armazenados.

---

## 🖼️ 7. Personalização

- **Logo:** Substitua `images/logo.png` pela logo da loja.
- **Ícone do Navegador (Favicon):** Configure no `index.html`:

  ```html
  <link rel="icon" type="image/png" href="images/logo.png" />
  ```

---

## 🧠 8. Melhorias Futuras (Sugestões)

- Adicionar integração com PIX e checkout alternativo.
- Implementar painel administrativo simples para gerenciar produtos.
- Otimizar SEO e metadados sociais (Open Graph).

---

## 📄 Licença

Este projeto é de uso livre e pode ser adaptado para fins comerciais e pessoais, desde que mantidos os créditos originais.
**Desenvolvido por [Dailson Costa](https://github.com/DMouraCosta)** 💻
