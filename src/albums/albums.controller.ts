import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { CreateAlbumDto } from './creat_album.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}
  @UseGuards(TokenAuthGuard)
  @Get()
  async getAll(@Query('artist') artist: string) {
    if (artist) {
      return this.albumModel.find({ artist: artist });
    } else {
      return this.albumModel.find();
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.albumModel.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images/albums' }))
  async create(
    @Body() albumDto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const album = new this.albumModel({
      artist: albumDto.artist,
      title: albumDto.title,
      date: albumDto.date,
      image: file ? '/images/albums' + file.filename : null,
    });

    return await album.save();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.albumModel.findByIdAndDelete(id);
  }
}
