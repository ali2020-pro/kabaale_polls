import json
# comment
TOTAL_VOTERS = 627
OUTPUT_FILE = 'js/users_list.js'

# --- DATA & LOGIC PORTED FROM mock_db.js ---
courses = ["Nursing (Certificate)", "Nursing (Diploma)", "Midwifery (Certificate)", "Midwifery (Diploma)"]
names = ["James", "Mariam", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"]
surnames = ["Okello", "Musoke", "Namakula", "Akullo", "Ochieng", "Mugisha", "Nantongo", "Byaruhanga", "Kato", "Babirye", "Lubega", "Nakato", "Tumusiime"]

def imul(a, b): return (a * b) & 0xFFFFFFFF
def mulberry32(a):
    state = a
    def next():
        nonlocal state
        state = (state + 0x6D2B79F5) & 0xFFFFFFFF
        t = state
        t = imul(t ^ (t >> 15), t | 1)
        t ^= t + imul(t ^ (t >> 7), t | 61)
        t &= 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return next
def cyrb128(s):
    h1, h2, h3, h4 = 1779033703, 3144134277, 1013904242, 2773480762
    for char in s:
        k = ord(char)
        h1 = h2 ^ imul(h1 ^ k, 597399067); h2 = h3 ^ imul(h2 ^ k, 2869860233)
        h3 = h4 ^ imul(h3 ^ k, 951274213); h4 = h1 ^ imul(h4 ^ k, 2716044179)
    h1 = imul(h3 ^ (h1 >> 18), 597399067); h2 = imul(h4 ^ (h2 >> 22), 2869860233)
    h3 = imul(h1 ^ (h3 >> 17), 951274213); h4 = imul(h2 ^ (h4 >> 19), 2716044179)
    return (h1^h2^h3^h4) & 0xFFFFFFFF

# --- GENERATE USERS ---
users = []
MAWANDA_VOTES = 337

for i in range(TOTAL_VOTERS):
    yr_rand = i % 3
    yr_prefix = 25 - yr_rand
    year_label = f"Year {yr_rand + 1}"
    reg_no = f"{yr_prefix}/U/{1000+i}/EVE"
    
    seed = cyrb128(reg_no)
    rng = mulberry32(seed)
    
    n_idx = int(rng() * len(names))
    s_idx = int(rng() * len(surnames))
    name = f"{names[n_idx]} {surnames[s_idx]}"
    
    course_idx = i % len(courses)
    course = courses[course_idx]
    
    gender = "Male"
    if i < MAWANDA_VOTES:
        gender = "Female" if rng() < 0.68 else "Male"
    else:
        gender = "Female" if rng() < 0.5 else "Male"
    
    # Store minimal info (votes generated runtime or stored? User asked to "modify details")
    # If we store votes here, the file becomes huge and hard to edit.
    # User said "modify any of their details". Usually implies Auth/Profile.
    # Let's verify: "every user must have their own vote history... assume they didnt vote".
    # I will generate basic profile data here. The VOTES rely on mock_db logic, OR I can bake them in.
    # Baking them in makes the file huge (30 positions * 600 users = 18000 lines).
    # I'll stick to Profile/Auth details in the static file, and keep Vote Logic in mock_db 
    # BUT seeded by this static data? No, mock_db currently seeds from RegNo.
    # If I rename a user in the static file, their seed (RegNo) stays same, so votes stay same. That works.
    
    users.append({
        "regNo": reg_no,
        "password": "password123",
        "name": name,
        "gender": gender,
        "school": course,
        "year": year_label
    })

# --- WRITE JS FILE ---
js_content = "// EDITABLE USER DATABASE\n"
js_content += "// You can manually modify names, passwords, or details here.\n"
js_content += "// This file is loaded before mock_db.js\n\n"
js_content += "window.STATIC_USERS = " + json.dumps(users, indent=2) + ";\n"

with open(OUTPUT_FILE, 'w') as f:
    f.write(js_content)

print(f"Generated {OUTPUT_FILE}")
