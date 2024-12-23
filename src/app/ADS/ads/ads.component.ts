import { Component, OnInit } from '@angular/core';
import { AdsService } from '../ads.service';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { environment } from 'src/environments/environment';
import { LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PostComponent } from '../post/post.component';



@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent extends BaseComponent  implements OnInit {

  posts:any=[]
  pinPosts:any=[]
  imgUrl =environment.imgUrl
  
  constructor(private adsServices:AdsService,
    public loadingController: LoadingController,private modalController: ModalController,
    public translate?: TranslateService) {super(loadingController,translate) }

  ngOnInit() {
    this.getPosts()
  }

  async getPosts() {
    await  this.showLoading('Loading Posts')
    const subscription = this.adsServices.getPosts().subscribe((results: any) => {
      if (!isSet(results)) {
        return
      }
      this.posts=results?.publishedPosts?.filter(x=>x.pin==false)
      this.pinPosts=results?.publishedPosts?.filter(x=>x.pin==true)      
      this.dismissLoading()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
      this.dismissLoading()
    })
  }

  async postForm(post?) {
    const modal = await this.modalController.create({
      component: PostComponent,
      componentProps: { post },
    });
    console.log(post);

    return await modal.present();

  }
  cheackMediaType(type:string,media:any){
    if ( type?.includes(media) ) {
     return true
    }else return false
 }
}
