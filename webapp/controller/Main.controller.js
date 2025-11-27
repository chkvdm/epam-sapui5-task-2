sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    './BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/Dialog',
    'sap/m/Button',
    'sap/m/Text',
    'sap/m/library',
    'sap/ui/core/library',
    // 'sap/ui/core/Element',
    // 'sap/ui/layout/HorizontalLayout',
    // 'sap/ui/layout/VerticalLayout',
    // 'sap/m/Label',
    // 'sap/m/MessageToast',
    // 'sap/m/TextArea',
  ],
  (
    JSONModel,
    BaseController,
    Filter,
    FilterOperator,
    Dialog,
    Button,
    Text,
    mobileLibrary,
    coreLibrary
    // Element,
    // HorizontalLayout,
    // VerticalLayout,
    // Label,
    // MessageToast,
    // TextArea
  ) => {
    ('use strict');

    const DialogType = mobileLibrary.DialogType;
    const ButtonType = mobileLibrary.ButtonType;
    // const ValueState = coreLibrary.ValueState;

    return BaseController.extend('epamsapui5task2.controller.Main', {
      onInit() {
        const oBooksModel = new JSONModel(
          sap.ui.require.toUrl('epamsapui5task2/model/books.json')
        );

        this.setModel(oBooksModel, 'books');

        oBooksModel.attachRequestCompleted(() => {
          const aBooks = this.getModel('books').getProperty('/Books');

          // add editMode property to the every item
          if (aBooks) {
            const aBooksWithEditMode = aBooks.map((book) => {
              return {
                ...book,
                editMode: false,
              };
            });

            this.getModel('books').setProperty('/Books', aBooksWithEditMode);
          }

          // create genre model
          const aUniqueGenres = [...new Set(aBooks.map((book) => book.Genre))];

          const aGenres = [
            { genre: 'all' },
            ...aUniqueGenres.map((genre) => {
              return { genre: genre };
            }),
          ];

          const oGenresModel = new JSONModel(aGenres);
          this.setModel(oGenresModel, 'genres');
        });
      },

      onAddRecordPress() {
        const oModel = this.getModel('books');
        const aBooks = oModel.getProperty('/Books');

        const oNewBook = {
          ID: `B${(aBooks.length + 1).toString().padStart(3, '0')}`,
          Name: '',
          Author: '',
          Genre: '',
          ReleaseDate: '',
          AvailableQuantity: '',
          editMode: false,
        };

        aBooks.push(oNewBook);
        oModel.setProperty('/Books', aBooks);
      },

      onDeleteRecordsPress: function () {
        const aSelectedItems = this.byId('booksTable').getSelectedItems();

        // if no selected rows
        if (aSelectedItems.length === 0) {
          if (!this.oErrorMessageDialog) {
            this.oErrorMessageDialog = new Dialog({
              type: DialogType.Message,
              title: 'Error',
              content: new Text({
                text: 'Please select at least one book to delete.',
              }),
              beginButton: new Button({
                type: ButtonType.Emphasized,
                text: 'OK',
                press: function () {
                  this.oErrorMessageDialog.close();
                }.bind(this),
              }),
            });
          }
          this.oErrorMessageDialog.open();
          return;
        }

        // if have selected rows
        if (!this.oApproveDialog) {
          this.oApproveDialog = new Dialog({
            type: DialogType.Message,
            title: 'Confirm',
            content: new Text({
              text: 'Are you sure you want to delete selected records?',
            }),
            beginButton: new Button({
              type: ButtonType.Emphasized,
              text: 'Yes',
              press: function () {
                this._deleteRowsAction();
                this.oApproveDialog.close();
              }.bind(this),
            }),
            endButton: new Button({
              text: 'No',
              press: function () {
                this.oApproveDialog.close();
              }.bind(this),
            }),
          });
        }

        this.oApproveDialog.open();
      },

      _deleteRowsAction: function () {
        const aSelectedItems = this.byId('booksTable').getSelectedItems();
        const oModel = this.getModel('books');
        const aBooks = oModel.getProperty('/Books');

        const aSelectedBooksIds = aSelectedItems.map((oItem) => {
          return oItem.getBindingContext('books').getProperty('ID');
        });

        const aFilteredBooks = aBooks.filter((oBook) => {
          return !aSelectedBooksIds.includes(oBook.ID);
        });

        this.byId('booksTable').removeSelections();
        oModel.setProperty('/Books', aFilteredBooks);
      },

      setFilterPress() {
        const aFilter = [];

        const sTitle = this.byId('bookTittleFilterInput').getValue();
        const sGenre = this.byId('bookGenreFilterSelect').getSelectedKey();

        if (sTitle) {
          aFilter.push(new Filter('Name', FilterOperator.Contains, sTitle));
        }

        if (sGenre !== 'all') {
          aFilter.push(new Filter('Genre', FilterOperator.EQ, sGenre));
        }

        const oList = this.byId('booksTable');
        const oBinding = oList.getBinding('items');
        oBinding.filter(aFilter);
      },

      editTittle(oEvent) {
        const oEditButtonContext = oEvent
          .getSource()
          .getBindingContext('books');
        const sBookTittleCellPath = oEditButtonContext.getPath();

        this.getModel('books').setProperty(
          `${sBookTittleCellPath}/editMode`,
          true
        );
      },

      saveEditedTittle(oEvent) {
        const oSaveButtonContext = oEvent
          .getSource()
          .getBindingContext('books');
        const sBookTittleCellPath = oSaveButtonContext.getPath();

        this.getModel('books').setProperty(
          `${sBookTittleCellPath}/editMode`,
          false
        );
      },
    });
  }
);
