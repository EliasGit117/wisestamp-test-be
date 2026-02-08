import { ApiProperty } from "@nestjs/swagger";

export interface IPaginationResult<T> {
  page: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  items: T[];
}

export class PaginatedResultDto<T> implements IPaginationResult<T> {

  @ApiProperty({ description: "List of items for the current page", isArray: true })
  items: T[];

  @ApiProperty({ description: "Total number of items available", example: 125, })
  totalItems: number;

  @ApiProperty({ description: "Total number of pages", example: 7 })
  totalPages: number;

  @ApiProperty({ description: "Number of items per page", example: 10, maximum: 100 })
  limit: number;

  @ApiProperty({ description: "Current page number", example: 1, })
  page: number;

  @ApiProperty({ description: "Indicates if there is a next page", example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: "Indicates if there is a previous page", example: false })
  hasPrevPage: boolean;
}