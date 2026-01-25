// Initial static data for landing page load (Syncs with MockDB)
// Calculated from the 627 mock users for deterministic consistency

const candidatesData = [
    {
        id: "1",
        name: "Mawanda Ramadhan Sudais",
        handle: "The Reformer",
        slogan: "Innovation, Integrity, Inclusion.",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Mawanda Ramadhan",
        votes: 312,
        color: "#0F52BA",
        manifesto: "Digitizing guild services and ensuring 24/7 library access.",
        stats: { gender: { male: 55, female: 45 }, schools: {} } // Placeholder, populated by main.js
    },
    {
        id: "2",
        name: "Namukasa Sarah",
        handle: "Voice of Reason",
        slogan: "Empowering every student.",
        avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Sarah&backgroundColor=ffdfbf",
        votes: 315,
        color: "#FFD700",
        manifesto: "Focus on student welfare and accountability.",
        stats: { gender: { male: 40, female: 60 }, schools: {} }
    }
];

const globalStats = {
    totalStudents: 1000,
    registeredVoters: 627,
    votesCast: 627,
    turnoutBySchool: {
        labels: ["Medicine", "Education", "Engineering", "Business", "Science", "Law"],
        data: [120, 150, 100, 130, 80, 47] // Approximation
    },
    votesByTime: {
        labels: ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm"],
        data: [50, 120, 200, 350, 480, 550, 590, 627]
    }
};
