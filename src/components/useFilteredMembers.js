import { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";
import mockMembers from "../mock/mockMembers";

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
            Array.from(
              new Set(cached.data.map((m) => m.individuel1).filter(Boolean))
            )
          );
          setLoading(false);
          return;
        }

        const [res, bookingRes, groupsRes] = await Promise.all([
          fetch("http://localhost:5000/api/members"),
          fetch("http://localhost:5000/api/booking-members"),
          fetch("http://localhost:5000/api/groups"),
        ]);

        const memberData = await res.json();
        const bookingList = await bookingRes.json();
        const groups = groupsRes.ok
          ? (await groupsRes.json()).conventus?.grupper?.gruppe || []
          : [];

        const groupIds = groups.map((g) => g.id).join(",");
        const groupMembersRes = await fetch(
          `http://localhost:5000/api/group-members?grupper=${groupIds}`
        );
        const groupMembersData = groupMembersRes.ok
          ? await groupMembersRes.json()
          : {};

        const conventusList = memberData.conventus?.medlemmer?.medlem || [];
        const matchedBookingIndices = new Set();

        const nameToGroupMap = {};
        const relationGroups = Array.isArray(
          groupMembersData.conventus?.relationer?.gruppe
        )
          ? groupMembersData.conventus.relationer.gruppe
          : [groupMembersData.conventus.relationer.gruppe];

        relationGroups.forEach((groupEntry) => {
          const groupId = groupEntry.id;
          const group = groups.find((g) => g.id === groupId);
          const groupTitle = group?.titel;

          // 👉 Extract correct list of member IDs
          const rawMembers = groupEntry.medlem?.medlem || []; // double medlem

          const members = Array.isArray(rawMembers) ? rawMembers : [rawMembers];

          members.forEach((memberId) => {
            const memberObj = conventusList.find((m) => m.id === memberId);
            if (memberObj?.navn && groupTitle) {
              const normName = normalizeName(memberObj.navn);
              nameToGroupMap[normName] = groupTitle;
            }
          });
        });

        const enriched = conventusList.map((m) => {
          const email = m.email?.toLowerCase().trim();
          const conventusFirstName = normalizeName(m.navn?.split(" ")[0]);
          const fullConventusName = normalizeName(m.navn);

          let bestMatch = null;
          let matchedIndex = null;

          for (let i = 0; i < bookingList.length; i++) {
            const booking = bookingList[i];
            const bookingEmail = booking.email?.toLowerCase().trim();
            const bookingFirstName = normalizeName(booking.firstName);
            const bookingFullName = normalizeName(
              `${booking.firstName} ${booking.lastName}`
            );

            const emailMatch =
              email &&
              bookingEmail &&
              stringSimilarity.compareTwoStrings(email, bookingEmail) > 0.9;

            const firstNameMatch =
              conventusFirstName &&
              bookingFirstName &&
              stringSimilarity.compareTwoStrings(
                conventusFirstName,
                bookingFirstName
              ) > 0.85;

            const fullNameMatch =
              fullConventusName &&
              bookingFullName &&
              stringSimilarity.compareTwoStrings(
                fullConventusName,
                bookingFullName
              ) > 0.85;

            if (emailMatch && firstNameMatch) {
              bestMatch = booking;
              matchedIndex = i;
              break;
            }

            if (!bestMatch && fullNameMatch) {
              bestMatch = booking;
              matchedIndex = i;
              break;
            }
          }

          if (matchedIndex !== null) {
            matchedBookingIndices.add(matchedIndex);
          }

          const normName = normalizeName(m.navn);
          const groupName = nameToGroupMap[normName];

          return {
            ...m,
            hasBookingAccount: !!bestMatch,
            onlyBooking: false,
            bookingId: bestMatch?.id || null,
            createdTs: bestMatch?.createdTs || bestMatch?.created || null,
            groupName,
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
        console.error("Error fetching members, using mock data:", err);
        setMembers(mockMembers);
        setFiltered(mockMembers);
        setTags(
          Array.from(
            new Set(mockMembers.map((m) => m.individuel1).filter(Boolean))
          )
        );
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
