/** Site-wide constants: navigation, contact details, FAQ and headline figures. */

export const SITE = {
  name: "Mo Odisha",
  nameOdia: "ମୋ ଓଡ଼ିଶା",
  tagline: "The Soul of Eastern India",
  description:
    "An immersive digital museum of Odisha — tourism, history, culture, temples, wildlife, food and festivals, in English and Odia.",
  url: "https://mo-odisha.example",
  locale: "en_IN",
};

export const NAV = [
  { href: "/", key: "nav.home" },
  { href: "/tourism", key: "nav.tourism" },
  { href: "/history", key: "nav.history" },
  { href: "/culture", key: "nav.culture" },
  { href: "/temples", key: "nav.temples" },
  { href: "/wildlife", key: "nav.wildlife" },
  { href: "/food", key: "nav.food" },
  { href: "/festivals", key: "nav.festivals" },
  { href: "/districts", key: "nav.districts" },
  { href: "/gallery", key: "nav.gallery" },
  { href: "/about", key: "nav.about" },
  { href: "/visit-us", key: "nav.visit" },
] as const;

export const CONTACT = {
  organisation: "Mo Odisha — Cultural Showcase",
  address: ["Heritage Wing, Sishu Bhawan Road", "Unit III, Bhubaneswar", "Odisha 751001, India"],
  phone: "+91 674 000 0000",
  altPhone: "+91 674 000 0001",
  email: "hello@mo-odisha.example",
  pressEmail: "press@mo-odisha.example",
  hours: [
    { day: "Monday – Friday", time: "9:30 – 18:00" },
    { day: "Saturday", time: "10:00 – 16:00" },
    { day: "Sunday & public holidays", time: "Closed" },
  ],
  /** Bhubaneswar city centre — used for the embedded map. */
  coords: [20.2961, 85.8245] as [number, number],
};

export const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com" },
  { id: "youtube", label: "YouTube", href: "https://youtube.com" },
  { id: "x", label: "X", href: "https://x.com" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
];

export const STATS = [
  { value: "30", key: "home.stats.districts" as const },
  { value: "480", key: "home.stats.coast" as const },
  { value: "2,000+", key: "home.stats.heritage" as const },
  { value: "62", key: "home.stats.languages" as const },
];

export const FAQ = [
  {
    q: "When is the best time to visit Odisha?",
    qOr: "ଓଡ଼ିଶା ଆସିବାର ଉପଯୁକ୍ତ ସମୟ କେବେ?",
    a: "October to March is comfortable across the whole state. Wildlife parks are open roughly November to June, the turtle arribada falls between January and March, and Rath Yatra is in June or July — hot, but unrepeatable.",
  },
  {
    q: "How many days do I need?",
    qOr: "କେତେ ଦିନ ଦରକାର?",
    a: "Four days covers the Golden Triangle of Bhubaneswar, Puri and Konark comfortably. Seven lets you add Chilika and Similipal or Satkosia. Ten to twelve is right if you want the southern hills and tribal markets as well.",
  },
  {
    q: "Do I need a permit for the national parks?",
    qOr: "ଜାତୀୟ ଉଦ୍ୟାନ ପାଇଁ ଅନୁମତି ଦରକାର କି?",
    a: "Similipal, Satkosia and Bhitarkanika all require entry permits, booked through the Odisha forest department's online portal. Book Similipal well ahead in season — the daily vehicle quota is capped.",
  },
  {
    q: "Can non-Hindus enter the Jagannath Temple?",
    qOr: "ଅହିନ୍ଦୁ ଜଗନ୍ନାଥ ମନ୍ଦିରରେ ପ୍ରବେଶ କରିପାରିବେ କି?",
    a: "Entry to the Puri temple is restricted to Hindus. The rooftop of the Raghunandan Library opposite the eastern gate gives an excellent view of the compound, and everyone is welcome at the Rath Yatra on the Grand Road.",
  },
  {
    q: "Is the website available in Odia?",
    qOr: "ଏହି ୱେବସାଇଟ ଓଡ଼ିଆରେ ଉପଲବ୍ଧ କି?",
    a: "Yes. Use the ଓଡ଼ିଆ / English switch in the header to change the whole interface. Every text field also has its own typing toggle with a virtual Odia keyboard and word suggestions, so you can write in Odia even without an Odia keyboard layout.",
  },
  {
    q: "How should I behave at tribal markets?",
    qOr: "ଆଦିବାସୀ ହାଟରେ କିପରି ବ୍ୟବହାର କରିବି?",
    a: "Go with a local guide, ask before photographing anyone, do not offer money for photographs, and buy something. These are working markets that people walk long distances to reach — the visit should be worth their while too.",
  },
];

export const GALLERY_THEMES = [
  { id: "temples", label: "Temples", labelOr: "ମନ୍ଦିର" },
  { id: "coast", label: "Coast", labelOr: "ଉପକୂଳ" },
  { id: "forest", label: "Forest", labelOr: "ଜଙ୍ଗଲ" },
  { id: "craft", label: "Craft", labelOr: "ଶିଳ୍ପ" },
  { id: "festival", label: "Festival", labelOr: "ପର୍ବ" },
  { id: "people", label: "People", labelOr: "ଲୋକ" },
] as const;
