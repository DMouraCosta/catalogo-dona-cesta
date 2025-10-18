/**
 * Arquivo: products.js
 * Descrição: Simula um banco de dados local com os produtos extraídos do PDF.
 * A estrutura do objeto inclui a tag 'isFeatured' para a seção Destaques.
 */
const products = [
  // --- Rosas Arrumadas ---
  {
    id: 1,
    name: "Rosa Arrumada Vermelha",
    category: "Rosas Arrumadas",
    description:
      "1 rosa, 2 complementos (folhagens), embalagem plástica, laço, cartão personalizado.",
    price: 34.9,
    image: "rosa_arrumada_vermelha.png",
    tags: "vermelha simples cartão",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Rosa Arrumada",
    category: "Rosas Arrumadas",
    description:
      "1 rosa (branca, amarela ou rosa), 2 complementos (folhagens), embalagem plástica, laço.",
    price: 19.9,
    image: "rosa_arrumada_simples.png",
    tags: "branca amarela rosa simples",
    isFeatured: false,
  },
  {
    id: 3,
    name: "Rosa Arrumada com Chocolate",
    category: "Rosas Arrumadas",
    description: "1 rosa, 2 complementos, 1 bombom, embalagem com laço.",
    price: 24.9,
    image: "rosa_arrumada_choc_simples.png",
    tags: "chocolate bombom",
    isFeatured: false,
  },
  {
    id: 4,
    name: "Girassol Arrumado",
    category: "Rosas Arrumadas",
    description:
      "1 Girassol, 3 Complementos (folhagens), Embalagem de juta, Laço. Dê flores antes que vire pedido de desculpas!",
    price: 69.9,
    image: "girassol_arrumado.png",
    tags: "girassol juta",
    isFeatured: false,
  },
  {
    id: 5,
    name: "Kit Rosa Arrumada com Ferrero",
    category: "Rosas Arrumadas",
    description:
      "1 Rosa vermelha arrumada, 1 Ferrero Rocher com 8 UND. Deixe o dia de alguém mais leve.",
    price: 94.9,
    image: "kit_rosa_ferrerro_8.png",
    tags: "kit ferrero rocher chocolate",
    isFeatured: true,
  },

  // --- Buquês ---
  {
    id: 6,
    name: "Mini Buquê 2 Rosas",
    category: "Buquês",
    description: "2 rosas naturais, 4 complementos, 1 embalagem, 1 laço.",
    price: 89.9,
    image: "mini_buque_2_rosas.png",
    tags: "mini presente",
    isFeatured: false,
  },
  {
    id: 7,
    name: "Mini Buquê 3 Rosas",
    category: "Buquês",
    description: "3 rosas naturais, 4 complementos, 1 embalagem, 1 laço.",
    price: 99.9,
    image: "mini_buque_3_rosas.png",
    tags: "mini presente",
    isFeatured: false,
  },
  {
    id: 8,
    name: "Buquê de Girassóis Grande",
    category: "Buquês",
    description:
      "4 girassóis, 4 complementos (folhagens), 4 Ferrero Rocher, 1 embalagem com laço.",
    price: 349.9,
    image: "buque_girassol_grande.png",
    tags: "girassol grande luxo chocolate",
    isFeatured: true,
  },
  {
    id: 9,
    name: "Mini Buquê 2 Rosas e Ferrero 12un + Cartão",
    category: "Buquês",
    description:
      "2 Rosas vermelhas, 3 Complementos, Embalagem com juta, Laço, 1 Ferrero Rocher c/ 12 unidades, 1 cartão personalizado. Flores que encantam.",
    price: 184.9,
    image: "mini_buque_2_rosas_juta_ferrerro_12.png",
    tags: "juta vermelha chocolate",
    isFeatured: false,
  },
  {
    id: 10,
    name: "Buquê Grande 5 Rosas",
    category: "Buquês",
    description:
      "5 rosas, 4 complementos, 1 embalagem, 1 laço, 1 cartão personalizado. Um gesto, mil sentimentos.",
    price: 149.9,
    image: "buque_grande_5_rosas_simples.png",
    tags: "grande presente",
    isFeatured: false,
  },
  {
    id: 11,
    name: "Buquê Grande 8 Rosas Azuis e Girassóis (Pelúcia)",
    category: "Buquês",
    description:
      "8 rosas azuis, 4 girassóis, 1 complemento, 1 embalagem, 1 cartão, 1 chaveiro de pelúcia.",
    price: 349.9,
    image: "buque_8_rosas_azul_girassol_pelucia.png",
    tags: "azul girassol pelúcia luxo",
    isFeatured: false,
  },
  {
    id: 12,
    name: "Buquê Grande 10 Rosas Luxo",
    category: "Buquês",
    description:
      "12 rosas vermelhas, 4 complementos (folhagens), 1 borboleta dourada, 1 embalagem com laço, 1 cartão personalizado.",
    price: 549.9,
    image: "buque_grande_10_rosas_luxo.png",
    tags: "luxo grande vermelho",
    isFeatured: true,
  },

  // --- Arranjos ---
  {
    id: 13,
    name: "Mini Arranjo 1 Rosa",
    category: "Arranjos",
    description: "1 arranjo natural, 1 embalagem, 1 laço.",
    price: 69.9,
    image: "mini_arranjo_1_rosa.png",
    tags: "mini vaso simples",
    isFeatured: false,
  },
  {
    id: 14,
    name: "Arranjo com Rosas e Girassol",
    category: "Arranjos",
    description:
      "1 arranjo natural, 1 embalagem, 1 laço, 1 cartão personalizado. Surpreenda seu amor 🥰.",
    price: 144.9,
    image: "arranjo_rosas_girassol.png",
    tags: "girassol cartão",
    isFeatured: false,
  },
  {
    id: 15,
    name: "Arranjo com 5 Rosas e Pelúcia",
    category: "Arranjos",
    description:
      "1 arranjo natural, 1 embalagem, 1 laço, 1 cartão personalizado, 1 chaveiro de pelúcia.",
    price: 169.9,
    image: "arranjo_5_rosas_pelucia.png",
    tags: "pelúcia presente",
    isFeatured: false,
  },
  {
    id: 16,
    name: "Arranjo Rústico com Ferrero",
    category: "Arranjos",
    description:
      "1 cesta de madeira, 5 rosas, 3 complementos, 1 borboleta dourada, 1 laço, 1 Ferrero Rocher com 4 unidades. Um gesto, mil sentimentos.",
    price: 329.9,
    image: "arranjo_rustico.png",
    tags: "rústico chocolate",
    isFeatured: false,
  },
  {
    id: 17,
    name: "Arranjo na Caneca",
    category: "Arranjos",
    description:
      "1 caneca, 1 chaveiro de pelúcia, 3 unid de Ferrero Rocher, 1 arranjo natural. O amor mora nos detalhes.",
    price: 139.9,
    image: "arranjo_na_caneca.png",
    tags: "caneca pelúcia chocolate",
    isFeatured: false,
  },

  // --- Cestas e Box/Caixotes ---
  {
    id: 18,
    name: "Box Romântico (Premium)",
    category: "Cestas e Box",
    description:
      "15 rosas vermelhas, 3 complementos, 1 caixa preta, 1 laço, 6 Ferrero Rocher em acrílico, 1 chaveiro de pelúcia, 1 cartão personalizado.",
    price: 549.9,
    image: "box_romantico.png",
    tags: "box luxo chocolate pelúcia",
    isFeatured: true,
  },
  {
    id: 19,
    name: "Cesta Encantos Nutella",
    category: "Cestas e Box",
    description:
      "1 cesta de madeira pequena, 1 pelúcia pequena, 1 Nutella 140g, 1 barra de Nutella, 1 embalagem plástica, 1 laço. Encantos que falam por você.",
    price: 119.9,
    image: "cesta_encantos_nutella.png",
    tags: "cesta nutella chocolate",
    isFeatured: false,
  },
  {
    id: 20,
    name: "Caixote com Pelúcia e Ferrero",
    category: "Cestas e Box",
    description:
      "1 caixote médio de madeira, 1 pelúcia média, 1 Ferrero Rocher com 4 unidades, 1 embalagem plástica, 1 laço. Encantos que falam por você.",
    price: 199.9,
    image: "caixote_pelucia_ferrerro_4.png",
    tags: "caixote pelúcia chocolate",
    isFeatured: false,
  },
  {
    id: 21,
    name: "Cesta Heineken",
    category: "Cestas e Box",
    description:
      "1 cesta de madeira média, 1 pelúcia média, 2 cervejas Heineken, 1 Nutella 140g, 1 batata Pringles, 1 embalagem plástica e laço. Presentes que tocam o coração.",
    price: 249.9,
    image: "cesta_heineken.png",
    tags: "cesta cerveja masculino nutella",
    isFeatured: false,
  },
  {
    id: 22,
    name: "Cesta Clássica (Vinho/Pelúcia/Nutella)",
    category: "Cestas e Box",
    description:
      "1 caixote médio, 2 taças, 1 vinho SAN martin, 3 trufas cacau show, 1 Ferrero Rocher, 1 pelúcia média, 1 Nutella 140g, 1 embalagem com laço.",
    price: 449.9,
    image: "cesta_classica.png",
    tags: "cesta vinho luxo chocolate",
    isFeatured: false,
  },
  {
    id: 23,
    name: "Café da Manhã Completo",
    category: "Cestas e Box",
    description:
      "10 morangos, requeijão, biscoito, iogurte, bolo no pote, suco, salgados, rosca, pudim, caneca, uva, torrada, geleia e caixote médio.",
    price: 399.9,
    image: "cesta_cafe_completo.png",
    tags: "cesta café manhã comida",
    isFeatured: false,
  },
  {
    id: 24,
    name: "Cesta Old Parr (Whisky)",
    category: "Cestas e Box",
    description:
      "1 Old Parr 12 anos, 1 Amendoim japonês, 2 Red bull, 1 Batata Sensações, 1 Batata Pringles, 1 Ferrero Rocher c/ 8 un..",
    price: 599.9,
    image: "cesta_old_parr.png",
    tags: "cesta whisky bebida masculino luxo",
    isFeatured: true,
  },
  {
    id: 25,
    name: "Rosa Arrumada com Chocolate + Cartão",
    category: "Rosas Arrumadas",
    description:
      "1 rosa, 2 complementos, 1 bombom, 1 Cartão personalizado, embalagem com laço.",
    price: 54.9,
    image: "rosa_arrumada_choc_simples_cartao.png",
    tags: "chocolate bombom",
    isFeatured: false,
  },
];
