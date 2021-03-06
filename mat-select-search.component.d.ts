/**
 * Copyright (c) 2018 Bithost GmbH All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, OnInit, QueryList } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material';
import { MatSelectSearchClearDirective } from './mat-select-search-clear.directive';
/**
 * Component providing an input field for searching MatSelect options.
 *
 * Example usage:
 *
 * interface Bank {
 *  id: string;
 *  name: string;
 * }
 *
 * @Component({
 *   selector: 'my-app-data-selection',
 *   template: `
 *     <mat-form-field>
 *       <mat-select [formControl]="bankCtrl" placeholder="Bank">
 *         <ngx-mat-select-search [formControl]="bankFilterCtrl"></ngx-mat-select-search>
 *         <mat-option *ngFor="let bank of filteredBanks | async" [value]="bank.id">
 *           {{bank.name}}
 *         </mat-option>
 *       </mat-select>
 *     </mat-form-field>
 *   `
 * })
 * export class DataSelectionComponent implements OnInit, OnDestroy {
 *
 *   // control for the selected bank
 *   public bankCtrl: FormControl = new FormControl();
 *   // control for the MatSelect filter keyword
 *   public bankFilterCtrl: FormControl = new FormControl();
 *
 *   // list of banks
 *   private banks: Bank[] = [{name: 'Bank A', id: 'A'}, {name: 'Bank B', id: 'B'}, {name: 'Bank C', id: 'C'}];
 *   // list of banks filtered by search keyword
 *   public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
 *
 *   // Subject that emits when the component has been destroyed.
 *   private _onDestroy = new Subject<void>();
 *
 *
 *   ngOnInit() {
 *     // load the initial bank list
 *     this.filteredBanks.next(this.banks.slice());
 *     // listen for search field value changes
 *     this.bankFilterCtrl.valueChanges
 *       .pipe(takeUntil(this._onDestroy))
 *       .subscribe(() => {
 *         this.filterBanks();
 *       });
 *   }
 *
 *   ngOnDestroy() {
 *     this._onDestroy.next();
 *     this._onDestroy.complete();
 *   }
 *
 *   private filterBanks() {
 *     if (!this.banks) {
 *       return;
 *     }
 *
 *     // get the search keyword
 *     let search = this.bankFilterCtrl.value;
 *     if (!search) {
 *       this.filteredBanks.next(this.banks.slice());
 *       return;
 *     } else {
 *       search = search.toLowerCase();
 *     }
 *
 *     // filter the banks
 *     this.filteredBanks.next(
 *       this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
 *     );
 *   }
 * }
 */
export declare class MatSelectSearchComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {
    matSelect: MatSelect;
    private changeDetectorRef;
    /** Label of the search placeholder */
    placeholderLabel: string;
    /** Label to be shown when no entries are found. Set to null if no message should be shown. */
    noEntriesFoundLabel: string;
    /**
      * Whether or not the search field should be cleared after the dropdown menu is closed.
      * Useful for server-side filtering. See [#3](https://github.com/bithost-gmbh/ngx-mat-select-search/issues/3)
      */
    clearSearchInput: boolean;
    /** Reference to the search input field */
    searchSelectInput: ElementRef;
    /** Reference to the search input field */
    innerSelectSearch: ElementRef;
    /** Reference to custom search input clear icon */
    clearIcon: MatSelectSearchClearDirective;
    /** Current search value */
    readonly value: string;
    private _value;
    onChange: Function;
    onTouched: Function;
    /** Reference to the MatSelect options */
    _options: QueryList<MatOption>;
    /** Previously selected values when using <mat-select [multiple]="true">*/
    private previousSelectedValues;
    /** Whether the backdrop class has been set */
    private overlayClassSet;
    /** Event that emits when the current value changes */
    private change;
    /** Subject that emits when the component has been destroyed. */
    private _onDestroy;
    constructor(matSelect: MatSelect, changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    /**
     * Handles the key down event with MatSelect.
     * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
     * @param event
     */
    _handleKeydown(event: KeyboardEvent): void;
    writeValue(value: string): void;
    onInputChange(value: any): void;
    onBlur(value: string): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    /**
     * Focuses the search input field
     */
    _focus(): void;
    /**
     * Resets the current search value
     * @param focus whether to focus after resetting
     */
    _reset(focus?: boolean, clearInput?: boolean): void;
    /**
     * Sets the overlay class  to correct offsetY
     * so that the selected option is at the position of the select box when opening
     */
    private setOverlayClass();
    /**
     * Initializes handling <mat-select [multiple]="true">
     * Note: to improve this code, mat-select should be extended to allow disabling resetting the selection while filtering.
     */
    private initMultipleHandling();
    /**
     *  Set the width of the innerSelectSearch to fit even custom scrollbars
     *  And support all Operation Systems
     */
    private getWidth();
    /**
     *  Initialize this.previousSelectedValues once the first filtering occurs.
     */
    initMultiSelectedValues(): void;
}
