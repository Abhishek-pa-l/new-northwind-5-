sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/Fragment",
      "sap/m/MessageToast",
      "sap/ui/export/Spreadsheet",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator"
  
  
    ],
    function (Controller, Fragment, MessageToast, Spreadsheet, Filter, FilterOperator) {
      "use strict";
  
      return Controller.extend("com.sap.northwindcompanyy.controller.Order", {
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
        onAddPress: function () {
          debugger;
  
  
          if (!this._oCreateProductDialog) {
            Fragment.load({
              id: this.getView().getId(),
              name: "com.sap.northwindcompanyy.view.fragment.Orderadd",
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
          let oOrderID = this.getView().byId("OrderID").getValue();
          let oCustomerID = this.getView().byId("CustomerID").getValue();
          let oEmployeeID = this.getView().byId("EmployeeID").getValue();
          let oOrderDate = this.getView().byId("OrderDate").getValue();
          let oRequiredDate = this.getView().byId("RequiredDate").getValue();
          let oShippedDate = this.getView().byId("ShippedDate").getValue();
          let oShipVia = this.getView().byId("ShipVia").getValue();
          let oFreight = this.getView().byId("Freight").getValue();
          let oShipName = this.getView().byId("ShipName").getValue();
          let oShipAddress = this.getView().byId("ShipAddress").getValue();
          let oShipCity = this.getView().byId("ShipCity").getValue();
          let oShipRegion = this.getView().byId("ShipRegion").getValue();
          let oShipPostalCode = this.getView().byId("ShipPostalCode").getValue();
          let oShipCountry = this.getView().byId("ShipCountry").getValue();
  
          let myData = {
  
            OrderID: oOrderID,
            CustomerID: oCustomerID,
            EmployeeID: oEmployeeID,
            OrderDate: oOrderDate,
            RequiredDate: oRequiredDate,
            ShippedDate: oShippedDate,
            ShipVia: oShipVia,
            Freight: oFreight,
            ShipName: oShipName,
            ShipAddress: oShipAddress,
            ShipCity: oShipCity,
            ShipRegion: oShipRegion,
            ShipPostalCode: oShipPostalCode,
            ShipCountry: oShipCountry
  
          }
          oModel.create("/Orders", myData, {
            success: function (res) {
              console.log("done")
            },
            error: function (err) {
              console.log(err)
            }

          })
           this._oCreateProductDialog.close()
  
  
        },
  
        onCancelOrder: function () {
          this._oCreateProductDialog.close()
        },
  
        onDeletePress: function () {
            // Get the selected items from the table
            var oTable = this.getView().byId("t1");
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
          debugger;
          if (sQuery) {
            // Convert the search query to an integer
            var iQuery = parseInt(sQuery);
            if (!isNaN(sQuery)) {
              aFilter.push(new Filter("OrderID", FilterOperator.EQ, iQuery));
            }
          }
  
          // filter binding
          var oTable = this.getView().byId("t1");
          var oBinding = oTable.getBinding("items");
          oBinding.filter(aFilter);
        },
        // onUploadSelectedButton: function () {
        //   var oUploadSet = this.byId("t1");
  
        //   oUploadSet.getItems().forEach(function (oItem) {
        //     if (oItem.getListItem().getSelected()) {
        //       oUploadSet.uploadItem(oItem);
        //     }
        //   });
        // },
        // onDownloadSelectedButton: function () {
        //   var oUploadSet = this.byId("t1");
  
        //   oUploadSet.getItems().forEach(function (oItem) {
        //     if (oItem.getListItem().getSelected()) {
        //       oItem.download(true);
        //     }
        //   });
        // },
        // onSelectionChange: function () {
        //   var oUploadSet = this.byId("t1");
        //   // If there's any item selected, sets version button enabled
        //   if (oUploadSet.getSelectedItems().length > 0) {
        //     if (oUploadSet.getSelectedItems().length === 1) {
        //       this.byId("versionButton").setEnabled(true);
        //     } else {
        //       this.byId("versionButton").setEnabled(false);
        //     }
        //   } else {
        //     this.byId("versionButton").setEnabled(false);
        //   }
        // },
        onUpdatePress: function () {
          var oTable = this.getView().byId("t1");
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
              name: "com.sap.northwindcompanyy.view.fragment.Orderupdate",
              controller: this
            }).then(function (oDialog) {
              that._oUpdateDialog = oDialog;
              that.getView().addDependent(oDialog);
  
              // Set the model to the dialog to enable two-way data binding
              that._oUpdateDialog.setModel(oModel);
  
              // Set the binding context to the dialog
              that._oUpdateDialog.setBindingContext(oContext);
  
              // Access controls using byId from the fragment
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateOrderID").setValue(oData.OrderID);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateCustomerID").setValue(oData.CustomerID);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateEmployeeID").setValue(oData.EmployeeID);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateOrderDate").setValue(oData.OrderDate);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateRequiredDate").setValue(oData.RequiredDate);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShippedDate").setValue(oData.ShippedDate);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipVia").setValue(oData.ShipVia);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateFreight").setValue(oData.Freight);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipName").setValue(oData.ShipName);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipAddress").setValue(oData.ShipAddress);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipCity").setValue(oData.ShipCity);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipRegion").setValue(oData.ShipRegion);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipPostalCode").setValue(oData.ShipPostalCode);
              sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipCountry").setValue(oData.ShipCountry);
  
              that._oUpdateDialog.open();
            });
          } else {
            // Set the binding context to the dialog
            this._oUpdateDialog.setBindingContext(oContext);
  
            // Access controls using byId from the fragment
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateOrderID").setValue(oData.OrderID);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateCustomerID").setValue(oData.CustomerID);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateEmployeeID").setValue(oData.EmployeeID);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateOrderDate").setValue(oData.OrderDate);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateRequiredDate").setValue(oData.RequiredDate);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShippedDate").setValue(oData.ShippedDate);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipVia").setValue(oData.ShipVia);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateFreight").setValue(oData.Freight);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipName").setValue(oData.ShipName);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipAddress").setValue(oData.ShipAddress);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipCity").setValue(oData.ShipCity);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipRegion").setValue(oData.ShipRegion);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipPostalCode").setValue(oData.ShipPostalCode);
            sap.ui.core.Fragment.byId(that.getView().getId(), "UpdateShipCountry").setValue(oData.ShipCountry);
  
            this._oUpdateDialog.open();
          }
        },
        updateOrder: function () {
          var sUpdatedOrderID = this.byId("UpdateOrderID").getValue();
          var sUpdatedCustomerID = this.byId("UpdateCustomerID").getValue();
          var sUpdatedEmployeeID = this.byId("UpdateEmployeeID").getValue();
          var sUpdatedOrderDate = this.byId("UpdateOrderDate").getValue();
          var sUpdatedRequiredDate = this.byId("UpdateRequiredDate").getValue();
          var sUpdatedShippedDate = this.byId("UpdateShippedDate").getValue();
          var sUpdatedShipVia = this.byId("UpdateShipVia").getValue();
          var sUpdatedFreight = this.byId("UpdateFreight").getValue();
          var sUpdatedShipName = this.byId("UpdateShipName").getValue();
          var sUpdatedShipAddress = this.byId("UpdateShipAddress").getValue();
          var sUpdatedShipCity = this.byId("UpdateShipCity").getValue();
          var sUpdatedShipRegion = this.byId("UpdateShipRegion").getValue();
          var sUpdatedShipPostalCode = this.byId("UpdateShipPostalCode").getValue();
          var sUpdatedShipCountry = this.byId("UpdateShipCountry").getValue();
  
          var oTable = this.byId("t1");
          var aSelectedItems = oTable.getSelectedItems();
  
          if (aSelectedItems.length !== 1) {
            MessageToast.show("Please select exactly one item for update");
            return;
          }
  
          var oSelectedItem = aSelectedItems[0];
          var oContext = oSelectedItem.getBindingContext();
          var oModel = oContext.getModel();
  
          // Update the data in the model
          oModel.setProperty(oContext.getPath() + "/OrderID", sUpdatedOrderID);
          oModel.setProperty(oContext.getPath() + "/CustomerID", sUpdatedCustomerID);
          oModel.setProperty(oContext.getPath() + "/EmployeeID", sUpdatedEmployeeID);
          oModel.setProperty(oContext.getPath() + "/OrderDate", sUpdatedOrderDate);
          oModel.setProperty(oContext.getPath() + "/RequiredDate", sUpdatedRequiredDate);
          oModel.setProperty(oContext.getPath() + "/ShippedDate", sUpdatedShippedDate);
          oModel.setProperty(oContext.getPath() + "/ShipVia", sUpdatedShipVia);
          oModel.setProperty(oContext.getPath() + "/Freight", sUpdatedFreight);
          oModel.setProperty(oContext.getPath() + "/ShipName", sUpdatedShipName);
          oModel.setProperty(oContext.getPath() + "/ShipAddress", sUpdatedShipAddress);
          oModel.setProperty(oContext.getPath() + "/ShipCity", sUpdatedShipCity);
          oModel.setProperty(oContext.getPath() + "/ShipRegion", sUpdatedShipRegion);
          oModel.setProperty(oContext.getPath() + "/ShipPostalCode", sUpdatedShipPostalCode);
          oModel.setProperty(oContext.getPath() + "/ShipCountry", sUpdatedShipCountry);
  
  
          // Update the data in the backend
          oModel.submitChanges({
            success: function () {
              // Update the data in the table
              oTable.getModel().refresh();
  
              // Close the dialog
              this.byId("fr1").close();
  
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
            { label: 'Order ID', property: 'OrderID' },
            { label: 'Customer ID', property: 'CustomerID' },
            { label: 'Employee ID', property: 'EmployeeID' },
            { label: 'Order Date', property: 'OrderDate' },
            { label: 'Required Date', property: 'RequiredDate' },
            { label: 'Shipped Date', property: 'ShippedDate' },
            { label: 'Ship Via', property: 'ShipVia' },
            { label: 'Freight', property: 'Freight' },
            { label: 'Ship Name', property: 'ShipName' },
            { label: 'Ship Address', property: 'ShipAddress' },
            { label: 'Ship City', property: 'ShipCity' },
            { label: 'Ship Region', property: 'ShipRegion' },
            { label: 'Ship PostalCode', property: 'ShipPostalCode' },
            { label: 'Ship Country', property: 'ShipCountry' },
  
          ];
        },
  
        onExport: function () {
          var oTable = this.byId('t1');
          var oRowBinding = oTable.getBinding('items');
          var aCols = this.createColumnConfig();
  
          var oSettings = {
            workbook: {
              columns: aCols,
              hierarchyLevel: 'Level'
            },
            dataSource: oRowBinding,
            fileName: 'Orders.xlsx',
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
              // No file selected
              console.error("No file selected");
              return;
          }
     
          var reader = new FileReader();
     
          reader.onload = function (e) {
              var csvData = e.target.result;
     
              if (!csvData) {
                  // Empty file
                  console.error("Empty file");
                  return;
              }
     
              var jsonData = this.convertCsvToJson(csvData);
     
              if (jsonData.length > 0) {
                  // send to backend json data via odata call
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
          var headers = lines[0].split(',');
          for (var i = 1; i < lines.length; i++) {
              var obj = {};
              var currentLine = lines[i].split(',');
     
                  for (var j = 0; j < headers.length; j++) {
                      obj[headers[j]] = currentLine[j];
                  }
     
                  result.push(obj);
             
          }
     
          return JSON.stringify(result);
      },
     
     
      sendDataToBackend: function (jsonData) {
          // Perform OData call to send jsonData to the backend
          // Example: Assume there is an OData model named 'oModel'
          var oModel = this.getView().getModel();
          let oFileData = JSON.parse(jsonData.replace(/\\r/g, ''));
          console.log(oFileData);
          oFileData = oFileData.filter(function(item) {
            return item.OrderID !== "";
          });
          for (var i = 0; i < oFileData.length; i++) {
            let myData = {
   
              OrderID: parseInt(oFileData[i].OrderID),
              CustomerID: oFileData[i].CustomerID,
              EmployeeID: parseInt(oFileData[i].EmployeeID),
              OrderDate: oFileData[i].OrderDate,
              RequiredDate: oFileData[i].RequiredDate,
              ShippedDate: oFileData[i].ShippedDate,
              ShipVia: parseInt(oFileData[i].ShipVia),
              Freight: oFileData[i].Freight,
              ShipName: oFileData[i].ShipName,
              ShipAddress: oFileData[i].ShipAddress,
              ShipCity: oFileData[i].ShipCity,
              ShipRegion: oFileData[i].ShipRegion,
              ShipPostalCode: oFileData[i].ShipPostalCode,
              ShipCountry: oFileData[i].ShipCountry,
            };
              oModel.create("/Orders", myData, {
                  success: function (oRes) {
                      // Handle success
                      console.log(oRes);
   
                  },
                  error: function (oErr) {
                    console.log(oErr);
                  }
              });
          }
      }
        
        
      });
    }
  );