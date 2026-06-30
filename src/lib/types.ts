export interface Project {
  id: string;
  title: string;
  location: string;
  price: string;
  area_size: string;
  description: string;
  approval_status: string;
  image_url: string;
  featured: boolean;
  category: "government" | "local" | "ready";
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  image_url?: string;
  created_at?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  order: number;
  created_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  created_at?: string;
}

export interface Partner {
  id: string;
  name: string;
  type: string;
  logo_url?: string;
  website?: string;
  order: number;
  created_at?: string;
}

export interface Certificate {
  id: string;
  title: string;
  type: string;
  image_url: string;
  order: number;
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at?: string;
}

export interface SiteSettings {
  id: string;
  logo_url?: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  meta_title: string;
  meta_description: string;
  og_image?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "lead" | "site_visit" | "contact" | "whatsapp" | "project";
  read: boolean;
  created_at?: string;
}

export interface GoogleReview {
  id: string;
  author_name: string;
  author_image?: string;
  rating: number;
  text: string;
  review_date: string;
  created_at?: string;
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_interest?: string;
  status: "new" | "contacted" | "interested" | "site_visit_scheduled" | "site_visited" | "negotiation" | "closed" | "rejected";
  notes?: string;
  follow_up_date?: string;
  admin_remarks?: string;
  created_at?: string;
}

export interface SiteVisitBooking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  project_id?: string;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  created_at?: string;
}

export interface ProjectLayout {
  id: string;
  project_id: string;
  title: string;
  image_url: string;
  width: number;
  height: number;
  created_at?: string;
}

export interface ProjectPlot {
  id: string;
  layout_id: string;
  plot_number: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sqft: number;
  facing: string;
  price: string;
  status: "available" | "sold" | "reserved";
  image_url?: string;
  created_at?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  location: string;
  source: string;
  status: "pending" | "verified";
  created_at?: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  headline: string;
  subtitle: string;
  offer_text: string;
  banner_url: string;
  benefits: string[];
  project_ids: string[];
  start_date: string | null;
  end_date: string | null;
  whatsapp_message: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
