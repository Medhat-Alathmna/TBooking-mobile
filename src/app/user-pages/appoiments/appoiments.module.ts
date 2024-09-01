import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppoimentsListComponent } from './appoiments-list/appoiments-list.component';
import { AppoimentsFormComponent } from './appoiments-form/appoiments-form.component';
import { TranslateModule } from '@ngx-translate/core';

export const routes: Routes = [
  { path: '', component: AppoimentsListComponent },

];

@NgModule({
  declarations: [AppoimentsListComponent,AppoimentsFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ]
})
export class AppoimentsModule { }
