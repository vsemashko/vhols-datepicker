(function () {
    angular.module('vhols.rangepicker')
        .directive('vholsRangepicker', vholsRangePicker);

    vholsRangePicker.$inject = ['$uibModal'];

    function vholsRangePicker($uibModal) {
        return {
            restrict: 'A',
            scope: {
                fromDate: '=',
                toDate: '='
            },
            link: link
        };

        function link(scope, element, attrs) {
            element.bind('click', function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'components/rangepicker/rangepicker-modal.html',
                    controller: 'RangePickerModalController',
                    controllerAs: 'modal',
                    resolve: {
                        fromDate: function () {
                            return scope.fromDate;
                        },
                        toDate: function () {
                            return scope.toDate;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    scope.fromDate = result.fromDate;
                    scope.toDate = result.toDate;
                });
            });
        }
    }

})();