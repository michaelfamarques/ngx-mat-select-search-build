import { Directive, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, ViewChild, ContentChild, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect, MatButtonModule, MatInputModule, MatIconModule } from '@angular/material';
import { Subject } from 'rxjs';
import { delay, take, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Directive for providing a custom clear-icon.
 * e.g.
 * <ngx-mat-select-search [formControl]="bankFilterCtrl">
 *   <mat-icon ngxMatSelectSearchClear>delete</mat-icon>
 * </ngx-mat-select-search>
 */
class MatSelectSearchClearDirective {
}
MatSelectSearchClearDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngxMatSelectSearchClear]'
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Copyright (c) 2018 Bithost GmbH All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
 * \@Component({
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
class MatSelectSearchComponent {
    /**
     * @param {?} matSelect
     * @param {?} changeDetectorRef
     */
    constructor(matSelect, changeDetectorRef) {
        this.matSelect = matSelect;
        this.changeDetectorRef = changeDetectorRef;
        /**
         * Label of the search placeholder
         */
        this.placeholderLabel = 'Pesquisar';
        /**
         * Label to be shown when no entries are found. Set to null if no message should be shown.
         */
        this.noEntriesFoundLabel = 'Nenhum item encontrado';
        /**
         * Whether or not the search field should be cleared after the dropdown menu is closed.
         * Useful for server-side filtering. See [#3](https://github.com/bithost-gmbh/ngx-mat-select-search/issues/3)
         */
        this.clearSearchInput = false;
        this.onChange = (_) => { };
        this.onTouched = (_) => { };
        /**
         * Whether the backdrop class has been set
         */
        this.overlayClassSet = false;
        /**
         * Event that emits when the current value changes
         */
        this.change = new EventEmitter();
        /**
         * Subject that emits when the component has been destroyed.
         */
        this._onDestroy = new Subject();
    }
    /**
     * Current search value
     * @return {?}
     */
    get value() {
        return this._value;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // set custom panel class
        const /** @type {?} */ panelClass = 'mat-select-search-panel';
        if (this.matSelect.panelClass) {
            if (Array.isArray(this.matSelect.panelClass)) {
                this.matSelect.panelClass.push(panelClass);
            }
            else if (typeof this.matSelect.panelClass === 'string') {
                this.matSelect.panelClass = [this.matSelect.panelClass, panelClass];
            }
            else if (typeof this.matSelect.panelClass === 'object') {
                this.matSelect.panelClass[panelClass] = true;
            }
        }
        else {
            this.matSelect.panelClass = panelClass;
        }
        // when the select dropdown panel is opened or closed
        this.matSelect.openedChange
            .pipe(delay(1), takeUntil(this._onDestroy))
            .subscribe((opened) => {
            if (opened) {
                // focus the search field when opening
                this.getWidth();
                this._focus();
            }
            else {
                // clear it when closing
                this._reset(false, this.clearSearchInput);
            }
        });
        // set the first item active after the options changed
        this.matSelect.openedChange
            .pipe(take(1))
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            this._options = this.matSelect.options;
            this._options.changes
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                const /** @type {?} */ keyManager = this.matSelect._keyManager;
                if (keyManager && this.matSelect.panelOpen) {
                    // avoid "expression has been changed" error
                    setTimeout(() => {
                        keyManager.setFirstItemActive();
                        this.getWidth();
                    }, 1);
                }
            });
        });
        // detect changes when the input changes
        this.change
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
        this.initMultipleHandling();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.setOverlayClass();
        // update view when available options change
        this.matSelect.options.changes
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            this.changeDetectorRef.markForCheck();
        });
    }
    /**
     * Handles the key down event with MatSelect.
     * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
        if (event.keyCode === 32) {
            // do not propagate spaces to MatSelect, as this would select the currently active option
            event.stopPropagation();
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        const /** @type {?} */ valueChanged = value !== this._value;
        if (valueChanged) {
            this._value = value;
            this.change.emit(value);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    onInputChange(value) {
        const /** @type {?} */ valueChanged = value !== this._value;
        if (valueChanged) {
            this.initMultiSelectedValues();
            this._value = value;
            this.onChange(value);
            this.change.emit(value);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    onBlur(value) {
        this.writeValue(value);
        this.onTouched();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Focuses the search input field
     * @return {?}
     */
    _focus() {
        if (!this.searchSelectInput) {
            return;
        }
        // save and restore scrollTop of panel, since it will be reset by focus()
        // note: this is hacky
        const /** @type {?} */ panel = this.matSelect.panel.nativeElement;
        const /** @type {?} */ scrollTop = panel.scrollTop;
        // focus
        this.searchSelectInput.nativeElement.focus();
        panel.scrollTop = scrollTop;
    }
    /**
     * Resets the current search value
     * @param {?=} focus whether to focus after resetting
     * @param {?=} clearInput
     * @return {?}
     */
    _reset(focus, clearInput) {
        this.searchSelectInput.nativeElement.value = '';
        if (clearInput) {
            this.onInputChange('');
        }
        if (focus) {
            this._focus();
        }
    }
    /**
     * Sets the overlay class  to correct offsetY
     * so that the selected option is at the position of the select box when opening
     * @return {?}
     */
    setOverlayClass() {
        if (this.overlayClassSet) {
            return;
        }
        const /** @type {?} */ overlayClass = 'cdk-overlay-pane-select-search';
        this.matSelect.overlayDir.attach
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            // note: this is hacky, but currently there is no better way to do this
            let /** @type {?} */ element = this.searchSelectInput.nativeElement;
            let /** @type {?} */ overlayElement;
            while (element = element.parentElement) {
                if (element.classList.contains('cdk-overlay-pane')) {
                    overlayElement = element;
                    break;
                }
            }
            if (overlayElement) {
                overlayElement.classList.add(overlayClass);
            }
        });
        this.overlayClassSet = true;
    }
    /**
     * Initializes handling <mat-select [multiple]="true">
     * Note: to improve this code, mat-select should be extended to allow disabling resetting the selection while filtering.
     * @return {?}
     */
    initMultipleHandling() {
        // if <mat-select [multiple]="true">
        // store previously selected values and restore them when they are deselected
        // because the option is not available while we are currently filtering
        this.matSelect.valueChange
            .pipe(takeUntil(this._onDestroy))
            .subscribe((values) => {
            if (this.matSelect.multiple) {
                let /** @type {?} */ restoreSelectedValues = false;
                if (this._value && this._value.length
                    && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
                    if (!values || !Array.isArray(values)) {
                        values = [];
                    }
                    const /** @type {?} */ optionValues = this.matSelect.options.map(option => option.value);
                    this.previousSelectedValues.forEach(previousValue => {
                        if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
                            // if a value that was selected before is deselected and not found in the options, it was deselected
                            // due to the filtering, so we restore it.
                            values.push(previousValue);
                            restoreSelectedValues = true;
                        }
                    });
                }
                if (restoreSelectedValues) {
                    this.matSelect._onChange(values);
                }
                this.previousSelectedValues = values;
            }
        });
    }
    /**
     *  Set the width of the innerSelectSearch to fit even custom scrollbars
     *  And support all Operation Systems
     * @return {?}
     */
    getWidth() {
        if (!this.innerSelectSearch || !this.innerSelectSearch.nativeElement) {
            return;
        }
        let /** @type {?} */ element = this.innerSelectSearch.nativeElement;
        let /** @type {?} */ panelElement;
        while (element = element.parentElement) {
            if (element.classList.contains('mat-select-panel')) {
                panelElement = element;
                break;
            }
        }
        if (panelElement) {
            this.innerSelectSearch.nativeElement.style.width = panelElement.clientWidth + 'px';
        }
    }
    /**
     *  Initialize this.previousSelectedValues once the first filtering occurs.
     * @return {?}
     */
    initMultiSelectedValues() {
        if (this.matSelect.multiple && !this._value) {
            this.previousSelectedValues = this.matSelect.options
                .filter(option => option.selected)
                .map(option => option.value);
        }
    }
}
MatSelectSearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-mat-select-search',
                template: `<!-- Placeholder to adjust vertical offset of the mat-option elements -->
<input matInput class="mat-select-search-input mat-select-search-hidden" />

<!-- Note: the  mat-datepicker-content mat-tab-header are needed to inherit the material theme colors, see PR #22 -->
<div #innerSelectSearch class="mat-select-search-inner mat-typography mat-datepicker-content mat-tab-header" [ngClass]="{'mat-select-search-inner-multiple': matSelect.multiple}">
    <input matInput class="mat-select-search-input" autocomplete="off" #searchSelectInput (keydown)="_handleKeydown($event)"
        (input)="onInputChange($event.target.value)" (blur)="onBlur($event.target.value)" [placeholder]="placeholderLabel" />
    <button mat-button *ngIf="value" mat-icon-button aria-label="Clear" (click)="_reset(true, true)" class="mat-select-search-clear">
        <ng-content *ngIf="clearIcon; else defaultIcon" select="[ngxMatSelectSearchClear]"></ng-content>
        <ng-template #defaultIcon>
            <mat-icon>close</mat-icon>
        </ng-template>
    </button>
</div>

<div *ngIf="noEntriesFoundLabel && value && _options?.length === 0" class="mat-select-search-no-entries-found">
    {{noEntriesFoundLabel}}
</div>
<!--
Copyright (c) 2018 Bithost GmbH All Rights Reserved.

Use of this source code is governed by an MIT-style license that can be
found in the LICENSE file at https://angular.io/license
-->`,
                styles: [`.mat-select-search-hidden{visibility:hidden}.mat-select-search-inner{position:absolute;top:0;width:100%;border-bottom-width:1px;border-bottom-style:solid;z-index:100;font-size:inherit;-webkit-box-shadow:none;box-shadow:none;border-radius:0}.mat-select-search-inner.mat-select-search-inner-multiple{width:100%}/deep/ .mat-select-search-panel{-webkit-transform:none!important;transform:none!important;max-height:350px;overflow-x:hidden}.mat-select-search-input{padding:16px 36px 16px 16px;-webkit-box-sizing:border-box;box-sizing:border-box}.mat-select-search-no-entries-found{padding:16px}.mat-select-search-clear{position:absolute;right:4px;top:5px}/deep/ .cdk-overlay-pane-select-search{margin-top:-50px}`],
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => MatSelectSearchComponent),
                        multi: true
                    }
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
MatSelectSearchComponent.ctorParameters = () => [
    { type: MatSelect, decorators: [{ type: Inject, args: [MatSelect,] },] },
    { type: ChangeDetectorRef, },
];
MatSelectSearchComponent.propDecorators = {
    "placeholderLabel": [{ type: Input },],
    "noEntriesFoundLabel": [{ type: Input },],
    "clearSearchInput": [{ type: Input },],
    "searchSelectInput": [{ type: ViewChild, args: ['searchSelectInput', { read: ElementRef },] },],
    "innerSelectSearch": [{ type: ViewChild, args: ['innerSelectSearch', { read: ElementRef },] },],
    "clearIcon": [{ type: ContentChild, args: [MatSelectSearchClearDirective,] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Copyright (c) 2018 Bithost GmbH All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class NgxMatSelectSearchModule {
}
NgxMatSelectSearchModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MatButtonModule,
                    MatIconModule,
                    MatInputModule
                ],
                declarations: [
                    MatSelectSearchComponent,
                    MatSelectSearchClearDirective
                ],
                exports: [
                    MatSelectSearchComponent,
                    MatSelectSearchClearDirective
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatSelectSearchComponent, NgxMatSelectSearchModule, MatSelectSearchClearDirective as ɵa };
//# sourceMappingURL=ngx-mat-select-search.js.map
