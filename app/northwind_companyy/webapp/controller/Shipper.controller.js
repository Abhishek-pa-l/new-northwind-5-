sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/routing/History"
], function (Controller, Fragment, MessageToast, FilterOperator, Spreadsheet, Filter, History) {
    "use strict";
 
    return Controller.extend("com.sap.northwindcompanyy.controller.Shipper", {
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
        
        onAdd: function () {
               
 
            if (!this._oCreateShipperDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.sap.northwindcompanyy.view.fragment.Shipperadd",
                    controller: this
                }).then(oDialog => {
                    this._oCreateShipperDialog = oDialog
                    this.getView().addDependent(oDialog)
                    oDialog.open()
                })
            } else {
                this._oCreateShipperDialog.open()
            }
        },
        onConfirm: function () {
            let oModel = this.getOwnerComponent().getModel();
            let oShipperID = this.getView().byId("ShipperID").getValue();
            let oCompanyName = this.getView().byId("CompanyName").getValue();
            let oPhone = this.getView().byId("Phone").getValue();
       
            let mynewData = {
                ShipperID: oShipperID,
                CompanyName: oCompanyName,
                Phone: oPhone,
            };
       
            oModel.create("/Shippers", mynewData, {
                success: function (res) {
                    MessageToast.show("Data added successfully");
                    this._oCreateShipperDialog.close();
                }.bind(this),
                error: function (err) {
                    console.error(err);
                    // You can show an error message if needed
                    MessageToast.show("Error occurred while saving data");
                }
            });
        },
        createColumnConfig: function () {
            return [
                { label: 'Shipper ID', property: 'ShipperID' },
                { label: 'Company Name', property: 'CompanyName' },
                 { label: 'Phone', property: 'Phone' },
            ];
        },
 
        onExportTable: function () {
            var oTable = this.byId('g1');
            var oRowBinding = oTable.getBinding('items');
            var aCols = this.createColumnConfig();
 
            var oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },
                dataSource: oRowBinding,
                fileName: 'Shippers_Table_Export.xlsx',
                worker: false
            };
 
            var oSheet = new sap.ui.export.Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },
 
        onCancelButton: function () {
 
            // Clear the entered form data in the dialog
            this.getView().byId("ShipperID").setValue("");
            this.getView().byId("CompanyName").setValue("");
            this.getView().byId("Phone").setValue("");
 
            // Close the dialog
            this._oCreateShipperDialog.close();
        },
        onUpdateButton: function () {
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
 
            if (!this._oUpdateShipperDialog) {
                var that = this;  // store 'this' reference
 
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.sap.northwindcompanyy.view.fragment.Shipperupdate",
                    controller: this
                }).then(function (oDialog) {
                    that._oUpdateShipperDialog = oDialog;
                    that.getView().addDependent(oDialog);
 
                    // Set the model to the dialog to enable two-way data binding
                    that._oUpdateShipperDialog.setModel(oModel);
 
                    // Set the binding context to the dialog
                    that._oUpdateShipperDialog.setBindingContext(oContext);
 
                    // Access controls using byId from the fragment
                    sap.ui.core.Fragment.byId(that.getView().getId(), "Shi1").setValue(oData.ShipperID);
                    sap.ui.core.Fragment.byId(that.getView().getId(), "Com1").setValue(oData.CompanyName);
                     sap.ui.core.Fragment.byId(that.getView().getId(), "Ph1").setValue(oData.Phone);
 
                    that._oUpdateShipperDialog.open();
                });
            } else {
                // Set the binding context to the dialog
                this._oUpdateShipperDialog.setBindingContext(oContext);
 
                // Access controls using byId from the fragment
                sap.ui.core.Fragment.byId(this.getView().getId(), "Shi1").setValue(oData.ShipperID);
                sap.ui.core.Fragment.byId(this.getView().getId(), "Com1").setValue(oData.CompanyName);
                sap.ui.core.Fragment.byId(this.getView().getId(), "Ph1").setValue(oData.Phone);
 
                this._oUpdateShipperDialog.open();
            }
        },
        onConfirmButton: function () {
            var sUpdatedShipperID = this.byId("Shi1").getValue();
            var sUpdatedCompanyName = this.byId("Com1").getValue();
            var sUpdatedPhone = this.byId("Ph1").getValue();
 
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
            oModel.setProperty(oContext.getPath() + "/ShipperID", sUpdatedShipperID);
            oModel.setProperty(oContext.getPath() + "/CompanyName", sUpdatedCompanyName);
              oModel.setProperty(oContext.getPath() + "/Phone", sUpdatedPhone);
 
            // Update the data in the backend
            oModel.submitChanges({
                success: function () {
                    // Update the data in the table
                    oTable.getModel().refresh();
 
                    // Close the dialog
                    this.byId("SU1").close();
 
                    // Optional: Show a success message
                    MessageToast.show("Update successful");
                }.bind(this),
                error: function () {
                    // Handle errors if needed
                    MessageToast.show("Update failed");
                }
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
            var headers = lines[0].split(';');
       
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentLine = lines[i].split(';');
       
                // Check if the 'EmployeeID' field is not null or empty
                if (currentLine[headers.indexOf('ShipperID')].trim() !== '') {
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentLine[j];
                    }
       
                    result.push(obj);
                }
            }
       
            return result;
        },
       
       
        sendDataToBackend: function (jsonData) {
            // Perform OData call to send jsonData to the backend
            // Example: Assume there is an OData model named 'oModel'
            var oModel = this.getView().getModel();
       
            for (var i = 0; i < jsonData.length; i++) {
                oModel.create("/Shippers", jsonData[i], {
                    success: function () {
                        // Handle success
                    },
                    error: function () {
             
                    }
                });
            }
        },
        onCancelUpdate: function () {
            this._oUpdateShipperDialog.close();
        },
        onSearchFilter: function (oEvent) {
            this.sSearchQuery = oEvent.getSource().getValue();
            this.fnApplyFiltersAndOrdering();
        },
 
        fnApplyFiltersAndOrdering: function () {
            var aFilters = [];
 
            if (this.sSearchQuery) {
                // Convert the search query to an integer
                var iQuery = parseInt(this.sSearchQuery, 10);
 
                if (!isNaN(iQuery)) {
                    // Apply filter based on CustomerID as an integer
                    aFilters.push(new sap.ui.model.Filter("ShipperID", sap.ui.model.FilterOperator.EQ, iQuery));
                }
            }
 
            // Apply filters and ordering
            var oTable = this.getView().byId("g1");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
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
        }
    });
});
