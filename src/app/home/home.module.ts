import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile/profile.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';


@NgModule({
  declarations: [HomeComponent, ProfileComponent, InvoiceComponent, ViewInvoiceComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
