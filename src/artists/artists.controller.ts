import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { RoleGuard } from '../token-auth/role.graud';
import { SetRoles } from '../token-auth/director/setRoles';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}
  @UseGuards(TokenAuthGuard)
  @Get()
  getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.artistModel.findById(id);
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/images/artists' }),
  )
  async create(
    @Body() artistDto: ArtistDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const artist = new this.artistModel({
      name: artistDto.name,
      image: file ? '/images/artists' + file.filename : null,
      information: artistDto.information,
    });

    return await artist.save();
  }

  @UseGuards(TokenAuthGuard)
  @UseGuards(RoleGuard)
  @SetRoles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.artistModel.findByIdAndDelete(id);
  }
}
