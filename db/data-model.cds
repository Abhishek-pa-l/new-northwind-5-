namespace northwind;

using {
  cuid,
  managed
} from '@sap/cds/common';

entity Customer {
  key CustomerID   : String;
      CompanyName  : String;
      ContactName  : String;
      ContactTitle : String;
      Address      : String;
      City         : String;
      Region       : String;
      PostalCode   : String;
      Country      : String;
      Phone        : String;
      Fax          : String;

}

entity Employee {
  key EmployeeID      : Integer;
      LastName        : String;
      FirstName       : String;
      Title           : String;
      TitleOfCourtesy : String;
      BirthDate       : String;
      HireDate        : String;
      Address         : String;
      City            : String;
      Region          : String;
      PostalCode      : String;
      Country         : String;
      HomePhone       : String;
      Extension       : String;
      Notes           : String;
      ReportsTo       : Integer;
}

entity Shipper {
  key ShipperID   : Integer;
      CompanyName : String;
      Phone       : String;
}


entity Region {
  key RegionID          : Integer;
      RegionDescription : String;

}

entity Order {
  key OrderID        : Integer;
      CustomerID     : String;
      EmployeeID     : Integer;
      OrderDate      : Date;
      RequiredDate   : Date;
      ShippedDate    : Date;
      ShipVia        : Integer;
      Freight        : String;
      ShipName       : String;
      ShipAddress    : String;
      ShipCity       : String;
      ShipRegion     : String;
      ShipPostalCode : String;
      ShipCountry    : String;
}

entity Product {
  key ProductID       : Integer;
      ProductName     : String;
      SupplierID      : Integer;
      CategoryID      : Integer;
      QuantityPerUnit : String;
      UnitPrice       : Decimal;
      UnitsInStock    : Integer;
      UnitsOnOrder    : Integer;
      ReorderLevel    : Integer;
      Discontinued    : Boolean;
}

entity Order_Detail {
      OrderID   : Integer;
  key ProductID : Integer;
      UnitPrice : Decimal;
      Quantity  : Integer;
      Discount  : Integer;
}
entity Supplier {
  key SupplierID   : Integer;
      CompanyName  : String;
      ContactName  : String;
      ContactTitle : String;
      Address      : String;
      City         : String;
      Region       : String;
      PostalCode   : String;
      Country      : String;
      Phone        : String;
      Fax          : String;
      HomePage     : String;
 
 
}
 
entity Invoice {
  ShipName       : String;
  ShipAddress    : String;
  ShipCity       : String;
  ShipRegion     : String;
  ShipPostalCode : String;
  ShipCountry    : String;
  CustomerID     : String;
  CustomerName   : String;
  Address        : String;
  City           : String;
  Region         : String;
  PostalCode     : String;
  Country        : String;
  Salesperson    : String;
  OrderID        : Integer;
  OrderDate      : Date;
  RequiredDate   : Date;
  ShippedDate    : Date;
  ShipperName    : String;
  ProductID      : Integer;
  ProductName    : String;
  UnitPrice      : Decimal;
  Quantity       : Integer;
  Discount       : String;
  ExtendedPrice  : Decimal;
  Freight        : Decimal;
 
 
}

entity Files : cuid, managed {
  @Core.MediaType  : mediaType
  content   : LargeBinary;

  @Core.IsMediaType: true
  mediaType : String;
  fileName  : String;
  size      : Integer;
  url       : String;
}
 entity Sales_Totals_by_Amount {
   SaleAmount: Integer;
   key OrderID: Integer;
   CompanyName: String;
   ShippedDate:String;

 }

 entity Product_Sales_for_1997 {
  CategoryName : String;
  ProductName : String;
  Key ProductSales : Decimal;
}
entity Territorie{
  key TerritoryID          : String;
  TerritoryDescription     : String;
  RegionID                 : Integer;
  }

entity Sales_by_Categorie {
  key CategoryID   : Integer;
  CategoryName     : String;
  ProductName      : String;
  ProductSales     : Decimal;
}