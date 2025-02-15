import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}
  @UseGuards(TokenAuthGuard)
  @Get()
  async getAll(@Query('album') album: string) {
    if (album) {
      return this.trackModel.find({ album: album });
    } else {
      return this.trackModel.find();
    }
  }

  @Post()
  async create(@Body() trackDto: TrackDocument) {
    const track = await this.trackModel.create({
      album: trackDto.album,
      title: trackDto.title,
      continuance: trackDto.continuance,
      number: trackDto.number,
    });

    return await track.save();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trackModel.findByIdAndDelete(id);
  }
}
