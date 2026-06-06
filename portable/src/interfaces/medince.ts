export interface Medicine {
  id: string;
  name: string;
  imageUrl?: string;

  price: {
    currency?: {
      prefix?: string;
      suffix?: string;
    };

    original?: number;
    final: number;
  }
}

