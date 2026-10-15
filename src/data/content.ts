export const site = {
  name: "El Niño Argentina",
  tagline: "El fenómeno que marca el clima del país",
  description:
    "Estado actual, pronóstico, impactos por región e historia del fenómeno de El Niño y La Niña (ENSO) en Argentina. Datos oficiales de NOAA y el SMN.",
  url: "https://xn--elnio-rta.net.ar",
  domain: "elniño.net.ar",
  adsenseClient: "", // ej: "ca-pub-0000000000000000" cuando se apruebe AdSense
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

export interface Region {
  slug: string;
  name: string;
  provinces: string;
  icon: string;
  summary: string;
  points: string[];
  detail: string;
  recommendations: string[];
}

export const regions: Region[] = [
  {
    slug: "litoral",
    name: "Litoral y NEA",
    provinces: "Misiones, Corrientes, Chaco, Formosa, Entre Ríos, Santa Fe",
    icon: "🌊",
    summary:
      "La zona más expuesta al El Niño: lluvias por encima de lo normal y crecidas de los ríos Paraná, Paraguay y Uruguay.",
    points: [
      "Precipitaciones superiores a la media, con eventos intensos en primavera y verano.",
      "Incremento del caudal del río Paraná: mayor riesgo de inundaciones ribereñas.",
      "Afecta el transporte fluvial, la pesca y las cosechas de la región.",
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
    icon: "🌾",
    summary:
      "El corazón productivo del país. El Niño suele traer más lluvia, lo que puede mejorar rindes pero también generar excesos hídricos.",
    points: [
      "Mayor recarga de suelos: históricamente mejora los rindes de soja y maíz.",
      "Riesgo de anegamientos y excesos de agua en campos bajos.",
      "Aumento de tormentas severas y caída de granizo en verano.",
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
    icon: "🏔️",
    summary:
      "Efecto más variable y en general moderado, con impacto sobre la nieve de cordillera y los caudales de riego.",
    points: [
      "Acumulación de nieve en cordillera variable según el año.",
      "Relación indirecta con la disponibilidad de agua para riego.",
      "Menor señal climática que en el centro-este del país.",
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
    icon: "⛰️",
    summary:
      "Veranos más lluviosos y actividad convectiva más intensa sobre las yungas y los valles.",
    points: [
      "Aumento de lluvias estivales y crecidas de ríos de montaña.",
      "Mayor riesgo de aludes y crecidas en zonas cordilleranas.",
      "Impacto en cultivos subtropicales (caña, cítricos).",
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
    icon: "❄️",
    summary:
      "Inviernos fríos y variables. La señal del El Niño es más débil y heterogénea que en el resto del país.",
    points: [
      "Mayor probabilidad de nevadas en cordillera en invierno.",
      "Temporada de esquí que puede verse favorecida.",
      "Impactos sobre la cría de ganado ovino y caprino.",
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
];

export const sources = [
  { name: "NOAA · Climate Prediction Center", url: "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/" },
  { name: "NOAA · ONI (datos)", url: "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt" },
  { name: "IRI · Pronóstico ENSO", url: "https://iri.columbia.edu/our-expertise/climate/forecasts/enso/current/" },
  { name: "Servicio Meteorológico Nacional (Argentina)", url: "https://www.smn.gob.ar/" },
  { name: "BOM · ENSO Wrap-Up (Australia)", url: "http://www.bom.gov.au/climate/enso/" },
];
