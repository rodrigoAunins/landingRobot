export type Character = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  accent: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  event: string;
  isPlaceholder: boolean;
};

export type Venue = {
  name: string;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
  isPlaceholder: boolean;
};

export type Contact = {
  role: string;
  name: string;
  phone: string;
  location: string;
  isPlaceholder: boolean;
};

export type ProvinceId = "tucuman" | "santiago";

export type QuoteLocality = {
  id: string;
  label: string;
  detail?: string;
};

export type QuoteProvince = {
  id: ProvinceId;
  label: string;
  shortLabel: string;
  localities: QuoteLocality[];
};

export type QuoteMonth = {
  id: string;
  label: string;
  prices: Record<ProvinceId, number>;
};

export const brand = {
  name: "Robot LED Eventos",
  eyebrow: "Animación que enciende tu noche",
  whatsappNumber: "",
  whatsappMessage: "¡Quiero contratar sus servicios!",
};

export const characters: Character[] = [
  {
    id: "gorila",
    title: "Gorila",
    tagline: "La energía más salvaje",
    description:
      "Una entrada que nadie espera y todos quieren filmar. Baile, humor y pura energía para romper el hielo.",
    image: "/images/gorila.webp",
    imageAlt: "Animador con traje de gorila bailando en una fiesta",
    accent: "#ff7a64",
  },
  {
    id: "conejo",
    title: "Conejo",
    tagline: "Ternura que sabe bailar",
    description:
      "Carisma, color y pasos contagiosos para cumpleaños infantiles, recepciones y momentos inolvidables.",
    image: "/images/conejo.webp",
    imageAlt: "Conejo animador con chaqueta coral bailando",
    accent: "#ffc737",
  },
  {
    id: "osos",
    title: "Osos",
    tagline: "Abrazos gigantes",
    description:
      "Ideales para fiestas infantiles y XV. Estos osos llenos de amor alegrarán cada minuto de tu noche especial.",
    image: "/images/osos.webp",
    imageAlt: "Dos osos animadores saludando en una fiesta",
    accent: "#5ee6d4",
  },
  {
    id: "recepcion",
    title: "Recepción",
    tagline: "La magia comienza al llegar",
    description:
      "Personajes elegantes reciben a tus invitados, posan para fotos y convierten la entrada en parte del show.",
    image: "/images/recepcion.webp",
    imageAlt: "Dos personajes de recepción con vestuario iluminado",
    accent: "#a88bff",
  },
  {
    id: "robots-led",
    title: "Robots LED",
    tagline: "El show que enciende todo",
    description:
      "Luces, ritmo y una presencia impactante. El momento más espectacular para levantar la pista y sorprender a todos.",
    image: "/images/robots-led.webp",
    imageAlt: "Dos robots LED realizando un show en la pista",
    accent: "#48cdf5",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Los robots aparecieron justo en el momento indicado y la pista explotó. Grandes y chicos no pararon de bailar.",
    author: "Nombre de cliente",
    event: "Fiesta de XV · Tucumán",
    isPlaceholder: true,
  },
  {
    quote:
      "Desde la recepción hasta el cierre fueron súper atentos. Los osos hicieron que cada foto fuera especial.",
    author: "Nombre de cliente",
    event: "Cumpleaños familiar · Santiago",
    isPlaceholder: true,
  },
  {
    quote:
      "Llegaron con tiempo, coordinaron todo con el salón y nos dejaron disfrutar. Un show realmente inolvidable.",
    author: "Nombre de cliente",
    event: "Evento social · Tucumán",
    isPlaceholder: true,
  },
];

export const venues: Venue[] = [
  {
    name: "Salón de referencia 01",
    location: "Tucumán Capital",
    description: "Entrada LED en una noche de XV.",
    image: "/images/salon-tucuman.webp",
    imageAlt: "Robots LED ingresando a un salón durante una fiesta de quince",
    isPlaceholder: true,
  },
  {
    name: "Salón de referencia 02",
    location: "Santiago del Estero Capital",
    description: "Una pista llena de alegría en familia.",
    image: "/images/salon-santiago.webp",
    imageAlt: "Osito y conejo animando una celebración familiar",
    isPlaceholder: true,
  },
  {
    name: "Salón de referencia 03",
    location: "Cobertura regional",
    description: "Recepción y show para una experiencia completa.",
    image: "/images/salon-regional.webp",
    imageAlt: "Personajes de recepción y robots LED en un salón elegante",
    isPlaceholder: true,
  },
];

export const contacts: Contact[] = [
  {
    role: "Dirección general",
    name: "Nombre del dueño/a",
    phone: "Teléfono pendiente",
    location: "Tucumán y Santiago",
    isPlaceholder: true,
  },
  {
    role: "Ventas Tucumán",
    name: "Nombre del vendedor/a",
    phone: "Teléfono pendiente",
    location: "Tucumán Capital",
    isPlaceholder: true,
  },
  {
    role: "Ventas Santiago",
    name: "Nombre del vendedor/a",
    phone: "Teléfono pendiente",
    location: "Santiago del Estero Capital",
    isPlaceholder: true,
  },
];

export const quoteProvinces: QuoteProvince[] = [
  {
    id: "tucuman",
    label: "Tucumán",
    shortLabel: "Tucumán",
    localities: [
      {
        id: "tucuman-metro",
        label: "Capital y área metropolitana",
        detail: "Yerba Buena, Banda del Río Salí, Delfín Gallo, San Andrés y alrededores.",
      },
      { id: "famailla", label: "Famaillá" },
      { id: "concepcion", label: "Concepción" },
    ],
  },
  {
    id: "santiago",
    label: "Santiago del Estero",
    shortLabel: "Santiago",
    localities: [
      {
        id: "santiago-metro",
        label: "Capital y área metropolitana",
        detail: "Incluye La Banda y localidades cercanas.",
      },
      { id: "villa-ojo-de-agua", label: "Villa Ojo de Agua" },
      { id: "monte-quemado", label: "Monte Quemado" },
    ],
  },
];

export const quoteMonths: QuoteMonth[] = [
  { id: "2026-08", label: "Agosto 2026", prices: { tucuman: 180000, santiago: 190000 } },
  { id: "2026-09", label: "Septiembre 2026", prices: { tucuman: 180000, santiago: 190000 } },
  { id: "2026-10", label: "Octubre 2026", prices: { tucuman: 200000, santiago: 200100 } },
  { id: "2026-11", label: "Noviembre 2026", prices: { tucuman: 200000, santiago: 200100 } },
  { id: "2026-12", label: "Diciembre 2026", prices: { tucuman: 220000, santiago: 200400 } },
  { id: "2027-01", label: "Enero 2027", prices: { tucuman: 220000, santiago: 200400 } },
  { id: "2027-02", label: "Febrero 2027", prices: { tucuman: 220000, santiago: 200400 } },
];

export const fewSlotsDates = [
  "2026-08-14",
  "2026-08-15",
  "2026-08-16",
  "2026-08-21",
  "2026-08-22",
  "2026-08-23",
  "2026-08-28",
  "2026-08-29",
  "2026-08-30",
];

export function getWhatsAppUrl(
  customMessage = brand.whatsappMessage,
  phoneNumber = brand.whatsappNumber,
) {
  const number = phoneNumber.replace(/\D/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(customMessage)}`;
}
