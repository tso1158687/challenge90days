import { Component, OnInit } from '@angular/core';
import { footerData } from '../../data/footer';
@Component({
  selector: 'challenge90days-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  footerData = footerData;
  constructor() {}

  ngOnInit(): void {}
}
