export function buildExternalAiPrompt(data: any) {
  const total = data.counts.regular + data.counts.literacy + data.counts.numeracy;
  const akmConfiguration = {
    mode: data.options.akmMode || 'Kombinasi',
    literasi_aktif: data.options.enableLiteracy,
    numerasi_aktif: data.options.enableNumeracy,
    literasi: {
      konten: data.options.literacyContent || 'Teks Informasi dan Sastra',
      proses_kognitif: data.options.literacyProcess || 'Menemukan, Memahami, Mengevaluasi',
      konteks: data.options.literacyContext || 'Personal, Sosial Budaya, Saintifik',
      bentuk_stimulus: data.options.literacyStimulus || 'Teks, Gambar, Infografis'
    },
    numerasi: {
      domain: data.options.numeracyDomain || 'Bilangan, Aljabar, Geometri, Data',
      proses_kognitif: data.options.numeracyProcess || 'Pemahaman, Penerapan, Penalaran',
      konteks: data.options.numeracyContext || 'Personal, Pekerjaan, Saintifik',
      bentuk_stimulus: data.options.numeracyStimulus || 'Tabel, Grafik, Diagram'
    }
  };
  const optionCount = data.identity.phase === 'Fase A' ? 3 : 4;
  const sampleOptions = Array.from({ length: optionCount }, (_, index) => ({
    kode: String.fromCharCode(65 + index),
    teks: 'Pilihan ' + String.fromCharCode(65 + index)
  }));
  const request = {
    identitas: data.identity,
    pembelajaran: data.learning,
    jumlah_soal: data.counts,
    bentuk_soal: data.forms,
    tingkat_kesulitan: data.difficulties,
    konfigurasi_akm: akmConfiguration,
    pengaturan_paket: data.options,
    penyusun: data.author
  };
  const outputShape = {
    schema_version: '2.0.0',
    identitas: {
      nama_satuan_pendidikan: data.identity.school || '',
      jenjang: data.identity.level || '',
      kelas: String(data.identity.grade || ''),
      fase: data.identity.phase || '',
      semester: data.identity.semester || '',
      tahun_pelajaran: data.identity.schoolYear || '',
      mata_pelajaran: data.identity.subject || '',
      topik: data.identity.topic || '',
      submateri: data.identity.subtopic || '',
      alokasi_waktu_menit: Number(data.identity.duration) || 0
    },
    konfigurasi: {
      jumlah_total_target: total,
      jumlah_total: total,
      jumlah_soal_reguler: data.counts.regular,
      jumlah_soal_literasi: data.counts.literacy,
      jumlah_soal_numerasi: data.counts.numeracy,
      bentuk_soal: data.forms,
      tingkat_kesulitan: data.difficulties,
      mode_paket: data.options.packageMode || 'Tunggal',
      komponen_akm: akmConfiguration
    },
    pembelajaran: {
      capaian_pembelajaran: data.learning.cp || '',
      tujuan_pembelajaran: data.learning.objectives,
      indikator: data.learning.indicators || '',
      batasan_materi: data.learning.limits || '',
      catatan: data.learning.notes || ''
    },
    penyusun: {
      nama: data.author.name || '',
      nip_niy: data.author.nip || '',
      jabatan: data.author.role || '',
      satuan_pendidikan: data.author.school || '',
      kabupaten_kota: data.author.city || '',
      tanggal_penyusunan: data.author.date || ''
    },
    stimulus: [{
      stimulus_id: 'ST-001',
      kategori: 'literasi',
      judul: 'Judul stimulus',
      konten: 'Isi stimulus lengkap',
      data_tabel: null,
      sumber: 'Sumber atau kosong'
    }],
    soal: [{
      soal_id: 'Q-001',
      nomor: 1,
      kategori: 'reguler',
      bentuk_soal: 'pilihan_ganda',
      tingkat_kesulitan: 'sedang',
      stimulus_id: '',
      materi: data.identity.topic || '',
      indikator: 'Indikator butir',
      domain_atau_konten: data.identity.subject || '',
      proses_kognitif: 'Pemahaman dan penerapan',
      konteks: 'Pembelajaran',
      pokok_soal: 'Pertanyaan lengkap',
      data_tabel: null,
      pilihan_jawaban: sampleOptions,
      kunci_jawaban: ['A'],
      jawaban_singkat: '',
      pembahasan: 'Pembahasan jawaban',
      skor: 1,
      pedoman_penskoran: {
        skor_maksimal: 1,
        kriteria: [
          { skor: 1, deskripsi: 'Jawaban benar sesuai kunci atau jawaban acuan.' },
          { skor: 0, deskripsi: 'Jawaban salah atau tidak menjawab.' }
        ]
      }
    }]
  };
  return [
    'Anda adalah penyusun asesmen SD/MI dan SMP/MTs yang berpengalaman.',
    'Buat paket soal AN/AKM berdasarkan INPUT di bawah ini.',
    '',
    'ATURAN WAJIB:',
    '1. Gunakan Bahasa Indonesia yang jelas, sesuai jenjang, dan bebas data pribadi murid.',
    '2. Jumlah soal harus tepat ' + total + ' butir.',
    '3. Komposisi kategori, bentuk soal, dan tingkat kesulitan harus persis mengikuti INPUT.',
    '4. Soal literasi dan numerasi harus memakai stimulus yang relevan; stimulus_id harus merujuk ke stimulus yang tersedia.',
    '5. Fase A wajib memiliki tepat 3 opsi untuk pilihan ganda dan pilihan ganda kompleks; Fase B, C, dan D wajib memiliki tepat 4 opsi. Dokumen ini menggunakan ' + (data.identity.phase || 'Fase -') + ', sehingga setiap butir pilihan wajib memiliki tepat ' + optionCount + ' opsi.',
    '6. Pilihan ganda memiliki satu kunci; pilihan ganda kompleks boleh memiliki lebih dari satu kunci.',
    '7. Menjodohkan memakai minimal dua objek pilihan_jawaban. Setiap objek memuat kode, kiri, kanan, dan teks "bagian kiri — bagian kanan"; kunci_jawaban berisi pasangan seperti "1=C".',
    '8. Jika stimulus atau pokok soal memerlukan tabel, gunakan data_tabel: {"judul_kolom": [...], "baris": [[...]]}. Jangan menulis tabel dengan spasi atau tanda pipa Markdown.',
    '9. Isian singkat dan uraian memakai pilihan_jawaban: [], kunci_jawaban: [], serta jawaban_singkat berisi jawaban acuan.',
    '10. Semua soal harus memiliki soal_id unik, nomor berurutan, materi, indikator, domain_atau_konten, proses_kognitif, konteks, pokok_soal, pembahasan, skor, dan pedoman_penskoran.',
    '11. domain_atau_konten, proses_kognitif, dan konteks harus mengikuti konfigurasi_akm pada INPUT; gunakan nilai default INPUT jika butir tidak memberikan nilai khusus.',
    '12. Khusus uraian, pedoman_penskoran wajib memuat skor_maksimal dan minimal dua kriteria skor.',
    '13. Jangan mengeluarkan Markdown, blok kode, komentar, penjelasan, atau kode Python.',
    '14. Keluarkan SATU objek JSON valid yang dapat langsung disimpan sebagai berkas .json.',
    '15. Gunakan nama field dan struktur keluaran persis seperti CONTOH STRUKTUR.',
    '',
    'INPUT:',
    JSON.stringify(request, null, 2),
    '',
    'CONTOH STRUKTUR KELUARAN (ganti contoh dengan seluruh soal yang diminta):',
    JSON.stringify(outputShape, null, 2),
    '',
    'Periksa kembali jumlah butir, distribusi, referensi stimulus, serta kunci jawaban sebelum mengirim JSON.'
  ].join('\n');
}
