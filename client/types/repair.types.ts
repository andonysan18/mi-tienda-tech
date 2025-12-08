export interface RepairTicket {
  id: string;
  deviceModel: string;
  issueDescription: string;
  status: 'PENDIENTE' | 'EN_DIAGNOSTICO' | 'ESPERANDO_REPUESTO' | 'EN_REPARACION' | 'LISTO' | 'ENTREGADO';
  contactPhone: string;
  estimatedCost: number | 0;
  createdAt: string;
}

export interface CreateTicketData {
  deviceModel: string;
  issueDescription: string;
}