(function () {
    const app = angular.module("app", ["ngMockE2E", "ngResource"])

    app.factory("ResourceMock", [
        "$resource", function ($resource) {
            return $resource("http://localhost:3001/forms")
        }
    ]);

    app.factory("AutocompletePostSource", [
        "$resource", function ($resource) {
            return $resource("http://localhost:3001/customers", {},
                {postArr: {method: "POST", params: {}, isArray: true}}
            )
        }
    ]);

    app.factory("SaveForm", [
        "$resource", function ($resource) {
            return $resource("http://localhost:3001/forms", {}, {
                putForm: {method: "PUT", params: {}, isArray: false}
            })
        }
    ])

    app.controller("myCtrl", function ($scope, $http, ResourceMock, SaveForm) {
        $scope.fcrForm = {};
        $scope.delEmployee = function (index) {
            $scope.$parent.$parent.fcrForm.employees.splice(index, 1);
        };                        // scope.fcrForm??????
        $scope.addEmployee = function () {
            $scope.fcrForm.employees.push({
                name: "",
                classification: "",
                normalTime: {
                    hrs: 0,
                    rate: 0
                },
                doubleTime: {
                    hrs: 0,
                    rate: 0
                },
                perDiem: 0,
                totalCost: 0
            });
        }

        $scope.openForm = function () {
            ResourceMock.get().$promise.then(function (response) {
                $scope.fcrForm.employees = response.employees;
                $scope.fcrForm.comment = response.comment;
                $scope.fcrForm.prepared = response.prepared;
                $scope.fcrForm.customer = response.customer;
            });
        }
        $scope.openForm()

        $scope.saveFormFunc = function () {
            SaveForm.putForm($scope.fcrForm, function (response){
            })
        }
        $scope.test = function () {
            console.log($scope.fcrForm.employees);
            console.log($scope.fcrForm);
        };
    });

    app.directive("oneEmployeeRow", function (){
        return {
            controller: "myCtrl",
            restrict: "AE",
            replace: true,
            scope: {
                employee: "=",
                index: "=",
                fcrForm: "=?",                                                     //"?="
            },
            templateUrl: "one-employee-table-directive.html",
            link: function ($scope, element, attrs, fcrForm) {
                var form = $scope.$parent.$parent.fcrForm                       //how to take fcrForm?????
                $scope.$watchGroup(
                    [
                        function () {
                            return $scope.employee.normalTime.rate
                        },
                        function () {
                            return $scope.employee.normalTime.hrs
                        },
                        function () {
                            return $scope.employee.doubleTime.rate
                        },
                        function () {
                            return $scope.employee.doubleTime.hrs
                        },
                        function () {
                            return $scope.employee.perDiem
                        },
                        function () {
                            return form.employees.length
                        }
                    ]
                    ,
                    function (newVal, oldVal, scope) {

                        $scope.employee.normalAmount = $scope.employee.normalTime.hrs * $scope.employee.normalTime.rate;
                        $scope.employee.doubleAmount = $scope.employee.doubleTime.hrs * $scope.employee.doubleTime.rate;
                        $scope.employee.totalCost = $scope.employee.normalAmount + $scope.employee.doubleAmount + $scope.employee.perDiem;

                        form.totalNormalTimeHrs = 0;
                        form.totalDoubleTimeHrs = 0;
                        form.totalNormalTimeAmount = 0;
                        form.totalDoubleTimeAmount = 0;
                        form.totalPerDiem = 0;
                        form.totalPrice = 0;

                        form.employees.forEach(function calculateTotalValues(item) {
                            form.totalNormalTimeHrs += item.normalTime.hrs;
                            form.totalDoubleTimeHrs += item.doubleTime.hrs;
                            form.totalNormalTimeAmount += item.normalAmount;
                            form.totalDoubleTimeAmount += item.doubleAmount;
                            form.totalPerDiem += item.perDiem;
                            form.totalPrice += item.totalCost;
                        });
                    }
                )
            }
        }
    })

    app.directive("datePicker", function () {
        return {
            restrict: "AE",
            require: 'ngModel',
            controller: "myCtrl",
            link: function ($scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.unshift(function (viewValue) {
                    return +new Date(viewValue)
                });
                $scope.$watch(
                    function () {
                        if ($scope.fcrForm.customer) {
                            return $scope.fcrForm.customer.datepicker
                        }
                    },
                    function () {
                        $(element).datepicker({
                            format: "DD, MM d, yyyy"
                        })
                        $(element).datepicker('setDate', new Date(Number.parseInt($scope.fcrForm.customer.datepicker)))
                    }
                );
            }
        }
    });

    app.directive("autoComplete", ["$http", "AutocompletePostSource", function ($http, AutocompletePostSource) {              // use resource
        return {
            controller: "myCtrl",
            restrict: 'AE',
            link: function ($scope, element, attrs) {
                $(element).autocomplete({
                    source: async function (request, response) {
                        AutocompletePostSource.postArr(request.term, function (res) {
                            response(res)
                        })   //resource + body + succesFunc
                    },
                    delay: 100,
                    autofocus: true,
                    minLength: 0,
                    select: function (event, ui){
                        $scope.fcrForm.customer.customerValue = ui.item.value
                    }
                });
                $("#customer").click(function (){
                    $scope.$apply()
                })
                $("#showList").click(function () {
                    $(element).autocomplete("search", "");
                });
            }
        }
    }]);

    app.run(function ($httpBackend) {
        let customers = ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby"];
        let customer = {
            customerValue: "testClient1",
            jobNameValue: "job1",
            projectValue: "project1",
            datepicker: 1602908000000,
            orderValue: "1",
            sapValue: "sap123"
        };
        let employees = [
            {
                name: "Employee1",
                classification: "cli1",
                perDiem: 11,
                normalTime: {
                    hrs: 10,
                    rate: 1
                },
                doubleTime: {
                    hrs: 5,
                    rate: 1
                }
            },
            {
                name: "Employee2",
                classification: "cli1",
                perDiem: 22,
                normalTime: {
                    hrs: 15,
                    rate: 1
                },
                doubleTime: {
                    hrs: 8,
                    rate: 1
                }
            },
            {
                name: "Employee3",
                classification: "cli2",
                perDiem: 33,
                normalTime: {
                    hrs: 5,
                    rate: 2
                },
                doubleTime: {
                    hrs: 12,
                    rate: 2
                }
            }];
        let fcrForm =
            {
                customer: customer,
                employees: employees,
                comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
                prepared: "John Doe",
            };

        $httpBackend.whenGET('http://localhost:3001/forms').respond(200, fcrForm);
        $httpBackend.whenPUT('http://localhost:3001/forms').respond(function (method, url, data) {
            return [200, fcrForm, {}];
        });
        $httpBackend.whenPOST('http://localhost:3001/forms').respond(function (method, url, data) {
            return [200, fcrForm, {}];
        });

        $httpBackend.whenPOST('http://localhost:3001/customers').respond(function (method, url, data) {
            let filtredValue = [];
            if (data === "c") {
                filtredValue = ["all", "values", "c", "request"]
                return [200, filtredValue, {}]
            }
            if (data === "d") {
                filtredValue = ["all", "values", "d", "request"]
                return [200, filtredValue, {}]
            }
            return [200, customers, {}];
        })
        $httpBackend.whenGET(/\.html$/).passThrough();
    })
})()


// customers.indexOf(data) != -1
