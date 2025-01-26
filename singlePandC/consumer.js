import amqp from "amqplib";

async function recieveMsg() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange('mail_exchange', 'direct', { durable: false });

    channel.consume('mail_queue', (msg) => {
      if (msg !== null) {
        console.log("Message received:", JSON.parse(msg.content));
        channel.ack(msg);
      }
    });

  } catch (error) {
    console.log(error);
  }
}

recieveMsg();