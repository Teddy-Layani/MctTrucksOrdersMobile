sap.ui.define([
	"com/meir/meirordersmobile/controller/BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("com.meir.meirordersmobile.controller.MONewActivityDetails", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("MONewActivityDetails").attachPatternMatched(this._onRouteMatched, this);
		},

		// get from: "/MONewActivityDetails/currentActivityDetails"
		// currentActivityDetails
		// Comments: ""
		// Date: "/Date(1649980800000)/"
		// Description: "����� -  �������� ���� ����� ��\"�"
		// Detailexists: "X"
		// Guid: "0004AC1B-F7FE-A7DE-88F3-312A1400636C"
		// GuidChar: "0004AC1BF7FEA7DE88F3312A1400636C%"
		// Message: ""
		// ObjectId: "605231"
		// ObjectType: "BUS2000126"
		// OppGuid: null
		// OppObjectId: ""
		// Partner: ""
		// PartnerOwner: ""
		// ProcessType: "ZAPT"
		// Status: "E0010"
		// StatusDesc: "����"
		// Time: "PT08H00M00S"
		// Username: ""
		// VechileModel: ""

		_onRouteMatched: function () {
            debugger;
			var moModel = this.getOwnerComponent().getModel("moModel");
			this.ObjectId = moModel.getProperty("/MONewActivityDetails/currentActivityDetails/ObjectId");
			this.ObjectType = moModel.getProperty("/MONewActivityDetails/currentActivityDetails/ObjectType");
			debugger;
			this.sProcessType = moModel.oData.ProcessType;
			this.sGuid = moModel.getProperty("/MONewActivityDetails/currentActivityDetails/Guid");

			if (this.ObjectId && this.ObjectType) {
				this.getCurrentAttachments();
			}

			// "ZPCT" - Phone call  "ZAPT" - Appointment
			this.sProcessType = this.sProcessType ? this.sProcessType : "ZPCT";
			moModel.setProperty("/MONewActivityDetails/currentActivityDetails/ProcessType", this.sProcessType);

			var sActivityStatus = moModel.getProperty("/MONewActivityDetails/currentActivityDetails/ActivityStatus");
			sActivityStatus = sActivityStatus ? sActivityStatus : "E0010";
			moModel.setProperty("/MONewActivityDetails/currentActivityDetails/ActivityStatus", sActivityStatus);
			this.getActivityStatus(this.sProcessType, this.sGuid);
		},

		// ===============================================================
		// /sap/opu/odata/sap/ZSALES_TRUCKS_SRV/ProcessTypeStatusSet?$filter=(Guid eq guid'0004ac1b-f7fe-a6d3-9d89-e6bba000236c')

		getActivityStatus: function (sProcessType, sGuid) {
			this.getView().setBusy(true);
			var aFilters = [];
			if (sGuid) {
				aFilters.push(new sap.ui.model.Filter("Guid", "EQ", sGuid));
			} else {
				aFilters.push(new sap.ui.model.Filter("ProcessType", "EQ", sProcessType));
			}

			var that = this;
			var oParams = {
				filters: aFilters,
				success: function (oData) {
					var oMainTableModel = that.getOwnerComponent().getModel("moModel");
					oMainTableModel.setProperty("/MONewActivityDetails/currentActivityDetails/ActivityStatusOptions", oData.results);
					that.getView().setBusy(false);
				},
				error: function (oError) {
					that.getView().setBusy(false);
					that.error.processConnectionError(oError, that);
				}
			};
			this.models.doRead(this, "/ProcessTypeStatusSet", oParams, true);
		},

		onStatusOppChange: function (oEvent) {
			var sActivityStatus = oEvent.getSource().getSelectedKey();
			var moModel = this.getOwnerComponent().getModel("moModel");
			moModel.setProperty("/MONewActivityDetails/currentActivityDetails/ActivityStatus", sActivityStatus);
		},

		// ============================================================================

		/** 
		 * get exist Activity Entity
		 */
		getActivityEntity: function () {
			this.getView().setBusy(true);
			var oModel = this.getOwnerComponent().getModel();
			var that = this;
			var sEntitySet = "/ActivitySet(guid'" + this.Guid + "')";
			oModel.read(sEntitySet, {
				success: function (oData) {
					var oMainTableModel = that.getOwnerComponent().getModel("moModel");
					oMainTableModel.setProperty("/MONewActivityDetails/currentActivityDetails", oData.results);
					that.getView().setBusy(false);
				},
				error: function (oError) {
					that.getView().setBusy(false);
				}
			});
		},

		/** 
		 * get current Attachments for current Activity 
		 */
		getCurrentAttachments: function () {
			var aFilters = [
				new sap.ui.model.Filter("ObjectId", "EQ", this.ObjectId),
				new sap.ui.model.Filter("ObjectType", "EQ", this.ObjectType)
			];
			var that = this;
			var oParams = {
				filters: aFilters,
				success: function (oData) {
					var oMainTableModel = that.getOwnerComponent().getModel("moModel");
					oMainTableModel.setProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet", oData.results);
					that.getView().setBusy(false);
				}
			};
			// (oController, sEntitySet, mParams, bBusy, sModelName
			this.models.doRead(this, "/AttachmentSet", oParams, true);
		},

		/** 
		 * match between Attachment to icon 1-image 2-voice 99- other
		 */
		getIconType: function (oData) {
			if (oData === "1") {
				return "css/icons/imageIcon.svg";
			} else if (oData === "2") {
				return "css/icons/music_note_black.svg";
			}
			return "css/icons/article_black_icon.svg";
		},

		/** 
		 * match between Attachment type to code 1-image 2-voice 99- other
		 */
		getAttachmentType: function (sFileEnd) {
			var fileTtypesImgArr = ["JPG", "JPEG", "jpeg", "jpg", "PNG", "png"];
			if (fileTtypesImgArr.includes(sFileEnd)) {
				return "1";
			}
			return "99";
		},

		/** 
		 * naviget to previous view
		 */
		onNavigatePressReturn: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("overview", true);
			}
		},

		/** 
		 * add new Attachment to aAttachments arrey and update MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet
		 */
		handleUpload: function (oEvent) {
			var oModel = this.getGlobalModel("moModel");
			var oCurrentActivityDetails = oModel.getProperty("/MONewActivityDetails/currentActivityDetails");
			var moModel = this.getOwnerComponent().getModel("moModel");
			var that = this;
			var oUploader = oEvent.getSource();
			var domRef = oUploader.getFocusDomRef();
			var file = domRef.files[0];
			var sFileName = oUploader.getProperty('value');
			var sFileEnd = sFileName.split(".").pop();
			var sFileType = this.getAttachmentType(sFileEnd);

			// AttachmentType,FileContent,DocKey,FileName,ObjectType,ObjectId

			// var oFileData = {
			// 	ObjectId: ,
			// 	ObjectType: ,
			// 	FileName: ,
			// 	AttachmentType: ,
			// 	FileContent: "",
			// };
			var aAttachments = oModel.getProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet");
			aAttachments = aAttachments ? aAttachments : [];
			var reader = new FileReader();
			reader.onload = function (e) {
				var sFileContent = e.currentTarget.result.split(",")[1];
				aAttachments.push({
					ObjectId: this.ObjectId ? this.ObjectId : null,
					ObjectType: this.ObjectType ? this.ObjectType : null,
					FileName: sFileName,
					AttachmentType: sFileType,
					FileContent: sFileContent,
					isNew: true
				});
				oModel.setProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet", aAttachments);

			}
			reader.readAsDataURL(file);
			// reader.readAsBinaryString(file);
		},

		/** 
		 * on press save button create new activity or update exist Activity
		 */
		createNewActivity: function () {
			var that = this;
			this.getView().setBusy(true);
			var oModel = this.getOwnerComponent().getModel();

			var oCurrentActivityDetails = this.getGlobalModel("moModel").getProperty(
				"/MONewActivityDetails/currentActivityDetails");

			var oPayload = {
				Partner: oCurrentActivityDetails.Partner,
				OppObjectId: oCurrentActivityDetails.OppObjectId,
				Date: oCurrentActivityDetails.Date,
				Comments: oCurrentActivityDetails.Comments,
				ProcessType: oCurrentActivityDetails.ProcessType,
				Status: oCurrentActivityDetails.ActivityStatus
			};

			if (oCurrentActivityDetails.Guid) {
				oPayload.Guid = oCurrentActivityDetails.Guid;
				oPayload.Time = oCurrentActivityDetails.Time;
				// oPayload.ProcessType = "ZAPT";
			} else {
				var sTime = oCurrentActivityDetails.Time;
				var sTimeArr = sTime.split(":");
				var timeToBe = "PT" + sTimeArr[0] + "H" + sTimeArr[1] + "M00S";
				oPayload.Time = timeToBe;
				// oPayload.ProcessType = "ZPCT";
			}

			var moModel = this.getGlobalModel("moModel");
			var aAttachments = moModel.getProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet");
			var bHasNewAttachments = false;

			aAttachments = aAttachments ? aAttachments : [];
			for (var i = 0, maxi = aAttachments.length; i < maxi; i++) {
				if (aAttachments[i].isNew) {
					bHasNewAttachments = true;
					break;
				}
			}
			var mParams = {
				success: function (oData) {
					that.getView().setBusy(false);
					//TODO complete the attachments fn
					if (bHasNewAttachments) {
						that.saveAttachments(oData);
					} else {
						that.onOpenSaveDialog();
					}
				}
			};
			this.models.doCreate(this, "/ActivitySet", oPayload, mParams, true);
		},

		/** 
		 * save new Attachments to db
		 */
		saveAttachments: function (oActivityData) {
			var sObjectId = oActivityData.ObjectId;
			var sObjectType = oActivityData.ObjectType;
			var moModel = this.getGlobalModel("moModel");
			var aAttachments = moModel.getProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet");
			var that = this;
			this._nCounter = 0;
			this._nNewAttachments = 0;
			aAttachments.forEach(function (oAttachment, index) {
				if (oAttachment.isNew) {
					that._nNewAttachments++;
					var mParams = {
						success: function (oData) {
							moModel.setProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet/" + index + "/isNew", false);
							that._nCounter++;
							if (that._nNewAttachments === that._nCounter) {
								//done uploading all new files
								that.onOpenSaveDialog();
							}
						}
					};
					var oFileData = JSON.parse(JSON.stringify(oAttachment));
					delete oFileData.isNew;
					oFileData.ObjectId = sObjectId;
					oFileData.ObjectType = sObjectType;
					// send file to Be:
					that.models.doCreate(that, "/AttachmentSet", oFileData, mParams, true);
				}
			});

		},

		/** 
		 * open dialog after all details save successfully
		 */
		onOpenSaveDialog: function () {
			var oDialog = null;
			if (!sap.ui.getCore().byId("saveDetailsDialog")) {
				oDialog = sap.ui.xmlfragment("com.meir.meirordersmobile.view.saveDetailsDialog", this);
				this.getView().addDependent(oDialog);
			} else {
				oDialog = sap.ui.getCore().byId("saveDetailsDialog");
			}
			if (!oDialog.isOpen()) {
				oDialog.open();
			}
		},

		/** 
		 * close dialog and nav to homepage
		 */
		onCloseDialog: function () {
			sap.ui.getCore().byId("saveDetailsDialog").close();
			this.onNavHome();
		},

		/** 
		 * open recording dialog
		 */
		onOpenRecordDialog: function () {
			var oDialog = null;
			if (!sap.ui.getCore().byId("RecordAudioDialog")) {
				oDialog = sap.ui.xmlfragment("com.meir.meirordersmobile.view.RecordAudioDialog", this);
				this.getView().addDependent(oDialog);
			} else {
				oDialog = sap.ui.getCore().byId("RecordAudioDialog");
			}
			if (!oDialog.isOpen()) {
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				sap.ui.getCore().byId("toggleRecordBtn").setText(oBundle.getText("recording"));
				oDialog.open();
			}
		},

		/** 
		 *close recording dialog
		 */
		onCloseRecordDialog: function () {
			sap.ui.getCore().byId("RecordAudioDialog").close();
			sap.ui.getCore().byId("toggleRecordBtn").setVisible(true);
			sap.ui.getCore().byId("playRecordingBtn").setVisible(false);
			sap.ui.getCore().byId("deleteRecordingBtn").setVisible(false);
			sap.ui.getCore().byId("sevaRecordingBtn").setVisible(false);
		},

		stream: {},
		blobs: [],
		oFileAudioData: {
			ObjectId: "",
			ObjectType: "",
			FileName: "",
			AttachmentType: "",
			FileContent: "",
		},

		recorderBlob: {},

		/** 
		 *start/stop  recording dialog
		 */
		onToggleRecording: async function (oEvent) {
			if (oEvent.getSource().getPressed()) {
				var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				oEvent.getSource().setText(oBundle.getText("stopRecording"));
				this.stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false
				});
				this.mediaRecorder = new window.MediaRecorder(this.stream);
				this.mediaRecorder.ondataavailable = function (e) {
					this.blobs.push(e.data);
				}.bind(this);
				this.mediaRecorder.onstop = function (e) {
					this.recorderBlob = new Blob(this.blobs, {
						'type': this.mediaRecorder.mimeType
					});
					var date = new Date();

					this.blobs = [];
					var sDateYear = date.getDate() + "_" + date.getMonth() + "_" + date.getYear();
					var sDateTime = date.getHours() + "_" + date.getMinutes();
					var sFileName = "recording " + sDateYear + " " + sDateTime + ".webm";

					this.oFileAudioData = {
						ObjectId: this.ObjectId,
						ObjectType: this.ObjectType,
						FileName: sFileName,
						AttachmentType: "2",
						FileContent: "",
					};

					// window.open(audioURL);
				}.bind(this);

				this.mediaRecorder.start();
			} else {
				this.mediaRecorder.stop();
				this.stream.getTracks().forEach(function (track) {
					track.stop()
				});
				sap.ui.getCore().byId("toggleRecordBtn").setVisible(false);
				sap.ui.getCore().byId("playRecordingBtn").setVisible(true);
				sap.ui.getCore().byId("deleteRecordingBtn").setVisible(true);
				sap.ui.getCore().byId("sevaRecordingBtn").setVisible(true);
			}
		},

		/** 
		 *play new recording from dialog
		 */
		onPlayRecording: function () {
			var audioURL = window.URL.createObjectURL(this.recorderBlob);
			var oAudioFile = new Audio(audioURL);
			oAudioFile.play();
		},

		/** 
		 *delete recording
		 */
		onDeleteRecording: function () {
			this.oFileAudioData = {
				ObjectId: "",
				ObjectType: "",
				FileName: "",
				AttachmentType: "2",
				FileContent: "",
			};
			this.onCloseRecordDialog();
		},

		/** 
		 *save recording and close recording dialog
		 */
		onSaveRecording: function () {
			var moModel = this.getOwnerComponent().getModel("moModel");
			var that = this;
			var oCurrentActivityDetails = this.getGlobalModel("moModel").getProperty("/MONewActivityDetails/currentActivityDetails");

			// AttachmentType,FileContent,DocKey,FileName,ObjectType,ObjectId
			var aAttachments = moModel.getProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet");
			aAttachments = aAttachments ? aAttachments : [];
			var reader = new FileReader();
			reader.onload = function (e) {
				var date = new Date();
				var sDateYear = date.getDate() + "_" + date.getMonth() + "_" + date.getYear();
				var sDateTime = date.getHours() + "_" + date.getMinutes();
				var sFileName = "recording " + sDateYear + " " + sDateTime + ".webm";
				var sFileContent = e.currentTarget.result.split(",")[1];

				aAttachments.push({
					ObjectId: that.ObjectId ? that.ObjectId : null,
					ObjectType: that.ObjectType ? that.ObjectType : null,
					FileName: sFileName,
					AttachmentType: "2",
					FileContent: sFileContent,
					isNew: true
				});
				moModel.setProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet", aAttachments);
				that.onCloseRecordDialog();
			}
			reader.readAsDataURL(that.recorderBlob);
		},

		/** 
		 *play recording from Attachments list
		 */
		onPlaySaveRecording: async function (oEvent) {
			var button = oEvent.getSource();
			if (oEvent.getSource().getPressed()) {
				var oCurrentAttachmentDetails = oEvent.getSource().data("attachmentDetails");
				var base64 = await fetch("data:audio/webm;base64," + oCurrentAttachmentDetails.FileContent);
				var blob = await base64.blob();
				var audioURL = window.URL.createObjectURL(blob);
				this.oAudioFile = new Audio(audioURL);
				button.setIcon("css/icons/icons8-pause-30.png");
				this.oAudioFile.play();

			} else {
				button.setIcon("css/icons/play_circle_black.svg");
				this.oAudioFile.pause();
			}
		},

		/** 
		 *view documents from Attachments list
		 */
		onViewDoc: async function (oEvent) {
			console.log("on play function");
			var oCurrentAttachmentDetails = oEvent.getSource().data("attachmentDetails");
			var sFileName = oCurrentAttachmentDetails.FileName;
			var sFileType = sFileName.split(".").pop();
			var sFormat;
			if (oCurrentAttachmentDetails.AttachmentType === "1") {
				sFormat = "data:image/" + sFileType + ";base64,";
			} else {
				sFormat = "data:application/" + sFileType + ";base64,";
			}

			// var base64 = await fetch(sFormat + oCurrentAttachmentDetails.FileContent64);
			// var blob = await base64.blob();
			// var dataURL = window.URL.createObjectURL(blob);
			// window.open(sFormat + oCurrentAttachmentDetails.FileContent64, "_blank"); 

			var sContent = oCurrentAttachmentDetails.FileContent;
			var a = document.createElement("a");
			a.download = encodeURI("document." + sFileType.toLowerCase());
			a.href = sFormat + sContent;
			a.click();

			// window.open(dataURI);
			// var dataURI = sFormat + oCurrentAttachmentDetails.FileContent64
			// var audioURL = window.URL.createObjectURL(blob);
			// this.oAudioFile = new Audio(audioURL);
			// this.oAudioFile.play();
			// sap.ui.getCore().byId("togglePlayBtn").setIcon("css/icons/icons8-pause-30.png")
		},

		/** 
		 *delete Attachments before saved in db
		 */
		onDeleteAttachment: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("moModel").getPath();
			var nIndex = parseFloat(sPath.split("/").pop());
			var moModel = this.getOwnerComponent().getModel("moModel");
			var aAttachments = moModel.getProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet");
			aAttachments.splice(nIndex, 1);
			moModel.setProperty("/MONewActivityDetails/currentActivityDetails/CurrentAttachmentsSet", aAttachments);
		}

	});

});