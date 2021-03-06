// import 'ui-bootstrap4';
// import uiBootstrap from 'ui-bootstrap4';
// importScripts('ui-bootstrap4')
angular
    .module('angularjs-editable-table', ['ui.bootstrap'])
    .filter('smartSearch', ['$filter', function ($filter) {
        return function (collection, keywords) {
            if (!keywords) {
                return collection;
            } else {
                keywords = keywords.split(" ");
                // $.each(keywords, function (k, v) {
                keywords.forEach(function (v, k) {
                    collection = $filter('filter')(collection, { $: v });
                });
                return collection;
            }
        }
    }])
    .directive('editableTable', editableTable)

/** @ngInject */
function editableTable($window, $timeout) {

    // function editableTableController() {

    //     init();

    //     function init() {

    //     }
    // }

    function link(scope, element) {

        console.log(scope);
        let defaults = {
            disableDelete: false,
            minRecords: undefined, // Restrict removing rows if less than given count
            // columns: [],
            callbacks: {

            },
            classes: {
                table: "",
                tableWrapper: "",
                pagination: ""
            },
            closeButton: {
                label: "",
                iconClass: "",
                buttonClass: ""
            },
            pageLength: 10,
        };

        angular.extend(defaults, scope.options)
        // Object.assign(scope.options, defaults)
        console.log("Options >>> ", scope.options);

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
        template:'<div class="toolbar"><div class="heading">{{heading}}</div><div class="d-flex"><button type="button" ng-click="addRow()" class="btn btn-sm btn-outline-primary mr-2">Add +</button> <input type="text" class="form-control form-control-sm custom-input custom-input-search" placeholder="Search" ng-model="options.searchTerm"></div></div><div ng-class="options.classes.tableWrapper"><table ng-class="options.classes.table"><thead><tr><th ng-repeat="item in options.columns" ng-class="{ \'text-right\': item.type.inputType == \'number\'}">{{item.title}}</th><th ng-hide="options.disableDelete"></th></tr></thead><tbody><tr ng-repeat="row in filteredData = ( data | smartSearch:options.searchTerm) | limitTo : options.pageLength : options.pageLength*(options.currentPage-1)"><td ng-repeat="cell in options.columns"><input ng-if="cell.type.name == \'input\'" ng-class="{ \'text-right\': cell.type.inputType == \'number\'}" ng-change="optionChanged(row[cell.data],\'{{row[cell.data]}}\', row, cell)" placeholder="{{cell.type.placeHolder}}" title="{{cell.type.placeHolder}}" maxlength="{{cell.type.maxlength}}" ng-required="cell.type.required" ng-disabled="cell.type.disabled" type="{{cell.type.inputType}}" class="form-control" ng-model="row[cell.data]"><select ng-required="cell.type.required" ng-change="optionChanged(row[cell.data],\'{{row[cell.data]}}\', row, cell)" ng-if="cell.type.name == \'select\'" class="custom-select custom-select-md form-control" ng-model="row[cell.data]" title="{{cell.type.placeHolder}}" ng-options="item[cell.type.idProp] as item[cell.type.displayProp] for item in cell.type.data"><option>{{cell.type.placeHolder}}</option></select><div ng-if="cell.type.name == \'date\'" class="d-flex"><input type="text" class="form-control" uib-datepicker-popup="MM-dd-yyyy" ng-required="cell.type.required" ng-model="row[cell.data]" is-open="dateOpen" patter placeholder="mm-dd-yyyy" pattern="\\d{1,2}-\\d{1,2}-\\d{4}" title="mm-dd-yyyy" datepicker-options="dateOptions" close-text="Close" ng-disabled="cell.type.disabled"> <button type="button" class="btn" ng-click="dateOpen = !dateOpen" ng-hide="cell.type.disabled"><i class="mdi mdi-calendar-plus"></i></button></div></td><td ng-hide="options.disableDelete"><button type="button" class="btn" ng-class="options.closeButton.buttonClass" title="Remove row" ng-click="removeRow($index)"><i ng-class="options.closeButton.iconClass"></i> <span class="label">{{options.closeButton.label}}</span></button></td></tr></tbody></table><div class="d-flex justify-content-between align-items-top mb-2"><div class="dataTables_info">Showing {{options.pageLength*(options.currentPage-1)+1}} to {{options.pageLength*(options.currentPage-1)+options.pageLength > filteredData.length ? filteredData.length : options.pageLength*(options.currentPage-1)+options.pageLength}} of {{filteredData.length}} entries <span ng-show="options.searchTerm">(filtered from {{data.length}} total entries)</span></div><ul uib-pagination total-items="filteredData.length" ng-model="options.currentPage" max-size="6" items-per-page="options.pageLength" class="mb-0" ng-class="options.classes.pagination" boundary-link-numbers="true" rotate="false"></ul></div></div>'
    }
}