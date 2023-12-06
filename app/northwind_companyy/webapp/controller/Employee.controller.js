sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/export/Spreadsheet" 
], function (BaseController, MessageToast, Fragment, Filter, FilterOperator,Spreadsheet) {
  "use strict";

  return BaseController.extend("com.sap.northwindcompanyy.controller.Employee", {
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
          if (!this._oCreateEmployeeDialog) {
              Fragment.load({
                  id: this.getView().getId(),
                  name: "com.sap.northwindcompanyy.view.fragment.Employee",
                  controller: this
              }).then(oDialog => {
                  this._oCreateEmployeeDialog = oDialog;
                  this.getView().addDependent(oDialog);
                  oDialog.open();
              });
          } else {
              this._oCreateEmployeeDialog.open();
          }
      },

      confirmOrder: function () {
          let oModel = this.getOwnerComponent().getModel();
          let oEmployeeID = this.getView().byId("inputEmployeeID").getValue();
          let oLastName = this.getView().byId("inputLastName").getValue();
          let oFirstName = this.getView().byId("inputFirstName").getValue();
          let oTitle = this.getView().byId("inputTitle").getValue();
          let oTitleOfCourtesy = this.getView().byId("inputTitleOfCourtesy").getValue();
          let oBirthDate = this.getView().byId("inputBirthDate").getValue();
          let oHireDate = this.getView().byId("inputHireDate").getValue();
          let oAddress = this.getView().byId("inputAddress").getValue();
          let oCity = this.getView().byId("inputCity").getValue();
          let oRegion = this.getView().byId("inputRegion").getValue();
          let oPostalCode = this.getView().byId("inputPostalCode").getValue();
          let oCountry = this.getView().byId("inputCountry").getValue();
          let oHomePhone = this.getView().byId("inputHomePhone").getValue();
          let oExtension = this.getView().byId("inputExtension").getValue();
          let oNotes = this.getView().byId("inputNotes").getValue();
          let oReportsTo = this.getView().byId("inputReportsTo").getValue();

          let myData = {
              EmployeeID: oEmployeeID,
              LastName: oLastName,
              FirstName: oFirstName,
              Title: oTitle,
              TitleOfCourtesy: oTitleOfCourtesy,
              BirthDate: oBirthDate,
              HireDate: oHireDate,
              Address: oAddress,
              City: oCity,
              Region: oRegion,
              PostalCode: oPostalCode,
              Country: oCountry,
              HomePhone: oHomePhone,
              Extension: oExtension,
              Notes: oNotes,
              ReportsTo: oReportsTo
          };

          oModel.create("/Employees", myData, {
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
          this.getView().byId("inputEmployeeID").setValue("");
          this.getView().byId("inputLastName").setValue("");
          this.getView().byId("inputFirstName").setValue("");
          this.getView().byId("inputTitle").setValue("");
          this.getView().byId("inputTitleOfCourtesy").setValue("");
          this.getView().byId("inputBirthDate").setValue("");
          this.getView().byId("inputHireDate").setValue("");
          this.getView().byId("inputAddress").setValue("");
          this.getView().byId("inputCity").setValue("");
          this.getView().byId("inputRegion").setValue("");
          this.getView().byId("inputPostalCode").setValue("");
          this.getView().byId("inputCountry").setValue("");
          this.getView().byId("inputHomePhone").setValue("");
          this.getView().byId("inputExtension").setValue("");
          this.getView().byId("inputNotes").setValue("");
          this.getView().byId("inputReportsTo").setValue("");

          this._oCreateEmployeeDialog.close();
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
       
          var iQuery = parseInt(this.sSearchQuery, 10);
       
          if (!isNaN(iQuery)) {
           
            aFilters.push(new sap.ui.model.Filter("EmployeeID", sap.ui.model.FilterOperator.EQ, iQuery));
          }
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
    
      
        if (!this._oUpdateEmployeeDialog) {
            Fragment.load({
                id: this.getView().getId(),
                name: "com.sap.northwindcompanyy.view.fragment.Update",
                controller: this
            }).then(oDialog => {
                this._oUpdateEmployeeDialog = oDialog;
                this.getView().addDependent(oDialog);
    
                this.getView().byId("UpdateEmployeeID").setValue(oSelectedData.EmployeeID);
        this.getView().byId("UpdateLastName").setValue(oSelectedData.LastName);
        this.getView().byId("UpdateFirstName").setValue(oSelectedData.FirstName);
        this.getView().byId("UpdateTitle").setValue(oSelectedData.Title);
        this.getView().byId("UpdateCity").setValue(oSelectedData.City);
        this.getView().byId("UpdateCountry").setValue(oSelectedData.Country);
        this.getView().byId("UpdateTitleOfCourtesy").setValue(oSelectedData.TitleOfCourtesy);
        this.getView().byId("UpdateBirthDate").setValue(oSelectedData.BirthDate);
        this.getView().byId("UpdateHireDate").setValue(oSelectedData.HireDate);
        this.getView().byId("UpdateAddress").setValue(oSelectedData.Address);
        this.getView().byId("UpdateRegion").setValue(oSelectedData.Region);
        this.getView().byId("UpdatePostalCode").setValue(oSelectedData.PostalCode);
        this.getView().byId("UpdateCountry").setValue(oSelectedData.Country);
        this.getView().byId("UpdateHomePhone").setValue(oSelectedData.HomePhone);
        this.getView().byId("UpdateExtension").setValue(oSelectedData.Extension);
        this.getView().byId("UpdateNotes").setValue(oSelectedData.Notes);
        this.getView().byId("UpdateReportsTo").setValue(oSelectedData.ReportsTo);
               
    
    
                oDialog.open();
            });
        } else {
            this.getView().byId("UpdateEmployeeID").setValue(oSelectedData.EmployeeID);
        this.getView().byId("UpdateLastName").setValue(oSelectedData.LastName);
        this.getView().byId("UpdateFirstName").setValue(oSelectedData.FirstName);
        this.getView().byId("UpdateTitle").setValue(oSelectedData.Title);
        this.getView().byId("UpdateCity").setValue(oSelectedData.City);
        this.getView().byId("UpdateCountry").setValue(oSelectedData.Country);
        this.getView().byId("UpdateTitleOfCourtesy").setValue(oSelectedData.TitleOfCourtesy);
        this.getView().byId("UpdateBirthDate").setValue(oSelectedData.BirthDate);
        this.getView().byId("UpdateHireDate").setValue(oSelectedData.HireDate);
        this.getView().byId("UpdateAddress").setValue(oSelectedData.Address);
        this.getView().byId("UpdateRegion").setValue(oSelectedData.Region);
        this.getView().byId("UpdatePostalCode").setValue(oSelectedData.PostalCode);
        this.getView().byId("UpdateCountry").setValue(oSelectedData.Country);
        this.getView().byId("UpdateHomePhone").setValue(oSelectedData.HomePhone);
        this.getView().byId("UpdateExtension").setValue(oSelectedData.Extension);
        this.getView().byId("UpdateNotes").setValue(oSelectedData.Notes);
        this.getView().byId("UpdateReportsTo").setValue(oSelectedData.ReportsTo);
    
            this._oUpdateEmployeeDialog.open();
        }
    },
   
    
    confirmUpdate: function () {
  
        var oEmployeeID = this.getView().byId("UpdateEmployeeID").getValue();
        var oLastName = this.getView().byId("UpdateLastName").getValue();
        var oFirstName = this.getView().byId("UpdateFirstName").getValue();
        var oTitle = this.getView().byId("UpdateTitle").getValue();
        var oCity = this.getView().byId("UpdateCity").getValue();
        var oCountry = this.getView().byId("UpdateCountry").getValue();
        var oTitleOfCourtesy = this.getView().byId("UpdateTitleOfCourtesy").getValue();
        var oBirthDate = this.getView().byId("UpdateBirthDate").getValue();
        var oHireDate = this.getView().byId("UpdateHireDate").getValue();
        var oAddress = this.getView().byId("UpdateAddress").getValue();
        var oRegion = this.getView().byId("UpdateRegion").getValue();
        var oPostalCode = this.getView().byId("UpdatePostalCode").getValue();
        var oHomePhone = this.getView().byId("UpdateHomePhone").getValue();
        var oExtension = this.getView().byId("UpdateExtension").getValue();
        var oNotes = this.getView().byId("UpdateNotes").getValue();
        var oReportsTo = this.getView().byId("UpdateReportsTo").getValue();
    
      
        var oTable = this.getView().byId("idProductsTable");
        var oSelectedItem = oTable.getSelectedItem();
    
        if (!oSelectedItem) {
            MessageToast.show("No item selected for update");
            return;
        }
    
   
        var oContext = oSelectedItem.getBindingContext();
  
        oContext.getModel().update(oContext.getPath(), {
            EmployeeID: oEmployeeID,
            LastName: oLastName,
            FirstName: oFirstName,
            Title: oTitle,
            City: oCity,
            Country: oCountry,
            TitleOfCourtesy: oTitleOfCourtesy,
            BirthDate: oBirthDate,
            HireDate: oHireDate,
            Address: oAddress,
            Region: oRegion,
            PostalCode: oPostalCode,
            HomePhone: oHomePhone,
            Extension: oExtension,
            Notes: oNotes,
            ReportsTo: oReportsTo
        }, {
            success: function () {
                MessageToast.show("Data updated successfully");
            },
            error: function (err) {
                console.error("Error updating data:", err);
            }
        });
    
    
        this._oUpdateEmployeeDialog.close();
    },
    
    onCancelUpdate: function () {
        this._oUpdateEmployeeDialog.close();
    },
    createColumnConfig: function() {
        return [
            { label: 'Employee ID', property: 'EmployeeID' },
            { label: 'Last Name', property: 'LastName' },
            { label: 'First Name', property: 'FirstName' },
            { label: 'Title', property: 'Title' },
            { label: 'Title of Courtesy', property: 'TitleOfCourtesy' },
            { label: 'Birth Date', property: 'BirthDate' },
            { label: 'Hire Date', property: 'HireDate' },
            { label: 'Address', property: 'Address' },
            { label: 'City', property: 'City' },
            { label: 'Region', property: 'Region' },
            { label: 'Postal Code', property: 'PostalCode' },
            { label: 'Country', property: 'Country' },
            { label: 'Home Phone', property: 'HomePhone' },
            { label: 'Extension', property: 'Extension' },
            { label: 'Notes', property: 'Notes' },
            { label: 'Reports To', property: 'ReportsTo' }
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
            fileName: 'Table_export_Employee_details.xlsx',
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
                    MessageToast.show("Error");  
                }
            });
        }
    },  
    onPress: function (oEvent) {
        let selectedItem = oEvent.getSource().getBindingContext().getObject().EmployeeID;
        let spath = `/Employees(${selectedItem})`;
   
        if (!this._quickcardDialog) {
            Fragment.load({
                id: this.getView().getId(),
                name: "com.sap.northwindcompanyy.view.fragment.Quickcard",
                controller: this
            }).then(oDialog => {
                this._quickcardDialog = oDialog;
                this.getView().addDependent(oDialog);
   
                
                oDialog.bindElement({
                    path: spath,
                
                });
   
                oDialog.open();
            });
        } else {
           
            this._quickcardDialog.bindElement({
                path: spath,
          
            });
   
            this._quickcardDialog.open();
        }
    },  
    onCancelPress: function () {
 
        this._quickcardDialog.close();
    }, 
    
    

    
  });
});
