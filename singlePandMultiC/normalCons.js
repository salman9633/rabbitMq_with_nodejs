import amqp from "amqplib";

async function recieveMsgForNormalUser() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue('users_mail_queue', 'direct', { durable: false });

    channel.consume('users_mail_queue', (msg) => {
      if (msg !== null) {
        console.log("Message received:", JSON.parse(msg.content));
        channel.ack(msg);
      }
    });

  } catch (error) {
    console.log(error);
  }
}

recieveMsgForNormalUser();