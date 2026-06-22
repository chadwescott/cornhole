import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { SupabaseEvent } from '../../models/supabase/supabase-event.model';
import { EventService } from '../../services/event.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';

@Component({
    selector: 'ch-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule
    ]
})
export class EventsComponent implements OnInit {
    events: SupabaseEvent[] = [];
    isLoading = true;
    deletingEventId: number | null = null;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    selectedEventId: number | null = null;

    private readonly eventService = inject(EventService);
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);

    async ngOnInit(): Promise<void> {
        await this.loadEvents();
    }

    async openAddEventDialog(): Promise<void> {
        this.errorMessage = null;
        this.successMessage = null;

        const dialogRef = this.dialog.open(EventDialogComponent, {
            disableClose: true,
            width: '28rem',
            maxWidth: '95vw',
            data: {
                mode: 'add'
            }
        });

        const saved = await firstValueFrom(dialogRef.afterClosed());
        if (!saved) {
            return;
        }

        await this.loadEvents(false);
        this.successMessage = 'Event added.';
    }

    async editEvent(event: SupabaseEvent): Promise<void> {
        this.selectedEventId = event.id;
        this.errorMessage = null;
        this.successMessage = null;

        const dialogRef = this.dialog.open(EventDialogComponent, {
            width: '28rem',
            maxWidth: '95vw',
            data: {
                mode: 'edit',
                event
            }
        });

        const saved = await firstValueFrom(dialogRef.afterClosed());
        if (!saved) {
            return;
        }

        await this.loadEvents(false);
        this.successMessage = 'Event saved.';
    }

    navigateToEventGames(event: SupabaseEvent): void {
        this.router.navigate(['games', event.id]);
    }

    navigateToEventPlayerStats(event: SupabaseEvent): void {
        this.router.navigate(['player-stats', event.id]);
    }

    async deleteEvent(event: SupabaseEvent): Promise<void> {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Event',
                message: 'Are you sure you want to delete this event? This action cannot be undone.',
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        });

        const confirmed = await firstValueFrom(dialogRef.afterClosed());
        if (!confirmed) {
            return;
        }

        this.errorMessage = null;
        this.successMessage = null;
        this.deletingEventId = event.id;

        try {
            await this.eventService.deleteEvent(event.id);
            this.events = this.events.filter(x => x.id !== event.id);

            if (this.selectedEventId === event.id) {
                this.selectedEventId = null;
            }

            this.successMessage = 'Event deleted.';
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
        } finally {
            this.deletingEventId = null;
        }
    }

    private async loadEvents(setLoadingState: boolean = true): Promise<void> {
        if (setLoadingState) {
            this.isLoading = true;
        }

        this.errorMessage = null;

        try {
            this.events = await this.eventService.getEvents();

            if (this.selectedEventId && !this.events.some(event => event.id === this.selectedEventId)) {
                this.selectedEventId = null;
            }
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to load events';
        } finally {
            if (setLoadingState) {
                this.isLoading = false;
            }
        }
    }
}