import Mail from '../../lib/Mail';

class SubscriptionMail {
  /** Retornar chave única do job */
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, username } = data;

    await Mail.sendMail({
      to: `${meetup.organizer.name} <${meetup.organizer.email}>`,
      subject: `New subscriber`,
      template: 'subscription',
      context: {
        organizer: meetup.organizer.name,
        meetup: meetup.title,
        user: username,
        email: meetup.organizer.email,
      },
    });
  }
}

export default new SubscriptionMail();
