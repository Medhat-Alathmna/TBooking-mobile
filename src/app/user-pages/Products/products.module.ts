import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductsListComponent } from './products-list/products-list.component';

export const routes: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'form', component: ProductFormComponent },

];

@NgModule({
  declarations: [ProductsListComponent,ProductFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class ProductsModule { }
