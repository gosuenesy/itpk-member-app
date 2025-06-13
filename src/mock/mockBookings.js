const mockBookings = Array.from({ length: 40 }).map((_, i) => {
  const numMembers = Math.floor(Math.random() * 4) + 1;

  const randomDaysAhead = Math.floor(Math.random() * 8);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + randomDaysAhead);

  const randomHour = 8 + Math.floor(Math.random() * 14);
  startDate.setHours(randomHour, 0, 0, 0);

  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const sport = i % 2 === 0 ? "Tennis" : "Padel";

  const bookings = Array.from({ length: numMembers }).map((_, j) => ({
    id: `booking-${i}-${j}`,
    accountId: `b-mock-${(i + j) % 20}`,
  }));

  return {
    id: `mock-booking-${i}`,
    startTs: startDate.toISOString(),
    endTs: endDate.toISOString(),
    resources: [{ name: sport }],
    bookings,
  };
});

export default mockBookings;
