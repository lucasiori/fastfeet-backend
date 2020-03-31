import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, delivery, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'FastFeet - Você possui uma nova entrega',
      template: 'newdelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        recipient,
        logo: `${process.env.APP_URL}/assets/fastfeet.png`,
      },
    });
  }
}

export default new NewDeliveryMail();
