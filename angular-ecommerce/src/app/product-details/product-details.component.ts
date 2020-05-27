import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../common/product';
import { CartService } from '../services/cart.service';
import { CartItem } from '../common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {


  product: Product;

  constructor(private productService:ProductService,private cartService:CartService,private route:ActivatedRoute) { }

  ngOnInit(){
    this.route.paramMap.subscribe(() =>{
    this.getProductDetails();
  })
  }

  getProductDetails(){
  const productId:number =+this.route.snapshot.paramMap.get("id");
  
  this.productService.getProductDetails(productId).subscribe(
    data =>{
      this.product = data;
    }
  );
  }

  addToCart(){
    console.log(`Adding to cart = ${this.product.name},${this.product.unitPrice}`);

    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

}
