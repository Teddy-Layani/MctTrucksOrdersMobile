sap.ui.define(["sap/ui/test/Opa5","com/meir/meirOrders/test/integration/pages/Common","sap/ui/test/actions/Press"],function(e,t,i){"use strict";var s="MOApp";e.createPageObjects({onTheAppPage:{baseClass:t,actions:{iDoMyAction:function(){return this.waitFor({id:"idAppControl",viewName:s,actions:[function(){}],errorMessage:"implement test"})}},assertions:{iShouldSeeTheApp:function(){return this.waitFor({id:"idAppControl",viewName:s,success:function(){e.assert.ok(true,"The MOApp view is displayed")},errorMessage:"Did not find the MOApp view"})},iDoMyAssertion:function(){return this.waitFor({id:"idAppControl",viewName:s,success:function(){e.assert.ok(false,"Implement test")},errorMessage:"implement me"})}}}})});