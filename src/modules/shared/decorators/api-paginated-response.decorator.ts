import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath
} from "@nestjs/swagger";
import { PaginatedResultDto } from '@src/modules/shared/dtos/paginated-result.dto';



export function ApiPaginatedResponse<TModel extends Type<unknown>>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(PaginatedResultDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResultDto) },
          {
            properties: {
              items: {
                type: "array",
                items: { $ref: getSchemaPath(model) }
              }
            }
          }
        ]
      }
    })
  );
}