sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/FilterOperator",
],
    function (Controller, MessageToast, Fragment, Filter, FilterOperator, Spreadsheet) {
        "use strict";
 
        return Controller.extend("com.sap.northwindcompanyy.controller.Region", {
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
                        name: "com.sap.northwindcompanyy.view.fragment.Regionupdate",
                        controller: this
                    }).then(function (oDialog) {
                        that._oUpdateDialog = oDialog;
                        that.getView().addDependent(oDialog);
 
                        // Set the model to the dialog to enable two-way data binding
                        that._oUpdateDialog.setModel(oModel);
 
                        // Set the binding context to the dialog
                        that._oUpdateDialog.setBindingContext(oContext);
 
                        // Access controls using byId from the fragment
                        sap.ui.core.Fragment.byId(that.getView().getId(), "Reg1").setValue(oData.RegionID);
                        sap.ui.core.Fragment.byId(that.getView().getId(), "desc1").setValue(oData.RegionDescription);
 
                        that._oUpdateDialog.open();
                    });
                } else {
                    // Set the binding context to the dialog
                    this._oUpdateDialog.setBindingContext(oContext);
 
                    // Access controls using byId from the fragment
                    sap.ui.core.Fragment.byId(this.getView().getId(), "Reg1").setValue(oData.RegionID);
                    sap.ui.core.Fragment.byId(this.getView().getId(), "desc1").setValue(oData.RegionDescription);
 
                    this._oUpdateDialog.open();
                }
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
                    if (currentLine[headers.indexOf('RegionID')].trim() !== '') {
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
                    oModel.create("/Regions", jsonData[i], {
                        success: function () {
                            // Handle success
                        },
                        error: function () {
                 
                        }
                    });
                }
            },
             
           
            onUpdate: function () {
                var sUpdatedRegionID = this.byId("Reg1").getValue();
                var sUpdatedRegionDescription = this.byId("desc1").getValue();
 
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
                oModel.setProperty(oContext.getPath() + "/RegionID", sUpdatedRegionID);
                oModel.setProperty(oContext.getPath() + "/RegionDescription", sUpdatedRegionDescription);
 
                // Update the data in the backend
                oModel.submitChanges({
                    success: function () {
                        // Update the data in the table
                        oTable.getModel().refresh();
 
                        // Close the dialog
                        this.byId("up1").close();
 
                        // Optional: Show a success message
                        MessageToast.show("Update successful");
                    }.bind(this),
                    error: function () {
                        // Handle errors if needed
                        MessageToast.show("Update failed");
                    }
                });
            },
 
            createColumnConfig: function () {
                return [
                    { label: 'Region ID', property: 'RegionID' },
                    { label: 'Region Description', property: 'RegionDescription' },
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
                    fileName: 'Regions_Table_Export.xlsx',
                    worker: false
                };
 
                var oSheet = new sap.ui.export.Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
 
            onAddPress: function () {
 
 
                if (!this._oCreateProductDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "com.sap.northwindcompanyy.view.fragment.Regionadd",
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
            onPressConfirm: function () {
                let oModel = this.getOwnerComponent().getModel();
                let oRegionID = this.getView().byId("RegionID").getValue();
                let oRegionDescID = this.getView().byId("RegionDescription").getValue();
 
                let myData = {
                    RegionID: oRegionID,
                    RegionDescription: oRegionDescID,
                }
 
                oModel.create("/Regions", myData, {
                    success: function (res) {
                        MessageToast.show("Data added successfully");
                        this._oCreateProductDialog.close();
                    }.bind(this),
                    error: function (err) {
                        console.error(err);
                        // You can show an error message if needed
                        MessageToast.show("Error occurred while saving data");
                    }
                });
            },
            onFilter: function (oEvent) {
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
                        aFilters.push(new sap.ui.model.Filter("RegionID", sap.ui.model.FilterOperator.EQ, iQuery));
                    }
                }
 
                // Apply filters and ordering
                var oTable = this.getView().byId("t1");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilters);
            },
 
            onPressCancel: function () {
 
                // Clear the entered form data in the dialog
                this.getView().byId("RegionID").setValue("");
                this.getView().byId("RegionDescription").setValue("");
 
                // Close the dialog
                this._oCreateProductDialog.close();
            },
            onCancel: function () {
                this._oUpdateDialog.close();
            },
 
            onImportPress: function (oEvent) {
                var oModel = this.getView().getModel();
                var iResponseStatus = oEvent.getParameter("status");
 
                // check for upload is sucess
                if (iResponseStatus === 201) {
                    oModel.refresh(true);
                    setTimeout(function () {
                        MessageToast.show("Document Added");
                    }, 1000);
                }
                // This code block is only for demonstration purpose to simulate XHR requests, hence restoring the server to not fake the xhr requests.
                this.oMockServer.restore();
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
            }
        });
    });
 