import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from 'src/app/core/base/base.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent extends BaseComponent  implements OnInit {

  imgUrl =environment.imgUrl


  @Input() post:any

  constructor( private modalController: ModalController ) {super() }

  ngOnInit() {}


  dismissModal() {
    this.modalController.dismiss();
  }

  cheackMediaType(type:string,media:any){
    if ( type?.includes(media) ) {
     return true
    }else return false
 }
}
