import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductApiService } from '../services/product-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {

  colorList = ["Black", "White"];
  productForm !: FormGroup;
  actionBtn : string = "Save";

  constructor(
    private formBuilder : FormBuilder,
    private productApi : ProductApiService,
    private dialogRef : MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      color: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
    });

    // console.log(this.editData);
    if (this.editData) {
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['deliveryDate'].setValue(this.editData.deliveryDate);
      this.productForm.controls['color'].setValue(this.editData.color);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['description'].setValue(this.editData.description);
    }
  }

  addProduct() {
    if (this.productForm.valid) {
      if (!this.editData) {
        this.productApi.postProduct(this.productForm.value)
        .subscribe({
          next:(res) => {
            console.log('Product Added: '+this.productForm.value);
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:() => {
            console.log('An error occured while adding the product.');
          }
        });
      } else {
        this.updateProduct();
      }
    }
  }

  updateProduct() {
    this.productApi.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:(res) => {
        console.log('Product Updated: '+this.productForm.value);
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:() => {
        console.log('An error occured while updating the product.');
      }
    })
  }

}
