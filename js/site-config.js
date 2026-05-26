window.RESTAURANT_TEMPLATE_CONFIG = {
  template: "omakase",

  // =====================================================
  // QUICK CLIENT EDIT
  // Change only this section for each new client
  // =====================================================
  client: {
    name: "Kaze Omakase",
    language: "es", // "en" or "es"
    tagline: "Omakase de lujo inspirado en Tokio",
    url: "https://viralframe2026.github.io/viralframe-restaurant-engine/",
    seoDescription: "Kaze Omakase es una barra japonesa premium inspirada en Tokio, con nigiri de temporada, maridajes de sake y precision silenciosa.",
    cuisine: ["Japonesa", "Omakase", "Sushi"],
    priceRange: "$$$$",
    phone: "+1 212 555 0147",
    email: "reservations@kazeomakase.com",
    address: "18 Shiro Lane, Tribeca",
    city: "New York",
    hours: "Martes a sabado, turnos 6:00 PM y 8:45 PM",
    instagram: "https://instagram.com/kazeomakase",
    facebook: "#",
    tiktok: "https://tiktok.com/@kazeomakase",
    reservationMode: "demo",
    whatsappNumber: "",
    formEndpoint: "",
    newsletterEndpoint: ""
  },

  brand: {
    name: "Kaze",
    descriptor: "Omakase",
    fullName: "Kaze Omakase",
    tagline: "Una barra silenciosa inspirada en Tokio, definida por pescado de temporada, arroz preciso, sake excepcional y la mano del chef Kenji Sato."
  },

  site: {
    language: "es",
    url: "https://viralframe2026.github.io/viralframe-restaurant-engine/",
    themeColor: "#030303",
    locale: "es_ES"
  },

  seo: {
    title: "Kaze Omakase | Omakase japones premium",
    description: "Kaze Omakase es una barra japonesa premium inspirada en Tokio, con nigiri de temporada, maridajes de sake y precision silenciosa.",
    robots: "index, follow",
    ogTitle: "Kaze Omakase | Omakase japones premium",
    ogDescription: "Nigiri de temporada, sake excepcional y precision silenciosa de Tokio en una barra omakase intima.",
    ogImage: "assets/images/gallery/hero.jpg",
    ogImageWidth: "1717",
    ogImageHeight: "916"
  },

  theme: {
    colors: {
      bg: "#030303",
      gold: "#B6463A",
      cream: "#F7F0E6",
      wine: "#5B1116",
      sage: "#A8A093"
    },
    fonts: {
      heading: "\"Playfair Display\", Georgia, serif",
      body: "\"Inter\", Arial, sans-serif"
    },
    radius: {
      base: "8px",
      pill: "999px"
    },
    shadows: {
      base: "0 28px 80px rgba(0, 0, 0, 0.42)",
      accent: "0 18px 55px rgba(182, 70, 58, 0.16)"
    },
    spacing: {
      section: "112px",
      sectionMobile: "88px"
    },
    overlays: {
      hero: "linear-gradient(180deg, rgba(0, 0, 0, 0.38), rgba(3, 3, 3, 0.86) 58%, #030303 100%)"
    },
    motion: {
      duration: "260ms",
      ease: "cubic-bezier(0.22, 1, 0.36, 1)"
    },
    buttons: {
      primary: "accent-fill",
      secondary: "glass"
    },
    cards: {
      style: "dark-glass",
      border: "rgba(255, 255, 255, 0.12)"
    },
    hero: {
      imagePosition: "center center",
      headlineScale: "editorial"
    }
  },

  socials: {
    instagram: "https://instagram.com/kazeomakase",
    facebook: "#",
    tiktok: "https://tiktok.com/@kazeomakase"
  },

  reservation: {
    mode: "demo",
    endpoint: "",
    whatsappNumber: "",
    emailFallback: "reservations@kazeomakase.com"
  },

  sections: {
    experience: true,
    ritual: true,
    menu: true,
    tasting: true,
    wine: true,
    chef: true,
    gallery: true,
    testimonials: true,
    events: true,
    reservations: true,
    location: true,
    faq: true
  },

  legal: {
    privacyEnabled: true
  },

  analytics: {
    provider: "",
    id: ""
  },

  contact: {
    email: "reservations@kazeomakase.com",
    phoneDisplay: "+1 212 555 0147",
    phoneHref: "+12125550147",
    addressLine: "18 Shiro Lane",
    district: "Tribeca",
    city: "New York",
    region: "NY",
    country: "US",
    mapsUrl: "https://maps.google.com/?q=18%20Shiro%20Lane%20Tribeca%20New%20York",
    social: [
      { label: "Instagram", url: "#" },
      { label: "Facebook", url: "#" },
      { label: "TikTok", url: "#" }
    ]
  },

  business: {
    cuisine: ["Japonesa", "Omakase", "Sushi"],
    priceRange: "$$$$"
  },

  hours: {
    short: "Martes a sabado, turnos 6:00 PM y 8:45 PM",
    location: "Martes a sabado, turnos 6:00 PM y 8:45 PM\nCerrado domingo y lunes",
    schema: [
      { dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "18:00", closes: "23:30" }
    ]
  },

  nav: {
    links: [
      { label: "Experiencia", href: "#experience" },
      { label: "Menu", href: "#menu" },
      { label: "Chef", href: "#chef" },
      { label: "Galeria", href: "#gallery" },
      { label: "Reservas", href: "#reservations" }
    ],
    cta: { label: "Reservar barra", href: "#reservations" }
  },

  preloader: {
    eyebrow: "Preparando la barra"
  },

  hero: {
    eyebrow: "Barra omakase de Tokio en penumbra",
    timeNote: "Dos turnos por noche",
    title: "Omakase de temporada servido con silencio, fuego y precision.",
    lead: "Una barra de sushi de doce lugares para nigiri de temporada, sashimi impecable, sake excepcional y noches guiadas por el ritmo del chef Kenji Sato.",
    image: {
      src: "assets/images/gallery/hero.jpg",
      alt: "Barra omakase minimalista con nigiri fresco",
      width: "1717",
      height: "916"
    },
    primaryCta: { label: "Reservar barra", href: "#reservations" },
    secondaryCta: { label: "Explorar omakase", href: "#menu" },
    reservation: {
      firstLabel: "Proximo turno",
      firstValue: "Esta noche, 8:45 PM",
      secondLabel: "Omakase de temporada",
      secondValue: "17 momentos / $185",
      cta: { label: "Solicitar", href: "#reservations" }
    },
    stats: [
      { value: "12", label: "Lugares en barra" },
      { value: "17", label: "Momentos omakase" },
      { value: "06", label: "Rutas de sake" }
    ],
    cards: [
      { label: "Esta noche", text: "Bafun uni sobre arroz tibio" },
      { label: "Nota de sake", text: "Junmai daiginjo de Yamagata" }
    ]
  },

  marquee: [
    "Omakase de temporada",
    "Edomae Nigiri",
    "Maridajes de sake excepcionales",
    "Barra de doce lugares",
    "Noches privadas de sushi"
  ],

  experience: {
    eyebrow: "La experiencia Kaze",
    title: "Una barra contenida donde el arroz, el cuchillo y la temporada deciden la noche.",
    body: "Kaze esta construido alrededor de una precision silenciosa. El pescado llega a diario, el arroz se sazona en pequenas tandas y cada pieza cruza la barra en el instante exacto en que debe comerse.",
    image: {
      src: "assets/images/gallery/experience.jpg",
      alt: "Chef preparando sushi con manos precisas en la barra",
      width: "1536",
      height: "1024"
    },
    note: {
      label: "Ritmo de servicio",
      text: "Medido, silencioso y completamente presente."
    },
    features: [
      { number: "01", title: "Tecnica edomae", body: "Pescado madurado, tare pincelado, arroz tibio y cortes limpios dan forma a cada pieza." },
      { number: "02", title: "Producto de temporada", body: "La seleccion se mueve con los mercados japoneses, aguas locales y la inspeccion matinal del chef." },
      { number: "03", title: "Solo doce lugares", body: "Una barra oscura y minimalista disenada para foco, conversacion y ritmo exacto." }
    ]
  },

  ritual: {
    eyebrow: "El ritual",
    title: "Cinco decisiones pequenas sostienen toda la noche.",
    body: "Cada servicio avanza con gestos medidos: temperatura, corte, mercado, sake y silencio. Nada se acelera; cada pieza llega cuando tiene que llegar.",
    items: [
      { title: "Temperatura del arroz", body: "El shari se sirve tibio para que el pescado respire y la salinidad aparezca sin esfuerzo." },
      { title: "Disciplina del cuchillo", body: "Cada corte busca textura, brillo y longitud exacta antes de tocar la mano del chef." },
      { title: "Pescado de temporada", body: "La progresion cambia con la maduracion, el mercado y la inspeccion de la manana." },
      { title: "Ritmo del sake", body: "La temperatura de cada copa acompana grasa, acidez y pausa entre bocados." }
    ]
  },

  menu: {
    eyebrow: "Omakase de temporada",
    title: "Una progresion precisa de arroz, pescado, sake y contencion.",
    body: "El menu cambia con el mercado: sashimi limpio, nigiri tibio, hand rolls y finales silenciosos compuestos para la estacion.",
    categories: [
      { label: "Todo", value: "all" },
      { label: "Sashimi", value: "sashimi" },
      { label: "Nigiri", value: "nigiri" },
      { label: "Sake", value: "sake" },
      { label: "Final", value: "finish" }
    ],
    items: [
      { category: "sashimi", categoryLabel: "Sashimi", price: "$28", title: "Kanpachi Usuzukuri", body: "Pez limon, sudachi, soja blanca y myoga laminado." },
      { category: "sashimi", categoryLabel: "Sashimi", price: "$34", title: "Vieira de Hokkaido", body: "Hotate, yuzu kosho, sal ahumada y dashi frio." },
      { category: "nigiri", categoryLabel: "Nigiri", price: "$42", title: "Akami Zuke", body: "Atun rojo marinado, arroz tibio, nikiri y wasabi." },
      { category: "nigiri", categoryLabel: "Nigiri", price: "$58", title: "Bafun Uni", body: "Erizo de mar sobre arroz tibio, nori y un trazo suave de soja." },
      { category: "nigiri", categoryLabel: "Nigiri", price: "$38", title: "Anago", body: "Anguila de mar, glaseado tsume, sansho y una calidez leve de carbon." },
      { category: "sake", categoryLabel: "Sake", price: "$36", title: "Maridaje Junmai Daiginjo", body: "Un vuelo preciso de sake pulido, elegido por textura y final." },
      { category: "sake", categoryLabel: "Sake", price: "$24", title: "Seleccion Nama", body: "Sake de temporada sin pasteurizar, con claridad, elevacion y fruta delicada." },
      { category: "finish", categoryLabel: "Final", price: "$18", title: "Helado de leche y matcha", body: "Matcha ceremonial, arroz tostado y crumble de sesamo negro." }
    ],
    featured: {
      eyebrow: "Paso destacado",
      title: "Akami zuke sobre arroz tibio",
      body: "Atun rojo marinado, nikiri ligero y wasabi fresco. Una pieza breve, directa, pensada para revelar la temperatura exacta del arroz.",
      meta: "Servido al inicio de la progresion de nigiri"
    }
  },

  tasting: {
    eyebrow: "Omakase del chef",
    title: "Diecisiete momentos definidos por el mercado y la mano.",
    body: "La progresion nocturna avanza desde sashimi limpio hacia nigiri tibio, un hand roll, sopa clara y un dulce final contenido.",
    price: "$185",
    priceLabel: "por persona",
    cta: { label: "Reservar omakase", href: "#reservations" },
    courses: [
      "Chawanmushi, cangrejo de nieve, mitsuba",
      "Kanpachi, sudachi, soja blanca",
      "Akami zuke, arroz tibio, nikiri",
      "Bafun uni, nori, wasabi",
      "Helado de leche y matcha, arroz tostado"
    ]
  },

  wine: {
    eyebrow: "Maridaje de sake",
    title: "Una cava de sake pensada para claridad, arroz y tension silenciosa.",
    body: "El maridaje recorre junmai, ginjo, nama y sake madurado, ajustando temperatura y textura a cada paso.",
    cta: { label: "Ver maridajes", href: "#reservations" },
    pairings: [
      { number: "01", title: "Maridaje clasico de sake", body: "Selecciones elegantes de junmai y ginjo con elevacion, textura y equilibrio." },
      { number: "02", title: "Maridaje descubrimiento", body: "Nama, kimoto, sake espumoso y botellas regionales poco frecuentes." },
      { number: "03", title: "Maridaje de reserva", body: "Daiginjo limitado y sake madurado abiertos para noches especiales en la barra." }
    ]
  },

  chef: {
    eyebrow: "Chef Kenji Sato",
    title: "Una barra guiada por disciplina, temporada y el gesto mas pequeno posible.",
    body: "Kenji Sato se formo en Tokio antes de construir Kaze alrededor de la temperatura del arroz, la maduracion del pescado y la disciplina de servir cada pieza en su punto mas fugaz.",
    quote: "Omakase es confianza. El invitado nos entrega la noche y respondemos pieza por pieza.",
    signature: "Kenji Sato",
    image: {
      src: "assets/images/gallery/chef.jpg",
      alt: "Chef Kenji Sato preparando sushi detras de una barra omakase oscura",
      width: "1536",
      height: "1024"
    }
  },

  gallery: {
    eyebrow: "Galeria",
    title: "Barra, cuchillo, arroz, sake.",
    body: "Escenas de una barra oscura inspirada en Tokio: laca, veta, pescado, manos y pequenas pausas entre piezas.",
    items: [
      { layout: "wide", caption: "Nigiri servido sobre arroz tibio sazonado", src: "assets/images/gallery/gallery-01.jpg", full: "assets/images/gallery/gallery-01.jpg", alt: "Nigiri surtido sobre un plato oscuro", width: "1536", height: "1024" },
      { caption: "Manos del chef dando forma al arroz en la barra", src: "assets/images/gallery/gallery-02.jpg", full: "assets/images/gallery/gallery-02.jpg", alt: "Chef de sushi preparando nigiri a mano", width: "1536", height: "1024" },
      { caption: "Sake seleccionado para el maridaje nocturno", src: "assets/images/gallery/gallery-03.jpg", full: "assets/images/gallery/gallery-03.jpg", alt: "Botella y copa de sake japones en luz baja", width: "1536", height: "1024" },
      { layout: "tall", caption: "Trabajo de cuchillo antes del primer turno", src: "assets/images/gallery/gallery-04.jpg", full: "assets/images/gallery/gallery-04.jpg", alt: "Chef de sushi cortando pescado fresco", width: "1536", height: "1024" },
      { caption: "Un curso limpio de sashimi con citrico", src: "assets/images/gallery/gallery-05.jpg", full: "assets/images/gallery/gallery-05.jpg", alt: "Curso de sashimi dispuesto en un plato minimalista", width: "1024", height: "1536" },
      { caption: "Luz minima en la barra antes del servicio", src: "assets/images/gallery/gallery-06.jpg", full: "assets/images/gallery/gallery-06.jpg", alt: "Interior oscuro de restaurante japones con barra", width: "1536", height: "1024" },
      { caption: "Pescado fresco preparado para omakase", src: "assets/images/gallery/gallery-07.jpg", full: "assets/images/gallery/gallery-07.jpg", alt: "Mariscos frescos preparados para servicio de sushi", width: "1717", height: "916" },
      { layout: "wide", caption: "Matcha y arroz tostado para cerrar la noche", src: "assets/images/gallery/gallery-08.jpg", full: "assets/images/gallery/gallery-08.jpg", alt: "Te japones servido en una taza ceramica", width: "1536", height: "1024" }
    ]
  },

  testimonials: {
    eyebrow: "Resenas",
    title: "Los invitados recuerdan el silencio tanto como el pescado.",
    items: [
      { quote: "Kaze es exacto sin sentirse frio. La temperatura del arroz, el sake, el ritmo: cada detalle llega en silencio.", name: "Mara Whitman" },
      { quote: "Una pequena barra oscura con la disciplina de Tokio y la calidez de un chef que lee a cada invitado.", name: "Julian Reeves" },
      { quote: "Solo el paso de uni ya justifico la reserva. Contenido, hermoso y completamente memorable.", name: "Clara Bennett" }
    ]
  },

  events: {
    eyebrow: "Omakase privado",
    title: "Para cenas de fundadores, coleccionistas y celebraciones que requieren foco.",
    body: "Reserva la barra completa para un omakase privado construido alrededor de pescado de temporada, maridaje de sake, servicio silencioso y el ritmo de tus invitados.",
    cta: { label: "Planear omakase privado", href: "#reservations" },
    items: [
      "Reserva completa de barra para hasta 12 invitados",
      "Cenas ejecutivas y maridajes de sake de coleccion",
      "Celebraciones especiales con menus de temporada a medida"
    ]
  },

  reservations: {
    eyebrow: "Reservas",
    title: "Reserva la barra. El menu seguira a la temporada.",
    body: "Para alergias, solicitudes de maridaje de sake o reservas privadas de barra completa, deja una nota y nuestro equipo respondera con disponibilidad.",
    noteLabel: "Horarios",
    noteText: "Martes a sabado, turnos 6:00 PM y 8:45 PM"
  },

  location: {
    eyebrow: "Ubicacion",
    title: "18 Shiro Lane, Tribeca",
    mapLabel: "Kaze Omakase",
    mapSubLabel: "New York",
    contactCta: { label: "Contactar al equipo anfitrion" }
  },

  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Antes de la barra.",
    items: [
      { question: "Cuanto dura el omakase?", answer: "La mayoria de los turnos dura alrededor de dos horas. Recomendamos llegar diez minutos antes para que la barra pueda comenzar junta." },
      { question: "Pueden adaptar alergias?", answer: "Incluye alergias al solicitar tu reserva. Como el menu se centra en pescado, arroz, soja y mariscos, algunas restricciones pueden requerir confirmacion previa." },
      { question: "Ofrecen menu a la carta?", answer: "Kaze trabaja solo con omakase. El chef puede ofrecer piezas suplementarias segun el mercado." },
      { question: "Cual es la politica de cancelacion?", answer: "Las reservas pueden modificarse hasta 48 horas antes de la llegada. Las cancelaciones tardias de omakase pueden generar un cargo." },
      { question: "Ofrecen reservas privadas?", answer: "Si. La barra completa puede reservarse para hasta 12 invitados con maridaje de sake opcional." }
    ]
  },

  finalCta: {
    eyebrow: "La barra esta lista",
    title: "Confia en la temporada. Deja que el chef decida la noche.",
    cta: { label: "Reservar barra", href: "#reservations" }
  },

  footer: {
    exploreTitle: "Explorar",
    socialTitle: "Redes",
    newsletterTitle: "Notas privadas",
    newsletterLabel: "Recibe novedades del menu de temporada.",
    newsletterPlaceholder: "Correo electronico",
    newsletterButton: "Unirme",
    backToTop: "Volver arriba",
    privacyLink: "Privacidad",
    copyrightSuffix: "Todos los derechos reservados."
  },

  ui: {
    navOpenLabel: "Abrir menu de navegacion",
    navCloseLabel: "Cerrar menu de navegacion",
    mapAriaLabel: "Abrir {brand} en mapas",
    lightboxFallbackAlt: "Imagen de galeria de Kaze Omakase",
    ratingAriaLabel: "Calificacion de cinco estrellas",
    locationLabels: {
      hours: "Horarios",
      phone: "Telefono",
      email: "Email"
    }
  },

  forms: {
    reservation: {
      submitMode: "demo",
      endpoint: "",
      method: "POST",
      whatsappNumber: "",
      emailFallback: "reservations@kazeomakase.com",
      timeMin: "17:30",
      timeMax: "23:00",
      minGuests: "1",
      maxGuests: "12",
      labels: {
        name: "Nombre",
        email: "Email",
        date: "Fecha",
        time: "Hora",
        guests: "Personas",
        message: "Mensaje",
        submit: "Solicitar reserva",
        messagePlaceholder: "Alergias, interes en maridaje de sake, ocasion o solicitud de barra privada"
      },
      messageLabels: {
        intro: "Solicitud de reserva para",
        email: "Email",
        date: "Fecha",
        time: "Hora",
        guests: "Personas",
        message: "Mensaje",
        emailSubject: "Solicitud de reserva"
      },
      successMessage: "Gracias. Recibimos tu solicitud. Nuestro equipo confirmara la disponibilidad de la barra a la brevedad.",
      sendingMessage: "Enviando tu solicitud...",
      errorMessage: "No pudimos enviar la solicitud. Contacta al equipo anfitrion directamente.",
      messages: {
        nameRequired: "Ingresa tu nombre.",
        emailInvalid: "Ingresa un email valido.",
        dateRequired: "Elige una fecha para la reserva.",
        datePast: "Elige hoy o una fecha futura.",
        timeRequired: "Elige un horario preferido.",
        timeEarly: "Elige un horario despues de {min}.",
        timeLate: "Elige un horario antes de {max}.",
        guestsRange: "Elige entre {min} y {max} personas."
      }
    },
    newsletter: {
      endpoint: "",
      successMessage: "Ya estas en la lista. Las notas de temporada llegaran pronto.",
      invalidMessage: "Ingresa un email valido para sumarte.",
      errorMessage: "No pudimos agregar este email ahora."
    }
  },

  privacy: {
    navLabel: "Navegacion de privacidad",
    menuLink: "Menu",
    galleryLink: "Galeria",
    reserveCta: "Reservar",
    title: "Politica de privacidad",
    description: "Politica de privacidad para solicitudes de reserva y newsletter de Kaze Omakase.",
    eyebrow: "Privacidad",
    intro: "Esta pagina explica como se gestiona la informacion de reservas y newsletter cuando este template estatico de omakase se configura para un cliente real.",
    sections: [
      {
        title: "Informacion recopilada",
        body: "El formulario de reserva puede recopilar nombre, email, fecha preferida, horario preferido, cantidad de personas, notas de alergias, interes en maridaje de sake y mensajes opcionales. El formulario de newsletter puede recopilar una direccion de email."
      },
      {
        title: "Como se usa la informacion",
        body: "La informacion se usa solo para responder solicitudes de reserva, gestionar comunicacion de hospitalidad y enviar actualizaciones opcionales si se conecta un endpoint de newsletter."
      },
      {
        title: "Proveedores de formularios",
        body: "Este template puede funcionar en modo demo, enviar a un endpoint de formulario, abrir WhatsApp o abrir un cliente de email. Cuando se conecta a un proveedor externo, tambien pueden aplicar sus terminos de privacidad."
      },
      {
        title: "Retencion de datos",
        body: "La retencion depende del flujo final del cliente y del proveedor de reservas. Para uso en produccion, actualiza esta politica con el proceso real de retencion y eliminacion del cliente."
      },
      {
        title: "Contacto",
        body: "Para solicitudes de privacidad, contacta al restaurante usando el email configurado para este sitio."
      }
    ],
    backCta: "Volver al sitio"
  },

  translations: {
    en: {
      client: {
        language: "en",
        tagline: "Tokyo Luxury Omakase",
        seoDescription: "Kaze Omakase is a premium Tokyo-inspired sushi counter with seasonal nigiri, sake pairings, and quiet precision.",
        cuisine: ["Japanese", "Omakase", "Sushi"],
        hours: "Tue to Sat, 6:00 PM and 8:45 PM seatings"
      },
      site: {
        language: "en",
        locale: "en_US"
      },
      seo: {
        title: "Kaze Omakase | Tokyo Luxury Omakase",
        description: "Kaze Omakase is a premium Tokyo-inspired sushi counter with seasonal nigiri, sake pairings, and quiet precision.",
        ogTitle: "Kaze Omakase | Tokyo Luxury Omakase",
        ogDescription: "Seasonal nigiri, rare sake, and quiet Tokyo precision at an intimate omakase counter."
      },
      brand: {
        tagline: "A silent Tokyo-inspired sushi counter shaped by seasonal fish, precise rice, rare sake, and the hand of Chef Kenji Sato."
      },
      business: {
        cuisine: ["Japanese", "Omakase", "Sushi"]
      },
      hours: {
        short: "Tuesday to Saturday, 6:00 PM and 8:45 PM seatings",
        location: "Tue to Sat 6:00 PM and 8:45 PM seatings\nClosed Sunday and Monday"
      },
      nav: {
        links: [
          { label: "Experience", href: "#experience" },
          { label: "Menu", href: "#menu" },
          { label: "Chef", href: "#chef" },
          { label: "Gallery", href: "#gallery" },
          { label: "Reservations", href: "#reservations" }
        ],
        cta: { label: "Reserve the Counter", href: "#reservations" }
      },
      preloader: {
        eyebrow: "Preparing the counter"
      },
      hero: {
        eyebrow: "Tokyo omakase counter in quiet shadow",
        timeNote: "Two seatings nightly",
        title: "Seasonal omakase served with silence, fire, and precision.",
        lead: "A twelve-seat sushi counter for seasonal nigiri, pristine sashimi, rare sake, and evenings guided by the rhythm of Chef Kenji Sato.",
        image: {
          alt: "Minimal sushi omakase counter with fresh nigiri"
        },
        primaryCta: { label: "Reserve the Counter", href: "#reservations" },
        secondaryCta: { label: "Explore Omakase", href: "#menu" },
        reservation: {
          firstLabel: "Next seating",
          firstValue: "Tonight, 8:45 PM",
          secondLabel: "Seasonal omakase",
          secondValue: "17 moments / $185",
          cta: { label: "Request", href: "#reservations" }
        },
        stats: [
          { value: "12", label: "Counter seats" },
          { value: "17", label: "Omakase moments" },
          { value: "06", label: "Sake pairing paths" }
        ],
        cards: [
          { label: "Tonight", text: "Bafun uni over warm rice" },
          { label: "Sake note", text: "Junmai daiginjo from Yamagata" }
        ]
      },
      marquee: [
        "Seasonal Omakase",
        "Edomae Nigiri",
        "Rare Sake Pairings",
        "Twelve-Seat Counter",
        "Private Sushi Evenings"
      ],
      experience: {
        eyebrow: "The Kaze experience",
        title: "A restrained counter where rice, knife work, and season decide the evening.",
        body: "Kaze is built around quiet precision. Fish arrives daily, rice is seasoned in small batches, and each course is handed across the counter at the exact moment it is meant to be eaten.",
        image: {
          alt: "Chef preparing sushi with precise hands at a counter"
        },
        note: {
          label: "Service rhythm",
          text: "Measured, silent, and entirely present."
        },
        features: [
          { number: "01", title: "Edomae technique", body: "Aged fish, brushed tare, warm rice, and clean knife work shape each piece." },
          { number: "02", title: "Seasonal sourcing", body: "Selections move with Japanese markets, local waters, and the chef's morning inspection." },
          { number: "03", title: "Twelve seats only", body: "A dark, minimal counter designed for focus, conversation, and exact pacing." }
        ]
      },
      ritual: {
        eyebrow: "The ritual",
        title: "Five small decisions hold the entire evening.",
        body: "Each service moves through measured gestures: temperature, knife work, market, sake, and silence. Nothing is rushed; every piece arrives when it should.",
        items: [
          { title: "Rice temperature", body: "The shari is served warm so the fish can breathe and salinity appears without force." },
          { title: "Knife discipline", body: "Each cut looks for texture, sheen, and exact length before it reaches the chef's hand." },
          { title: "Seasonal fish", body: "The progression changes with maturation, market arrivals, and the morning inspection." },
          { title: "Sake rhythm", body: "The temperature of each pour follows fat, acidity, and the pause between bites." }
        ]
      },
      menu: {
        eyebrow: "Seasonal omakase",
        title: "A precise progression of rice, fish, sake, and restraint.",
        body: "The menu changes with the market: clean sashimi, warm nigiri, hand rolls, and quiet finishing courses composed for the season.",
        categories: [
          { label: "All", value: "all" },
          { label: "Sashimi", value: "sashimi" },
          { label: "Nigiri", value: "nigiri" },
          { label: "Sake", value: "sake" },
          { label: "Finish", value: "finish" }
        ],
        items: [
          { category: "sashimi", categoryLabel: "Sashimi", price: "$28", title: "Kanpachi Usuzukuri", body: "Amberjack, sudachi, white soy, and shaved myoga." },
          { category: "sashimi", categoryLabel: "Sashimi", price: "$34", title: "Hokkaido Scallop", body: "Hotate, yuzu kosho, smoked salt, and chilled dashi." },
          { category: "nigiri", categoryLabel: "Nigiri", price: "$42", title: "Akami Zuke", body: "Marinated bluefin tuna, warm rice, nikiri, and wasabi." },
          { category: "nigiri", categoryLabel: "Nigiri", price: "$58", title: "Bafun Uni", body: "Sea urchin over warm rice with nori and a quiet brush of soy." },
          { category: "nigiri", categoryLabel: "Nigiri", price: "$38", title: "Anago", body: "Sea eel, tsume glaze, sansho, and soft charcoal warmth." },
          { category: "sake", categoryLabel: "Sake", price: "$36", title: "Junmai Daiginjo Pairing", body: "A precise flight of polished sake chosen for texture and finish." },
          { category: "sake", categoryLabel: "Sake", price: "$24", title: "Nama Selection", body: "Seasonal unpasteurized sake with clarity, lift, and gentle fruit." },
          { category: "finish", categoryLabel: "Finish", price: "$18", title: "Matcha Milk Ice", body: "Ceremonial matcha, toasted rice, and black sesame crumble." }
        ],
        featured: {
          eyebrow: "Featured moment",
          title: "Akami zuke over warm rice",
          body: "Marinated bluefin tuna, light nikiri, and fresh wasabi. A brief, direct piece designed to reveal the exact temperature of the rice.",
          meta: "Served early in the nigiri progression"
        }
      },
      tasting: {
        eyebrow: "Chef's omakase",
        title: "Seventeen moments shaped by the market and the hand.",
        body: "The nightly progression moves from clean sashimi to warm nigiri, a hand roll, clear soup, and a restrained final sweet.",
        priceLabel: "per guest",
        cta: { label: "Reserve Omakase", href: "#reservations" },
        courses: [
          "Chawanmushi, snow crab, mitsuba",
          "Kanpachi, sudachi, white soy",
          "Akami zuke, warm rice, nikiri",
          "Bafun uni, nori, wasabi",
          "Matcha milk ice, toasted rice"
        ]
      },
      wine: {
        eyebrow: "Sake pairing",
        title: "A sake cellar built for clarity, rice, and quiet tension.",
        body: "The pairing moves through junmai, ginjo, nama, and aged sake, matching temperature and texture to each course.",
        cta: { label: "View Pairings", href: "#reservations" },
        pairings: [
          { number: "01", title: "Classic Sake Pairing", body: "Elegant junmai and ginjo selections with lift, texture, and balance." },
          { number: "02", title: "Discovery Pairing", body: "Nama, kimoto, sparkling sake, and rare regional bottles." },
          { number: "03", title: "Reserve Pairing", body: "Limited daiginjo and aged sake opened for milestone counter seats." }
        ]
      },
      chef: {
        eyebrow: "Chef Kenji Sato",
        title: "A counter led by discipline, season, and the smallest possible gesture.",
        body: "Kenji Sato trained in Tokyo before building Kaze around rice temperature, fish maturity, and the discipline of serving each piece at its most fleeting point.",
        quote: "Omakase is trust. The guest gives us the evening, and we answer one piece at a time.",
        image: {
          alt: "Chef Kenji Sato preparing sushi behind a dark omakase counter"
        }
      },
      gallery: {
        eyebrow: "Gallery",
        title: "Counter, knife, rice, sake.",
        body: "Scenes from a dark Tokyo-inspired counter: lacquer, grain, fish, hands, and the small pauses between pieces.",
        items: [
          { caption: "Nigiri served over warm seasoned rice", alt: "Assorted sushi nigiri on a dark plate" },
          { caption: "Chef's hands shaping rice at the counter", alt: "Sushi chef preparing nigiri by hand" },
          { caption: "Sake selected for the nightly pairing", alt: "Japanese sake bottle and glass in low light" },
          { caption: "Knife work before the first seating", alt: "Sushi chef slicing fresh fish" },
          { caption: "A clean sashimi course with citrus", alt: "Sashimi course arranged on a minimal plate" },
          { caption: "Minimal counter lighting before service", alt: "Dark Japanese restaurant counter interior" },
          { caption: "Fresh fish prepared for omakase", alt: "Fresh seafood prepared for sushi service" },
          { caption: "Matcha and toasted rice to close the evening", alt: "Japanese tea served in a ceramic cup" }
        ]
      },
      testimonials: {
        eyebrow: "Reviews",
        title: "Guests remember the quiet as much as the fish.",
        items: [
          { quote: "Kaze is exact without feeling cold. The rice temperature, the sake, the pacing, every detail landed quietly.", name: "Mara Whitman" },
          { quote: "A dark little counter with the discipline of Tokyo and the warmth of a chef who reads every guest.", name: "Julian Reeves" },
          { quote: "The uni course alone was worth the booking. Restrained, beautiful, and completely memorable.", name: "Clara Bennett" }
        ]
      },
      events: {
        eyebrow: "Private omakase",
        title: "For founder dinners, collectors, and celebrations that require focus.",
        body: "Reserve the full counter for a private omakase built around seasonal fish, sake pairing, quiet service, and the cadence of your guests.",
        cta: { label: "Plan Private Omakase", href: "#reservations" },
        items: [
          "Full counter buyouts for up to 12 guests",
          "Executive dinners and collector sake pairings",
          "Milestone birthdays with custom seasonal menus"
        ]
      },
      reservations: {
        eyebrow: "Reservations",
        title: "Reserve the counter. The menu will follow the season.",
        body: "For allergies, sake pairing requests, or private counter buyouts, leave a note and our host team will respond with availability.",
        noteLabel: "Hours",
        noteText: "Tuesday to Saturday, 6:00 PM and 8:45 PM seatings"
      },
      location: {
        eyebrow: "Location",
        contactCta: { label: "Contact the Host Team" }
      },
      faq: {
        eyebrow: "FAQ",
        title: "Before the counter.",
        items: [
          { question: "How long is the omakase?", answer: "Most seatings last around two hours. We recommend arriving ten minutes early so the counter can begin together." },
          { question: "Can you accommodate allergies?", answer: "Please include allergies when requesting your reservation. Because the menu centers on seafood, rice, soy, and shellfish, some restrictions may require advance confirmation." },
          { question: "Do you offer a la carte?", answer: "Kaze is omakase-only. Supplemental pieces may be offered by the chef depending on the market." },
          { question: "What is the cancellation policy?", answer: "Reservations may be changed up to 48 hours before arrival. Late cancellations for omakase bookings may incur a fee." },
          { question: "Do you offer private buyouts?", answer: "Yes. The full counter can be reserved for up to 12 guests with optional sake pairing." }
        ]
      },
      finalCta: {
        eyebrow: "The counter is ready",
        title: "Trust the season. Let the chef decide the evening.",
        cta: { label: "Reserve the Counter", href: "#reservations" }
      },
      forms: {
        reservation: {
          labels: {
            messagePlaceholder: "Allergies, sake pairing interest, occasion, or private counter request"
          },
          successMessage: "Thank you. Your request has been received. Our host team will confirm counter availability shortly."
        },
        newsletter: {
          successMessage: "You are on the list. Seasonal notes will arrive soon."
        }
      },
      privacy: {
        title: "Privacy Policy",
        description: "Privacy policy for Kaze Omakase reservation and newsletter requests.",
        intro: "This page explains how reservation and newsletter information is handled when this static omakase template is configured for a real client.",
        sections: [
          {
            title: "Information Collected",
            body: "The reservation form may collect name, email, preferred date, preferred time, guest count, allergy notes, sake pairing interest, and optional messages. The newsletter form may collect an email address."
          },
          {
            title: "How Information Is Used",
            body: "Information is used only to respond to reservation requests, manage hospitality communication, and send optional updates if a newsletter endpoint is connected."
          },
          {
            title: "Form Providers",
            body: "This template can run in demo mode, submit to a form endpoint, open WhatsApp, or open an email client. When connected to a third-party provider, that provider's privacy terms may also apply."
          },
          {
            title: "Data Retention",
            body: "Retention depends on the final client workflow and booking provider. For production use, update this policy with the client's real retention and deletion process."
          },
          {
            title: "Contact",
            body: "For privacy requests, contact the restaurant using the email configured for this site."
          }
        ]
      }
    }
  },

};

{
  const config = window.RESTAURANT_TEMPLATE_CONFIG;
  const client = config.client || {};
  const requestedLanguage = String(client.language || config.site?.language || "en").toLowerCase();
  const selectedLanguage = requestedLanguage === "es" ? "es" : "en";
  const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

  const mergeDeep = (target, source) => {
    Object.entries(source || {}).forEach(([key, sourceValue]) => {
      const targetValue = target[key];

      if (Array.isArray(sourceValue)) {
        if (
          Array.isArray(targetValue) &&
          targetValue.every(isPlainObject) &&
          sourceValue.every(isPlainObject)
        ) {
          target[key] = targetValue.map((item, index) => (
            sourceValue[index] ? mergeDeep({ ...item }, sourceValue[index]) : item
          ));
          sourceValue.slice(targetValue.length).forEach((item) => target[key].push(item));
        } else {
          target[key] = sourceValue;
        }
        return;
      }

      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        mergeDeep(targetValue, sourceValue);
        return;
      }

      target[key] = sourceValue;
    });

    return target;
  };

  config.client.language = selectedLanguage;
  config.site.language = selectedLanguage;
  config.site.locale = selectedLanguage === "es" ? "es_ES" : "en_US";

  const brandParts = String(client.name || "").trim().split(/\s+/).filter(Boolean);
  const phoneHref = String(client.phone || "").replace(/[^\d+]/g, "");
  const mapsQuery = encodeURIComponent(`${client.address || ""} ${client.city || ""}`.trim());
  const defaultEnglishTagline = "Tokyo Luxury Omakase";
  const defaultEnglishSeoDescription = "Kaze Omakase is a premium Tokyo-inspired sushi counter with seasonal nigiri, sake pairings, and quiet precision.";
  const defaultEnglishHours = "Tue to Sat, 6:00 PM and 8:45 PM seatings";
  const defaultEnglishCuisine = "Japanese|Omakase|Sushi";
  const shouldSkipEnglishDefault = (value, defaultValue) => selectedLanguage === "es" && value === defaultValue;
  const clientTagline = shouldSkipEnglishDefault(client.tagline, defaultEnglishTagline) ? "" : client.tagline;
  const clientSeoDescription = shouldSkipEnglishDefault(client.seoDescription, defaultEnglishSeoDescription) ? "" : client.seoDescription;
  const clientHours = shouldSkipEnglishDefault(client.hours, defaultEnglishHours) ? "" : client.hours;
  const clientCuisine = (
    selectedLanguage === "es" &&
    Array.isArray(client.cuisine) &&
    client.cuisine.join("|") === defaultEnglishCuisine
  ) ? null : client.cuisine;
  const defaultTitleSuffix = selectedLanguage === "es" ? "Restaurante premium" : "Premium Restaurant";

  if (client.name) {
    config.brand.name = brandParts[0] || client.name;
    config.brand.descriptor = brandParts.slice(1).join(" ");
    config.brand.fullName = client.name;
    config.location.mapLabel = client.name;
    config.seo.title = `${client.name} | ${clientTagline || defaultTitleSuffix}`;
    config.seo.ogTitle = `${client.name} | ${clientTagline || defaultTitleSuffix}`;
  }

  if (client.url) {
    config.site.url = client.url;
  }

  if (clientTagline) {
    config.brand.tagline = clientTagline;
  }

  if (clientSeoDescription) {
    config.seo.description = clientSeoDescription;
    config.seo.ogDescription = clientSeoDescription;
  }

  if (clientCuisine) config.business.cuisine = clientCuisine;
  if (client.priceRange) config.business.priceRange = client.priceRange;
  if (client.email) {
    config.contact.email = client.email;
    config.forms.reservation.emailFallback = client.email;
  }
  if (client.phone) {
    config.contact.phoneDisplay = client.phone;
    config.contact.phoneHref = phoneHref.startsWith("+") ? phoneHref : `+${phoneHref}`;
  }
  if (client.address) {
    config.contact.addressLine = client.address;
    config.location.title = client.address;
  }
  if (client.city) {
    config.contact.district = client.city;
    config.contact.city = client.city;
    config.location.mapSubLabel = client.city;
  }
  if (clientHours) {
    config.hours.short = clientHours;
    config.hours.location = clientHours;
    config.reservations.noteText = clientHours;
  }

  if (config.socials) {
    Object.entries({
      Instagram: config.socials.instagram,
      Facebook: config.socials.facebook,
      TikTok: config.socials.tiktok
    }).forEach(([label, url]) => {
      const item = config.contact.social.find((social) => social.label === label);
      if (item && url !== undefined) item.url = url;
    });
  }

  if (Object.prototype.hasOwnProperty.call(client, "instagram")) {
    const instagram = config.contact.social.find((item) => item.label === "Instagram");
    if (instagram) instagram.url = client.instagram;
  }
  if (Object.prototype.hasOwnProperty.call(client, "facebook")) {
    const facebook = config.contact.social.find((item) => item.label === "Facebook");
    if (facebook) facebook.url = client.facebook;
  }
  if (Object.prototype.hasOwnProperty.call(client, "tiktok")) {
    const tiktok = config.contact.social.find((item) => item.label === "TikTok");
    if (tiktok) tiktok.url = client.tiktok;
  }
  if (client.reservationMode) {
    config.forms.reservation.submitMode = client.reservationMode;
  }
  if (config.reservation?.mode) {
    config.forms.reservation.submitMode = config.reservation.mode;
  }
  if (client.whatsappNumber) {
    config.forms.reservation.whatsappNumber = client.whatsappNumber;
  }
  if (config.reservation?.whatsappNumber) {
    config.forms.reservation.whatsappNumber = config.reservation.whatsappNumber;
  }
  if (client.formEndpoint) {
    config.forms.reservation.endpoint = client.formEndpoint;
  }
  if (config.reservation?.endpoint) {
    config.forms.reservation.endpoint = config.reservation.endpoint;
  }
  if (config.reservation?.emailFallback) {
    config.forms.reservation.emailFallback = config.reservation.emailFallback;
  }
  if (client.newsletterEndpoint) {
    config.forms.newsletter.endpoint = client.newsletterEndpoint;
  }
  if (mapsQuery) {
    config.contact.mapsUrl = `https://maps.google.com/?q=${mapsQuery}`;
  }
}
