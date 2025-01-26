import amqplib from "amqplib";

async function sendMesg(msg) {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = 'mail_exchange';
    const routingKey = 'mail_routing_key';
    const queue = 'mail_queue'

    await channel.assertExchange(exchange, 'direct', { durable: false });//durable means should it be persit if connection lost

    await channel.assertQueue('mail_queue', { exclusive: false });//initialize Queue
    await channel.bindQueue('mail_queue', exchange, routingKey);// bind queue with exchange and routing key

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));

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