(function () {
    'use strict';

    angular
        .module('angularjs-editable-table', [])
        .directive('editableTable', editableTable)
    // .filter('excludeFrom', function () {
    //     return function (inputArray, filterCriteria) {
    //         return inputArray.filter(function (item) {
    //             // if the value of filterCriteria is "falsy", retain the inputArray as it is
    //             // then check if the currently checked item in the inputArray is different from the filterCriteria,
    //             // if so, keep it in the filtered results
    //             // return !filterCriteria || !angular.equals(item, filterCriteria);
    //             return !filterCriteria || filterCriteria.includes(item);
    //         });
    //     };
    // });

    /** @ngInject */
    function editableTable($window, $timeout) {

        // function editableTableController() {

        //     init();

        //     function init() {

        //     }
        // }

        function link(scope, element) {

            console.log(scope);
            scope.options.minRecords = scope.options.minRecords || 0;

            scope.addRow = () => {
                // let a = angular.copy(scope.data[0]);
                // scope.options.columns.forEach(element => {
                //     a[element.data] = null;
                // });
                scope.options.currentPage = Math.ceil(scope.data.length + 1 / scope.options.pageLength);
                scope.data.push({});
                $timeout(() => {
                    console.log(element);
                    element.find("tbody tr:last-child td:first-child").children().focus()
                }, 100);
                if (scope.formInstance) {
                    scope.formInstance.$setDirty();
                }
            };

            scope.removeRow = (index) => {
                index += scope.options.pageLength * (scope.options.currentPage - 1);
                // if (scope.data.length - 1 > 0 || scope.options.allowEmpty)
                console.log(scope.data[index]);
                if (scope.data.length > scope.options.minRecords) {
                    scope.data.splice(index, 1);
                    // if (typeof scope.options.callbacks.removedRow == "function") {
                    //     scope.options.callbacks.removedRow(index);
                    // }
                    if (scope.formInstance) {
                        scope.formInstance.$setDirty();
                    }
                }
            }

            scope.options.saveGrid = () => {
                // console.log(scope.data);
                return scope.data;
            }

            // /**
            //  * @desc Used when duplicate selections are not allowed on options
            //  * @param option each option of the select
            //  * @param columnProperty property name of the column
            //  */
            // scope.isOptionSelected = (option, columnProperty) => {
            //     // console.log(option, columnProperty);
            //     return scope.data.map(item => item[columnProperty]).includes(option);
            //     // console.log(selectedOptions);
            // }

            scope.options.columns.forEach((column, i) => {
                if (column.type.name == "select" && column.type.unique) {
                    column.selectedValues = scope.data.map(item => item[column.data])
                }
            });

            scope.optionChanged = (newValue, oldValue, row, column) => {
                console.log("Changed: newValue: ", newValue, ", oldValue: ", oldValue);
                if (column.selectedValues) {
                    if (column.selectedValues.includes(newValue)) {
                        row[column.data] = isNaN(oldValue) ? oldValue : Number.parseInt(oldValue);
                        toastr.warning(column.title + " already exists.")
                    }
                    else {
                        column.selectedValues = scope.data.map(item => item[column.data])
                        if (typeof column.onChange == "function") {
                            column.onChange({
                                newValue,
                                oldValue,
                                row,
                                column
                            });
                        }
                    }
                }
                else {
                    if (typeof column.onChange == "function") {
                        column.onChange({
                            newValue,
                            oldValue,
                            row,
                            column
                        });
                    }
                }
            }

            // scope.data.forEach((element, i) => {
            //     scope.$watch(() => { return element }, (newValue, oldValue) => {
            //         if (!_.isEqual(newValue, oldValue)) {
            //             newValue.changed = true;
            //             console.log("Data changed >>> ", newValue, oldValue);
            //         }
            //     }, true);
            // });

            scope.options.pageLength = 6;

            // bodyHeight = $('.tab-content')[0].offsetHeight;
            let bodyHeight = $window.innerHeight;

            if (bodyHeight <= 864) {
                scope.options.pageLength = 6;
            }
            else if (bodyHeight <= 1080) {
                scope.options.pageLength = 6;
            }
            else if (bodyHeight <= 1440) {
                scope.options.pageLength = 10;
            }
            else if (bodyHeight <= 2160) {
                scope.options.pageLength = 20;
            }

            scope.options.currentPage = 1;

        }

        return {
            // bindToController: true,
            // controller: editableTableController,
            // controllerAs: 'Ctrl',
            link: link,
            restrict: 'AE',
            scope: {
                data: '=',
                options: '=',
                heading: '@',
                formInstance: '=',
            },
            template:'<div class="toolbar"><div class="heading">{{heading}}</div><div class="d-flex"><button type="button" ng-click="addRow()" class="btn btn-sm btn-outline-primary mr-2">Add +</button> <input type="text" class="form-control form-control-sm custom-input custom-input-search" ng-model="options.searchTerm"></div></div><div class="dataTables_wrapper"><div class="overflow-x-auto"><table class="table table-sm table-bordered dataTable"><thead><tr><th ng-repeat="item in options.columns" ng-class="{ \'text-right\': item.type.inputType == \'number\'}">{{item.title}}</th><th ng-hide="options.disableDelete"></th></tr></thead><tbody><tr ng-repeat="row in filteredData = ( data | smartSearch:options.searchTerm) | limitTo : options.pageLength : options.pageLength*(options.currentPage-1)"><td ng-repeat="cell in options.columns"><input ng-if="cell.type.name == \'input\' && cell.type.inputType == \'number\'" ng-class="{ \'text-right\': cell.type.inputType == \'number\'}" ng-change="optionChanged(row[cell.data],\'{{row[cell.data]}}\', row, cell)" placeholder="{{cell.type.placeHolder}}" title="{{cell.type.placeHolder}}" ng-required="cell.type.required" ng-disabled="cell.type.disabled" type="text" format-number class="form-control" ng-model="row[cell.data]"><input ng-if="cell.type.name == \'input\' && cell.type.inputType != \'number\'" ng-class="{ \'text-right\': cell.type.inputType == \'number\'}" ng-change="optionChanged(row[cell.data],\'{{row[cell.data]}}\', row, cell)" placeholder="{{cell.type.placeHolder}}" title="{{cell.type.placeHolder}}" maxlength="{{cell.type.maxlength}}" ng-required="cell.type.required" ng-disabled="cell.type.disabled" type="{{cell.type.inputType}}" class="form-control" ng-model="row[cell.data]"><select ng-required="cell.type.required" ng-change="optionChanged(row[cell.data],\'{{row[cell.data]}}\', row, cell)" ng-if="cell.type.name == \'select\'" class="custom-select custom-select-md form-control" ng-model="row[cell.data]" title="{{cell.type.placeHolder}}" ng-options="item[cell.type.id] as item[cell.type.value] for item in cell.type.data"><option>{{cell.type.placeHolder}}</option></select><div ng-if="cell.type.name == \'date\'" class="d-flex"><input type="text" class="form-control" uib-datepicker-popup="MM-dd-yyyy" ng-required="cell.type.required" ng-model="row[cell.data]" is-open="dateOpen" patter placeholder="mm-dd-yyyy" pattern="\\d{1,2}-\\d{1,2}-\\d{4}" title="mm-dd-yyyy" datepicker-options="dateOptions" close-text="Close" ng-disabled="cell.type.disabled"> <button type="button" class="btn" ng-click="dateOpen = !dateOpen" ng-hide="cell.type.disabled"><i class="mdi mdi-calendar-plus"></i></button></div></td><td ng-hide="options.disableDelete"><button type="button" class="btn" title="Remove row" ng-click="removeRow($index)"><i class="mdi mdi-close-circle"></i></button></td></tr></tbody></table></div><div class="d-flex justify-content-between align-items-top mb-2" ng-show="filteredData.length > options.pageLength"><div class="dataTables_info">Showing {{options.pageLength*(options.currentPage-1)+1}} to {{options.pageLength*(options.currentPage-1)+options.pageLength > filteredData.length ? filteredData.length : options.pageLength*(options.currentPage-1)+options.pageLength}} of {{filteredData.length}} entries <span ng-show="options.searchTerm && false">(filtered from {{data.length}} total entries)</span></div><ul uib-pagination total-items="filteredData.length" ng-model="options.currentPage" max-size="6" items-per-page="options.pageLength" class="mb-0 pagination-sm" boundary-link-numbers="true" rotate="false"></ul></div></div>'
        }
    }

}());