import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@src/modules/auth/guards/access-token.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse, ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateSignatureCommand } from '@src/modules/signatures/cqrs/commands/create-signature.command';
import { CreateSignatureResultDto } from '@src/modules/signatures/dtos/create-signature/create-signature-result.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSignatureRequestDto } from '@src/modules/signatures/dtos/create-signature/create-signature-request.dto';
import { GetGeneratedSignatureQuery } from '@src/modules/signatures/cqrs/queries/get-generated.query';
import {
  GetGeneratedSignatureResultDto
} from '@src/modules/signatures/dtos/get-generated-signature/get-generated-signature-result.dto';
import { PaginatedResultDto } from '@src/modules/shared/dtos/paginated-result.dto';
import { SignatureDto } from '@src/modules/signatures/dtos/shared/signature.dto';
import { ListSignatureQuery } from '@src/modules/signatures/cqrs/queries/list-signatures.query';
import { PaginatedRequestDto } from '@src/modules/shared/dtos/paginated-request.dto';
import { ApiPaginatedResponse } from '@src/modules/shared/decorators/api-paginated-response.decorator';

@Controller('signatures')
export class SignaturesController {


  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}


  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiOperation({ summary: "List signatures", description: "Returns paginated list of signatures" })
  @ApiPaginatedResponse(PaginatedRequestDto)
  async list(@Query() query: PaginatedRequestDto): Promise<PaginatedResultDto<SignatureDto>> {
    return this.queryBus.execute(new ListSignatureQuery(query));
  }

  @Get(":id/generated")
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: GetGeneratedSignatureResultDto })
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Get generated signature' })
  async getGenerated(@Param("id", ParseIntPipe) id: number) {
    const signature = await this.queryBus.execute(new GetGeneratedSignatureQuery(id));
    return { signature };
  }


  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse()
  @ApiCreatedResponse({ type: CreateSignatureResultDto })
  @ApiOperation({ summary: 'Create signature' })
  async create(@Body() body: CreateSignatureRequestDto) {
    const { signature } = await this.commandBus.execute(new CreateSignatureCommand(body));
    return { signature: signature };
  }
}