import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@challenge90days/api-interfaces';
import * as AOS from 'aos';
@Component({
  selector: 'challenge90days-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    AOS.init();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  
    
  }
  hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient) {}
}
