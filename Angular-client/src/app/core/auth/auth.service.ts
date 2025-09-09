import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =  'http://localhost:3000/auth';

  constructor(private httpClient : HttpClient) {}

  login(credentials: { email: string; password: string}) : Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/login`, credentials);
  }

}
