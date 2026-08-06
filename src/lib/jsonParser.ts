export function parseExternalAiJson(text: string) {
  let value = String(text || '').trim();
  if (!value) throw new Error('Tempel hasil JSON dari web AI terlebih dahulu.');
  value = value.replace(/^```(?:json|python|py)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const first = value.indexOf('{');
  const last = value.lastIndexOf('}');
  if (first < 0 || last <= first) throw new Error('Objek JSON tidak ditemukan. Minta web AI mengirim JSON murni tanpa penjelasan.');
  const objectText = value.slice(first, last + 1);
  try {
    return JSON.parse(objectText);
  } catch (jsonError) {
    try {
      return JSON.parse(pythonLiteralToJson(objectText));
    } catch (pythonError) {
      throw new Error('Format belum valid. Gunakan satu objek JSON atau literal dict Python tanpa fungsi/kode tambahan.');
    }
  }
}

function pythonLiteralToJson(text: string) {
  let output = '';
  let quote = '';
  let escaped = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quote) {
      if (escaped) {
        if (quote === "'" && character === "'") output += "'";
        else if (quote === "'" && character === '"') output += '\\"';
        else output += '\\' + character;
        escaped = false;
        continue;
      }
      if (character === '\\') {
        escaped = true;
        continue;
      }
      if (character === quote) {
        output += '"';
        quote = '';
        continue;
      }
      if (quote === "'" && character === '"') output += '\\"';
      else if (character === '\n') output += '\\n';
      else if (character === '\r') output += '\\r';
      else output += character;
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      output += '"';
      continue;
    }
    const rest = text.slice(index);
    const literal = rest.match(/^(True|False|None)\b/);
    if (literal) {
      output += literal[1] === 'True' ? 'true' : literal[1] === 'False' ? 'false' : 'null';
      index += literal[1].length - 1;
      continue;
    }
    output += character;
  }
  if (quote || escaped) throw new Error('Literal Python memiliki string yang belum ditutup.');
  return stripTrailingCommas(output);
}

function stripTrailingCommas(text: string) {
  let output = '';
  let inString = false;
  let escaped = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (inString) {
      output += character;
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') {
      inString = true;
      output += character;
      continue;
    }
    if (character === ',') {
      let cursor = index + 1;
      while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
      if (text[cursor] === '}' || text[cursor] === ']') continue;
    }
    output += character;
  }
  return output;
}
