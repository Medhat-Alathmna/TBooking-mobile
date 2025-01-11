import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { GuestGuard } from './auth/guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    // canActivate:[AuthGuard],
    children: [
      { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'booking', loadChildren: () => import('./booking-page/booking-page.module').then(m => m.BookingPageModule) },
      { path: 'ads', loadChildren: () => import('./ADS/ads.module').then(m => m.AdsModule) },
      { path: 'appoiments',canActivate:[AuthGuard], loadChildren: () => import('./user-pages/appoiments/appoiments.module').then(m => m.AppoimentsModule) },
      { path: 'products',canActivate:[AuthGuard], loadChildren: () => import('./user-pages/Products/products.module').then(m => m.ProductsModule) },
    ]
  },
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
