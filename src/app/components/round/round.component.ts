import { animate, animation, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, input, Output } from '@angular/core';

import { Round } from '../../models/round';
import { TeamColor } from '../../models/team-color';
import { RoundTeamScoreComponent } from '../round-team-score/round-team-score.component';
import { RoundThrowsComponent } from '../round-throws/round-throws.component';

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
    standalone: true,
    imports: [
        RoundTeamScoreComponent,
        RoundThrowsComponent
    ]
})
export class RoundComponent {
    disabled = input<boolean>(false);
    round = input.required<Round>();
    team1Color = input.required<TeamColor>();
    team2Color = input.required<TeamColor>();

    @Output()
    roundScoreChanged = new EventEmitter<Round>();
}
