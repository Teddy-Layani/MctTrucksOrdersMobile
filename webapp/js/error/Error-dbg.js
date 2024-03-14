/*
File for processing and displaying errors
*/

sap.ui.define([

], function () {

	"use strict";
	return {

		/** 
		 * opens popup set model to the popup with the error prams
		 * 
		 * @param oResponse 
		 * the object of the call response:
		 * ...
		 * success: function(oData, oResponse)...
		 * ...
		 * @param oController
		 * the controller of the view that runs the function
		 * @param sErrorMessage
		 * if error came from direct binding
		 * @returns
		 * true for counting the fun witout error
		 * false for stoping the fun and open error
		 */
		processSystemError: function (oResponse, oController, sErrorMessage) {
			if(!sap.ui.getCore().oLoansSalesContext){
				sap.ui.getCore().oLoansSalesContext = {};
			}
			
			//this check will prevent popup to appear several times if there are several errors occured
			if (sap.ui.getCore().oLoansSalesContext.oErrorDialog && sap.ui.getCore().oLoansSalesContext.oErrorDialog.isOpen()) {
				return;
			}

			if (!sap.ui.getCore().oLoansSalesContext.oErrorDialog) {
				sap.ui.getCore().oLoansSalesContext.oErrorDialog = oController.error.getDialog(oController);;
				oController.getView().addDependent(sap.ui.getCore().oLoansSalesContext.oErrorDialog);
			}
			var oData;

			//if sap-message header holds JSON structure
			if (oResponse && oResponse.headers["sap-message"] && oResponse.headers["sap-message"].indexOf('"severity":"error"') > -1) {
				var oError = JSON.parse(oResponse.headers["sap-message"]);
				oData = {
					message: oError.message,
					type: oError.severity,
					bShowDetails: false
				};

			} else
			//if sap-message header holds XML structure
			if (oResponse && oResponse.headers["sap-message"] && oResponse.headers["sap-message"].indexOf("<severity>error</severity>") > -1) {
				var oXMLModel = new sap.ui.model.xml.XMLModel();
				oXMLModel.setXML(oResponse.headers["sap-message"]);
				var sMessage = oXMLModel.getProperty("/message");
				oData = {
					responseText: sMessage,
					type: "error",
					bShowDetails: false
				};
			} else

			//if error comes from direct binding call
			if (sErrorMessage) {
				oData = {
					responseText: sErrorMessage,
					type: "error",
					bShowDetails: false
				};
			} else {
				oData = {
					responseText: "",
					type: "info",
					bShowDetails: false
				};
			}

			if (oData) {
				sap.ui.getCore().oLoansSalesContext.oErrorDialog.setModel(new sap.ui.model.json.JSONModel(oData), "errorModel");
			}

			oController.getView().setBusy(false);
			if (oData.type !== "info") {
				sap.ui.getCore().oLoansSalesContext.oErrorDialog.open();
				return true;
			} else {
				return false;
			}
		},
		
		/** 
		 * 
		 * @param oError
		 * the error call object
		 * @param oController
		 *  the controller of the view that open the fun
		 * @Do
		 * open popup set model to the popup with the error prams
		 */
		processConnectionError: function (oError, oController) {
			if(!sap.ui.getCore().oLoansSalesContext){
				sap.ui.getCore().oLoansSalesContext = {};
			}
			
			
			//this check will prevent popup to appear several times if there are several errors occured
			if (sap.ui.getCore().oLoansSalesContext.oErrorDialog && sap.ui.getCore().oLoansSalesContext.oErrorDialog.isOpen()) {
				return;
			}
			if (!sap.ui.getCore().oLoansSalesContext.oErrorDialog) {
				// sap.ui.getCore().oLoansSalesContext.oErrorDialog = sap.ui.xmlfragment("com/samelet/loansSales/LoansSales/js/error/Error", oController);
				sap.ui.getCore().oLoansSalesContext.oErrorDialog = oController.error.getDialog(oController);
				// sap.ui.getCore().oLoansSalesContext.oErrorDialog = this.error.getDialog(oController);
			}
			try{
				var oParsedError = JSON.parse(oError.responseText);
			}catch(e){
				var oParsedError = {};
			}
			
			var sResponseText = "";
			try{
				sResponseText = oParsedError.error.message.value;
			}catch(e){
				sResponseText = "";
			}
			
			var oData = {
				responseText: sResponseText,
				fullResponse: oError.responseText,
				message: oError.message,
				status: oError.statusCode,
				type: "Error",
				bShowDetails: false
			};
			oController.getView().setBusy(false);
			var json = new sap.ui.model.json.JSONModel(oData);
			sap.ui.getCore().oLoansSalesContext.oErrorDialog.setModel(json, "errorModel");
			sap.ui.getCore().oLoansSalesContext.oErrorDialog.setModel(oController.getOwnerComponent().getModel("i18n"), "i18n");
			sap.ui.getCore().oLoansSalesContext.oErrorDialog.open();

		},
		
		getDialog: function(oController){
		
			var oElement1 = new sap.m.HBox({
				items: [
					new sap.m.Label({ text: "{i18n>connectionErrorTitle}"}).addStyleClass("font-1d5rem margin-bottom-20")
				]	
			});                            
			var oElement2 = new sap.m.VBox({
				items: [
					new sap.m.FormattedText({ 
						// htmlText: "<p><strong>{errorModel>/responseText}</p></strong>",
							htmlText: "<h2><strong>{errorModel>/responseText}</strong></h2>",
						visible: "{=${errorModel>/responseText} ? true : false}"
					}).addStyleClass(" margin-bottom-20"),
					new sap.m.Link({ 
						text: "{=${errorModel>/bShowDetails} ? ${i18n>hideDetails} : ${i18n>showDetails}}",
						press: [oController.error.onSeeErrorDetailsPress, oController],
						visible: "{=${errorModel>/responseText} ? true : false}"
					})
				]	
			});   
			
			var oElement3 = new sap.m.HBox({
				justifyContent: "End",
				items: [
					new sap.m.Button({ 
						text: "{i18n>close}",
						press: [oController.error.closeErrorDialog, oController]
					}).addStyleClass("sapUiSmallMarginBeginEnd nextBTN")
					
					
				]	
			}).addStyleClass("justContentCenter");    
	
			var oElement4 = new sap.m.HBox({
				renderType: sap.m.FlexRendertype.Bare,
				items: [
					new sap.m.TextArea({ 
						visible: "{=${errorModel>/bShowDetails} ? true : false}",
						value: "{errorModel>/fullResponse}",
						enabled: false,
						width: "450px",
						rows: 4,
						press: [oController.error.onSeeErrorDetailsPress, oController]
					}).addStyleClass("sapUiSmallMarginBeginEnd")
			
				]	
			}).addStyleClass("margin-auto");    
			
			var oOuterVBox = new sap.m.VBox({
				width: "100%",
				items: [
					oElement1, oElement2, oElement4, oElement3
				]
			}).addStyleClass("content-padding");

			var oDialog = new sap.m.Dialog({
				showHeader: false,
				contentWidth: "500px",
				content: [
					oOuterVBox
				]
			}).addStyleClass("errorDialog jobsPage");
			
			return oDialog;
		},
		
		onSeeErrorDetailsPress: function(oEvent){
			var bShowDetails = sap.ui.getCore().oLoansSalesContext.oErrorDialog.getModel("errorModel").getProperty("/bShowDetails");
			sap.ui.getCore().oLoansSalesContext.oErrorDialog.getModel("errorModel").setProperty("/bShowDetails", !bShowDetails);
			
		},
		
		/** 
		 * close the error popUp
		 */
		closeErrorDialog: function () {
			if (sap.ui.getCore().oLoansSalesContext.oErrorDialog) {
				sap.ui.getCore().oLoansSalesContext.oErrorDialog.close();
				sap.ui.getCore().oLoansSalesContext.oErrorDialog.destroy(true);
				sap.ui.getCore().oLoansSalesContext.oErrorDialog = undefined;
			}
		},
		

		closeDelegayeErrorPopUp: function () {
			if (sap.ui.getCore().GoDelegayeError) {
				sap.ui.getCore().GoDelegayeError.close();
				sap.ui.getCore().GoDelegayeError.destroy(true);
				sap.ui.getCore().GoDelegayeError = undefined;
			}
		},

		/** 
		 * Yuri
		 * runs when direct binding calls are completed.
		 * if a call has sap-message header, analyzes the header for errors
		 * event is defined in Component.js
		 * @param sChannel
		 * @param sEvent
		 * @param oEvent
		 * @returns - if no errors were found
		 */
		onRequestCompleted: function (sChannel, sEvent, oEvent) {
			var oResponseHeaders = oEvent.getParameter("response").headers;
			if (oResponseHeaders["sap-message"] && oResponseHeaders["sap-message"].indexOf("<severity>error</severity>") > -1) {
				// console.log("Error.js -> onRequestCompleted", oEvent, "  ===|===  params: ", oEvent.getParameters());
				var sErrorMessage = this.CustomError.getSapMessage(oResponseHeaders["sap-message"]);
				this.CustomError.successWithError(null, this, sErrorMessage);
			} else {
				return;
			}

		},

		/** 
		 * Yuri
		 * gets the content of error message
		 * @param sXml - xml content in string format
		 * @returns - error message
		 */
		getSapMessage: function (sXml) {
			var oXMLModel = new sap.ui.model.xml.XMLModel();
			oXMLModel.setXML(sXml);
			return oXMLModel.getProperty("/message");
		}


	};
});