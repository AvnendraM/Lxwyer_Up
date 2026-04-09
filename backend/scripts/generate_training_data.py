import json
import random
import os

general_qs = [
    "Hello", "Hi there", "Hey", "Good morning", "Good afternoon", "Good evening",
    "How are you?", "What's up", "Greetings", "Are you a bot?", "Who are you?",
    "Tell me about yourself", "Thanks", "Thank you", "Goodbye", "Bye", 
    "See you later", "Help", "I need help", "Can you help me?"
]

general_templates = [
    "{}", "{} friend", "{} AI", "{} Lxwyer", "{} my friend", "Uh, {}"
]

legal_topics = [
    ("What is an FIR?", "Criminal Law 👮", ["BNS 2023"], "An FIR is a First Information Report.", "FIR Overview", "📋", "Initial report to police.", "An FIR is filed at a police station for cognizable offences. It is free to file and mandatory for police to register."),
    ("How do I get bail?", "Criminal Law 👮", ["BNSS 2023"], "Bail is provisional release.", "Bail Guide", "🔓", "Types of bail.", "Regular bail requires applying to the court. Anticipatory bail (Sec 438) can be sought if you fear arrest."),
    ("I want a divorce", "Family/Civil 🏠", ["Hindu Marriage Act 1955"], "Divorce involves legal separation.", "Divorce Details", "📄", "Mutual vs Contested.", "Mutual divorce requires a 6-18 month waiting period. Contested takes longer and requires proving grounds like cruelty."),
    ("My property was grabbed", "Family/Civil 🏠", ["Transfer of Property Act 1882"], "Property encroachment is a civil and criminal issue.", "Property Action", "🏠", "File suit.", "You can file a suit for injunction or an FIR for criminal trespass depending on the nature of the grab."),
    ("Consumer court rules?", "Family/Civil 🏠", ["Consumer Protection Act 2019"], "Consumer protection safeguards buyers.", "Consumer Rights", "🛍️", "Filing cases.", "File at District Commission up to ₹1 crore. E-filing is also available on E-daakhil."),
    ("What is a cheque bounce?", "Corporate 💼", ["Negotiable Instruments Act 1881"], "Cheque dishonour is a serious offence.", "Cheque Bounce", "💳", "Section 138 Notice.", "Send a legal notice within 30 days of the cheque return memo. Failure to pay within 15 days allows you to file a complaint."),
    ("Startup registration?", "Corporate 💼", ["Companies Act 2013"], "Registering a startup involves MCA.", "Startup Setup", "🚀", "Company structures.", "You can register as a Pvt Ltd, LLP, or Proprietorship. Pvt Ltd is best for raising funding."),
    ("Dowry harassment?", "Criminal Law 👮", ["BNS 2023 (formerly IPC 498A)"], "Dowry harassment is severely punished.", "Dowry Act", "🛡️", "Immediate action.", "File an FIR under Section 498A (or its BNS equivalent). This offence is non-bailable and cognizable."),
    ("Child custody?", "Family/Civil 🏠", ["Guardians and Wards Act 1890"], "Custody is based on the child's welfare.", "Child Custody", "👶", "Welfare principle.", "Courts determine custody strictly based on the 'best interests of the child', evaluating financial and emotional stability."),
    ("Landlord eviction notice?", "Family/Civil 🏠", ["Rent Control Act"], "Eviction requires due process.", "Tenant Rights", "🏢", "Legal eviction.", "A landlord cannot arbitrarily evict without standard notice (usually 30-60 days) and a valid ground under Rent Control laws.")
]

# We need 500 general and 200 legal.
kb = []

# Generate exactly 500 general
for i in range(500):
    q = random.choice(general_templates).format(random.choice(general_qs)) + ("" if random.random()>0.5 else "?")
    kb.append({
        "query": q.lower(),
        "response": {
            "intro": "",
            "intent": "Greeting/Casual 💬",
            "sentiment": "Neutral 😐",
            "sources": [],
            "cards": [],
            "is_greeting": True,
            "greeting_text": "Hello! I am your Lxwyer AI Assistant. I can help with Indian legal queries, case analysis, and finding the right lawyer. What is your legal issue today?"
        }
    })

# Generate exactly 200 legal
legal_variations = [
    "{}", "tell me about {}", "explain {}", "what do you know about {}", 
    "i need help with {}", "legal advice on {}", "guide me on {}"
]

for i in range(200):
    topic = legal_topics[i % len(legal_topics)]
    q = random.choice(legal_variations).format(topic[0])
    kb.append({
        "query": q.lower(),
        "response": {
            "intro": f"Here is the legal breakdown for your query regarding {topic[0]}.",
            "intent": topic[1],
            "sentiment": "Neutral 😐",
            "sources": topic[2],
            "cards": [
                {
                    "id": "overview",
                    "icon": topic[5],
                    "title": topic[4],
                    "summary": topic[6],
                    "detail": topic[7]
                },
                {
                    "id": "action",
                    "icon": "🔍",
                    "title": "Next Steps",
                    "summary": "What to do right now.",
                    "detail": "Consult a qualified advocate with your specific case details. Ensure you keep all necessary documents handy."
                }
            ],
            "is_greeting": False,
            "greeting_text": ""
        }
    })

os.makedirs('backend/data', exist_ok=True)
with open('backend/data/training_kb.json', 'w') as f:
    json.dump(kb, f, indent=2)

print(f"Generated {len(kb)} training instances (500 general, 200 legal) in backend/data/training_kb.json")
