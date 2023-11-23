import { Component } from '@angular/core';
import { ApiService } from "../../utils/api/api.service";
import { environment } from 'src/environments/environment.development';
import { Category } from 'src/app/models/Category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  listCategories : Category[] = [];

  pagination: number = 0;
  filtro: string = "";
  products: any[] =[];
  paginas: number = 0;
  selectFiltro = "";

  constructor( private apiService: ApiService){}

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.getCategories();
    await this.getProducts();
  }

  async getProducts() {

    let body = {
      'lista_precio' : environment.lista_precio,
      'pagina' : this.pagination,
      'filtroxnombre' : this.filtro.toUpperCase(),
      'filtroxcategoria' : this.selectFiltro,
      'compania' : environment.Compania,
      'sucursal' : environment.Sucursal
    };
    (await this.apiService.consulta('list-products','post', body)).subscribe(resp => {

      console.log(resp);
      this.products = resp['data']['items'];
      this.paginas = resp['data']['total_paginas'];
      console.log(this.products);
    });
  }

  async getCategories(){
    let body = {
      'compania' : environment.Compania,
      'sucursal' : environment.Sucursal
    };
    (await this.apiService.consulta('categories', 'post', body)).subscribe(resp => {
      this.listCategories.push({
        'categoria_cod' : "",
        'categoria_dsc' : "--Selecciones categoría--"
      })
      console.log(resp);
      this.listCategories.push(...resp['categoria']);
      console.log(this.listCategories);
    });
  }
}
