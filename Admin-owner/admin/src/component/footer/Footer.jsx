import React from 'react'

function Footer() {
  return (
    <footer className="footer footer-center bg-slate-800 text-base-content p-4">
  <aside>
    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
  </aside>
</footer>
  )
}

export default Footer