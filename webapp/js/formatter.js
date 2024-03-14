sap.ui.define([],function(){"use strict";return{formatDisplayDate:function(e){if(!e){return"- -"}if(e instanceof Date){jQuery.sap.require("sap.ui.core.format.DateFormat");var t;t=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"dd/MM/yy"});return t.format(e)}else{return e}},formatDotDate:function(e){if(!e){return"- -"}if(e instanceof Date){jQuery.sap.require("sap.ui.core.format.DateFormat");var t;t=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"dd.MM.yy"});return t.format(e)}else{return e}},formatMillisecondsToTime:function(e){if(e){var t=new Date(e.ms);var r=t.getTime();var a=sap.ui.core.format.DateFormat.getTimeInstance({pattern:"HH:mm"});var n=new Date(0).getTimezoneOffset()*60*1e3;var o=a.format(new Date(r+n));if(o)return o;else return e}else{return"- -"}},formatMillisecondsToDate:function(e){if(!e){return e}if(e){var t=new Date(e);if(t instanceof Date){jQuery.sap.require("sap.ui.core.format.DateFormat");var r;r=sap.ui.core.format.DateFormat.getDateTimeInstance({pattern:"dd/MM/yy"});return r.format(t)}else{return t}}}}});