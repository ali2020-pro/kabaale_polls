const fs = require('fs');
const path = require('path');

const TOTAL_VOTERS = 627;
const OUTPUT_FILE = path.join(__dirname, '../mock_users.txt');

let content = "KABAALE SCHOOL OF COMPREHENSIVE NURSING - MOCK VOTER REGISTRY\n";
content += "=============================================================\n";
content += "Total Voters: " + TOTAL_VOTERS + "\n";
content += "Default Password: password123\n";
content += "=============================================================\n\n";
content += "   # | REGISTRATION NUMBER | STATUS\n";
content += "---------------------------------------\n";

for (let i = 0; i < TOTAL_VOTERS; i++) {
    // Deterministic Year Logic from mock_db.js
    const yrRand = i % 3;
    const yrPrefix = 25 - yrRand;

    // Reg No
    const regNo = `${yrPrefix}/U/${1000 + i}/EVE`;

    // Formatting
    const num = (i + 1).toString().padStart(3, '0');
    content += `${num} | ${regNo}      | Active\n`;
}

fs.writeFileSync(OUTPUT_FILE, content);
console.log(`Successfully generated ${OUTPUT_FILE}`);
