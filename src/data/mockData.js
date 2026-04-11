// Datos de demostración centralizados por nicho
export const mockEntities = {
  health: [
    { id: 1, name: 'Valeria Ramírez', email: 'valeria.r@gmail.com', phone: '555-1234', status: 'active', date: '2024-01-15', detail: 'Ortodoncia', avatar: 'VR' },
    { id: 2, name: 'Roberto Carlos', email: 'roberto.c@hotmail.com', phone: '555-5678', status: 'pending', date: '2024-02-20', detail: 'Limpieza dental', avatar: 'RC' },
    { id: 3, name: 'Ana Sofía Garza', email: 'ana.garza@gmail.com', phone: '555-9012', status: 'active', date: '2024-03-05', detail: 'Blanqueamiento', avatar: 'AG' },
    { id: 4, name: 'Luis Miguel Torres', email: 'luismiguel@yahoo.com', phone: '555-3456', status: 'inactive', date: '2023-12-10', detail: 'Extracción molar', avatar: 'LT' },
    { id: 5, name: 'Carmen López', email: 'carmen.lopez@gmail.com', phone: '555-7890', status: 'active', date: '2024-04-01', detail: 'Revisión general', avatar: 'CL' },
    { id: 6, name: 'Marcos Hernández', email: 'marcos.h@gmail.com', phone: '555-2345', status: 'active', date: '2024-04-08', detail: 'Implante dental', avatar: 'MH' },
  ],
  legal: [
    { id: 1, name: 'Empresa Sigma SA', email: 'contacto@sigma.com', phone: '555-1111', status: 'active', date: '2024-01-20', detail: 'Litigio mercantil', avatar: 'ES' },
    { id: 2, name: 'Juan Pablo Reyes', email: 'jp.reyes@gmail.com', phone: '555-2222', status: 'active', date: '2024-02-14', detail: 'Divorcio', avatar: 'JR' },
    { id: 3, name: 'Constructora Norte', email: 'legal@norte.mx', phone: '555-3333', status: 'pending', date: '2024-03-30', detail: 'Contrato inmobiliario', avatar: 'CN' },
    { id: 4, name: 'María Fernanda Gil', email: 'mf.gil@hotmail.com', phone: '555-4444', status: 'inactive', date: '2023-11-05', detail: 'Sucesión hereditaria', avatar: 'MG' },
  ],
  fitness: [
    { id: 1, name: 'Sofía Castillo', email: 'sofia.c@gmail.com', phone: '555-5555', status: 'active', date: '2024-01-10', detail: 'Plan pérdida de peso', avatar: 'SC' },
    { id: 2, name: 'Diego Armando Ruiz', email: 'diego.r@gmail.com', phone: '555-6666', status: 'active', date: '2024-02-28', detail: 'Aumento de masa muscular', avatar: 'DR' },
    { id: 3, name: 'Patricia Méndez', email: 'paty.m@yahoo.com', phone: '555-7777', status: 'pending', date: '2024-04-05', detail: 'Plan de nutrición', avatar: 'PM' },
  ],
  realestate: [
    { id: 1, name: 'Inmobiliaria Azul', email: 'contact@azul.mx', phone: '555-8888', status: 'active', date: '2024-01-25', detail: 'Avalúo residencial', avatar: 'IA' },
    { id: 2, name: 'Roberto Sánchez', email: 'roberto.s@gmail.com', phone: '555-9999', status: 'active', date: '2024-03-15', detail: 'Diseño arquitectónico', avatar: 'RS' },
  ],
};

export const mockAppointments = [
  { id: 1, time: '09:00', name: 'Valeria Ramírez', detail: 'Revisión ortodoncia', day: 1, status: 'confirmed' },
  { id: 2, time: '10:30', name: 'Roberto Carlos', detail: 'Limpieza dental', day: 1, status: 'pending' },
  { id: 3, time: '12:00', name: 'Ana Sofía Garza', detail: 'Blanqueamiento', day: 1, status: 'confirmed' },
  { id: 4, time: '09:00', name: 'Luis Miguel Torres', detail: 'Revisión general', day: 2, status: 'confirmed' },
  { id: 5, time: '15:00', name: 'Carmen López', detail: 'Primera consulta', day: 3, status: 'confirmed' },
  { id: 6, time: '11:00', name: 'Marcos Hernández', detail: 'Implante dental', day: 4, status: 'pending' },
];
