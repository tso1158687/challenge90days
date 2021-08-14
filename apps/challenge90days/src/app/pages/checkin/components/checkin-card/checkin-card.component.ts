import { Component, Input, OnInit } from '@angular/core';
import { Checkin } from '@challenge90days/api-interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'challenge90days-checkin-card',
  templateUrl: './checkin-card.component.html',
  styleUrls: ['./checkin-card.component.scss'],
})
export class CheckinCardComponent {
  @Input() isSelf = false;
  @Input() status = '';
  @Input() checkin: Checkin;
}
