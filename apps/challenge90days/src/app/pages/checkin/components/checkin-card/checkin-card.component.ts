import { Component, Input, OnInit } from '@angular/core';
import { Checkin } from '@challenge90days/api-interfaces';

@Component({
  selector: 'challenge90days-checkin-card',
  templateUrl: './checkin-card.component.html',
  styleUrls: ['./checkin-card.component.scss']
})
export class CheckinCardComponent implements OnInit {
  @Input() status=''
  @Input() checkin:Checkin
  constructor() { }

  ngOnInit(): void {
  }

}
