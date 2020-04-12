import Mail from '../../lib/Mail';

class ChangeDeliveryMail {
  get key() {
    return 'ChangeDeliveryMail';
  }

  async handle({ data }) {
    const { oldDelivery, newDelivery } = data;

    await Mail.sendMail({
      to: `${newDelivery.deliveryman.name} <${newDelivery.deliveryman.email}>`,
      subject: 'FastFeet - Alteração na Entrega',
      template: 'changedelivery',
      context: {
        newDelivery,
        oldDelivery,
        images: {
          logo: `${process.env.APP_URL}/assets/logo.png`,
          product: `${process.env.APP_URL}/assets/email-produto.png`,
          customer: `${process.env.APP_URL}/assets/email-cliente.png`,
          address: `${process.env.APP_URL}/assets/email-endereco.png`,
        },
      },
    });
  }
}

export default new ChangeDeliveryMail();
