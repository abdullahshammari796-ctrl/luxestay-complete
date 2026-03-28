import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const BOT_RESPONSES = {
  greeting: "Welcome to LuxeStay! 🌟 I'm your personal concierge. How may I assist you today?",
  rooms: "We offer 6 room categories:\n• Classic Rooms from $180/night\n• Superior Rooms from $240/night\n• Luxury Suites from $480/night\n• Presidential Suite from $1,200/night\n• Honeymoon Suites from $650/night\n• Family Suites from $390/night\n\nWould you like to explore a specific category?",
  booking: "Booking is simple! 🛏️\n1. Browse our rooms\n2. Select check-in/check-out dates\n3. Complete the form\n4. Confirm & pay\n\nYour confirmation email arrives instantly. Shall I take you to our rooms page?",
  amenities: "LuxeStay offers world-class amenities:\n🍽️ 5 Fine Dining Restaurants\n🏊 Infinity & Rooftop Pools\n💆 Full Luxury Spa\n🏋️ 24/7 Fitness Center\n🚗 Valet Parking\n✈️ Airport Transfers\n🛎️ 24/7 Concierge",
  checkin: "Check-in time is 3:00 PM and check-out is 12:00 PM. Early check-in and late check-out are available upon request. 🕒",
  payment: "We accept all major credit/debit cards, PayPal, and bank transfer. All payments are secured with 256-bit SSL encryption. 💳",
  cancel: "Cancellations made 48+ hours before check-in receive a full refund. Within 48 hours, a one-night charge applies. Please contact reception for special circumstances. 📋",
  contact: "Reach us anytime:\n📞 +971 4 000 0000\n✉️ stay@luxestay.com\n📍 The Palm, Dubai, UAE\n⏰ 24/7 Concierge at your service",
  default: "I'd be happy to help with that! For specific requests, please contact our concierge team directly at +971 4 000 0000 or stay@luxestay.com. Is there anything else I can assist you with? 😊"
};

const QUICK_REPLIES = ["Room types & prices", "Make a booking", "Amenities", "Check-in/out times", "Payment options", "Cancellation policy"];

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (m.match(/hello|hi|hey|good/)) return BOT_RESPONSES.greeting;
  if (m.match(/room|suite|price|cost|rate|stay/)) return BOT_RESPONSES.rooms;
  if (m.match(/book|reserv|availab/)) return BOT_RESPONSES.booking;
  if (m.match(/ameniti|faciliti|pool|spa|gym|restaurant/)) return BOT_RESPONSES.amenities;
  if (m.match(/check.?in|check.?out|time|arrival/)) return BOT_RESPONSES.checkin;
  if (m.match(/pay|card|credit|debit|transfer/)) return BOT_RESPONSES.payment;
  if (m.match(/cancel|refund|policy/)) return BOT_RESPONSES.cancel;
  if (m.match(/contact|phone|email|address/)) return BOT_RESPONSES.contact;
  if (m.match(/room types|prices/)) return BOT_RESPONSES.rooms;
  if (m.match(/make a booking/)) return BOT_RESPONSES.booking;
  if (m.match(/amenities/)) return BOT_RESPONSES.amenities;
  if (m.match(/check-in|check.out times/)) return BOT_RESPONSES.checkin;
  if (m.match(/payment/)) return BOT_RESPONSES.payment;
  if (m.match(/cancellation/)) return BOT_RESPONSES.cancel;
  return BOT_RESPONSES.default;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: BOT_RESPONSES.greeting, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (text) => {
    const t = (text || input).trim();
    if (!t) return;
    const time = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    setMessages(m => [...m, { from: 'user', text: t, time }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: 'bot', text: getResponse(t), time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      {/* Trigger Button */}
      <button className={`chatbot__trigger ${open ? 'chatbot__trigger--open' : ''}`} onClick={() => setOpen(!open)}>
        {open ? '✕' : '💬'}
        {!open && <span className="chatbot__trigger-badge">1</span>}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot__window">
          {/* Header */}
          <div className="chatbot__header">
            <div className="chatbot__header-avatar">
              <span>✦</span>
              <span className="chatbot__online" />
            </div>
            <div>
              <div className="chatbot__header-name">LuxeStay Concierge</div>
              <div className="chatbot__header-status">● Online Now</div>
            </div>
            <button className="chatbot__close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chatbot__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot__msg chatbot__msg--${msg.from}`}>
                {msg.from === 'bot' && <div className="chatbot__bot-icon">✦</div>}
                <div className="chatbot__bubble">
                  <pre className="chatbot__text">{msg.text}</pre>
                  <span className="chatbot__time">{msg.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="chatbot__msg chatbot__msg--bot">
                <div className="chatbot__bot-icon">✦</div>
                <div className="chatbot__bubble chatbot__typing">
                  <span/><span/><span/>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="chatbot__quick">
            {QUICK_REPLIES.map((q, i) => (
              <button key={i} className="chatbot__quick-btn" onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot__input-row">
            <input
              className="chatbot__input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type your message..."
            />
            <button className="chatbot__send" onClick={() => send()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
