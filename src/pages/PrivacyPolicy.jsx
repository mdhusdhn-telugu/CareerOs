import React, { useEffect } from 'react';
import styles from './PrivacyPolicy.module.css';

// CORRECTED IMPORTS: Go up to 'src', then into 'components'
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Scene from "../components/Homepage/Scene";

const PolicySection = ({ title, children }) => (
  <section>
    <h2 className={styles.policyHeading}>{title}</h2>
    <div className={styles.policyText}>{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />
        
        <div className={styles.policyPageContainer}>
          <div className={styles.policyCard}>
            
            <header>
              <h1 className={styles.policyTitle}>Privacy Policy</h1>
              <p className={styles.policyDate}>Last Updated: October 3, 2025</p>
            </header>

            <main>
              <p className={styles.policyText}>
                Welcome to CodeAstra ("we," "us," or "our"). We are committed to
                protecting your personal information and your right to privacy. This
                Privacy Policy explains what information we collect, how we use it,
                and what rights you have in relation to it. If you have any
                questions or concerns, please contact us at{' '}
                <a href="mailto:mdhusdhn.telugu@gmail.com" className={styles.policyLink}>
                  privacy@codeastra.com
                </a>.
              </p>

              <PolicySection title="1. Information We Collect">
                <p>
                  We collect information that you provide to us directly, information
                  we collect automatically when you use our services, and information
                  from third-party sources.
                </p>
                <ul className={styles.policyList}>
                  <li>
                    <strong>Information You Provide:</strong> This includes your name,
                    email address, password, and any other information you choose to
                    provide when you register for an account or use our services.
                  </li>
                  <li>
                    <strong>Information Collected Automatically:</strong> We
                    automatically collect certain information like your IP address,
                    browser type, device characteristics, and usage data when you
                    visit our platform.
                  </li>
                  <li>
                    <strong>Cookies and Tracking Technologies:</strong> We use cookies
                    and similar tracking technologies to access or store information
                    to improve our services and your experience.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection title="2. How We Use Your Information">
                <p>
                  We use the information we collect for various business purposes,
                  including to:
                </p>
                <ul className={styles.policyList}>
                  <li>Provide, operate, and maintain our services.</li>
                  <li>Improve, personalize, and expand our services.</li>
                  <li>Understand and analyze how you use our services.</li>
                  <li>Communicate with you for customer service, updates, and marketing purposes.</li>
                  <li>Process your transactions and prevent fraud.</li>
                </ul>
              </PolicySection>

              <PolicySection title="3. How We Share Your Information">
                <p>
                  We do not sell your personal information. We may share information
                  with third parties in the following situations:
                </p>
                <ul className={styles.policyList}>
                  <li><strong>With Service Providers:</strong> To perform services on our behalf.</li>
                  <li><strong>For Legal Reasons:</strong> To comply with applicable laws or respond to valid legal processes.</li>
                  <li><strong>With Your Consent:</strong> For any other purpose with your explicit consent.</li>
                </ul>
              </PolicySection>

              <PolicySection title="4. Data Security">
                <p>
                  We have implemented appropriate technical and organizational
                  security measures designed to protect the security of any personal
                  information we process. However, no electronic transmission over
                  the Internet can be guaranteed to be 100% secure.
                </p>
              </PolicySection>

              <PolicySection title="5. Your Privacy Rights">
                <p>
                  Depending on your location, you may have the right to access,
                  update, delete, or restrict the processing of your personal
                  information. To exercise these rights, please contact us.
                </p>
              </PolicySection>
              
              <PolicySection title="6. Children's Privacy">
                <p>
                  We do not knowingly collect personally identifiable information from
                  children under the age of 13 without verifiable parental consent.
                  If you believe we have collected such information, please contact us
                  immediately.
                </p>
              </PolicySection>

              <PolicySection title="7. Changes to This Privacy Policy">
                <p>
                  We may update this privacy policy from time to time. The updated
                  version will be indicated by a revised "Last Updated" date. We
                  encourage you to review this policy frequently.
                </p>
              </PolicySection>

              <PolicySection title="8. Contact Us">
                <p>
                  If you have questions or comments about this policy, you may email
                  us at{' '}
                  <a href="mailto:mdhusdhn.telugu@gmail.com" className={styles.policyLink}>
                    privacy@codeastra.com
                  </a>{' '}
                  or by post to:
                </p>
                <address className={styles.policyAddress}>
                  CodeAstra Inc.
                  <br />
                  c/o Madhu Sudhan
                  <br />
                  Nandyal, Andhra Pradesh
                  <br />
                  India
                </address>
              </PolicySection>
            </main>

            <footer className={styles.policyFooter}>
              <p className={styles.policyDisclaimer}>
                <strong>Disclaimer:</strong> This is a sample privacy policy and does
                not constitute legal advice. You should consult with a legal
                professional to ensure your policy is compliant with all applicable
                laws.
              </p>
            </footer>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;