sap.ui.define([
	"com/meir/meirordersmobile/controller/BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("com.meir.meirordersmobile.controller.MOCustomers", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("MOCustomers").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			var oSearchField = this.getView().byId("searchCustomer");
			var sSearchValue = oSearchField.getValue();
			if (sSearchValue !== "") {
				oSearchField.setValue("");
				var oList = this.getView().byId("customerList");
				oList.setVisible(false);
			}
		},

		/** 
		 * search (liveChange) customer at BE
		 * @param oEvent
		 */
		onClientliveChange: function (oEvent) {
			var sValue = oEvent.getParameter("newValue");

			if (sValue.length >= 4) {
				var aFilter = [new sap.ui.model.Filter("Search", "EQ", sValue)];
				var oList = this.getView().byId("customerList");
				var oBinding = oList.getBinding("items");
				oBinding.filter(aFilter);
				oList.setVisible(true);
			}
		},

		/** 
		 * save selected customer details in model and naviget to next view
		 * @param oEvent 
		 */
		onPressCustomer: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext().getPath();
			var oCustomerData = this.getOwnerComponent().getModel().getProperty(sPath);
			this.getOwnerComponent().getModel("moModel").setProperty("/MOCustomers/CustomerObject", oCustomerData);
			var oRouter = this.getRouter();
			oRouter.navTo("MOCreateNewActivity");
		},

		/** 
		 * naviget to previous view
		 */
		onNavigatePressReturn: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("overview", true);
			}
		}

	});

});