sap.ui.define([
	"com/meir/meirordersmobile/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.meir.meirordersmobile.controller.MOHome", {

		onInit: function () {
			this.fetchUserCardentails();
			this.getView().addEventDelegate({
			    onBeforeShow: jQuery.proxy(function(oEvent) {
			        this.onBeforeShow(oEvent);
			    }, this)
			});
		},
		
		onBeforeShow: function(){
			this.getActivitySet();
		},


		onNewActivityButtonPress: function (sProcessType) {
			debugger;
			var moModel = this.getOwnerComponent().getModel("moModel");
			moModel.oData.ProcessType = sProcessType;
			moModel.setData(moModel.oData);
			this.getRouter().navTo("MOCustomers");
		},
		
	
		onListItemPress: function (oEvent) {
			var oCurrentActivityDetails = oEvent.getSource().data("activityDetails");
			var sGuid = oCurrentActivityDetails.Guid;
			this.getView().setBusy(true);
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
			var sEntitySet = "/ActivitySet(guid'" + sGuid + "')";
			oModel.read(sEntitySet, {
				// filters: aFilters,
				success: function (oData) {
					var moModel = that.getOwnerComponent().getModel("moModel");
					moModel.setProperty("/MONewActivityDetails/currentActivityDetails", oData);
					
					that.getView().setBusy(false);
					that.getRouter().navTo("MONewActivityDetails");
				},
				error: function (oError) {
					that.getView().setBusy(false);
				}
			});
		},

		/** 
		 * get user name from BE
		 */
		fetchUserCardentails: function () {
			this.getView().setBusy(true);
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
			oModel.read("/UserBPDataSet", {
				success: function (oData) {
					var moModel = that.getOwnerComponent().getModel("moModel");
					moModel.setProperty("/MOHome/UserBPDataSet", oData.results);
					that.getView().setBusy(false);
				},
				error: function (oError) {
					that.getView().setBusy(false);
				}
			});
		},

		/** 
		 * get ActivitySet from BE
		 */
		getActivitySet: function () {
			this.getView().setBusy(true);
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
			oModel.read("/ActivitySet", {
				// filters: aFilters,
				success: function (oData) {
					var oMainTableModel = that.getOwnerComponent().getModel("moModel");
					oMainTableModel.setProperty("/MOHome/ActivitySet", oData.results);
					that.filterByDate();
					that.getView().setBusy(false);
				},
				error: function (oError) {
					that.getView().setBusy(false);
				}
			});
		},

		/** 
		 * filter the list by  date
		 * @param oEvent
		 */
		filterByDate: function (oEvent) {
			var day;
			if (oEvent)
				day = oEvent.getParameters().key;
			else
				day = "nextDays";
			var aFilters = [],
				currentDate = new Date();
			switch (day) {
			case "nextDays":
				aFilters.push(new sap.ui.model.Filter("Date", "GE", new Date()));
				break;
			case "2DayAgo":
				currentDate.setDate(currentDate.getDate() - 2);
				aFilters.push(new sap.ui.model.Filter("Date", "BT", currentDate, new Date()));
				break;
			case "weekAgo":
				currentDate.setDate(currentDate.getDate() - 7);
				aFilters.push(new sap.ui.model.Filter("Date", "BT", currentDate, new Date()));
				break;
			case "2weeksAgo":
				currentDate.setDate(currentDate.getDate() - 14);
				aFilters.push(new sap.ui.model.Filter("Date", "BT", currentDate, new Date()));
				break;
			}
			var oList = this.byId("callsList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters);
		},

	});

});