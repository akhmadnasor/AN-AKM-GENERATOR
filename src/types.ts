export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

export interface Settings {
  appName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  maxQuestions: number;
  version: string;
}

export interface Subject {
  id: string;
  level: string;
  name: string;
  status: string;
  order: number;
}

export interface QuestionOption {
  kode: string;
  teks: string;
  kiri?: string;
  kanan?: string;
}

export interface Question {
  soal_id: string;
  nomor: number;
  kategori: string;
  bentuk_soal: string;
  tingkat_kesulitan: string;
  stimulus_id: string;
  materi: string;
  indikator: string;
  domain_atau_konten: string;
  proses_kognitif: string;
  konteks: string;
  pokok_soal: string;
  pilihan_jawaban?: QuestionOption[];
  kunci_jawaban?: string[];
  jawaban_singkat?: string;
  pembahasan?: string;
  skor?: number;
}

export interface DocumentData {
  schema_version: string;
  identitas: Record<string, any>;
  konfigurasi: Record<string, any>;
  pembelajaran: Record<string, any>;
  penyusun: Record<string, any>;
  stimulus: any[];
  soal: Question[];
}
