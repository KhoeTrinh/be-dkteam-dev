import { Controller, Delete, Get, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from 'src/users/guards/jwt.guard';
import { AdminInterceptor } from 'src/users/intercepters/admin.interceptor';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) {}

    @Get('/')
    @UseGuards(JwtGuard)
    AllProducts() {}

    @Get('/:id')
    @UseGuards(JwtGuard)
    ProductById() {}

    @Post('/')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    CreateProduct() {}

    @Put('/:id')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    UpdateProductById() {}

    @Delete('/:id')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    DeleteProductById() {}
}
