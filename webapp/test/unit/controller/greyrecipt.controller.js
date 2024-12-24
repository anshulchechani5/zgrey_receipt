/*global QUnit*/

sap.ui.define([
	"zgreyreceipt/controller/greyrecipt.controller"
], function (Controller) {
	"use strict";

	QUnit.module("greyrecipt Controller");

	QUnit.test("I should test the greyrecipt controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
