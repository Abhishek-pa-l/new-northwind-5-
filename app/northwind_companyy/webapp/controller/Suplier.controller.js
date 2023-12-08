sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet",
 
   
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, MessageToast, Filter, FilterOperator, Spreadsheet) {
        "use strict";
 
        return Controller.extend("com.sap.northwindcompanyy.controller.Suplier", {
            onInit: function () {
 
            },
            onAddPress: function () {
 
                if (!this._oCreateProductDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "com.sap.northwindcompanyy.view.fragment.Suplieradd",
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
                let oSupplierID = this.getView().byId("SupplierID").getValue();
                let oCompanyName = this.getView().byId("CompanyName").getValue();
                let oContactName = this.getView().byId("ContactName").getValue();
                let oContactTitle = this.getView().byId("ContactTitle").getValue();
                let oAddress = this.getView().byId("Address").getValue();
                let oCity = this.getView().byId("City").getValue();
                let oRegion = this.getView().byId("Region").getValue();
                let oPostalCode = this.getView().byId("PostalCode").getValue();
                let oCountry = this.getView().byId("Country").getValue();
                let oPhone = this.getView().byId("Phone").getValue();
                let oFax = this.getView().byId("Fax").getValue();
                let oHomePage = this.getView().byId("HomePage").getValue();
 
                let myData = {
                    SupplierID: oSupplierID,
                    CompanyName: oCompanyName,
                    ContactName: oContactName,
                    ContactTitle: oContactTitle,
                    Address: oAddress,
                    City: oCity,
                    Region: oRegion,
                    PostalCode: oPostalCode,
                    Country: oCountry,
                    Phone: oPhone,
                    Fax: oFax,
                    HomePage: oHomePage
 
 
 
 
 
                }
 
                oModel.create("/Suppliers", myData, {
                    success: function (res) {
                        MessageToast.show("Data added successfully");
                        this._oCreateProductDialog.close()
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
 
 
 
            },
            onCancelOrder: function () {
                this._oCreateProductDialog.close()
            },
            onDeletePress: function () {
                // Get the selected items from the table
                var oTable = this.getView().byId("supplierTable");
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
                            MessageToast.show("Item Deleted Successfully")
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
                        aFilter.push(new Filter("SupplierID", FilterOperator.EQ, iQuery));
                    }
                }
 
                // filter binding
                var oTable = this.getView().byId("supplierTable");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilter);
            },
            onUpdatePress: function () {
                var oTable = this.getView().byId("supplierTable");
                var oSelectedItem = oTable.getSelectedItem();
 
 
                if (!oSelectedItem) {
                    MessageToast.show("No item selected for update");
                    return;
                }
 
 
                var oContext = oSelectedItem.getBindingContext();
                var oSelectedData = oContext.getObject();
 
 
                if (!this._oUpdateCustomerDialog) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "com.sap.northwindcompanyy.view.fragment.Suplierupdate",
                        controller: this
                    }).then(oDialog => {
                        this._oUpdateCustomerDialog = oDialog;
                        this.getView().addDependent(oDialog);
 
                        this.getView().byId("uSupplierID").setValue(oSelectedData.SupplierID);
                        this.getView().byId("uCompanyName").setValue(oSelectedData.CompanyName);
                        this.getView().byId("uContactName").setValue(oSelectedData.ContactName);
                        this.getView().byId("uContactTitle").setValue(oSelectedData.ContactTitle);
                        this.getView().byId("uAddress").setValue(oSelectedData.Addres);
                        this.getView().byId("uCity").setValue(oSelectedData.City);
                        this.getView().byId("uRegion").setValue(oSelectedData.Region);
                        this.getView().byId("uPostalCode").setValue(oSelectedData.PostalCode);
                        this.getView().byId("uCountry").setValue(oSelectedData.Country);
                        this.getView().byId("uPhone").setValue(oSelectedData.Phone);
                        this.getView().byId("uFax").setValue(oSelectedData.Fax);
                        this.getView().byId("uHomePage").setValue(oSelectedData.HomePage);
 
 
 
                        oDialog.open();
                    });
                } else {
                    this.getView().byId("uSupplierID").setValue(oSelectedData.SupplierID);
                    this.getView().byId("uCompanyName").setValue(oSelectedData.CompanyName);
                    this.getView().byId("uContactName").setValue(oSelectedData.ContactName);
                    this.getView().byId("uContactTitle").setValue(oSelectedData.ContactTitle);
                    this.getView().byId("uAddress").setValue(oSelectedData.Addres);
                    this.getView().byId("uCity").setValue(oSelectedData.City);
                    this.getView().byId("uRegion").setValue(oSelectedData.Regio);
                    this.getView().byId("uPostalCode").setValue(oSelectedData.PostalCode);
                    this.getView().byId("uCountry").setValue(oSelectedData.Country);
                    this.getView().byId("uPhone").setValue(oSelectedData.Phone);
                    this.getView().byId("uFax").setValue(oSelectedData.Fax);
                    this.getView().byId("uHomePage").setValue(oSelectedData.HomePage);
 
                    this._oUpdateCustomerDialog.open();
                }
            },
 
            confirmUpdate: function () {
 
                let oSupplierID = this.getView().byId("uSupplierID").getValue();
                let oCompanyName = this.getView().byId("uCompanyName").getValue();
                let oContactName = this.getView().byId("uContactName").getValue();
                let oContactTitle = this.getView().byId("uContactTitle").getValue();
                let oAddress = this.getView().byId("uAddress").getValue();
                let oCity = this.getView().byId("uCity").getValue();
                let oRegion = this.getView().byId("uRegion").getValue();
                let oPostalCode = this.getView().byId("uPostalCode").getValue();
                let oCountry = this.getView().byId("uCountry").getValue();
                let oPhone = this.getView().byId("uPhone").getValue();
                let oFax = this.getView().byId("uFax").getValue();
                let oHomePage = this.getView().byId("uHomePage").getValue();
 
                var oTable = this.getView().byId("supplierTable");
                var oSelectedItem = oTable.getSelectedItem();
 
                if (!oSelectedItem) {
                    MessageToast.show("No item selected for update");
                    return;
                }
 
                var oContext = oSelectedItem.getBindingContext();
 
 
                oContext.getModel().update(oContext.getPath(), {
                    SupplierID: oSupplierID,
                    CompanyName: oCompanyName,
                    ContactName: oContactName,
                    ContactTitle: oContactTitle,
                    Address: oAddress,
                    City: oCity,
                    Region: oRegion,
                    PostalCode: oPostalCode,
                    Country: oCountry,
                    Phone: oPhone,
                    Fax: oFax,
                    HomePage: oHomePage
                }, {
                    success: function () {
                        MessageToast.show("Data updated successfully");
                    },
                    error: function (err) {
                        console.error("Error updating data:", err);
                    }
                });
                this._oUpdateCustomerDialog.close();
            },
 
            onCancelUpdate: function () {
                this._oUpdateCustomerDialog.close();
            },
            createColumnConfig: function () {
                return [
                    { label: 'SupplierID', property: 'SupplierID' },
                    { label: 'CompanyName', property: 'CompanyName' },
                    { label: 'ContactName', property: 'ContactName' },
                    { label: 'ContactTitle', property: 'ContactTitle' },
                    { label: 'Address', property: 'Address' },
                    { label: 'City', property: 'City' },
                    { label: 'Region', property: 'Region' },
                    { label: 'PostalCode', property: 'PostalCode' },
                    { label: 'Country', property: 'Country' },
                    { label: 'Phone', property: 'Phone' },
                    { label: 'Fax', property: 'Fax' },
                    { label: 'Homepage', property: 'HomePage' },
 
                ]
            },
            onExport: function () {
                var oTable = this.byId('supplierTable');
                var oRowBinding = oTable.getBinding('items');
                var aCols = this.createColumnConfig();
 
                var oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Suppliers.xlsx',
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
            
               
                    if (currentLine[headers.indexOf('SupplierID')].trim() !== '') {
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
                    oModel.create("/Suppliers", jsonData[i], {
                        success: function () {
                           MessageToast.show("Done");
                        },
                        error: function () {
                 
                        }
                    });
                }
            }
        });
    });