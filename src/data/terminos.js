// Términos y condiciones de DrinkEmAll. Es la ÚNICA fuente del texto: la página
// /terminos lo dibuja y docs/terminos-y-condiciones.md/.docx se generan de acá,
// para que no puedan decir cosas distintas.
//
// Lo que el comercio todavía no entregó va como [DATO PENDIENTE: ...] y la página
// lo resalta. No se inventan razón social, CUIT, domicilio, plazos ni canales.
//
// BORRADOR TÉCNICO: tiene que revisarlo una persona con conocimiento legal antes
// de publicarse como definitivo.

export const FECHA_TERMINOS = '16 de noviembre de 2026'

// Cada sección: { titulo, bloques: [ { p } | { ul: [...] } | { nota } ] }
export const SECCIONES = [
  {
    titulo: '1. Quién vende y qué regula este texto',
    bloques: [
      {
        p: 'Estos términos regulan las compras que se hacen a través de este sitio. Al confirmar un pedido, la persona declara haberlos leído y aceptarlos. Se aplican junto con la Ley 24.240 de Defensa del Consumidor y el Código Civil y Comercial de la Nación, que prevalecen en todo lo que estos términos no puedan limitar.',
      },
      {
        ul: [
          'Proveedor: [DATO PENDIENTE: razón social o nombre y apellido del titular]',
          'CUIT: [DATO PENDIENTE]',
          'Domicilio comercial: [DATO PENDIENTE: calle y número], Juan José Castelli, provincia del Chaco, República Argentina',
          'Contacto: [DATO PENDIENTE: correo y teléfono de atención]',
        ],
      },
    ],
  },
  {
    titulo: '2. Venta de alcohol: solo a mayores de 18 años',
    bloques: [
      {
        p: 'La venta de bebidas alcohólicas a menores de 18 años está prohibida (Ley 24.788). Para comprar hace falta una cuenta con fecha de nacimiento y DNI, y el servidor vuelve a comprobar la mayoría de edad al crear cada pedido.',
      },
      {
        p: 'Al entregar el pedido se pide el DNI de quien recibe. Si no es mayor de 18 años, o no puede acreditarlo, el pedido no se entrega. Los datos cargados no se contrastan con ningún registro oficial; la verificación efectiva es la del momento de la entrega.',
      },
      {
        p: 'Ni la cuenta ni el pedido pueden usarse para comprar en nombre de un menor. Beber con moderación. Prohibida su venta a menores de 18 años.',
      },
    ],
  },
  {
    titulo: '3. Productos y precios',
    bloques: [
      {
        ul: [
          'Los precios están expresados en pesos argentinos e incluyen IVA. El costo de envío, si corresponde, se muestra antes de confirmar y se suma al total.',
          'La disponibilidad es la del stock que figura en el sitio al confirmar el pedido. Si dos personas piden el último producto, el servidor acepta el primer pedido y rechaza el otro.',
          'Las imágenes son ilustrativas. Ante un error evidente de precio o descripción, el comercio puede cancelar el pedido y devolver lo pagado.',
        ],
      },
    ],
  },
  {
    titulo: '4. Cómo se hace un pedido y qué estados tiene',
    bloques: [
      {
        p: 'El pedido se registra con estado Recibido cuando se confirma. No es una aceptación definitiva: el comercio lo prepara y puede cancelarlo en los casos de la sección 9. Después pasa por los estados:',
      },
      {
        ul: [
          'Envío a domicilio: Recibido, Preparando, En camino, Entregado.',
          'Retiro en el local: Recibido, Preparando, Listo para retirar, Entregado.',
          'Cancelado: solo mientras el pedido está Recibido o Preparando.',
        ],
      },
      { p: 'Cada cambio queda registrado con su fecha y hora y se ve en "Mis pedidos".' },
    ],
  },
  {
    titulo: '5. Medios de pago',
    bloques: [
      {
        p: 'Se aceptan efectivo (al recibir el pedido o al retirarlo), transferencia bancaria y, cuando está habilitado, Mercado Pago. El sitio no guarda datos de tarjetas.',
      },
      {
        p: 'En las transferencias, el comercio confirma el pago a mano. Los datos de la cuenta se informan al confirmar el pedido: [DATO PENDIENTE: alias o CBU y titular]. Plazo para acreditar la transferencia antes de que el pedido se cancele: [DATO PENDIENTE].',
      },
      {
        p: 'Con Mercado Pago el pago se hace en el sitio de Mercado Pago, que procesa los datos de la tarjeta o de la cuenta bajo sus propios términos y recibe los datos de la compra necesarios para cobrarla. El pedido queda reservado durante [DATO PENDIENTE: confirmar el plazo; hoy 60 minutos] para que se complete el pago: pasado ese plazo sin pagarse, se cancela solo y se libera el stock. Si el pago se aprueba, el pedido pasa a Pagado; si queda pendiente de acreditación, se actualiza cuando Mercado Pago lo confirma.',
      },
    ],
  },
  {
    titulo: '6. Entrega y retiro',
    bloques: [
      {
        ul: [
          'Zona de entrega: Juan José Castelli y localidades cercanas. Un pedido fuera de zona puede ser cancelado por el comercio.',
          'Costo de envío: el que se informa en el sitio al armar el pedido, con envío gratis a partir del importe que allí se indique.',
          'Retiro en el local: sin cargo, en [DATO PENDIENTE: dirección del local y horarios], cuando el pedido figure como Listo para retirar.',
          'Plazos de entrega: [DATO PENDIENTE]. El comercio se comunica al teléfono de contacto del pedido.',
          'Quien recibe debe exhibir el DNI y ser mayor de 18 años (sección 2).',
        ],
      },
    ],
  },
  {
    titulo: '7. Derecho de revocación (botón de arrepentimiento)',
    bloques: [
      {
        p: 'Quien compra a distancia puede revocar la compra, sin responsabilidad alguna, dentro de los 10 días corridos contados desde que recibe el producto o se celebra el contrato, lo último que ocurra (artículo 34 de la Ley 24.240). Este derecho no puede ser renunciado.',
      },
      {
        ul: [
          'Se ejerce con el botón BOTÓN DE ARREPENTIMIENTO, visible en todas las páginas del sitio. No hace falta tener cuenta ni hacer otro trámite: se piden solo el nombre y un correo o teléfono de contacto, y opcionalmente el número de pedido.',
          'Al enviar la solicitud el sitio muestra un código de identificación. El comercio responde dentro de las 24 horas, por el contacto que se indicó, y coordina la devolución del producto y del dinero.',
          'El producto debe devolverse en las condiciones en que se recibió. Los gastos de devolución están a cargo del proveedor. Plazo y forma del reintegro del dinero: [DATO PENDIENTE: confirmar con el comercio].',
          'No corresponde la revocación en los casos que la ley exceptúa: productos perecederos, productos ya consumidos o utilizados, y compras para reventa o integradas a procesos productivos.',
        ],
      },
    ],
  },
  {
    titulo: '8. Productos defectuosos y garantía legal',
    bloques: [
      {
        p: 'Si un producto llega dañado, equivocado o en mal estado, la persona puede reclamar por el contacto del comercio. Se aplica la garantía legal de la Ley 24.240 (artículos 11 a 18), que no puede ser limitada por estos términos.',
      },
    ],
  },
  {
    titulo: '9. Cancelación por parte del comercio',
    bloques: [
      {
        p: 'El comercio puede cancelar un pedido que esté Recibido o Preparando por falta de stock, error de precio, entrega fuera de zona, imposibilidad de contactar a la persona o falta de acreditación del pago por transferencia. La cancelación repone el stock, anula el pago pendiente y devuelve lo que se hubiera abonado.',
      },
    ],
  },
  {
    titulo: '10. Cuenta y datos personales',
    bloques: [
      {
        p: 'La persona es responsable de la veracidad de sus datos y de cuidar su contraseña. Los datos personales se tratan según la Política de Privacidad (/privacidad).',
      },
    ],
  },
  {
    titulo: '11. Atención al consumidor y reclamos',
    bloques: [
      {
        p: 'Consultas y reclamos: [DATO PENDIENTE: canal de atención]. Horario de atención: [DATO PENDIENTE: no puede ser inferior a 8 horas diarias en días hábiles si la atención es solo telefónica o electrónica, según la Disposición 954/2025].',
      },
      {
        p: 'La persona consumidora también puede presentar su reclamo ante la autoridad de defensa del consumidor de su jurisdicción.',
      },
    ],
  },
  {
    titulo: '12. Ley aplicable y jurisdicción',
    bloques: [
      {
        p: 'Se aplica la ley argentina. Ante un conflicto, la persona consumidora puede acudir a los tribunales ordinarios correspondientes al lugar de cumplimiento del contrato o a su domicilio (artículo 36 de la Ley 24.240).',
      },
    ],
  },
  {
    titulo: '13. Cambios en estos términos',
    bloques: [
      {
        p: 'Los cambios se publican en esta página con su fecha. Cada pedido se rige por los términos vigentes al momento de confirmarlo.',
      },
    ],
  },
]
