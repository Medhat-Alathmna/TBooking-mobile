import { Component, Input, OnInit } from '@angular/core';
import { Products } from 'src/app/modals/products';
import { ProductsService } from '../products.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  providers: [BarcodeScanner]
})
export class ProductFormComponent extends BaseComponent implements OnInit {

  @Input() product: Products
  updateMode: boolean = false
  id
  brands: any[] = []
  medicineTypes: any[] = []
  constructor(private productsService: ProductsService,   
     private barcodeScanner: BarcodeScanner,public translates: TranslateService,
   public loadingController: LoadingController, private modalController: ModalController,
    public toastController: ToastController,) { super(loadingController,translates, toastController) }

  ngOnInit() {


    if (!this.product) {
      this.initProduct()
    } else {
      this.id = this.product.id
      this.product =Products.cloneObject(this.product.attributes) 
      this.updateMode = true
    }
    this.getBrands()

  }
  initProduct() {
    this.product = new Products()
    this.product.name = null
    this.product.price = 0
    this.product.stocks = 0
    this.product.buyPrice = 0
    this.product.barcode = null
    this.product.supplierWeb = null
    this.updateMode = false
  }

  getBrands() {
    const subscription = this.productsService.getBrands().subscribe((results) => {
      if (!isSet(results)) {
        return
      }
      this.brands = []
      results.data.map(item => {
        this.brands.push({
          id: item?.id, name: item?.attributes?.name
        })
      })
      if (this.product.brand) {
        this.product.brand = this.product?.brand?.data?.id      }        
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  async createProduct() {
    await this.showLoading('Creating Product')

    const subscription = this.productsService.createProduct(this.product).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.dismissLoading()
      this.presentToast('The Product Created')
      this.dismissModal()
      subscription.unsubscribe()
    }, error => {
      this.dismissLoading()

      this.presentToast(error.error.error.message)
      this.loading = false
      subscription.unsubscribe()
    })
  }
  async updateProduct() {
    await this.showLoading('Updating Product')
    const subscription = this.productsService.updateProduct(this.product, this.id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.loading = false
      this.dismissLoading()
      this.presentToast('The Product Updated')
      this.dismissModal()
      subscription.unsubscribe()
    }, error => {
      console.log(error.error.error.details.message);
      
     
      this.dismissLoading()
      this.loading = false
      subscription.unsubscribe()
      if (error?.error?.error?.details?.errors[0]?.path[0] =='barcode') {
        this.presentToast('This barcode already existed')
      }
    })
  }
  dismissModal() {
    this.product=new Products()
    this.modalController.dismiss();
  }
  async scanItem() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.getProductByBarcode(barcodeData.text)
    }).catch(err => {
      console.log('Error', err);
    });
  }

  async getProductByBarcode(barcode): Promise<void> {
    await this.showLoading('Checking Product')
    const subscription = this.productsService.getProductByBarcode(barcode).subscribe((results: any) => {
      console.log(results);

      if (!isSet(results)) {
        return
      }

      if (results?.data?.length) {
        this.presentToast("This product alredy existed")
      }else{
        this.product.barcode=barcode

      }
      this.dismissLoading()
      subscription.unsubscribe()
    }, error => {
      this.dismissLoading()
      console.log(error);
      subscription.unsubscribe()
    })
  }
}
