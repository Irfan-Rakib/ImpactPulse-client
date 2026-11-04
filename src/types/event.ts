export interface EventParticipant {
  userId: string;
  name: string;
  joinedAt: string;
}

export interface EventItem {
  _id: string;
  eventId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  volunteersNeeded: number;
  imageUrl?: string;
  createdBy: string;
  createdByName: string;
  participants: EventParticipant[];
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  success: boolean;
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  events: EventItem[];
}

export interface EventResponse {
  success: boolean;
  message?: string;
  event: EventItem;
}
