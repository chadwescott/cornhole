import { animate, animation, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { Round } from '../../models/round';
import { TeamColor } from '../../models/team-color';

@Component({
    selector: 'ch-round',
    templateUrl: './round.component.html',
    styleUrls: ['./round.component.scss'],
    animations: [
        trigger('scoreChanged', [
            transition('* => *', [
                animation([
                    style({ transform: 'scale(1)' }),
                    animate('0.5s', keyframes([
                        style({ transform: 'scale(1.5)', offset: 0.50 }),
                        style({ transform: 'scale(1)', offset: 1 })
                    ]))
                ])
            ])
        ])
    ],
    standalone: false
})
export class RoundComponent {
    disabled = input<boolean>(false);
    round = input.required<Round>();
    team1Color = input.required<TeamColor>();
    team2Color = input.required<TeamColor>();

    @Output()
    roundScoreChanged = new EventEmitter<Round>();
}
