import { inject, Injectable } from '@angular/core';


import { AppStateService } from './app-state.service';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {
    private readonly appStateService = inject(AppStateService);
}