sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/meir/meirordersmobile/js/formatter",
	"com/meir/meirordersmobile/model/models",
	"com/meir/meirordersmobile/js/error/Error",
], function (Controller, Formatter, Models, Error) {
	"use strict";
	return Controller.extend("com.meir.meirordersmobile.controller.BaseController", {
		formatter: Formatter,
		models: Models,
		error: Error,
		//useful function definitions

		setGlobalModel: function (oModel, sName) {
			this.getOwnerComponent().setModel(oModel, sName);
		},

		getGlobalModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		setViewModel: function (oModel, sName) {
			this.getView().setModel(oModel, sName);
		},

		getViewModel: function (sName) {
			return this.getView().getModel(sName);
		},

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		onSAPLogoutPress: function (oEvent) {
			$.ajax({
				type: "GET",
				url: "/sap/public/bc/icf/logoff", //Clear SSO cookies: SAP Provided service to do that
			}).done(function (data) {
				//Now clear the authentication header stored in the browser
				if (!document.execCommand("ClearAuthenticationCache")) {
					//"ClearAuthenticationCache" will work only for IE. Below code for other browsers

					$.ajax({
						type: "GET",
						url: "/sap/bc/ui2/start_up", //any URL to a Gateway service
						username: 'dummy', //dummy credentials: when request fails, will clear the authentication header
						password: 'dummy',
						statusCode: {
							401: function () {
								//This empty handler function will prevent authentication pop-up in chrome/firefox
								this.getRouter().navTo("MeirLogout");
								console.log("logged out");
							}
						},
						error: function () {
							//alert('reached error of wrong username password')
						}
					}.bind(this));

				}
			});

		},

		onNavHome: function () {
			this.getRouter().navTo("Home");
		},

	});
});