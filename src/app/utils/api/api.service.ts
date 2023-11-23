import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api = environment.apiUrl;

  constructor(private http: HttpClient) { }

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
}
