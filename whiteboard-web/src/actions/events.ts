'use server';

import { handleRequest, buildQueryString } from './utils/handleRequest';
import { Event, CreateEventData } from './utils/event-types';

export async function getEvents(startDate?: string, endDate?: string) {
  let query = '';
  if (startDate || endDate) {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    query = await buildQueryString(params);
  }
  
  return handleRequest<Event[]>('get', `events${query}`);
}

export async function getEvent(eventId: string) {
  return handleRequest<Event>('get', `events/${eventId}`);
}

export async function createEvent(eventData: CreateEventData) {
  return handleRequest<Event>('post', 'events', eventData);
}

export async function updateEvent(eventId: string, eventData: Partial<CreateEventData>) {
  return handleRequest<Event>('patch', `events/${eventId}`, eventData);
}

export async function deleteEvent(eventId: string) {
  return handleRequest('delete', `events/${eventId}`);
}
