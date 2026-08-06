sed -i -e '/.glowing-text {/,/}/d' src/index.css
sed -i -e '/@keyframes shine {/,/}/d' src/index.css

cat << 'INNER_EOF' >> src/index.css
.glowing-text {
  position: relative;
  display: inline-block;
  color: var(--primary-dark);
  background: linear-gradient(
    90deg, 
    var(--primary-dark) 35%, 
    #b8860b 45%, 
    #ffffff 50%, 
    #b8860b 55%, 
    var(--primary-dark) 65%
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 4s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}
INNER_EOF
