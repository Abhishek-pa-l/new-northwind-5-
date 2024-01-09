sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
], function (BaseController, MessageBox) {
  "use strict";

  return BaseController.extend("com.sap.northwindcompanyy.controller.Form", {
      onInit: function () {
      },
      onSubmit: function () {
  debugger;
  let oModel = this.getOwnerComponent().getModel();

  const oSupplier = this.getView().byId("supplierNameInput").getValue();
  const oProduct = this.getView().byId("productNameInput").getValue();
  const oCreatedBy = this.getView().byId("createdByInput").getValue();
  const oOrderAmount = this.getView().byId("orderAmountInput").getValue();
  const oProductNeedByDate = this.getView().byId("productNeedByDateInput").getDateValue();
  const oCreatedDate = this.getView().byId("createdDateInput").getDateValue();

  let data = {
      "supplierName": parseInt(oSupplier),
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
}

  });
});