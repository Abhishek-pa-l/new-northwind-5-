
module.exports = async (srv) => {
    srv.before('CREATE', 'Employees', async function (req) {
        if (req.data.EmployeeID == false) {
            req.error({ code: 418, message: 'ID is Mandatory' });
        }
    });
    srv.before('CREATE', 'Customers', async function (req) {

        if (req.data.CustomerID == false) {
            req.error({ code: 418, message: 'ID is Mandatory' });
        }
    });
    srv.before('CREATE', 'Shippers', async function (req) {

        if (req.data.ShipperID == false) {
            req.error({ code: 418, message: 'ID is Mandatory' });
        }
    });
    srv.before('CREATE', 'Regions', async function (req) {

        if (req.data.RegionID == false) {
            req.error({ code: 418, message: 'ID is Mandatory' });
        }
    });
    srv.before('CREATE', 'Orders', async function (req) {

        if (req.data.OrderID == false) {
            req.error({ code: 418, message: 'ID is Mandatory' });
        }
    });
    srv.before('CREATE', 'Products', async function (req) {

        if (req.data.OrderID == false) {
            req.error({ code: 418, message: 'ID is Mandatory' });
        }
    });
    srv.before('CREATE', 'Order_Details', async function (req) {

        if (req.data.ProductID == false) {
            req.error({ code: 418, message: 'ID is Mandatory' });
        }
    });


}