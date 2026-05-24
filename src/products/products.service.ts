import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Product } from "./entities/product.entity";
import { ProductQueryDto } from "./dto/product-query.dto";

@Injectable()
export class ProductsService {
  private readonly allowedSortFields = ["name", "price", "createdAt"];
  private readonly CACHE_TTL = 60_000;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(query: ProductQueryDto) {
    const cacheKey = `products:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get<{
      items: Product[];
      meta: { page: number; pageSize: number; total: number; totalPages: number };
    }>(cacheKey);
    if (cached) return cached;

    const {
      page = 1,
      pageSize = 10,
      sort = "createdAt",
      order = "DESC",
      categoryId,
      minPrice,
      maxPrice,
      search,
    } = query;

    const qb = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category");

    if (categoryId) {
      qb.andWhere("product.categoryId = :categoryId", { categoryId });
    }

    if (minPrice !== undefined && minPrice !== null) {
      qb.andWhere("product.price >= :minPrice", { minPrice });
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      qb.andWhere("product.price <= :maxPrice", { maxPrice });
    }

    if (search) {
      qb.andWhere("product.name ILIKE :search", { search: `%${search}%` });
    }

    const sortField = this.allowedSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "ASC" ? "ASC" : "DESC";
    qb.orderBy(`product.${sortField}`, sortOrder);

    const total = await qb.getCount();

    qb.skip((page - 1) * pageSize).take(pageSize);

    const items = await qb.getMany();

    const result = {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    await this.cacheManager.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  async create(data: Partial<Product>) {
    const product = this.productRepository.create(data);
    await this.productRepository.save(product);
    await this.clearProductsCache();
    return product;
  }

  async update(id: number, data: Partial<Product>) {
    await this.productRepository.update(id, data);
    await this.clearProductsCache();
    return this.productRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (product) {
      await this.productRepository.remove(product);
      await this.clearProductsCache();
    }
    return product;
  }

  async findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: ["category"],
    });
  }

  async clearProductsCache() {
    const keys = await this.cacheManager.store.keys("products:*");
    for (const key of keys) {
      await this.cacheManager.del(key);
    }
  }
}
