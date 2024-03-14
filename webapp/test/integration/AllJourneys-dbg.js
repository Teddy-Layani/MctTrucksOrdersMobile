/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"com/meir/meirordersmobile/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/meir/meirordersmobile/test/integration/pages/App",
	"com/meir/meirordersmobile/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.meir.meirordersmobile.view.",
		autoWait: true
	});
});