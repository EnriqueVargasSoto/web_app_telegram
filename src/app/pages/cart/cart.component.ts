import { Component } from '@angular/core';
import { ApiService } from 'src/app/utils/api/api.service';
import { CartService } from 'src/app/utils/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  carrito: any[] = [];
  total: number = 0.00;

  constructor(private apiService: ApiService, private cart: CartService){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.setCart();

  }

  setCart(){
    this.carrito = this.cart.cart;
    this.total = 0.00;
    for (let i = 0; i < this.carrito.length; i++) {
      this.total += this.carrito[i]['monto'];

    }
  }

  removeCart(indice: any){
    if (indice >= 0 && indice < this.carrito.length) {
      this.total -= this.carrito[indice]['monto'];
      this.cart.deleteCart(indice);
      //this.carrito.splice(indice, 1); // Elimina el producto en el índice especificado
      this.setCart();
    }
  }

  guardarPedido(){
    if (this.carrito.length > 0) {

    }
  }
}
