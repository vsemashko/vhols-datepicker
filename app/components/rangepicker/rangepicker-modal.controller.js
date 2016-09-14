(function () {
    angular.module('vhols.rangepicker')
        .controller('RangePickerModalController', RangePickerModalController);

    RangePickerModalController.$inject = ['$uibModalInstance', 'fromDate', 'toDate'];

    function RangePickerModalController($uibModalInstance, fromDate, toDate) {
        var modal = this;
        modal.initialFromDate = fromDate;
        modal.initialToDate = toDate;
        modal.fromDate = null;
        modal.toDate = null;
        modal.isReselect = modal.initialFromDate ? true : false;

        modal.ok = ok;
        modal.cancel = cancel;

        ////////////////////////////

        function ok() {
            var result = {
                fromDate: modal.fromDate || modal.initialFromDate,
                toDate: modal.toDate || modal.initialToDate
            };
            $uibModalInstance.close(result);
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }

})();