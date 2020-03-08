import Mail from '../../lib/Mail';

class DeliveryCancellationMail {
  get key() {
    return 'DeliveryCancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Cancelamento de entrega',
      template: 'deliverycancellation',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
      },
    });
  }
}

export default new DeliveryCancellationMail();
