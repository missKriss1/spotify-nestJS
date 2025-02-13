import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  async deleteAll() {
    await this.artistModel.deleteMany({});
  }

  async createMultiple(artistsData: any[]) {
    const artists = await this.artistModel.create(artistsData);
    return artists;
  }

  @Get()
  getAll(){
    return this.artistModel.find()
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.artistModel.findById(id)
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {dest: './public/images/artists'}),
  )
  async create(
    @Body() artistDto: ArtistDocument,
    @UploadedFile() file: Express.Multer.File
  ){

    const artist = new this.artistModel({
      name: artistDto.name,
      image: file ? '/images/artists' + file.filename : null,
      information: artistDto.information,
    })

    return await artist.save();

  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.artistModel.findByIdAndDelete(id)
  }
}
