import React, { useState } from "react";
import api from "../../api";

const VIEW_SIGNIN = 'signin';
const VIEW_FORGOT = 'forgot';
const VIEW_OTP    = 'otp';
const VIEW_RESET  = 'reset';

const ULogin = () => {
  const [view, setView] = useState(VIEW_SIGNIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ─── Sign In Form ────────────────────────────────────────────────────────
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setSuccess('');
    try {
      const res = await api.post("/api/examinee/login", form);
      if (res.data.message === "Login Successfully") {
        setSuccess("Login Successfully");
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("id", res.data.user.id);
        localStorage.setItem("role", res.data.user.role);
        window.location.href = "/userDashboard";
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Forgot Password (Send OTP) ────────────────────────────────────────
  const [forgotEmail, setForgotEmail] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setDevOtp(''); setPreviewUrl(''); setSuccess('');
    try {
      const res = await api.post('/api/examinee/send-otp', { email: forgotEmail });
      if (res.data.message === 'OTP sent successfully') {
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

  // ─── OTP Verification ────────────────────────────────────────────────────
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setSuccess('');
    try {
      const res = await api.post('/api/examinee/verify-otp', { email: forgotEmail, otp });
      if (res.data.message === 'OTP Verified') {
        setSuccess('OTP verified! Please set a new password.');
        setView(VIEW_RESET);
      } else {
        setError(res.data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Reset Password ──────────────────────────────────────────────────────
  const [resetForm, setResetForm] = useState({ newPassword: '', confirmPassword: '' });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.put('/api/examinee/reset-password', {
        email: forgotEmail,
        newPassword: resetForm.newPassword
      });
      if (res.data.message === 'Password reset successfully') {
        setSuccess('Password updated! You can now sign in.');
        setTimeout(() => { setView(VIEW_SIGNIN); setSuccess(''); setForgotEmail(''); setOtp(''); setResetForm({newPassword: '', confirmPassword: ''}) }, 2000);
      } else {
        setError(res.data.message || 'Password reset failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const goTo = (v) => { setView(v); setError(''); setSuccess(''); };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.headerTitle}>Exam Prep User</h2>

        {error && <div style={styles.alertError}>⚠️ {error}</div>}
        {success && <div style={styles.alertSuccess}>✅ {success}</div>}

        {/* ══════════════════════════════════════════
            VIEW: SIGN IN
        ══════════════════════════════════════════ */}
        {view === VIEW_SIGNIN && (
          <form onSubmit={handleSignIn} style={styles.form}>
            <div style={styles.field}>
              <label htmlFor="email" style={styles.label}>Username / Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div style={styles.links}>
              <button type="button" style={styles.linkBtn} onClick={() => goTo(VIEW_FORGOT)}>
                Forgot Password?
              </button>
              <a href="/registration" style={styles.linkBtn}>
                New Registration?
              </a>
            </div>
            <div style={{ ...styles.links, justifyContent: 'center', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <a href="/" style={styles.linkBtn}>
                &larr; Back to Welcome Portal
              </a>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════
            VIEW: FORGOT PASSWORD (Enter Email)
        ══════════════════════════════════════════ */}
        {view === VIEW_FORGOT && (
          <form onSubmit={handleSendOTP} style={styles.form}>
            <p style={styles.hint}>Enter your registered email. We'll send you a 6-digit OTP.</p>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                style={styles.input}
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <div style={styles.links}>
              <button type="button" style={styles.linkBtn} onClick={() => goTo(VIEW_SIGNIN)}>
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════
            VIEW: OTP VERIFICATION
        ══════════════════════════════════════════ */}
        {view === VIEW_OTP && (
          <form onSubmit={handleVerifyOTP} style={styles.form}>
            <p style={styles.hint}>A 6-digit OTP was sent to <strong>{forgotEmail}</strong>.</p>
            
            {devOtp && (
              <div style={styles.devBox}>
                <p style={{ margin: '0 0 6px', fontWeight: '700', color: '#7c3aed' }}>🛠 Dev Mode — Your OTP:</p>
                <div style={styles.devOtpCode}>{devOtp}</div>
                {previewUrl && (
                  <a href={previewUrl} target="_blank" rel="noreferrer" style={styles.devPreviewLink}>
                    📧 View test email →
                  </a>
                )}
              </div>
            )}

            <div style={styles.field}>
              <label style={styles.label}>One-Time Password</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                style={{ ...styles.input, letterSpacing: '8px', fontSize: '22px', textAlign: 'center' }}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div style={styles.links}>
              <button type="button" style={styles.linkBtn} onClick={() => goTo(VIEW_FORGOT)}>
                Resend OTP
              </button>
              <button type="button" style={styles.linkBtn} onClick={() => goTo(VIEW_SIGNIN)}>
                ← Login
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════
            VIEW: RESET PASSWORD
        ══════════════════════════════════════════ */}
        {view === VIEW_RESET && (
          <form onSubmit={handleResetPassword} style={styles.form}>
            <p style={styles.hint}>Enter your new password below.</p>
            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                style={styles.input}
                value={resetForm.newPassword}
                onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                style={styles.input}
                value={resetForm.confirmPassword}
                onChange={e => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
// Keeping the blue theme to match the previous ULogin style somewhat, but modernized.
const styles = {
  page: {
    minHeight: '100vh',
    background: 'lightblue',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: '#233363ff',
    borderRadius: '20px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    color: 'white'
  },
  headerTitle: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '30px',
    fontWeight: 'bold',
    fontSize: '24px'
  },
  alertError: {
    background: '#ff4d4d',
    color: 'white',
    borderRadius: '8px',
    padding: '10px 15px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center'
  },
  alertSuccess: {
    background: '#4CAF50',
    color: 'white',
    borderRadius: '8px',
    padding: '10px 15px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  hint: {
    fontSize: '14px',
    color: '#b0b8d6',
    textAlign: 'center',
    marginBottom: '10px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    marginBottom: '8px',
    color: '#e0e6ff'
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  btnPrimary: {
    marginTop: '15px',
    padding: '12px',
    background: '#37353E',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'background 0.2s',
  },
  links: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#8da6ff',
    cursor: 'pointer',
    textDecoration: 'none',
    padding: '0',
  },
  devBox: {
    background: '#fff',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    textAlign: 'center',
    color: '#333'
  },
  devOtpCode: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#13214a',
    letterSpacing: '5px',
    margin: '10px 0'
  },
  devPreviewLink: {
    color: '#1a73e8',
    textDecoration: 'underline',
    fontSize: '13px'
  }
};

export default ULogin;