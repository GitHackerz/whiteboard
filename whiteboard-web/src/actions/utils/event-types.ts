export enum EventType {
  ASSIGNMENT = 'ASSIGNMENT',
  CLASS = 'CLASS',
  EXAM = 'EXAM',
  MEETING = 'MEETING',
  OTHER = 'OTHER',
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: EventType;
  startDate: string;
  endDate: string | null;
  location: string | null;
  courseId: string | null;
  isAllDay: boolean;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    code: string;
    title: string;
  };
}

export interface CreateEventData {
  title: string;
  description?: string;
  type: EventType;
  startDate: string;
  endDate?: string;
  location?: string;
  courseId?: string;
  isAllDay?: boolean;
}