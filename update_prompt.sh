sed -i -e '/pembelajaran: {/,/},/c\
    pembelajaran: (Array.isArray(data.learning) ? data.learning : [data.learning]).map((l: any) => ({\
      capaian_pembelajaran: l.cp || "",\
      tujuan_pembelajaran: l.objectives || "",\
      indikator: l.indicators || "",\
      batasan_materi: l.limits || "",\
      catatan: l.notes || ""\
    })),' src/lib/promptBuilder.ts
