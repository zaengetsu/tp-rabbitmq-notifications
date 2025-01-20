import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';
import { NextApiRequest, NextApiResponse } from 'next';

let channel: Channel | null = null;
let connection: Connection | null = null;

const connectRabbitMQ = async (): Promise<void> => {
  if (!connection || (connection as any).connection.stream.destroyed) {
    console.log('[x] Connexion à RabbitMQ...');
    connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
    channel = await connection.createChannel();
    await channel.assertQueue('notification_queue', { durable: true });
    console.log('[x] Connecté à RabbitMQ.');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Méthode non autorisée' });
    return;
  }

  try {
    await connectRabbitMQ();

    const messages: Array<{ id: number; title: string; message: string; type: string }> = [];
    let msg: amqp.GetMessage | false;

    // Lire tous les messages disponibles dans la file d'attente
    while ((msg = await channel!.get('notification_queue', { noAck: false }))) {
      if (msg && msg.content) {
        const content = JSON.parse(msg.content.toString());
        messages.push(content);
        channel!.ack(msg);
      }
    }

    res.status(200).json({ messages });
  } catch (error) {
    console.error('[!] Erreur dans l\'API notifications :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}
