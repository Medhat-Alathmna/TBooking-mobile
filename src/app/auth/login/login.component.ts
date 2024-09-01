import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { AuthService } from '../auth.service';
import { IonMenu, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  authData = JSON.parse(localStorage.getItem('userAuth'))
  email: any

  password: any
  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    public router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    

  ) {
    super(loadingController,null, toastController, router)
    // if (isSet(this.authData)) {
    //   localStorage.clear()
    // }
  }


  ngOnInit() {
   
  }

  
  async login() {
    console.log(this.email, this.password);
    
    await this.showLoading('Logging')
    this.authService.login(this.email, this.password).subscribe((user: any) => {
      localStorage.setItem('userAuth', JSON.stringify(user))
      this.dismissLoading().then(r => {
        this.router.navigateByUrl('/');
        setTimeout(() => {
          location.reload()
        }, 1000);
      });
    }, error => {
      this.dismissLoading()
      this.presentToast(error.error.error.message)
      console.log(error);
    })
  }



}
