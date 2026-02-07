import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min, IsEnum } from "class-validator";

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface IPaginatedRequestParams {
  page?: number;
  limit?: number;
  dir?: SortDirection;
}

export class PaginatedRequestDto implements IPaginatedRequestParams {

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ description: "Page number", example: 1, minimum: 1 })
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ description: "Number of items per page", example: 10, minimum: 1 })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(SortDirection)
  @ApiPropertyOptional({ description: "Sorting direction", example: SortDirection.DESC, enum: SortDirection })
  dir?: SortDirection = SortDirection.DESC;
}
