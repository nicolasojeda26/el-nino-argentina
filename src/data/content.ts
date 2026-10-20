export const site = {
  name: "El Niño Argentina",
  tagline: "El fenómeno que marca el clima del país",
  description:
    "Estado actual, pronóstico, impactos por región e historia del fenómeno de El Niño y La Niña (ENSO) en Argentina. Datos oficiales de NOAA y el SMN.",
  url: "https://xn--elnio-rta.net.ar",
  domain: "elniño.net.ar",
  email: "litoraldevctes@gmail.com",
  adsenseClient: "ca-pub-2347772486638866",
  analytics: {
    gaMeasurementId: "",
    gaPropertyId: "",
    googleOAuthClientId: "",
  },
  googleSiteVerification: "",
  adsSlots: {
    "home-top": "",
    pronostico: "",
    glosario: "",
    historia: "",
    faq: "",
    "el-nino": "",
    "la-nina": "",
    impactos: "",
    noticias: "",
    noticia: "",
    "impactos-litoral": "",
    "impactos-pampeana": "",
    "impactos-cuyo": "",
    "impactos-noa": "",
    "impactos-patagonia": "",
  } as Record<string, string>,
  author: "El Niño Argentina",
};

export interface NavItem {
  href: string;
  label: string;
}

export const nav: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/pronostico/", label: "Pronóstico" },
  { href: "/impactos/", label: "Impactos" },
  { href: "/noticias/", label: "Notas" },
  { href: "/el-nino/", label: "El Niño" },
  { href: "/la-nina/", label: "La Niña" },
  { href: "/historia/", label: "Historia" },
  { href: "/preguntas/", label: "Preguntas" },
  { href: "/contacto/", label: "Contacto" },
];

export type RegionIcon = "waves" | "wheat" | "mountain" | "mountain-sun" | "wind";

export interface Region {
  slug: string;
  name: string;
  provinces: string;
  iconName: RegionIcon;
  summary: string;
  points: string[];
  ninaSummary: string;
  ninaPoints: string[];
  detail: string;
  recommendations: string[];
}

export const regions: Region[] = [
  {
    slug: "litoral",
    name: "Litoral y NEA",
    provinces: "Misiones, Corrientes, Chaco, Formosa, Entre Ríos, Santa Fe",
    iconName: "waves",
    summary:
      "La zona más expuesta al El Niño: lluvias por encima de lo normal y crecidas de los ríos Paraná, Paraguay y Uruguay.",
    points: [
      "Precipitaciones superiores a la media, con eventos intensos en primavera y verano.",
      "Incremento del caudal del río Paraná: mayor riesgo de inundaciones ribereñas.",
      "Afecta el transporte fluvial, la pesca y las cosechas de la región.",
    ],
    ninaSummary:
      "Durante La Niña se revierte el patrón: déficit de lluvias en la cuenca alta y bajantes pronunciadas de los grandes ríos.",
    ninaPoints: [
      "Lluvias por debajo de lo normal en primavera y verano.",
      "Bajante de los ríos Paraná, Paraguay y Uruguay, complicando la hidrovía y tomas de agua.",
      "Mayor riesgo de incendios en humedales, pastizales y esteros.",
    ],
    detail:
      "La humedad que El Niño transporta desde el Atlántico tropical y el corrimiento del jet subtropical hacia el sur aumentan las precipitaciones en toda la cuenca. Como gran parte del agua proviene de lluvias en el sur de Brasil, el caudal del río Paraná responde con crecidas que llegan semanas después a territorio argentino. Es la región donde el fenómeno se siente con más fuerza y donde históricamente se registraron las mayores inundaciones, como en 1982–1983 y 1997–1998.",
    recommendations: [
      "Seguir las alertas del SMN y los avisos de crecidas de la cuenca del Plata.",
      "Coordinar con Defensa Civil los planes de evacuación en zonas ribereñas.",
      "Prever el impacto en el transporte fluvial y en las cosechas.",
    ],
  },
  {
    slug: "pampeana",
    name: "Región Pampeana",
    provinces: "Buenos Aires, Córdoba, Santa Fe, La Pampa",
    iconName: "wheat",
    summary:
      "El corazón productivo del país. El Niño suele traer más lluvia, lo que puede mejorar rindes pero también generar excesos hídricos.",
    points: [
      "Mayor recarga de suelos: históricamente mejora los rindes de soja y maíz.",
      "Riesgo de anegamientos y excesos de agua en campos bajos.",
      "Aumento de tormentas severas y caída de granizo en verano.",
    ],
    ninaSummary:
      "La región más castigada por las sequías de La Niña, con recorte de lluvias en etapas críticas de la campaña agrícola.",
    ninaPoints: [
      "Déficit hídrico en primavera y verano, afectando la siembra y floración de soja y maíz.",
      "Mayor frecuencia de olas de calor y estrés térmico en los cultivos.",
      "Caída de rindes agrícolas y menor aporte de humedad en los perfiles de suelo.",
    ],
    detail:
      "La región pampeana es el corazón agrícola del país y una de las más sensibles al ENSO. En años de El Niño, el mayor aporte de humedad suele traducirse en mejores reservas de agua en el suelo, lo que históricamente se reflejó en buenas campañas de soja y maíz. El riesgo es el exceso: lluvias muy concentradas pueden anegar lotes bajos, retrasar la siembra o la cosecha y favorecer enfermedades de los cultivos.",
    recommendations: [
      "Planificar la campaña con escenarios de exceso hídrico y drenajes adecuados.",
      "Monitorear la reserva de agua útil y las alertas de tormentas severas.",
      "Contemplar coberturas de seguro para granizo y anegamiento.",
    ],
  },
  {
    slug: "cuyo",
    name: "Cuyo",
    provinces: "Mendoza, San Juan, San Luis",
    iconName: "mountain",
    summary:
      "Efecto más variable y en general moderado, con impacto sobre la nieve de cordillera y los caudales de riego.",
    points: [
      "Acumulación de nieve en cordillera variable según el año.",
      "Relación indirecta con la disponibilidad de agua para riego.",
      "Menor señal climática que en el centro-este del país.",
    ],
    ninaSummary:
      "Inviernos más secos en alta montaña que reducen la acumulación nívea y el caudal de los ríos cordilleranos.",
    ninaPoints: [
      "Menor probabilidad de nevadas invernales en la cordillera.",
      "Reducción del escurrimiento de deshielo en primavera y verano para los oasis de riego.",
      "Mayor exigencia sobre las reservas de los embalses provinciales.",
    ],
    detail:
      "Cuyo está detrás de la cordillera, por lo que la señal directa de El Niño es más débil y varía año a año. El efecto más relevante es indirecto: la nieve que se acumula en la cordillera durante el invierno alimenta los ríos que riegan los oasis productivos de Mendoza y San Juan. Un año con buena nieve mejora la disponibilidad de agua para riego y para generar energía; uno con poca nieve complica la temporada.",
    recommendations: [
      "Seguir los pronósticos de nieve en cordillera y el estado de los embalses.",
      "Planificar el riego según la disponibilidad de agua prevista.",
      "No atribuir a El Niño los cambios locales sin verificar datos regionales.",
    ],
  },
  {
    slug: "noa",
    name: "Noroeste (NOA)",
    provinces: "Salta, Jujuy, Tucumán, Catamarca, La Rioja, Santiago del Estero",
    iconName: "mountain-sun",
    summary:
      "Veranos más lluviosos y actividad convectiva más intensa sobre las yungas y los valles.",
    points: [
      "Aumento de lluvias estivales y crecidas de ríos de montaña.",
      "Mayor riesgo de aludes y crecidas en zonas cordilleranas.",
      "Impacto en cultivos subtropicales (caña, cítricos).",
    ],
    ninaSummary:
      "Comportamiento dispar: mientras el este de la región tiende a secarse, las yungas pueden registrar lluvias intensas puntuales.",
    ninaPoints: [
      "Inicio de la temporada de lluvias más tardío o irregular en el Chaco semiárido.",
      "Eventos convectivos aislados pero intensos en quebradas y valles.",
      "Estrés térmico por olas de calor en primavera antes del comienzo de las lluvias.",
    ],
    detail:
      "En el noroeste, el efecto de El Niño se concentra en el verano. El mayor aporte de humedad y el calentamiento de la atmósfera favorecen lluvias convectivas más intensas sobre las yungas y los valles, lo que puede provocar crecidas repentinas de ríos de montaña y deslizamientos en rutas cordilleranas, además de beneficiar a los cultivos subtropicales como la caña de azúcar y los cítricos.",
    recommendations: [
      "Atender los avisos de crecidas de ríos de montaña y aludes en rutas.",
      "Reforzar el manejo del agua en cultivos subtropicales.",
      "Prever mayor actividad eléctrica y tormentas en verano.",
    ],
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    provinces: "Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego",
    iconName: "wind",
    summary:
      "Inviernos fríos y variables. La señal del El Niño es más débil y heterogénea que en el resto del país.",
    points: [
      "Mayor probabilidad de nevadas en cordillera en invierno.",
      "Temporada de esquí que puede verse favorecida.",
      "Impactos sobre la cría de ganado ovino y caprino.",
    ],
    ninaSummary:
      "Señal débil modulada por el Modo Anular del Sur (SAM), con tendencia a inviernos menos nevadores en el norte patagónico.",
    ninaPoints: [
      "Menor frecuencia de frentes húmedos sobre la cordillera norte patagónica.",
      "Veranos más secos y ventosos que elevan el peligro de incendios forestales.",
      "Menor recarga de cuencas hidroeléctricas del Comahue.",
    ],
    detail:
      "En la Patagonia la señal del ENSO es más débil y heterogénea, y depende de cómo se combinen otros patrones como el SAM (Modo Anular del Sur). Aun así, los inviernos de El Niño suelen ser más fríos y con mayor probabilidad de nevadas en la cordillera, lo que puede favorecer la temporada de esquí pero también complicar los caminos y la actividad ganadera extensiva.",
    recommendations: [
      "Seguir los pronósticos de nieve y las condiciones de rutas de montaña.",
      "Prever forraje e infraestructura para inviernos fríos.",
      "Interpretar la señal con cautela: es la región con mayor incertidumbre.",
    ],
  },
];

export interface HistoricEvent {
  period: string;
  type: "El Niño" | "La Niña";
  intensity: string;
  peak: number;
  impact: string;
}

export const historicEvents: HistoricEvent[] = [
  {
    period: "1982–1983",
    type: "El Niño",
    intensity: "Muy fuerte",
    peak: 2.2,
    impact:
      "Uno de los más intensos del siglo. Inundaciones severas en el Litoral y grandes pérdidas agrícolas.",
  },
  {
    period: "1997–1998",
    type: "El Niño",
    intensity: "Muy fuerte",
    peak: 2.4,
    impact:
      "El Niño más fuerte registrado hasta entonces. Crecidas históricas del Paraná y anegamientos en la Pampa.",
  },
  {
    period: "2015–2016",
    type: "El Niño",
    intensity: "Muy fuerte",
    peak: 2.6,
    impact:
      "Sequía arrastrada seguida de lluvias intensas; crecidas del río Paraná y del río de la Plata.",
  },
  {
    period: "2023–2024",
    type: "El Niño",
    intensity: "Fuerte",
    peak: 2.0,
    impact:
      "Fuerte recarga hídrica tras la sequía de La Niña; alivio para el agro del centro-este.",
  },
  {
    period: "1988–1989",
    type: "La Niña",
    intensity: "Fuerte",
    peak: -1.9,
    impact: "Sequía en la región pampeana y caída de la producción de granos.",
  },
  {
    period: "2007–2008",
    type: "La Niña",
    intensity: "Fuerte",
    peak: -1.6,
    impact: "Déficit de lluvias y conflicto por la producción agropecuaria.",
  },
  {
    period: "2010–2012",
    type: "La Niña",
    intensity: "Fuerte",
    peak: -1.7,
    impact: "Dos eventos consecutivos con sequías y olas de calor en el centro del país.",
  },
  {
    period: "2020–2022",
    type: "La Niña",
    intensity: "Moderada",
    peak: -1.3,
    impact:
      "La Niña 'triple'. Bajante histórica del río Paraná y una de las peores sequías del agro argentino.",
  },
];

export type PhaseKey = "El Niño" | "La Niña" | "Neutral";

export const outlook: Record<PhaseKey, { title: string; items: string[] }> = {
  "El Niño": {
    title: "Qué suele ocurrir con El Niño activo",
    items: [
      "Primavera y verano con lluvias por encima de lo normal en el Litoral, el NEA y la Pampa húmeda.",
      "Mayor probabilidad de crecidas en los ríos Paraná, Paraguay y Uruguay.",
      "Temporada de tormentas severas más activa en el centro-este del país.",
      "Buena recarga de suelos para los cultivos de verano, con riesgo de excesos hídricos.",
    ],
  },
  "La Niña": {
    title: "Qué suele ocurrir con La Niña activa",
    items: [
      "Déficit de lluvias y sequías en la región pampeana y Cuyo.",
      "Mayor frecuencia de olas de calor en el centro del país.",
      "Bajante de los ríos de la cuenca del Plata, con impacto en el transporte y el agua potable.",
      "Menor producción agrícola y mayor riesgo de incendios.",
    ],
  },
  Neutral: {
    title: "Condiciones neutrales",
    items: [
      "El Pacífico no muestra una fase clara: mayor incertidumbre estacional.",
      "El clima local queda más determinado por patrones de escala regional.",
      "Puede ser una etapa de transición hacia El Niño o La Niña.",
      "Conviene monitorear los boletines de NOAA y el SMN semana a semana.",
    ],
  },
};

export interface FaqItem {
  q: string;
  a: string;
}

export const faq: FaqItem[] = [
  {
    q: "¿Qué es el fenómeno de El Niño?",
    a: "Es la fase cálida del ciclo climático natural conocido como ENSO (El Niño–Oscilación del Sur). Se caracteriza por el calentamiento inusual de las aguas del océano Pacífico ecuatorial central y oriental, lo que altera los patrones de viento, lluvia y temperatura en todo el planeta.",
  },
  {
    q: "¿Cuál es la diferencia entre El Niño y La Niña?",
    a: "El Niño es la fase cálida (aguas más calientes de lo normal) y La Niña es la fase fría (aguas más frías de lo normal). En Argentina, El Niño suele asociarse a más lluvias en el centro-este, mientras que La Niña tiende a producir sequías en la región pampeana.",
  },
  {
    q: "¿Qué es el ONI y por qué se usa?",
    a: "El ONI (Oceanic Niño Index) es el promedio de 3 meses de la anomalía de temperatura del mar en la región Niño 3.4. Es el indicador estándar de NOAA: valores sostenidos de +0,5 °C o más indican El Niño, y de −0,5 °C o menos, La Niña.",
  },
  {
    q: "¿Va a llover más en mi provincia?",
    a: "En líneas generales, durante El Niño aumentan las lluvias en el Litoral, el NEA y la región pampeana. El efecto es más débil y variable en Cuyo y la Patagonia. Consultá siempre los pronósticos del Servicio Meteorológico Nacional para tu localidad: El Niño describe una tendencia estacional, no un pronóstico diario.",
  },
  {
    q: "¿El Niño causa inundaciones?",
    a: "Puede aumentar el riesgo. Con más lluvia, crecen los caudales de los ríos Paraná, Paraguay y Uruguay, y pueden producirse inundaciones ribereñas y anegamientos en zonas bajas. No todas las crecidas se deben a El Niño, pero el fenómeno eleva la probabilidad.",
  },
  {
    q: "¿Cuánto dura un evento de El Niño?",
    a: "Normalmente entre 9 y 12 meses, a veces más. Suele alcanzar su máxima intensidad entre fines de un año y principios del siguiente, y luego decae hacia la fase neutral.",
  },
  {
    q: "¿El cambio climático tiene que ver?",
    a: "Son fenómenos distintos. El Niño es un ciclo natural del océano y la atmósfera, mientras que el cambio climático es la tendencia de calentamiento global por gases de efecto invernadero. El cambio climático puede intensificar algunos impactos del El Niño, pero no lo causa.",
  },
  {
    q: "¿El Niño afecta la nieve de la cordillera?",
    a: "Puede influir. En Cuyo y el norte de la Patagonia, los inviernos de El Niño suelen traer más nevadas en alta montaña, lo que mejora la reserva de agua para riego y la temporada de esquí. En el sur de la Patagonia la relación es más débil y depende de otros patrones como el SAM.",
  },
  {
    q: "¿Qué significa la 'Niña triple'?",
    a: "Fue la secuencia de tres inviernos consecutivos de La Niña entre 2020 y 2022. Su impacto más recordado en Argentina fue la bajante histórica del río Paraná y una de las sequías más severas del agro, con pérdidas millonarias en soja, maíz y trigo.",
  },
  {
    q: "¿Con qué frecuencia ocurre El Niño?",
    a: "El ciclo ENSO es irregular: El Niño o La Niña aparecen cada 2 a 7 años, y no todos los años hay una fase definida. Pueden alternarse, repetirse (como la Niña triple) o dar paso a períodos neutrales más largos.",
  },
  {
    q: "¿Cómo se pronostica El Niño?",
    a: "Se combinan observaciones (boyas del Pacífico, satélites, vientos) con modelos climáticos como los del IRI y los conjuntos del NMME. Los pronósticos son más confiables para la tendencia estacional que para un mes concreto, y se actualizan mes a mes.",
  },
];

export interface GlossaryItem {
  term: string;
  definition: string;
}

export const glossary: GlossaryItem[] = [
  { term: "ENSO", definition: "El Niño–Oscilación del Sur: ciclo climático acoplado océano-atmósfera en el Pacífico tropical." },
  { term: "ONI", definition: "Oceanic Niño Index: promedio móvil de 3 meses de la anomalía de SST en Niño 3.4." },
  { term: "SST", definition: "Sea Surface Temperature: temperatura de la superficie del mar." },
  { term: "Niño 3.4", definition: "Región del Pacífico ecuatorial central (120°O–170°O) usada para medir ENSO." },
  { term: "SOI", definition: "Southern Oscillation Index: índice de presión entre Darwin (Australia) y Tahití." },
  { term: "Fase cálida", definition: "Período con aguas más cálidas de lo normal: El Niño." },
  { term: "Fase fría", definition: "Período con aguas más frías de lo normal: La Niña." },
  { term: "Neutral", definition: "Condición en la que el ONI se mantiene entre −0,5 y +0,5 °C." },
  { term: "Niño 1+2", definition: "Región del Pacífico oriental, frente a Perú y Ecuador. La primera en calentarse durante El Niño." },
  { term: "Niño 3", definition: "Región del Pacífico ecuatorial oriental, al oeste de Niño 1+2." },
  { term: "Anomalía", definition: "Diferencia entre un valor observado y su promedio histórico. El ONI es una anomalía de temperatura." },
  { term: "Jet subtropical", definition: "Corriente de vientos en altura. Con El Niño se desplaza hacia el sur y guía las lluvias sobre el centro-este de Argentina." },
  { term: "SAM", definition: "Modo Anular del Sur: patrón de circulación que influye en el clima de la Patagonia y puede reforzar o atenuar la señal del ENSO." },
  { term: "PDO", definition: "Oscilación Decadal del Pacífico: variabilidad de largo plazo que modula la frecuencia e intensidad de El Niño." },
  { term: "MEI", definition: "Multivariate ENSO Index: índice que combina varias variables (presión, viento, temperatura) para medir ENSO." },
  { term: "Cuenca del Plata", definition: "Gran sistema fluvial que integra los ríos Paraná, Paraguay y Uruguay; su caudal responde con retraso a las lluvias de El Niño." },
  { term: "Onda de crecida", definition: "Pulso de agua que viaja río abajo durante semanas. Por eso un río puede crecer aunque no llueva localmente." },
  { term: "Pronóstico estacional", definition: "Estimación de tendencias para los próximos meses (más/menos lluvia o calor), no un pronóstico del tiempo diario." },
];

export const sources = [
  { name: "NOAA · Climate Prediction Center", url: "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/" },
  { name: "NOAA · ONI (datos)", url: "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt" },
  { name: "IRI · Pronóstico ENSO", url: "https://iri.columbia.edu/our-expertise/climate/forecasts/enso/current/" },
  { name: "Servicio Meteorológico Nacional (Argentina)", url: "https://www.smn.gob.ar/" },
  { name: "BOM · ENSO Wrap-Up (Australia)", url: "http://www.bom.gov.au/climate/enso/" },
];

export type CropStageType = "siembra" | "critico" | "cosecha" | "inactivo";

export interface AgroCrop {
  crop: string;
  window: string;
  months: Record<string, { type: CropStageType; label: string }>;
  ninoNote: string;
  ninaNote: string;
}

export const AGRO_MONTHS = ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May"] as const;

export const agroCalendar: AgroCrop[] = [
  {
    crop: "Soja de 1ª",
    window: "Oct – May",
    months: {
      Sep: { type: "inactivo", label: "Barbecho" },
      Oct: { type: "siembra", label: "Siembra" },
      Nov: { type: "siembra", label: "Siembra" },
      Dic: { type: "siembra", label: "Vegetativo" },
      Ene: { type: "critico", label: "Floración" },
      Feb: { type: "critico", label: "Llenado (R5)" },
      Mar: { type: "critico", label: "Madurez" },
      Abr: { type: "cosecha", label: "Cosecha" },
      May: { type: "cosecha", label: "Cosecha" },
    },
    ninoNote: "Excelente recarga para el período crítico (ene–feb); atención a enfermedades de fin de ciclo y piso de cosecha en abril.",
    ninaNote: "Alto riesgo de estrés hídrico en floración y llenado de vainas (enero–febrero), recortando rindes potenciales.",
  },
  {
    crop: "Maíz temprano",
    window: "Sep – Abr",
    months: {
      Sep: { type: "siembra", label: "Siembra" },
      Oct: { type: "siembra", label: "Siembra" },
      Nov: { type: "siembra", label: "Vegetativo" },
      Dic: { type: "critico", label: "Floración (R1)" },
      Ene: { type: "critico", label: "Llenado" },
      Feb: { type: "cosecha", label: "Secado" },
      Mar: { type: "cosecha", label: "Cosecha" },
      Abr: { type: "cosecha", label: "Cosecha" },
      May: { type: "inactivo", label: "Rastrojo" },
    },
    ninoNote: "Muy favorecido: lluvias de primavera aseguran implantación y agua en floración de diciembre.",
    ninaNote: "El cultivo más vulnerable si falla el agua en diciembre; en años Niña suele migrarse a fechas tardías.",
  },
  {
    crop: "Maíz tardío / 2ª",
    window: "Dic – Jun",
    months: {
      Sep: { type: "inactivo", label: "Barbecho" },
      Oct: { type: "inactivo", label: "Barbecho" },
      Nov: { type: "inactivo", label: "Barbecho" },
      Dic: { type: "siembra", label: "Siembra" },
      Ene: { type: "siembra", label: "Vegetativo" },
      Feb: { type: "critico", label: "Floración (R1)" },
      Mar: { type: "critico", label: "Llenado" },
      Abr: { type: "cosecha", label: "Madurez" },
      May: { type: "cosecha", label: "Cosecha" },
    },
    ninoNote: "Buena disponibilidad hídrica en febrero–marzo, aunque con mayor humedad de grano a cosecha.",
    ninaNote: "Estrategia defensiva clásica en años Niña para esquivar el pulso seco de diciembre–enero.",
  },
  {
    crop: "Trigo (fina)",
    window: "May – Dic",
    months: {
      Sep: { type: "critico", label: "Espigazón" },
      Oct: { type: "critico", label: "Llenado" },
      Nov: { type: "cosecha", label: "Cosecha" },
      Dic: { type: "cosecha", label: "Cosecha" },
      Ene: { type: "inactivo", label: "Rastrojo" },
      Feb: { type: "inactivo", label: "Rastrojo" },
      Mar: { type: "inactivo", label: "Barbecho" },
      Abr: { type: "inactivo", label: "Barbecho" },
      May: { type: "siembra", label: "Siembra" },
    },
    ninoNote: "Primaveras húmedas mejoran el llenado, pero elevan el riesgo de fusariosis de la espiga y demoras de trilla.",
    ninaNote: "Salidas del invierno secas y heladas tardías golpean el macollaje y la espigazón en septiembre–octubre.",
  },
];

export interface ProvinceInfo {
  slug: string;
  name: string;
  regionSlug: string;
  exposure: "Muy alta" | "Alta" | "Moderada" | "Baja";
  sectors: string;
  ninoImpact: string;
  ninaImpact: string;
  keyRisk: string;
}

export const provincesData: ProvinceInfo[] = [
  {
    slug: "buenos-aires",
    name: "Buenos Aires",
    regionSlug: "pampeana",
    exposure: "Alta",
    sectors: "Soja, maíz, trigo, girasol, cebada y ganadería vacuna",
    ninoImpact: "Primaveras y veranos más lluviosos recargan los perfiles agrícolas, con riesgo de anegamientos en la cuenca del Salado y el noroeste bonaerense.",
    ninaImpact: "Déficit hídrico marcado en zona núcleo norte y centro, olas de calor estivales y recorte de rindes en gruesa.",
    keyRisk: "Excesos hídricos en bajos de la cuenca del Salado (El Niño) y sequía estival en zona núcleo (La Niña).",
  },
  {
    slug: "cordoba",
    name: "Córdoba",
    regionSlug: "pampeana",
    exposure: "Alta",
    sectors: "Maíz, soja, maní, trigo, lechería y ganadería",
    ninoImpact: "Excelente recarga de suelos en el sudeste y centro provincial; crecidas repentinas en ríos serranos durante tormentas convectivas.",
    ninaImpact: "Primaveras secas que demoran la siembra de maíz temprano y aumentan el peligro de incendios en las sierras.",
    keyRisk: "Anegamientos en el sudeste (departamento Marcos Juárez y Unión) y crecidas serranas en verano.",
  },
  {
    slug: "santa-fe",
    name: "Santa Fe",
    regionSlug: "pampeana",
    exposure: "Muy alta",
    sectors: "Complejo agroexportador, soja, maíz, trigo, lechería y puertos del Paraná",
    ninoImpact: "Doble impacto: lluvias abundantes sobre los lotes agrícolas y crecida del río Paraná por aportes de la cuenca alta en Brasil.",
    ninaImpact: "Sequía en la franja agrícola e histórica bajante del Paraná que reduce el calado de buques en el Gran Rosario.",
    keyRisk: "Crecida del Paraná y excesos en bajos submeridionales (El Niño) vs. logística portuaria crítica por bajante (La Niña).",
  },
  {
    slug: "entre-rios",
    name: "Entre Ríos",
    regionSlug: "litoral",
    exposure: "Muy alta",
    sectors: "Arroz, soja, maíz, trigo, citricultura, avicultura y forestación",
    ninoImpact: "Una de las provincias con señal más directa: lluvias intensas y crecidas simultáneas de los ríos Paraná y Uruguay.",
    ninaImpact: "Déficit de lluvias en suelos vertisoles que amplifica el estrés de los cultivos y bajante pronunciada en ambos ríos.",
    keyRisk: "Inundaciones ribereñas en ciudades del Paraná y del Uruguay y erosión hídrica de suelos.",
  },
  {
    slug: "corrientes",
    name: "Corrientes",
    regionSlug: "litoral",
    exposure: "Muy alta",
    sectors: "Arroz, ganadería, forestación, yerba mate y citricultura",
    ninoImpact: "Lluvias muy superiores a la media en otoño y primavera, desbordes en esteros y crecidas de los ríos Paraná y Uruguay.",
    ninaImpact: "Retroceso de humedales y esteros del Iberá, déficit hídrico severo y altísimo riesgo de incendios rurales y forestales.",
    keyRisk: "Crecidas extraordinarias del Paraná/Uruguay (El Niño) e incendios de esteros y forestaciones (La Niña).",
  },
  {
    slug: "misiones",
    name: "Misiones",
    regionSlug: "litoral",
    exposure: "Muy alta",
    sectors: "Yerba mate, té, foresto-industria, tabaco y turismo (Iguazú)",
    ninoImpact: "Tormentas frecuentes e intensas desde la primavera y caudales extraordinarios en los ríos Iguazú, Paraná y Uruguay.",
    ninaImpact: "Períodos secos inusuales para la selva paranaense, caída del caudal de las Cataratas y estrés en yerbales.",
    keyRisk: "Desbordes de arroyos, tormentas severas y crecidas del río Iguazú y alto Paraná.",
  },
  {
    slug: "chaco",
    name: "Chaco",
    regionSlug: "litoral",
    exposure: "Alta",
    sectors: "Algodón, soja, girasol, maíz, ganadería y sector forestal",
    ninoImpact: "Excesos hídricos en el este provincial y crecidas en la confluencia de los ríos Paraguay y Paraná (área Gran Resistencia).",
    ninaImpact: "Sequías prolongadas en el centro-oeste chaqueño, falta de agua para hacienda y olas de calor extremas.",
    keyRisk: "Anegamientos de bajos y crecida del eje Paraguay–Paraná durante eventos fuertes de El Niño.",
  },
  {
    slug: "formosa",
    name: "Formosa",
    regionSlug: "litoral",
    exposure: "Alta",
    sectors: "Ganadería, algodón, maíz, banana y horticultura subtropical",
    ninoImpact: "Crecida sostenida del río Paraguay y lluvias intensas en el este provincial con desbordes en riachos.",
    ninaImpact: "Marcado déficit hídrico en el oeste y centro y bajante del río Paraguay.",
    keyRisk: "Crecida del río Paraguay en Puerto Pilcomayo y Formosa capital.",
  },
  {
    slug: "la-pampa",
    name: "La Pampa",
    regionSlug: "pampeana",
    exposure: "Moderada",
    sectors: "Trigo, girasol, maíz, cebada y ganadería de cría e invernada",
    ninoImpact: "Mayor aporte de lluvias en el noreste agrícola (franja esteparia húmeda), mejorando reservas para trigo y girasol.",
    ninaImpact: "Vuelven las condiciones semiáridas marcadas, vientos secos y riesgo de incendios de pastizales y monte en verano.",
    keyRisk: "Sequía e incendios de caldenal durante La Niña; anegamientos puntuales en el noreste con El Niño.",
  },
  {
    slug: "caba",
    name: "Ciudad de Buenos Aires",
    regionSlug: "pampeana",
    exposure: "Alta",
    sectors: "Infraestructura urbana, servicios, transporte y costa del Río de la Plata",
    ninoImpact: "Mayor frecuencia de tormentas intensas de corto plazo y sudestadas combinadas con niveles altos en la cuenca del Plata.",
    ninaImpact: "Veranos con olas de calor más persistentes y menor frecuencia de precipitaciones.",
    keyRisk: "Tormentas convectivas severas con acumulados rápidos y crecidas del Río de la Plata.",
  },
  {
    slug: "mendoza",
    name: "Mendoza",
    regionSlug: "cuyo",
    exposure: "Moderada",
    sectors: "Vitivinicultura, frutales, olivo, horticultura, turismo de nieve y energía",
    ninoImpact: "Inviernos con mayor probabilidad de nevadas intensas en alta montaña, mejorando el pronóstico de escurrimiento de los ríos para el verano siguiente.",
    ninaImpact: "Inviernos secos en cordillera que profundizan la escasez hídrica en los oasis regados (ríos Mendoza, Tunuyán, Diamante y Atuel).",
    keyRisk: "Temporales de nieve y cierres del paso internacional en invierno (El Niño); crisis hídrica de riego (La Niña).",
  },
  {
    slug: "san-juan",
    name: "San Juan",
    regionSlug: "cuyo",
    exposure: "Moderada",
    sectors: "Vitivinicultura, olivo, pistachos, minería cordillerana y horticultura",
    ninoImpact: "Mayor acumulación nívea en la alta cuenca del río San Juan y río Jáchal durante los meses de invierno.",
    ninaImpact: "Escasas nevadas cordilleranas que reducen drásticamente el aporte de deshielo estival a los diques provinciales.",
    keyRisk: "Baja recarga nívea en años de La Niña y eventos de viento Zonda e inestabilidad en alta montaña.",
  },
  {
    slug: "san-luis",
    name: "San Luis",
    regionSlug: "cuyo",
    exposure: "Moderada",
    sectors: "Maíz, ganadería bovina, soja y turismo serrano",
    ninoImpact: "Zona de transición con la Pampa húmeda: primaveras y veranos con mejor oferta de agua para maíz y pasturas.",
    ninaImpact: "Retraso del inicio de las lluvias de primavera y peligro elevado de incendios en las sierras de San Luis y Comechingones.",
    keyRisk: "Tormentas graniceras estivales (El Niño) y sequía primaveral con incendios serranos (La Niña).",
  },
  {
    slug: "salta",
    name: "Salta",
    regionSlug: "noa",
    exposure: "Moderada",
    sectors: "Poroto, soja, maíz, caña de azúcar, tabaco, cítricos, vid y minería",
    ninoImpact: "Señal mixta: lluvias estivales intensas en yungas y valles con crecidas de ríos de montaña, aunque el Chaco salteño puede tener arranques irregulares.",
    ninaImpact: "Olas de calor en primavera y lluvias muy concentradas en el verano sobre las laderas orientales.",
    keyRisk: "Crecidas repentinas de ríos (Bermejo, Pilcomayo, Juramento) y aludes en rutas de quebradas.",
  },
  {
    slug: "jujuy",
    name: "Jujuy",
    regionSlug: "noa",
    exposure: "Moderada",
    sectors: "Caña de azúcar, tabaco, cítricos, horticultura, litio y turismo en Quebrada",
    ninoImpact: "Tormentas estivales intensas en valles y yungas, con riesgo de aludes y crecidas en la Quebrada de Humahuaca.",
    ninaImpact: "En la Puna y Quebrada puede observarse actividad convectiva estival intensa a pesar de la señal fría global.",
    keyRisk: "Deslizamientos y aludes estivales sobre la RN 9 y crecidas del río Grande.",
  },
  {
    slug: "tucuman",
    name: "Tucumán",
    regionSlug: "noa",
    exposure: "Moderada",
    sectors: "Limón (citricultura), caña de azúcar, arándanos y granos en el este",
    ninoImpact: "Veranos húmedos y cálidos con lluvias abundantes en el pedemonte del Aconquija, favoreciendo el desarrollo de caña y cítricos.",
    ninaImpact: "Primaveras muy secas y calurosas que demoran la recarga hídrica hasta entrado el verano.",
    keyRisk: "Desbordes de ríos pedemontanos y anegamientos en el sur tucumano en meses estivales.",
  },
  {
    slug: "santiago-del-estero",
    name: "Santiago del Estero",
    regionSlug: "noa",
    exposure: "Alta",
    sectors: "Algodón, maíz, soja, trigo y ganadería vacuna y caprina",
    ninoImpact: "El este agrícola (límite con Chaco y Santa Fe) recibe un plus de lluvias clave para algodón, maíz y soja.",
    ninaImpact: "Fuerte déficit hídrico acompañado de temperaturas extremas que golpean los cultivos de secano.",
    keyRisk: "Golpes de calor extremos y déficit hídrico (La Niña) vs. crecidas en la cuenca del Salado–Dulce (El Niño).",
  },
  {
    slug: "catamarca",
    name: "Catamarca",
    regionSlug: "noa",
    exposure: "Baja",
    sectors: "Olivo, nogal, vid, minería y ganadería árida",
    ninoImpact: "Señal débil a moderada, concentrada en tormentas estivales sobre el valle central y las sierras del este.",
    ninaImpact: "Primaveras secas con vientos intensos y amplitud térmica marcada.",
    keyRisk: "Crecidas repentinas de ríos y arroyos serranos durante tormentas de verano.",
  },
  {
    slug: "la-rioja",
    name: "La Rioja",
    regionSlug: "noa",
    exposure: "Baja",
    sectors: "Olivicultura, vitivinicultura, nogal y turismo",
    ninoImpact: "Efecto tenue: eventuales lluvias estivales por encima de la media histórica en los llanos riojanos.",
    ninaImpact: "Acentuación de la aridez natural y escasez de recarga en pequeños diques y acuíferos.",
    keyRisk: "Déficit hídrico crónico para riego y tormentas aisladas severas en verano.",
  },
  {
    slug: "neuquen",
    name: "Neuquén",
    regionSlug: "patagonia",
    exposure: "Moderada",
    sectors: "Hidrocarburos (Vaca Muerta), hidroelectricidad, fruticultura y turismo de nieve",
    ninoImpact: "Inviernos con mayor frecuencia de frentes fríos y nevadas en la cordillera neuquina, beneficiando centros de esquí y represas del Limay y Neuquén.",
    ninaImpact: "Inviernos más secos en cordillera y veranos cálidos que elevan el peligro de incendios en bosques andino-patagónicos.",
    keyRisk: "Bajante de embalses e incendios forestales en años Niña; temporales de nieve en invierno con El Niño.",
  },
  {
    slug: "rio-negro",
    name: "Río Negro",
    regionSlug: "patagonia",
    exposure: "Moderada",
    sectors: "Fruticultura de pepita (manzana y pera) en Alto Valle, turismo en Bariloche y ganadería",
    ninoImpact: "Mayor aporte níveo invernal en la zona andina (Bariloche/El Bolsón) y buena disponibilidad de agua en el río Negro.",
    ninaImpact: "Veranos más secos y cálidos en la cordillera rionegrina, con alto índice de peligrosidad de incendios forestales.",
    keyRisk: "Incendios de interfase en la comarca andina (La Niña) y heladas tardías o granizo en el Alto Valle.",
  },
  {
    slug: "chubut",
    name: "Chubut",
    regionSlug: "patagonia",
    exposure: "Baja",
    sectors: "Ganadería ovina, pesca, petróleo, aluminio y fruta fina en la comarca",
    ninoImpact: "Señal débil y modulada por el índice SAM; inviernos potencialmente más fríos y nevadores en la meseta y cordillera.",
    ninaImpact: "Tendencia a primaveras y veranos más ventosos y secos en la estepa y la cordillera.",
    keyRisk: "Nevadas intensas en la meseta central en invierno que afectan la hacienda ovina y rutas nacionales.",
  },
  {
    slug: "santa-cruz",
    name: "Santa Cruz",
    regionSlug: "patagonia",
    exposure: "Baja",
    sectors: "Ganadería ovina extensiva, turismo (Glaciares), minería y energía",
    ninoImpact: "Teleconexión climática débil; posibles inviernos más fríos con irrupciones de aire polar sobre la estepa.",
    ninaImpact: "El clima queda dominado por el Modo Anular del Sur (SAM), con vientos del oeste más intensos.",
    keyRisk: "Inviernos rigurosos con escarcha y nieve que complican la logística rural.",
  },
  {
    slug: "tierra-del-fuego",
    name: "Tierra del Fuego",
    regionSlug: "patagonia",
    exposure: "Baja",
    sectors: "Industria tecnológica, turismo antártico/invernal, pesca y ganadería",
    ninoImpact: "La jurisdicción más austral presenta baja correlación directa con Niño 3.4, predominando la variabilidad subantártica y el SAM.",
    ninaImpact: "Mayor influencia de los vientos subpolares del oeste según la fase del Modo Anular del Sur.",
    keyRisk: "Temporales invernales de nieve y hielo en el paso Garibaldi (RN 3).",
  },
];

export const provinceByName = Object.fromEntries(provincesData.map((p) => [p.name, p]));
export const provinceBySlug = Object.fromEntries(provincesData.map((p) => [p.slug, p]));

