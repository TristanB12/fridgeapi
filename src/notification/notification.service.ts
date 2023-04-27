import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  private expo = new Expo({ accessToken: this.config.get('EXPO_ACCESS_TOKEN') });

  async testExpoSdk(token) {
    let messages: ExpoPushMessage[] = [];
    for (let pushToken of [token]) {

      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title: 'Fridgy',
        body: 'This is a test notification',
        data: { withSome: 'data' },
      })
    }

    let chunks = this.expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }
}
