import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
};

function createDocxTable(data_tabel: any) {
  if (!data_tabel || !data_tabel.judul_kolom || !data_tabel.baris) {
    return new Paragraph({ text: "" });
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: data_tabel.judul_kolom.map((col: string) => 
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: col, bold: true })] })],
            margins: { top: 100, bottom: 100, left: 100, right: 100 }
          })
        )
      }),
      ...data_tabel.baris.map((row: string[]) => 
        new TableRow({
          children: row.map((cell: string) => 
            new TableCell({
              children: [new Paragraph({ text: cell })],
              margins: { top: 100, bottom: 100, left: 100, right: 100 }
            })
          )
        })
      )
    ]
  });
}

function renderRumusanSoal(s: any, data: any) {
  const p: any[] = [];
  
  if (s.stimulus_id && data?.stimulus) {
    const stimulus = data.stimulus.find((st: any) => st.stimulus_id === s.stimulus_id);
    if (stimulus) {
      if (stimulus.judul) {
        p.push(new Paragraph({ children: [new TextRun({ text: stimulus.judul, bold: true })], spacing: { after: 100 } }));
      }
      if (stimulus.konten) {
        p.push(new Paragraph({ text: stimulus.konten, spacing: { after: 100 } }));
      }
      if (stimulus.gambar) {
        p.push(new Paragraph({ text: `[GAMBAR: ${stimulus.gambar}]`, spacing: { after: 100 }, alignment: AlignmentType.CENTER }));
      }
      if (stimulus.data_tabel) {
        p.push(createDocxTable(stimulus.data_tabel));
        p.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      }
    }
  }

  p.push(new Paragraph({ text: s.pokok_soal || '', spacing: { after: 100 } }));
  if (s.gambar) {
    p.push(new Paragraph({ text: `[GAMBAR: ${s.gambar}]`, spacing: { after: 100 }, alignment: AlignmentType.CENTER }));
  }
  if (s.data_tabel) {
    p.push(createDocxTable(s.data_tabel));
    p.push(new Paragraph({ text: "", spacing: { after: 100 } }));
  }

  if (s.pilihan_jawaban && s.pilihan_jawaban.length > 0) {
    s.pilihan_jawaban.forEach((pj: any, idx: number) => {
      const prefix = pj.kode || pj.kiri || String.fromCharCode(65 + idx);
      const text = pj.teks || pj.kanan || pj.teks || '';
      p.push(new Paragraph({
        text: `${prefix}. ${text}`,
        indent: { left: 360 },
        spacing: { after: 100 }
      }));
    });
  }
  
  if (p.length === 0) {
      p.push(new Paragraph({ text: "" }));
  }

  return p;
}

export async function exportToDocx(data: any) {
  const children: any[] = [];

  if (data?.soal && data.soal.length > 0) {
    data.soal.forEach((s: any) => {
      let bentukSoalText = (s.bentuk_soal || 'PILIHAN GANDA').replace(/_/g, ' ').toUpperCase();

      const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorder,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 2,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `KARTU SOAL ${bentukSoalText}`,
                        bold: true,
                        size: 24,
                      })
                    ],
                    spacing: { after: 200 }
                  })
                ]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph(`Satuan Pendidikan\t: ${data?.identitas?.nama_satuan_pendidikan || '-'}`),
                  new Paragraph(`Mata Pelajaran\t: ${data?.identitas?.mata_pelajaran || '-'}`),
                  new Paragraph(`Kelas/Semester\t: ${data?.identitas?.kelas || '-'} / ${data?.identitas?.semester || '-'}`),
                ]
              }),
              new TableCell({
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph(`Penyusun\t\t: ${data?.penyusun?.nama || '-'}`),
                  new Paragraph(`Tahun Ajaran\t: ${data?.identitas?.tahun_pelajaran || '-'}`),
                ]
              })
            ]
          })
        ]
      });

      const cardTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                columnSpan: 3,
                children: [headerTable],
                margins: { top: 100, bottom: 200, left: 100, right: 100 }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                rowSpan: 2,
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Capaian Pembelajaran:", bold: true })] }),
                  new Paragraph({ text: data?.pembelajaran?.capaian_pembelajaran || '-' }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }
              }),
              new TableCell({
                width: { size: 25, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Kunci:", bold: true })] }),
                  new Paragraph({ text: Array.isArray(s.kunci_jawaban) ? s.kunci_jawaban.join(', ') : s.kunci_jawaban || '-' }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }
              }),
              new TableCell({
                rowSpan: 2,
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Buku Sumber:", bold: true })] }),
                  new Paragraph({ text: s.sumber || '-' }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Nomor Soal:", bold: true })] }),
                  new Paragraph({ text: `${s.nomor || '-'}` }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Materi:", bold: true })] }),
                  new Paragraph({ text: s.materi || data?.identitas?.topik || '-' }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }
              }),
              new TableCell({
                rowSpan: 2,
                columnSpan: 2,
                width: { size: 60, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Rumusan Soal:", bold: true })], spacing: { after: 100 } }),
                  ...renderRumusanSoal(s, data)
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 40, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Tujuan Pembelajaran:", bold: true })] }),
                  new Paragraph({ text: s.indikator || '-' }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }
              })
            ]
          })
        ]
      });

      children.push(cardTable);
      children.push(new Paragraph({ text: "", spacing: { after: 400 } }));
    });
  } else {
    children.push(new Paragraph({ text: "Tidak ada soal." }));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Kartu_Soal_${data?.identitas?.mata_pelajaran || 'AKM'}.docx`);
}
