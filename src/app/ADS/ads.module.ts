import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsComponent } from './ads/ads.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SafePipe } from './safe.pipe';
import { PostComponent } from './post/post.component';



export const routes: Routes = [
  { path: '', component: AdsComponent },

];


@NgModule({
  declarations: [AdsComponent,SafePipe,PostComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes),  ]
})
export class AdsModule { }
