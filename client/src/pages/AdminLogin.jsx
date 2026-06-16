import React, { useState } from 'react';
import axios from 'axios';

// ─── View constants ───────────────────────────────────────────────────────────
const VIEW_SIGNIN    = 'signin';
const VIEW_FORGOT    = 'forgot';
const VIEW_OTP       = 'otp';
const VIEW_SIGNUP    = 'signup';

const AdminLogin = () => {
  const [view, setView]       = useState(VIEW_SIGNIN);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  // ── Sign In form ──────────────────────────────────────────────────────────
  const [signIn, setSignIn] = useState({ email: '', password: '' });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', signIn);
      if (res.data.message === 'Login Successfully') {
        localStorage.setItem('adminEmail', res.data.admin.email);
        localStorage.setItem('id', res.data.admin.id);
        localStorage.setItem('role', res.data.admin.role);
        window.location.href = '/admindashboard';
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password (step 1 – enter email) ────────────────────────────────
  const [forgotEmail, setForgotEmail] = useState('');
  const [devOtp, setDevOtp]           = useState('');   // shown in dev mode
  const [previewUrl, setPreviewUrl]   = useState('');   // ethereal preview link

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setDevOtp(''); setPreviewUrl('');
    try {
      const res = await axios.post('http://localhost:5000/api/admin/send-otp', { email: forgotEmail });
      if (res.data.message === 'OTP sent successfully') {
        // Dev mode: server returned OTP directly (Gmail not configured)
        if (res.data.otp) {
          setDevOtp(res.data.otp);
          setPreviewUrl(res.data.previewUrl || '');
          setSuccess('Dev mode: OTP shown below (Gmail not configured).');
        } else {
          setSuccess('OTP sent! Check your email inbox.');
        }
        setView(VIEW_OTP);
      } else {
        setError(res.data.message || 'Could not send OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send OTP. Check the email address.');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Verification (step 2) ─────────────────────────────────────────────
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/verify-otp', {
        email: forgotEmail,
        otp,
      });
      if (res.data.message === 'Login Successfully') {
        localStorage.setItem('adminEmail', res.data.admin.email);
        localStorage.setItem('id', res.data.admin.id);
        localStorage.setItem('role', res.data.admin.role);
        window.location.href = '/admindashboard';
      } else {
        setError(res.data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up ───────────────────────────────────────────────────────────────
  const [signUp, setSignUp] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (signUp.password !== signUp.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/register', {
        name: signUp.name,
        email: signUp.email,
        password: signUp.password,
      });
      if (res.data.message === 'Registered successfully') {
        setSuccess('Account created! You can now sign in.');
        setSignUp({ name: '', email: '', password: '', confirm: '' });
        setTimeout(() => { setView(VIEW_SIGNIN); setSuccess(''); }, 1800);
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Navigation helper ─────────────────────────────────────────────────────
  const goTo = (v) => { setView(v); setError(''); setSuccess(''); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* ── Logo / Brand ── */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>📋</div>
          <h2 style={styles.brandName}>Exam Prep</h2>
          <p style={styles.brandSub}>Admin Portal</p>
        </div>

        {/* ── Feedback messages ── */}
        {error   && <div style={styles.alertError}>⚠️ {error}</div>}
        {success && <div style={styles.alertSuccess}>✅ {success}</div>}

        {/* ══════════════════════════════════════════
            VIEW: SIGN IN
        ══════════════════════════════════════════ */}
        {view === VIEW_SIGNIN && (
          <form onSubmit={handleSignIn} style={styles.form}>
            <h3 style={styles.title}>Sign In</h3>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                style={styles.input}
                value={signIn.email}
                onChange={e => setSignIn({ ...signIn, email: e.target.value })}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                style={styles.input}
                value={signIn.password}
                onChange={e => setSignIn({ ...signIn, password: e.target.value })}
                required
              />
            </div>

            <button id="signin-btn" type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <div style={styles.links}>
              <span>Forgot{' '}
                <button type="button" id="goto-forgot" style={styles.linkBtn} onClick={() => goTo(VIEW_FORGOT)}>
                  Password?
                </button>
              </span>
              <button type="button" id="goto-signup" style={styles.linkBtn} onClick={() => goTo(VIEW_SIGNUP)}>
                Sign Up
              </button>
            </div>
            <div style={{ ...styles.links, justifyContent: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <a href="/" style={styles.linkBtn}>
                &larr; Back to Welcome Portal
              </a>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════
            VIEW: FORGOT PASSWORD  (enter email)
        ══════════════════════════════════════════ */}
        {view === VIEW_FORGOT && (
          <form onSubmit={handleSendOTP} style={styles.form}>
            <h3 style={styles.title}>Forgot Password</h3>
            <p style={styles.hint}>Enter your registered admin email. We'll send you a 6-digit OTP.</p>

            <div style={styles.field}>
              <label style={styles.label}>Admin Email</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                style={styles.input}
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button id="send-otp-btn" type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Sending…' : 'Send OTP'}
            </button>

            <div style={styles.links}>
              <button type="button" id="back-to-signin" style={styles.linkBtn} onClick={() => goTo(VIEW_SIGNIN)}>
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════
            VIEW: OTP VERIFICATION
        ══════════════════════════════════════════ */}
        {view === VIEW_OTP && (
          <form onSubmit={handleVerifyOTP} style={styles.form}>
            <h3 style={styles.title}>Enter OTP</h3>
            <p style={styles.hint}>
              A 6-digit OTP was sent to <strong>{forgotEmail}</strong>. It expires in 5 minutes.
            </p>

            {/* Dev mode: show OTP directly when Gmail not configured */}
            {devOtp && (
              <div style={styles.devBox}>
                <p style={{ margin: '0 0 6px', fontWeight: '700', color: '#7c3aed' }}>🛠 Dev Mode — Your OTP:</p>
                <div style={styles.devOtpCode}>{devOtp}</div>
                {previewUrl && (
                  <a href={previewUrl} target="_blank" rel="noreferrer" style={styles.devPreviewLink}>
                    📧 View test email →
                  </a>
                )}
                <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#888' }}>
                  Configure Gmail in server/.env to send real emails.
                </p>
              </div>
            )}

            <div style={styles.field}>
              <label style={styles.label}>One-Time Password</label>
              <input
                id="otp-input"
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                style={{ ...styles.input, letterSpacing: '8px', fontSize: '22px', textAlign: 'center' }}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <button id="verify-otp-btn" type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Verifying…' : 'Verify & Login'}
            </button>

            <div style={styles.links}>
              <button type="button" id="resend-otp" style={styles.linkBtn} onClick={() => goTo(VIEW_FORGOT)}>
                Resend OTP
              </button>
              <button type="button" id="back-from-otp" style={styles.linkBtn} onClick={() => goTo(VIEW_SIGNIN)}>
                ← Sign In
              </button>
            </div>
          </form>
        )}


        {/* ══════════════════════════════════════════
            VIEW: SIGN UP (Admin Registration)
        ══════════════════════════════════════════ */}
        {view === VIEW_SIGNUP && (
          <form onSubmit={handleSignUp} style={styles.form}>
            <h3 style={styles.title}>Create Admin Account</h3>

            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                style={styles.input}
                value={signUp.name}
                onChange={e => setSignUp({ ...signUp, name: e.target.value })}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                style={styles.input}
                value={signUp.email}
                onChange={e => setSignUp({ ...signUp, email: e.target.value })}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                style={styles.input}
                value={signUp.password}
                onChange={e => setSignUp({ ...signUp, password: e.target.value })}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                placeholder="Confirm your password"
                style={styles.input}
                value={signUp.confirm}
                onChange={e => setSignUp({ ...signUp, confirm: e.target.value })}
                required
              />
            </div>

            <button id="signup-btn" type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Registering…' : 'Create Account'}
            </button>

            <div style={styles.links}>
              <button type="button" id="back-from-signup" style={styles.linkBtn} onClick={() => goTo(VIEW_SIGNIN)}>
                ← Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', 'Inter', sans-serif",
    padding: '20px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  },
  brand: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  brandIcon: {
    fontSize: '36px',
    marginBottom: '6px',
  },
  brandName: {
    margin: '0',
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  brandSub: {
    margin: '2px 0 0',
    fontSize: '13px',
    color: '#888',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  alertError: {
    background: '#fff3f3',
    border: '1px solid #f5c6c6',
    color: '#c0392b',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  alertSuccess: {
    background: '#f0fff4',
    border: '1px solid #a8e6c1',
    color: '#1a7a4a',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  title: {
    margin: '0 0 20px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  hint: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '18px',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '14px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '6px',
  },
  input: {
    padding: '12px 14px',
    border: '1.5px solid #dde3ec',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
    color: '#1a1a2e',
    background: '#f8fafc',
  },
  btnPrimary: {
    marginTop: '8px',
    padding: '13px',
    background: 'linear-gradient(135deg, #1a73e8, #0d47a1)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
    letterSpacing: '0.3px',
  },
  links: {
    marginTop: '18px',
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    fontSize: '13px',
    color: '#555',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#1a73e8',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    padding: '0',
    textDecoration: 'underline',
  },
  devBox: {
    background: '#f5f0ff',
    border: '1.5px dashed #7c3aed',
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '13px',
  },
  devOtpCode: {
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '10px',
    color: '#7c3aed',
    background: '#ede9fe',
    borderRadius: '8px',
    padding: '10px',
    margin: '6px 0',
  },
  devPreviewLink: {
    display: 'inline-block',
    marginTop: '6px',
    color: '#1a73e8',
    fontSize: '13px',
    fontWeight: '600',
  },
};

export default AdminLogin;