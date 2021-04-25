import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'challenge90days-firework',
  templateUrl: './firework.component.html',
  styleUrls: ['./firework.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FireworkComponent {
  @Input() showFirework$:BehaviorSubject<boolean>;
  
}
