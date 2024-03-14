sap.ui.define([], function () {
	"use strict";
	return {
		formatDisplayDate: function (oDate) {
			if (!oDate) {
				return "- -";
			}
			if (oDate instanceof Date) {
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				var oDateFormat;
				oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd/MM/yy"
				});
				// }

				return oDateFormat.format(oDate);
			} else {
				return oDate;
			}

		},
		formatDotDate: function (oDate) {
			if (!oDate) {
				return "- -";
			}
			if (oDate instanceof Date) {
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				var oDateFormat;
				oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd.MM.yy"
				});
				// }

				return oDateFormat.format(oDate);
			} else {
				return oDate;
			}

		},

		formatMillisecondsToTime: function (nMilliseconds) {
			if (nMilliseconds) {
				var date = new Date(nMilliseconds.ms);
				var timeinmiliseconds = date.getTime(); //date.getTime(); //date.getSeconds();
				var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "HH:mm"
				});
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
				// console.log(TZOffsetMs);
				var timeStr = oTimeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
				// console.log(timeStr);
				if (timeStr)
					return timeStr;
				else
					return nMilliseconds;
			} else {
				return "- -";

			}
		},

		formatMillisecondsToDate: function (nMilliseconds) {
			if (!nMilliseconds) {
				return nMilliseconds;
			}
			if (nMilliseconds) {
				var oDate = new Date(nMilliseconds);
				// var oDate = date.toLocaleDateString();
				if (oDate instanceof Date) {
					jQuery.sap.require("sap.ui.core.format.DateFormat");
					var oDateFormat;
					oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "dd/MM/yy"
					});
					// }

					return oDateFormat.format(oDate);
				} else {
					return oDate;
				}

			}
		}

	};
});