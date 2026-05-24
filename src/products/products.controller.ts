import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { ProductQueryDto } from "./dto/product-query.dto";
import { Product } from "./entities/product.entity";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "Get all products with pagination, sorting, filtering" })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a product by id" })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: "Create a product" })
  create(@Body() data: Partial<Product>) {
    return this.productsService.create(data);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a product" })
  update(@Param("id") id: string, @Body() data: Partial<Product>) {
    return this.productsService.update(+id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a product" })
  remove(@Param("id") id: string) {
    return this.productsService.remove(+id);
  }
}
