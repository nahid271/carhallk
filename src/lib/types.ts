export type BodyType =
  | 'sedan'
  | 'suv'
  | 'hatchback'
  | 'pickup'
  | 'microbus'
  | 'coupe'
  | 'wagon'
  | 'convertible';

export type Transmission = 'automatic' | 'manual' | 'cvt';

export type Fuel = 'petrol' | 'diesel' | 'octane' | 'cng' | 'hybrid' | 'electric';

export type City =
  | 'dhaka'
  | 'chittagong'
  | 'sylhet'
  | 'rajshahi'
  | 'khulna'
  | 'barisal';

export interface Dealer {
  id: string;
  slug: string;
  name: string;
  bnName?: string;
  city: City;
  address: string;
  bnAddress?: string;
  phone: string;
  verified: boolean;
  joinedAt: string;
  totalSold: number;
  responseTime: 'fast' | 'day';
  logoUrl?: string;
  coverUrl?: string;
  rating: number;
  reviewCount: number;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  bnTitle?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  negotiable: boolean;
  mileageKm: number;
  transmission: Transmission;
  fuel: Fuel;
  bodyType: BodyType;
  color: string;
  bnColor?: string;
  engineCc: number;
  registrationCity: City;
  description: string;
  bnDescription?: string;
  photos: string[];
  dealerId: string;
  views: number;
  postedAt: string;
  updatedAt: string;
  photoVerified: boolean;
  featured: boolean;
}
