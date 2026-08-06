sed -i -e '/.glowing-text {/,/}/d' src/index.css
sed -i -e '/@keyframes shine {/,/}/d' src/index.css

cat << 'INNER_EOF' >> src/index.css
.glowing-text {
  position: relative;
  display: inline-block;
  color: transparent;
  background: linear-gradient(
    90deg, 
    var(--primary-dark) 0%, 
    var(--primary-dark) 35%, 
    #ffd700 45%, 
    #ffffff 50%, 
    #ffd700 55%, 
    var(--primary-dark) 65%, 
    var(--primary-dark) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 4s ease-in-out infinite alternate;
  text-shadow: 0px 0px 15px rgba(255, 215, 0, 0.4);
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
