(function () {
    const app = angular.module("app", ["ngMockE2E", "ngResource"]);

    app.component("compTest", {
        controller: "compCtrl",
    })

    app.controller("compCtrl", function () {
        var vm = this

        vm.info = "some info"
    })

    app.component("testComponent", {
        /*require: {
            ctrl: "compTest"
        },*/
        controller: "testCtrl",
        controllerAs: "vm",
        template: "<input ng-model='vm.obj.name'>{{vm.ctrl.info}}</input>",
        /* require: "ngModel",*/

    })
    app.controller("testCtrl", function () {
        var vm = this

        vm.obj = {
            name: "sss",
            surname: "ddd"
        }
        vm.$onInit = function () {
            debugger;
        };
    })


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
