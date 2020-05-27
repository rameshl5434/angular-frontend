import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api/product";
  private categoryUrl = "http://localhost:8080/api/product-category";
  
  constructor(private httpClient:HttpClient) { }


  getProductListPaginate(thePage:number,thePageSize:number,theCategoryId : number): Observable<GetResponseProducts>{

    //@TODO: need to build URL based on category id ... will come back to this!
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                       +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl)
  }

  getProductList(theCategoryId : number): Observable<Product[]>{

    //@TODO: need to build URL based on category id ... will come back to this!
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategory():Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyWord : String):Observable<Product[]>{

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );

  }
  getProductDetails(productId:number):Observable<Product>{
    const searchUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);

  }
  
}


interface GetResponseProducts{

  _embedded:{
    products:Product[];
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number: number
  }
}
  interface GetResponseProductCategories{
    _embedded:{
      productCategory:ProductCategory[];
    }
}


