import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/Product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: any[] = [];

  constructor() { }

  addCart(product: Product){
    this.cart.push(product);
  }

  deleteCart(indice: any){
    this.cart.splice(indice, 1);
  }

  countCart(){
    return this.cart.length;
  }
}
