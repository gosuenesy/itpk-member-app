import { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";

export const useFilteredMembers = ({
  selectedTag,
  searchName,
  searchCity,
  searchEmail,
  bookingFilter,
}) => {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/members");
        const data = await res.json();
        const conventusList = data.conventus?.medlemmer?.medlem || [];

        const bookingRes = await fetch("/api/booking-members");
        const bookingList = await bookingRes.json();

        const bookingNames = bookingList.map((b) =>
          `${b.firstName} ${b.lastName}`.toLowerCase().trim()
        );
        const bookingEmails = bookingList.map((b) =>
          b.email?.toLowerCase().trim()
        );

        const matchedBookingIndices = new Set();

        const enriched = conventusList.map((m) => {
          const name = m.navn?.toLowerCase().trim();
          const email = m.email?.toLowerCase().trim();

          const nameMatch = stringSimilarity.findBestMatch(name, bookingNames);
          const emailMatch = stringSimilarity.findBestMatch(
            email,
            bookingEmails
          );

          const nameRating = nameMatch.bestMatch.rating;
          const emailRating = emailMatch.bestMatch.rating;

          const hasBookingAccount = nameRating > 0.85 || emailRating > 0.9;

          if (nameRating > 0.85)
            matchedBookingIndices.add(nameMatch.bestMatchIndex);
          if (emailRating > 0.9)
            matchedBookingIndices.add(emailMatch.bestMatchIndex);

          return { ...m, hasBookingAccount, onlyBooking: false };
        });

        const bookingOnly = bookingList
          .map((b, index) => ({ ...b, id: `booking-${index}` }))
          .filter((_, index) => !matchedBookingIndices.has(index))
          .map((b) => ({
            navn: `${b.firstName} ${b.lastName}`,
            email: b.email || "",
            postnr_by: b.city || "",
            individuel1: "",
            hasBookingAccount: true,
            onlyBooking: true,
          }));

        const combined = [...enriched, ...bookingOnly];

        const allTags = Array.from(
          new Set(combined.map((m) => m.individuel1).filter(Boolean))
        );

        setTags(allTags);
        setMembers(combined);
        setFiltered(combined);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...members];

    if (selectedTag) {
      result = result.filter((m) => m.individuel1 === selectedTag);
    }

    if (searchName) {
      result = result.filter((m) =>
        m.navn.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchCity) {
      result = result.filter((m) =>
        m.postnr_by.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    if (searchEmail) {
      result = result.filter((m) =>
        m.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (bookingFilter === "with") {
      result = result.filter((m) => m.hasBookingAccount && !m.onlyBooking);
    } else if (bookingFilter === "without") {
      result = result.filter((m) => !m.hasBookingAccount);
    } else if (bookingFilter === "only") {
      result = result.filter((m) => m.onlyBooking);
    }

    setFiltered(result);
  }, [
    selectedTag,
    searchName,
    searchCity,
    searchEmail,
    members,
    bookingFilter,
  ]);

  return { filtered, tags, setMembers };
};
