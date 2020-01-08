# angularjs-editable-table

Editable Table for AngularJS

## Installation

`npm install angularjs-editable-table --save`

<!-- ## Demo
`

` -->

## Setup

1. Include script file in index.html

```html
<!-- Dependencies -->
<script src="./node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js"></script>
<script src="./node_modules/jquery/dist/jquery.js"></script>

<!-- Editable Table -->
<script src="./node_modules/angularjs-editable-table/dist/editable-table.js"></script>
```

2. Configure your angular app

```javascript
var myApp = angular.module('myApp', ['angularjs-editable-table']);
```

3. Create editable table

```html
<div editable-table form-instance="formInstance" data="data" options="options" heading="Optional Heading">
```

4. Configure editable table

```javascript
myApp.controller('myCtrl', function ($scope) {
    $scope.data = data;
    $scope.dropdownData = [
        { "id": 1, "name": "Micheil" },
        { "id": 2, "name": "Samson" },
        { "id": 3, "name": "Thedric" },
        { "id": 4, "name": "Alfred" },
        { "id": 5, "name": "Freedman" },
        { "id": 6, "name": "Samuele" },
        { "id": 7, "name": "Odele" },
        { "id": 8, "name": "Lilas" },
        { "id": 9, "name": "Florinda" },
        { "id": 10, "name": "Che" }
    ]

    $scope.options = {
        disableDelete: false,
        minRecords: 1, // Restrict removing rows if less than given count
        columns: [
            {
                title: "Number",
                data: "number",
                type: {
                    name: "input",
                    inputType: "number",
                    required: true,
                    class: "text-center",
                    placeholder: "Enter a number"
                }
            },
            {
                title: "Text",
                data: "text",
                type: {
                    name: "input",
                    inputType: "text",
                    required: true,
                    class: "",
                    placeholder: "Enter a text"
                }
            },
            {
                title: "URL",
                data: "url",
                type: {
                    name: "input",
                    inputType: "url",
                    required: true,
                    class: "",
                    placeholder: "Enter a URL"
                }
            },
            {
                title: "Select",
                data: "select",
                type: {
                    name: "select",
                    required: true,
                    class: "",
                    placeholder: "Select something",
                    idProp: "id",
                    displayProp: "name",
                    data: $scope.dropdownData
                }
            },
        ],
        callbacks: {

        },
        classes: {
            table: "table table-sm table-bordered",
            tableWrapper: "table-wrapper",
            pagination: ""
        },
        closeButton: {
            label: "remove",
            iconClass: "mdi mdi-close-circle",
            buttonClass: "btn"
        },
        pageLength: 10,
    };
});
```

## Features

1. Pagination
2. Search filter
3. Column types
4. Required and type validation

## Limitations/ Future enhancements

1. Column sorting