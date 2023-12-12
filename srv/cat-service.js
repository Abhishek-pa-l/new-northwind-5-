
// module.exports = async (srv) => {
   
  
    //    debugger
    //     console.log(req.data.RegionDescription)
    //     if (req.data.RegionDescription == null) {
    //         req.error({ code: 418, message: 'Desc is Mandatory' });
    //     }
    // });
    const cds = require('@sap/cds');
 
    module.exports = async (srv) => {
        srv.before('CREATE', 'Employees', async (req) => {
            const { FirstName } = req.data;
     
           
            if (!FirstName) {
                req.error({ code: 417, message: 'First Name cannot be null or empty' });
            }
        });
        srv.before('CREATE', 'Customers', async (req) => {
            const { CompanyName } = req.data;
     
           
            if (!CompanyName) {
                req.error({ code: 417, message: 'CompanyName cannot be null or empty' });
            }
        });
        srv.before('CREATE', 'Shippers', async (req) => {
            const { CompanyName } = req.data;
     
           
            if (!CompanyName) {
                req.error({ code: 417, message: 'CompanyName cannot be null or empty' });
            }
        });
        srv.before('CREATE', 'Orders', async (req) => {
            const { CustomerID } = req.data;
     
           
            if (!CustomerID) {
                req.error({ code: 417, message: 'CustomerID cannot be null or empty' });
            }
        });
        srv.before('CREATE', 'Products', async (req) => {
            const { ProductName } = req.data;
     
           
            if (!ProductName) {
                req.error({ code: 417, message: 'Productname cannot be null or empty' });
            }
        });
        srv.before('CREATE', 'Suppliers', async (req) => {
            const { CompanyName  } = req.data;
     
           
            if (!CompanyName ) {
                req.error({ code: 417, message: 'CompanyName  cannot be null or empty' });
            }
        });
        
        srv.before('CREATE', 'Regions', async (req) => {
            const {RegionDescription } = req.data;
     
           
            if (!RegionDescription) {
                req.error({ code: 417, message: 'Description cannot be null or empty' });
            }
        });
        srv.before('CREATE', 'Order_Details', async (req) => {
            const { OrderID } = req.data;
     
           
            if (!OrderID) {
                req.error({ code: 417, message: ' orderId cannot be null or empty' });
            }
        });
    };
   
