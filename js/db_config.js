/**
 * KABAALE UNIVERSITY VOTING SYSTEM - CONFIGURATION
 * Edit this file to change candidates, positions, or election outcomes.
 * Changes here automatically update the entire system.
 */

window.DB_CONFIG = {
    // --- ELECTION SETTINGS ---
    total_voters: 627,

    // --- HARDCODED RESULTS (QUOTA SYSTEM) ---
    // Exact number of votes per candidate.
    // Auto-generated candidates have IDs like: 'vp_c0', 'vp_c1', etc.
    fixed_outcomes: {
        'president': { '1': 320, '2': 250 },
        'vp': { 'vp_c0': 200, 'vp_c1': 190, 'vp_c2': 180 }, // 3 Candidates
        'gen_sec': { 'gen_sec_c0': 300, 'gen_sec_c1': 260 },
        'speaker': { 'speaker_c0': 310, 'speaker_c1': 250 },
        'finance': { 'finance_c0': 280, 'finance_c1': 280 },
        'academics': { 'academics_c0': 210, 'academics_c1': 190, 'academics_c2': 170 }, // 3 Candidates
        'welfare': { 'welfare_c0': 290, 'welfare_c1': 270 },
        'health': { 'health_c0': 305, 'health_c1': 255 },
        'sports': { 'sports_c0': 220, 'sports_c1': 180, 'sports_c2': 170 }, // 3 Candidates
        'entertainment': { 'entertainment_c0': 285, 'entertainment_c1': 275 },
        'culture': { 'culture_c0': 300, 'culture_c1': 260 },
        'external': { 'external_c0': 295, 'external_c1': 265 },
        'internal': { 'internal_c0': 310, 'internal_c1': 250 },
        'justice': { 'justice_c0': 290, 'justice_c1': 270 },
        'transport': { 'transport_c0': 325, 'transport_c1': 235 },
        'info': { 'info_c0': 200, 'info_c1': 195, 'info_c2': 175 }, // 3 Candidates
        'campus': { 'campus_c0': 190, 'campus_c1': 190, 'campus_c2': 190 }, // 3-way Tie
        'security': { 'security_c0': 312, 'security_c1': 248 },
        'gender': { 'gender_c0': 298, 'gender_c1': 262 },
        'prod': { 'prod_c0': 292, 'prod_c1': 268 },
        'env': { 'env_c0': 215, 'env_c1': 185, 'env_c2': 170 }, // 3 Candidates
        'religious': { 'religious_c0': 318, 'religious_c1': 242 },
        'pwd': { 'pwd_c0': 282, 'pwd_c1': 278 },
        'off_campus': { 'off_campus_c0': 306, 'off_campus_c1': 254 },
        'ict': { 'ict_c0': 314, 'ict_c1': 246 },
        'research': { 'research_c0': 296, 'research_c1': 264 },
        'projects': { 'projects_c0': 304, 'projects_c1': 256 },
        'hall': { 'hall_c0': 230, 'hall_c1': 200, 'hall_c2': 140 }, // 3 Candidates
        'games': { 'games_c0': 286, 'games_c1': 274 },
        'editor': { 'editor_c0': 316, 'editor_c1': 244 }
    },

    // --- DEMOGRAPHICS ---
    courses: [
        "Nursing (Certificate)",
        "Nursing (Diploma)",
        "Midwifery (Certificate)",
        "Midwifery (Diploma)"
    ],

    years: ["Year 1", "Year 2", "Year 3"],

    // --- POSITIONS ---
    positions: [
        { id: 'president', title: 'Guild President' },
        { id: 'vp', title: 'Vice President' },
        { id: 'gen_sec', title: 'General Secretary' },
        { id: 'speaker', title: 'Rt. Hon. Speaker' },
        { id: 'finance', title: 'Minister of Finance' },
        { id: 'academics', title: 'Minister of Academics' },
        { id: 'welfare', title: 'Minister of Welfare' },
        { id: 'health', title: 'Minister of Health' },
        { id: 'sports', title: 'Minister of Sports' },
        { id: 'entertainment', title: 'Minister of Entertainment' },
        { id: 'culture', title: 'Minister of Culture' },
        { id: 'external', title: 'External Affairs' },
        { id: 'internal', title: 'Internal Affairs' },
        { id: 'justice', title: 'Minister of Justice' },
        { id: 'transport', title: 'Minister of Transport' },
        { id: 'info', title: 'Minister of Information' },
        { id: 'campus', title: 'Campus Affairs' },
        { id: 'security', title: 'Security Minister' },
        { id: 'gender', title: 'Gender Minister' },
        { id: 'prod', title: 'Production Minister' },
        { id: 'env', title: 'Environment Minister' },
        { id: 'religious', title: 'Religious Affairs' },
        { id: 'pwd', title: 'Minister for PWDs' },
        { id: 'off_campus', title: 'Off-Campus Affairs' },
        { id: 'ict', title: 'Minister of ICT' },
        { id: 'research', title: 'Research Minister' },
        { id: 'projects', title: 'Projects Minister' },
        { id: 'hall', title: 'Hall Chairperson' },
        { id: 'games', title: 'Games Union' },
        { id: 'editor', title: 'Chief Editor' }
    ],

    // --- CANDIDATES ---
    // You can add more props like 'bio', 'age', 'manifesto' for the details modal.
    candidates: {
        'president': [
            {
                id: '1',
                name: 'Mawanda Ramadhan Sudais',
                photo: 'https://api.dicebear.com/7.x/initials/svg?seed=Mawanda',
                color: '#0F52BA',
                slogan: "Innovation, Integrity, Inclusion.",
                age: 23,
                course: "Nursing (Diploma) - Year 1",
                manifesto: [
                    "Digitize all guild services by 2027.",
                    "Ensure 24/7 library access for all students.",
                    "Establish a student emergency support fund."
                ]
            },
            {
                id: '2',
                name: 'Kiryomuhindo Mwenda Paul',
                photo: 'https://api.dicebear.com/7.x/initials/svg?seed=Kiryomuhindo',
                color: '#FFD700',
                slogan: "Empowering every student.",
                age: 22,
                course: "Nursing2 (Diploma) - Year 2",
                manifesto: [
                    "Advocate for better hostel security.",
                    "Increase funding for sports and culture.",
                    "Transparent accountability for guild fees."
                ]
            }
        ]
        // Other candidates are auto-generated currently in mock_db, 
        // but you can define them here to override.
    }
};
