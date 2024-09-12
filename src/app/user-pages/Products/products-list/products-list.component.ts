import { Component, OnInit } from '@angular/core';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { Products } from 'src/app/modals/products';
import { ProductsService } from '../products.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  providers: [BarcodeScanner]

})
export class ProductsListComponent extends BaseComponent implements OnInit {
  products: any = []
  rowNum: any = 10
  total
  formMode=false
  constructor( public loadingController: LoadingController,
    private modalController: ModalController,
     private barcodeScanner: BarcodeScanner,public translates: TranslateService,
     public nav: NavController, private productService: ProductsService) { super(loadingController,translates) }

  async ngOnInit() {
    this.getProducts()    

  }

  async getProducts(pageNum?: number, query?: any) {
    await this.showLoading('Fetching Products')
    const subscription = this.productService.getlist('products', pageNum, 99999, query).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      console.log(results);

      const clone = results.data
      this.total = results.meta.pagination.total
      if (!isSet(this.products)) {
        this.products = Array(this.total).fill(0)
      }
      if (clone.length < this.rowNum) {
        for (let index = clone.length; index < this.rowNum; index++) {
          clone[index] = null
        }
      }
      //
      if (!isSet(pageNum)) {
        clone.map((item, index) => {
          this.products[index] = item
        })

      } else {
        const currentPage = pageNum * this.rowNum
        let cloneObjIndex = 0
        for (let index = currentPage - this.rowNum; index < currentPage; index++) {
          this.products[index] = clone[cloneObjIndex++]
        }
      }
      //
      if (!isSet(this.products?.next)) {
        this.products = this.products.filter(item => {
          return isSet(item)
        })
      }
      this.dismissLoading()
      subscription.unsubscribe()
    }, error => {
      this.dismissLoading()
      console.log(error);
      subscription.unsubscribe()
    })
  }

  async productForm(product?) {
    const modal = await this.modalController.create({
      component: ProductFormComponent,
      componentProps: { product },
    });
    return await modal.present();
  }
  // addProductForm(product){
  //   const prod=Products.cloneObject(product)
  //   this.invoiceService.addProductsToInvoice.next(prod)
  //   this.dismissModal()    
  // }
  async scanItem() {
    this.barcodeScanner.scan().then(async barcodeData => {
      await this.getProductByBarcode(barcodeData.text)

    }).catch(err => {
      console.log('Error', err);
    });
  }

  async getProductByBarcode(barcode): Promise<void> {
    await this.showLoading('Fetching Product')
    const subscription = this.productService.getProductByBarcode(barcode).subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      } 
      if (results?.data?.length ==0) {
        this.presentToast("This product doesn't Exist")
      }else{
        this.products = results.data
        this.total = results.meta.pagination.total
      }
     

      this.dismissLoading()
      subscription.unsubscribe()
    }, error => {
      this.dismissLoading()
      console.log(error);
      subscription.unsubscribe()
    })
  }
  handleRefresh(event) {
    setTimeout(() => {
      this.getProducts()
      event.target.complete();
    }, 2000);
  }
  dismissModal(){
    this.modalController.dismiss();

  }
  search(data){
    const query = data.toLowerCase();
    this.products = this.products.filter((d) => d.attributes.name.toLowerCase().indexOf(query) > -1);    
  }
}
