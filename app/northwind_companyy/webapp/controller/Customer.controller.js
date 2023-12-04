sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/export/Spreadsheet" 
], function (BaseController, MessageToast, Fragment,Filter,FilterOperator ,Spreadsheet) {
  "use strict";

  return BaseController.extend("com.sap.northwindcompanyy.controller.Customer", {
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
      if (!this._oCreateProductDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: "com.sap.northwindcompanyy.view.fragment.Customer",
          controller: this
        }).then(oDialog => {
          this._oCreateProductDialog = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      } else {
        this._oCreateProductDialog.open();
      }
    },

    confirmOrder: function () {
      let oModel = this.getOwnerComponent().getModel();
      let oCustomerID = this.getView().byId("inputCustomerID").getValue();
      let oCompanyName = this.getView().byId("inputCompanyName").getValue();
      let oContactName = this.getView().byId("inputContactName").getValue();
      let oContactTitle = this.getView().byId("inputContactTitle").getValue();
      let oAddress = this.getView().byId("inputAddress").getValue();
      let oCity = this.getView().byId("inputCity").getValue();
      let oRegion = this.getView().byId("inputRegion").getValue();
      let oPostalCode = this.getView().byId("inputPostalCode").getValue();
      let oCountry = this.getView().byId("inputCountry").getValue();
      let oPhone = this.getView().byId("inputPhone").getValue();
      let oFax = this.getView().byId("inputFax").getValue();

      let myData = {
        CustomerID: oCustomerID,
        CompanyName: oCompanyName,
        ContactName: oContactName,
        ContactTitle: oContactTitle,
        Address: oAddress,
        City: oCity,
        Region: oRegion,
        PostalCode: oPostalCode,
        Country: oCountry,
        Phone: oPhone,
        Fax: oFax
      };

      oModel.create("/Customers", myData, {
        success: function (res) {
          MessageToast.show("Data saved successfully!");
          this.onCancelOrder();
        }.bind(this),
        error: function (err) {
          console.error("Error while saving data:", err);
          MessageToast.show("Error occurred while saving data");
        }
      });
    },

    onCancelOrder: function () {
      this.getView().byId("inputCustomerID").setValue("");
      this.getView().byId("inputCompanyName").setValue("");
      this.getView().byId("inputContactName").setValue("");
      this.getView().byId("inputContactTitle").setValue("");
      this.getView().byId("inputAddress").setValue("");
      this.getView().byId("inputCity").setValue("");
      this.getView().byId("inputRegion").setValue("");
      this.getView().byId("inputPostalCode").setValue("");
      this.getView().byId("inputCountry").setValue("");
      this.getView().byId("inputPhone").setValue("");
      this.getView().byId("inputFax").setValue("");
      this._oCreateProductDialog.close();
    },

    onDelete: function () {
      var oTable = this.getView().byId("idProductsTable");
      var aSelectedItems = oTable.getSelectedItems();

      if (aSelectedItems.length === 0) {
        MessageToast.show("No items selected for deletion");
        return;
      }

      var that = this;
      sap.m.MessageBox.confirm("Are you sure you want to delete the selected items?", {
        title: "Confirm Deletion",
        onClose: function (oAction) {
          if (oAction === sap.m.MessageBox.Action.OK) {
            that.performDelete(aSelectedItems);
          }
        }
      });
    },

    performDelete: function (aSelectedItems) {
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
            MessageToast.show("Error occurred while deleting item");
          }
        });
      });
    },

    onFilter: function (oEvent) {
      this.sSearchQuery = oEvent.getSource().getValue();
      this.fnApplyFiltersAndOrdering();
    },
    
    fnApplyFiltersAndOrdering: function () {
      var aFilters = [];
    
      if (this.sSearchQuery) {
 
        aFilters.push(new sap.ui.model.Filter("CustomerID", sap.ui.model.FilterOperator.Contains, this.sSearchQuery));
      }
    
     
      var oTable = this.getView().byId("idProductsTable");
      var oBinding = oTable.getBinding("items");
      oBinding.filter(aFilters);
    },
    onUpdate: function () {
    
      var oTable = this.getView().byId("idProductsTable");
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
              name: "com.sap.northwindcompanyy.view.fragment.CustomerUpdate",
              controller: this
          }).then(oDialog => {
              this._oUpdateCustomerDialog = oDialog;
              this.getView().addDependent(oDialog);
  
              this.getView().byId("UpdateCustomerID").setValue(oSelectedData.CustomerID);
              this.getView().byId("UpdateCompanyName").setValue(oSelectedData.CompanyName);
              this.getView().byId("UpdateContactName").setValue(oSelectedData.ContactName);
              this.getView().byId("UpdateContactTitle").setValue(oSelectedData.ContactTitle);
              this.getView().byId("UpdateAddress").setValue(oSelectedData.Address);
              this.getView().byId("UpdateCity").setValue(oSelectedData.City);
              this.getView().byId("UpdateRegion").setValue(oSelectedData.Region);
              this.getView().byId("UpdatePostalCode").setValue(oSelectedData.PostalCode);
              this.getView().byId("UpdateCountry").setValue(oSelectedData.Country);
              this.getView().byId("UpdatePhone").setValue(oSelectedData.Phone);
              this.getView().byId("UpdateFax").setValue(oSelectedData.Fax);
  
              oDialog.open();
          });
      } else {
          this.getView().byId("UpdateCustomerID").setValue(oSelectedData.CustomerID);
          this.getView().byId("UpdateCompanyName").setValue(oSelectedData.CompanyName);
          this.getView().byId("UpdateContactName").setValue(oSelectedData.ContactName);
          this.getView().byId("UpdateContactTitle").setValue(oSelectedData.ContactTitle);
          this.getView().byId("UpdateAddress").setValue(oSelectedData.Address);
          this.getView().byId("UpdateCity").setValue(oSelectedData.City);
          this.getView().byId("UpdateRegion").setValue(oSelectedData.Region);
          this.getView().byId("UpdatePostalCode").setValue(oSelectedData.PostalCode);
          this.getView().byId("UpdateCountry").setValue(oSelectedData.Country);
          this.getView().byId("UpdatePhone").setValue(oSelectedData.Phone);
          this.getView().byId("UpdateFax").setValue(oSelectedData.Fax);
  
          this._oUpdateCustomerDialog.open();
      }
  },
  
  confirmUpdate: function () {

      var oCustomerID = this.getView().byId("UpdateCustomerID").getValue();
      var oCompanyName = this.getView().byId("UpdateCompanyName").getValue();
      var oContactName = this.getView().byId("UpdateContactName").getValue();
      var oContactTitle = this.getView().byId("UpdateContactTitle").getValue();
      var oAddress = this.getView().byId("UpdateAddress").getValue();
      var oCity = this.getView().byId("UpdateCity").getValue();
      var oRegion = this.getView().byId("UpdateRegion").getValue();
      var oPostalCode = this.getView().byId("UpdatePostalCode").getValue();
      var oCountry = this.getView().byId("UpdateCountry").getValue();
      var oPhone = this.getView().byId("UpdatePhone").getValue();
      var oFax = this.getView().byId("UpdateFax").getValue();
  
      var oTable = this.getView().byId("idProductsTable");
      var oSelectedItem = oTable.getSelectedItem();
  
      if (!oSelectedItem) {
          MessageToast.show("No item selected for update");
          return;
      }

      var oContext = oSelectedItem.getBindingContext();
  

      oContext.getModel().update(oContext.getPath(), {
          CustomerID: oCustomerID,
          CompanyName: oCompanyName,
          ContactName: oContactName,
          ContactTitle: oContactTitle,
          Address: oAddress,
          City: oCity,
          Region: oRegion,
          PostalCode: oPostalCode,
          Country: oCountry,
          Phone: oPhone,
          Fax: oFax
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
  createColumnConfig: function() {
    return [
        { label: 'Customer ID', property: 'CustomerID' },
        { label: 'Company Name', property: 'CompanyName' },
        { label: 'Contact Name', property: 'ContactName' },
        { label: 'Contact Title', property: 'ContactTitle' },
        { label: 'Address', property: 'Address' },
        { label: 'City', property: 'City' },
        { label: 'Region', property: 'Region' },
        { label: 'Postal Code', property: 'PostalCode' },
        { label: 'Country', property: 'Country' },
        { label: 'Phone', property: 'Phone' },
        { label: 'Fax', property: 'Fax' }
    ];
},

   
  onExport: function() {
    var oTable = this.byId('idProductsTable');
    var oRowBinding = oTable.getBinding('items');
    var aCols = this.createColumnConfig();

    var oSettings = {
        workbook: {
            columns: aCols,
            hierarchyLevel: 'Level'
        },
        dataSource: oRowBinding,
        fileName: 'Table_export_Customer_details.xlsx',
        worker: false
    };

    var oSheet = new sap.ui.export.Spreadsheet(oSettings);
    oSheet.build().finally(function() {
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

   
        if (currentLine[headers.indexOf('EmployeeID')].trim() !== '') {
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
        oModel.create("/Employees", jsonData[i], {
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
