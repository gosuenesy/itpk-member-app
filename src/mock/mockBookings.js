const mockBookings = Array.from({ length: 20 }).map((_, i) => {
  const numMembers = Math.floor(Math.random() * 4) + 1;
  const start = new Date(2024, 9, (i % 30) + 1, 8 + (i % 5), 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const sport = i % 2 === 0 ? "Tennis" : "Padel";

  const bookings = Array.from({ length: numMembers }).map((_, j) => ({
    id: `booking-${i}-${j}`,
    accountId: `b-mock-${(i + j) % 20}`,
  }));

  return {
    id: `mock-booking-${i}`,
    startTs: start.toISOString(),
    endTs: end.toISOString(),
    resources: [{ name: sport }],
    bookings,
  };
});

export default mockBookings;
