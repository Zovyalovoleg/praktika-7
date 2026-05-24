import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";
import { ProductsModule } from "./products/products.module";
import { Product } from "./products/entities/product.entity";
import { Category } from "./categories/entities/category.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST || "localhost",
      port: +(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_PASSWORD || "postgres",
      database: process.env.DATABASE_NAME || "shop",
      entities: [Product, Category],
      synchronize: true,
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || "localhost",
            port: +(process.env.REDIS_PORT || 6379),
          },
        }),
      }),
    }),
    ProductsModule,
  ],
})
export class AppModule {}
