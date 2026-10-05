/** US / UK / EU ring sizes with the matching diameter and circumference (mm).
 * One table, shared by the size guide page and the checkout size picker. */
export const RING_SIZES = [
  { us: "4", uk: "H", eu: "46.5", diameter: "14.9", circumference: "46.8" },
  { us: "4.5", uk: "I", eu: "47.8", diameter: "15.3", circumference: "48.0" },
  { us: "5", uk: "J½", eu: "49.0", diameter: "15.7", circumference: "49.3" },
  { us: "5.5", uk: "K½", eu: "50.3", diameter: "16.1", circumference: "50.6" },
  { us: "6", uk: "L½", eu: "51.5", diameter: "16.5", circumference: "51.9" },
  { us: "6.5", uk: "M½", eu: "52.8", diameter: "16.9", circumference: "53.1" },
  { us: "7", uk: "N½", eu: "54.0", diameter: "17.3", circumference: "54.4" },
  { us: "7.5", uk: "O½", eu: "55.3", diameter: "17.7", circumference: "55.7" },
  { us: "8", uk: "P½", eu: "56.7", diameter: "18.1", circumference: "57.0" },
  { us: "8.5", uk: "Q½", eu: "57.8", diameter: "18.5", circumference: "58.3" },
  { us: "9", uk: "R½", eu: "59.1", diameter: "18.9", circumference: "59.5" },
  { us: "9.5", uk: "S½", eu: "60.3", diameter: "19.4", circumference: "60.8" },
  { us: "10", uk: "T½", eu: "61.5", diameter: "19.8", circumference: "62.1" },
] as const;
