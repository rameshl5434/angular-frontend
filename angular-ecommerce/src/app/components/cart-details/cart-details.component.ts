import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartList : CartItem[] = [];

  totalPrice : number = 0.00;

  totalQuantity : number = 0;

  constructor(private cartService : CartService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  
  
  listCartDetails() {
  
    //get a handle to the cart items
    this.cartList = this.cartService.cartItems;

    //subscribe to the cart total price
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice=data;
      }
    );

    //subscribe the cart to total quantity
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    );

  }
  incrementItem(tempCartDetails:CartItem){
    this.cartService.addToCart(tempCartDetails);
  }

  decrementItem(tempCartDetails:CartItem){
    this.cartService.decrementItem(tempCartDetails);
  }
  
  remove(tempCartDetails:CartItem){
    this.cartService.remove(tempCartDetails);
  }
}
