sap.ui.define(
  ['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel'],
  (Controller, JSONModel) => {
    'use strict';

    return Controller.extend('epamsapui5task2.controller.Main', {
      onInit() {
        const oBooksModel = new JSONModel(
          sap.ui.require.toUrl('epamsapui5task2/model/books.json')
        );

        this.getView().setModel(oBooksModel, 'books');
      },
    });
  }
);
