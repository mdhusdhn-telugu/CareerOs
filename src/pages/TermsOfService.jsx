import React, { useEffect } from 'react';
import styles from './PrivacyPolicy.module.css';

// CORRECTED IMPORTS: Go up to 'src', then into 'components'
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Scene from "../components/Homepage/Scene";

const TermsSection = ({ title, children }) => (
  <section>
    <h2 className={styles.policyHeading}>{title}</h2>
    <div className={styles.policyText}>{children}</div>
  </section>
);

const TermsOfService = () => {
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
              <h1 className={styles.policyTitle}>Terms of Service</h1>
              <p className={styles.policyDate}>Last Updated: October 3, 2025</p>
            </header>

            <main>
              <TermsSection title="1. Agreement to Terms">
                <p>
                  By accessing or using the services provided by CodeAstra ("we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the service. This is a legally binding agreement.
                </p>
              </TermsSection>

              <TermsSection title="2. User Accounts">
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                </p>
              </TermsSection>

              <TermsSection title="3. Intellectual Property">
                <p>
                  The service and its original content, features, and functionality are and will remain the exclusive property of CodeAstra and its licensors. The service is protected by copyright, trademark, and other laws of both India and foreign countries. Our trademarks may not be used in connection with any product or service without the prior written consent of CodeAstra.
                </p>
              </TermsSection>
              
              <TermsSection title="4. Prohibited Activities">
                <p>
                  You agree not to engage in any of the following prohibited activities: (a) copying, distributing, or disclosing any part of the service in any medium; (b) using any automated system, including "robots" or "spiders," to access the service in a manner that sends more request messages to the servers than a human can reasonably produce in the same period of time; (c) attempting to interfere with or compromise the system integrity or security.
                </p>
              </TermsSection>

              <TermsSection title="5. Termination">
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
                </p>
              </TermsSection>
              
              <TermsSection title="6. Governing Law">
                <p>
                  These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </TermsSection>

              <TermsSection title="7. Changes to Terms">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </TermsSection>

              <TermsSection title="8. Contact Us">
                <p>
                  If you have any questions about these Terms, please contact us at <a href="mailto:mdhusdhn.telugu@gmail.com" className={styles.policyLink}>support@codeastra.com</a>.
                </p>
              </TermsSection>
            </main>

            <footer className={styles.policyFooter}>
              <p className={styles.policyDisclaimer}>
                <strong>Disclaimer:</strong> This is a sample Terms of Service template and does not constitute legal advice. You should consult with a legal professional to ensure your terms are compliant with all applicable laws and regulations.
              </p>
            </footer>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;