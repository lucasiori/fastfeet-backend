export default delivery => {
  if (delivery.canceled_at) {
    return 'canceled';
  }

  if (delivery.end_date) {
    return 'finalized';
  }

  if (delivery.start_date) {
    return 'started';
  }

  return 'pending';
};
