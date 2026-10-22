export type IntervalType = 'Monat' | 'Quartal' | 'Jahr' | 'Woche';

export type SubscriptionCategory =
  | 'Streaming'
  | 'Software'
  | 'Gesundheit'
  | 'Mobilität'
  | 'Versicherung'
  | 'Sonstiges';

export type BankType =
  | 'Girokonto'
  | 'Tagesgeld'
  | 'Festgeld'
  | 'Kreditkarte'
  | 'Depot'
  | 'Sparkonto'
  | 'Sonstiges';

export type AccountCategory =
  | 'Bank'
  | 'Streaming'
  | 'Shop'
  | 'Versicherung'
  | 'Telekom'
  | 'Sonstiges';

export type BookingDirection = 'Abbuchung' | 'Überweisung' | 'Einnahme';

export interface Subscription {
  id: string;
  name: string;
  amt: number;
  iv: IntervalType;
  next: string;
  cat: SubscriptionCategory;
  createdAt?: string;
}

export interface Rate {
  id: string;
  name: string;
  amt: number;
  left: number;
  next: string;
  createdAt?: string;
}

export interface Todo {
  id: string;
  name: string;
  due?: string;
  done: boolean;
  createdAt?: string;
}

export interface Bank {
  id: string;
  name: string;
  type: BankType;
  amt: number;
  iv: 'Monat' | 'Quartal' | 'Jahr';
  bal?: number;
  note?: string;
  createdAt?: string;
}

export interface Booking {
  id: string;
  name: string;
  amt: number;
  dir: BookingDirection;
  date: string;
  bank?: string;
  link?: string;
  lt?: 's' | 'r';
  li?: string;
  prev?: string;
  prevLeft?: number;
  bd?: number;
  createdAt?: string;
}

export interface AccountItem {
  id: string;
  name: string;
  cat: AccountCategory;
  note?: string;
  createdAt?: string;
}

export interface UserFinanceData {
  subs: Subscription[];
  rates: Rate[];
  todos: Todo[];
  banks: Bank[];
  book: Booking[];
  accts: AccountItem[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AiAnalysisResult {
  text: string;
  source: 'mock' | 'mistral';
  generatedAt: string;
  disclaimer: string;
}

export interface AiStatus {
  useMock: boolean;
  provider: string;
  model: string;
  readyForMistral: boolean;
}

export type TabType =
  | 'home'
  | 'subs'
  | 'rates'
  | 'book'
  | 'todos'
  | 'banks'
  | 'accts'
  | 'ai'
  | 'set'
  | 'legal';
