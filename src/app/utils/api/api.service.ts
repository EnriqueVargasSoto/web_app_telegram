import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api = environment.apiUrl;
  public isAuthenticated: boolean = false;
  private localStorageKey = 'user';

  constructor(private http: HttpClient, private router: Router) { }

  async consulta(url: string, metodo: string, body?:any): Promise<Observable<any>>{

    switch (metodo) {
      case 'get':
        return await this.http.get(`${this.api}${url}`);
        break;

      case 'post':
        return await this.http.post(`${this.api}${url}`, body);
        break;

      case 'put':
        return await this.http.put(`${this.api}${url}`, body);
        break;

      case 'delete':
        return await this.http.delete(`${this.api}${url}`);
        break;

      default:
        return await this.http.get(`${this.api}${url}`);
        break;
    }
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.isAuthenticated = false;
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {


    const userJson = localStorage.getItem(this.localStorageKey);

    this.isAuthenticated =  userJson ? true : false;
    return this.isAuthenticated;
  }
}
