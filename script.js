(function () {
    const app = angular.module("app", ["ngMockE2E", "ngResource"]);

    /*  app.factory("AutocompleteFactory", [
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

      app.component("mainComponent", {
          templateUrl: "main-component/main-component.html",
          controller: "mainController",
          controllerAs: "vm",
      });

      app.controller("mainController", ["$scope", "FcrFactory", function ($scope, FcrFactory) {

          var vm = this;

          vm.fcrForm = {};

          vm.addEmployee = function () {
              vm.fcrForm.employees.push({
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

          vm.fetchFcrForm = function () {
              FcrFactory.get().$promise.then(function (response) {
                  vm.fcrForm = response;      // took a resource object with Promise fields
              });
          };

          vm.saveFcrForm = function () {
              FcrFactory.putFcrForm(vm.fcrForm, function (data) {
                  console.log("response status code ", data[0])
              })
          };

          $scope.$watch(function () {

              vm.fcrForm.totalNormalTimeHrs = 0;
              vm.fcrForm.totalDoubleTimeHrs = 0;
              vm.fcrForm.totalNormalTimeAmount = 0;
              vm.fcrForm.totalDoubleTimeAmount = 0;
              vm.fcrForm.totalPerDiem = 0;
              vm.fcrForm.totalPrice = 0;

              if (vm.fcrForm.employees) {

                  vm.fcrForm.employees.forEach(function calculateTotalValues(item) {
                      vm.fcrForm.totalNormalTimeHrs += item.normalTime.hrs
                      vm.fcrForm.totalDoubleTimeHrs += item.doubleTime.hrs;
                      vm.fcrForm.totalNormalTimeAmount += item.normalAmount;
                      vm.fcrForm.totalDoubleTimeAmount += item.doubleAmount;
                      vm.fcrForm.totalPerDiem += item.perDiem;
                      vm.fcrForm.totalPrice += item.totalCost;
                  });
              }
          });

          vm.deleteEmployee = function (index) {
              vm.fcrForm.employees.splice(index, 1);
          };

          vm.test = function () {
              console.log(vm.fcrForm);
          };

          vm.$onInit = function () {
              vm.fetchFcrForm();
          };
      }]);

      app.directive("oneEmployeeRow", function () {

          return {
              restrict: "A",
              require: {
                  fcrCtrl: "^mainComponent"
              },
              scope: {},
              bindToController: {
                  employee: "=",
                  index: "=",
              },
              templateUrl: "one-employee-table-directive.html",
              controllerAs: "vm",
              controller: ["$scope", function ($scope) {
                  var vm = this;

                  vm.deleteEmployee = function (index) {
                      vm.fcrCtrl.deleteEmployee(index)  // in parent controller use only methods! Do not address to variables
                  };

                  $scope.$watch(function () {
                      vm.employee.normalAmount = vm.employee.normalTime.hrs * vm.employee.normalTime.rate;
                      vm.employee.doubleAmount = vm.employee.doubleTime.hrs * vm.employee.doubleTime.rate;
                      vm.employee.totalCost = vm.employee.normalAmount + vm.employee.doubleAmount + vm.employee.perDiem;
                  });
              }]
          }
      });

      app.directive("datePicker", function () {

          return {
              restrict: "A",
              require: ["ngModel", "^mainComponent"],

              link: function ($scope, $element, $attrs, controllers) {

                  var $ngModelCtrl = controllers[0];
                  var fcrCtrl = controllers[1];

                  $ngModelCtrl.$parsers.unshift(function (viewValue) {
                      return +new Date(viewValue)
                  });

                  $scope.$watch(
                      function () {
                          if (fcrCtrl.fcrForm) {
                              return fcrCtrl.fcrForm.datepicker
                          }
                      },
                      function () {
                          $("#datepicker").datepicker({
                              format: "DD, MM d, yyyy"
                          });
                          $($element).datepicker('setDate', new Date(Number.parseInt(fcrCtrl.fcrForm.datepicker)))
                      }
                  );
              }
          }
      });

      app.directive("autoComplete", ["$http", "AutocompleteFactory", function ($http, AutocompleteFactory) {

          return {
              restrict: 'AE',
              link: function ($scope, element) {
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
      }]);*/

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

        $httpBackend.whenGET('http://localhost:3001/customers/c').respond(function () {
            let filtredValue = ["all", "values", "c", "request"]
            return [200, filtredValue, {}]
        });

        $httpBackend.whenGET('http://localhost:3001/customers/d').respond(function () {
            let filtredValue = ["all", "values", "d", "request"]
            return [200, filtredValue, {}]
        });

        $httpBackend.whenGET('http://localhost:3001/customers').respond(function () {
            return [200, customers, {}];
        });

        $httpBackend.whenGET(/\.html$/).passThrough();

    });

})()
