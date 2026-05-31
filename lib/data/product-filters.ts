// Arama ve genel urun listelerinde poset/icecek/sos gibi tekil yardimci urunleri ayiklar.
const excludedProductTerms = [
  "poset",
  "po\u015fet",
  "su",
  "soda",
  "ayran",
  "kola",
  "cola",
  "fanta",
  "sprite",
  "pepsi",
  "yedigun",
  "yedig\u00fcn",
  "7up",
  "gazoz",
  "gazozu",
  "beypazari",
  "beypazar\u0131",
  "sariyer",
  "sar\u0131yer",
  "ice tea",
  "icetea",
  "salgam",
  "\u015falgam",
  "limonata",
  "meyve suyu",
  "enerji icecegi",
  "enerji i\u00e7ece\u011fi",
  "sos",
  "sosu",
  "ketcap",
  "ket\u00e7ap",
  "mayonez",
  "hardal",
  "barbeku",
  "barbek\u00fc",
  "ranch",
  "sweet chili",
  "honey mustard",
  "aci sos",
  "ac\u0131 sos",
  "ekstra",
  "tursu",
  "tur\u015fu",
  "sut",
  "s\u00fct",
  "cay",
  "\u00e7ay",
  "kahve",
  "coffee",
  "americano",
  "latte",
  "cappuccino",
  "espresso",
  "iced",
  "kulah",
  "k\u00fclah",
  "magnum",
  "dondurma",
  "puding",
  "tatli",
  "tatl\u0131",
  "tatlisi",
  "tatl\u0131s\u0131",
  "baklava",
  "cikolata",
  "\u00e7ikolata",
  "pismaniye",
  "pi\u015fmaniye",
  "pismanye",
  "pi\u015fmanye",
]

const mainFoodTerms = [
  "adana",
  "burger",
  "d\u00fcr\u00fcm",
  "durum",
  "d\u00f6ner",
  "doner",
  "kebap",
  "kofte",
  "k\u00f6fte",
  "lahmacun",
  "makarna",
  "pide",
  "pizza",
  "sandvic",
  "sandvi\u00e7",
  "snitzel",
  "\u015fnitzel",
  "tavuk",
  "tost",
  "bowl",
]

export function normalizeProductText(value: string) {
  return value
    .normalize("NFC")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("\u0131", "i")
}

function hasProductTerm(normalizedText: string, term: string) {
  const normalizedTerm = normalizeProductText(term)
  const tokenizedText = ` ${normalizedText.replace(/[^\p{L}\p{N}]+/gu, " ")} `
  const tokenizedTerm = ` ${normalizedTerm.replace(/[^\p{L}\p{N}]+/gu, " ").trim()} `
  return tokenizedText.includes(tokenizedTerm)
}

export function isNonListableProductName(name: string) {
  const normalized = normalizeProductText(name)
  return excludedProductTerms.some((term) => hasProductTerm(normalized, term))
}

export function isStandaloneNonListableProductName(name: string) {
  const normalized = normalizeProductText(name)
  if (!isNonListableProductName(normalized)) return false

  // Menuler kategorisindeki "tavuk durum + salgam" gibi gercek setleri korur,
  // tek basina limonata, magnum, sos, poset vb. urunleri yine disarida birakir.
  return !mainFoodTerms.some((term) => hasProductTerm(normalized, term))
}
