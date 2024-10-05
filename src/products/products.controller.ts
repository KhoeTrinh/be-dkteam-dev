import { Body, Controller, Delete, Get, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from 'src/users/guards/jwt.guard';
import { AdminInterceptor } from 'src/users/intercepters/admin.interceptor';
import { CreateDto } from './dto/create.dto';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) {}

    @Get('/')
    @UseGuards(JwtGuard)
    AllProducts() {
        return this.productService.allProducts()
    }

    @Get('/:id')
    @UseGuards(JwtGuard)
    ProductById() {}

    @Post('/')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    CreateProduct(@Body() data: CreateDto) {
        return this.productService.createProduct(data)
    }

    @Put('/:id')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    UpdateProductById() {}

    @Delete('/:id')
    @UseGuards(JwtGuard)
    @UseInterceptors(AdminInterceptor)
    DeleteProductById() {}
}
