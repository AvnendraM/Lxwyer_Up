// CHATBOT TRAINING DATA — 100 FAQs for LxwyerUp AI

export const greetings = {
    keywords: ['hi', 'hello', 'hey', 'hii', 'hola', 'namaste', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup', 'hai', 'helo'],
    responses: [
        "Hello! 👋 I'm your AI legal assistant. Tell me your legal issue and city and I'll find the right lawyer for you.",
        "Hi there! Welcome to Lxwyer Up. What legal problem are you facing?",
        "Hey! Describe your case and location and I'll recommend verified lawyers instantly.",
    ]
};

export const farewells = {
    keywords: ['bye', 'goodbye', 'see you', 'exit', 'quit', 'close', 'later', 'take care', 'cya'],
    responses: [
        "Goodbye! 👋 Come back anytime you need legal help.",
        "See you! Don't hesitate to return if you need legal assistance. 😊",
    ]
};

export const thanks = {
    keywords: ['thanks', 'thank you', 'thx', 'thank u', 'appreciated', 'wonderful', 'helpful', 'superb', 'well done'],
    responses: [
        "You're welcome! 😊 Let me know if you need anything else.",
        "Happy to help! Feel free to ask if you have other legal queries.",
        "Anytime! I'm here whenever you need legal assistance. 🙏",
    ]
};

export const acknowledgements = {
    keywords: ['okay', 'sure', 'alright', 'got it', 'understood', 'i see', 'makes sense', 'noted', 'ok'],
    responses: [
        "Got it! Tell me your legal issue and city — for example: \"Property dispute in Delhi\"",
        "Alright! Whenever you're ready, describe your case and I'll find a match.",
    ]
};

export const aboutBot = {
    keywords: ['who are you', 'what can you do', 'help me', 'how does this work', 'what do you do', 'tell me about yourself', 'your name', 'about you', 'how to use', 'what is lxwyer', 'lxwyer up', 'lxwyer ai'],
    responses: [
        "I'm **Lxwyer AI v0.1** ⚖️ — your Indian legal intelligence engine.\n\n• 🔍 Auto-detects area of law from your query\n• 📍 Ask me your city — I'll match lawyers by location\n• 💰 Mention fee range or consultation mode for better matches\n• 📚 Covers BNS, IPC, BNSS, CPC, CrPC, Consumer Protection & more\n• ✅ Only verified experience shown — no misleading ratings\n\nJust describe your legal problem in plain language and I'll handle the rest!",
    ]
};

export const legalInfo = [
    {
        keywords: ['what is fir', 'fir meaning', 'first information report', 'how to file fir', 'lodge fir', 'register fir', 'file a police complaint', 'police complaint'],
        responses: ["An FIR (First Information Report) is a written document filed at a police station for a cognizable offence.\n\n📌 Key Points:\n• Free to file at any police station\n• Police cannot refuse to register it\n• Online FIR available in many states\n• You get a copy of the FIR\n\nNeed a criminal lawyer? Tell me your city!"]
    },
    {
        keywords: ['bail', 'how to get bail', 'bail process', 'anticipatory bail', 'regular bail', 'interim bail', 'bail application'],
        responses: ["Bail is temporary release of an accused awaiting trial.\n\n📌 Types:\n• Regular Bail (Sec 437/439 CrPC)\n• Anticipatory Bail (Sec 438 — before arrest)\n• Interim Bail (temporary)\n\nWant a criminal lawyer for bail? Tell me your location!"]
    },
    {
        keywords: ['divorce', 'mutual consent divorce', 'contested divorce', 'how to get divorce', 'divorce process', 'divorce in india', 'separation', 'annulment'],
        responses: ["Divorce in India:\n\n1. **Mutual Consent** (Sec 13B) — Both agree, takes 6–18 months\n2. **Contested** — One party files, takes 2–5 years\n\nGrounds: cruelty, adultery, desertion, mental disorder\n\nNeed a family lawyer? Tell me your city!"]
    },
    {
        keywords: ['property dispute', 'land dispute', 'property rights', 'property registration', 'land grab', 'encroachment', 'boundary dispute', 'title deed', 'sale deed'],
        responses: ["Property disputes are very common in India.\n\n📌 Types:\n• Title/ownership disputes\n• Boundary disputes\n• Tenant-landlord issues\n• Ancestral property partition\n• Illegal encroachment\n\nI can find a property lawyer for you! What's your location?"]
    },
    {
        keywords: ['consumer complaint', 'consumer rights', 'consumer court', 'defective product', 'poor service', 'consumer protection', 'online shopping fraud', 'refund denied'],
        responses: ["File under the Consumer Protection Act, 2019.\n\n📌 Where:\n• District Commission — up to ₹1 crore\n• State Commission — ₹1–10 crore\n• National Commission — above ₹10 crore\n\nIssues covered: defective goods, bad service, overcharging, unfair trade\n\nWant a consumer lawyer? Tell me your city!"]
    },
    {
        keywords: ['cheque bounce', 'cheque dishonour', 'section 138', 'bounced cheque', 'dishonoured cheque', 'ni act'],
        responses: ["Cheque bounce is criminal under Sec 138 Negotiable Instruments Act.\n\n📌 Steps:\n1. Send legal notice within 30 days of return\n2. Wait 15 days for payment\n3. File complaint within 30 days\n\nPunishment: Up to 2 years jail OR double the cheque amount as fine\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['gst', 'gst registration', 'gst filing', 'goods and services tax', 'gst notice', 'gst return', 'gst refund'],
        responses: ["GST is India's indirect tax.\n\n📌 Key Points:\n• Register if turnover > ₹40L (goods) / ₹20L (services)\n• Returns: GSTR-1, GSTR-3B monthly/quarterly\n• Rates: 0%, 5%, 12%, 18%, 28%\n\nNeed a tax lawyer? Tell me your location!"]
    },
    {
        keywords: ['cyber crime', 'online fraud', 'hacking', 'cyber complaint', 'online scam', 'phishing', 'identity theft', 'data theft', 'cyberstalking', 'social media harassment'],
        responses: ["Cyber crimes under IT Act, 2000.\n\n📌 Common crimes:\n• Online fraud / phishing\n• Identity theft\n• Hacking\n• Cyberstalking\n• Data theft\n\n📌 Report at:\n• cybercrime.gov.in\n• Local cyber cell\n\nWant a cyber law expert? Tell me your city!"]
    },
    {
        keywords: ['labour law', 'employee rights', 'wrongful termination', 'salary dispute', 'fired', 'retrenchment', 'layoff', 'pf issue', 'gratuity', 'esic', 'esi', 'minimum wages'],
        responses: ["Indian labour laws protect employees.\n\n📌 Key Rights:\n• Minimum wages must be paid\n• Notice period before termination\n• Gratuity after 5 years\n• PF & ESI mandatory\n• No workplace discrimination\n\nFile complaints at Labour Commissioner or Labour Court.\n\nNeed a labour lawyer? Tell me your location!"]
    },
    {
        keywords: ['startup', 'company registration', 'llp', 'incorporate', 'business registration', 'private limited', 'sole proprietorship', 'partnership firm', 'company form'],
        responses: ["Business structures in India:\n\n• **Private Limited** — Best for startups\n• **LLP** — Less compliance\n• **Sole Proprietorship** — Simplest\n• **Partnership** — For 2+ partners\n\nKey registrations: GST, MSME, Trademark, FSSAI\n\nNeed a corporate lawyer? Tell me your city!"]
    },
    {
        keywords: ['patent', 'trademark', 'copyright', 'ip', 'intellectual property', 'brand protection', 'design registration', 'infringement', 'piracy'],
        responses: ["Intellectual Property protection in India:\n\n• **Trademark** — Protects brand name/logo (10 years, renewable)\n• **Patent** — Protects invention (20 years)\n• **Copyright** — Protects creative work (life + 60 years)\n• **Design** — Protects product appearance\n\nNeed an IP lawyer? Tell me your location!"]
    },
    {
        keywords: ['income tax', 'it return', 'tax notice', 'income tax raid', 'tax assessment', 'tax evasion', 'tds', 'tax refund', 'itr filing', 'tax appeal'],
        responses: ["Income tax issues in India:\n\n📌 Common Issues:\n• Tax notices (Sec 143, 148)\n• TDS mismatches\n• Tax evasion scrutiny\n• Appeals to ITAT\n• Tax refunds\n\nFiling deadline: July 31 (individuals)\n\nNeed a tax lawyer? Tell me your city!"]
    },
    {
        keywords: ['domestic violence', '498a', '498', 'dowry', 'dowry harassment', 'cruelty by husband', 'protection order', 'maintenance', 'domestic abuse'],
        responses: ["Domestic violence is covered under the Protection of Women from Domestic Violence Act, 2005.\n\n📌 Remedies:\n• Protection Order\n• Residence Order\n• Monetary Relief\n• Custody Order\n\nFor dowry harassment: IPC Sec 498A (up to 3 years jail)\n\nNeed a family lawyer urgently? Tell me your city!"]
    },
    {
        keywords: ['child custody', 'custody of child', 'visitation rights', 'guardian', 'guardianship', 'juvenile', 'minor child'],
        responses: ["Child custody in India:\n\n📌 Types:\n• Physical custody — child lives with parent\n• Legal custody — decision-making rights\n• Joint custody — shared between parents\n\nCourts decide based on **child's welfare**.\n\nNeed a family lawyer? Tell me your location!"]
    },
    {
        keywords: ['medical negligence', 'doctor negligence', 'hospital negligence', 'wrong treatment', 'malpractice', 'wrong surgery', 'patient rights', 'negligent doctor'],
        responses: ["Medical negligence is both a civil and criminal matter.\n\n📌 Options:\n• File complaint with State Medical Council\n• Consumer Forum (for compensation)\n• Criminal case under IPC 304A\n\n📌 Compensation possible for: wrong diagnosis, surgical errors, prescription errors\n\nNeed a medical negligence lawyer? Tell me your city!"]
    },
    {
        keywords: ['writ petition', 'habeas corpus', 'mandamus', 'certiorari', 'pil', 'public interest litigation', 'high court', 'supreme court petition', 'constitutional remedy'],
        responses: ["Writ petitions are constitutional remedies:\n\n• **Habeas Corpus** — Illegal detention\n• **Mandamus** — Force duty performance\n• **Certiorari** — Quash lower court order\n• **Prohibition** — Stop lower court\n• **Quo Warranto** — Question authority\n\nPIL can be filed for public interest.\n\nNeed a constitutional lawyer? Tell me your city!"]
    },
    {
        keywords: ['land acquisition', 'government take land', 'compensation land', 'rehabilitation', 'resettlement', 'LARR'],
        responses: ["Land acquisition by government is governed by the Land Acquisition, Rehabilitation & Resettlement Act 2013.\n\n📌 Rights:\n• Fair market value compensation (up to 4x market rate in rural areas)\n• Rehabilitation and resettlement benefits\n• Social impact assessment\n• Right to consent (for private projects)\n\nNeed a property lawyer? Tell me your city!"]
    },
    {
        keywords: ['nri', 'oci', 'foreign national', 'nri property', 'nri legal issue', 'overseas citizen', 'pio', 'person of india origin'],
        responses: ["NRI Legal issues in India:\n\n📌 Common NRI Legal Needs:\n• Property disputes back home\n• Inheritance & succession\n• Power of Attorney\n• Matrimonial disputes\n• Business investment\n\nNRIs can appoint a Power of Attorney to act on their behalf.\n\nNeed a lawyer specializing in NRI matters? Tell me your location!"]
    },
    {
        keywords: ['adoption', 'adopt child', 'adoption process', 'cara', 'adoption india', 'foster care'],
        responses: ["Adoption in India is governed by CARA (Central Adoption Resource Authority).\n\n📌 Process:\n1. Register on CARA portal\n2. Home study by Social Worker\n3. Matching with child\n4. Pre-adoption foster care\n5. Court order\n\nTakes 2–4 years typically.\n\nNeed a family lawyer? Tell me your city!"]
    },
    {
        keywords: ['power of attorney', 'poa', 'general power of attorney', 'special power of attorney', 'notarized poa', 'revoke poa'],
        responses: ["Power of Attorney (POA) authorizes someone to act on your behalf.\n\n📌 Types:\n• **General POA** — Broad powers\n• **Special POA** — Specific purpose only\n• **Durable POA** — Survives incapacity\n\nMust be registered with Sub-Registrar for property transactions.\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['will', 'testament', 'write a will', 'make will', 'probate', 'succession', 'inheritance', 'heir', 'legal heir'],
        responses: ["Making a Will in India:\n\n📌 Key Points:\n• Any adult of sound mind can make a will\n• Must be signed and witnessed by 2 people\n• Registration not mandatory (but recommended)\n• Probate required in some states (Mumbai, Chennai, Kolkata)\n\nNeed a succession lawyer? Tell me your city!"]
    },
    {
        keywords: ['banking fraud', 'bank fraud', 'loan fraud', 'credit card fraud', 'atm fraud', 'upi fraud', 'net banking fraud', 'account hacked'],
        responses: ["Bank/financial fraud:\n\n📌 Immediate Steps:\n1. Report to bank within 3 days (limits liability)\n2. File complaint at cybercrime.gov.in\n3. File FIR at local police station\n4. Notify RBI Ombudsman if bank doesn't respond\n\nRBI guideline: Zero liability if reported within 3 days!\n\nNeed a banking lawyer? Tell me your city!"]
    },
    {
        keywords: ['rent agreement', 'rental agreement', 'leave and license', 'eviction', 'tenant rights', 'landlord', 'notice to vacate', 'evict tenant', 'rent control'],
        responses: ["Tenant-Landlord disputes:\n\n📌 Tenant Rights:\n• Cannot be evicted without legal notice\n• 30–90 days notice (as per agreement)\n• Right to habitable premises\n\n📌 Landlord Rights:\n• Evict for non-payment, misuse, personal requirement\n\nRent agreements should be registered for 11+ months.\n\nNeed a property lawyer? Tell me your city!"]
    },
    {
        keywords: ['accident', 'road accident', 'car accident', 'motor accident', 'compensation accident', 'insurance claim accident', 'mact', 'motor accident tribunal'],
        responses: ["Road accident compensation:\n\n📌 File claim at MACT (Motor Accident Claims Tribunal)\n\n📌 Compensation includes:\n• Medical expenses\n• Loss of income\n• Pain & suffering\n• Death (up to ₹20+ lakhs)\n\nDeadline: 6 months to file MACT claim\n\nNeed a personal injury lawyer? Tell me your city!"]
    },
    {
        keywords: ['insurance claim', 'insurance rejected', 'insurance dispute', 'insurance company', 'health insurance claim', 'life insurance claim', 'denied claim'],
        responses: ["Insurance disputes:\n\n📌 Options:\n• Complain to Insurance Ombudsman (free)\n• Consumer Court\n• Civil Court (for large amounts)\n\n📌 Grounds for complaint:\n• Wrongful claim rejection\n• Underpayment\n• Policy misrepresentation\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['drug case', 'narcotic', 'ndps', 'drugs possession', 'drug trafficking', 'arrest drugs'],
        responses: ["Drug cases under NDPS Act (Narcotic Drugs & Psychotropic Substances Act, 1985).\n\n📌 Key Points:\n• Bail is difficult — courts presume against bail\n• Small quantities: up to 1 year\n• Commercial quantities: 10–20 years\n\n📌 Rights: Right to a lawyer, right to be informed of charges\n\nNeed a criminal lawyer urgently? Tell me your city!"]
    },
    {
        keywords: ['ipc section', 'ipc 420', 'ipc 406', 'ipc 302', 'ipc 307', 'ipc 376', 'indian penal code', 'crpc', 'section'],
        responses: ["Common IPC sections:\n\n• **302** — Murder (life/death penalty)\n• **307** — Attempt to murder\n• **376** — Rape\n• **420** — Cheating & fraud\n• **406** — Criminal breach of trust\n• **498A** — Dowry cruelty\n• **354** — Assault on woman\n\nWhich section applies to your case? Tell me more and your city!"]
    },
    {
        keywords: ['rights during arrest', 'arrested rights', 'police can arrest', 'illegal arrest', 'what happens after arrest', 'arrested by police'],
        responses: ["Your rights when arrested in India:\n\n1. Right to know the reason for arrest\n2. Right to consult a lawyer immediately\n3. Right to inform family members\n4. Right to be produced before magistrate within 24 hours\n5. Right against self-incrimination\n6. Right to medical examination\n\nIf rights are violated → file a writ of habeas corpus in High Court!\n\nNeed a criminal lawyer? Tell me your city!"]
    },
    {
        keywords: ['legal notice', 'send legal notice', 'notice period', 'reply to legal notice', 'received legal notice'],
        responses: ["Legal Notice:\n\n📌 What it is: A formal communication demanding action before court proceedings\n\n📌 When to send:\n• Property disputes\n• Contract breaches\n• Employment issues\n• Cheque bounce\n\n📌 After receiving: Reply within 30–60 days (consult a lawyer)\n\n📌 Not responding can be used against you in court!\n\nNeed a lawyer to send/reply to a notice? Tell me your city!"]
    },
    {
        keywords: ['rti', 'right to information', 'rti application', 'rti request', 'rti appeal', 'government information'],
        responses: ["RTI (Right to Information Act, 2005):\n\n📌 How to file:\n1. Write application to Public Information Officer (PIO)\n2. Pay ₹10 fee\n3. Get response within 30 days\n\n📌 If denied: First appeal to Appellate Authority, then Second Appeal to Information Commission\n\nNeed help? Tell me your city!"]
    },
    {
        keywords: ['anticipatory bail', 'pre-arrest', 'before arrest bail', 'section 438', 'fear of arrest'],
        responses: ["Anticipatory Bail (Sec 438 CrPC) is granted before arrest.\n\n📌 When applied:\n• When you apprehend arrest\n• In non-bailable offences\n\n📌 Conditions may be imposed:\n• Surrender passport\n• Report to police\n• Not tamper with evidence\n\nApply in Sessions Court or High Court.\n\nNeed a criminal lawyer? Tell me your city!"]
    },
    {
        keywords: ['maintenance', 'alimony', 'wife maintenance', 'husband maintenance', 'section 125', 'monthly allowance', 'spousal support'],
        responses: ["Maintenance in India:\n\n📌 Sec 125 CrPC — Wife, children, parents can claim maintenance\n\n📌 Factors:\n• Income of spouse\n• Standard of living\n• Number of dependents\n\n📌 Typical amounts: ₹5,000 – ₹50,000/month\n\nCan also file under DV Act for faster relief.\n\nNeed a family lawyer? Tell me your city!"]
    },
    {
        keywords: ['succession certificate', 'legal heir certificate', 'death certificate', 'inherit property', 'after death property', 'probate'],
        responses: ["After a person's death:\n\n📌 Legal Heir Certificate — from tehsil/municipality, for small matters\n📌 Succession Certificate — from court, for debt/financial claims\n📌 Probate — for validating a Will\n\n📌 Intestate succession:\n• Hindu Law: Class I heirs first (spouse, children)\n• Muslim Law: by Shariah\n\nNeed a succession lawyer? Tell me your location!"]
    },
    {
        keywords: ['shop act', 'shop and establishment', 'trade license', 'business license', 'business permit', 'shop registration'],
        responses: ["Shop & Establishment Act — regulates workplaces.\n\n📌 Required for:\n• All commercial establishments\n• Shops, restaurants, hotels\n\n📌 Covers: Working hours, holidays, employment conditions\n\n📌 Registration with local municipal authority within 30 days of starting business\n\nNeed a corporate lawyer? Tell me your city!"]
    },
    {
        keywords: ['msme', 'udyam', 'udyog aadhaar', 'small business registration', 'sme registration', 'micro enterprise', 'small enterprise'],
        responses: ["MSME/Udyam Registration:\n\n📌 Benefits:\n• Priority lending from banks\n• Government subsidies\n• Delayed payment protection\n• Tax benefits\n\n📌 Register free at udyamregistration.gov.in\n\nMicro: < ₹1 crore investment / < ₹5 crore turnover\n\nNeed help? Tell me your city!"]
    },
    {
        keywords: ['environment', 'pollution', 'ngt', 'green tribunal', 'factory pollution', 'noise pollution', 'water pollution', 'air pollution legal'],
        responses: ["Environmental law in India:\n\n📌 Key Laws:\n• Environment Protection Act 1986\n• Water Act 1974\n• Air Act 1981\n• NGT Act 2010\n\n📌 File complaint at:\n• State Pollution Control Board\n• National Green Tribunal (NGT)\n\nNeed an environmental lawyer? Tell me your city!"]
    },
    {
        keywords: ['defamation', 'reputation', 'slander', 'libel', 'false statement', 'online defamation', 'reputation damage'],
        responses: ["Defamation in India:\n\n📌 Criminal Defamation: IPC Sec 499/500 — up to 2 years jail\n📌 Civil Defamation: Sue for damages in civil court\n\n📌 Online defamation: Also covered under IT Act\n\n📌 Defence: Truth is a valid defence if statement is for public good\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['passport', 'visa', 'passport renewal', 'passport issue', 'ecr passport', 'police verification', 'tatkal passport'],
        responses: ["Passport/Visa legal issues:\n\n📌 Passport blocked/impounded:\n• Petition to Passport Authority\n• File writ in High Court if unjustly denied\n\n📌 Visa overstay: Contact immigration authorities proactively\n\n📌 Documents: Police clearance certificate required for criminal cases\n\nNeed an immigration lawyer? Tell me your city!"]
    },
    {
        keywords: ['contract breach', 'breach of contract', 'agreement violated', 'non-performance', 'contract dispute', 'injunction', 'specific performance'],
        responses: ["Breach of Contract remedies:\n\n📌 Options:\n• Damages (compensation)\n• Specific Performance (force to perform)\n• Injunction (stop the breach)\n• Rescission (cancel the contract)\n\nThe Specific Relief Act governs specific performance.\n\nNeed a civil lawyer? Tell me your city!"]
    },
    {
        keywords: ['mutual legal notice', 'arbitration', 'mediation', 'settlement', 'out of court', 'adr', 'alternative dispute resolution', 'lok adalat'],
        responses: ["Alternative Dispute Resolution (ADR) in India:\n\n• **Arbitration** — Binding decision by arbitrator (fast, private)\n• **Mediation** — Neutral mediator helps parties settle\n• **Lok Adalat** — Free, settlement-based, final award\n• **Conciliation** — Less formal than arbitration\n\nLok Adalat awards are final and not appealable!\n\nNeed legal help? Tell me your city!"]
    },
    {
        keywords: ['workplace harassment', 'sexual harassment', 'posh act', 'internal complaint committee', 'me too', 'office harassment', 'boss harassment'],
        responses: ["Workplace sexual harassment under POSH Act 2013:\n\n📌 Steps:\n1. File complaint with Internal Complaints Committee within 3 months\n2. If no ICC, file with Local Complaints Committee\n3. Inquiry completed in 60 days\n4. Can also file criminal complaint\n\nAll workplaces with 10+ employees must have ICC.\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['forgery', 'fake document', 'document fraud', 'fake signature', 'fabricated evidence', 'cheating', 'impersonation'],
        responses: ["Document forgery is a serious criminal offence:\n\n📌 IPC Sections:\n• Sec 463-471 — Forgery\n• Sec 420 — Cheating\n• Sec 468 — Forgery for the purpose of cheating\n\nPunishment: Up to 7 years jail\n\nIf you have been a victim → File FIR immediately.\n\nNeed a criminal lawyer? Tell me your city!"]
    },
    {
        keywords: ['partition', 'family property partition', 'ancestral property', 'hindu undivided family', 'huf', 'share in property', 'co-owner'],
        responses: ["Property partition:\n\n📌 Methods:\n• By Mutual Agreement (family settlement deed)\n• By Court Partition Suit\n\n📌 Hindu Law: All coparceners have equal rights in HUF property\n📌 Daughters have equal rights after 2005 Hindu Succession Amendment\n\nNeed a property lawyer? Tell me your city!"]
    },
    {
        keywords: ['rape', 'sexual assault', 'molestation', 'pocso', 'child abuse', 'sec 376', 'sexual offence', 'outraging modesty'],
        responses: ["Sexual offences in India:\n\n📌 Laws:\n• IPC Sec 376 — Rape (minimum 7 years, up to life)\n• POCSO Act — Child sexual abuse (strict provisions)\n• IPC Sec 354 — Molestation\n\n📌 Victim Rights:\n• File FIR at any police station\n• Free medical examination\n• Anonymity maintained\n• Free legal aid\n\nNeed urgent legal help? Tell me your city!"]
    },
    {
        keywords: ['rera', 'real estate', 'builder dispute', 'flat possession', 'builder delay', 'flat registry', 'housing society'],
        responses: ["RERA (Real Estate Regulatory Authority) protects homebuyers:\n\n📌 Your Rights:\n• Builder must register project with RERA\n• Possession by promised date or compensation\n• Refund + interest if project cancelled\n• Quality guarantee for 5 years\n\n📌 File complaint at: State RERA portal\n\nNeed a real estate lawyer? Tell me your city!"]
    },
    {
        keywords: ['ngo', 'trust registration', 'society registration', 'non profit', 'charitable trust', 'section 8 company', '80g', '12a'],
        responses: ["NGO/Non-profit setup in India:\n\n📌 Structures:\n• Trust — Under Trust Act\n• Society — Under Societies Registration Act\n• Section 8 Company — Under Companies Act\n\n📌 Tax Benefits:\n• 12A — Income tax exemption\n• 80G — Donors get tax deduction\n\nNeed a corporate lawyer? Tell me your city!"]
    },
    {
        keywords: ['neighbour dispute', 'neighbours', 'boundary wall', 'encroachment by neighbour', 'noise from neighbour', 'tree dispute', 'water drainage neighbour'],
        responses: ["Neighbour disputes:\n\n📌 Common issues:\n• Boundary wall encroachment\n• Noise pollution\n• Water drainage\n• Tree branch overhang\n\n📌 Legal options:\n• Send legal notice first\n• File complaint with local municipality\n• Civil suit for injunction or damages\n\nNeed a civil lawyer? Tell me your city!"]
    },
    {
        keywords: ['how much does a lawyer cost', 'lawyer fee', 'lawyer charges', 'advocate fee', 'consultation fee', 'legal fees', 'attorney cost', 'money', 'money problem', 'cost', 'pricing', 'price', 'budget', 'fees', 'charge'],
        responses: ["Lawyer fees in India (approximate):\n\n• Consultation: ₹500 – ₹5,000\n• Property matters: ₹10,000 – ₹50,000+\n• Criminal cases: ₹15,000 – ₹1,00,000+\n• Family law: ₹10,000 – ₹50,000+\n• Corporate: ₹20,000 – ₹2,00,000+\n\nTell me your case type and city, and I'll show exact fees for each lawyer!"]
    },
    {
        keywords: ['how long will my case take', 'case duration', 'time to resolve', 'court timeline', 'how many years', 'how many months court'],
        responses: ["Case timelines in India:\n\n• Mutual Divorce: 6–18 months\n• Contested Divorce: 2–5 years\n• Property Dispute: 1–10 years\n• Criminal Case: 6 months – 7 years\n• Consumer Complaint: 3–12 months\n• Cheque Bounce: 1–3 years\n\nA good lawyer can speed things up. Tell me your case and location!"]
    },
    {
        keywords: ['what documents needed', 'required documents', 'what papers', 'paperwork legal', 'documents required case'],
        responses: ["Common documents by case type:\n\n📌 Property: Sale deed, title docs, property tax receipts\n📌 Divorce: Marriage certificate, income proof, photos\n📌 Criminal: FIR copy, medical reports, witness info\n📌 Consumer: Bill/invoice, complaint letters, warranty\n📌 Labour: Appointment letter, payslips, resignation/termination letter\n\nTell me your specific case for precise guidance!"]
    },
    {
        keywords: ['free legal aid', 'legal aid', 'legal advice free', 'poor person lawyer', 'no money lawyer', 'government lawyer', 'legal services authority'],
        responses: ["Free legal aid in India:\n\n📌 Eligible persons:\n• Persons earning < ₹1 lakh/year\n• SC/ST individuals\n• Women & children\n• Disabled persons\n• Victims of disaster/trafficking\n\n📌 Apply at: District Legal Services Authority (DLSA) in your district\n\nTell me your city and I'll find free legal aid resources!"]
    },
    {
        keywords: ['police harassment', 'corrupt police', 'illegal detention', 'police brutality', 'false case by police', 'wrongful arrest', 'third degree'],
        responses: ["If police harass or illegally detain you:\n\n📌 Steps:\n1. Document everything (time, officer name, station)\n2. File complaint with SP/DGP office\n3. File complaint with State Human Rights Commission\n4. File Writ of Habeas Corpus in High Court\n5. File complaint with NHRC\n\nNeed a criminal/human rights lawyer? Tell me your city!"]
    },
    {
        keywords: ['loan default', 'bank npa', 'debt recovery', 'loan recovery agent', 'credit card debt', 'emi default', 'debt trap', 'sarfaesi'],
        responses: ["Loan default & debt recovery:\n\n📌 Bank can:\n• Issue demand notice under SARFAESI Act\n• Take possession of mortgaged property\n• File case in Debt Recovery Tribunal (DRT)\n\n📌 Your Rights:\n• 60 days to repay after notice\n• Right to be heard\n• Cannot take possession of non-mortgaged assets\n\nNeed a banking lawyer? Tell me your city!"]
    },
    {
        keywords: ['acid attack', 'victim rights', 'victim compensation', 'crime victim', 'witness protection', 'vawc', 'compensation for victim'],
        responses: ["Crime victim rights in India:\n\n📌 Rights:\n• Right to free legal aid\n• SLSA (State Legal Services Authority) provides compensation\n• Acid attack victims: Minimum ₹3 lakh compensation\n• Right to be informed of case progress\n\nNeed urgent assistance? Tell me your city!"]
    },
    {
        keywords: ['company dispute', 'shareholder dispute', 'director dispute', 'board dispute', 'company law', 'nclt', 'corporate fraud', 'company winding up'],
        responses: ["Company/Corporate disputes:\n\n📌 Forum: National Company Law Tribunal (NCLT)\n\n📌 Cases handled:\n• Shareholder oppression\n• Mismanagement\n• Insolvency (IBC)\n• Company winding up\n• Fraud by directors\n\nNeed a corporate lawyer? Tell me your city!"]
    },
    {
        keywords: ['insolvency', 'bankruptcy', 'ibc', 'nclt insolvency', 'company bankrupt', 'personal insolvency', 'debt relief'],
        responses: ["Insolvency in India under IBC (Insolvency & Bankruptcy Code, 2016):\n\n📌 Corporate Insolvency: File at NCLT — Resolution in 180 days\n📌 Personal Insolvency: File at Debt Recovery Tribunal\n\n📌 Moratorium on all proceedings during process\n\nNeed a corporate/insolvency lawyer? Tell me your city!"]
    },
    {
        keywords: ['mutual fund dispute', 'stock market fraud', 'sebi complaint', 'securities fraud', 'broker fraud', 'demat account issue', 'nse bse dispute'],
        responses: ["Securities/Investment disputes:\n\n📌 File complaint with:\n• SEBI SCORES portal (scores.sebi.gov.in)\n• NSE/BSE arbitration\n• NCDRC for large claims\n\n📌 Common issues: Broker fraud, unauthorized trading, DP account issues\n\nNeed a securities lawyer? Tell me your city!"]
    },
    {
        keywords: ['muslim law', 'divorce muslim', 'talaq', 'triple talaq', 'mehar', 'mehr', 'muslim inheritance', 'waqf'],
        responses: ["Muslim Personal Law in India:\n\n• **Talaq** — Triple talaq now illegal (Muslim Women Protection Act 2019) — up to 3 years jail\n• **Mehr** — Mandatory payment to wife\n• **Divorce** — Talaq, Khula (wife-initiated), Mubara'at (mutual)\n• **Inheritance** — By Shariah: son gets double of daughter\n\nNeed a family lawyer? Tell me your city!"]
    },
    {
        keywords: ['cyberbullying', 'online bullying', 'trolling', 'hate speech online', 'fake profile', 'morphed images', 'revenge porn', 'intimate images'],
        responses: ["Online harassment/Cyberbullying:\n\n📌 Laws:\n• IT Act Sec 66A (struck down) — but Sec 67 for obscene content\n• IPC Sec 354D — Stalking online\n• IPC Sec 499/500 — Online defamation\n\n📌 Report at:\n• cybercrime.gov.in\n• Local cyber cell\n\nNeed help? Tell me your city!"]
    },
    {
        keywords: ['disability rights', 'disabled person rights', 'pwd act', 'persons with disabilities', 'handicap rights', 'accessibility'],
        responses: ["Rights of Persons with Disabilities Act (RPwD) 2016:\n\n📌 Rights:\n• 5% reservation in government jobs\n• Free education up to 18 years\n• Accessible public spaces\n• Right against discrimination\n\n📌 File complaint with: State Commissioner for Persons with Disabilities\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['hate crime', 'caste discrimination', 'sc st', 'dalit rights', 'scheduled caste', 'scheduled tribe', 'atrocities act', 'untouchability'],
        responses: ["SC/ST Atrocities Act protects Scheduled Castes and Tribes:\n\n📌 Offences include:\n• Forcing to eat inedible things\n• Parading naked\n• Occupying/dispossessing land\n• Sexual exploitation\n\n📌 No anticipatory bail in serious offences\n📌 Fast-track courts handle these cases\n\nNeed a civil rights lawyer? Tell me your city!"]
    },
    {
        keywords: ['land mafia', 'land fraud', 'property fraud', 'sale deed fraud', 'benami property', 'benami transaction', 'fake sale', 'property cheated'],
        responses: ["Property fraud:\n\n📌 Common frauds:\n• Fake sale deeds\n• Double selling of property\n• Benami transactions\n• Forged documents\n\n📌 Benami Property Prohibition Act: Government can attach benami properties\n\n📌 Steps: File FIR + Complaint to ED (Enforcement Directorate) for large cases\n\nNeed a property lawyer? Tell me your city!"]
    },
    {
        keywords: ['eviction notice', 'evict me', 'landlord evicting', 'forced out of home', 'house eviction', 'vacate notice received'],
        responses: ["Received an eviction notice?\n\n📌 Your rights:\n• Cannot be evicted without valid legal notice (15–30 days minimum)\n• Landlord must file eviction suit in Rent Control Court\n• Court order needed for forcible eviction\n• Changing locks or cutting utilities = illegal\n\n📌 Grounds for legal eviction: Non-payment, misuse, personal requirement\n\nNeed a property lawyer? Tell me your city!"]
    },
    {
        keywords: ['employment contract', 'offer letter', 'bond', 'service bond', 'non compete', 'employment agreement', 'job bond', 'notice period'],
        responses: ["Employment contracts in India:\n\n📌 Key Points:\n• Service bonds enforceable if reasonable\n• Non-compete clauses post-employment — often unenforceable\n• Notice period: as per contract (typically 30–90 days)\n• Employer can terminate for 'cause' without notice\n\n📌 Excessive bond amounts can be challenged in court\n\nNeed a labour lawyer? Tell me your city!"]
    },
    {
        keywords: ['press freedom', 'media law', 'journalist rights', 'journalist arrested', 'censorship', 'publication ban', 'contempt of court'],
        responses: ["Media/Press law in India:\n\n📌 Rights:\n• No pre-censorship in India\n• Contempt of Court Act limits reporting on sub-judice matters\n• Defamation laws apply to publications\n\n📌 Gag orders: Courts can issue reporting restrictions\n\n📌 Journalist protection: Right against compelled disclosure of sources\n\nNeed a media/press lawyer? Tell me your city!"]
    },
    {
        keywords: ['cbi', 'ed', 'enforcement directorate', 'money laundering', 'pmla', 'fema', 'foreign exchange', 'hawala'],
        responses: ["ED and money laundering cases:\n\n📌 PMLA (Prevention of Money Laundering Act):\n• ED investigates money laundering\n• Property attachment possible\n• Bail difficult — reverse burden of proof\n\n📌 FEMA violations: civil penalties; PMLA: criminal prosecution\n\n📌 ED summons: You must appear; consult a lawyer first!\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['property tax', 'house tax', 'municipal tax', 'property tax issue', 'property tax dispute', 'property tax appeal'],
        responses: ["Property tax disputes:\n\n📌 Steps:\n1. Check assessment calculation\n2. File objection with Municipal Corporation/Panchayat within stipulated time\n3. Appeal to Appellate Authority\n4. High Court if fundamental rights violated\n\n📌 Exemptions: Senior citizens, disabled, some categories\n\nNeed a property lawyer? Tell me your city!"]
    },
    {
        keywords: ['food adulteration', 'food safety', 'fssai', 'food poisoning legal', 'substandard food', 'bad food restaurant'],
        responses: ["Food safety issues:\n\n📌 Laws: Food Safety & Standards Act 2006 (FSSAI)\n\n📌 File complaint with:\n• State Food Safety Commissioner\n• Consumer Forum\n• Local municipal health authority\n\n📌 Punishment for adulteration: Up to 6 years + fine\n\nNeed help? Tell me your city!"]
    },
    {
        keywords: ['accident at workplace', 'factory accident', 'workmen compensation', 'employer liability', 'work injury', 'industrial accident', 'ecrm'],
        responses: ["Workplace accident compensation:\n\n📌 Laws:\n• Workmen's Compensation Act — employer must compensate\n• ESI Act — provides medical + cash benefits\n• Factories Act — employer must ensure safety\n\n📌 Compensation: Based on nature of injury, wage, age\n\nFile claim with Workmen's Compensation Commissioner.\n\nNeed help? Tell me your city!"]
    },
    {
        keywords: ['caste certificate', 'obc certificate', 'sc certificate', 'st certificate', 'fake caste certificate', 'caste certificate dispute'],
        responses: ["Caste certificate issues:\n\n📌 Apply at: Tehsil/Revenue office with documents\n\n📌 Fake certificate: Criminal offence — IPC Sec 419/420\n\n📌 Certificate revocation: Appeal to Scrutiny Committee\n\n📌 Benefits attached: Reservations, scholarships, welfare schemes\n\nNeed help? Tell me your city!"]
    },
    {
        keywords: ['supreme court', 'high court', 'district court', 'session court', 'civil court', 'family court', 'which court', 'which forum'],
        responses: ["Court hierarchy in India:\n\n1. **Supreme Court** — Highest court (Delhi)\n2. **High Court** — Each state has one\n3. **District Court / Sessions Court** — Criminal & civil matters\n4. **Magistrate Court** — Minor criminal cases\n5. **Family Court** — Matrimonial disputes\n6. **Consumer Forum** — Consumer disputes\n7. **Labour Court** — Employment disputes\n\nWhich court you file in depends on the case value and subject matter. Tell me your case!"]
    },
    {
        keywords: ['hindu law', 'hindu marriage', 'hindu succession', 'hinduism law', 'hindu undivided family', 'huf', 'coparcenary'],
        responses: ["Hindu Personal Law:\n\n📌 Key Laws:\n• Hindu Marriage Act 1955\n• Hindu Succession Act 1956 (amended 2005 — daughters = sons in ancestral property)\n• Hindu Adoption & Maintenance Act\n• Hindu Minority & Guardianship Act\n\n📌 Post 2005: Daughters are coparceners by birth in HUF property\n\nNeed a family lawyer? Tell me your city!"]
    },
    {
        keywords: ['christian law', 'christian marriage', 'christian divorce', 'christian personal law', 'idc'],
        responses: ["Christian Personal Law in India:\n\n📌 Marriage: Indian Christian Marriage Act 1872\n📌 Divorce: Indian Divorce Act 1869 (as amended)\n\n📌 Grounds for divorce: Adultery, cruelty, desertion (2 years), conversion, mental disorder\n\n📌 Mutual divorce now available for Christians\n\nNeed a family lawyer? Tell me your city!"]
    },
    {
        keywords: ['lokpal', 'lokayukta', 'corruption complaint', 'government corruption', 'bribery', 'corrupt official', 'vigilance'],
        responses: ["Anti-corruption complaints:\n\n📌 Central Government: Lokpal (for PM, ministers, officers)\n📌 State Government: Lokayukta\n📌 CBI: For serious corruption cases\n📌 Anti-Corruption Bureau (ACB): State level\n\n📌 Prevention of Corruption Act 1988: Up to 7 years jail\n\nTrap operations can be set up with police/ACB.\n\nNeed help? Tell me your city!"]
    },
    {
        keywords: ['appeal', 'challenge court order', 'appeal against order', 'high court appeal', 'district court appeal', 'revision', 'criminal appeal', 'civil appeal'],
        responses: ["Appealing a court order:\n\n📌 Civil cases:\n• District Court → High Court → Supreme Court\n\n📌 Criminal cases:\n• Magistrate → Sessions Court → High Court → Supreme Court\n\n📌 Limitation: Usually 30–90 days to file appeal\n\n📌 Can also file for 'Stay' (suspension) of order during appeal\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['court fee', 'stamp duty', 'court stamp', 'challan court', 'judicial stamp'],
        responses: ["Court fees in India:\n\n📌 Civil suits: % of claim amount (1–8% depending on state)\n📌 Criminal cases: Nominal fixed fee\n📌 Writ petitions: ₹50–₹500\n📌 High Court: Higher fees (varies by state)\n\n📌 Poor persons can apply for fee waiver (forma pauperis)\n\nNeed a lawyer to guide you? Tell me your city!"]
    },
    {
        keywords: ['summons', 'court notice', 'received court notice', 'summons from court', 'contempt notice', 'notice from court'],
        responses: ["Received a court summons?\n\n📌 You MUST respond or appear — ignoring can lead to:\n• Ex-parte order (decision against you without hearing)\n• Bailable/non-bailable warrant\n• Contempt of court\n\n📌 Steps:\n1. Read carefully (case number, court, date)\n2. Consult a lawyer immediately\n3. Respond within stipulated time\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['arbitration clause', 'arbitration agreement', 'icc arbitration', 'domestic arbitration', 'arbitral award', 'arbitration dispute'],
        responses: ["Arbitration in India:\n\n📌 Arbitration & Conciliation Act 1996\n\n📌 Process:\n1. Notice of arbitration\n2. Appointment of arbitrator\n3. Pleadings & hearing\n4. Arbitral award (binding)\n\n📌 Time limit: Award in 12 months (extendable 6 months)\n\n📌 Fast-track: Single arbitrator, award in 6 months\n\nNeed an arbitration lawyer? Tell me your city!"]
    },
    {
        keywords: ['police station', 'fir copy', 'complaint police', 'report to police', 'non cognizable', 'cognizable offence', 'compoundable offence'],
        responses: ["Going to the police station:\n\n📌 Cognizable offence (FIR registered): Murder, rape, theft, kidnapping\n📌 Non-cognizable offence (NCR filed): Cheating, assault without serious injury\n\n📌 Tips:\n• Carry ID proof\n• Note officer's name & badge number\n• Get a copy of FIR/NCR (your legal right)\n• If refused: Approach SP office or court\n\nNeed a criminal lawyer? Tell me your city!"]
    },
    {
        keywords: ['dowry prohibition', 'dowry demand', 'anti dowry', 'dowry gift', 'dowry death', 'section 304b', 'dowry related'],
        responses: ["Dowry laws in India:\n\n📌 Dowry Prohibition Act 1961: Giving/taking dowry is illegal — up to 5 years\n📌 IPC 498A: Dowry cruelty — up to 3 years\n📌 IPC 304B: Dowry death — minimum 7 years, can be life\n\n📌 Any property given 'voluntarily' before/at/after marriage is NOT dowry (considered gift)\n\nNeed urgent help? Tell me your city!"]
    },
    {
        keywords: ['poc', 'power of court', 'order of court', 'court order enforcement', 'contempt of court', 'non compliance court'],
        responses: ["Enforcing a court order:\n\n📌 If the other party doesn't comply:\n• File Execution Petition in the same court\n• File Contempt of Court application\n\n📌 Contempt: Civil (disobedience) & Criminal (scandalize court)\n\n📌 Punishment: Up to 6 months jail or ₹2,000 fine (or both)\n\nNeed a lawyer? Tell me your city!"]
    },
    {
        keywords: ['orop', 'military pension', 'army legal', 'defence personnel rights', 'armed forces tribunal', 'military court martial'],
        responses: ["Armed Forces Legal Issues:\n\n📌 Forum: Armed Forces Tribunal (AFT) — not civil courts\n\n📌 Covers:\n• Service matters\n• Pension disputes\n• Court martial review\n\n📌 Writ petition to High Court still available for fundamental rights violations\n\nNeed a lawyer? Tell me the city where the AFT bench is nearest to you!"]
    },
    {
        keywords: ['online reputation', 'google removal', 'content removal', 'defamatory content online', 'remove post', 'online review removal'],
        responses: ["Online reputation/content removal:\n\n📌 Steps:\n1. Send legal notice to platform and poster\n2. File DMCA/copyright takedown (for your original content)\n3. IT Act Sec 69A: Government can block unlawful content\n4. Court order for removal\n\n📌 Google de-indexing: Possible for personal data (privacy grounds)\n\nNeed a cyber lawyer? Tell me your city!"]
    },
    {
        keywords: ['domestic worker', 'maid rights', 'household worker', 'nanny rights', 'domestic help legal', 'servant legal'],
        responses: ["Domestic worker rights in India:\n\n📌 No single central law — state laws apply\n\n📌 Rights:\n• Minimum wages (state-defined)\n• Right to rest periods\n• Protection from abuse/exploitation\n\n📌 Unregistered Domestic Workers can approach Labour Commissioner\n\n📌 Mistreatment: File FIR under IPC for assault, abuse\n\nNeed a labour lawyer? Tell me your city!"]
    },
];

export const customQA = [
    {
        keywords: ['find lawyer', 'need lawyer', 'good lawyer', 'best lawyer', 'recommend lawyer', 'lawyer near me', 'advocate near me', 'suggest lawyer', 'which lawyer'],
        responses: ["I can find the right lawyer for you! Please tell me:\n\n1. 📋 Your legal issue (e.g., property dispute, divorce, criminal case)\n2. 📍 Your city or state\n\nFor example: \"I need a property lawyer in Delhi\" or \"criminal case help in Mumbai\""]
    },
    {
        keywords: ['lawyer rating', 'verified lawyer', 'top lawyer', 'experienced lawyer', 'best advocate', 'trusted lawyer'],
        responses: ["All lawyers on Lxwyer Up are:\n\n✅ Bar Council verified\n⭐ Rated by real clients\n🔍 Screened for experience\n📋 Profiles with fees & availability\n\nTell me your case type and city to see top-rated lawyers!"]
    },
    {
        keywords: ['book consultation', 'schedule consultation', 'appointment', 'book appointment', 'meet lawyer', 'consult lawyer', 'book a call'],
        responses: ["Booking a consultation on Lxwyer Up:\n\n1. Tell me your case type and city\n2. I'll show matching lawyers\n3. Click 'Book Consultation' on any profile\n4. Choose date, time, and mode (video/phone/in-person)\n5. Pay consultation fee\n\nLet's start! What type of lawyer do you need?"]
    },
    {
        keywords: ['urgent', 'emergency', 'urgent legal', 'immediately', 'right now', 'asap', 'critical', 'serious matter'],
        responses: ["For urgent legal matters:\n\n🚨 **Criminal arrest**: Call lawyer immediately — you have the right\n🚨 **Domestic violence**: Call 181 (Women Helpline) + consult lawyer\n🚨 **Child custody emergency**: Apply for interim custody order\n\nTell me your situation and city — I'll find lawyers available today!"]
    },
    {
        keywords: ['online legal', 'legal advice online', 'virtual consultation', 'video consultation', 'remote lawyer', 'call a lawyer'],
        responses: ["Yes! All lawyers on Lxwyer Up offer online consultations:\n\n📱 Video call (Zoom/Google Meet)\n📞 Phone consultation\n💬 Chat consultation\n\nMany offer same-day appointments!\n\nTell me your legal issue and city to find a lawyer available online today!"]
    },
];

export const fallbackResponses = [
    "I'm not sure I understood that correctly. I'm a **legal AI** — here's what I can help with:\n\n• 🔍 Finding lawyers by case type and city\n• ⚖️ Answering legal questions (FIR, bail, divorce, property...)\n• 📋 Explaining legal rights and procedures\n\nTry: \"I need a property lawyer in Delhi\" or \"How do I file an FIR?\"",
    "I didn't quite catch that. Please describe your **legal issue** and **location**.\n\nExamples:\n• \"Divorce lawyer in Noida\"\n• \"What is anticipatory bail?\"\n• \"Cheque bounce case help\"",
    "I'd love to help, but I'm not sure what you're asking. I work best for legal questions!\n\nTell me:\n1. Your legal issue (divorce, property, criminal, tax, consumer...)\n2. Your city\n\nOr ask a legal question like \"What is Section 138?\" and I'll answer it."
];

export const caseTypeKeywords = {
    // NOTE: Keep keywords ≥5 chars where possible. Short words (≤4 chars) are matched with
    // word-boundary regex in detectCaseType — don't add 2-3 char words here unless necessary.
    'Property Law': ['property', 'land dispute', 'real estate', 'plot', 'flat', 'apartment', 'encroachment', 'tenant', 'landlord', 'rent dispute', 'lease', 'registry', 'mutation', 'title deed', 'possession', 'rera', 'builder delay', 'zameen', 'boundary wall'],
    'Family Law': ['divorce', 'custody', 'family dispute', 'marriage', 'alimony', 'maintenance', 'domestic violence', 'child support', 'adoption', 'dowry', 'matrimonial', 'separation', 'talaq', 'mehar', 'cruelty husband', '498a'],
    'Criminal Law': ['criminal', 'first information report', 'police case', 'arrest', 'theft', 'murder', 'assault', 'robbery', 'kidnapping', 'bail application', 'fraud case', 'cheating case', 'forgery', 'blackmail', 'extortion', 'ndps', 'drug case', 'anticipatory bail'],
    'Corporate Law': ['business dispute', 'company law', 'corporate', 'startup legal', 'partnership', 'llp registration', 'incorporate', 'merger', 'acquisition', 'shareholder', 'director dispute', 'board', 'compliance', 'mou', 'nclt'],
    'Civil Law': ['civil suit', 'compensation', 'civil dispute', 'damages', 'injunction', 'declaration suit', 'recovery suit', 'debt recovery', 'contract breach', 'negligence'],
    'Tax Law': ['income tax', 'taxation', 'gst dispute', 'itr filing', 'tax notice', 'tax evasion', 'tds issue', 'tax assessment', 'tax appeal', 'tax tribunal', 'money laundering', 'pmla'],
    'Labour Law': ['labour dispute', 'employee rights', 'worker', 'employment dispute', 'termination', 'salary dispute', 'wages', 'provident fund', 'gratuity', 'factory law', 'retrenchment', 'layoff', 'fired employee', 'job termination', 'posh act'],
    'Consumer Law': ['consumer complaint', 'consumer forum', 'defective product', 'bad service', 'refund denied', 'warranty issue', 'overcharging', 'misleading ad', 'unfair trade'],
    'Cyber Law': ['cyber crime', 'online fraud', 'hacking', 'internet crime', 'data theft', 'phishing', 'online scam', 'identity theft', 'social media crime', 'cyberbullying', 'cyber cell'],
    'Immigration Law': ['immigration', 'visa issue', 'passport problem', 'citizenship', 'deportation', 'asylum', 'overseas citizenship', 'nri issue', 'foreign national'],
    'Environmental Law': ['environment law', 'pollution complaint', 'ngt', 'factory waste', 'noise pollution', 'water pollution', 'air pollution'],
    'Medical Negligence': ['medical negligence', 'doctor negligence', 'hospital negligence', 'wrong treatment', 'malpractice', 'wrong surgery', 'patient rights'],
    'Intellectual Property': ['patent', 'trademark', 'copyright', 'design registration', 'piracy', 'infringement', 'brand protection', 'ip dispute'],
    'Banking Law': ['banking dispute', 'loan default', 'cheque bounce', 'bank fraud', 'npa issue', 'debt recovery tribunal', 'wilful defaulter', 'moratorium', 'credit card fraud', 'sarfaesi'],
    'Constitutional Law': ['constitutional', 'fundamental rights', 'writ petition', 'pil', 'habeas corpus', 'mandamus', 'supreme court petition'],
};

export const locationKeywords = {
    'delhi': { city: null, state: 'Delhi' },
    'new delhi': { city: 'New Delhi', state: 'Delhi' },
    'south delhi': { city: 'South Delhi', state: 'Delhi' },
    'north delhi': { city: 'North Delhi', state: 'Delhi' },
    'mumbai': { city: 'Mumbai', state: 'Maharashtra' },
    'pune': { city: 'Pune', state: 'Maharashtra' },
    'nagpur': { city: 'Nagpur', state: 'Maharashtra' },
    'maharashtra': { city: null, state: 'Maharashtra' },
    'bangalore': { city: 'Bangalore', state: 'Karnataka' },
    'bengaluru': { city: 'Bangalore', state: 'Karnataka' },
    'karnataka': { city: null, state: 'Karnataka' },
    'chennai': { city: 'Chennai', state: 'Tamil Nadu' },
    'tamil nadu': { city: null, state: 'Tamil Nadu' },
    'kolkata': { city: 'Kolkata', state: 'West Bengal' },
    'west bengal': { city: null, state: 'West Bengal' },
    'hyderabad': { city: 'Hyderabad', state: 'Telangana' },
    'telangana': { city: null, state: 'Telangana' },
    'ahmedabad': { city: 'Ahmedabad', state: 'Gujarat' },
    'gujarat': { city: null, state: 'Gujarat' },
    'lucknow': { city: 'Lucknow', state: 'Uttar Pradesh' },
    'noida': { city: 'Noida', state: 'Uttar Pradesh' },
    'ghaziabad': { city: 'Ghaziabad', state: 'Uttar Pradesh' },
    'varanasi': { city: 'Varanasi', state: 'Uttar Pradesh' },
    'uttar pradesh': { city: null, state: 'Uttar Pradesh' },
    'up': { city: null, state: 'Uttar Pradesh' },
    'gurgaon': { city: 'Gurgaon', state: 'Haryana' },
    'gurugram': { city: 'Gurgaon', state: 'Haryana' },
    'faridabad': { city: 'Faridabad', state: 'Haryana' },
    'haryana': { city: null, state: 'Haryana' },
    'chandigarh': { city: 'Chandigarh', state: 'Punjab' },
    'punjab': { city: null, state: 'Punjab' },
    'jaipur': { city: 'Jaipur', state: 'Rajasthan' },
    'rajasthan': { city: null, state: 'Rajasthan' },
    'indore': { city: 'Indore', state: 'Madhya Pradesh' },
    'bhopal': { city: 'Bhopal', state: 'Madhya Pradesh' },
    'madhya pradesh': { city: null, state: 'Madhya Pradesh' },
    'patna': { city: 'Patna', state: 'Bihar' },
    'bihar': { city: null, state: 'Bihar' },
    'kochi': { city: 'Kochi', state: 'Kerala' },
    'kerala': { city: null, state: 'Kerala' },
    'surat': { city: 'Surat', state: 'Gujarat' },
    'coimbatore': { city: 'Coimbatore', state: 'Tamil Nadu' },
    'visakhapatnam': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    'vizag': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    'andhra pradesh': { city: null, state: 'Andhra Pradesh' },
    'bhubaneswar': { city: 'Bhubaneswar', state: 'Odisha' },
    'odisha': { city: null, state: 'Odisha' },
    'guwahati': { city: 'Guwahati', state: 'Assam' },
    'assam': { city: null, state: 'Assam' },
    'dehradun': { city: 'Dehradun', state: 'Uttarakhand' },
    'uttarakhand': { city: null, state: 'Uttarakhand' },
    'shimla': { city: 'Shimla', state: 'Himachal Pradesh' },
    'himachal': { city: null, state: 'Himachal Pradesh' },
    'ranchi': { city: 'Ranchi', state: 'Jharkhand' },
    'jharkhand': { city: null, state: 'Jharkhand' },
    'raipur': { city: 'Raipur', state: 'Chhattisgarh' },
    'chhattisgarh': { city: null, state: 'Chhattisgarh' },
    'thiruvananthapuram': { city: 'Thiruvananthapuram', state: 'Kerala' },
    'trivandrum': { city: 'Thiruvananthapuram', state: 'Kerala' },
    'amritsar': { city: 'Amritsar', state: 'Punjab' },
    'ludhiana': { city: 'Ludhiana', state: 'Punjab' },
    'agra': { city: 'Agra', state: 'Uttar Pradesh' },
    'kanpur': { city: 'Kanpur', state: 'Uttar Pradesh' },
    'prayagraj': { city: 'Prayagraj', state: 'Uttar Pradesh' },
    'allahabad': { city: 'Prayagraj', state: 'Uttar Pradesh' },
    'meerut': { city: 'Meerut', state: 'Uttar Pradesh' },
};

// ── Name / Person queries ─────────────────────────────────────────────────────
export const nameQueryResponses = {
    notFound: (name) => `I couldn't find a lawyer named **"${name}"** in our verified database.\n\nThis could mean:\n• The lawyer hasn't registered yet on Lxwyer Up\n• The name spelling might be different\n\nWould you like me to find lawyers by specialization instead? Tell me your legal issue and city!`,
    found: (lawyers, name) => `Found lawyer(s) matching **"${name}"** in our database! Here are the results:`,
    suggestion: (name, spec) => `I didn't find "${name}" in our list, but here are verified ${spec || 'lawyers'} you can consult:`
};

// ── Platform-awareness queries (answered from live KB) ────────────────────────
export const platformQueries = [
    {
        keywords: ['how many lawyers', 'total lawyers', 'number of lawyers', 'lawyers do you have', 'lawyers available', 'lawyers on platform', 'lawyers in database'],
        responses: ['Let me check our live database... (loading count)']
    },
    {
        keywords: ['which cities', 'what cities', 'cities covered', 'cities available', 'your locations', 'where are you available', 'areas covered', 'which area'],
        responses: ['Let me check our coverage... (loading cities)']
    },
    {
        keywords: ['what specialization', 'which specialization', 'types of lawyer', 'kind of lawyer', 'what lawyers do you have', 'areas of law', 'practice areas', 'what can you help with'],
        responses: ['Let me check specializations... (loading)']
    },
    {
        keywords: ['fee range', 'cost of lawyer', 'lawyer cost', 'how much do lawyers charge', 'consultation cost', 'lawyer price', 'how much is a lawyer'],
        responses: ['Let me check our fee ranges... (loading)']
    },
];

// ── Advanced Legal Q&A — 60+ new entries ─────────────────────────────────────
export const advancedLegalInfo = [
    // UPI / Digital Payment Fraud
    {
        keywords: ['upi fraud', 'google pay fraud', 'phonepe fraud', 'paytm fraud', 'digital payment fraud', 'online payment scam', 'payment app fraud', 'gpay scam'],
        responses: ["UPI/Digital Payment Fraud:\\n\\n📌 **Immediate Steps:**\\n1. Report to your bank within 3 hours (limits liability to ₹0-10K)\\n2. File complaint at **cybercrime.gov.in**\\n3. Call **1930** (National Cybercrime Helpline)\\n4. File FIR at local cyber cell\\n5. Report to NPCI at **disputes.npci.org.in**\\n\\n📌 **RBI Rule:** Zero liability if reported within 3 days!\\n\\nNeed a cyber lawyer? Tell me your city!"]
    },
    // Crypto / Cryptocurrency
    {
        keywords: ['crypto fraud', 'bitcoin fraud', 'cryptocurrency', 'crypto scam', 'nft fraud', 'digital currency fraud', 'binance', 'crypto investment'],
        responses: ["Cryptocurrency fraud in India:\\n\\n📌 **Legal Status:** Crypto is legal to hold/trade but NOT legal tender\\n📌 **Fraud:** Covered under IPC 420 (cheating) + IT Act\\n\\n📌 **Steps if defrauded:**\\n1. File complaint at cybercrime.gov.in\\n2. File FIR (mention 'online financial fraud')\\n3. ED can investigate if laundering involved\\n4. SEBI for fraudulent investment schemes\\n\\nNeed help? Tell me your city!"]
    },
    // POCSO
    {
        keywords: ['pocso', 'child sexual abuse', 'child abuse case', 'child protection', 'minor abuse', 'child molestation', 'child rape'],
        responses: ["POCSO Act (Protection of Children from Sexual Offences), 2012:\\n\\n📌 **Key Points:**\\n• Covers sexual assault, harassment, pornography involving children (under 18)\\n• Mandatory reporting — anyone who knows MUST report\\n• Designated Special Courts for trial\\n• Identity of child kept secret\\n• Minimum 7 years for penetrative assault\\n\\n📌 **Report to:** Police, Child Welfare Committee, or Childline 1098\\n\\nNeed an urgent criminal lawyer? Tell me your city!"]
    },
    // Aadhaar / Identity
    {
        keywords: ['aadhaar fraud', 'aadhaar misuse', 'identity fraud', 'aadhaar card problem', 'biometric fraud', 'aadhaar number misuse', 'fake aadhaar'],
        responses: ["Aadhaar/Identity fraud:\\n\\n📌 **If your Aadhaar is misused:**\\n1. Lock biometrics at myaadhaar.uidai.gov.in\\n2. Update mobile number linked to Aadhaar\\n3. File complaint at cybercrime.gov.in\\n4. Complain to UIDAI helpline: 1947\\n\\n📌 **Aadhaar Act 2016:** Unauthorised use is punishable up to 3 years + fine\\n\\nNeed a cyber/privacy lawyer? Tell me your city!"]
    },
    // Social Media Law
    {
        keywords: ['social media law', 'facebook complaint', 'instagram harassment', 'twitter defamation', 'youtube copyright', 'whatsapp group', 'telegram fraud', 'social media account hacked'],
        responses: ["Social media legal issues:\\n\\n📌 **IT Act 2000 sections apply:**\\n• Sec 66C — Identity theft (up to 3 years)\\n• Sec 66E — Violation of privacy\\n• Sec 67 — Obscene content\\n• Sec 69 — Government can request takedown\\n\\n📌 **Platforms must comply:** with Indian court orders under IT Rules 2021\\n\\n📌 **Report:** cybercrime.gov.in or local cyber cell\\n\\nNeed a cyber lawyer? Tell me your city!"]
    },
    // NRI Divorce
    {
        keywords: ['nri divorce', 'divorce from abroad', 'foreign divorce', 'married nri', 'husband abroad divorce', 'wife in usa divorce', 'international divorce'],
        responses: ["NRI/International Divorce:\\n\\n📌 **If spouse is abroad:**\\n• File petition in India (where marriage solemnized / where you last cohabited)\\n• Service of notice can be done through embassy\\n• Court can proceed ex-parte if spouse doesn't respond\\n\\n📌 **Foreign divorce (Hague Convention):**\\n• Valid if both parties subject to that jurisdiction\\n• Not always valid in India — get Indian legal advice\\n\\nNeed a family lawyer for NRI matters? Tell me your city!"]
    },
    // NRI Property
    {
        keywords: ['nri property dispute', 'property in india nri', 'nri land problem', 'overseas indian property', 'inherited property nri', 'power of attorney nri india'],
        responses: ["NRI Property in India:\\n\\n📌 **Common Issues:**\\n• Illegal occupation / encroachment by relatives\\n• Fraudulent sale by someone with misused PoA\\n• Property tax not paid\\n• Inheritance disputes after parent's death\\n\\n📌 **Solutions:**\\n• Get a registered Special Power of Attorney (PoA) for trusted person\\n• File civil suit for declaration of ownership\\n• Court can appoint receiver to protect property\\n\\nNeed a property lawyer (NRI expert)? Tell me your city!"]
    },
    // Competition Law
    {
        keywords: ['competition law', 'monopoly', 'cartel', 'anti competitive', 'cci complaint', 'price fixing', 'market dominance abuse', 'predatory pricing'],
        responses: ["Competition Law — CCI (Competition Commission of India):\\n\\n📌 **Prohibited:**\\n• Cartel formation (price fixing, bid rigging)\\n• Abuse of dominant market position\\n• Anti-competitive mergers\\n\\n📌 **File complaint at:** cci.gov.in\\n📌 **Penalty:** Up to 10% of average turnover for 3 years\\n\\nNeed a corporate/competition lawyer? Tell me your city!"]
    },
    // Whistleblower
    {
        keywords: ['whistleblower', 'expose corruption', 'report employer', 'report fraud at work', 'corporate fraud expose', 'whistleblower protection', 'retaliation for reporting'],
        responses: ["Whistleblower Protection in India:\\n\\n📌 **Whistleblowers Protection Act 2014**\\n• Protection for those disclosing corruption of public servants\\n• Report to Central Vigilance Commission (CVC) or competent authority\\n\\n📌 **Corporate sector:** SEBI SCORES for capital market fraud\\n\\n📌 **Key protection:** Employer cannot retaliate — termination after disclosure can be challenged\\n\\nNeed a lawyer to protect you? Tell me your city!"]
    },
    // Senior Citizen Rights
    {
        keywords: ['senior citizen rights', 'elderly abuse', 'parent maintenance', 'abandoned parents', 'old age home', 'parents legal rights', 'maintenance of parents', 'neglect elderly'],
        responses: ["Senior Citizen Rights — Maintenance \u0026 Welfare of Parents \u0026 Senior Citizens Act, 2007:\\n\\n📌 **Rights:**\\n• Children/relatives MUST provide maintenance\\n• If not → apply to Sub-Divisional Magistrate\\n• Tribunal can award up to ₹10,000/month maintenance\\n• Return of property given to children possible if they neglect\\n\\n📌 **Elder abuse:** File FIR under IPC for physical/mental cruelty\\n\\nNeed a family lawyer? Tell me your city!"]
    },
    // Housing Loan Default
    {
        keywords: ['home loan default', 'house loan emi missed', 'bank took my house', 'sarfaesi notice home loan', 'emi not paid housing', 'loan against property default'],
        responses: ["Housing Loan Default:\\n\\n📌 **Timeline if you miss EMIs:**\\n• 3 months → NPA (Non-Performing Asset)\\n• 60-day notice under SARFAESI Act\\n• Bank can take possession and auction property\\n\\n📌 **Your rights:**\\n• Right to respond to the SARFAESI notice\\n• Approach Debt Recovery Tribunal (DRT) to stay auction\\n• Negotiate one-time settlement before auction\\n• RBI's 'Resolution Framework' — banks must offer restructuring\\n\\nNeed a banking lawyer urgently? Tell me your city!"]
    },
    // Waqf Board
    {
        keywords: ['waqf board', 'waqf property', 'waqf dispute', 'waqf act', 'mosque land dispute', 'waqf tribunal'],
        responses: ["Waqf Board disputes:\\n\\n📌 **Waqf Act 1995** governs waqf property in India\\n📌 **Waqf Tribunal** has exclusive jurisdiction over waqf property disputes\\n• Application to State Waqf Tribunal (not civil courts)\\n• Decisions appealable to High Court\\n\\n📌 **Common issues:** Unauthorized encroachment, mutation, sale of waqf property\\n\\nNeed a property/civil lawyer? Tell me your city!"]
    },
    // E-commerce returns
    {
        keywords: ['amazon refund', 'flipkart refund', 'meesho refund', 'myntra return', 'ecommerce return', 'online return rejected', 'delivery not received', 'fake product online', 'product not delivered refund'],
        responses: ["E-commerce/Online Shopping Disputes:\\n\\n📌 **File complaint:**\\n1. First: Seller's platform grievance officer (mandatory first step)\\n2. National Consumer Helpline: 1800-11-4000 or consumerhelpline.gov.in\\n3. Consumer Forum if above fails\\n4. Cyber cell if it's outright fraud\\n\\n📌 **Consumer Protection E-Commerce Rules 2020:** Platforms MUST have grievance redressal and return policy\\n\\nNeed a consumer lawyer? Tell me your city!"]
    },
    // LGBTQ+ Rights
    {
        keywords: ['lgbtq', 'gay rights', 'transgender rights', 'same sex', 'queer law', 'homosexual india', 'section 377', 'transgender protection', 'gender identity'],
        responses: ["LGBTQ+ Legal Rights in India:\\n\\n📌 **Key Milestones:**\\n• **Section 377 decriminalised** (Navtej Johar case, 2018) — consensual adult same-sex relations legal\\n• **Transgender Persons (Protection of Rights) Act 2019** — identity recognition, anti-discrimination\\n• Self-perceived gender identity can be changed on official docs\\n\\n📌 **Rights:** Employment protection, no harassment, change of name/gender on Aadhaar/passport\\n\\nNeed a rights/civil lawyer? Tell me your city!"]
    },
    // Farmer / Agricultural Law
    {
        keywords: ['farmer rights', 'agricultural land', 'farming law', 'msp', 'crop insurance', 'pm fasal bima', 'kisan credit', 'agricultural dispute', 'mandi dispute'],
        responses: ["Farmer/Agricultural Legal Rights:\\n\\n📌 **Key Laws:**\\n• Land Acquisition: 4x market value for rural agricultural land\\n• Crop insurance: PM Fasal Bima Yojana — claim at local bank/agri office\\n• Agricultural loan waiver: State-specific schemes\\n• Mandi disputes: APMC (State Agriculture Produce Marketing Committee)\\n\\n📌 **Distress:** Agricultural courts/civil courts handle farm disputes\\n\\nNeed a property/civil lawyer? Tell me your city!"]
    },
    // Minority Rights
    {
        keywords: ['minority rights', 'religious minority', 'christian rights', 'parsi rights', 'jain rights', 'sikh rights', 'minority institution', 'minority school'],
        responses: ["Minority Rights in India:\\n\\n📌 **Constitutional Protection:**\\n• Article 25–28: Freedom of religion\\n• Article 29–30: Cultural and educational rights\\n• Minorities can establish and administer their own institutions\\n\\n📌 **National Commission for Minorities:** Complaints of discrimination\\n\\n📌 **Communal violence:** IPC + Protection of Civil Rights Act 1955\\n\\nNeed a constitutional/civil rights lawyer? Tell me your city!"]
    },
    // Trademark Objection
    {
        keywords: ['trademark objection', 'trademark rejected', 'trademark opposition', 'trademark registration process', 'brand name register', 'trademark examination report'],
        responses: ["Trademark Registration in India:\\n\\n📌 **Process:**\\n1. File application at ipindia.gov.in\\n2. Examination Report issued (respond within 30 days if objected)\\n3. Published in Trademark Journal for 4 months (opposition period)\\n4. If no opposition → Registration certificate\\n\\n📌 **Common objections:** Similarity to existing mark, descriptiveness\\n\\n📌 **Total time:** 18–36 months typically\\n\\nNeed an IP lawyer? Tell me your city!"]
    },
    // GST Notices
    {
        keywords: ['gst notice', 'gst demand notice', 'gst scrutiny', 'gst show cause', 'gst appeal', 'gst hearing', 'gst officer harassment', 'gst assessment order'],
        responses: ["GST Notice received?\\n\\n📌 **Types of GST notices:**\\n• ASMT-10: Scrutiny of returns\\n• DRC-01: Demand notice\\n• CMP-05: Composition scheme violation\\n\\n📌 **Critical rule:** Reply within the time given (usually 15–30 days)—missing deadline = loss of right to contest\\n\\n📌 **Reply process:** File response on GST portal, attach evidence\\n\\n📌 **Appeals:** First appeal to GST Officer; GSTAT (tribunal) for higher amounts\\n\\nNeed a GST lawyer? Tell me your city!"]
    },
    // Property Will Dispute
    {
        keywords: ['will dispute', 'contested will', 'will challenged', 'challenge will in court', 'will forgery', 'disinherited', 'excluded from will', 'will validity'],
        responses: ["Will disputes in India:\\n\\n📌 **Grounds to challenge a will:**\\n• Testator lacked mental capacity\\n• Coercion/undue influence\\n• Forgery or fraud\\n• Improper witnessing\\n\\n📌 **Process:** File a caveat/probate contest in District Court\\n📌 **Time limit:** 12 years from knowledge of will (Limitation Act)\\n\\n📌 **Note:** A registered will is harder to challenge but not impossible\\n\\nNeed a succession lawyer? Tell me your city!"]
    },
    // Job Bond Disputes
    {
        keywords: ['job bond break', 'training bond', 'company bond', 'bond period', 'leaving before bond', 'service agreement breach', 'company asking money for leaving'],
        responses: ["Service Bond / Job Bond disputes:\\n\\n📌 **Indian Law:**\\n• Bonds are enforceable ONLY if reasonable in time and amount\\n• Bond of 1–3 years with actual cost recovery = generally valid\\n• Bond just to prevent leaving = often unenforceable\\n\\n📌 **Employer can sue for:**\\n• Actual training costs incurred\\n• NOT punitive amounts\\n\\n📌 **Employee strategy:** Challenge as 'restraint of trade' under Sec 27 Contract Act\\n\\nNeed a labour lawyer? Tell me your city!"]
    },
    // Cheating in Marriage
    {
        keywords: ['cheating spouse', 'adultery', 'extramarital affair', 'spouse cheating', 'wife affair', 'husband affair', 'marry again', 'bigamy'],
        responses: ["Adultery/Bigamy in India:\\n\\n📌 **Adultery (2023 position):**\\n• IPC 497 (adultery) was struck down as unconstitutional in 2018\\n• Adultery is no longer a criminal offence\\n• BUT can be used as ground for divorce (Hindu Marriage Act, Sec 13)\\n\\n📌 **Bigamy:** IPC Sec 494 — Marrying again while first spouse is alive = up to 7 years jail\\n\\n📌 **Divorce ground:** File for divorce citing adultery — court may need proof\\n\\nNeed a family lawyer? Tell me your city!"]
    },
    // Fake Degree / Certificate
    {
        keywords: ['fake degree', 'fake certificate', 'forged marksheet', 'educational fraud', 'bogus qualification', 'fake university', 'ugc fake university'],
        responses: ["Fake Degree / Educational Fraud:\\n\\n📌 **Offences:** IPC Sec 420 (fraud) + Sec 468 (forgery for cheating)\\n📌 **Punishment:** Up to 7 years imprisonment\\n\\n📌 **Reporting:**\\n• Police FIR for criminal action\\n• UGC for fake universities (ugc.ac.in/fake_university)\\n• Employer can sue for misrepresentation\\n\\n📌 **Employee:** Termination + possible prosecution if fake credentials used\\n\\nNeed a lawyer? Tell me your city!"]
    },
    // Partition of ancestral property—daughters' rights
    {
        keywords: ["daughter property rights", "girl property right", "daughter share property", "hindu succession daughter", "equal share property", "unmarried daughter property", "daughters ancestral"],
        responses: ["Daughters' Property Rights (post-2005 amendment):\\n\\n📌 **Hindu Succession (Amendment) Act 2005:**\\n• Daughters are equal coparceners in HUF property from birth\\n• DOES NOT matter if father died before/after 2005 (SC ruling 2020)\\n• Married daughters have same rights as sons\\n\\n📌 **Action:** File partition suit in civil court\\n\\nNeed a property lawyer? Tell me your city!"]
    },
    // Lok Adalat
    {
        keywords: ['lok adalat', 'lok adalat settlement', 'pre-litigation lok adalat', 'motor accident lok adalat', 'bank loan lok adalat', 'permanent lok adalat'],
        responses: ["Lok Adalat — India's Fast \u0026 Free Settlement Forum:\\n\\n📌 **Key Features:**\\n• FREE — no court fees\\n• Award is final and binding (no appeal)\\n• If settled, court fee is REFUNDED\\n• Average resolution: Same day!\\n\\n📌 **Best for:**\\n• Cheque bounce cases\\n• Motor accident claims\\n• Bank loan disputes\\n• Matrimonial matters (excluding divorce)\\n\\n📌 **Find:** District Legal Services Authority (DLSA) in your city\\n\\nNeed help? Tell me your city!"]
    },
    // Prison / Jail conditions
    {
        keywords: ['jail conditions', 'prison rights', 'rights in jail', 'prison abuse', 'solitary confinement', 'bail rejected', 'undertrail prisoner', 'detained rights'],
        responses: ["Prisoner \u0026 Undertrial Rights in India:\\n\\n📌 **Key Rights:**\\n• Speedy trial (Article 21)\\n• Free legal aid (if cannot afford)\\n• Medical treatment in jail\\n• Against torture / third-degree\\n• Bail if detained beyond half of max sentence (Sec 436A CrPC)\\n\\n📌 **Sec 436A CrPC:** Undertrials get bail if detained for half of maximum sentence period! Very important.\\n\\nNeed a criminal lawyer? Tell me your city!"]
    },
];

// ── Hindi Phrase Training ─────────────────────────────────────────────────────
export const hindiPhrases = [
    {
        keywords: ['mujhe criminal lawyer chahiye', 'criminal vakeel chahiye', 'criminal case help chahiye'],
        responses: ["ज़रूर! हम Delhi, Haryana और Uttar Pradesh में verified criminal lawyers से connect करते हैं।\\n\\nआप किस city में हैं? (Delhi, Noida, Gurgaon, Lucknow...)"]
    },
    {
        keywords: ['property ka mamla hai', 'zameen ka jhagda', 'property dispute hai', 'ghar ka mamla', 'makaan ka vivad'],
        responses: ["Property disputes के लिए हमारे पास experienced lawyers हैं।\\n\\nआप किस city में हैं और property matter क्या है?\\n• Owner dispute?\\n• Tenant-landlord?\\n• Registry issue?\\n• Family partition?"]
    },
    {
        keywords: ['bail kaise milegi', 'bail chahiye', 'bail ka kya process', 'bail application'],
        responses: ["Bail के लिए तुरंत criminal lawyer contact करें।\\n\\n📌 Types of Bail:\\n• Regular Bail — Sec 437/439 CrPC\\n• Anticipatory Bail — Sec 438 (arrest से पहले)\\n\\nआप किस city में हैं? Main abhi ek verified criminal lawyer dhundhta hoon!"]
    },
    {
        keywords: ['talaq chahiye', 'divorce chahiye', 'divorce karna hai', 'pati se alag hona'],
        responses: ["Divorce/Talaq matters के लिए हमारे पास Family Law experts हैं।\\n\\n📌 Options:\\n• Mutual Consent Divorce: 6-18 mahine\\n• Contested Divorce: 2-5 saal\\n\\nAap kaunsi city mein hain? Aapko wahan ek experienced family lawyer se milwata hoon."]
    },
    {
        keywords: ['paisa waapis chahiye', 'fraud hua hai', 'thaga gaya', 'online fraud hua', 'paise gaye'],
        responses: ["Fraud mein immediate action zaruri hai!\\n\\n📌 Steps:\\n1. Bank ko 24 ghante mein batao\\n2. cybercrime.gov.in pe complaint\\n3. National Helpline 1930 call karo\\n4. Police FIR file karo\\n\\nHum aapko Delhi, Haryana ya UP mein cyber/criminal lawyer se connect kar sakte hain. Aap kahan hain?"]
    },
    {
        keywords: ['naukri se nikala', 'job se hataaya', 'terminate kiya', 'salary nahi mili', 'kaam se bahar'],
        responses: ["Wrongful termination ya salary dispute ke liye Labour Law protection hai.\\n\\n📌 Aap kar sakte hain:\\n• Labour Commissioner ko complaint\\n• Labour Court mein case file\\n• Gratuity, PF, notice pay claim\\n\\nAap kaunsi city mein hain? Wahan Labour lawyer dhundho!"]
    },
];

// ── Procedural Q&A ─────────────────────────────────────────────────────────────
export const proceduralQA = [
    {
        keywords: ['how to start a case', 'how to file a case', 'how do i file a case', 'start legal proceedings', 'how to approach court', 'begin court case'],
        responses: ["How to start a court case in India:\\n\\n**Step 1:** Consult a lawyer — they will advise on the right forum\\n**Step 2:** Draft the plaint (civil) or complaint/FIR (criminal)\\n**Step 3:** Pay court fees (civil) or file with police (criminal)\\n**Step 4:** Court issues notice to the other party\\n**Step 5:** Hearings begin\\n\\n📌 **Limitation:** File within the time limit (usually 1–3 years for civil cases)\\n\\nNeed a lawyer to guide you? Tell me your case type and city!"]
    },
    {
        keywords: ['what documents for court', 'documents needed for case', 'papers required court', 'what evidence needed'],
        responses: ["Documents needed depend on case type:\\n\\n📌 **Property:** Sale deed, title documents, property tax receipts, mutation records\\n📌 **Divorce:** Marriage certificate, ID proofs, income proofs, photographs\\n📌 **Criminal:** FIR copy, medical reports, witness details, CCTV footage\\n📌 **Consumer:** Bills/invoices, warranty card, correspondence with company\\n📌 **Labour:** Appointment letter, payslips, resignation/termination letter, PF records\\n📌 **Cheque bounce:** Original cheque, bank memo, legal notice copy\\n\\nTell me your specific issue for more precise guidance!"]
    },
    {
        keywords: ['how long will property case take', 'property case duration', 'how many years property dispute'],
        responses: ["Timeline for property cases in India:\\n\\n• Simple title declaration suit: 2–4 years\\n• Partition suit: 3–7 years\\n• Eviction case (Rent Control): 1–3 years\\n• Land acquisition compensation: 2–5 years\\n• RERA complaint: 30–60 days\\n\\n📌 High courts take longer; Fast-track courts faster.\\n\\nA good property lawyer can negotiate faster resolution through mediation/Lok Adalat. Tell me your city!"]
    },
    {
        keywords: ['how long will criminal case take', 'criminal case duration', 'bail case timeline'],
        responses: ["Criminal case timelines in India:\\n\\n• Cognizable offence FIR to chargesheet: 60–90 days\\n• Trial (sessions court): 2–5 years\\n• Trial (magistrate court): 6 months – 3 years\\n• Bail application: 1–7 days\\n• Anticipatory bail: 1–3 days\\n• Appeal to High Court: 1–3 years\\n\\n📌 Fast-track courts for rape/POCSO cases are faster.\\n\\nTell me your city and I'll find a criminal lawyer!"]
    },
    {
        keywords: ['how to get compensation', 'claim compensation', 'sue for damages', 'how to claim money', 'get money from court'],
        responses: ["Getting compensation through courts:\\n\\n📌 **Civil suit for damages:**\\n• File in District Court (up to ₹3 crore) or High Court\\n• Prove: loss/injury + causation + negligence\\n• Can claim: actual losses + legal costs\\n\\n📌 **Consumer forum:** Faster for consumer disputes\\n📌 **Motor Accident:** MACT tribunal\\n📌 **Workmen compensation:** Commissioner's court\\n\\n📌 **Timeline:** Civil courts: 2–5 years; Consumer forum: 6–18 months\\n\\nNeed a civil lawyer? Tell me your city!"]
    },
    {
        keywords: ['how to find a good lawyer', 'how to choose a lawyer', 'which lawyer is best', 'how to select advocate', 'tips to find lawyer'],
        responses: ["How to find the right lawyer:\\n\\n✅ **On Lxwyer Up:**\\n• Tell me your case type + city — AI matches you instantly\\n• All lawyers are Bar Council verified\\n• See ratings, experience, fees upfront\\n• Book consultation online\\n\\n📌 **Tips:**\\n• Choose a specialist (criminal vs. civil vs. corporate)\\n• Check experience in your specific issue\\n• Ask about timeline and fees upfront\\n• First consultation: assess communication style\\n\\nTell me your issue and city — I'll find the best match now!"]
    },
];

// ── Advanced case type keywords (supplement existing caseTypeKeywords) ────────
export const advancedCaseTypeKeywords = {
    'Cyber Law': ['upi fraud', 'google pay scam', 'online transaction fraud', 'phonepe', 'paytm fraud', 'social media crime', 'aadhaar misuse', 'deepfake', 'revenge porn', 'morphed image', 'account hijack', 'email hack', 'ransomware', 'crypto fraud', 'nft scam', 'instagram hack', 'facebook fraud'],
    'Criminal Law': ['pocso', 'child abuse', 'acid attack', 'gang rape', 'mob lynching', 'cow vigilante', 'ndps', 'drug trafficking', 'arms act', 'illegal weapon', 'encounter', 'narco test', 'lie detector', 'witness protection', 'victim compensation', 'hit and run criminal'],
    'Family Law': ['nri divorce', 'foreign divorce', 'international divorce', 'bigamy', 'adultery ground', 'legal separation', 'live in relationship', 'second marriage', 'restitution conjugal rights', 'wife maintenance', 'senior citizen maintenance', 'parent maintenance'],
    'Property Law': ['waqf property', 'temple property', 'church land', 'government land encroachment', 'forest land', 'tribal land', 'benami', 'rera complaint', 'flat builder delay', 'property fraud nri', 'ancestral property daughter', 'will probate dispute'],
    'Corporate Law': ['startup funding dispute', 'investor exit', 'employee esop dispute', 'founder dispute', 'vesting', 'term sheet', 'sha dispute', 'board removal', 'company oppression', 'minority oppression nclt', 'ibc resolution', 'corporate restructuring'],
    'Consumer Law': ['amazon refund', 'flipkart dispute', 'meesho refund', 'myntra return', 'e-commerce fraud', 'fake product online', 'subscription fraud', 'insurance rejection', 'hospital overcharge', 'hotel fraud', 'education fee refund'],
    'Tax Law': ['crypto tax', 'bitcoin tax', 'gst evasion', 'shell company', 'hawala', 'benami transaction', 'offshore account', 'fema violation', 'ed raid', 'income tax raid', 'faceless assessment', 'tax tribunal itat'],
    'Labour Law': ['startup layoff', 'tech layoff', 'mass retrenchment', 'severance package', 'non-disclosure', 'non-compete', 'service bond', 'training bond', 'esop vesting dispute', 'contractor labour', 'gig worker rights', 'freelancer dispute'],
    'Immigration Law': ['student visa', 'f1 visa', 'work visa', 'h1b', 'pr canada', 'pr australia', 'oci renunciation', 'nri citizenship', 'overseas voter', 'deportation india'],
};

