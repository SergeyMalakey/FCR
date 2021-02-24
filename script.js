(function () {
    // components
    const app = angular.module("app", ["ngMockE2E", "ngResource"]);

    app.factory("AutocompleteFactory", [
        "$resource", function ($resource) {
            return $resource("http://localhost:3001/customers/:term", {term: ""},
            )
        }
    ]);

    app.factory("FcrFactory", [
        "$resource", function ($resource) {
            return $resource("http://localhost:3001/fcr/:id", {id: 1},
                {
                    putFcrForm: {method: "PUT", params: {}, isArray: true},
                    postFcrForm: {method: "POST", params: {}, isArray: true}
                }
            );
        }
    ]);

    app.controller("myCtrl", function ($scope, $http, FcrFactory) {

        $scope.fcrForm = {};

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
        };

        $scope.fetchFcrForm = function () {
            FcrFactory.get().$promise.then(function (response) {
                $scope.fcrForm = response;      // took a resource object with Promise fields
            });
        };

        $scope.saveFcrForm = function () {
            FcrFactory.putFcrForm($scope.fcrForm, function (data) {
                console.log("response status code ", data[0])
            },)
        };

        $scope.$watch(function () {

            $scope.fcrForm.totalNormalTimeHrs = 0;
            $scope.fcrForm.totalDoubleTimeHrs = 0;
            $scope.fcrForm.totalNormalTimeAmount = 0;
            $scope.fcrForm.totalDoubleTimeAmount = 0;
            $scope.fcrForm.totalPerDiem = 0;
            $scope.fcrForm.totalPrice = 0;

            if ($scope.fcrForm.employees) {

                $scope.fcrForm.employees.forEach(function calculateTotalValues(item) {
                    $scope.fcrForm.totalNormalTimeHrs += item.normalTime.hrs
                    $scope.fcrForm.totalDoubleTimeHrs += item.doubleTime.hrs;
                    $scope.fcrForm.totalNormalTimeAmount += item.normalAmount;
                    $scope.fcrForm.totalDoubleTimeAmount += item.doubleAmount;
                    $scope.fcrForm.totalPerDiem += item.perDiem;
                    $scope.fcrForm.totalPrice += item.totalCost;
                });
            }
        });

        $scope.test = function () {
            console.log($scope.fcrForm);
        };

        $scope.init = function () {
            $scope.fetchFcrForm();
        };

        $scope.init();
    });

    app.directive("oneEmployeeRow", function () {

        return {
            restrict: "AE",
            replace: true,
            scope: {
                employee: "=",
                index: "=",
                fcrForm: "=",
            },
            templateUrl: "one-employee-table-directive.html",
            link: function ($scope, element, attrs, fcrForm) {

                $scope.deleteEmployee = function (index) {
                    $scope.fcrForm.employees.splice(index, 1);
                };

                $scope.$watch(function (newVal, oldVal, scope) {
                    $scope.employee.normalAmount = $scope.employee.normalTime.hrs * $scope.employee.normalTime.rate;
                    $scope.employee.doubleAmount = $scope.employee.doubleTime.hrs * $scope.employee.doubleTime.rate;
                    $scope.employee.totalCost = $scope.employee.normalAmount + $scope.employee.doubleAmount + $scope.employee.perDiem;
                });
            }
        }
    });

    app.directive("datePicker", function () {

        return {
            restrict: "AE",
            require: 'ngModel',
            controller: "myCtrl",
            link: function ($scope, $element, $attrs, $ngModelCtrl) {

                $ngModelCtrl.$parsers.unshift(function (viewValue) {
                    return +new Date(viewValue)
                });

                $scope.$watch(
                    function () {
                        if ($scope.fcrForm) {
                            return $scope.fcrForm.datepicker
                        }
                    },
                    function () {
                        $($element).datepicker({
                            format: "DD, MM d, yyyy"
                        })
                        $($element).datepicker('setDate', new Date(Number.parseInt($scope.fcrForm.datepicker)))
                    }
                );
            }
        }
    });

    app.directive("autoComplete", ["$http", "AutocompleteFactory", function ($http, AutocompleteFactory) {

        return {
            controller: "myCtrl",
            restrict: 'AE',
            link: function ($scope, element, attrs) {
                $(element).autocomplete({
                    source: function (request, response) {
                        AutocompleteFactory.query({term: request.term}, function (res) {
                            response(res); // resource + body + succesFunc
                        })
                    },
                    delay: 100,
                    autofocus: true,
                    minLength: 0,
                    select: function (event, ui) {
                        $scope.fcrForm.customerName = ui.item.value
                    }
                });
                $("#customer").click(function () {
                    $scope.$apply()
                });
                $("#showList").click(function () {
                    $(element).autocomplete("search", "");
                });
            }
        }
    }]);

    app.run(function ($httpBackend) {

        let customers = ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby"];

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
                customerName: "testClient1",
                jobName: "job1",
                project: "project1",
                datepicker: 1602908000000,
                order: "Order1",
                sap: "sap123",
                employees: employees,
                comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
                prepared: "John Doe",
            };

        $httpBackend.whenGET('http://localhost:3001/fcr/1').respond(200, fcrForm);
        $httpBackend.whenPUT('http://localhost:3001/fcr/1').respond([200, {}]);
        $httpBackend.whenPOST('http://localhost:3001/fcr/1').respond([200, {}]);

        $httpBackend.whenGET('http://localhost:3001/customers/c').respond(function (method, url, data) {
            let filtredValue = ["all", "values", "c", "request"]
            return [200, filtredValue, {}]
        });

        $httpBackend.whenGET('http://localhost:3001/customers/d').respond(function (method, url, data) {
            let filtredValue = ["all", "values", "d", "request"]
            return [200, filtredValue, {}]
        });

        $httpBackend.whenGET('http://localhost:3001/customers').respond(function (method, url, data) {
            return [200, customers, {}];
        });

        $httpBackend.whenGET(/\.html$/).passThrough();
    });
})()
