export interface destination {
  dest_id: string;
  dest_name: string;
  location?: string;      // nullable
  address?: string;       // nullable
  description?: string;   // nullable
  keywords?: string[];    // nullable, category 테이블 참조
  image?: any;         // nullable
} 

export interface category {
  category_id: string;
  category_name: string;
  keyword_id: string;
  keyword_name: string;
  count: number;
}