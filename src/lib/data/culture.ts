import type { CultureEntry } from "./types";

export const CULTURE_GROUPS = [
  { id: "dance", label: "Dance", labelOr: "ନୃତ୍ୟ" },
  { id: "music", label: "Music", labelOr: "ସଙ୍ଗୀତ" },
  { id: "craft", label: "Handicrafts", labelOr: "ହସ୍ତଶିଳ୍ପ" },
  { id: "cuisine", label: "Cuisine", labelOr: "ଖାଦ୍ୟ" },
  { id: "language", label: "Language", labelOr: "ଭାଷା" },
  { id: "folk", label: "Folk traditions", labelOr: "ଲୋକ ପରମ୍ପରା" },
] as const;

export const CULTURE: CultureEntry[] = [
  {
    id: "odissi",
    name: "Odissi",
    nameOr: "ଓଡ଼ିଶୀ",
    group: "dance",
    blurb: "The temple dance of the maharis, reconstructed into one of India's eight classical forms.",
    description:
      "Odissi's vocabulary is built on two body positions — the tribhangi, a three-fold curve through neck, torso and knee, and the square chauka associated with Jagannath. Sculptural evidence goes back to the Ranigumpha caves and the temple walls of Bhubaneswar, where the poses are literally carved. Performed for centuries by mahari temple dancers and gotipua boy dancers, the form was reconstructed for the stage in the mid-20th century by gurus including Kelucharan Mohapatra, Pankaj Charan Das and Deba Prasad Das.",
    facts: [
      { label: "Signature", value: "Tribhangi and chauka postures" },
      { label: "Repertoire", value: "Mangalacharan, Batu, Pallavi, Abhinaya, Moksha" },
      { label: "Lineage", value: "Mahari and gotipua traditions" },
      { label: "Accompaniment", value: "Mardala, violin, flute, manjira" },
    ],
    motif: "lotus",
  },
  {
    id: "chhau",
    name: "Mayurbhanj Chhau",
    nameOr: "ମୟୂରଭଞ୍ଜ ଛଉ",
    group: "dance",
    blurb: "A martial dance of leaps and combat stances — and the only Chhau performed without a mask.",
    description:
      "Chhau grew out of the exercises of village militias, and it still moves like it: wide stances, spring-loaded jumps, and phrases named for the movements of animals and birds. Of the three regional styles, Mayurbhanj Chhau is distinctive for dropping the mask, putting the whole expressive weight on the body. It peaks at the Chaitra Parva festival in April and is inscribed on UNESCO's Representative List of Intangible Cultural Heritage.",
    facts: [
      { label: "Origin", value: "Martial training, Mayurbhanj" },
      { label: "Distinct", value: "Performed without a mask" },
      { label: "Festival", value: "Chaitra Parva, April" },
      { label: "Recognition", value: "UNESCO Intangible Heritage, 2010" },
    ],
    motif: "flame",
  },
  {
    id: "gotipua",
    name: "Gotipua",
    nameOr: "ଗୋଟିପୁଅ",
    group: "dance",
    blurb: "Boys dancing in the female style, holding acrobatic bandha nrutya poses.",
    description:
      "Gotipua — 'single boy' — emerged around the 16th century as a way of continuing devotional dance outside the temple sanctum. Trained from childhood in akhada gymnasiums, the dancers perform bandha nrutya, a repertoire of acrobatic poses that mirror temple sculpture. Most of the 20th-century Odissi gurus began here, which makes gotipua the living bridge between the mahari tradition and the classical stage.",
    facts: [
      { label: "Emerged", value: "c. 16th century" },
      { label: "Signature", value: "Bandha nrutya acrobatic poses" },
      { label: "Training", value: "Akhada gymnasiums, from childhood" },
      { label: "Legacy", value: "Source lineage for modern Odissi" },
    ],
    motif: "lotus",
  },
  {
    id: "odissi-music",
    name: "Odissi music",
    nameOr: "ଓଡ଼ିଶୀ ସଙ୍ଗୀତ",
    group: "music",
    blurb: "A raga tradition of its own, built around Jayadeva's Gita Govinda.",
    description:
      "Odissi music is a distinct classical stream with its own ragas, talas and a body of chhanda and champu compositions. Its central text is the 12th-century Gita Govinda of Jayadeva, sung daily in the Puri temple, and its principal drum is the mardala — played horizontally with a different tonal logic from the tabla or mridangam. Alongside it sit the folk registers: Jhumar, Dalkhai and the Sambalpuri songs of the west.",
    facts: [
      { label: "Core text", value: "Gita Govinda, Jayadeva, 12th c." },
      { label: "Drum", value: "Mardala" },
      { label: "Forms", value: "Chhanda, Champu, Chautisa, Janana" },
      { label: "Folk cousins", value: "Dalkhai, Rasarkeli, Jhumar" },
    ],
    motif: "wave",
  },
  {
    id: "pattachitra",
    name: "Pattachitra",
    nameOr: "ପଟ୍ଟଚିତ୍ର",
    group: "craft",
    blurb: "Cloth scrolls painted with natural pigment and a squirrel-hair brush.",
    description:
      "The chitrakaras of Raghurajpur prepare the patta themselves — layers of cotton bonded with tamarind seed paste, dried, then burnished with a stone until it takes a line like paper. Pigments are mineral and vegetable: hingula red, haritala yellow, lamp-black, conch white. Subjects centre on Jagannath, the Krishna Leela and the Dasavatara, worked in a dense decorative border with no empty space left on the surface.",
    facts: [
      { label: "Village", value: "Raghurajpur, Puri — a heritage craft village" },
      { label: "Ground", value: "Cotton cloth bonded with tamarind paste" },
      { label: "Pigments", value: "Hingula, haritala, conch white, lamp-black" },
      { label: "Related", value: "Talapatrachitra on palm leaf" },
    ],
    motif: "lotus",
  },
  {
    id: "applique",
    name: "Pipili appliqué",
    nameOr: "ପିପିଲି ଚାନ୍ଦୁଆ",
    group: "craft",
    blurb: "Cut-cloth canopies in red, black, yellow and white — made first for the chariots.",
    description:
      "Appliqué at Pipili began as temple service: the canopies, umbrellas and chariot covers for the Rath Yatra are still made by these families each year. Motifs are bold and flat — elephant, parrot, lotus, sun, moon, the Jagannath face — cut from dyed cotton and stitched onto a contrasting ground. The road through Pipili, on the Bhubaneswar–Puri highway, is lined with the results.",
    facts: [
      { label: "Origin", value: "Ritual canopies for Rath Yatra" },
      { label: "Palette", value: "Red, black, yellow, white" },
      { label: "Motifs", value: "Elephant, parrot, lotus, sun, moon" },
      { label: "Where", value: "Pipili, Puri district" },
    ],
    motif: "flame",
  },
  {
    id: "filigree",
    name: "Tarakasi silver filigree",
    nameOr: "ତାରକସି",
    group: "craft",
    blurb: "Silver drawn to the thickness of a hair, then coiled into lace.",
    description:
      "Cuttack's tarakasi artisans draw silver of very high purity into wire finer than thread, then coil, twist and solder it into openwork panels. The technique arrived along the maritime trade routes and has been practised here for several centuries; the medha or silver backdrop built for Durga Puja pandals in Cuttack is its most spectacular annual expression.",
    facts: [
      { label: "Where", value: "Cuttack — Balu Bazar and around" },
      { label: "Material", value: "Silver wire, often 90%+ purity" },
      { label: "Annual peak", value: "Chandi medha for Durga Puja" },
      { label: "Products", value: "Jewellery, boxes, ritual panels" },
    ],
    motif: "lotus",
  },
  {
    id: "sambalpuri",
    name: "Sambalpuri ikat",
    nameOr: "ସମ୍ବଲପୁରୀ ବନ୍ଧ",
    group: "craft",
    blurb: "The pattern is dyed into the yarn before a single thread is woven.",
    description:
      "In bandha ikat the weaver ties and dyes the warp and weft to a plan, so that the design only appears when the two are woven together — which means the motif must be calculated in advance, thread by thread. Western Odisha's weavers work shankha, chakra and phula motifs this way, and the resulting saree has a characteristic feathered edge where the dye boundaries meet.",
    facts: [
      { label: "Technique", value: "Tie-and-dye resist on yarn (bandha)" },
      { label: "Motifs", value: "Shankha, chakra, phula, fish" },
      { label: "Centres", value: "Bargarh, Sonepur, Sambalpur, Boudh" },
      { label: "Cousins", value: "Bomkai, Habaspuri, Kotpad, Berhampuri" },
    ],
    motif: "loom",
  },
  {
    id: "odia-language",
    name: "The Odia language",
    nameOr: "ଓଡ଼ିଆ ଭାଷା",
    group: "language",
    blurb: "The sixth Indian language recognised as classical — and the reason this state exists.",
    description:
      "Odia is an Eastern Indo-Aryan language with a documented literary history of well over a thousand years and comparatively little Persian or Arabic borrowing, which is part of the case for its classical status, granted in 2014. Its rounded script evolved from Kalinga Brahmi and owes its curves to palm leaf: a straight stroke with an iron stylus would split the leaf along the grain. The 1936 formation of Odisha as India's first linguistically defined province was the direct outcome of a movement to defend it.",
    facts: [
      { label: "Family", value: "Eastern Indo-Aryan" },
      { label: "Status", value: "Classical language of India, 2014" },
      { label: "Script", value: "Curved, evolved for palm leaf" },
      { label: "Speakers", value: "≈ 40 million" },
    ],
    motif: "wheel",
  },
  {
    id: "folk",
    name: "Folk traditions",
    nameOr: "ଲୋକ ପରମ୍ପରା",
    group: "folk",
    blurb: "Danda Nata, Pala, Daskathia, Dalkhai — theatre that plays in the village square.",
    description:
      "Odisha's folk performance is unusually resilient. Pala and Daskathia are narrative forms where a singer holds an audience for hours with story, wit and percussion; Danda Nata is an austere ritual performance in the month of Chaitra; Dalkhai is the harvest dance of the west; Ghumura, with its clay-pot drum, once accompanied armies. Almost all of it is still performed by community groups rather than professionals.",
    facts: [
      { label: "Narrative", value: "Pala, Daskathia" },
      { label: "Ritual", value: "Danda Nata, Chaiti Ghoda" },
      { label: "Western", value: "Dalkhai, Rasarkeli, Ghumura" },
      { label: "Puppetry", value: "Kandhei Nacha, Ravana Chhaya shadow play" },
    ],
    motif: "tribal",
  },
  {
    id: "cuisine-culture",
    name: "The temple kitchen",
    nameOr: "ମନ୍ଦିର ରୋଷେଇଶାଳା",
    group: "cuisine",
    blurb: "Mahaprasad, cooked in earthen pots stacked over wood fire, for centuries unchanged.",
    description:
      "The Rosaghara at Puri may be the largest kitchen in continuous operation anywhere: several hundred hearths, a thousand or more cooks, and a daily output that scales from thousands to lakhs on festival days. Food is cooked in unglazed earthen pots stacked seven high over a single fire — the top pot, by tradition, cooks first. Nothing is tasted before offering, no onion or garlic is used, and the finished mahaprasad is sold in the Ananda Bazar beside the temple.",
    facts: [
      { label: "Where", value: "Rosaghara, Jagannath Temple, Puri" },
      { label: "Method", value: "Earthen pots stacked over wood fire" },
      { label: "Rule", value: "No onion or garlic; nothing pre-tasted" },
      { label: "Market", value: "Ananda Bazar, inside the temple" },
    ],
    motif: "temple",
  },
];
