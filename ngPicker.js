(function (window, document, undefined) {
	'use strict';
	angular.module('ngPicker', [
			'ngPicker.datepicker',
			'ngPicker.timepicker',
			'ngPicker.table'
		]);

	//Datepicker
	angular.module('ngPicker.datepicker', [])
	.directive('scDatepicker', function () {
		return {
			restrict : 'EA', //Sports, its in the game!
			scope : {
				ngModel : '=',
				dpDays : '=?',
				dpDaysAbbr : '=?',
				dpMonths : '=?',
				dpMonthsAbbr : '=?',
				todayText : '@?',
				okText : '@?',
				isDisabled : '@?',
				isRequired: '@?',
				dayLock : '@?',
				left: '='
			},
			templateUrl : './tpl/datepicker.html', //put the template in this folder...or change the path
			link : function (scope, element, attrs) {},
			controller : function ($scope, $animate, $window) {
				var mask = '00/00/0000';
				if($scope.dayLock){
					mask = $scope.dayLock > 9 ? $scope.dayLock + '/00/0000' : 'r' + $scope.dayLock + '/00/0000';				
				}
				$('#dateModelF').mask(mask, {
							translation:{
								'r':{
									pattern: /0/,
									fallback: '0'
								}
							},
							placeholder : 'dd/mm/yyyy'
						}
					);
				$scope.isDisabled = $scope.isDisabled || false;
				$scope.days = $scope.dpDays || ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado']; //En ingles[ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
				$scope.daysAbbr = $scope.dpDaysAbbr || ['D', 'L', 'M', 'Mi', 'J', 'V', 'S']; //En ingles [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];
				$scope.monthsAbbr = $scope.dpMonths || ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']; //En ingles [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];
				$scope.months = $scope.dpMonthsAbbr || ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']; //En ingles[ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
				
				
				$scope.selectedDate = $scope.ngModel ? new Date($scope.ngModel) : undefined;//|| new Date() : 
				$scope.calendar = [];
				$scope.open = false;
				//Returns which day is the first, which day is the last and also how many days the month have
				var monthInfo = function (date) {
					if(date)
						return {
							firstDay : new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
							lastDay : new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay(),
							totalOfDays : new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
						};
					else
						return undefined;
				};
				var setCalendar = function () {
					var date = $scope.selectedDate || new Date();
					var month = monthInfo(date);
					var calendar = [];
					for (var day = 1; day <= month.totalOfDays; ) {
						calendar.push([]);
						for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
							if ((day == 1 && dayOfWeek == month.firstDay) || day > 1 || ((day == month.totalOfDays && dayOfWeek == month.lastDay))) {
								var newDay = new Date(date);
								newDay.setDate(day);
								calendar[calendar.length - 1].push(newDay);
								day++;
							} else {
								calendar[calendar.length - 1].push('');
							}
						}
					}
					return calendar;
				};
				var areEqual = function (date_a, date_b) {
					var cDate_a = new Date(date_a);
					var cDate_b = new Date(date_b);
					if (cDate_a == '' || cDate_b == '')
						return false;
					return cDate_a.getFullYear() == cDate_b.getFullYear() && cDate_a.getMonth() == cDate_b.getMonth() && cDate_a.getDate() == cDate_b.getDate();
				};
				var dateToString = function (date) {
					if(date){
						var cDate = new Date(date);
						var dia = cDate.getDate();
						var mes = parseInt(cDate.getMonth()) + 1;
						var ano = cDate.getFullYear();
						var hora = cDate.getHours();
						var min = cDate.getMinutes();
						if (mes < 10) {
							mes = '0' + mes;
						}
						if (dia < 10) {
							dia = '0' + dia;
						}
						return mes + '/' + dia + '/' + ano;
					}
					else {
						return undefined;
					}
				};
				var fade = function (elm, type, fn) {
					var inOrOut = type == 'in' ? 'fadeIn' : type == 'out' ? 'fadeOut' : 'none';
					if (inOrOut == 'none')
						return;
					//$animate.removeClass($(elm), 'animated fadeIn');
					//$animate.removeClass($(elm), 'animated fadeOut');
					$animate.addClass($(elm), 'animated ' + inOrOut).then(function () {
						//this will still be called even if cancelled
						$animate.removeClass($(elm), 'animated ' + inOrOut);

						if (fn) {
							fn();
						}
					});
				};
				$scope.getStyle = function (day) {
					return areEqual($scope.selectedDate, day) ? 'dp-dateisselected' : areEqual(day, new Date()) ? 'dp-dateistoday' : 'dp-dateisnone';
				};
				$scope.opendp = function () {
					$scope.open = true;
					if ($scope.ngModelFixed) {
						var nDate = new Date($scope.ngModelFixed);
						/* 		if(nDate.getDate() != 1){
						nDate.setDate(1);
						nDate.setMonth(nDate.getMonth() + 1);
						}
						$scope.ngModelFixed = dateToString(nDate);
						 */
						$scope.selectedDate = nDate;
						$scope.calendar = setCalendar();
					} else if (!$scope.ngModel)
						$scope.selectedDate = angular.copy($scope.ngModel);
					//fade('#dp-date', 'in');
				};
				$scope.closedp = function () {
					//fade('#dp-date', 'out', function(){
					$scope.open = false;
					//});
				};
				$scope.toggledp = function () {
					if (!$scope.isDisabled) {
						if ($scope.open)
							$scope.closedp();
						else
							$scope.opendp();
					}
				};
				$scope.today = function () {
					$scope.selectedDate = new Date();
					$scope.calendar = setCalendar();
				};
				//Goes to the previous month or previous year depending on the view
				$scope.previousRange = function (type) {
					if (type == 'month') {
						$scope.selectedDate.setMonth($scope.selectedDate.getMonth() - 1);
					} else if (type == 'year') {
						$scope.selectedDate.setFullYear($scope.selectedDate.getFullYear() - 1);
					}
					$scope.calendar = setCalendar();
				};
				//Goes to the next month or next year depending on the view
				$scope.nextRange = function (type) {
					if (type == 'month') {
						$scope.selectedDate.setMonth($scope.selectedDate.getMonth() + 1);
					} else if (type == 'year') {
						$scope.selectedDate.setFullYear($scope.selectedDate.getFullYear() + 1);
					}
					$scope.calendar = setCalendar();
				};
				//It changes the view from day(full month), to month(each month in a year), to year(range of the +/- 5 years) and it goes back to date
				$scope.changeView = function () {};
				//Save the date to the model
				$scope.setDate = function (date) {
					//if (!date) {
					$scope.selectedDate = angular.copy(date);
					$scope.ngModel = angular.copy($scope.selectedDate);
					$scope.ngModelFixed = dateToString(angular.copy($scope.ngModel));
					//	$scope.closedp();
					//} else {
					//	$scope.selectedDate = angular.copy(date);
					//	}
				};
				$scope.isItDayLocked = function (day) {
					if ($scope.dayLock)
						return new Date(day).getDate() != $scope.dayLock;
					return false;
				};
				$scope.$watch('ngModel', function () {
					$scope.selectedDate = angular.copy($scope.ngModel);
					$scope.ngModelFixed = dateToString(angular.copy($scope.ngModel));
				}, true);
				$scope.$watch('ngModelFixed', function (value) {
					var fechaReg =  /^\d{2}\/\d{1,2}\/\d{4}$/;
					if (fechaReg.test(value)) {
						var nDate = new Date(value);
						$scope.selectedDate = angular.copy(nDate);
						$scope.ngModel = angular.copy(nDate);
					}
					else {
						$scope.ngModel = undefined;
					}
				}, true);
				//Implementation
				$scope.calendar = setCalendar();
				$scope.ngModelFixed = dateToString(angular.copy($scope.selectedDate));
			}
		}
	});

	//Timepicker
	angular.module('ngPicker.timepicker', [])
	.directive('timepicker', function () {
		return {
			restrict : 'EA', //Sports, its in the game!
			scope : {
				ngModel : '=',
				todayText : '=?',
				okText : '=?'
			},
			templateUrl : ./tpl/timepicker.html', //put the template in this folder...or change the path
			link : function ($scope, element) {},
			controller : function ($scope, $animate, $window) {
				$scope.selectedTime = $scope.ngModel ? new Date($scope.ngModel) : new Date();
				$scope.selectedPeriod = $scope.selectedTime.getHours() <= 12 ? 'AM' : 'PM';
				$scope.setHourByPeriod = function (period, hour) {
					var hours;
					if (period == 'AM') {
						hours = hour > 12 ? hour - 12 : hour;
					} else if (period == 'PM') {
						hours = hour <= 12 ? hour + 12 : hour;
					}
					if (hours == 24) {
						$scope.selectedPeriod = 'AM';
					}
					if (hours == 12) {
						$scope.selectedPeriod = 'PM';
					}
					return hours;
				};
				$scope.getPeriodHour = function (hour) {
					if (hour > 12)
						return hour - 12;
					if (hour == 0)
						return 12;
					return hour;
				}
				$scope.selectPeriod = function (period) {
					$scope.selectedPeriod = period;
					$scope.selectedTime.setHours($scope.setHourByPeriod(period, $scope.selectedTime.getHours()));
				};
				$scope.selectHour = function (hour) {
					$scope.selectedTime.setHours($scope.setHourByPeriod($scope.selectedPeriod, hour));
				};
				$scope.toggledp = function () {
					$scope.open = !$scope.open;
				};
				$scope.today = function () {
					$scope.selectedTime = new Date();
				};
				$scope.$watch('selectedTime', function (value) {
				}, true);
			}
		}
	});

})(window, document);
