import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "../categories/entities/category.entity";
import { Product } from "../products/entities/product.entity";

async function seed() {
  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: +(process.env.DATABASE_PORT || 5432),
    username: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "shop",
    entities: [Category, Product],
    synchronize: true,
  });

  await dataSource.initialize();

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);

  await categoryRepo.save([
    { name: "Electronics", description: "Electronic devices and gadgets" },
    { name: "Accessories", description: "Phone and laptop accessories" },
    { name: "Clothing", description: "Apparel and fashion items" },
  ]);

  const productsData = [
    { name: "iPhone 15 Pro", price: 1199, categoryId: 1 },
    { name: "MacBook Air M3", price: 1299, categoryId: 1 },
    { name: "Samsung Galaxy S24", price: 999, categoryId: 1 },
    { name: "Sony WH-1000XM5", price: 349, categoryId: 1 },
    { name: "iPad Air M2", price: 599, categoryId: 1 },
    { name: "Dell XPS 15", price: 1499, categoryId: 1 },
    { name: "Apple Watch Series 9", price: 399, categoryId: 1 },
    { name: "AirPods Pro 2", price: 249, categoryId: 1 },
    { name: "Logitech MX Master 3S", price: 99, categoryId: 1 },
    { name: "Samsung 27\" Monitor", price: 329, categoryId: 1 },
    { name: "USB-C Hub 7-in-1", price: 45, categoryId: 2 },
    { name: "Phone Stand", price: 25, categoryId: 2 },
    { name: "Laptop Sleeve 15\"", price: 35, categoryId: 2 },
    { name: "Wireless Charger", price: 29, categoryId: 2 },
    { name: "Screen Protector", price: 15, categoryId: 2 },
    { name: "Bluetooth Earbuds", price: 59, categoryId: 2 },
    { name: "HDMI Cable 3m", price: 12, categoryId: 2 },
    { name: "Mouse Pad XL", price: 19, categoryId: 2 },
    { name: "Webcam 1080p", price: 79, categoryId: 2 },
    { name: "Power Bank 20000mAh", price: 49, categoryId: 2 },
    { name: "Classic T-Shirt", price: 29, categoryId: 3 },
    { name: "Denim Jacket", price: 89, categoryId: 3 },
    { name: "Running Shoes", price: 129, categoryId: 3 },
    { name: "Wool Sweater", price: 69, categoryId: 3 },
    { name: "Slim Fit Jeans", price: 59, categoryId: 3 },
    { name: "Leather Belt", price: 39, categoryId: 3 },
    { name: "Winter Parka", price: 199, categoryId: 3 },
    { name: "Cotton Hoodie", price: 55, categoryId: 3 },
    { name: "Formal Shirt", price: 49, categoryId: 3 },
    { name: "Sports Shorts", price: 34, categoryId: 3 },
  ];

  await productRepo.save(productsData);

  await dataSource.destroy();
}

seed().catch((err) => {
  process.exit(1);
});
