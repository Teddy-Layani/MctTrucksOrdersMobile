sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,r){"use strict";return{createDeviceModel:function(){var o=new e(r);o.setDefaultBindingMode("OneWay");return o},doRead:function(e,r,o,t,n){var i=e.getOwnerComponent().getModel(n);var s=t?true:false;e.getView().setBusy(s);if(!o.error){o.error=function(r){e.getView().setBusy(false);e.error.processConnectionError(r,e)}}i.read(r,o)},doCreate:function(e,r,o,t,n,i){var s=e.getOwnerComponent().getModel(i);var a=n?true:false;e.getView().setBusy(a);if(!t.error){t.error=function(r){e.getView().setBusy(false);e.error.processConnectionError(r,e)}}s.create(r,o,t)}}});