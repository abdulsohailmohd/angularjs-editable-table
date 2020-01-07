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
            templateUrl: "../angularjs-editable-table/editable-table.html"
        }
    }

}());