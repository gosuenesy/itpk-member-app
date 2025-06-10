const tags = ["Tennis", "Padel", "Both", "None"];
const genders = ["mand", "kvinde"];

const mockMembers = Array.from({ length: 20 }).map((_, i) => {
  const hasBookingAccount = Math.random() > 0.3;
  const onlyBooking = hasBookingAccount && Math.random() > 0.5;
  const bookingId = hasBookingAccount ? `b-mock-${i}` : null;
  const createdTs = hasBookingAccount
    ? new Date(2024, 9, i + 1).toISOString()
    : null;

  return {
    navn: `Mock Name ${i + 1}`,
    adresse1: `${i + 1} Mock Street`,
    postnr: `100${i}`,
    postnr_by: `Mocktown ${i}`,
    mobil: `1234567${i}`,
    email: `mock${i}@test.com`,
    birth: `199${i % 10}-0${(i % 9) + 1}-15`,
    individuel1: "Senior",
    individuel4: tags[i % tags.length],
    koen: genders[i % genders.length],
    hasBookingAccount,
    onlyBooking,
    bookingId,
    createdTs,
  };
});

export default mockMembers;
