sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, Fragment, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("com.sap.northwindcompanyy.controller.Invoice", {
    onInit: function () {
      // Initialization logic goes here
    },

    onAddPress: function () {
      if (!this._oCreateProductDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: "com.sap.northwindcompanyy.view.fragment.Invoiceadd",
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
      debugger;
      let oModel = this.getOwnerComponent().getModel();

      // Shipping Information
      let oShipName = this.getView().byId("ShipName").getValue();
      let oShipAddress = this.getView().byId("ShipAddress").getValue();
      let oShipCity = this.getView().byId("ShipCity").getValue();
      let oShipRegion = this.getView().byId("ShipRegion").getValue();
      let oShipPostalCode = this.getView().byId("ShipPostalCode").getValue();
      let oShipCountry = this.getView().byId("ShipCountry").getValue();

      // Customer Information
      let oCustomerID = this.getView().byId("CustomerID").getValue();
      let oCustomerName = this.getView().byId("CustomerName").getValue();
      let oAddress = this.getView().byId("Address").getValue();
      let oCity = this.getView().byId("City").getValue();
      let oRegion = this.getView().byId("Region").getValue();
      let oPostalCode = this.getView().byId("PostalCode").getValue();
      let oCountry = this.getView().byId("Country").getValue();
      let oSalesperson = this.getView().byId("Salesperson").getValue();

      // Order Information
      let oOrderID = this.getView().byId("OrderID").getValue();
      let oOrderDate = this.getView().byId("OrderDate").getValue();
      let oRequiredDate = this.getView().byId("RequiredDate").getValue();
      let oShippedDate = this.getView().byId("ShippedDate").getValue();
      let oShipperName = this.getView().byId("ShipperName").getValue();

      // Product Information
      let oProductID = this.getView().byId("ProductID").getValue();
      let oProductName = this.getView().byId("ProductName").getValue();
      let oUnitPrice = this.getView().byId("UnitPrice").getValue();
      let oQuantity = this.getView().byId("Quantity").getValue();
      let oDiscount = this.getView().byId("Discount").getValue();
      let oExtendedPrice = this.getView().byId("ExtendedPrice").getValue();
      let oFreight = this.getView().byId("Freight").getValue();

      let myData = {
        ShipName: oShipName,
        ShipAddress: oShipAddress,
        ShipCity: oShipCity,
        ShipRegion: oShipRegion,
        ShipPostalCode: oShipPostalCode,
        ShipCountry: oShipCountry,
        CustomerID: oCustomerID,
        CustomerName: oCustomerName,
        Address: oAddress,
        City: oCity,
        Region: oRegion,
        PostalCode: oPostalCode,
        Country: oCountry,
        Salesperson: oSalesperson,
        OrderID: parseInt(oOrderID),
        OrderDate: new Date(oOrderDate),
        RequiredDate: new Date(oRequiredDate),
        ShippedDate: new Date(oShippedDate),
        ShipperName: oShipperName,
        ProductID: parseInt(oProductID),
        ProductName: oProductName,
        UnitPrice: parseFloat(oUnitPrice),
        Quantity: parseInt(oQuantity),
        Discount: oDiscount,
        ExtendedPrice: parseFloat(oExtendedPrice),
        Freight: parseFloat(oFreight)
      };

      oModel.create("/Invoices", myData, {
        success: function (res) {
          MessageToast.show("Data added successfully");
          this._oCreateProductDialog.close();
        }.bind(this),
        error: function (err) {
          console.error(err);
        }
      });
    },

    onCancelOrder: function () {
      this._oCreateProductDialog.close();
    },

    onDeletePress: function () {
      var oTable = this.getView().byId("invoiceTable");
      var aSelectedItems = oTable.getSelectedItems();

      if (aSelectedItems.length === 0) {
        MessageToast.show("No items selected for deletion");
        return;
      }

      var that = this;
      MessageBox.confirm("Are you sure you want to delete the selected items?", {
        title: "Confirm Deletion",
        onClose: function (oAction) {
          if (oAction === MessageBox.Action.OK) {
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

    onUpdatePress: function () {
      var oTable = this.getView().byId("invoiceTable");
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
          name: "com.sap.northwindcompanyy.view.fragment.Invoiceupdate",
          controller: this
        }).then(oDialog => {
          this._oUpdateCustomerDialog = oDialog;
          this.getView().addDependent(oDialog);
    
          // Set values in the update fragment
        
          this.getView().byId("uAddress").setValue(oSelectedData.Address);
          this.getView().byId("uCity").setValue(oSelectedData.City);
          this.getView().byId("uRegion").setValue(oSelectedData.Region);
          this.getView().byId("uPostalCode").setValue(oSelectedData.PostalCode);
          this.getView().byId("uCountry").setValue(oSelectedData.Country);
          this.getView().byId("uSalesperson").setValue(oSelectedData.Phone);
    
    
          this.getView().byId("uShipName").setValue(oSelectedData.ShipName);
          this.getView().byId("uShipAddress").setValue(oSelectedData.ShipAddress);
          this.getView().byId("uShipCity").setValue(oSelectedData.ShipCity);
          this.getView().byId("uShipRegion").setValue(oSelectedData.ShipRegion);
          this.getView().byId("uShipPostalCode").setValue(oSelectedData.ShipPostalCode);
          this.getView().byId("uShipCountry").setValue(oSelectedData.ShipCountry);
          this.getView().byId("uCustomerID").setValue(oSelectedData.CustomerID);
          this.getView().byId("uCustomerName").setValue(oSelectedData.CustomerName);
          this.getView().byId("uOrderID").setValue(oSelectedData.OrderID);
          this.getView().byId("uOrderDate").setValue(oSelectedData.OrderDate);
          this.getView().byId("uRequiredDate").setValue(oSelectedData.RequiredDate);
          this.getView().byId("uShippedDate").setValue(oSelectedData.ShippedDate);
          this.getView().byId("uShipperName").setValue(oSelectedData.ShipperName);
          this.getView().byId("uProductID").setValue(oSelectedData.ProductID);
          this.getView().byId("uProductName").setValue(oSelectedData.ProductName);
          this.getView().byId("uUnitPrice").setValue(oSelectedData.UnitPrice);
          this.getView().byId("uQuantity").setValue(oSelectedData.Quantity);
          this.getView().byId("uDiscount").setValue(oSelectedData.Discount);
          this.getView().byId("uExtendedPrice").setValue(oSelectedData.ExtendedPrice);
          this.getView().byId("uFreight").setValue(oSelectedData.Freight);
    
          oDialog.open();
        });
      } else {
     
        this.getView().byId("uAddress").setValue(oSelectedData.Address);
          this.getView().byId("uCity").setValue(oSelectedData.City);
          this.getView().byId("uRegion").setValue(oSelectedData.Region);
          this.getView().byId("uPostalCode").setValue(oSelectedData.PostalCode);
          this.getView().byId("uCountry").setValue(oSelectedData.Country);
          this.getView().byId("uSalesperson").setValue(oSelectedData.Phone);
    
    
          this.getView().byId("uShipName").setValue(oSelectedData.ShipName);
          this.getView().byId("uShipAddress").setValue(oSelectedData.ShipAddress);
          this.getView().byId("uShipCity").setValue(oSelectedData.ShipCity);
          this.getView().byId("uShipRegion").setValue(oSelectedData.ShipRegion);
          this.getView().byId("uShipPostalCode").setValue(oSelectedData.ShipPostalCode);
          this.getView().byId("uShipCountry").setValue(oSelectedData.ShipCountry);
          this.getView().byId("uCustomerID").setValue(oSelectedData.CustomerID);
          this.getView().byId("uCustomerName").setValue(oSelectedData.CustomerName);
          this.getView().byId("uOrderID").setValue(oSelectedData.OrderID);
          this.getView().byId("uOrderDate").setValue(oSelectedData.OrderDate);
          this.getView().byId("uRequiredDate").setValue(oSelectedData.RequiredDate);
          this.getView().byId("uShippedDate").setValue(oSelectedData.ShippedDate);
          this.getView().byId("uShipperName").setValue(oSelectedData.ShipperName);
          this.getView().byId("uProductID").setValue(oSelectedData.ProductID);
          this.getView().byId("uProductName").setValue(oSelectedData.ProductName);
          this.getView().byId("uUnitPrice").setValue(oSelectedData.UnitPrice);
          this.getView().byId("uQuantity").setValue(oSelectedData.Quantity);
          this.getView().byId("uDiscount").setValue(oSelectedData.Discount);
          this.getView().byId("uExtendedPrice").setValue(oSelectedData.ExtendedPrice);
          this.getView().byId("uFreight").setValue(oSelectedData.Freight);
    
        this._oUpdateCustomerDialog.open();
      }
    },
    
    confirmOrder: function () {
    
      let oAddress = this.getView().byId("uAddress").getValue();
      let oCity = this.getView().byId("uCity").getValue();
      let oRegion = this.getView().byId("uRegion").getValue();
      let oPostalCode = this.getView().byId("uPostalCode").getValue();
      let oCountry = this.getView().byId("uCountry").getValue();
      let oSalesperson = this.getView().byId("uSalesperson").getValue();  
      let oShipName = this.getView().byId("uShipName").getValue();
      let oShipAddress = this.getView().byId("uShipAddress").getValue();
      let oShipCity = this.getView().byId("uShipCity").getValue();
      let oShipRegion = this.getView().byId("uShipRegion").getValue();
      let oShipPostalCode = this.getView().byId("uShipPostalCode").getValue();
      let oShipCountry = this.getView().byId("uShipCountry").getValue();
      let oCustomerID = this.getView().byId("uCustomerID").getValue();
      let oCustomerName = this.getView().byId("uCustomerName").getValue();
      let oOrderID = this.getView().byId("uOrderID").getValue();
      let oOrderDate = this.getView().byId("uOrderDate").getValue();
      let oRequiredDate = this.getView().byId("uRequiredDate").getValue();
      let oShippedDate = this.getView().byId("uShippedDate").getValue();
      let oShipperName = this.getView().byId("uShipperName").getValue();
      let oProductID = this.getView().byId("uProductID").getValue();
      let oProductName = this.getView().byId("uProductName").getValue();
      let oUnitPrice = this.getView().byId("uUnitPrice").getValue();
      let oQuantity = this.getView().byId("uQuantity").getValue();
      let oDiscount = this.getView().byId("uDiscount").getValue();
      let oExtendedPrice = this.getView().byId("uExtendedPrice").getValue();
      let oFreight = this.getView().byId("uFreight").getValue();
    
      var oTable = this.getView().byId("invoiceTable");
      var oSelectedItem = oTable.getSelectedItem();
    
      if (!oSelectedItem) {
        MessageToast.show("No item selected for update");
        return;
      }
    
      var oContext = oSelectedItem.getBindingContext();
    
      oContext.getModel().update(oContext.getPath(), {
        
        Address: oAddress,
        City: oCity,
        Region: oRegion,
        PostalCode: oPostalCode,
        Country: oCountry,
       Salesperson:oSalesperson,
        ShipName: oShipName,
        ShipAddress: oShipAddress,
        ShipCity: oShipCity,
        ShipRegion: oShipRegion,
        ShipPostalCode: oShipPostalCode,
        ShipCountry: oShipCountry,
        CustomerID: oCustomerID,
        CustomerName: oCustomerName,
        OrderID: oOrderID,
        OrderDate: oOrderDate,
        RequiredDate: oRequiredDate,
        ShippedDate: oShippedDate,
        ShipperName: oShipperName,
        ProductID: oProductID,
        ProductName: oProductName,
        UnitPrice: oUnitPrice,
        Quantity: oQuantity,
        Discount: oDiscount,
        ExtendedPrice: oExtendedPrice,
        Freight: oFreight
      }, {
        success: function () {
          MessageToast.show("Data updated successfully");
        },
        error: function (err) {
          console.error("Error updating data:", err);
          MessageToast.show("Error updating data");
        }
      });
    
      this._oUpdateCustomerDialog.close();
    },
    
    onCancelOrder: function () {
      this._oUpdateCustomerDialog.close();
    }
    
  });
});
