import Mail from '../../lib/Mail';

class DeliveryCancellationMail {
  get key() {
    return 'DeliveryCancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'FastFeet - Cancelamento de Entrega',
      template: 'deliverycancellation',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        recipient,
        logo: `${process.env.APP_URL}/images/fastfeet.png`,
      },
    });
  }
}

export default new DeliveryCancellationMail();
