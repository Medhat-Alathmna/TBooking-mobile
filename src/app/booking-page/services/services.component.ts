import { Component, OnInit } from '@angular/core';
import { MainPageService } from '../booking-page.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent extends BaseComponent  implements OnInit {
  services=[]
 total
  constructor(private mainPageService:MainPageService,
     private modalController: ModalController,public loadingController: LoadingController,public translates: TranslateService,
    public toastController: ToastController) { super(loadingController,translates, toastController,)}

  ngOnInit() {this.getServices()}
  getServices(){
    // this.showLoading('Loading')
    const subscription = this.mainPageService.servicesMobile().subscribe((data) => {
      if (!isSet(data)) {
        return
      }
    this.services=data
    this.total=this.services.length
    // this.dismissLoading()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  dismissModal(){
    this.modalController.dismiss();

  }
  addBookingForm(ser){
    this.mainPageService.addServicesToForm.next(ser)
    this.dismissModal()    
  }
  search(data){
    const query = data.toLowerCase();
    this.services = this.services.filter((d) => d.ar.toLowerCase().indexOf(query) > -1);    
  }
}
