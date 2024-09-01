import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { isSet } from 'src/app/core/base/base.component';
import { Products } from 'src/app/modals/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public product: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public productEmitter: Observable<any> = this.product.asObservable();
  queryFilters: any[] = [];

  userAuth = JSON.parse(localStorage.getItem('userAuth'))?.user
  constructor(private api: ApiService) { }

  getBrands(): Observable<any> {
    return this.api.get<any>(`brands?sort[0]=createdAt:desc&pagination[pageSize]=1000&filters[hide][$eq]=false`);
  }
  createProduct(product: Products): Observable<any> {
    let body = {
      data: {
        name: product?.name,
        barcode: product?.barcode,
        notes: product?.notes,
        price: product?.price,
        stocks: product?.stocks,
        medicineType: product?.medicineType,
        dateExpire: product?.dateExpire,
        buyPrice: product?.buyPrice,
        supplierWeb:product?.supplierWeb,
        brand: product?.brand
      }
    }
    return this.api.post<any>(`products`, body);
  }
  updateProduct(product: Products, id): Observable<any> {
    let body = {
      data: {
        name: product?.name,
        barcode: product?.barcode,
        notes: product?.notes,
        price: product?.price,
        stocks: product?.stocks,
        medicineType: product?.medicineType,
        dateExpire: product?.dateExpire,
        buyPrice: product?.buyPrice,
        supplierWeb:product?.supplierWeb,
        brand: product?.brand
      }
    }
    console.log(body);
    
    return this.api.put<any>(`products/${id}`, body);
  }

  getProductByBarcode(barcode){
    return this.api.get<any>(`products?populate=*&filters[barcode][$eq]=${barcode}`,);

  }
  getlist(moduleName: string, pageNum?: number, rows?: number, query?: any, pop?): Observable<any[]> {
    if (!isSet(pageNum)) {
      pageNum = 1
    }
    if (!isSet(pop)) {
      pop = '*'
    }
    let filter = ''
    if (typeof query == 'object' || this.queryFilters?.length) {
      filter = this.handleQuery(query)
    } else filter = isSet(query) ? query : ''
    return this.api.get<any[]>(`${moduleName}?populate=${pop}&sort[0]=createdAt:desc&pagination[pageSize]=${rows}&pagination[page]=${pageNum}&filters[hide][$eq]=false${filter}`);

  }

  handleQuery(query: any) {
    let sum_querirs
    let querirs_
    if (isSet(query)) {
      const clone = { ...query }
      if (this.queryFilters.some(elem => elem.name === query.name)) {
        this.queryFilters.map(item => {
          if (item.name == query.name) {
            item.value = query.value
          }
        })
      } else this.queryFilters.push(clone)
    }
    if (isSet(this.queryFilters)) {
      const querirs = [...this.queryFilters];
      const length: number = querirs.length - 1;
      for (let index = 0; index < querirs.length; index++) {
      
        if (isSet(querirs[index].type)) {
          const parent = isSet(querirs[index].parent) ? querirs[index].parent : ''
          const customer = isSet(querirs[index].customer) ? querirs[index].customer : ''
          querirs[index] = `filters${parent}${customer}[${querirs[index].name}][${querirs[index].type}]=${querirs[index].value}`;
        }
      }
      let sumquerirs = '';
      for (let index = 0; index < querirs.length; index++) {
        sum_querirs = sumquerirs + querirs[index];
      }
      return '&' + sum_querirs

    } else return ''
  }
}
