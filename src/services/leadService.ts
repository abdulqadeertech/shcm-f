export type InquiryType =
  | 'CONTACT_US'
  | 'DEMO_REQUEST'
  | 'SALES_INQUIRY'
  | 'SUPPORT_TICKET'
  | 'COMPANY_APPLICATION';

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED';

export interface InquiryItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  teamSize?: string;
  source?: string; // e.g. Social Media, Google, Events, Online Ad, Referral
  moduleInterest?: string;
  message: string;
  type: InquiryType;
  status: InquiryStatus;
  createdAt: string;
  notes?: string;
}

const STORAGE_KEY = 'smarthcm_client_inquiries';

// Pre-seeded initial inquiries so the Super Admin dashboard is never empty
const DEFAULT_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-101',
    fullName: 'Mj (R) Jabir Zaheer',
    companyName: 'Ramada Hotel (Islamabad)',
    email: 'hr.manager@ramada-isb.com',
    phone: '+92-51-8950424',
    teamSize: '100-500',
    source: 'Google (search Engine)',
    moduleInterest: 'Core HR, Biometric Attendance & Multi-Branch Payroll',
    message: 'We require a centralized cloud HCM to manage shift rotations across hospitality staff, geo-attendance, and automatic monthly payroll slips without paper stationery.',
    type: 'CONTACT_US',
    status: 'NEW',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    notes: 'High priority hotel chain lead. Follow up regarding biometric API sync.',
  },
  {
    id: 'inq-102',
    fullName: 'Nausheen A. Aziz',
    companyName: 'Hoora Pharma Group',
    email: 'nausheen.aziz@hoorapharma.pk',
    phone: '+92-333-6936747',
    teamSize: '500+ employees',
    source: 'Social Media (LinkedIn, Facebook, Instagram. etc)',
    moduleInterest: 'Mobile App Self-Service, Field Force Attendance & Leaves',
    message: 'Our pharma field force travels nationwide across Pakistan and Gulf. We want employees to submit leaves and mark GPS-verified attendance on iOS and Android.',
    type: 'DEMO_REQUEST',
    status: 'NEW',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    notes: 'Requested a video demo tailored for field workforce tracking.',
  },
  {
    id: 'inq-103',
    fullName: 'Tehseena Hanif',
    companyName: 'Platinum Steel / Kopak Paints',
    email: 'hr.dept@platinumsteel.com',
    phone: '+92-335-2497822',
    teamSize: '100-500',
    source: 'Events',
    moduleInterest: 'Payroll Engine & Overtime Calculations',
    message: 'Need automated payroll with factory shift overtime formulas, social security deductions, and bank disbursement file exports.',
    type: 'SALES_INQUIRY',
    status: 'CONTACTED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    notes: 'Initial proposal sent. Waiting for CFO review.',
  },
  {
    id: 'inq-104',
    fullName: 'Faisal Al-Otaibi',
    companyName: 'Al-Madar Logistics LLC (Dubai & Riyadh)',
    email: 'faisal.otaibi@almadar.ae',
    phone: '+971-4-5490431',
    teamSize: '500+ employees',
    source: 'Online Advertisement',
    moduleInterest: 'Multi-Country Multi-Currency Enterprise Suite',
    message: 'Operating in UAE and Saudi Arabia. We need WPS compliance in UAE and GOSI / Muqeem alignment in Saudi Arabia.',
    type: 'COMPANY_APPLICATION',
    status: 'NEW',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    notes: 'Enterprise account. Requires multi-currency AED and SAR payroll.',
  },
];

export const leadService = {
  getInquiries(): InquiryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INQUIRIES));
        return DEFAULT_INQUIRIES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_INQUIRIES;
    }
  },

  addInquiry(item: Omit<InquiryItem, 'id' | 'createdAt' | 'status'> & { status?: InquiryStatus }): InquiryItem {
    const inquiries = this.getInquiries();
    const newInquiry: InquiryItem = {
      ...item,
      id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: item.status || 'NEW',
      createdAt: new Date().toISOString(),
    };

    const updated = [newInquiry, ...inquiries];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('smarthcm:inquiry_added', { detail: newInquiry }));
    } catch (e) {
      console.warn('LocalStorage save error in leadService:', e);
    }

    return newInquiry;
  },

  updateInquiryStatus(id: string, status: InquiryStatus, notes?: string): boolean {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex((i) => i.id === id);
    if (index === -1) return false;

    inquiries[index].status = status;
    if (notes !== undefined) {
      inquiries[index].notes = notes;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
      window.dispatchEvent(new CustomEvent('smarthcm:inquiry_updated', { detail: inquiries[index] }));
      return true;
    } catch {
      return false;
    }
  },

  deleteInquiry(id: string): boolean {
    const inquiries = this.getInquiries().filter((i) => i.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
      window.dispatchEvent(new CustomEvent('smarthcm:inquiry_deleted', { detail: { id } }));
      return true;
    } catch {
      return false;
    }
  },

  getNewCount(): number {
    return this.getInquiries().filter((i) => i.status === 'NEW').length;
  },
};
