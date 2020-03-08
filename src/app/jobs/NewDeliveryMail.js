import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova Entrega',
      template: 'newdelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
      },
    });
  }
}

export default new NewDeliveryMail();
