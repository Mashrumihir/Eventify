import { useState } from 'react'
import './App.css'
import Sidebar from './components/Attend/Sidebar'
import Dashboard from './components/Attend/Dashboard'
import BrowseEvents from './components/Attend/BrowseEvents'
import EventDetails from './components/Attend/EventDetails'
import PaymentSuccess from './components/Attend/PaymentSuccess'
import Payments from './components/Attend/Payments'
import TaxInvoice from './components/Attend/TaxInvoice'
import MyBookings from './components/Attend/MyBookings'
import Notifications from './components/Attend/Notifications'
import Wishlist from './components/Attend/Wishlist'
import Reviews from './components/Attend/Reviews'
import ProfileSettings from './components/Attend/ProfileSettings'
import OrgSidebar from './components/Organizer/Sidebar'
import OrgDashboard from './components/Organizer/Dashboard'
import OrgCreateEvent from './components/Organizer/CreateEvent'
import OrgManageEvents from './components/Organizer/ManageEvents'
import OrgBookings from './components/Organizer/Bookings'
import OrgPayments from './components/Organizer/Payments'
import OrgAnnouncements from './components/Organizer/Announcements'
import OrgProfile from './components/Organizer/Profile'
import AdminSidebar from './components/Admin/Sidebar'
import AdminDashboard from './components/Admin/Dashboard'
import UserManagement from './components/Admin/UserManagement'
import OrganizerApproval from './components/Admin/OrganizerApproval'
import EventModeration from './components/Admin/EventModeration'
import SystemSettings from './components/Admin/SystemSettings'
import AdminNotifications from './components/Admin/Notifications'
import AdminReviews from './components/Admin/ReviewsRatings'
import ContactMessages from './components/Admin/ContactMessages'
import NewsletterSubscribers from './components/Admin/NewsletterSubscribers'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ForgotPassword from './components/Auth/ForgotPassword'
import VerifyEmail from './components/Auth/VerifyEmail'
import SetNewPassword from './components/Auth/SetNewPassword'
import EmailVerified from './components/Auth/EmailVerified'
import Home from './components/Home/Home'
import Contact from './components/Home/Contact/Contact'
import About from './components/Home/About/About'
import PartnerEvents from './components/Home/PartnerEvents/PartnerEvents'
import FAQ from './components/Home/FAQ/FAQ'
import Pricing from './components/Home/Pricing/Pricing'
import PrivacyPolicy from './components/Home/PrivacyPolicy/PrivacyPolicy'
import TermsOfService from './components/Home/TermsOfService/TermsOfService'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user, isAuthenticated, isBootstrapped, login, register, logout } = useAuth()
  const [appMode, setAppMode] = useState(() => getModeFromRole(user?.role))
  const [activePage, setActivePage] = useState('dashboard')
  const [authMode, setAuthMode] = useState('home')
  const [organizerEditorState, setOrganizerEditorState] = useState({ mode: 'create', eventData: null })

  const handleLogout = () => {
    logout()
    setAuthMode('login')
    setActivePage('dashboard')
  }

  const handleOrganizerNavigate = (page) => {
    if (page === 'createEvent') {
      setOrganizerEditorState({ mode: 'create', eventData: null })
    }

    setActivePage(page)
  }

  const handleOrganizerEditEvent = (eventData) => {
    setOrganizerEditorState({ mode: 'edit', eventData })
    setActivePage('createEvent')
  }

  const renderPage = () => {
    if (appMode === 'organizer') {
      switch (activePage) {
        case 'dashboard':
          return <OrgDashboard currentUser={user} />
        case 'createEvent':
          return (
            <OrgCreateEvent
              currentUser={user}
              mode={organizerEditorState.mode}
              eventData={organizerEditorState.eventData}
              onNavigate={handleOrganizerNavigate}
            />
          )
        case 'manageEvents':
          return (
            <OrgManageEvents
              currentUser={user}
              onNavigate={handleOrganizerNavigate}
              onEditEvent={handleOrganizerEditEvent}
            />
          )
        case 'bookings':
          return <OrgBookings />
        case 'payments':
          return <OrgPayments />
        case 'announcements':
          return <OrgAnnouncements />
        case 'profile':
          return <OrgProfile />
        default:
          return <PlaceholderPage title="Organizer Section" />
      }
    }

    if (appMode === 'admin') {
      switch (activePage) {
        case 'dashboard':
          return <AdminDashboard />
        case 'userManagement':
          return <UserManagement />
        case 'organizerApproval':
          return <OrganizerApproval />
        case 'eventModeration':
          return <EventModeration />
        case 'systemSettings':
          return <SystemSettings />
        case 'notifications':
          return <AdminNotifications />
        case 'contactMessages':
          return <ContactMessages />
        case 'newsletterSubscribers':
          return <NewsletterSubscribers />
        case 'reviews':
          return <AdminReviews />
        default:
          return <PlaceholderPage title="Admin Section" />
      }
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard currentUser={user} />
      case 'browse':
        return <BrowseEvents currentUser={user} onNavigate={setActivePage} />
      case 'eventDetails':
        return <EventDetails onNavigate={setActivePage} />
      case 'paymentSuccess':
        return <PaymentSuccess onNavigate={setActivePage} />
      case 'payments':
        return <Payments />
      case 'taxInvoice':
        return <TaxInvoice onNavigate={setActivePage} />
      case 'bookings':
        return <MyBookings onNavigate={setActivePage} />
      case 'wishlist':
        return <Wishlist />
      case 'notifications':
        return <Notifications />
      case 'reviews':
        return <Reviews />
      case 'profile':
        return <ProfileSettings />
      default:
        return <Dashboard currentUser={user} />
    }
  }

  if (!isBootstrapped) {
    return <PlaceholderPage title="Loading Eventify" />
  }

  if (!isAuthenticated) {
    if (authMode === 'home') {
      return (
        <Home
          onNavigateToLogin={() => setAuthMode('login')}
          onNavigateToRegister={() => setAuthMode('register')}
          onNavigateToApp={() => setAuthMode('login')}
          onNavigateToContact={() => setAuthMode('contact')}
          onNavigateToAbout={() => setAuthMode('about')}
          onNavigateToPartnerEvents={() => setAuthMode('partnerEvents')}
          onNavigateToFaq={() => setAuthMode('faq')}
          onNavigateToPricing={() => setAuthMode('pricing')}
          onNavigateToPrivacyPolicy={() => setAuthMode('privacyPolicy')}
          onNavigateToTermsOfService={() => setAuthMode('termsOfService')}
        />
      )
    }

    if (authMode === 'termsOfService') {
      return <TermsOfService onBack={() => setAuthMode('home')} />
    }

    if (authMode === 'privacyPolicy') {
      return <PrivacyPolicy onBack={() => setAuthMode('home')} />
    }

    if (authMode === 'pricing') {
      return (
        <Pricing
          onBack={() => setAuthMode('home')}
          onContact={() => setAuthMode('contact')}
          onGetStarted={() => setAuthMode('login')}
        />
      )
    }

    if (authMode === 'faq') {
      return <FAQ onBack={() => setAuthMode('home')} onContact={() => setAuthMode('contact')} />
    }

    if (authMode === 'partnerEvents') {
      return <PartnerEvents onBack={() => setAuthMode('home')} />
    }

    if (authMode === 'about') {
      return (
        <About
          onBack={() => setAuthMode('home')}
          onGetStarted={() => setAuthMode('login')}
          onContact={() => setAuthMode('contact')}
        />
      )
    }

    if (authMode === 'contact') {
      return <Contact onBack={() => setAuthMode('home')} />
    }

    if (authMode === 'register') {
      return (
        <Register
          onNavigateToLogin={() => setAuthMode('login')}
          onRegister={async (payload) => {
            const nextUser = await register(payload)
            setAppMode(getModeFromRole(nextUser.role))
            setActivePage('dashboard')
          }}
        />
      )
    }

    if (authMode === 'forgotPassword') {
      return <ForgotPassword onBack={() => setAuthMode('login')} onSubmit={() => setAuthMode('verifyEmail')} />
    }

    if (authMode === 'verifyEmail') {
      return (
        <VerifyEmail
          onBack={() => setAuthMode('login')}
          onSubmit={() => setAuthMode('setNewPassword')}
        />
      )
    }

    if (authMode === 'setNewPassword') {
      return <SetNewPassword onSubmit={() => setAuthMode('emailVerified')} />
    }

    if (authMode === 'emailVerified') {
      return (
        <EmailVerified
          onContinue={() => setAuthMode('login')}
          onGoHome={() => setAuthMode('home')}
        />
      )
    }

    return (
      <Login
        onLogin={async (payload) => {
          const nextUser = await login(payload)
          setAppMode(getModeFromRole(nextUser.role))
          setActivePage('dashboard')
        }}
        onNavigateToRegister={() => setAuthMode('register')}
        onNavigateToForgot={() => setAuthMode('forgotPassword')}
      />
    )
  }

  return (
    <div className="app-layout">
      {appMode === 'organizer' ? (
        <OrgSidebar activePage={activePage} onNavigate={handleOrganizerNavigate} onLogout={handleLogout} />
      ) : appMode === 'admin' ? (
        <AdminSidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
      ) : (
        <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
      )}

      <div className="main-wrapper">
        {appMode !== 'admin' && (
          <header className="app-header">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  const nextMode = appMode === 'attend' ? 'organizer' : appMode === 'organizer' ? 'admin' : 'attend'
                  setAppMode(nextMode)
                  setActivePage('dashboard')
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  color: '#334155',
                }}
              >
                Switch to {appMode === 'attend' ? 'Organizer' : appMode === 'organizer' ? 'Admin' : 'Attend'} View
              </button>
              <div className="user-profile">
                <div className="user-avatar">{user?.name?.slice(0, 2).toUpperCase() || 'EV'}</div>
                <span className="user-name">{user?.name || 'Eventify User'}</span>
                <span className="chevron-down">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>
          </header>
        )}

        <main className={`page-content ${appMode === 'admin' ? 'admin-page-shell' : ''}`}>{renderPage()}</main>
      </div>
    </div>
  )
}

function getModeFromRole(role) {
  if (role === 'organizer' || role === 'organize') {
    return 'organizer'
  }

  if (role === 'admin') {
    return 'admin'
  }

  return 'attend'
}

function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        gap: '12px',
        color: '#6b7280',
      }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 9h6M9 13h4" />
      </svg>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#374151' }}>{title}</h2>
      <p style={{ fontSize: '14px' }}>Please wait a moment.</p>
    </div>
  )
}
