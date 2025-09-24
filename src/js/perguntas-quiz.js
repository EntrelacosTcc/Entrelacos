const perguntas = [
  {
    texto: "Você gostaria de atuar mais com:", opcoes: [
      { texto: "Ações práticas no campo", resultado: "ambiental" },
      { texto: "Apoio emocional ou escuta ativa", resultado: "GrupoSubRepresentado" },
      { texto: "Educação e ensino", resultado: "educacional" },
      { texto: "Ativismo online e campanhas sociais", resultado: "social" }
    ]
  },
  {
    texto: "Você se considera uma pessoa mais:", opcoes: [
      { texto: "Empática e cuidadosa", resultado: "saude" },
      { texto: "Idealista e determinada", resultado: "ambiental" },
      { texto: "Comunicativa e didática", resultado: "educacional" },
      { texto: "Analítica e prática", resultado: "social" }
    ]
  },
  {
    texto: "Se tivesse 4 horas livres, o que mais te realizaria?", opcoes: [
      { texto: "Limpar um parque ou praia", resultado: "ambiental" },
      { texto: "Auxiliar no cuidado de animais carentes", resultado: "animal" },
      { texto: "Escutar alguém que precisa de apoio", resultado: "social" },
      { texto: "Ajudar em um mutirão de saúde", resultado: "saude" }
    ]
  },
  {
    texto: "O que mais te inspira a ser voluntário(a)?", opcoes: [
      { texto: "Justiça social e igualdade", resultado: "social" },
      { texto: "Amor aos animais e à natureza", resultado: "animal" },
      { texto: "Fé e espiritualidade", resultado: "religiosa" },
      { texto: "Transformar vidas com educação", resultado: "educacional" }
    ]
  },
  {
    texto: "Qual dessas habilidades mais te representa?", opcoes: [
      { texto: "Ouvir com empatia", resultado: "social" },
      { texto: "Liderar e mobilizar pessoas", resultado: "GrupoSubRepresentado" },
      { texto: "Criar soluções criativas", resultado: "ambiental" },
      { texto: "Ensinar e explicar com clareza", resultado: "educacional" }
    ]
  },
  {
    texto: "Se tivesse que escolher uma causa por um ano, qual seria?", opcoes: [
      { texto: "Direito dos animais", resultado: "animal" },
      { texto: "Igualdade social", resultado: "GrupoSubRepresentado" },
      { texto: "Direito à educação", resultado: "educacional" },
      { texto: "Preservação ambiental", resultado: "ambiental" }
    ]
  },
  {
    texto: "Qual dessas frases mais te representa?", opcoes: [
      { texto: "Educação muda o mundo.", resultado: "educacional" },
      { texto: "Todos merecem respeito.", resultado: "GrupoSubRepresentado" },
      { texto: "A fé move montanhas.", resultado: "religiosa" },
      { texto: "A natureza é nossa casa.", resultado: "ambiental" }
    ]
  },
  {
    texto: "Prefere causas ligadas a:", opcoes: [
      { texto: "Justiça social e direitos humanos", resultado: "GrupoSubRepresentado" },
      { texto: "Saúde e bem-estar", resultado: "saude" },
      { texto: "Cultura e identidade", resultado: "social" },
      { texto: "Meio ambiente e sustentabilidade", resultado: "ambiental" }
    ]
  },
  {
    texto: "Se pudesse transformar algo no mundo, o que seria?", opcoes: [
      { texto: "Acabar com a pobreza", resultado: "social" },
      { texto: "Respeitar todas as diversidades", resultado: "GrupoSubRepresentado" },
      { texto: "Acesso universal à educação", resultado: "educacional" },
      { texto: "Preservar os animais", resultado: "animal" }
    ]
  },
  {
    texto: "Qual palavra te define como voluntário(a)?", opcoes: [
      { texto: "Esperança", resultado: "religiosa" },
      { texto: "Educação", resultado: "educacional" },
      { texto: "Compaixão", resultado: "social" },
      { texto: "Igualdade", resultado: "GrupoSubRepresentado" }
    ]
  },
  {
    texto: "Em uma equipe de voluntariado, você seria:", opcoes: [
      { texto: "Quem ensina e orienta", resultado: "social" },
      { texto: "Quem cuida dos mais frágeis", resultado: "animal" },
      { texto: "Quem lidera e luta por direitos", resultado: "animal" },
      { texto: "Quem atua com natureza e animais", resultado: "ambiental" }
    ]
  },
  {
    texto: "O que, na sua opinião, poderia ajudar a criar um mundo mais justo para todos?", opcoes: [
      { texto: "Criar políticas para proteger os direitos dos animais", resultado: "animal" },
      { texto: "Investir em práticas sustentáveis e preservar o meio ambiente", resultado: "ambiental" },
      { texto: "Promover respeito e inclusão para todas as religiões e crenças", resultado: "religiosa" },
      { texto: "Garantir oportunidades e segurança para mulheres, LGBT+ e pessoas com deficiência", resultado: "GrupoSubRepresentado" }
    ]
  },
  {
    texto: "Qual dessas atitudes você acredita que faria mais diferença na sociedade?", opcoes: [
      { texto: "Criar mais abrigos e campanhas para adoção responsável de animais", resultado: "animal" },
      { texto: "Incentivar ações que promovam a sustentabilidade e preservem os recursos naturais", resultado: "ambiental" },
      { texto: "Apoiar ações de diálogo e respeito entre diferentes grupos religiosos", resultado: "religiosa" },
      { texto: "Apoiar políticas de igualdade para todos os grupos sociais", resultado: "GrupoSubRepresentado" }
    ]
  },
  {
    texto: "Se você tivesse a chance de mudar uma área da sociedade, qual delas você acha que mais precisa de atenção?", opcoes: [
      { texto: "Proteger os habitats naturais dos animais e criar leis que combatam a exploração indiscriminada.", resultado: "animal" },
      { texto: "Criar espaços de valorização cultural onde diferentes etnias e tradições sejam respeitadas e celebradas.", resultado: "social" },
      { texto: "Implementar políticas que ajudem a reverter os danos ambientais causados pela industrialização.", resultado: "ambiental" },
      { texto: "Oferecer mais oportunidades educacionais para todas faixas etárias.", resultado: "educacional" }
    ]
  },
  {
    texto: "Qual palavra te define melhor?", opcoes: [
      { texto: "Sustentável.", resultado: "ambiental" },
      { texto: "Inclusivo.", resultado: "GrupoSubRepresentado" },
      { texto: "Solidário.", resultado: "social" },
      { texto: "Cuidadoso.", resultado: "saude" }
    ]
  },
  {
    texto: "Que tipo de habilidade você mais gostaria de desenvolver como voluntário?", opcoes: [
      { texto: "Comunicação com pessoas de diferentes religiões e crenças.", resultado: "religiosa" },
      { texto: "Conhecimento sobre práticas sustentáveis e reciclagem", resultado: "ambiental" },
      { texto: "Capacidade de mediar conflitos e apoiar minorias ", resultado: "GrupoSubRepresentado" },
      { texto: "Técnicas de primeiros socorros e saúde preventiva", resultado: "saude" }
    ]
  },
  {
    texto: "Se pudesse escolher um local para atuar, escolheria", opcoes: [
      { texto: "ONG de proteção animal.", resultado: "animal" },
      { texto: "Centro de reforço escolar para jovens.", resultado: "educacional" },
      { texto: "Centro comunitário para apoio a minorias.", resultado: "GrupoSubRepresentado" },
      { texto: "Hospital ou clínica com atendimento voluntário.", resultado: "saude" }
    ]
  },
  {
    texto: "Para você, voluntariado significa:", opcoes: [
      { texto: "Promover justiça e direitos para grupos em vulnerabilidade.", resultado: "GrupoSubRepresentado" },
      { texto: " Apoiar a saúde física e mental da comunidade", resultado: "saude" },
      { texto: "Incentivar o aprendizado e a educação para todos.", resultado: "educacional" },
      { texto: "Preservar espaços naturais e biodiversidade.", resultado: "ambiental" }
    ]
  },
];


export default perguntas;