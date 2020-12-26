import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';

import { HomeComponent } from './home.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canLoad: [AuthGuard] },
  { path: 'create', component: InvoiceComponent, canLoad: [AuthGuard] },
  { path: 'invoice', component: ViewInvoiceComponent, canLoad: [AuthGuard] },
  { path: 'view', component: PreviewInvoiceComponent, canLoad: [AuthGuard] },
  { path: '', redirectTo: 'invoice', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
