sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (Controller, Fragment, MessageToast,MessageBox, Spreadsheet, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.sap.northwindcompanyy.controller.Product", {
      onInit: function () {

      },
  
      onIconTabBarSelect: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        var oSelectedKey = oEvent.getParameter("key");
        if (oSelectedKey === "Customers") {
            oRouter.navTo("Customer", { key: oSelectedKey });
        } else if (oSelectedKey === "Employees") {
            oRouter.navTo("Employee", { key: oSelectedKey });
        } else if (oSelectedKey === "Shippers") {
            oRouter.navTo("Shipper", { key: oSelectedKey });
        } else if (oSelectedKey === "Orders") {
            oRouter.navTo("Order", { key: oSelectedKey });
        } else if (oSelectedKey === "Products") {
            oRouter.navTo("Product", { key: oSelectedKey });
        } else if (oSelectedKey === "Order_Details") {
            oRouter.navTo("Order_Detail", { key: oSelectedKey });
        } else if (oSelectedKey === "Files") {
            oRouter.navTo("Files", { key: oSelectedKey });
        } else if (oSelectedKey === "Regions") {
            oRouter.navTo("Region", { key: oSelectedKey });
        }
        
    }  ,
    formatUnitsInStock: function (value) {
      return value < 10 ? "ShowButton" : value;
    },
    formatUnitsInStock: function (iUnitsInStock) {
      if (parseInt(iUnitsInStock) < 10) {
        return iUnitsInStock + " (Low Stock)";
      } else {
        return iUnitsInStock.toString();
      }
    },

    onUnitsInStockClick: function (oEvent) {
      let selectedItem = oEvent.getSource().getBindingContext().getObject().ProductID;
      let spath = `/Products(${selectedItem})`;
      let unitsInStock = parseInt(this.getView().getModel().getProperty(spath).UnitsInStock);
  
      if (unitsInStock < 10) {
          if (!this._oCreateProductDialog) {
              Fragment.load({
                  id: this.getView().getId(),
                  name: "com.sap.northwindcompanyy.view.fragment.Lowstock",
                  controller: this
              }).then(oDialog => {
                  this._oCreateProductDialog = oDialog;
                  this.getView().addDependent(oDialog);
                  oDialog.bindElement({
                      path: spath,
                  });
                  oDialog.open();
              });
          } else {
              this._oCreateProductDialog.bindElement({
                  path: spath,
              });
              this._oCreateProductDialog.open();
          }
      }
  },
  
    onSubmitOrder: function () {
      debugger;
      let oModel = this.getOwnerComponent().getModel();
    
      const oSupplier = this.getView().byId("supplierNameInput").getValue();
      const oProduct = this.getView().byId("productNameInput").getValue();
      const oCreatedBy = this.getView().byId("createdByInput").getValue();
      const oOrderAmount = this.getView().byId("orderAmountInput").getValue();
      const oProductNeedByDate = this.getView().byId("productNeedByDateInput").getDateValue();
      const oCreatedDate = this.getView().byId("createdDateInput").getDateValue();
    
      let data = {
          "supplierName": oSupplier,
          "productName": oProduct, 
          "orderAmount" :parseInt(oOrderAmount),
          "productNeedByDate" : oProductNeedByDate,
          "createdDate" : oCreatedDate,
          "createdBy": oCreatedBy,
      };
    
      let payload = {
          payload: JSON.stringify(data)
      };
    
      oModel.create("/Submit", payload, {
          success: function (res) {
              MessageBox.success("Submit successfully");
              console.log("done", res);
          },
          error: function (err) {
              MessageBox.error("ERROR");
              console.error("Error in Submit:", err);
    
              // Log more details about the error
              if (err.response) {
                  console.error("Response data:", err.response.data);
                  console.error("Response status:", err.response.status);
                  console.error("Response headers:", err.response.headers);
              } else if (err.request) {
                  console.error("No response received:", err.request);
              } else {
                  console.error("Error setting up the request:", err.message);
              }
          }
      });
    },
    onCancelOrder: function () {
      this._oCreateProductDialog.close()
    },
      onAddPress: function () {
        debugger;


        if (!this._oCreateProductDialog) {
          Fragment.load({
            id: this.getView().getId(),
            name: "com.sap.northwindcompanyy.view.fragment.Productadd",
            controller: this
          }).then(oDialog => {
            this._oCreateProductDialog = oDialog
            this.getView().addDependent(oDialog)
            oDialog.open()
          })
        } else {
          this._oCreateProductDialog.open()
        }


      },
      confirmOrder: function () {
        debugger
        let oModel = this.getOwnerComponent().getModel();
        let oProductID = parseInt(this.getView().byId("ProductID").getValue());
        let oProductName = this.getView().byId("ProductName").getValue();
        let oSupplierID = parseInt(this.getView().byId("SupplierID").getValue());
        let oCategoryID = parseInt(this.getView().byId("CategoryID").getValue());
        let oQuantityPerUnit = this.getView().byId("QuantityPerUnit").getValue();
        let oUnitPrice = parseFloat(this.getView().byId("UnitPrice").getValue());
        let oUnitsInStock = parseInt(this.getView().byId("UnitsInStock").getValue());
        let oUnitsOnOrder = parseInt(this.getView().byId("UnitsOnOrder").getValue());
        let oReorderLevel = parseInt(this.getView().byId("ReorderLevel").getValue());
        let oDiscontinued = this.getView().byId("Discontinued").getValue();


        let myData = {

          ProductID: oProductID,
          ProductName: oProductName,
          SupplierID: oSupplierID,
          CategoryID: oCategoryID,
          QuantityPerUnit: oQuantityPerUnit,
          UnitPrice: oUnitPrice,
          UnitsInStock: oUnitsInStock,
          UnitsOnOrder: oUnitsOnOrder,
          ReorderLevel: oReorderLevel,
          Discontinued: oDiscontinued


        }
        oModel.create("/Products", myData, {
          success: function (res) {
            console.log("done")
          },
          error: function (err) {
            MessageBox.error("ProductID and ProductName are Mandatory")
          }
        })
        this._oCreateProductDialog.close()
      },
      onCancel: function () {
        this._oCreateProductDialog.close()
      },

      onDeletePress: function () {
          // Get the selected items from the table
          var oTable = this.getView().byId("g1");
          var aSelectedItems = oTable.getSelectedItems();

          // Check if any items are selected
          if (aSelectedItems.length === 0) {
              MessageToast.show("No items selected for deletion");
              return;
          }

          // Confirmation dialog
          var that = this;
          sap.m.MessageBox.confirm("Are you sure you want to delete the selected items?", {
              title: "Confirm Deletion",
              onClose: function (oAction) {
                  if (oAction === sap.m.MessageBox.Action.OK) {
                      // User confirmed deletion
                      that.performDelete(aSelectedItems);
                  }
                  // else: User canceled deletion
              }
          });
      },
      performDelete: function (aSelectedItems) {
          // Get the model and remove each selected item
          var oModel = this.getOwnerComponent().getModel();
          aSelectedItems.forEach(function (oSelectedItem) {
              var sPath = oSelectedItem.getBindingContext().getPath();
              oModel.remove(sPath, {
                  success: function (res) {
                      console.log("Item deleted successfully");
                      MessageToast.show("Item Deleted Successfully");
                  },
                  error: function (err) {
                      console.error("Error deleting item:", err);
                  }
              });
          });
      },


      onSearch: function (oEvent) {
        var aFilter = [];
        var sQuery = oEvent.getParameter("query");
        if (sQuery) {
          // Convert the search query to an integer
          var iQuery = parseInt(sQuery);
          if (!isNaN(iQuery)) {
            aFilter.push(new Filter("ProductID", FilterOperator.EQ, iQuery));

          }
        }

        // filter binding
        var oTable = this.getView().byId("g1");
        var oBinding = oTable.getBinding("items");
        oBinding.filter(aFilter);
      },

      onUpdatePress: function () {
        var oTable = this.getView().byId("g1");
        var aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length !== 1) {
          MessageToast.show("Please select exactly one item for update");
          return;
        }

        var oSelectedItem = aSelectedItems[0];
        var oContext = oSelectedItem.getBindingContext();
        var oModel = oContext.getModel();
        var sPath = oContext.getPath();
        var oData = oModel.getProperty(sPath);

        if (!this._oUpdateDialog) {
          var that = this;  // store 'this' reference

          Fragment.load({
            id: this.getView().getId(),
            name: "com.sap.northwindcompanyy.view.fragment.Productupdate",
            controller: this
          }).then(function (oDialog) {
            that._oUpdateDialog = oDialog;
            that.getView().addDependent(oDialog);

            // Set the model to the dialog to enable two-way data binding
            that._oUpdateDialog.setModel(oModel);

            // Set the binding context to the dialog
            that._oUpdateDialog.setBindingContext(oContext);

            // Access controls using byId from the fragment
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateProductID").setValue(oData.ProductID);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateProductName").setValue(oData.ProductName);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateSupplierID").setValue(oData.SupplierID);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateCategoryID").setValue(oData.CategoryID);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateQuantityPerUnit").setValue(oData.QuantityPerUnit);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateUnitPrice").setValue(oData.UnitPrice);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateUnitsInStock").setValue(oData.UnitsInStock);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateUnitsOnOrder").setValue(oData.UnitsOnOrder);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateReorderLevel").setValue(oData.ReorderLevel);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateDiscontinued").setValue(oData.Discontinued);

            that._oUpdateDialog.open();
          });
        } else {
          // Set the binding context to the dialog
          this._oUpdateDialog.setBindingContext(oContext);

          // Access controls using byId from the fragment
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateProductID").setValue(oData.ProductID);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateProductName").setValue(oData.ProductName);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateSupplierID").setValue(oData.SupplierID);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateCategoryID").setValue(oData.CategoryID);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateQuantityPerUnit").setValue(oData.QuantityPerUnit);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateUnitPrice").setValue(oData.UnitPrice);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateUnitsInStock").setValue(oData.UnitsInStock);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateUnitsOnOrder").setValue(oData.UnitsOnOrder);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateReorderLevel").setValue(oData.ReorderLevel);
          sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateDiscontinued").setValue(oData.Discontinued);

          this._oUpdateDialog.open();
        }
      },
      updateProduct: function () {
        var sUpdatedProductID = this.byId("UpdateProductID").getValue();
        var sUpdatedProductName = this.byId("UpdateProductName").getValue();
        var sUpdatedSupplierID = this.byId("UpdateSupplierID").getValue();
        var sUpdatedCategoryID = this.byId("UpdateCategoryID").getValue();
        var sUpdatedQuantityPerUnit = this.byId("UpdateQuantityPerUnit").getValue();
        var sUpdatedUnitPrice = this.byId("UpdateUnitPrice").getValue();
        var sUpdatedUnitsInStock = this.byId("UpdateUnitsInStock").getValue();
        var sUpdatedUnitsOnOrder = this.byId("UpdateUnitsOnOrder").getValue();
        var sUpdatedUpdateReorderLevel = this.byId("UpdateReorderLevel").getValue();
        var sUpdatedDiscontinued = this.byId("UpdateDiscontinued").getValue();

        var oTable = this.byId("g1");
        var aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length !== 1) {
          MessageToast.show("Please select exactly one item for update");
          return;
        }

        var oSelectedItem = aSelectedItems[0];
        var oContext = oSelectedItem.getBindingContext();
        var oModel = oContext.getModel();

        // Update the data in the model
        oModel.setProperty(oContext.getPath() + "/ProductID", sUpdatedProductID);
        oModel.setProperty(oContext.getPath() + "/ProductName", sUpdatedProductName);
        oModel.setProperty(oContext.getPath() + "/SupplierID", sUpdatedSupplierID);
        oModel.setProperty(oContext.getPath() + "/CategoryID", sUpdatedCategoryID);
        oModel.setProperty(oContext.getPath() + "/QuantityPerUnit", sUpdatedQuantityPerUnit);
        oModel.setProperty(oContext.getPath() + "/UnitPrice", sUpdatedUnitPrice);
        oModel.setProperty(oContext.getPath() + "/UnitsInStock", sUpdatedUnitsInStock);
        oModel.setProperty(oContext.getPath() + "/UnitsOnOrder", sUpdatedUnitsOnOrder);
        oModel.setProperty(oContext.getPath() + "/UpdateReorderLevel", sUpdatedUpdateReorderLevel);
        oModel.setProperty(oContext.getPath() + "/Discontinued", sUpdatedDiscontinued);

        // Update the data in the backend
        oModel.submitChanges({
          success: function () {
            // Update the data in the table
            oTable.getModel().refresh();

            // Close the dialog
            this.byId("fr2").close();

            // Optional: Show a success message
            MessageToast.show("Update successful");
          }.bind(this),
          error: function () {
            // Handle errors if needed
            MessageToast.show("Update failed");
          }
        });
      },
      onCancelUpdate: function () {
        this._oUpdateDialog.close()
      },


      createColumnConfig: function () {
        return [
          { label: 'ProductID', property: 'ProductID' },
          { label: 'Product Name', property: 'ProductName' },
          { label: 'Supplier ID', property: 'SupplierID' },
          { label: 'Category ID', property: 'CategoryID' },
          { label: 'Quantity PerUnit', property: 'QuantityPerUnit' },
          { label: 'Unit Price', property: 'UnitPrice' },
          { label: 'Units InStock', property: 'UnitsInStock' },
          { label: 'Units OnOrder', property: 'UnitsOnOrder' },
          { label: 'Reorder Level', property: 'ReorderLevel' },
          { label: 'Discontinued', property: 'Discontinued' },

        ];
      },

      onExport: function () {
        var oTable = this.byId('g1');
        var oRowBinding = oTable.getBinding('items');
        var aCols = this.createColumnConfig();

        var oSettings = {
          workbook: {
            columns: aCols,
            hierarchyLevel: 'Level'
          },
          dataSource: oRowBinding,
          fileName: 'Products.xlsx',
          worker: false
        };

        var oSheet = new sap.ui.export.Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },

      onFileUploadChange: function (oEvent) {
        var oFileUploader = oEvent.getSource();
        var oFile = oEvent.getParameter("files")[0];
    
        if (!oFile) {
         
            console.error("No file selected");
            return;
        }
    
        var reader = new FileReader();
    
        reader.onload = function (e) {
            var csvData = e.target.result;
    
            if (!csvData) {
            
                console.error("Empty file");
                return;
            }
    
            var jsonData = this.convertCsvToJson(csvData);
    
            if (jsonData.length > 0) {
               
                this.sendDataToBackend(jsonData);
            } else {
                console.error("No valid data to send to the backend");
            }
        }.bind(this);
    
        reader.onerror = function (e) {
            console.error("Error reading file:", e);
        };
    
        reader.readAsText(oFile);
    },
    
    convertCsvToJson: function (csvData) {
        var lines = csvData.split('\n');
        var result = [];
        var headers = lines[0].split(';');
    
        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentLine = lines[i].split(';');
    
       
            if (currentLine[headers.indexOf('ProductID')].trim() !== '') {
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j];
                }
    
                result.push(obj);
            }
        }
    
        return result;
    },
    
    
    sendDataToBackend: function (jsonData) {
        
        var oModel = this.getView().getModel();
    
        for (var i = 0; i < jsonData.length; i++) {
            oModel.create("/Products", jsonData[i], {
                success: function () {
                   MessageToast.show("Done");
                },
                error: function () {
                 MessageBox.error("Productname is Missing in CSV File")
                }
            });
        }
    }

    });
  }
);