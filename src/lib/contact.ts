export const CONTACT = {
  phonePrimary: "+91 814 874 8140",
  phoneSecondary: "+91 814 814 8140",
  email: "lenapromoterspvtltd@gmail.com",
  whatsapp: "+918148748140",
  address: "No:49/3 Keelamel, 100 Feet Road, Soodamanipuram, Karaikudi - 630001",
  shortAddress: "Karaikudi, Tamil Nadu, India",
  workingHours: "Monday to Sunday - 9 AM - 8 PM",
  facebook: "https://www.facebook.com/lenapromoters",
  instagram:
    "https://www.instagram.com/lena_promoters_pvt_ltd?igsh=MTR4MnJqbGZhcGZuYw==",
  youtube: "https://www.youtube.com/@Lena_Promoters",
  googleMapsEmbed:
    "https://maps.google.com/maps?q=No:49/3+Keelamel,+100+Feet+Road,+Soodamanipuram,+Karaikudi+630001&hl=en&z=16&output=embed",
} as const;

export const SITE_STATS = {
  yearsExperience: 18,
  happyCustomers: 1200,
  projectsCompleted: 30,
  plotsSold: 1000,
  ongoingProjects: 27,
} as const;

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function whatsappHref(phone = CONTACT.whatsapp) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
