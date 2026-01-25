import os

TOTAL_VOTERS = 627
OUTPUT_FILE = 'mock_users.txt'

# --- DATA ARRAYS (MATCHING mock_db.js) ---
courses = [
    "Nursing (Certificate)", 
    "Nursing (Diploma)", 
    "Midwifery (Certificate)", 
    "Midwifery (Diploma)"
]

names = ["James", "Mariam", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"]
surnames = ["Okello", "Musoke", "Namakula", "Akullo", "Ochieng", "Mugisha", "Nantongo", "Byaruhanga", "Kato", "Babirye", "Lubega", "Nakato", "Tumusiime"]

# --- PRNG LOGIC (MATCHING JS) ---
def imul(a, b):
    return (a * b) & 0xFFFFFFFF

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
        h1 = h2 ^ imul(h1 ^ k, 597399067)
        h2 = h3 ^ imul(h2 ^ k, 2869860233)
        h3 = h4 ^ imul(h3 ^ k, 951274213)
        h4 = h1 ^ imul(h4 ^ k, 2716044179)
    
    h1 = imul(h3 ^ (h1 >> 18), 597399067)
    h2 = imul(h4 ^ (h2 >> 22), 2869860233)
    h3 = imul(h1 ^ (h3 >> 17), 951274213)
    h4 = imul(h2 ^ (h4 >> 19), 2716044179)
    return (h1^h2^h3^h4) & 0xFFFFFFFF

# --- GENERATION ---
header = f"KABAALE SCHOOL OF COMPREHENSIVE NURSING - MOCK VOTER REGISTRY\n"
header += f"Total Voters: {TOTAL_VOTERS}\n"
header += f"Default Password: password123\n"
header += "="*100 + "\n"
header += f"{'#':<4} | {'REG NUMBER':<18} | {'NAME':<25} | {'GENDER':<8} | {'YEAR':<8} | {'COURSE'}\n"
header += "-"*100 + "\n"

content = header

for i in range(TOTAL_VOTERS):
    # Year Logic
    yr_rand = i % 3
    yr_prefix = 25 - yr_rand
    year_label = f"Year {yr_rand + 1}"
    
    # Reg No
    reg_no = f"{yr_prefix}/U/{1000+i}/EVE"
    
    # Seed
    seed = cyrb128(reg_no)
    rng = mulberry32(seed)
    
    # Details
    n_idx = int(rng() * len(names))
    s_idx = int(rng() * len(surnames))
    name = f"{names[n_idx]} {surnames[s_idx]}"
    
    course_idx = i % len(courses)
    course = courses[course_idx]
    
    # Gender Logic (Needs to match mock_db.js bias logic)
    # mock_db.js logic:
    # MAWANDA_VOTES = 337
    # if i < 337: gender = rng() < 0.68 ? 'Female' : 'Male'
    # else: gender = rng() < 0.5 ? 'Female' : 'Male'
    
    gender = "Male"
    if i < 337:
        if rng() < 0.68: gender = "Female" 
        else: gender = "Male"
    else:
        if rng() < 0.5: gender = "Female"
        else: gender = "Male"

    # Formatting
    num = str(i+1).zfill(3)
    content += f"{num:<4} | {reg_no:<18} | {name:<25} | {gender:<8} | {year_label:<8} | {course}\n"

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Generated {OUTPUT_FILE}")
