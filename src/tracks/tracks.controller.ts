import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  async deleteAll() {
    await this.trackModel.deleteMany({});
  }

  async createMultiple(trackData: any[]) {
    const tracks = await this.trackModel.create(trackData);
    return tracks;
  }

  @Get()
  async getAll(@Query('album') album: string) {
    if(album){
      return this.trackModel.find({album: album})
    }else{
      return this.trackModel.find()
    }
  }

  @Post()
  async create(
    @Body() trackDto: TrackDocument,
  ){
    const track = await this.trackModel.create({
      album: trackDto.album,
      title: trackDto.title,
      continuance: trackDto.continuance,
      number: trackDto.number,
    })

    return await track.save();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trackModel.findByIdAndDelete(id)
  }
}
