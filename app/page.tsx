"use client";

import { useEffect, useRef, useState } from "react";
import {
  brand,
  characters,
  contacts,
  fewSlotsDates,
  getWhatsAppUrl,
  quoteMonths,
  quoteProvinces,
  testimonials,
  venues,
  type ProvinceId,
} from "./content";

const navItems = [
  ["Personajes", "personajes"],
  ["Cotización", "cotizacion"],
  ["Nosotros", "nosotros"],
  ["Momentos", "momentos"],
  ["Contacto", "contacto"],
] as const;

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return <span aria-hidden="true">{direction === "left" ? "←" : "→"}</span>;
}

function WhatsAppIcon() {
  return <span aria-hidden="true" className="whatsapp-icon">✦</span>;
}

export default function Home() {
  const touchStartRef = useRef<number | null>(null);
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedHeadline, setTypedHeadline] = useState("");
  const [activeCharacter, setActiveCharacter] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(3);
  const [trackIndex, setTrackIndex] = useState(characters.length);
  const [cardStep, setCardStep] = useState(0);
  const [animateCarousel, setAnimateCarousel] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [quoteProvince, setQuoteProvince] = useState<ProvinceId>("tucuman");
  const [quoteLocality, setQuoteLocality] = useState("tucuman-metro");
  const [quoteMonth, setQuoteMonth] = useState("2026-08");
  const [quoteDay, setQuoteDay] = useState("");
  const [quoteCharacters, setQuoteCharacters] = useState<string[]>(["robots-led"]);

  useEffect(() => {
    const headline = "Número 1 en fiestas";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => setTypedHeadline(headline), 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    let current = 0;
    const timer = window.setInterval(() => {
      current += 1;
      setTypedHeadline(headline.slice(0, current));
      if (current >= headline.length) window.clearInterval(timer);
    }, 82);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateVisibleCharacters = () => {
      setAnimateCarousel(false);
      const visible = window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3;
      setVisibleCharacters(visible);
      window.requestAnimationFrame(() => {
        const firstCard = carouselTrackRef.current?.querySelector<HTMLElement>(".character-card");
        const trackStyles = carouselTrackRef.current
          ? window.getComputedStyle(carouselTrackRef.current)
          : null;
        const gap = trackStyles ? Number.parseFloat(trackStyles.columnGap) || 0 : 0;
        setCardStep(firstCard ? firstCard.getBoundingClientRect().width + gap : 0);
        window.requestAnimationFrame(() => setAnimateCarousel(true));
      });
    };
    updateVisibleCharacters();
    window.addEventListener("resize", updateVisibleCharacters);
    return () => window.removeEventListener("resize", updateVisibleCharacters);
  }, []);

  const goToCharacter = (index: number) => {
    if (isSliding) return;
    const normalizedIndex = (index + characters.length) % characters.length;
    const forwardDistance = (normalizedIndex - activeCharacter + characters.length) % characters.length;
    if (forwardDistance === 0) return;
    setAnimateCarousel(true);
    setIsSliding(true);
    setTrackIndex((current) => current + forwardDistance);
    setActiveCharacter(normalizedIndex);
  };

  const scrollCarousel = (direction: number) => {
    if (isSliding) return;
    setAnimateCarousel(true);
    setIsSliding(true);
    setTrackIndex((current) => current + direction);
    setActiveCharacter((current) => (current + direction + characters.length) % characters.length);
  };

  const finishCarouselMovement = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    setIsSliding(false);
    if (trackIndex < characters.length || trackIndex >= characters.length * 2) {
      const normalizedTrackIndex = characters.length
        + ((trackIndex % characters.length) + characters.length) % characters.length;
      const track = carouselTrackRef.current;

      if (track) {
        track.style.transition = "none";
        track.style.transform = `translate3d(${-normalizedTrackIndex * cardStep}px, 0, 0)`;
        void track.offsetWidth;
      }

      setAnimateCarousel(false);
      setTrackIndex(normalizedTrackIndex);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (track) track.style.removeProperty("transition");
          setAnimateCarousel(true);
        });
      });
    }
  };

  const carouselCharacters = [...characters, ...characters, ...characters];

  const selectedProvince = quoteProvinces.find((province) => province.id === quoteProvince)
    ?? quoteProvinces[0];
  const selectedMonth = quoteMonths.find((month) => month.id === quoteMonth) ?? quoteMonths[0];
  const selectedLocality = selectedProvince.localities.find((locality) => locality.id === quoteLocality)
    ?? selectedProvince.localities[0];
  const selectedCharacterNames = characters
    .filter((character) => quoteCharacters.includes(character.id))
    .map((character) => character.title);
  const unitPrice = selectedMonth.prices[quoteProvince];
  const totalPrice = unitPrice * quoteCharacters.length;
  const sellerContact = quoteProvince === "tucuman" ? contacts[1] : contacts[2];
  const [quoteYear, quoteMonthNumber] = quoteMonth.split("-").map(Number);
  const quoteMonthLastDay = new Date(quoteYear, quoteMonthNumber, 0).getDate();
  const firstAvailableDay = quoteMonth === "2026-08" ? 13 : 1;
  const quoteDayOptions = Array.from(
    { length: quoteMonthLastDay - firstAvailableDay + 1 },
    (_, index) => firstAvailableDay + index,
  );
  const availableQuoteYears = [...new Set(quoteMonths.map((month) => month.id.slice(0, 4)))];
  const monthsForSelectedYear = quoteMonths.filter((month) => month.id.startsWith(String(quoteYear)));
  const quoteDate = quoteDay ? `${quoteMonth}-${quoteDay.padStart(2, "0")}` : "";
  const quoteAvailability = !quoteDate
    ? "Elegí una fecha"
    : fewSlotsDates.includes(quoteDate)
      ? "Últimos cupos disponibles"
      : "Disponible";
  const formattedQuoteDate = quoteDate
    ? new Intl.DateTimeFormat("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${quoteDate}T12:00:00Z`))
    : selectedMonth.label;
  const quoteMessage = [
    "¡Hola! Quiero consultar una cotización.",
    `Fecha: ${formattedQuoteDate}.`,
    `Lugar: ${selectedLocality.label}, ${selectedProvince.label}.`,
    `Personajes: ${selectedCharacterNames.length ? selectedCharacterNames.join(", ") : "a definir"}.`,
    totalPrice ? `Valor estimado mostrado: $${totalPrice.toLocaleString("es-AR")}.` : "Cantidad de personajes: a definir.",
    `Disponibilidad indicada: ${quoteAvailability}.`,
  ].join(" ");

  const toggleQuoteCharacter = (characterId: string) => {
    setQuoteCharacters((selected) => selected.includes(characterId)
      ? selected.filter((id) => id !== characterId)
      : [...selected, characterId]);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <a className="skip-link" href="#personajes">Saltar al contenido</a>

      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <img
          className="hero-image"
          src="/images/hero-party.webp"
          alt="Robots LED y personajes animando una gran fiesta"
        />
        <div className="hero-overlay" />
        <header className="site-header">
          <a className="brand" href="#inicio" aria-label="Robot LED Eventos, inicio">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>Robot <strong>LED</strong><small>eventos</small></span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">Abrir navegación</span>
            <i /><i />
          </button>
          <nav id="site-navigation" className={menuOpen ? "nav open" : "nav"} aria-label="Principal">
            {navItems.map(([label, target]) => (
              <a key={target} href={`#${target}`} onClick={closeMenu}>{label}</a>
            ))}
            <a className="nav-cta" href={getWhatsAppUrl()} target="_blank" rel="noreferrer">
              Hablemos
            </a>
          </nav>
        </header>

        <div className="hero-content">
          <p className="eyebrow hero-eyebrow"><span />{brand.eyebrow}</p>
          <h1 id="hero-title" aria-label="Número 1 en fiestas">
            <span className="headline-line">{typedHeadline || "\u00A0"}</span>
            <span className="typing-cursor" aria-hidden="true" />
          </h1>
          <p className="hero-copy">
            Personajes que sorprenden. Luces que transforman.<br />Una noche que nadie va a olvidar.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#personajes">Conocé el show <ArrowIcon direction="right" /></a>
            <a className="text-link" href={getWhatsAppUrl()} target="_blank" rel="noreferrer">Reservá tu fecha <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <a className="scroll-cue" href="#personajes"><span>Descubrí más</span><i aria-hidden="true" /></a>
        <div className="hero-location"><span>10+</span><small>Años creando<br />momentos únicos</small></div>
      </section>

      <section className="characters-section section" id="personajes" aria-labelledby="characters-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span />Elegí tu experiencia</p>
            <h2 id="characters-title">Un personaje para<br /><em>cada momento.</em></h2>
          </div>
          <div className="heading-side">
            <p>Cada propuesta tiene su propia energía. Deslizá, elegí y preparate para sorprender.</p>
            <div className="carousel-controls" aria-label="Controles del carrusel">
              <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Ver personaje anterior"><ArrowIcon direction="left" /></button>
              <button type="button" onClick={() => scrollCarousel(1)} aria-label="Ver personaje siguiente"><ArrowIcon direction="right" /></button>
            </div>
          </div>
        </div>

        <div className="carousel-shell">
          <button className="carousel-side-button carousel-side-button-left" type="button" onClick={() => scrollCarousel(-1)} aria-label="Rotar carrusel hacia la izquierda"><ArrowIcon direction="left" /></button>
          <div className="carousel-viewport" ref={carouselViewportRef}>
          <div
            className={animateCarousel ? "character-carousel is-animated" : "character-carousel"}
            ref={carouselTrackRef}
            role="region"
            aria-label={`${visibleCharacters} personajes visibles de ${characters.length}`}
            style={{ transform: `translate3d(${-trackIndex * cardStep}px, 0, 0)` }}
            onTransitionEnd={finishCarouselMovement}
            onTouchStart={(event) => { touchStartRef.current = event.changedTouches[0].clientX; }}
            onTouchEnd={(event) => {
              if (touchStartRef.current === null) return;
              const distance = event.changedTouches[0].clientX - touchStartRef.current;
              if (Math.abs(distance) > 45) scrollCarousel(distance < 0 ? 1 : -1);
              touchStartRef.current = null;
            }}
          >
          {carouselCharacters.map((character, trackPosition) => {
            const originalIndex = trackPosition % characters.length;
            return (
            <article
              className="character-card"
              key={`${character.id}-${trackPosition}`}
              style={{ "--accent": character.accent } as React.CSSProperties}
              aria-hidden={trackPosition < trackIndex || trackPosition >= trackIndex + visibleCharacters}
            >
              <div className="character-image-wrap">
                <img src={character.image} alt={character.imageAlt} loading={originalIndex > 1 ? "lazy" : "eager"} />
                <span className="card-number">0{originalIndex + 1}</span>
                <span className="character-tag">{character.tagline}</span>
              </div>
              <div className="character-card-content">
                <h3>{character.title}</h3>
                <p>{character.description}</p>
                <a href={getWhatsAppUrl(`¡Quiero contratar ${character.title} para mi fiesta!`)} target="_blank" rel="noreferrer">
                  Consultar disponibilidad <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          );})}
          </div>
          </div>
          <button className="carousel-side-button carousel-side-button-right" type="button" onClick={() => scrollCarousel(1)} aria-label="Rotar carrusel hacia la derecha"><ArrowIcon direction="right" /></button>
        </div>
        <div className="carousel-status" aria-label={`Comenzando por el personaje ${activeCharacter + 1} de ${characters.length}`}>
          <span className="carousel-count"><strong>0{activeCharacter + 1}</strong> / 0{characters.length}</span>
          <div className="carousel-dots" aria-label="Elegir personaje">
            {characters.map((character, index) => (
              <button
                key={character.id}
                type="button"
                className={index === activeCharacter ? "active" : ""}
                onClick={() => goToCharacter(index)}
                aria-label={`Ver ${character.title}`}
                aria-current={index === activeCharacter ? "true" : undefined}
              />
            ))}
          </div>
          <p className="swipe-hint"><span aria-hidden="true">↔</span> Rotá o deslizá en ambas direcciones</p>
        </div>
      </section>

      <section className="quote-section section" id="cotizacion" aria-labelledby="quote-title">
        <div className="quote-heading">
          <div>
            <p className="eyebrow light"><span />Planificá tu evento</p>
            <h2 id="quote-title">Consultá tu<br /><em>cotización.</em></h2>
          </div>
          <p>Elegí dónde, cuándo y qué personajes querés. Vas a obtener un valor estimado y un mensaje listo para consultar disponibilidad.</p>
        </div>

        <div className="quote-layout">
          <form className="quote-form" onSubmit={(event) => event.preventDefault()}>
            <fieldset className="quote-step">
              <legend><span>01</span> Provincia</legend>
              <div className="province-options">
                {quoteProvinces.map((province) => (
                  <label className={quoteProvince === province.id ? "selected" : ""} key={province.id}>
                    <input
                      type="radio"
                      name="quote-province"
                      value={province.id}
                      checked={quoteProvince === province.id}
                      onChange={() => {
                        setQuoteProvince(province.id);
                        setQuoteLocality(province.localities[0].id);
                      }}
                    />
                    <span>{province.label}</span>
                    <small>{province.id === "tucuman" ? "Base Tucumán" : "Base Santiago"}</small>
                  </label>
                ))}
              </div>
              <div className="regional-note">
                <span aria-hidden="true">✦</span>
                <p>
                  <strong>Eventos en Catamarca, Salta y Jujuy</strong>
                  ¿Tu evento es en alguna de estas provincias? Nos encantará acompañarte. Escribinos para preparar una cotización personalizada según la fecha, el lugar y la disponibilidad. <b>Metán y Rosario de la Frontera se cotizan con tarifa de Tucumán por su cercanía.</b>
                </p>
                <div>
                  <a href={getWhatsAppUrl("¡Hola! Quisiera recibir una cotización para un evento en Catamarca, Salta o Jujuy.", contacts[1].phone)} target="_blank" rel="noreferrer">Ventas Tucumán ↗</a>
                  <a href={getWhatsAppUrl("¡Hola! Quisiera recibir una cotización para un evento en Catamarca, Salta o Jujuy.", contacts[2].phone)} target="_blank" rel="noreferrer">Ventas Santiago ↗</a>
                </div>
              </div>
            </fieldset>

            <fieldset className="quote-step">
              <legend><span>02</span> Localidad</legend>
              <label className="field-label" htmlFor="quote-locality">Seleccioná una zona</label>
              <select id="quote-locality" value={quoteLocality} onChange={(event) => setQuoteLocality(event.target.value)}>
                {selectedProvince.localities.map((locality) => <option value={locality.id} key={locality.id}>{locality.label}</option>)}
              </select>
              {selectedLocality.detail && <p className="field-help">{selectedLocality.detail}</p>}
              {quoteProvince === "santiago" && (
                <p className="nearby-note"><strong>Nueva Esperanza y Termas de Río Hondo</strong> se cotizan desde Tucumán debido a la cercanía.</p>
              )}
            </fieldset>

            <fieldset className="quote-step">
              <legend><span>03</span> Personajes</legend>
              <p className="field-label character-field-label">¿Qué personajes querés?</p>
              <div className="quote-character-options">
                {characters.map((character) => (
                  <label className={quoteCharacters.includes(character.id) ? "selected" : ""} key={character.id}>
                    <input
                      type="checkbox"
                      checked={quoteCharacters.includes(character.id)}
                      onChange={() => toggleQuoteCharacter(character.id)}
                    />
                    <span style={{ "--choice-accent": character.accent } as React.CSSProperties}>{character.title}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="quote-step">
              <legend><span>04</span> Fecha y disponibilidad</legend>
              <div className="date-fields" aria-label="Fecha del evento: día, mes y año">
                <div>
                  <label className="field-label" htmlFor="quote-day">Día</label>
                  <select id="quote-day" value={quoteDay} onChange={(event) => setQuoteDay(event.target.value)}>
                    <option value="">Día</option>
                    {quoteDayOptions.map((day) => <option value={String(day).padStart(2, "0")} key={day}>{day}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="quote-month">Mes</label>
                  <select
                    id="quote-month"
                    value={quoteMonth}
                    onChange={(event) => { setQuoteMonth(event.target.value); setQuoteDay(""); }}
                  >
                    {monthsForSelectedYear.map((month) => (
                      <option value={month.id} key={month.id}>{month.label.replace(/\s+\d{4}$/, "")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="quote-year">Año</label>
                  <select
                    id="quote-year"
                    value={String(quoteYear)}
                    onChange={(event) => {
                      const selectedYear = event.target.value;
                      const matchingMonth = quoteMonths.find((month) => month.id === `${selectedYear}-${String(quoteMonthNumber).padStart(2, "0")}`);
                      const firstMonthOfYear = quoteMonths.find((month) => month.id.startsWith(selectedYear));
                      setQuoteMonth((matchingMonth ?? firstMonthOfYear ?? quoteMonths[0]).id);
                      setQuoteDay("");
                    }}
                  >
                    {availableQuoteYears.map((year) => <option value={year} key={year}>{year}</option>)}
                  </select>
                </div>
              </div>
              <div className={`availability ${fewSlotsDates.includes(quoteDate) ? "low" : quoteDate ? "available" : "empty"}`}>
                <span aria-hidden="true" />
                <div><small>Disponibilidad</small><strong>{quoteAvailability}</strong></div>
                {fewSlotsDates.includes(quoteDate) && <em>Viernes, sábado o domingo de agosto</em>}
              </div>
            </fieldset>
          </form>

          <aside className="quote-summary" aria-live="polite">
            <p className="summary-kicker">Tu estimación</p>
            <div className="summary-price">
              <span>Desde</span>
              <strong>{totalPrice ? `$${totalPrice.toLocaleString("es-AR")}` : "—"}</strong>
              <small>ARS · {quoteCharacters.length || 0} {quoteCharacters.length === 1 ? "personaje" : "personajes"}</small>
            </div>
            <dl>
              <div><dt>Provincia</dt><dd>{selectedProvince.label}</dd></div>
              <div><dt>Localidad</dt><dd>{selectedLocality.label}</dd></div>
              <div><dt>Fecha</dt><dd>{formattedQuoteDate}</dd></div>
              <div><dt>Personajes</dt><dd>{selectedCharacterNames.length ? selectedCharacterNames.join(", ") : "Sin seleccionar"}</dd></div>
            </dl>
            <div className={`summary-availability ${fewSlotsDates.includes(quoteDate) ? "low" : ""}`}>
              <span /> {quoteAvailability}
            </div>
            <p className="quote-disclaimer">Valor estimativo según la tarifa base de la provincia. El traslado y los detalles de localidades fuera del área metropolitana se confirman con ventas.</p>
            <a
              className={quoteCharacters.length ? "button quote-whatsapp" : "button quote-whatsapp disabled"}
              href={quoteCharacters.length ? getWhatsAppUrl(quoteMessage, sellerContact.phone) : undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!quoteCharacters.length}
            >
              <WhatsAppIcon /> Enviar a {sellerContact.role} <span aria-hidden="true">↗</span>
            </a>
            <p className="seller-phone"><span>Contacto asignado</span><strong>{sellerContact.phone}</strong></p>
          </aside>
        </div>
      </section>

      <section className="about-section section" id="nosotros" aria-labelledby="about-title">
        <div className="about-grid">
          <div className="about-photo">
            <img src="/images/historia.webp" alt="Recreación ilustrativa del equipo construyendo uno de sus primeros robots LED" loading="lazy" />
            <span className="photo-note">Imagen recreada · material provisorio</span>
            <span className="photo-stamp">Desde<br /><strong>2014</strong></span>
          </div>
          <div className="about-content">
            <p className="eyebrow light"><span />Quiénes somos</p>
            <h2 id="about-title">Más de diez años<br />haciendo que <em>pase algo.</em></h2>
            <p className="about-lead">
              Somos una empresa de animación nacida en el norte argentino. Desde Tucumán Capital y Santiago del Estero Capital llevamos personajes, luces y emoción a cada celebración.
            </p>
            <p>
              No llegamos solamente con un traje: coordinamos el momento, leemos la pista y cuidamos cada detalle para que vos disfrutes sin preocuparte por nada.
            </p>
            <div className="location-list">
              <div><span>01</span><p><strong>Tucumán Capital</strong>Base operativa y cobertura provincial</p></div>
              <div><span>02</span><p><strong>Santiago Capital</strong>Equipo local y cobertura regional</p></div>
            </div>
          </div>
        </div>
        <div className="reasons">
          <article><span>✦</span><h3>Experiencia real</h3><p>Más de una década aprendiendo qué necesita cada tipo de fiesta.</p></article>
          <article><span>⌁</span><h3>Show a medida</h3><p>Adaptamos personajes, tiempos y energía al ritmo de tu evento.</p></article>
          <article><span>✓</span><h3>Equipo responsable</h3><p>Coordinación previa, puntualidad y acompañamiento de principio a fin.</p></article>
        </div>
      </section>

      <section className="moments-section section" id="momentos" aria-labelledby="moments-title">
        <div className="moments-heading">
          <p className="eyebrow dark"><span />Momentos que brillan</p>
          <h2 id="moments-title">Cuando la fiesta<br /><em>se vuelve recuerdo.</em></h2>
          <p>Una muestra visual de lo que podemos crear. Las imágenes y referencias se reemplazarán con material real del equipo.</p>
        </div>
        <div className="venue-gallery">
          {venues.map((venue, index) => (
            <figure className={`venue-card venue-${index + 1}`} key={venue.name}>
              <img src={venue.image} alt={venue.imageAlt} loading="lazy" />
              <figcaption>
                <span className="sample-label">Referencia provisoria</span>
                <h3>{venue.name}</h3>
                <p>{venue.location} · {venue.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="testimonials-heading">
          <p className="eyebrow dark"><span />Lo que dicen de nosotros</p>
          <p className="sample-disclaimer">Textos demostrativos para reemplazar por testimonios verificados.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <blockquote key={index}>
              <span className="quote-mark">“</span>
              <p>{testimonial.quote}</p>
              <footer>
                <span className="avatar" aria-hidden="true">{index + 1}</span>
                <span><strong>{testimonial.author}</strong><small>{testimonial.event}</small></span>
                <span className="sample-badge">Muestra</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="contact-section section" id="contacto" aria-labelledby="contact-title">
        <div className="contact-glow" />
        <div className="contact-intro">
          <p className="eyebrow light"><span />Hagamos algo inolvidable</p>
          <h2 id="contact-title">Tu fiesta merece<br /><em>encenderse.</em></h2>
          <p>Contanos la fecha, la ciudad y qué personajes imaginás. Te ayudamos a armar el momento perfecto.</p>
          <a className="button button-whatsapp" href={getWhatsAppUrl()} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> Quiero contratar sus servicios <span aria-hidden="true">↗</span>
          </a>
          <small>El enlace abre WhatsApp con el mensaje listo para enviar.</small>
        </div>
        <div className="contacts-list">
          <p className="editable-note">Contactos provisorios · editables en un solo archivo</p>
          {contacts.map((contact, index) => (
            <article key={contact.role}>
              <span className="contact-index">0{index + 1}</span>
              <div><p>{contact.role}</p><h3>{contact.name}</h3><span>{contact.location}</span></div>
              <div className="contact-phone"><span>{contact.phone}</span><i aria-hidden="true">↗</i></div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#inicio"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Robot <strong>LED</strong><small>eventos</small></span></a>
        <p>Animación y personajes para eventos<br />en Tucumán y Santiago del Estero.</p>
        <div><a href="#personajes">Personajes</a><a href="#nosotros">Nosotros</a><a href="#momentos">Momentos</a></div>
        <span>© {new Date().getFullYear()} Robot LED Eventos</span>
      </footer>
    </main>
  );
}
