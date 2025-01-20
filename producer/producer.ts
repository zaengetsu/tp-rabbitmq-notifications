import amqp from 'amqplib';

// Variable globale pour numéroter les notifications
let notificationCounter = 0;

// Fonction pour établir une connexion et un canal à RabbitMQ
async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue('notification_queue', { durable: true });
    console.log('[x] Connecté à RabbitMQ');
    return { connection, channel };
  } catch (error) {
    console.error('[!] Impossible de se connecter à RabbitMQ. Nouvelle tentative dans 5 secondes...', error);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectToRabbitMQ();
  }
}

// Fonction pour envoyer un message structuré à RabbitMQ
async function sendMessage(title: string, message: string, type: string = 'info') {
  notificationCounter += 1;

  const structuredMessage = {
    id: notificationCounter,
    title,
    message,
    type, // Type de notification (info, warning...)
  };

  try {
    const { connection, channel } = await connectToRabbitMQ();
    await channel.sendToQueue(
      'notification_queue',
      Buffer.from(JSON.stringify(structuredMessage))
    );
    console.log(`[x] Message envoyé : ${JSON.stringify(structuredMessage)}`);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('[!] Erreur lors de l\'envoi du message :', error);
  }
}

// Routine pour envoyer des notifications régulières (type info)
async function routineMessage() {
  while (true) {
    await sendMessage(
      'Notification régulière',
      'Ceci est un message régulier.',
      'info',
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

// Routine pour envoyer des notifications spéciales (type warning)
async function routineAdditional() {
  while (true) {
    await sendMessage(
      'Notification d\'avertissement',
      'Ceci est un message spécial d\'avertissement.',
      'warning',
    );
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}

// Routine pour envoyer des notifications spéciales (type warning)
async function routineError() {
  while (true) {
    await sendMessage(
      "Notification d'erreur",
      "Ceci est un message spécial d'erreur",
      'error',
    );
    await new Promise((resolve) => setTimeout(resolve, 15000));
  }
}

// Point d'entrée principal
async function main() {
  try {
    console.log('[x] Démarrage des routines...');
    routineMessage();
    routineAdditional();
    routineError();
  } catch (error) {
    console.error('[!] Erreur dans le producteur :', error);
  }
}

main();
