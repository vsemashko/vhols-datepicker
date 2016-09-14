(function () {
    angular.module('vhols.rangepicker')
        .directive('vholsRangepickerContent', vholsRangePickerContent);

    vholsRangePickerContent.$inject = [];

    function vholsRangePickerContent() {
        return {
            restrict: 'E',
            link: link,
            scope: {
                initialFromDate: '=',
                initialToDate: '=',
                fromDate: '=fromDate',
                toDate: '=toDate',
                onComplete: '&'
            },
            controller: RangePickerController,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'components/rangepicker/content/rangepicker-content.html'
        }
    }

    function link(scope, element, attrs, vm) {
        vm.availableMonths = getAvailableMonthOptions();
        var selectedMonthIndex = getInitialMonthIndex(vm.initialFromDate, vm.availableMonths);
        vm.selectedMonth = vm.availableMonths[selectedMonthIndex];
        vm.nextMonth = moment(vm.selectedMonth).add(1, 'months').toDate();
    }

    RangePickerController.$inject = [];

    function RangePickerController() {
        var vm = this;
        vm.reselect = true;
        vm.selectDay = selectDay;
        vm.selectMonth = selectMonth;
        vm.selectNextMonth = selectNextMonth;
        vm.isLastMonthSelected = isLastMonthSelected;

        function selectDay(date) {
            if (!vm.fromDate) {
                vm.fromDate = date;
                vm.initialFromDate = null;
            } else {
                vm.toDate = date;
                setTimeout(function () {
                    vm.onComplete();
                }, 10);
            }
        }

        function selectMonth(month) {
            vm.selectedMonth = month;
            vm.nextMonth = moment(month).add(1, 'months').toDate();
        }

        function selectNextMonth() {
            var currentMonthIndex = getSelectedMonthIndex();
            selectMonth(vm.availableMonths[currentMonthIndex + 1]);
        }

        function isLastMonthSelected() {
            var currentMonthIndex = getSelectedMonthIndex();
            return vm.availableMonths.length === currentMonthIndex + 1;
        }

        function getSelectedMonthIndex() {
            return vm.availableMonths.indexOf(vm.selectedMonth);
        }
    }

    function getAvailableMonthOptions(monthsCount) {
        monthsCount = monthsCount || 12;
        var result = [];
        for (var i = 0, month; i < monthsCount; i++) {
            month = moment().add(i, 'months');
            result.push(month.toDate());
        }
        return result;
    }

    function getInitialMonthIndex(initialFromDate, availableMonths) {
        var result = 0;
        if (!initialFromDate) return result;

        var initialMonth = moment(initialFromDate);
        for (var i = 0, month; i < availableMonths.length; i++) {
            month = moment(availableMonths[i]);
            if (initialMonth.year() === month.year() && initialMonth.month() === month.month()) {
                result = i;
                break;
            }
        }
        return result;
    }

})();