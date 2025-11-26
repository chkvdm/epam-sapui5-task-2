sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    './BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
  ],
  (JSONModel, BaseController, Filter, FilterOperator) => {
    'use strict';

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

      addRecordHandler() {
        const oModel = this.getModel('books');
        const aBooks = oModel.getProperty('/Books');

        const oNewBook = {
          ID: 'B' + String(aBooks.length + 1).padStart(3, '0'),
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

      deleteSelectedRecordHandler() {
        const aSelectedItems = this.byId('booksTable').getSelectedItems();
        const oModel = this.getView().getModel('books');
        const aBooks = oModel.getProperty('/Books');

        const aSelectedBooksIds = aSelectedItems.map((oItem) => {
          return oItem.getBindingContext('books').getProperty('ID');
        });

        const aFilteredBooks = aBooks.filter((oBook) => {
          return !aSelectedBooksIds.includes(oBook.ID);
        });

        oModel.setProperty('/Books', aFilteredBooks);
      },

      setFilter() {
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
