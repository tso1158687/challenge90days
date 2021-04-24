import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckinService {
  constructor(private http: HttpClient) {
    this.http.get("https://challenge-90-days.herokuapp.com/api/hello").subscribe(e=>{
      console.log(e)
    })
  }

  addCheckin(message: string): Observable<any> {
    return this.http.post('/api/checkin', { message });
  }
}
