export interface Medicine {
  id: string;
  name: string;
  imageUrl?: string;

  price: {
    original?: number;
    final: number;

    currency?: {
      prefix?: string;
      suffix?: string;
    };
  }
}

export interface Category {
  id: string;
  title: string;
  medicines: Medicine[];
}

