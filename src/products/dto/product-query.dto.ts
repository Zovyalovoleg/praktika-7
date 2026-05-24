import { Type } from "class-transformer";
import {
  IsOptional,
  IsInt,
  IsString,
  IsIn,
  Min,
  Max,
  MinLength,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ProductQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @ApiPropertyOptional({ enum: ["name", "price", "createdAt"] })
  @IsOptional()
  @IsString()
  sort?: string = "createdAt";

  @ApiPropertyOptional({ enum: ["ASC", "DESC"] })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "DESC";

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;
}
