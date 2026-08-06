awk '
/step === 2/ {
  in_step = 1;
}
in_step {
  if (/}/ && !braces) {
    print "        {step === 2 && (";
    print "          <div className=\"wizard-panel\">";
    print "            <div className=\"section-heading\"><span>02</span><div><h2>Capaian dan Tujuan Pembelajaran</h2></div></div>";
    print "            <div className=\"form-grid one\">";
    print "              {formData.learning.map((item, index) => (";
    print "                <div key={index} style={{ marginBottom: \"1.5rem\", padding: \"1.5rem\", border: \"1px solid #e2e8f0\", borderRadius: \"0.75rem\", position: \"relative\", background: \"#fafafa\" }}>";
    print "                  {formData.learning.length > 1 && (";
    print "                    <button type=\"button\" onClick={() => removeLearning(index)} style={{ position: \"absolute\", top: \"1rem\", right: \"1rem\", color: \"#ef4444\", background: \"none\", border: \"none\", cursor: \"pointer\", fontWeight: 600, fontSize: \"12px\" }}>Hapus</button>";
    print "                  )}";
    print "                  <label style={{ display: \"block\", marginBottom: \"1rem\" }}>Capaian Pembelajaran (CP) {index + 1} <textarea rows={3} style={{ marginTop: \"0.5rem\", width: \"100%\" }} value={item.cp} onChange={e => handleLearningChange(index, \"cp\", e.target.value)} /></label>";
    print "                  <label style={{ display: \"block\" }}>Tujuan Pembelajaran (TP) {index + 1} <textarea rows={3} style={{ marginTop: \"0.5rem\", width: \"100%\" }} value={item.objectives} onChange={e => handleLearningChange(index, \"objectives\", e.target.value)} /></label>";
    print "                </div>";
    print "              ))}";
    print "              <button type=\"button\" className=\"btn btn-secondary\" onClick={addLearning} style={{ alignSelf: \"flex-start\" }}>+ Tambah CP & TP</button>";
    print "            </div>";
    print "          </div>";
    print "        )}";
    in_step = 0;
    next;
  }
}
!in_step { print $0 }
' src/components/Wizard.tsx > temp.tsx && mv temp.tsx src/components/Wizard.tsx
