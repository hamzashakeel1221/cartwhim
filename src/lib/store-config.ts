// Central place for store-wide settings. Change these before launch.
export const store = {
  name: "CartWhim",
  tagline: "Everything you want, on a whim.",
  domain: "cartwhim.pk",
  // Replace with your real WhatsApp Business number (international format, no +).
  whatsappNumber: "923000000000",
  supportEmail: "support@cartwhim.pk",
  supportPhone: "0300-0000000",
  shipping: {
    flatFee: 199,
    freeOver: 2999,
    deliveryDays: "3 to 5 working days",
  },
  returnDays: 7,
};

export const pakistanCities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar",
  "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur",
  "Abbottabad", "Mardan", "Sahiwal", "Gujrat", "Rahim Yar Khan", "Sheikhupura",
  "Jhelum", "Larkana", "Dera Ghazi Khan", "Mirpur (AJK)", "Muzaffarabad", "Other",
];

export function shippingFor(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= store.shipping.freeOver ? 0 : store.shipping.flatFee;
}
