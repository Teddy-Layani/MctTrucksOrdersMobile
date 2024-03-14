sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		//Makes a GET call to the back end with given parameters
		//This is the only one point of BE calls to GET data
		doRead: function (oController, sEntitySet, mParams, bBusy, sModelName) {
			var oODataModel = oController.getOwnerComponent().getModel(sModelName);
			var bScreenBusy = bBusy ? true : false;
			oController.getView().setBusy(bScreenBusy);
			if(!mParams.error){
				mParams.error = function(oError){
					oController.getView().setBusy(false);
					oController.error.processConnectionError(oError, oController);
				};
			}
			oODataModel.read(sEntitySet, mParams);
		},

		//Makes a POST call to the back end with given parameters
		//This is the only one point of BE calls to SEND data
		doCreate: function (oController, sEntitySet, oPayload, mParams, bBusy,sModelName) {
			var oODataModel = oController.getOwnerComponent().getModel(sModelName);
			var bScreenBusy = bBusy ? true : false;
			oController.getView().setBusy(bScreenBusy);
			if(!mParams.error){
				mParams.error = function(oError){
					oController.getView().setBusy(false);
					oController.error.processConnectionError(oError, oController);
				};
			}
			oODataModel.create(sEntitySet, oPayload, mParams);
		}

	};
});