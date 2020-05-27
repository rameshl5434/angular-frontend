import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId:number = 1;
  previousCategoryId:number = 1;
  currentCategoryName:String = "Books";
  searchMode:boolean = false;


  //new Properties for pagination
  thePageNumber:number=1;
  thePageSize:number=10;
  theTotalElements:number=0;


  constructor(private productService:ProductService,private cartService :CartService,private route: ActivatedRoute) { }

  ngOnInit(){

    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
     
  }

  listProducts(){

    this.searchMode  =  this.route.snapshot.paramMap.has("keyword");

    if(this.searchMode){
          this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
    }
    
  }

  handleSearchProducts(){

   const theKeyword:String = this.route.snapshot.paramMap.get("keyword");
   this.productService.searchProducts(theKeyword).subscribe(
     data =>{
       this.products = data;
     }
   )

  }

  handleListProducts(){

    //Check If Id perameter is available
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
    //get the "id" param string. Convert string to a number using the "+" symbol
    this.currentCategoryId =+this.route.snapshot.paramMap.get('id');

     //get the "name" param string.
    this.currentCategoryName =this.route.snapshot.paramMap.get('name');
 
  }
  else {
    //Not category id available default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
  }

    
   //Check if we have a different category id than previous
   //Note : Angular will reuse a component if it is currently being viewed

   //If we have different category id than previous
   //Then set the page no back to 1
   if(this.previousCategoryId != this.currentCategoryId){
     this.thePageNumber=1;
   }

   this.previousCategoryId = this.currentCategoryId;

     console.log(`CurrentCategoryId=${this.currentCategoryId},thePageNumber=${this.thePageNumber}`);

    //Now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,this.thePageSize,
                                              this.currentCategoryId).subscribe(this.processResult());                                      

  }
  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  } 
  addToCart(tempProduct:Product){
    console.log(`The cart details:${tempProduct.name},${tempProduct.unitPrice}`)

    //TODO ... do the real work
    const theCartItem = new CartItem(tempProduct);

    this.cartService.addToCart(theCartItem);
    
    
  }   
}
