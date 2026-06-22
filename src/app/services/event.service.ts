import { inject, Injectable } from '@angular/core';

import { SupabaseEvent } from '../models/supabase/supabase-event.model';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private readonly supabaseService = inject(SupabaseService);

    async getEvents(): Promise<SupabaseEvent[]> {
        const response = await this.supabaseService.request(
            'events?select=id,name,event_date,complete&order=event_date.desc'
        );
        return await response.json() as SupabaseEvent[];
    }

    async getEventById(id: number): Promise<SupabaseEvent> {
        const response = await this.supabaseService.request(
            `events?select=id,name,event_date,complete&id=eq.${id}&limit=1`
        );
        const events = await response.json() as SupabaseEvent[];
        const event = events[0];
        if (!event) {
            throw new Error(`Event ${id} not found`);
        }
        return event;
    }

    async createEvent(name: string, eventDate: string, complete: boolean): Promise<SupabaseEvent> {
        const response = await this.supabaseService.request('events', {
            method: 'POST',
            headers: { Prefer: 'return=representation' },
            body: { name, event_date: eventDate, complete }
        });
        const created = await response.json() as SupabaseEvent[];
        const event = created[0];
        if (!event?.id) {
            throw new Error('Supabase create event failed: missing event in response');
        }
        return event;
    }

    async updateEvent(id: number, name: string, eventDate: string, complete: boolean): Promise<void> {
        await this.supabaseService.request(`events?id=eq.${id}`, {
            method: 'PATCH',
            headers: { Prefer: 'return=minimal' },
            body: { name, event_date: eventDate, complete }
        });
    }

    async deleteEvent(id: number): Promise<void> {
        await this.supabaseService.request(`events?id=eq.${id}`, {
            method: 'DELETE',
            headers: { Prefer: 'return=minimal' }
        });
    }
}
