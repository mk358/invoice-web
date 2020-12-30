import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css']
})
export class ViewInvoiceComponent implements OnInit {

  invoicesList: any = [];
  constructor(private service: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.getInvoices();
  }
  getInvoices(){
    this.service.getInvoiceList().subscribe((res: any) => {
      if (res.isSuccess) {
        this.invoicesList = res.data;
      } else {
        this.service.showAlert('error', 'Error while fetching invoice data!');
      }
    }, (error: any) => {
      this.service.showAlert('error', error.message || 'Error occured!')
    })
  }

}
