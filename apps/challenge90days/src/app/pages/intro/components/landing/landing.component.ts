import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'challenge90days-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  iconOpts: AnimationOptions = {
    path: '/assets/gogo.json',
    autoplay: true,
    loop: true,
    initialSegment: [10, 88]
  };
  constructor() { }

  ngOnInit(): void {
  }

}
