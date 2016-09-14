(function () {
    angular.module('vhols.rangepicker')
        .directive('vholsDatepicker', vholsDatepicker);

    vholsDatepicker.$inject = [];

    function vholsDatepicker() {
        return {
            scope: {
                initialFromDate: '=',
                initialToDate: '=',
                fromDate: '=',
                toDate: '=',
                month: '='
            },
            restrict: 'E',
            link: link,
            require: '^vholsRangepickerContent',
            templateUrl: 'components/rangepicker/content/datepicker/datepicker.html'
        }
    }

    function link(scope, element, attrs, controller) {
        controller.hoverDay = null;
        scope.selectedMonthWeeks = getWeeksArray(moment(scope.month));
        scope.isBeforeMinDate = isBeforeMinDate;
        scope.isSelectedDate = isSelectedDate;
        scope.isBetween = isBetween;
        scope.selectDay = selectDay;
        scope.onMouseOver = onMouseOver;
        scope.onMouseLeave = onMouseLeave;

        scope.$watch('month', function (month) {
            scope.selectedMonthWeeks = getWeeksArray(moment(month));
        });

        function isBeforeMinDate(date) {
            return !date || isBeforeFromDate(date) || isBeforeToday(date);
        }

        function isSelectedDate(date) {
            return isEqualDate(date, scope.fromDate)
                || isEqualDate(date, scope.toDate)
                || isEqualDate(date, scope.initialFromDate)
                || isEqualDate(date, scope.initialToDate);
        }

        function isBetween(date) {
            if (!date) return false;
            return isBetweenFromToDate(date) || isBetweenHoverDate(date) || isBetweenInitialDates(date);
        }

        function isBetweenFromToDate(date) {
            if (!scope.fromDate || !scope.toDate) return false;
            return moment(date).isAfter(scope.fromDate) && moment(date).isBefore(scope.toDate);
        }

        function isBetweenHoverDate(date) {
            if (!scope.fromDate) return false;
            return moment(date).isAfter(scope.fromDate) && moment(date).isBefore(controller.hoverDay);
        }

        function isBetweenInitialDates(date) {
            if (!scope.initialFromDate || !scope.initialToDate) return false;
            return moment(date).isAfter(scope.initialFromDate) && moment(date).isBefore(scope.initialToDate);
        }

        function selectDay(day) {
            if (isBeforeMinDate(day)) return;
            controller.selectDay(day);
        }

        function onMouseOver(day) {
            controller.hoverDay = day ? day : null;
        }

        function onMouseLeave() {
            controller.hoverDay = null;
        }

        function isBeforeFromDate(date) {
            return scope.fromDate && moment(date).isBefore(scope.fromDate);
        }

        function isBeforeToday(date) {
            return moment(date).isBefore(moment().subtract(1, 'day'));
        }
    }

    function getWeeksArray(momentMonth) {
        var year = momentMonth.year();
        var month = momentMonth.month();
        var date = new Date(year, month, 1);
        var result = [];

        var week = getWeekWithOffset(date);

        while (isDateBelongsToMonth(date, month)) {
            do {
                week.push(new Date(date));
                date.setDate(date.getDate() + 1);
            } while (!isMonday(date) && isDateBelongsToMonth(date, month));

            if (week.length < 7) {
                var i = fillWeekWithEmptyDays(week, (7 - week.length));
            }

            result.push(week);
            week = [];
        }
        return result;
    }

    function getWeekWithOffset(date) {
        var result = [];
        var dayOfWeek = getDayOfWeek(date);
        if (dayOfWeek > 1) {
            fillWeekWithEmptyDays(result, dayOfWeek - 1)
        }
        return result;
    }

    function fillWeekWithEmptyDays(week, emptyDaysNum) {
        for (var i = 0; i < emptyDaysNum; i++) {
            week.push('');
        }
        return i;
    }

    /**
     * @param date {Date} to determine day of week
     * @returns {number} Day of week starting from monday (1) to sunday (7)
     */
    function getDayOfWeek(date) {
        return date.getDay() === 0 ? 7 : date.getDay();
    }

    function isMonday(date) {
        return getDayOfWeek(date) === 1;
    }

    function isDateBelongsToMonth(date, month) {
        return date.getMonth() === month;
    }

    function isEqualDate(firstDate, secondDate) {
        if (!firstDate || !secondDate) return false;

        return firstDate.getTime() === secondDate.getTime();
    }

})();