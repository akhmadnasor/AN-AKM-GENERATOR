sed -i -e '/const handleChange = (section:/i \
  const handleLearningChange = (index: number, field: "cp" | "objectives", value: string) => {\
    setFormData(prev => {\
      const newLearning = [...prev.learning];\
      newLearning[index] = { ...newLearning[index], [field]: value };\
      return { ...prev, learning: newLearning };\
    });\
  };\
\
  const addLearning = () => {\
    setFormData(prev => ({\
      ...prev,\
      learning: [...prev.learning, { cp: "", objectives: "" }]\
    }));\
  };\
\
  const removeLearning = (index: number) => {\
    setFormData(prev => ({\
      ...prev,\
      learning: prev.learning.filter((_, i) => i !== index)\
    }));\
  };\
' src/components/Wizard.tsx
