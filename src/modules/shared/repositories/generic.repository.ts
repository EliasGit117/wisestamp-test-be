import { FindManyOptions, ObjectLiteral, Repository } from "typeorm";
import { IPaginatedRequestParams } from '@src/modules/shared/dtos/paginated-request.dto';
import { IPaginationResult } from '@src/modules/shared/dtos/paginated-result.dto';


export class GenericRepository<T extends ObjectLiteral> extends Repository<T> {

  async getPaginated(params: IPaginatedRequestParams, options: FindManyOptions<T> = {}): Promise<IPaginationResult<T>> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.findAndCount({ ...options, skip: skip, take: limit });
    const totalPages = Math.ceil(totalItems / limit);

    return {
      page: page,
      limit: limit,
      items: items,
      totalItems: totalItems,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}
