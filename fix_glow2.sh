sed -i -e '/.glowing-text {/,/}/d' src/index.css
sed -i -e '/@keyframes shine {/,/}/d' src/index.css

cat << 'INNER_EOF' >> src/index.css
.glowing-text {
  position: relative;
  display: inline-block;
  color: var(--primary-dark);
  background: linear-gradient(
    90deg, 
    var(--primary-dark) 0%, 
    var(--primary-dark) 40%, 
    #eab308 45%, 
    #ffffff 50%, 
    #eab308 55%, 
    var(--primary-dark) 60%, 
    var(--primary-dark) 100%
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 4s linear infinite;
  text-shadow: 0px 0px 8px rgba(234, 179, 8, 0.3);
}

@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
INNER_EOF
