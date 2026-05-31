const replacements = [
  ["\u2500\u2592", "\u0131"],
  ["\u2500\u2591", "\u0130"],
  ["I\u2560\u00e7", "\u0130"],
  ["g\u2560\u00e5", "\u011f"],
  ["G\u2560\u00e5", "\u011e"],
  ["s\u2560\u011f", "\u015f"],
  ["S\u2560\u011f", "\u015e"],
  ["c\u2560\u011f", "\u00e7"],
  ["C\u2560\u011f", "\u00c7"],
  ["\u2560\u011f", "\u0327"],
  ["\u2560\u00ea", "\u0308"],
  ["\u2560\u00e5", "\u0306"],
  ["\u2560\u00e7", "\u0307"],
  ["\u00c4\u00b1", "\u0131"],
  ["\u00c4\u009f", "\u011f"],
  ["\u00c4\u0178", "\u011f"],
  ["\u00c4\u017e", "\u011e"],
  ["\u00c5\u009f", "\u015f"],
  ["\u00c5\u0178", "\u015f"],
  ["\u00c5\u017e", "\u015e"],
  ["\u00c3\u00bc", "\u00fc"],
  ["\u00c3\u00b6", "\u00f6"],
  ["\u00c3\u00a7", "\u00e7"],
  ["\u00c4\u00b0", "\u0130"],
  ["\u00c3\u2021", "\u00c7"],
  ["\u00c3\u2013", "\u00d6"],
  ["\u00c3\u0153", "\u00dc"],
]

export function repairTurkishText(value) {
  if (typeof value !== "string") return value

  // Scrape klasorleri, eski seed verisi veya localStorage'da kalan mojibake metinleri tek katmanda onarir.
  return replacements.reduce((text, [broken, fixed]) => text.replaceAll(broken, fixed), value).normalize("NFC")
}

