import { Component } from '@angular/core';
import { ApiService } from "../../utils/api/api.service";
import { environment } from 'src/environments/environment.development';
import { Category } from 'src/app/models/Category.model';
import { CartService } from 'src/app/utils/cart/cart.service';
import { Product } from 'src/app/models/Product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  listCategories : Category[] = [];
  isLoading: boolean = true;

  pagination: number = 0;
  filtro: string = "";
  products: Product[] =[];
  paginas: number = 0;
  selectFiltro = "";

  pagesPerGroup = 5;

  private localStorageKey = 'user';
  usuario: any;

  constructor( private apiService: ApiService, private cart: CartService, private router: Router){}

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const userJson = localStorage.getItem(this.localStorageKey);
    this.usuario = JSON.parse(userJson!);
    this.isLoading = true;
    await this.getCategories();
    await this.getProducts().then((resp) => {
      this.isLoading = false;
    });
    //
  }

  async getProducts() {

    let body = {
      'lista_precio' : environment.lista_precio,
      'pagina' : this.pagination,
      'filtroxnombre' : this.filtro.toUpperCase(),
      'filtroxcategoria' : this.selectFiltro == '--Selecciones categoría--' ? "" : this.selectFiltro ,
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

  async selectCategoria()  {
    this.products = [];
    this.isLoading = true;
    //await this.getCategories();
    await this.getProducts().then((resp) => {
      this.isLoading = false;
    });


  }

  async searchProduct()  {
    this.products = [];
    this.isLoading = true;
    //await this.getCategories();
    await this.getProducts().then((resp) => {
      this.isLoading = false;
    });


  }

  count(){
    return this.cart.countCart();
  }

  generateRange(): number[] {
    return Array(this.paginas).fill(0).map((x, i) => i + 1);
  }


  // Método para obtener el grupo actual de páginas con puntos suspensivos
  getCurrentPageGroupWithEllipsis(): (number | string)[] {
    const start = Math.floor((this.pagination - 1) / this.pagesPerGroup) * this.pagesPerGroup;
    const currentPageGroup = this.generateRange().slice(start, start + this.pagesPerGroup);

    const result: (number | string)[] = [];
    const totalPages = this.paginas;

    if (currentPageGroup[0] > 1) {
      result.push(1);
      if (currentPageGroup[0] > 2) {
        result.push('...'); // Agrega puntos suspensivos si hay páginas intermedias
      }
    }

    result.push(...currentPageGroup);

    if (currentPageGroup[currentPageGroup.length - 1] < totalPages) {
      if (currentPageGroup[currentPageGroup.length - 1] < totalPages - 1) {
        result.push('...'); // Agrega puntos suspensivos si hay páginas intermedias
      }
      result.push(totalPages);
    }

    return result;
  }

  handlePageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.pagination = page;
    }
    // Puedes agregar lógica adicional si es necesario
  }

  addCart(product: Product){
    let auxProduct: any = product;
    auxProduct['cantidad'] = 1;
    auxProduct['monto'] = 1 * auxProduct['precio'];
    this.cart.addCart(auxProduct);
  }

  toCart(){
    this.router.navigate(['cart']);
  }

  logout(){
    this.apiService.logout();
  }
}
