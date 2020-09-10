import { animate, animation, keyframes, style } from '@angular/animations';

export const SCORE_CHANGED_ANIMATION = animation([
    style({ transform: 'scale(1)' }),
    animate('500ms linear', keyframes([
        style({ transform: 'scale(1.8)', offset: 0.50 }),
        style({ transform: 'scale(1)', offset: 1 })
    ]))
]);
