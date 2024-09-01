import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicesComponent } from './services/services.component';
import { TranslateModule } from '@ngx-translate/core';


export const routes: Routes = [
  { path: '', component: MainPageComponent },

];


@NgModule({
  declarations: [MainPageComponent,ServicesComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    RouterModule.forChild(routes),  ]
})
export class MainPageModule { }
