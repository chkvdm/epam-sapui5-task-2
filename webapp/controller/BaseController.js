sap.ui.define(['sap/ui/core/mvc/Controller'], (Controller) => {
  'use strict';

  return Controller.extend('epamsapui5task2.controller.BaseController', {
    setModel: function (oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    getModel: function (sName) {
      return this.getView().getModel(sName);
    },
  });
});
