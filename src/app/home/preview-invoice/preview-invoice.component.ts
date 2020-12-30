import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common.service';
import { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas'; 

@Component({
  selector: 'app-preview-invoice',
  templateUrl: './preview-invoice.component.html',
  styleUrls: ['./preview-invoice.component.css']
})
export class PreviewInvoiceComponent implements OnInit {

  userData: any;
  invoiceData: any;
  invoiceID: any;
  constructor(private service: CommonService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.invoiceID = (params) ? params['id'] : '';
      if (this.invoiceID != '') {
        this.getInvoiceByID(this.invoiceID);
      }
    })
   }

  ngOnInit(): void {
    this.userData = this.service.userData;
  }
  getInvoiceByID(id) {
    this.service.getInvoiceByID(id).subscribe((res: any) => {
      if (res.isSuccess) {
        this.invoiceData =res.data;
      } else {
        this.service.showAlert('error', res.message || 'Error occured!')
      }
    }, (error: any) => {
      this.service.showAlert('error', error.message || 'Error occured!')
    })
  }
  print(): void {
    window.print();
    /*
    let printContents, popupWin;
    printContents = document.getElementById('invoice').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();//*/
  }
  downloadAsPDF() {
    var data = document.getElementById('invoice');  
    html2canvas(data).then(canvas => {  
        // Few necessary setting options  
        var imgWidth = 208;   
        var pageHeight = 295;    
        var imgHeight = canvas.height * imgWidth / canvas.width;  
        var heightLeft = imgHeight;  

        const contentDataURL = canvas.toDataURL('image/png')  
        let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
        var position = 0;  
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
        pdf.save('invoice-'+this.invoiceID+'.pdf'); // Generated PDF   
    });   
  }
}
