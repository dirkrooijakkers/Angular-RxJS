import { catchError, combineLatest, EMPTY, filter, map } from 'rxjs';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage = '';

  product$ = this.productService.selectedProduct$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    }
    )
  )

  pageTitle$ = this.product$
  .pipe(
    map(p => p ? `Product detail for: ${p.productName}` : null)
  )

  productSuppliers$ = this.productService.selectedProductSuppliers$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    }
    )
  )

  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ]).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, productSuppliers, pageTitle]) =>
      //({}) = an object literal, so we basically map these 3 arrays into a object literal
      ({ product, productSuppliers, pageTitle }))
  )

  constructor(private productService: ProductService) { }

}
