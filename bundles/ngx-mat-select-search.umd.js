(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/material'), require('rxjs'), require('rxjs/operators'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define('ngx-mat-select-search', ['exports', '@angular/core', '@angular/forms', '@angular/material', 'rxjs', 'rxjs/operators', '@angular/common'], factory) :
	(factory((global['ngx-mat-select-search'] = {}),global.ng.core,global.ng.forms,global.ng.material,global.rxjs,global.Rx.Observable.prototype,global.ng.common));
}(this, (function (exports,core,forms,material,rxjs,operators,common) { 'use strict';

var MatSelectSearchClearDirective = /** @class */ (function () {
    function MatSelectSearchClearDirective() {
    }
    return MatSelectSearchClearDirective;
}());
MatSelectSearchClearDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[ngxMatSelectSearchClear]'
            },] },
];
var MatSelectSearchComponent = /** @class */ (function () {
    function MatSelectSearchComponent(matSelect, changeDetectorRef) {
        this.matSelect = matSelect;
        this.changeDetectorRef = changeDetectorRef;
        this.placeholderLabel = 'Pesquisar';
        this.noEntriesFoundLabel = 'Nenhum item encontrado';
        this.clearSearchInput = false;
        this.onChange = function (_) { };
        this.onTouched = function (_) { };
        this.overlayClassSet = false;
        this.change = new core.EventEmitter();
        this._onDestroy = new rxjs.Subject();
    }
    Object.defineProperty(MatSelectSearchComponent.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    MatSelectSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        var panelClass = 'mat-select-search-panel';
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
        this.matSelect.openedChange
            .pipe(operators.delay(1), operators.takeUntil(this._onDestroy))
            .subscribe(function (opened) {
            if (opened) {
                _this.getWidth();
                _this._focus();
            }
            else {
                _this._reset(false, _this.clearSearchInput);
            }
        });
        this.matSelect.openedChange
            .pipe(operators.take(1))
            .pipe(operators.takeUntil(this._onDestroy))
            .subscribe(function () {
            _this._options = _this.matSelect.options;
            _this._options.changes
                .pipe(operators.takeUntil(_this._onDestroy))
                .subscribe(function () {
                var keyManager = _this.matSelect._keyManager;
                if (keyManager && _this.matSelect.panelOpen) {
                    setTimeout(function () {
                        keyManager.setFirstItemActive();
                        _this.getWidth();
                    }, 1);
                }
            });
        });
        this.change
            .pipe(operators.takeUntil(this._onDestroy))
            .subscribe(function () {
            _this.changeDetectorRef.detectChanges();
        });
        this.initMultipleHandling();
    };
    MatSelectSearchComponent.prototype.ngOnDestroy = function () {
        this._onDestroy.next();
        this._onDestroy.complete();
    };
    MatSelectSearchComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.setOverlayClass();
        this.matSelect.options.changes
            .pipe(operators.takeUntil(this._onDestroy))
            .subscribe(function () {
            _this.changeDetectorRef.markForCheck();
        });
    };
    MatSelectSearchComponent.prototype._handleKeydown = function (event) {
        if (event.keyCode === 32) {
            event.stopPropagation();
        }
    };
    MatSelectSearchComponent.prototype.writeValue = function (value) {
        var valueChanged = value !== this._value;
        if (valueChanged) {
            this._value = value;
            this.change.emit(value);
        }
    };
    MatSelectSearchComponent.prototype.onInputChange = function (value) {
        var valueChanged = value !== this._value;
        if (valueChanged) {
            this.initMultiSelectedValues();
            this._value = value;
            this.onChange(value);
            this.change.emit(value);
        }
    };
    MatSelectSearchComponent.prototype.onBlur = function (value) {
        this.writeValue(value);
        this.onTouched();
    };
    MatSelectSearchComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    MatSelectSearchComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    MatSelectSearchComponent.prototype._focus = function () {
        if (!this.searchSelectInput) {
            return;
        }
        var panel = this.matSelect.panel.nativeElement;
        var scrollTop = panel.scrollTop;
        this.searchSelectInput.nativeElement.focus();
        panel.scrollTop = scrollTop;
    };
    MatSelectSearchComponent.prototype._reset = function (focus, clearInput) {
        this.searchSelectInput.nativeElement.value = '';
        if (clearInput) {
            this.onInputChange('');
        }
        if (focus) {
            this._focus();
        }
    };
    MatSelectSearchComponent.prototype.setOverlayClass = function () {
        var _this = this;
        if (this.overlayClassSet) {
            return;
        }
        var overlayClass = 'cdk-overlay-pane-select-search';
        this.matSelect.overlayDir.attach
            .pipe(operators.takeUntil(this._onDestroy))
            .subscribe(function () {
            var element = _this.searchSelectInput.nativeElement;
            var overlayElement;
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
    };
    MatSelectSearchComponent.prototype.initMultipleHandling = function () {
        var _this = this;
        this.matSelect.valueChange
            .pipe(operators.takeUntil(this._onDestroy))
            .subscribe(function (values) {
            if (_this.matSelect.multiple) {
                var restoreSelectedValues_1 = false;
                if (_this._value && _this._value.length
                    && _this.previousSelectedValues && Array.isArray(_this.previousSelectedValues)) {
                    if (!values || !Array.isArray(values)) {
                        values = [];
                    }
                    var optionValues_1 = _this.matSelect.options.map(function (option) { return option.value; });
                    _this.previousSelectedValues.forEach(function (previousValue) {
                        if (values.indexOf(previousValue) === -1 && optionValues_1.indexOf(previousValue) === -1) {
                            values.push(previousValue);
                            restoreSelectedValues_1 = true;
                        }
                    });
                }
                if (restoreSelectedValues_1) {
                    _this.matSelect._onChange(values);
                }
                _this.previousSelectedValues = values;
            }
        });
    };
    MatSelectSearchComponent.prototype.getWidth = function () {
        if (!this.innerSelectSearch || !this.innerSelectSearch.nativeElement) {
            return;
        }
        var element = this.innerSelectSearch.nativeElement;
        var panelElement;
        while (element = element.parentElement) {
            if (element.classList.contains('mat-select-panel')) {
                panelElement = element;
                break;
            }
        }
        if (panelElement) {
            this.innerSelectSearch.nativeElement.style.width = panelElement.clientWidth + 'px';
        }
    };
    MatSelectSearchComponent.prototype.initMultiSelectedValues = function () {
        if (this.matSelect.multiple && !this._value) {
            this.previousSelectedValues = this.matSelect.options
                .filter(function (option) { return option.selected; })
                .map(function (option) { return option.value; });
        }
    };
    return MatSelectSearchComponent;
}());
MatSelectSearchComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ngx-mat-select-search',
                template: "<!-- Placeholder to adjust vertical offset of the mat-option elements -->\n<input matInput class=\"mat-select-search-input mat-select-search-hidden\" />\n\n<!-- Note: the  mat-datepicker-content mat-tab-header are needed to inherit the material theme colors, see PR #22 -->\n<div #innerSelectSearch class=\"mat-select-search-inner mat-typography mat-datepicker-content mat-tab-header\" [ngClass]=\"{'mat-select-search-inner-multiple': matSelect.multiple}\">\n    <input matInput class=\"mat-select-search-input\" autocomplete=\"off\" #searchSelectInput (keydown)=\"_handleKeydown($event)\"\n        (input)=\"onInputChange($event.target.value)\" (blur)=\"onBlur($event.target.value)\" [placeholder]=\"placeholderLabel\" />\n    <button mat-button *ngIf=\"value\" mat-icon-button aria-label=\"Clear\" (click)=\"_reset(true, true)\" class=\"mat-select-search-clear\">\n        <ng-content *ngIf=\"clearIcon; else defaultIcon\" select=\"[ngxMatSelectSearchClear]\"></ng-content>\n        <ng-template #defaultIcon>\n            <mat-icon>close</mat-icon>\n        </ng-template>\n    </button>\n</div>\n\n<div *ngIf=\"noEntriesFoundLabel && value && _options?.length === 0\" class=\"mat-select-search-no-entries-found\">\n    {{noEntriesFoundLabel}}\n</div>\n<!--\nCopyright (c) 2018 Bithost GmbH All Rights Reserved.\n\nUse of this source code is governed by an MIT-style license that can be\nfound in the LICENSE file at https://angular.io/license\n-->",
                styles: [".mat-select-search-hidden{visibility:hidden}.mat-select-search-inner{position:absolute;top:0;width:100%;border-bottom-width:1px;border-bottom-style:solid;z-index:100;font-size:inherit;-webkit-box-shadow:none;box-shadow:none;border-radius:0}.mat-select-search-inner.mat-select-search-inner-multiple{width:100%}/deep/ .mat-select-search-panel{-webkit-transform:none!important;transform:none!important;max-height:350px;overflow-x:hidden}.mat-select-search-input{padding:16px 36px 16px 16px;-webkit-box-sizing:border-box;box-sizing:border-box}.mat-select-search-no-entries-found{padding:16px}.mat-select-search-clear{position:absolute;right:4px;top:5px}/deep/ .cdk-overlay-pane-select-search{margin-top:-50px}"],
                providers: [
                    {
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return MatSelectSearchComponent; }),
                        multi: true
                    }
                ],
                changeDetection: core.ChangeDetectionStrategy.OnPush
            },] },
];
MatSelectSearchComponent.ctorParameters = function () { return [
    { type: material.MatSelect, decorators: [{ type: core.Inject, args: [material.MatSelect,] },] },
    { type: core.ChangeDetectorRef, },
]; };
MatSelectSearchComponent.propDecorators = {
    "placeholderLabel": [{ type: core.Input },],
    "noEntriesFoundLabel": [{ type: core.Input },],
    "clearSearchInput": [{ type: core.Input },],
    "searchSelectInput": [{ type: core.ViewChild, args: ['searchSelectInput', { read: core.ElementRef },] },],
    "innerSelectSearch": [{ type: core.ViewChild, args: ['innerSelectSearch', { read: core.ElementRef },] },],
    "clearIcon": [{ type: core.ContentChild, args: [MatSelectSearchClearDirective,] },],
};
var NgxMatSelectSearchModule = /** @class */ (function () {
    function NgxMatSelectSearchModule() {
    }
    return NgxMatSelectSearchModule;
}());
NgxMatSelectSearchModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    material.MatButtonModule,
                    material.MatIconModule,
                    material.MatInputModule
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

exports.MatSelectSearchComponent = MatSelectSearchComponent;
exports.NgxMatSelectSearchModule = NgxMatSelectSearchModule;
exports.ɵa = MatSelectSearchClearDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-mat-select-search.umd.js.map
