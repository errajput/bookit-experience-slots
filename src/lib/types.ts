export interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
  slots?: Slot[];
}

export interface Slot {
  _id: string;
  experience: string;
  date: string; // YYYY-MM-DD
  time: string; // "09:00"
  capacity: number;
  bookedCount: number;
}

export interface BookingPayload {
  experienceId: string;
  slotId: string;
  name: string;
  email: string;
  phone?: string;
  qty?: number;
  promoCode?: string | null;
  totalPrice: number;
}
