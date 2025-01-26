import amqplib from "amqplib";

async function sendMesg(msg) {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = 'mail_exchange';
    const routingKeyForSubUser = 'send_mail_to_sub_user';
    const routingKeyForNormalUser = 'send_mail_to_user';
    const queueForNormalUser = 'users_mail_queue'
    const queueForSubUser = 'subscribed_users_mail_queue'

    await channel.assertExchange(exchange, 'direct', { durable: false });//durable means should it be persit if connection lost

    /* subUser */
    await channel.assertQueue(queueForSubUser, { exclusive: false });//initialize Queue
    await channel.bindQueue(queueForSubUser, exchange, routingKeyForSubUser);// bind queue with exchange and routing key

    /* Normal user */
    await channel.assertQueue(queueForNormalUser, { exclusive: false });//initialize Queue
    await channel.bindQueue(queueForNormalUser, exchange, routingKeyForNormalUser);// bind queue with exchange and routing key

    channel.publish(exchange, routingKeyForSubUser, Buffer.from(JSON.stringify(msg)));//change the routing as per need

    console.log("Message sent successfully", { msg });
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

await sendMesg({
  to: "saln@gmail.com",
  from: "sfaris@example.com",
  subject: "test mail..",
  body: "test body.........."
});