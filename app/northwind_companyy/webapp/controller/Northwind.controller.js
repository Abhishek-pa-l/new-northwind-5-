sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageToast"
], function (Controller, Device, MessageToast) {
    "use strict";

    return Controller.extend("com.sap.northwindcompanyy.controller.Northwind", {
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
            } else if (oSelectedKey === "Product_sales") {
                oRouter.navTo("Product_sale", { key: oSelectedKey });
            } else if (oSelectedKey === "Sales_Totals") {
                oRouter.navTo("Sales_amount", { key: oSelectedKey });
            }   else if (oSelectedKey === "territories") {
                    oRouter.navTo("Territorie", { key: oSelectedKey });
            }   else if (oSelectedKey === "category") {
                    oRouter.navTo("Category", { key: oSelectedKey });
                }   else if (oSelectedKey === "suplier") {
                    oRouter.navTo("Suplier", { key: oSelectedKey });
                }   else if (oSelectedKey === "Invoice") {
                    oRouter.navTo("Invoice", { key: oSelectedKey });
            } else if (oSelectedKey === "Regions") {
                oRouter.navTo("Region", { key: oSelectedKey });
              }   else if (oSelectedKey === "homes") {
                    oRouter.navTo("Home", { key: oSelectedKey });
            }
            
            
        }  
    });
});
