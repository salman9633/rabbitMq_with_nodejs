import amqp from "amqplib";

async function recieveMsg() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue('mail_queue', 'direct', { durable: false });

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