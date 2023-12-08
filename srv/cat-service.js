
module.exports = async (srv) => {
    srv.before('CREATE', 'Employees', async function (req) {
 
       
           
        debugger;
            if (req.data.EmployeeID == false) {
                req.error({ code: 418, message: 'ID is Mandatory' });
            }
 
       
 
 
 
    });
}