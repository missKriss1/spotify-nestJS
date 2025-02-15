import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Track, TrackDocument } from '../schemas/track.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async seed() {
    console.log('seeding...');

    await this.artistModel.deleteMany({});
    await this.albumModel.deleteMany({});
    await this.trackModel.deleteMany({});
    await this.userModel.deleteMany({});

    console.log('collections of MD was cleared ');

    await this.userModel.create(
      {
        username: 'Anna',
        password: '123',
        token: randomUUID(),
        role: 'admin',
        displayName: 'Jane',
        avatar: 'fixtures/avatar/avatar_1.jpg',
      },
      {
        username: 'Sveta',
        password: '12345',
        token: randomUUID(),
        role: 'user',
        displayName: 'John',
        avatar: 'fixtures/avatar/avatar_2.jpg',
      },
    );

    const [John, Jane] = await this.artistModel.create(
      {
        name: 'John',
        information: 'hello',
        image: 'fixtures/artists/artist_1.jpg',
      },
      {
        name: 'Jane',
        information: 'hello Jane',
        image: 'fixtures/artists/artist_2.jpg',
      },
    );

    const [albumJohn1, albumJohn2, albumJane1, albumJane2] =
      await this.albumModel.create(
        {
          title: 'albumJohn1',
          artist: John._id,
          date: 2023,
          image: 'fixtures/albums/album_1_artist_1.jpg',
        },
        {
          title: 'albumJohn2',
          artist: John._id,
          date: 2019,
          image: 'fixtures/albums/album_1_artist_2.jpg',
        },
        {
          title: 'albumJane1',
          artist: Jane._id,
          date: 2005,
          image: 'fixtures/albums/album_2_artist_1.jpg',
        },
        {
          title: 'albumJane2',
          artist: Jane._id,
          date: 2009,
          image: 'fixtures/albums/album_2_artist_2.jpg',
        },
      );

    await this.trackModel.create(
      {
        title: 'Over the Rainbow',
        album: albumJohn1._id,
        continuance: '1:23',
        number: 1,
      },
      {
        title: 'As Time Goes By',
        album: albumJohn1._id,
        continuance: '2:22',
        number: 2,
      },
      {
        title: 'Singin’in the Rain',
        album: albumJohn1._id,
        continuance: '3:11',
        number: 3,
      },
      {
        title: 'Moon River',
        album: albumJohn1._id,
        continuance: '5:74',
        number: 4,
      },
      {
        title: 'White Christmas',
        album: albumJohn1._id,
        continuance: '1:25',
        number: 5,
      },
      {
        title: 'Mrs. Robinson',
        album: albumJohn2._id,
        continuance: '6:86',
        number: 1,
      },
      {
        title: 'When You Wish upon a Star',
        album: albumJohn2._id,
        continuance: '1:27',
        number: 2,
      },
      {
        title: 'The Way We Were',
        album: albumJohn2._id,
        continuance: '2:28',
        number: 3,
      },
      {
        title: 'Stayin’Alive',
        album: albumJohn2._id,
        continuance: '1:09',
        number: 4,
      },
      {
        title: 'The Sound of Music',
        album: albumJohn2._id,
        continuance: '1:10',
        number: 5,
      },
      {
        title: 'The Man That Got Away',
        album: albumJane1._id,
        continuance: '3:11',
        number: 1,
      },
      {
        title: 'Diamonds Are a Girl’s Best Friend',
        album: albumJane1._id,
        continuance: '4:12',
        number: 2,
      },
      {
        title: 'People',
        album: albumJane1._id,
        continuance: '5:13',
        number: 3,
      },
      {
        title: 'My Heart Will Go On',
        album: albumJane1._id,
        continuance: '3:14',
        number: 4,
      },
      {
        title: 'Cheek to Cheek',
        album: albumJane1._id,
        continuance: '2:15',
        number: 5,
      },
      {
        title: 'Evergreen',
        album: albumJane2._id,
        continuance: '2:16',
        number: 1,
      },
      {
        title: 'I Could Have Danced All Night',
        album: albumJane2._id,
        continuance: '1:17',
        number: 2,
      },
      {
        title: 'Cabaret',
        album: albumJane2._id,
        continuance: '2:18',
        number: 3,
      },
      {
        title: 'Some Day My Prince Will Come',
        album: albumJane2._id,
        continuance: '11:19',
        number: 4,
      },
      {
        title: 'Somewhere',
        album: albumJane2._id,
        continuance: '15:20',
        number: 5,
      },
    );
  }
}
