sap.ui.define([
	"com/meir/meirordersmobile/controller/BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("com.meir.meirordersmobile.controller.MOCreateNewActivity", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("MOCreateNewActivity").attachPatternMatched(this._onRouteMatched, this);

			var oModel = new sap.ui.model.json.JSONModel([]);
			this.getOwnerComponent().setModel(oModel, "newActivitySetting");

		},

		_onRouteMatched: function (oEvent) {
			this.getView().getModel("newActivitySetting").setProperty("/", []);
			this.getOpportunitySet();
		},

		/** 
		 * back the last page
		 */
		onNavigatePressReturn: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}

		},


		/** 
		 * @param oEvent from selection
		 * save the data of currrent line in newActivitySetting model
		 */
		selectOpportunity: function (oEvent) {
			var oMoModel = this.getOwnerComponent().getModel("moModel");
			var sPath = oEvent.getSource().getSelectedContextPaths();
			var VechileModel = oMoModel.getProperty(sPath + "/VechileModel");
			var StatusDesc = oMoModel.getProperty(sPath + "/StatusDesc");
			var CreateDate = oMoModel.getProperty(sPath + "/CreateDate");
			var OppObjectId = oMoModel.getProperty(sPath + "/ObjectId");
			var sGuid = oMoModel.getProperty(sPath + "/Guid");

			this.getView().getModel("newActivitySetting").setProperty("/OppObjectId", OppObjectId);
			this.getView().getModel("newActivitySetting").setProperty("/VechileModel", VechileModel);
			this.getView().getModel("newActivitySetting").setProperty("/StatusDesc", StatusDesc);
			this.getView().getModel("newActivitySetting").setProperty("/CreateDate", CreateDate);
			this.getView().getModel("newActivitySetting").setProperty("/OppGuid", sGuid);

		},

		/** 
		 * get OpportunitySet from BE
		 */
		getOpportunitySet: function () {
			this.getView().setBusy(true);
			var oModel = this.getOwnerComponent().getModel();
			var aFilters = [];
			var that = this;
			//TODO-hard coding
			// aFilters.push(new sap.ui.model.Filter("Partner", "EQ", "1005866"));
			var partner = this.getOwnerComponent().getModel("moModel").getProperty("/MOCustomers/CustomerObject/Partner");
			aFilters.push(new sap.ui.model.Filter("Partner", "EQ", partner));
			oModel.read("/OpportunitySet", {
				filters: aFilters,
				success: function (oData) {
					var oMoModel = that.getOwnerComponent().getModel("moModel");
					oMoModel.setProperty("/MOCreateNewActivity/OpportunitySet", oData.results);
					that.getView().setBusy(false);
				},
				error: function (oError) {
					that.getView().setBusy(false);
				}
			});
		},

		/** 
		 * nav to MONewActivityDetails page
		 */
		onPressGoNext: function () {
			var oNewActivitySetting = this.getView().getModel("newActivitySetting");
			var NameFirst = this.getOwnerComponent().getModel("moModel").getProperty("/MOCustomers/CustomerObject/NameFirst");
			var NameLast = this.getOwnerComponent().getModel("moModel").getProperty("/MOCustomers/CustomerObject/NameLast");
			var sPartner = this.getOwnerComponent().getModel("moModel").getProperty("/MOCustomers/CustomerObject/Partner");
			debugger;
			var date = oNewActivitySetting.getData().PostingDate;
			var aDate = date.split(".");
			aDate.length > 1 ? aDate : date.split("/");
			var nDay = Number(aDate[0]);
			var nMonth = Number(aDate[1]) - 1;
			var nYear = Number(aDate[2]);
			var dUTCDate = Date.UTC(nYear, nMonth, nDay);
			var dBeDate = new Date(dUTCDate);
			
		

			
			var sNewCall = this.getOwnerComponent().getModel("i18n").getProperty("newCall");
			var sDescription = sNewCall + " " + NameFirst + " " + NameLast;

			oNewActivitySetting.setProperty("/Description", sDescription);
			oNewActivitySetting.setProperty("/Date", dBeDate);
			oNewActivitySetting.setProperty("/Partner", sPartner);
			oNewActivitySetting.setProperty("/NameFirst", NameFirst);
			oNewActivitySetting.setProperty("/NameLast", NameLast);
			this.getOwnerComponent().getModel("moModel").setProperty("/MONewActivityDetails/currentActivityDetails", oNewActivitySetting.getData());
			this.getRouter().navTo("MONewActivityDetails");

			this.getView().byId("listOpp").removeSelections(true);
		},
	});

});