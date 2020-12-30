import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  invoiceForm: FormGroup;
  mode: any = "";
  invoiceID: any = "";
  constructor(private formBuilder: FormBuilder, private service: CommonService, private router: Router, private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit(): void {
    this.initForm();
    this.invoiceForm.reset();
    this.route.queryParams.subscribe(params => {
      let isView = params['mode'];
      let invoiceID = params['id'];
      if (invoiceID) {
        this.invoiceID = invoiceID;
        this.getInvoiceByID(invoiceID);
      }
      if (isView != undefined) {
        this.mode = (isView === 'view') ? 'view' : 'edit';
        if (isView === 'view') {
          this.invoiceForm.disable();
        }
      } else {
        this.mode = "";
      }
  });
  }

  get invoiceCtrl(){
    return this.invoiceForm.controls;
  }
  initForm(obj?: any){
    this.invoiceForm = this.formBuilder.group({
      customerName: [(obj) ? obj.customerName : '', [Validators.required]],
      contactNumber: [(obj) ? obj.contactNumber : '', [Validators.required]],
      email: [(obj) ? obj.email : '', [Validators.required, Validators.email]],
      address: [(obj) ? obj.address : '', [Validators.required]],
      CGST: [(obj) ? obj.CGST : 0, [Validators.required, Validators.min(1)]],
      SGST: [(obj) ? obj.SGST : 0, [Validators.required, Validators.min(1)]],
      totalWTax: [{value: (obj) ? obj.totalWTax : 0, disabled: true}, [Validators.required]],
      totalWOTax: [{value: (obj) ? obj.totalWOTax : 0, disabled: true}, [Validators.required]],
      discount: [(obj) ? obj.discount : 0, [Validators.required]],
      amountPaid: [(obj) ? obj.amountPaid : 0, [Validators.required]],
      amountDue: [{value: (obj) ? obj.amountDue : 0, disabled: true}, [Validators.required]],
      items: (obj) ? this.formItems(obj.items) : this.formBuilder.array([this.generateItem()])
    })
    // console.log(this.invoiceForm.controls.items, this.invoiceCtrl.items)
  }

  formItems(obj?: any) {
    if (obj) {
      let result: any = [];
      obj.forEach(item => {
        result.push(this.generateItem(item));
      });
      return this.formBuilder.array(result);
    }
  }
  generateItem(item?){
    return this.formBuilder.group({
      "description": [{value: (item) ? item.description : '', disabled: this.mode=='view'}, [Validators.required]],
      "quantity": [{value: (item) ? item.quantity : 0, disabled: this.mode=='view'}, [Validators.required, Validators.min(1)]],
      "price": [{value: (item) ? item.price : 0, disabled: this.mode=='view'}, [Validators.required, Validators.min(1)]],
      // "tax": [{value: (item) ? item.tax : 0, disabled: this.mode=='view'}, [Validators.required]],
      "total": [{value: (item) ? item.total : 0, disabled: true}, [Validators.required]]
    })
  }
  deleteItems(i: any) {
    const control = <FormArray>this.invoiceForm.controls['items'];
    if (control.length != 1) {
      control.removeAt(i);
    }
    // this.invoiceForm.markAsDirty();
  }
  addNewItem(){
    const itemsArray: any = <FormArray>this.invoiceForm.controls['items'];
    itemsArray.push(this.generateItem());
  }

  updateTotal() {
    let totalItems: any = this.invoiceForm.value.items as FormArray;
    let totalItemsPrice = totalItems.reduce((val, {price, quantity}) => val + (price * quantity), 0);
    let CGSTValue = this.invoiceForm.value.CGST;
    let SGSTValue = this.invoiceForm.value.SGST;
    let totalTax = (CGSTValue + SGSTValue) / 100;
    let discount = (this.invoiceForm.value.discount / 100);
    let calcWTax =  ((totalItemsPrice * totalTax) + totalItemsPrice);
    let totalWTax =  calcWTax * ( 1- discount);
    this.invoiceForm.patchValue({
      'totalWOTax': totalItemsPrice,
      'totalWTax': totalWTax,
    })
  }
  updateDueAmount(){
    let paidAmount: any = this.invoiceForm.value.amountPaid;
    let total: any = this.invoiceForm["controls"]["totalWTax"].value;
    this.invoiceForm.patchValue({
      'amountDue': (paidAmount > 0) ? (total - paidAmount) : total
    })
  }
  updateItemTotal(index: any) {
    let selectedItem: any = this.invoiceForm['value'].items[index];
    this.invoiceForm['controls'].items['controls'][index].patchValue({
      total: (selectedItem.price * selectedItem.quantity)
    });
    this.updateTotal();
  }
  submit() {
    if (this.invoiceForm.valid) {
      let invoiceData: any = {};
      for(var x in this.invoiceForm["controls"]){
        invoiceData[x] = this.invoiceForm["controls"][x].value;
    }
      console.log(invoiceData);
      if (this.mode == "") {
        this.service.createInvoice(invoiceData).subscribe((res: any) => {
          if (res.isSuccess) {
            this.service.showAlert('success', 'Invoice saved successfully!');
            this.service.updateUserData(res);
            this.router.navigate(['/home/invoice']);
          } else {
            this.service.showAlert('error', 'Error while saving data!')
          }
        })
      } else if (this.mode == 'edit') {
        this.service.updateInvoiceByID(this.invoiceID, invoiceData).subscribe((res: any) => {
          if (res.isSuccess) {
            this.service.showAlert('success', 'Invoice saved successfully!');
            this.service.updateUserData(res);
            this.router.navigate(['/home/invoice']);
          } else {
            this.service.showAlert('error', 'Error while saving data!')
          }
        })
      }
    } else {
      this.service.showAlert('error', 'Please fill all required fields!');
    }
  }

  getInvoiceByID(id) {
    this.service.getInvoiceByID(id).subscribe((res: any) => {
      if (res.isSuccess) {
        this.initForm(res.data);
      }
    }) 
  }

}
