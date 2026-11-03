export interface GymConfig {
  brandName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    email: string;
    address: string;
    googleMapsUrl: string;
    hours: {
      weekdays: string;
      sunday: string;
    };
  };
  stats: Array<{
    value: string;
    label: string;
    detail: string;
  }>;
  disclaimers: {
    isPlaceholderName: boolean;
    isPlaceholderPrices: boolean;
    isPlaceholderContact: boolean;
    legalNotice: string;
  };
}

export const defaultGymConfig: GymConfig = {
  brandName: "GYM / BRAND",
  tagline: "ATHLETIC STRENGTH SANCTUARY",
  headline: "BUILT BY DISCIPLINE.",
  subheadline: "A raw, high-performance athletic club engineered for focused strength, calibrated barbell training, and relentless conditioning standards.",
  contact: {
    phone: "+919876543210",
    phoneDisplay: "+91 98765 43210 (Placeholder)",
    whatsapp: "https://wa.me/919876543210?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20gym%20membership",
    email: "admissions@brandgym.placeholder",
    address: "Plot 42, West Ridge Boulevard, Near Financial District (Placeholder Address)",
    googleMapsUrl: "https://maps.google.com/?q=Athletic+Gym+Placeholder",
    hours: {
      weekdays: "05:30 AM – 10:30 PM",
      sunday: "07:00 AM – 02:00 PM"
    }
  },
  stats: [
    {
      value: "12,000",
      label: "SQ FT ARENA",
      detail: "Purpose-built strength floor"
    },
    {
      value: "100%",
      label: "CALIBRATED STEEL",
      detail: "Competition plates & Olympic bars"
    },
    {
      value: "05:30",
      label: "DAWN OPENING",
      detail: "Dedicated early-morning lifters"
    },
    {
      value: "CONTRAST",
      label: "RECOVERY BAY",
      detail: "Infrared cedar sauna & cold plunge"
    }
  ],
  disclaimers: {
    isPlaceholderName: true,
    isPlaceholderPrices: true,
    isPlaceholderContact: true,
    legalNotice: "GYM / BRAND is currently a placeholder identity. All pricing and address entries are for demonstration purposes until commercial launch."
  }
};
