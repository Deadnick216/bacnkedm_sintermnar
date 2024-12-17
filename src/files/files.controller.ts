 import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer,  fileFilter } from './helpers/index';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
              private readonly ConfigService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string ) {
    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile( path);

  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter,
    //limits: { fileSize: 1024 }
    storage: diskStorage({
      destination: './static/products', 
      filename: fileNamer
    })
    }) )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) {
      throw new BadRequestException('Hacegurate que sea una imagen');
    }
    
    console.log({file}); 
    //const secureUrl = `${ file.filename }`;
    const secureUrl = `${this.ConfigService.get('HOST_API')}/files/product/0aaa9034-bd45-4506-812d-da0c4ce2b6a3.png`;
    return{ secureUrl }; 
  }

  
}
