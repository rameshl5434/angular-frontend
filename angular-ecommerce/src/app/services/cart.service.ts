import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];

  totalPrice : Subject<number> = new Subject<number>();
  totalQuantity : Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    //Check if we already have item in the cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //find the item in the cart based on the item id

      // for (let tempCartItems of this.cartItems) {
      //   if (tempCartItems.id === theCartItem.id) {
      //     existingCartItem = tempCartItems;
      //     break;
      //   }
      // }

      //Refactoring the above code
      existingCartItem = this.cartItems.find(tempCartItems => tempCartItems.id === theCartItem.id);
    }

    //check if we found it
    alreadyExistInCart = (existingCartItem != undefined);


    if(alreadyExistInCart){
      //increment the quantity
      existingCartItem.quantity++;
    }
    else{
      //just add the item to the array
      this.cartItems.push(theCartItem);
    }

    //comput cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
   
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values all subscribes will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data just for debugging process
    this.logCartData(totalPriceValue,totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    

    console.log('contents of the cart');

    for(let tempCartItems of this.cartItems){
    const subTotalPrice = tempCartItems.quantity * tempCartItems.unitPrice;
    console.log(`name = ${tempCartItems.name},quantity = ${tempCartItems.quantity},unitPrice = ${tempCartItems.unitPrice},subTotal = ${subTotalPrice}`)
    }

    console.log(`totalPrice = ${totalPriceValue.toFixed(2)},totalQuantity = ${totalQuantityValue}`);

    console.log('-------------------');
  }

  decrementItem(tempCartDetails:CartItem){
    tempCartDetails.quantity--;
    if(tempCartDetails.quantity === 0){
      this.remove(tempCartDetails);
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(cartItem : CartItem) {
    
    //get Index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartDetails => tempCartDetails.id === cartItem.id);
  
    //If found remove the item in the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);

      this.computeCartTotals();
    }
  }


}
