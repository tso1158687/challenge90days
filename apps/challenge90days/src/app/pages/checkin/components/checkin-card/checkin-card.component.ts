import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { Checkin } from '@challenge90days/api-interfaces';

@Component({
  selector: 'challenge90days-checkin-card',
  templateUrl: './checkin-card.component.html',
  styleUrls: ['./checkin-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckinCardComponent {
  @Input() isSelf = false;
  @Input() status = '';
  @Input() checkin: Checkin;
  randomId = (Math.random() + 1).toString(36).substring(7);

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  getRandomIdTag(): string {
    const randomIdTag = `#${this.randomId}`;
    this.changeDetectorRef.markForCheck();
    return randomIdTag;
  }
}
