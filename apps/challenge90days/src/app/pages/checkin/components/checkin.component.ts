import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'challenge90days-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {

  constructor(private toastrService: NbToastrService) {}


  ngOnInit(): void {
  }

  checkin(){
    this.toastrService.success('成功','恭喜')
  }

}
