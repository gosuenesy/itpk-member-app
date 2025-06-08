import { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";

const MEMBER_CACHE_KEY = "itpk-members-cache";
const CACHE_EXPIRATION_MINUTES = 15;

const isCacheValid = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = (now - then) / (1000 * 60);
  return diff < CACHE_EXPIRATION_MINUTES;
};

const normalizeName = (str) =>
  str
    ?.normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .replace(/å/g, "a")
    .replace(/ö/g, "o")
    .replace(/ä/g, "a")
    .toLowerCase()
    .trim();

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cached = JSON.parse(localStorage.getItem(MEMBER_CACHE_KEY));
        if (cached && isCacheValid(cached.timestamp)) {
          setMembers(cached.data);
          setFiltered(cached.data);
          setTags(
            Array.from(new Set(cached.data.map((m) => m.individuel1).filter(Boolean)))
          );
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/members");
        const data = await res.json();
        const conventusList = data.conventus?.medlemmer?.medlem || [];

        const bookingRes = await fetch(
          "http://localhost:5000/api/booking-members"
        );
        const bookingList = await bookingRes.json();

        const matchedBookingIndices = new Set();

        const enriched = conventusList.map((m) => {
          const name = normalizeName(m.navn);
          const email = m.email?.toLowerCase().trim();

          let bestMatch = null;
          let matchedIndex = null;

          for (let i = 0; i < bookingList.length; i++) {
            const booking = bookingList[i];
            const fullName = normalizeName(`${booking.firstName} ${booking.lastName}`);
            const bookingEmail = booking.email?.toLowerCase().trim();

            const emailMatch =
              email &&
              bookingEmail &&
              stringSimilarity.compareTwoStrings(email, bookingEmail) > 0.9;

            const nameMatch =
              name &&
              fullName &&
              stringSimilarity.compareTwoStrings(name, fullName) > 0.85;

            if (emailMatch || nameMatch) {
              bestMatch = booking;
              matchedIndex = i;
              break;
            }
          }

          if (matchedIndex !== null) {
            matchedBookingIndices.add(matchedIndex);
          }

          return {
            ...m,
            hasBookingAccount: !!bestMatch,
            onlyBooking: false,
            bookingId: bestMatch?.id || null,
            createdTs: bestMatch?.createdTs || bestMatch?.created || null,
          };
        });

        const bookingOnly = bookingList
          .filter((_, index) => !matchedBookingIndices.has(index))
          .map((b) => ({
            navn: `${b.firstName} ${b.lastName}`,
            email: b.email || "",
            postnr_by: b.city || "",
            individuel1: "",
            hasBookingAccount: true,
            onlyBooking: true,
            bookingId: b.id,
            createdTs: b.createdTs || b.created || null,
          }));

        const combined = [...enriched, ...bookingOnly];

        const allTags = Array.from(
          new Set(combined.map((m) => m.individuel1).filter(Boolean))
        );

        localStorage.setItem(
          MEMBER_CACHE_KEY,
          JSON.stringify({ data: combined, timestamp: new Date() })
        );

        setTags(allTags);
        setMembers(combined);
        setFiltered(combined);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
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

  return { filtered, tags, setMembers, loading };
};