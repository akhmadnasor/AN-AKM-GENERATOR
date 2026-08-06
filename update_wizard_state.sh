sed -i -e "12,13c\\        const parsed = JSON.parse(saved);\\n        if (!Array.isArray(parsed.learning)) parsed.learning = [parsed.learning || { cp: '', objectives: '' }];\\n        return parsed;\\n      } catch (e) {}" src/components/Wizard.tsx
sed -i -e "s/learning: { cp: '', objectives: '' }/learning: [{ cp: '', objectives: '' }]/g" src/components/Wizard.tsx
