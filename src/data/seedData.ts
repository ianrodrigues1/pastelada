import {
  Category,
  OptionGroup,
  PastelSizeConfig,
  Product,
  StoreSettings,
  DeliveryZone,
  User,
  Coupon,
  IntegrationConfig
} from '../types';

export const INITIAL_SIZES: PastelSizeConfig[] = [
  {
    id: 'tubete',
    name: 'Tubete',
    dimensions: '30 x 6 cm',
    fillingWeight: '150 g',
    description: 'Pastel de 30 cm por 6 cm, recheado de ponta a ponta com 150 g de recheio crocante e sequinho.',
    minPrice: 15.0
  },
  {
    id: 'convencional',
    name: 'Convencional',
    dimensions: '30 x 10 cm',
    fillingWeight: '240 g',
    description: 'Pastel tradicional de 30 cm por 10 cm, recheado do começo ao fim com 240 g de puro sabor.',
    minPrice: 23.5
  },
  {
    id: 'tubetinho',
    name: 'Tubetinho',
    dimensions: '18 x 5 cm',
    fillingWeight: '90 g',
    description: 'Tamanho ideal para a sobremesa, crocante e recheado na medida certa.',
    minPrice: 16.0
  },
  {
    id: 'especial',
    name: 'Especial Família',
    dimensions: '30 x 20 cm',
    fillingWeight: '500 g',
    description: 'Gigante para compartilhar! Pastel de 30x20 cm com 2 complementos e 2 adicionais inclusos.',
    minPrice: 64.9
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-do-seu-jeito',
    name: 'Do Seu Jeito',
    slug: 'do-seu-jeito',
    description: 'Monte seu pastel personalizado escolhendo tamanho, massa, recheio base, complementos e adicionais.',
    displayOrder: 1,
    active: true
  },
  {
    id: 'cat-tradicionais',
    name: 'Pastéis Tradicionais',
    slug: 'tradicionais',
    description: 'Nossas combinações clássicas e mais pedidas, prontas para fritar na hora.',
    displayOrder: 2,
    active: true
  },
  {
    id: 'cat-especial',
    name: 'Tamanho Especial (30x20)',
    slug: 'especial',
    description: 'O verdadeiro gigante da casa, para dividir com quem você ama.',
    displayOrder: 3,
    active: true
  },
  {
    id: 'cat-doces',
    name: 'Pastéis Doces',
    slug: 'doces',
    description: 'Sobremesas irresistíveis em massa sequinha com recheios nobres e cremosos.',
    displayOrder: 4,
    active: true
  },
  {
    id: 'cat-bebidas',
    name: 'Bebidas e Sucos',
    slug: 'bebidas',
    description: 'Refrigerantes gelados, tubaína da região, sucos naturais e energéticos.',
    displayOrder: 5,
    active: true
  },
  {
    id: 'cat-alcoolicas',
    name: 'Cervejas e Alcoólicas (+18)',
    slug: 'alcoolicas',
    description: 'Cervejas long neck trincando para harmonizar com seu pastel quente.',
    displayOrder: 6,
    active: true
  }
];

export const INITIAL_FILLINGS_GROUP: OptionGroup = {
  id: 'grp-fillings',
  title: 'Escolha o Recheio Base',
  description: 'Selecione 1 recheio base. O valor da massa já está incluso no valor do recheio.',
  type: 'filling',
  minSelections: 1,
  maxSelections: 1,
  required: true,
  active: true,
  options: [
    {
      id: 'fill-carne',
      name: 'Carne Moída Especial',
      description: 'Carne moída sequinha, tempero da casa bem puxadinho na cebola e cheiro-verde',
      pricesBySize: { tubete: 19.9, convencional: 27.0, tubetinho: 16.0, especial: 27.0 },
      isAvailable: true
    },
    {
      id: 'fill-queijo',
      name: 'Queijo Mussarela',
      description: 'Queijo mussarela derretido (tubete ralado; convencional desfiada)',
      pricesBySize: { tubete: 15.5, convencional: 23.5, tubetinho: 14.0, especial: 23.5 },
      isAvailable: true
    },
    {
      id: 'fill-pizza',
      name: 'Pizza',
      description: 'Presunto selecionado, queijo mussarela, tomate picadinho e orégano aromático',
      pricesBySize: { tubete: 18.0, convencional: 24.0, tubetinho: 15.0, especial: 24.0 },
      isAvailable: true
    },
    {
      id: 'fill-calabresa',
      name: 'Calabresa Moída',
      description: 'Calabresa moída de primeira qualidade (Aurora), saborosa e sem excesso de gordura',
      pricesBySize: { tubete: 19.9, convencional: 23.9, tubetinho: 16.0, especial: 23.9 },
      isAvailable: true
    },
    {
      id: 'fill-brocolis',
      name: 'Brócolis com Ervas',
      description: 'Brócolis cozido no vapor, toque de ervas finas e alho frito crocante',
      pricesBySize: { tubete: 19.9, convencional: 24.9, tubetinho: 16.0, especial: 24.9 },
      isAvailable: true
    },
    {
      id: 'fill-frango',
      name: 'Frango Desfiado',
      description: 'Peito de frango desfiado, bem temperado, sequinho e saboroso',
      pricesBySize: { tubete: 19.9, convencional: 21.0, tubetinho: 16.0, especial: 21.0 },
      isAvailable: true,
      needsConfirmation: true
    },
    {
      id: 'fill-costela',
      name: 'Costela Desfiada',
      description: 'Costela bovina cozida lentamente por 8 horas, desfiada e temperada',
      pricesBySize: { tubete: 19.9, convencional: 32.0, tubetinho: 17.0, especial: 32.0 },
      isAvailable: true,
      needsConfirmation: true
    },
    {
      id: 'fill-palmito',
      name: 'Palmito Temperado',
      description: 'Palmito macio em tempero suave e desfiado',
      pricesBySize: { tubete: 18.0, convencional: 26.0, tubetinho: 16.0, especial: 26.0 },
      isAvailable: true,
      needsConfirmation: true
    },
    {
      id: 'fill-pernil',
      name: 'Pernil Desfiado ao Molho',
      description: 'Pernil suíno cozido ao molho branco especial da casa',
      pricesBySize: { tubete: 18.5, convencional: 24.5, tubetinho: 16.0, especial: 24.5 },
      isAvailable: true
    },
    {
      id: 'fill-camarao',
      name: 'Camarão ao Molho Branco',
      description: 'Camarão cozido envolto em molho branco cremoso da casa',
      pricesBySize: { tubete: 29.9, convencional: 39.0, tubetinho: 24.0, especial: 39.0 },
      isAvailable: true
    }
  ]
};

export const INITIAL_COMPLEMENTS_GROUP: OptionGroup = {
  id: 'grp-complements',
  title: 'Complemento / Acompanhamento',
  description: 'Obrigatório: selecione de 1 a 2 opções (100 g cada). Se preferir puro, escolha "Sem complemento".',
  type: 'complement',
  minSelections: 1,
  maxSelections: 2,
  required: true,
  active: true,
  options: [
    {
      id: 'comp-none',
      name: 'Sem complemento',
      description: 'Somente o recheio base escolhido',
      pricesBySize: { tubete: 0.0, convencional: 0.0, tubetinho: 0.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'comp-catupiry',
      name: 'Catupiry Original (100g)',
      description: 'O autêntico requeijão Catupiry cremoso',
      pricesBySize: { tubete: 8.0, convencional: 8.0, tubetinho: 6.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'comp-cheddar',
      name: 'Cheddar Cremoso (100g)',
      description: 'Cheddar aveludado e sabor marcante',
      pricesBySize: { tubete: 8.0, convencional: 8.0, tubetinho: 6.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'comp-cream-cheese',
      name: 'Cream Cheese Polenghi (100g)',
      description: 'Cream cheese suave e cremoso Polenghi',
      pricesBySize: { tubete: 8.0, convencional: 8.0, tubetinho: 6.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'comp-mussarela',
      name: 'Mussarela Extra (100g)',
      description: 'Camada generosa de queijo mussarela derretido',
      pricesBySize: { tubete: 8.0, convencional: 8.0, tubetinho: 6.0, especial: 0.0 },
      isAvailable: true,
      needsConfirmation: true
    }
  ]
};

export const INITIAL_EXTRAS_GROUP: OptionGroup = {
  id: 'grp-extras',
  title: 'Deixe Ainda Melhor — Adicionais',
  description: 'Opcional: escolha de 0 a 3 adicionais para turbinar seu pastel.',
  type: 'extra',
  minSelections: 0,
  maxSelections: 3,
  required: false,
  active: true,
  options: [
    {
      id: 'ext-alho',
      name: 'Alho Frito Crocante',
      pricesBySize: { tubete: 2.0, convencional: 2.0, tubetinho: 2.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-azeitona',
      name: 'Azeitona Fatiada',
      pricesBySize: { tubete: 3.0, convencional: 3.0, tubetinho: 2.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-bacon',
      name: 'Bacon em Cubinhos Crocante',
      pricesBySize: { tubete: 4.0, convencional: 4.0, tubetinho: 3.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-brocolis',
      name: 'Brócolis (100g)',
      pricesBySize: { tubete: 4.0, convencional: 5.0, tubetinho: 3.0, especial: 0.0 },
      isAvailable: true,
      needsConfirmation: true
    },
    {
      id: 'ext-calabresa',
      name: 'Calabresa Extra (100g)',
      pricesBySize: { tubete: 5.0, convencional: 5.0, tubetinho: 4.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-carne',
      name: 'Carne Moída Extra (100g)',
      pricesBySize: { tubete: 5.0, convencional: 9.0, tubetinho: 5.0, especial: 0.0 },
      isAvailable: true,
      needsConfirmation: true
    },
    {
      id: 'ext-catupiry',
      name: 'Catupiry Extra',
      pricesBySize: { tubete: 8.0, convencional: 8.0, tubetinho: 6.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-frango',
      name: 'Frango Extra (100g)',
      pricesBySize: { tubete: 8.0, convencional: 8.0, tubetinho: 6.0, especial: 0.0 },
      isAvailable: true,
      needsConfirmation: true
    },
    {
      id: 'ext-gorgonzola',
      name: 'Queijo Gorgonzola',
      pricesBySize: { tubete: 7.0, convencional: 7.0, tubetinho: 5.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-milho',
      name: 'Milho Verde',
      pricesBySize: { tubete: 2.0, convencional: 2.0, tubetinho: 2.0, especial: 0.0 },
      isAvailable: true,
      needsConfirmation: true
    },
    {
      id: 'ext-mussarela',
      name: 'Mussarela Fatiada',
      pricesBySize: { tubete: 7.0, convencional: 7.0, tubetinho: 5.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-oregano',
      name: 'Orégano Salpicado',
      pricesBySize: { tubete: 1.0, convencional: 1.0, tubetinho: 1.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-ovo',
      name: 'Ovo Cozido Picado',
      pricesBySize: { tubete: 2.0, convencional: 2.0, tubetinho: 2.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-palmito',
      name: 'Palmito Extra (100g)',
      pricesBySize: { tubete: 9.0, convencional: 9.0, tubetinho: 7.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-parmesao',
      name: 'Queijo Parmesão Ralado',
      pricesBySize: { tubete: 5.0, convencional: 5.0, tubetinho: 4.0, especial: 0.0 },
      isAvailable: true
    },
    {
      id: 'ext-tomate',
      name: 'Tomate Picadinho Fresco',
      pricesBySize: { tubete: 3.0, convencional: 3.0, tubetinho: 2.0, especial: 0.0 },
      isAvailable: true
    }
  ]
};

export const INITIAL_PRODUCTS: Product[] = [
  // 1. DO SEU JEITO
  {
    id: 'prod-do-seu-jeito',
    categoryId: 'cat-do-seu-jeito',
    name: 'Pastel Do Seu Jeito',
    description: 'Monte passo a passo: escolha o tamanho (Tubete ou Convencional), 1 recheio base, 1 ou 2 complementos e até 3 adicionais à sua escolha.',
    imageUrl: '/src/assets/images/hero_pastel_feira_1791132272218.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 15.0, convencional: 23.5, tubetinho: 14.0, especial: 64.9 },
    isCustomizable: true,
    optionGroupIds: ['grp-fillings', 'grp-complements', 'grp-extras'],
    isFeatured: true,
    isAvailable: true
  },

  // 2. TRADICIONAIS (Prontos)
  {
    id: 'prod-trad-carne',
    categoryId: 'cat-tradicionais',
    name: 'Pastel de Carne Tradicional',
    description: 'Carne moída sequinha, temperada no ponto ideal com cebola e cheiro verde frescos.',
    imageUrl: '/src/assets/images/pastel_de_carne_1791132284645.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 19.9, convencional: 27.0, tubetinho: 16.0, especial: 64.9 },
    isCustomizable: false,
    isFeatured: true, // Home destaque 1
    isAvailable: true
  },
  {
    id: 'prod-trad-queijo',
    categoryId: 'cat-tradicionais',
    name: 'Pastel de Queijo Mussarela',
    description: 'Muito queijo mussarela derretido que puxa na mordida. O clássico inconfundível.',
    imageUrl: '/src/assets/images/pastel_de_queijo_1791132295556.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 15.5, convencional: 23.5, tubetinho: 14.0, especial: 64.9 },
    isCustomizable: false,
    isFeatured: true, // Home destaque 2
    isAvailable: true
  },
  {
    id: 'prod-trad-casa',
    categoryId: 'cat-tradicionais',
    name: 'Pastel da Casa',
    description: 'Combinação exclusiva de carne moída bem temperada, queijo derretido, cubinhos de bacon e tempero secreto da casa.',
    imageUrl: '/src/assets/images/pastel_da_casa_1791132305519.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 26.0, convencional: 33.0, tubetinho: 18.0, especial: 64.9 },
    isCustomizable: false,
    isFeatured: true, // Home destaque 3
    isAvailable: true,
    needsConfirmation: true
  },
  {
    id: 'prod-trad-palmito-catupiry',
    categoryId: 'cat-tradicionais',
    name: 'Palmito com Catupiry',
    description: 'Palmito macio fatiado envolvido no autêntico Catupiry cremoso.',
    imageUrl: '/src/assets/images/pastel_de_queijo_1791132295556.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 25.0, convencional: 30.0, tubetinho: 19.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-trad-calabresa-queijo',
    categoryId: 'cat-tradicionais',
    name: 'Calabresa com Queijo',
    description: 'Calabresa moída artesanal coberta de mussarela cremosa.',
    imageUrl: '/src/assets/images/pastel_da_casa_1791132305519.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 21.0, convencional: 26.0, tubetinho: 17.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-trad-carne-seca-catupiry',
    categoryId: 'cat-tradicionais',
    name: 'Carne Seca com Catupiry',
    description: 'Carne seca desfiada no ponto perfeito com Catupiry Original.',
    imageUrl: '/src/assets/images/pastel_de_carne_1791132284645.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 33.0, convencional: 39.0, tubetinho: 24.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-trad-costela-queijo',
    categoryId: 'cat-tradicionais',
    name: 'Costela com Queijo',
    description: 'Costela desfiada desmanchando na boca e queijo mussarela.',
    imageUrl: '/src/assets/images/pastel_da_casa_1791132305519.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 32.0, convencional: 38.0, tubetinho: 23.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-trad-camarao-catupiry',
    categoryId: 'cat-tradicionais',
    name: 'Camarão com Catupiry',
    description: 'Camarões selecionados com requeijão Catupiry legítimo.',
    imageUrl: '/src/assets/images/hero_pastel_feira_1791132272218.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 33.0, convencional: 39.0, tubetinho: 25.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-trad-pernil-queijo',
    categoryId: 'cat-tradicionais',
    name: 'Pernil com Queijo',
    description: 'Pernil suíno suculento com molho branco especial e mussarela.',
    imageUrl: '/src/assets/images/pastel_da_casa_1791132305519.jpg',
    availableSizes: ['tubete', 'convencional'],
    pricesBySize: { tubete: 23.0, convencional: 28.0, tubetinho: 18.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },

  // 3. TAMANHO ESPECIAL
  {
    id: 'prod-esp-familia',
    categoryId: 'cat-especial',
    name: 'Pastel Gigante Especial 30x20 cm',
    description: 'O maior da região! Pastel de 30x20 cm com direito a 2 complementos cremosos e 2 adicionais à sua escolha.',
    imageUrl: '/src/assets/images/hero_pastel_feira_1791132272218.jpg',
    availableSizes: ['especial'],
    pricesBySize: { especial: 64.9, tubete: 64.9, convencional: 64.9, tubetinho: 64.9 },
    isCustomizable: true,
    optionGroupIds: ['grp-fillings', 'grp-complements', 'grp-extras'],
    isFeatured: true,
    isAvailable: true,
    needsConfirmation: true
  },

  // 4. DOCES
  {
    id: 'prod-doce-nutella-morango',
    categoryId: 'cat-doces',
    name: 'Nutella com Morango',
    description: 'Nutella pura com pedaços de morangos frescos na massa crocante.',
    imageUrl: '/src/assets/images/pastel_doce_nutella_1791132315640.jpg',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 22.0, tubete: 28.0, convencional: 36.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true,
    needsConfirmation: true
  },
  {
    id: 'prod-doce-banoffe',
    categoryId: 'cat-doces',
    name: 'Banoffe Especial',
    description: 'Banana fatiada, doce de leite artesanal cremoso, creme de ninho e polvilhado com canela.',
    imageUrl: '/src/assets/images/pastel_doce_nutella_1791132315640.jpg',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 20.0, tubete: 26.0, convencional: 34.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-doce-sensacao',
    categoryId: 'cat-doces',
    name: 'Sensação',
    description: 'Creme de morango aveludado, chocolate ao leite nobre e morangos frescos picados.',
    imageUrl: '/src/assets/images/pastel_doce_nutella_1791132315640.jpg',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 21.0, tubete: 27.0, convencional: 35.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-doce-ninho-nutella',
    categoryId: 'cat-doces',
    name: 'Ninho com Nutella',
    description: 'A clássica dupla cremosa de creme de Ninho e pura Nutella.',
    imageUrl: '/src/assets/images/pastel_doce_nutella_1791132315640.jpg',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 22.0, tubete: 28.0, convencional: 36.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-doce-banana-canela',
    categoryId: 'cat-doces',
    name: 'Banana com Açúcar e Canela',
    description: 'Bananas maduras caramelizadas no açúcar e canela em pó perfumada.',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 16.0, tubete: 21.5, convencional: 28.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true,
    needsConfirmation: true
  },
  {
    id: 'prod-doce-romeu-julieta',
    categoryId: 'cat-doces',
    name: 'Goiabada com Queijo Minas',
    description: 'O clássico Romeu e Julieta com goiabada cascão derretida e queijo minas.',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 17.0, tubete: 23.0, convencional: 29.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-doce-ferrero',
    categoryId: 'cat-doces',
    name: 'Ferrero Crocante',
    description: 'Muita Nutella cremosa misturada com amendoim tostado crocante.',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 22.0, tubete: 28.0, convencional: 36.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-doce-kinder',
    categoryId: 'cat-doces',
    name: 'Kinder Bueno',
    description: 'Creme especial tipo Bueno, creme de ninho da casa e crocante de amendoim.',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 23.0, tubete: 29.0, convencional: 38.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-doce-pistache',
    categoryId: 'cat-doces',
    name: 'Pistache Nobre',
    description: 'Brigadeiro cremoso de pistache premium com pedacinhos de pistache tostado.',
    availableSizes: ['tubetinho', 'tubete', 'convencional'],
    pricesBySize: { tubetinho: 25.0, tubete: 32.0, convencional: 40.0, especial: 64.9 },
    isCustomizable: false,
    isAvailable: true,
    needsConfirmation: true
  },

  // 5. BEBIDAS (Não alcoólicas)
  {
    id: 'prod-beb-coca-lata',
    categoryId: 'cat-bebidas',
    name: 'Coca-Cola Lata 350ml',
    description: 'Refrigerante gelado Coca-Cola tradicional lata 350ml.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 8.9, convencional: 8.9, tubetinho: 8.9, especial: 8.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-coca-zero-lata',
    categoryId: 'cat-bebidas',
    name: 'Coca-Cola Zero Lata 350ml',
    description: 'Refrigerante gelado Coca-Cola Zero açúcar lata 350ml.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 8.9, convencional: 8.9, tubetinho: 8.9, especial: 8.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-guarana-lata',
    categoryId: 'cat-bebidas',
    name: 'Guaraná Antarctica Lata 350ml',
    description: 'O autêntico sabor brasileiro lata 350ml bem gelada.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 8.9, convencional: 8.9, tubetinho: 8.9, especial: 8.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-guarana-zero',
    categoryId: 'cat-bebidas',
    name: 'Guaraná Antarctica Zero Lata 350ml',
    description: 'Guaraná Antarctica zero açúcares lata 350ml.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 8.9, convencional: 8.9, tubetinho: 8.9, especial: 8.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-fanta-laranja',
    categoryId: 'cat-bebidas',
    name: 'Fanta Laranja Lata 350ml',
    description: 'Refrigerante sabor laranja bem gelado.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 8.9, convencional: 8.9, tubetinho: 8.9, especial: 8.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-fanta-uva',
    categoryId: 'cat-bebidas',
    name: 'Fanta Uva Lata 350ml',
    description: 'Refrigerante sabor uva lata 350ml.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 8.9, convencional: 8.9, tubetinho: 8.9, especial: 8.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-tubaina',
    categoryId: 'cat-bebidas',
    name: 'Tubaína Regional 500ml',
    description: 'A clássica tubaína do interior paulista garrafa 500ml gelada.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 8.5, convencional: 8.5, tubetinho: 8.5, especial: 8.5 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-coca-600',
    categoryId: 'cat-bebidas',
    name: 'Coca-Cola 600ml',
    description: 'Refrigerante Coca-Cola garrafa pet 600ml.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 10.5, convencional: 10.5, tubetinho: 10.5, especial: 10.5 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-coca-1l',
    categoryId: 'cat-bebidas',
    name: 'Coca-Cola 1 Litro',
    description: 'Coca-Cola garrafa 1L ideal para família.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 12.0, convencional: 12.0, tubetinho: 12.0, especial: 12.0 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-monster',
    categoryId: 'cat-bebidas',
    name: 'Energético Monster 473ml',
    description: 'Monster Energy tradicional lata 473ml trincando.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 15.9, convencional: 15.9, tubetinho: 15.9, especial: 15.9 },
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-beb-jarra-suco',
    categoryId: 'cat-bebidas',
    name: 'Jarra de Suco de Laranja 1 Litro',
    description: 'Suco natural feito da fruta na hora, 100% puro e sem conservantes.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 25.9, convencional: 25.9, tubetinho: 25.9, especial: 25.9 },
    isCustomizable: false,
    isAvailable: true
  },

  // 6. BEBIDAS ALCOÓLICAS (+18)
  {
    id: 'prod-alc-heineken',
    categoryId: 'cat-alcoolicas',
    name: 'Cerveja Heineken Long Neck 330ml',
    description: 'Cerveja Premium puro malte long neck 330ml. Venda proibida para menores de 18 anos.',
    imageUrl: 'https://images.unsplash.com/photo-1608270190977-909d73d74998?q=80&w=800&auto=format&fit=crop',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 10.5, convencional: 10.5, tubetinho: 10.5, especial: 10.5 },
    isAlcoholic: true,
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-alc-budweiser',
    categoryId: 'cat-alcoolicas',
    name: 'Cerveja Budweiser Long Neck 330ml',
    description: 'Cerveja american lager long neck gelada. Venda proibida para menores de 18 anos.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 10.0, convencional: 10.0, tubetinho: 10.0, especial: 10.0 },
    isAlcoholic: true,
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-alc-amstel',
    categoryId: 'cat-alcoolicas',
    name: 'Cerveja Amstel Lata 350ml',
    description: 'Cerveja puro malte receita de Amsterdam lata 350ml.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 8.9, convencional: 8.9, tubetinho: 8.9, especial: 8.9 },
    isAlcoholic: true,
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-alc-corona',
    categoryId: 'cat-alcoolicas',
    name: 'Cerveja Corona Extra Long Neck 330ml',
    description: 'Cerveja leve e refrescante mexicana. Venda proibida para menores de 18 anos.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 10.5, convencional: 10.5, tubetinho: 10.5, especial: 10.5 },
    isAlcoholic: true,
    isCustomizable: false,
    isAvailable: true
  },
  {
    id: 'prod-alc-stella',
    categoryId: 'cat-alcoolicas',
    name: 'Cerveja Stella Artois Long Neck 330ml',
    description: 'Cerveja puro malte belga sofisticada e marcante.',
    availableSizes: ['tubete'],
    pricesBySize: { tubete: 10.5, convencional: 10.5, tubetinho: 10.5, especial: 10.5 },
    isAlcoholic: true,
    isCustomizable: false,
    isAvailable: true
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', neighborhood: 'Lot. Remanso Campineiro (Bairro da Loja)', fee: 5.0, estimatedMinutes: '20-30 min', active: true },
  { id: 'zone-2', neighborhood: 'Parque Hortolândia', fee: 7.0, estimatedMinutes: '25-35 min', active: true },
  { id: 'zone-3', neighborhood: 'Jardim Amanda I e II', fee: 9.0, estimatedMinutes: '35-45 min', active: true },
  { id: 'zone-4', neighborhood: 'Jardim Rosolém', fee: 8.0, estimatedMinutes: '30-40 min', active: true },
  { id: 'zone-5', neighborhood: 'Vila Real', fee: 6.0, estimatedMinutes: '25-35 min', active: true },
  { id: 'zone-6', neighborhood: 'Jardim Santa Clara', fee: 8.0, estimatedMinutes: '30-40 min', active: true },
  { id: 'zone-7', neighborhood: 'Outros bairros de Hortolândia', fee: 10.0, estimatedMinutes: '35-50 min', active: true }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  name: 'Pastelada',
  segment: 'Pastelaria Artesanal',
  address: 'R. Zacarias Costa Camargo, 221 — Lot. Remanso Campineiro',
  cep: '13184-300',
  city: 'Hortolândia',
  state: 'SP',
  phone: '(19) 98203-4637',
  whatsapp: '(19) 98203-4637',
  whatsappUrl: 'https://wa.me/5519982034637',
  instagramUrl: 'https://www.instagram.com/',
  ticketMedio: 'R$ 40–60 por pessoa',
  services: ['Refeição no local', 'Para viagem', 'Entrega sem contato'],
  businessHours: {
    seg: { open: '17:00', close: '22:45', isOpenToday: true },
    ter: { open: '17:00', close: '22:45', isOpenToday: true },
    qua: { open: '17:00', close: '22:45', isOpenToday: true },
    qui: { open: '17:00', close: '22:45', isOpenToday: true },
    sex: { open: '17:00', close: '23:45', isOpenToday: true },
    sab: { open: '17:00', close: '23:45', isOpenToday: true },
    dom: { open: '17:00', close: '23:00', isOpenToday: true }
  },
  isPaused: false,
  prepTimeMinutes: '25-40 min',
  minOrderValue: 20.0,
  freeDeliveryThreshold: 80.0,
  acceptedPaymentMethods: ['pix', 'credit_card', 'debit_card', 'cash_on_delivery', 'card_on_delivery'],
  featuredProductIds: ['prod-trad-carne', 'prod-trad-queijo', 'prod-trad-casa'],
  brandColors: {
    yellow: '#e8874a',
    black: '#24352b',
    cream: '#f8f1e7',
    white: '#fffaf2'
  },
  dpoEmail: 'privacidade@example.com',
  privacyVersion: '2026.1-LGPD',
  allowGuestCheckout: true
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-primeiro10',
    code: 'BEMVINDO10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 35.0,
    maxUses: 100,
    usedCount: 14,
    active: true
  },
  {
    id: 'coup-fretegratis',
    code: 'QUEROPASTEL',
    discountType: 'fixed',
    discountValue: 5.0,
    minOrderValue: 40.0,
    maxUses: 50,
    usedCount: 8,
    active: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-owner',
    name: 'Dono da Loja (Demonstração)',
    email: 'dono@example.com',
    phone: '(19) 98203-4637',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    role: 'OWNER',
    permissions: [
      'pedidos.ver',
      'pedidos.alterar_status',
      'pedidos.cancelar',
      'cardapio.editar',
      'precos.editar',
      'ingredientes.editar',
      'conteudo_site.editar',
      'loja.configurar',
      'cupons.gerenciar',
      'relatorios.ver',
      'clientes.ver',
      'lgpd.atender',
      'equipe.gerenciar',
      'pagamentos.configurar',
      'integracoes.gerenciar'
    ],
    twoFactorEnabled: true,
    twoFactorSecret: '',
    recoveryCodes: [],
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    lastLoginAt: '2026-10-04T08:30:00Z'
  },
  {
    id: 'user-admin',
    name: 'Carlos Oliveira (Gerente)',
    email: 'gerente@example.com',
    phone: '(19) 99123-4567',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    role: 'ADMIN',
    permissions: [
      'pedidos.ver',
      'pedidos.alterar_status',
      'pedidos.cancelar',
      'cardapio.editar',
      'precos.editar',
      'ingredientes.editar',
      'conteudo_site.editar',
      'loja.configurar',
      'cupons.gerenciar',
      'relatorios.ver',
      'clientes.ver',
      'lgpd.atender'
    ],
    twoFactorEnabled: true,
    twoFactorSecret: '',
    recoveryCodes: [],
    active: true,
    createdAt: '2025-02-01T12:00:00Z'
  },
  {
    id: 'user-kitchen',
    name: 'Equipe da Cozinha',
    email: 'cozinha@example.com',
    phone: '(19) 98888-0000',
    role: 'STAFF',
    permissions: ['pedidos.ver', 'pedidos.alterar_status'],
    twoFactorEnabled: false,
    active: true,
    createdAt: '2025-02-10T14:00:00Z'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'int-payment',
    service: 'payment',
    providerName: 'Mercado Pago (PIX Instantâneo & Cartão)',
    status: 'not_configured',
    environment: 'sandbox',
    apiKey: '',
    maskedApiKey: '',
    publicKey: '',
    webhookSecret: '',
    pixKey: '+5519982034637',
    lastTestedAt: '2026-10-04T08:00:00Z',
    lastTestSuccess: false
  },
  {
    id: 'int-email',
    service: 'email',
    providerName: 'Resend (E-mail Transacional & Status)',
    status: 'not_configured',
    environment: 'production',
    apiKey: '',
    maskedApiKey: '',
    senderEmail: 'pedidos@example.com',
    lastTestedAt: '2026-10-04T08:00:00Z',
    lastTestSuccess: false
  },
  {
    id: 'int-google',
    service: 'google_oauth',
    providerName: 'Google Cloud OAuth 2.0 (Login de Clientes & Dono)',
    status: 'not_configured',
    environment: 'production',
    apiKey: '',
    maskedApiKey: '',
    clientId: '',
    clientSecret: '',
    lastTestedAt: '2026-10-04T07:30:00Z',
    lastTestSuccess: false
  },
  {
    id: 'int-storage',
    service: 'storage',
    providerName: 'Cloudflare R2 / S3 Imagens Otimizadas',
    status: 'not_configured',
    environment: 'production',
    apiKey: '',
    maskedApiKey: '',
    lastTestedAt: '2026-10-04T07:30:00Z',
    lastTestSuccess: false
  },
  {
    id: 'int-crypto',
    service: 'encryption',
    providerName: 'AES-256-GCM Chave Mestra do Servidor',
    status: 'not_configured',
    environment: 'production',
    apiKey: '',
    maskedApiKey: '',
    lastTestedAt: '2026-10-04T08:00:00Z',
    lastTestSuccess: false
  }
];
