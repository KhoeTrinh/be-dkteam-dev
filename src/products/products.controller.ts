import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from 'src/users/guards/jwt.guard';
import { AdminInterceptor } from 'src/users/intercepters/admin.interceptor';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { DevInterceptor } from 'src/users/intercepters/dev.interceptor';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get('/')
  @UseGuards(JwtGuard)
  async AllProducts() {
    return {
      message: await this.productService.allProducts(),
      statusCode: 200,
    };
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async ProductById(@Param('id') id: string) {
    return {
      message: await this.productService.productById(id),
      statusCode: 200,
    };
  }

  @Post('/')
  @UseGuards(JwtGuard)
  @UseInterceptors(DevInterceptor)
  async CreateProduct(@Body() data: CreateDto) {
    return {
      message: await this.productService.createProduct(data),
      statusCode: 200,
    };
  }

  @Put('/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  async UpdateProductById(@Param('id') id: string, @Body() data: UpdateDto) {
    return {
      message: await this.productService.updateProductById(id, data),
      statusCode: 200
    };
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  @UseInterceptors(AdminInterceptor)
  async DeleteProductById(@Param('id') id: string) {
    return {
      message: await this.productService.deleteProductById(id),
      statusCode: 204,
    };
  }
}
