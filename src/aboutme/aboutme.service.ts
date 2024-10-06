import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AboutmeService {
    constructor(private prisma: PrismaService) {}

    createAboutme() {}

    updateAboutmeById() {}

    deleteAboutmeById() {}
}
