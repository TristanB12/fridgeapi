import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import Expo, { ExpoPushMessage, ExpoPushToken } from 'expo-server-sdk';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private productService: ProductService
  ) { }

  private expo = new Expo({ accessToken: this.config.get('EXPO_ACCESS_TOKEN') });

  getValidDevices(devices) {
    return devices.filter(device => Expo.isExpoPushToken(device.notification_token));
  }

  @Cron('*/10 * * * *')
  async notificationTask() {
    const messages: ExpoPushMessage[] = [];
    const users = await this.prisma.user.findMany({
      where: { devices: { some: {} } },
      include: {
        products: {
          where: { status: 'present' }
        },
        devices: true
      }
    })

    for (let user of users) {
      const validDevices = this.getValidDevices(user.devices);
      if (validDevices.length <= 0) continue;

      const products = this.productService.serializedProduct(user.products) as ProductEntity[];
      for (let product of products) {
        const status = product.expires_in <= 0 ? 'red' :
          product.expires_in <= 3 ? 'orange' :
            product.expires_in <= 7 ? 'yellow' : 'none';

        if (status != 'none' && status != product.notification_status) {
          await this.prisma.product.update({
            where: { id: product.id },
            data: {
              notification_status: status
            }
          });
          messages.push({
            to: validDevices.map(device => device.notification_token),
            sound: 'default',
            title: 'Fridgy',
            body: `Your product '${product.name}' ${status == 'red' ? 'has expired.' : `is expiring in ${product.expires_in} days.`}`
          });
        }
      }

      console.log(messages);
      let chunks = this.expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();

      this.manageReceipts(tickets);
    }
  }

  manageReceipts(tickets) {
    let receiptIds = [];
    for (let ticket of tickets) {
      // NOTE: Not all tickets have IDs; for example, tickets for notifications
      // that could not be enqueued will have error information and no receipt ID.
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    let receiptIdChunks = this.expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      // Like sending notifications, there are different strategies you could use
      // to retrieve batches of receipts from the Expo service.
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await this.expo.getPushNotificationReceiptsAsync(chunk);
          console.log(receipts);

          // The receipts specify whether Apple or Google successfully received the
          // notification and information about an error, if one occurred.
          for (let receiptId in receipts) {
            let { status, details } = receipts[receiptId];
            if (status === 'ok') {
              continue;
            } else if (status === 'error') {
              console.error(
                `There was an error sending a notification`
              );
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }
}
