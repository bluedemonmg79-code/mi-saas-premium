export const NICHES = {
  health: {
    id: 'health',
    appName: 'MedixFlow',
    primaryColor: '#00F2FE',
    secondaryColor: '#4FACFE',
    labels: {
      clients: 'Pacientes',
      dashboardTitle: 'Resumen Clínico',
      appointments: 'Citas Médicas',
      revenue: 'Ingresos Clínicos',
      welcome: 'Dr. González',
      newAction: 'Nueva Cita',
      agendaT: 'Agenda Médica',
      historyTitle: 'Historial Clínico Digital',
      historyLabel: 'Notas de Evolución',
      historyPlaceholder: 'Describe el estado actual, diagnóstico o tratamiento indicado hoy...'
    },
    catalog: [
      "J00 Resfriado común",
      "K02 Caries dental CIE-10",
      "K04 Enfermedad de la pulpa",
      "Consulta Valoración Inicial",
      "Extracción 3er molar",
      "Limpieza dental profunda"
    ],
    documentTitle: "Receta Médica / Expediente"
  },
  legal: {
    id: 'legal',
    appName: 'LexAdmin',
    primaryColor: '#D4AF37', // Dorado
    secondaryColor: '#8C7326', // Bronce
    labels: {
      clients: 'Casos/Clientes',
      dashboardTitle: 'Resumen Jurídico',
      appointments: 'Audiencias',
      revenue: 'Honorarios',
      welcome: 'Lic. González',
      newAction: 'Nuevo Caso',
      agendaT: 'Agenda de Audiencias',
      historyTitle: 'Expediente Jurídico Digital',
      historyLabel: 'Avances del Caso / Notas Literales',
      historyPlaceholder: 'Registra comparecencias, acuerdos o estrategias legales...'
    },
    catalog: [
      "Divorcio incausado", 
      "Pensión alimenticia", 
      "Amparo indirecto", 
      "Contrato de arrendamiento", 
      "Asesoría corporativa"
    ],
    documentTitle: "Reporte de Asesoría Legal"
  },
  fitness: {
    id: 'fitness',
    appName: 'GymControl',
    primaryColor: '#EF4444', // Rojo
    secondaryColor: '#B91C1C', // Carmesí oscuro
    labels: {
      clients: 'Miembros',
      dashboardTitle: 'Resumen Operativo',
      appointments: 'Clases Grupales',
      revenue: 'Membresías',
      welcome: 'Coach González',
      newAction: 'Nuevo Ingreso',
      agendaT: 'Clases de Hoy',
      historyTitle: 'Seguimiento de Miembro',
      historyLabel: 'Notas de Progreso y Salud',
      historyPlaceholder: 'Registra medidas, objetivos alcanzados o lesiones...'
    },
    catalog: [
      "Plan de Hipertrofia", 
      "Plan Pérdida de Peso", 
      "Consulta Nutricional", 
      "Entrenamiento Funcional", 
      "Rehabilitación Deportiva"
    ],
    documentTitle: "Régimen de Entrenamiento"
  },
  realestate: {
    id: 'realestate',
    appName: 'ArquiTrack',
    primaryColor: '#F59E0B', 
    secondaryColor: '#D97706',
    labels: {
      clients: 'Proyectos/Compradores',
      dashboardTitle: 'Resumen de Obras',
      appointments: 'Inspecciones',
      revenue: 'Ventas y Comisiones',
      welcome: 'Arqui',
      newAction: 'Nuevo Proyecto',
      agendaT: 'Visitas Programadas',
      historyTitle: 'Ficha de Seguimiento Inmobiliario',
      historyLabel: 'Notas de Interés y Ofertas',
      historyPlaceholder: 'Anota preferencias de propiedad, presupuesto o feedback de visitas...'
    },
    catalog: [
      "Avalúo Comercial", 
      "Recorrido de Propiedad", 
      "Presupuesto de Obra", 
      "Asesoría Hipotecaria", 
      "Remodelación de Interior"
    ],
    documentTitle: "Ficha Técinica de Propiedad"
  },
  medicine: {
    id: 'medicine',
    appName: 'VitaCare',
    primaryColor: '#10B981', // Esmeralda
    secondaryColor: '#065F46', // Verde Bosque
    labels: {
      clients: 'Pacientes',
      dashboardTitle: 'Gestión Clínica',
      appointments: 'Consultas Médicas',
      revenue: 'Ingresos por Consulta',
      welcome: 'Dr. Medina',
      newAction: 'Nueva Consulta',
      agendaT: 'Agenda de Consultas',
      historyTitle: 'Expediente Clínico Digital',
      historyLabel: 'Notas Médicas / Evolución',
      historyPlaceholder: 'Indica síntomas, diagnóstico y plan de tratamiento...'
    },
    catalog: [
      "Z00.0 Examen médico general",
      "J01 Sinusitis aguda",
      "I10 Hipertensión esencial",
      "E11 Diabetes Mellitus tipo 2",
      "R05 Tos persistente",
      "Certificado Médico de Salud"
    ],
    documentTitle: "Receta Médica Oficial"
  }
};
