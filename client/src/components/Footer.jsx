function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__grid">
        <div>
          <h4 className="footer__column-title">About</h4>
          <span className="footer__link">Contact Us</span>
          <span className="footer__link">About Us</span>
          <span className="footer__link">Careers</span>
          <span className="footer__link">Flipkart Stories</span>
          <span className="footer__link">Press</span>
        </div>
        <div>
          <h4 className="footer__column-title">Help</h4>
          <span className="footer__link">Payments</span>
          <span className="footer__link">Shipping</span>
          <span className="footer__link">Cancellation & Returns</span>
          <span className="footer__link">FAQ</span>
        </div>
        <div>
          <h4 className="footer__column-title">Consumer Policy</h4>
          <span className="footer__link">Return Policy</span>
          <span className="footer__link">Terms Of Use</span>
          <span className="footer__link">Security</span>
          <span className="footer__link">Privacy</span>
          <span className="footer__link">Sitemap</span>
        </div>
        <div>
          <h4 className="footer__column-title">Social</h4>
          <span className="footer__link">Facebook</span>
          <span className="footer__link">Twitter</span>
          <span className="footer__link">YouTube</span>
          <span className="footer__link">Instagram</span>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2024-2026 Flipkart Clone. Built as an academic project.</span>
        <div className="footer__icons">
          <span>💳 Payment</span>
          <span>📦 Shipping</span>
          <span>🔒 Secure</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
