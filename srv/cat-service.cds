using northwind as my from '../db/data-model';

service CatalogService {
   entity Customers     as projection on my.Customer;
   entity Employees     as projection on my.Employee;
   entity Shippers      as projection on my.Shipper;
   entity Regions       as projection on my.Region;
   entity Orders        as projection on my.Order;
   entity Products      as projection on my.Product;
   entity Order_Details as projection on my.Order_Detail;
   entity Files         as projection on my.Files;
   entity Sales_Totals_by_Amounts   as projection on my.Sales_Totals_by_Amount;
   entity Product_Sales_for_1997 as projection on my.Product_Sales_for_1997;
   entity Territories as projection on my.Territorie;
   entity Sales_by_Categories as projection on my.Sales_by_Categorie;
   entity Suppliers         as projection on my.Supplier;
   entity Invoices         as projection on my.Invoice;
   action Submit(payload: String) returns String;
}
