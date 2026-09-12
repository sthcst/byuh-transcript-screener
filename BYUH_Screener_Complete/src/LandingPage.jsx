import React from 'react';

const LandingPage = ({ onSelectHighSchool, onSelectCollege }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: '#ba0c2f',
      color: 'white',
      padding: '30px 20px',
      textAlign: 'center',
      borderBottom: '3px solid #c69214',
    },
    headerTitle: {
      fontSize: '48px',
      fontWeight: '700',
      margin: '0',
      marginBottom: '10px',
    },
    headerSubtitle: {
      fontSize: '18px',
      fontWeight: '400',
      opacity: '0.9',
      margin: '0',
    },
    content: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: '40px',
      padding: '40px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '40px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '3px solid transparent',
      width: '350px',
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      borderColor: '#ba0c2f',
    },
    cardIcon: {
      fontSize: '64px',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#ba0c2f',
      marginBottom: '15px',
    },
    cardDescription: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '25px',
      lineHeight: '1.5',
    },
    cardFeatures: {
      textAlign: 'left',
      fontSize: '14px',
      color: '#555',
      marginBottom: '25px',
    },
    feature: {
      marginBottom: '10px',
      paddingLeft: '20px',
      position: 'relative',
    },
    featureBullet: {
      position: 'absolute',
      left: '0',
      color: '#c69214',
      fontWeight: '700',
    },
    button: {
      backgroundColor: '#ba0c2f',
      color: 'white',
      border: 'none',
      padding: '14px 32px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      width: '100%',
    },
    buttonHover: {
      backgroundColor: '#8a0a25',
    },
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [hoveredButton, setHoveredButton] = React.useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📚 BYUH Transcript Screener</h1>
        <p style={styles.headerSubtitle}>Philippine Student Transcript Evaluation System</p>
      </div>

      <div style={styles.content}>
        {/* High School Card */}
        <div
          style={{
            ...styles.card,
            ...(hoveredCard === 'hs' ? styles.cardHover : {}),
          }}
          onMouseEnter={() => setHoveredCard('hs')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={styles.cardIcon}>🎓</div>
          <h2 style={styles.cardTitle}>High School Transcripts</h2>
          <p style={styles.cardDescription}>
            Grade 11 & 12 evaluation for admissions
          </p>

          <div style={styles.cardFeatures}>
            <div style={styles.feature}>
              <span style={styles.featureBullet}>✓</span>
              Grade 11 & 12 processing
            </div>
            <div style={styles.feature}>
              <span style={styles.featureBullet}>✓</span>
              6 Philippine high school scales
            </div>
            <div style={styles.feature}>
              <span style={styles.featureBullet}>✓</span>
              Automatic GPA conversion
            </div>
            <div style={styles.feature}>
              <span style={styles.featureBullet}>✓</span>
              PDF upload support
            </div>
          </div>

          <button
            style={{
              ...styles.button,
              ...(hoveredButton === 'hs' ? styles.buttonHover : {}),
            }}
            onClick={onSelectHighSchool}
            onMouseEnter={() => setHoveredButton('hs')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Start Evaluation →
          </button>
        </div>

        {/* College Card */}
        <div
          style={{
            ...styles.card,
            ...(hoveredCard === 'college' ? styles.cardHover : {}),
          }}
          onMouseEnter={() => setHoveredCard('college')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={styles.cardIcon}>🎯</div>
          <h2 style={styles.cardTitle}>College Transcripts</h2>
          <p style={styles.cardDescription}>
            Transfer student evaluation (Coming Soon)
          </p>

          <div style={styles.cardFeatures}>
            <div style={styles.feature}>
              <span style={styles.featureBullet}>✓</span>
              60+ Philippine colleges
            </div>
            <div style={styles.feature}>
              <span style={styles.featureBullet}>✓</span>
              Multiple grade scales
            </div>
            <div style={styles.feature}>
              <span style={styles.featureBullet}>✓</span>
              Exact GPA conversions
            </div>
            <div style={styles.feature}>
              <span style={styles.featureBullet}>✓</span>
              AI-powered extraction
            </div>
          </div>

          <button
            style={{
              ...styles.button,
              ...(hoveredButton === 'college' ? styles.buttonHover : {}),
              opacity: '0.5',
              cursor: 'not-allowed',
            }}
            onClick={onSelectCollege}
            onMouseEnter={() => setHoveredButton('college')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
