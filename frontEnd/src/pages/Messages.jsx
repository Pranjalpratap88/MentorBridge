import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import connectionService from '../services/connectionService';
import { useAuth } from '../context/AuthContext';

// ─── Time formatting ──────────────────────────────────────────────────────────

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  const sameYear = date.getFullYear() === now.getFullYear();
  if (sameYear) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMessageTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Shared components ────────────────────────────────────────────────────────

const ROLE_STYLES = {
  STUDENT: 'bg-blue-500/20 text-blue-300',
  SENIOR_STUDENT: 'bg-purple-500/20 text-purple-300',
  ALUMNI: 'bg-emerald-500/20 text-emerald-300',
  MENTOR: 'bg-orange-500/20 text-orange-300',
};

const ROLE_LABELS = {
  STUDENT: 'Student',
  SENIOR_STUDENT: 'Senior Student',
  ALUMNI: 'Alumni',
  MENTOR: 'Mentor',
};

function RoleBadge({ role }) {
  const cls = ROLE_STYLES[role] || 'bg-gray-500/20 text-gray-300';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

function Avatar({ src, name, size = 'md' }) {
  const sizeClass =
    size === 'sm'
      ? 'w-9 h-9 text-xs'
      : size === 'lg'
      ? 'w-12 h-12 text-base'
      : 'w-10 h-10 text-sm';
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full bg-[#1a2744] flex items-center justify-center text-[#9baad6] font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

// ─── Conversation list item ───────────────────────────────────────────────────

function ConversationItem({ conv, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
        isSelected
          ? 'bg-blue-600/20 border-l-2 border-blue-500'
          : 'hover:bg-[#1a2744] border-l-2 border-transparent'
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar src={conv.partnerProfilePicture} name={conv.partnerName} />
        {conv.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p
            className={`text-sm font-medium truncate ${
              isSelected ? 'text-[#dee5ff]' : 'text-[#dee5ff]'
            }`}
          >
            {conv.partnerName}
          </p>
          <span className="text-[10px] text-[#9baad6] flex-shrink-0">
            {formatTime(conv.lastMessageAt)}
          </span>
        </div>
        <p className="text-xs text-[#9baad6] truncate mt-0.5">
          {conv.lastMessage || 'No messages yet'}
        </p>
      </div>
    </button>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, isSent }) {
  return (
    <div className={`flex items-end gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isSent && (
        <Avatar src={msg.senderProfilePicture} name={msg.senderName} size="sm" />
      )}
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isSent
            ? 'bg-blue-600/40 text-[#dee5ff] rounded-br-sm'
            : 'bg-[#1a2744] text-[#dee5ff] rounded-bl-sm'
        }`}
      >
        <p className="break-words">{msg.content}</p>
        <p
          className={`text-[10px] mt-1 ${
            isSent ? 'text-blue-300/60 text-right' : 'text-[#9baad6]/60'
          }`}
        >
          {formatMessageTime(msg.sentAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-[#9baad6] gap-3">
      <span className="material-symbols-outlined text-6xl opacity-30">forum</span>
      <p className="text-sm">Select a conversation to start messaging</p>
    </div>
  );
}

// ─── Main Messages Page ───────────────────────────────────────────────────────

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const partnerIdFromNav = location.state?.partnerId ?? null;

  const [inbox, setInbox] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Load inbox ──────────────────────────────────────────────────────────────

  const loadInbox = useCallback(async () => {
    try {
      const res = await connectionService.getInbox();
      const data = res?.data ?? [];
      setInbox(data);
      return data;
    } catch {
      // silently fail on poll
    } finally {
      setInboxLoading(false);
    }
  }, []);

  // ── Load messages for selected partner ─────────────────────────────────────

  const loadMessages = useCallback(async (partnerId) => {
    if (!partnerId) return;
    setMessagesLoading(true);
    try {
      const res = await connectionService.getConversation(partnerId);
      setMessages(res?.data ?? []);
    } catch {
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // ── Poll for new messages ───────────────────────────────────────────────────

  const startPolling = useCallback(
    (partnerId) => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        if (!partnerId) return;
        try {
          const res = await connectionService.getConversation(partnerId);
          setMessages(res?.data ?? []);
        } catch {
          // ignore poll errors
        }
        loadInbox();
      }, 5000);
    },
    [loadInbox]
  );

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // ── On mount ────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadInbox().then((data) => {
      if (partnerIdFromNav) {
        setSelectedPartnerId(String(partnerIdFromNav));
        // If not in inbox yet, still open the chat
      }
    });
    return () => stopPolling();
  }, [loadInbox, partnerIdFromNav, stopPolling]);

  // ── When selected partner changes ───────────────────────────────────────────

  useEffect(() => {
    if (!selectedPartnerId) {
      stopPolling();
      setMessages([]);
      return;
    }
    loadMessages(selectedPartnerId);
    startPolling(selectedPartnerId);
    // On mobile, hide sidebar when conversation selected
    if (window.innerWidth < 768) setShowSidebar(false);
  }, [selectedPartnerId, loadMessages, startPolling, stopPolling]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ────────────────────────────────────────────────────────────

  async function handleSend() {
    const content = messageInput.trim();
    if (!content || !selectedPartnerId || sending) return;
    setSending(true);
    setMessageInput('');
    try {
      await connectionService.sendMessage(selectedPartnerId, content);
      await loadMessages(selectedPartnerId);
      await loadInbox();
    } catch {
      setMessageInput(content); // restore on failure
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Filtered inbox ──────────────────────────────────────────────────────────

  const filteredInbox = useMemo(() => {
    if (!searchQuery.trim()) return inbox;
    const q = searchQuery.toLowerCase();
    return inbox.filter(
      (c) =>
        c.partnerName?.toLowerCase().includes(q) ||
        c.lastMessage?.toLowerCase().includes(q)
    );
  }, [inbox, searchQuery]);

  // ── Selected conversation meta ──────────────────────────────────────────────

  const selectedConv = useMemo(
    () => inbox.find((c) => String(c.partnerId) === String(selectedPartnerId)),
    [inbox, selectedPartnerId]
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-[#060e1d] text-[#dee5ff] flex flex-col overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1e2d4a] bg-[#0c1427]/80">
        {!showSidebar && selectedConv ? (
          <>
            <button
              onClick={() => setShowSidebar(true)}
              className="text-[#9baad6] hover:text-[#dee5ff]"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <Avatar
              src={selectedConv.partnerProfilePicture}
              name={selectedConv.partnerName}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedConv.partnerName}</p>
            </div>
          </>
        ) : (
          <h1 className="text-lg font-bold">Messages</h1>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside
          className={`${
            showSidebar ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-[#1e2d4a] bg-[#0c1427]/80 flex-shrink-0`}
        >
          {/* Sidebar header */}
          <div className="px-4 py-4 border-b border-[#1e2d4a]">
            <h2 className="text-lg font-bold text-[#dee5ff] hidden md:block mb-3">
              Messages
            </h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9baad6] text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a2744] border border-[#1e2d4a] rounded-lg pl-9 pr-3 py-2 text-sm text-[#dee5ff] placeholder-[#9baad6]/50 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {inboxLoading ? (
              <div className="flex justify-center py-10">
                <span className="material-symbols-outlined text-3xl text-[#9baad6] animate-spin">
                  progress_activity
                </span>
              </div>
            ) : filteredInbox.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#9baad6] gap-2">
                <span className="material-symbols-outlined text-4xl opacity-30">
                  {searchQuery ? 'search_off' : 'forum'}
                </span>
                <p className="text-sm">
                  {searchQuery ? 'No results found' : 'No conversations yet'}
                </p>
              </div>
            ) : (
              filteredInbox.map((conv) => (
                <ConversationItem
                  key={conv.partnerId}
                  conv={conv}
                  isSelected={String(conv.partnerId) === String(selectedPartnerId)}
                  onClick={() => setSelectedPartnerId(String(conv.partnerId))}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Chat area ── */}
        <main
          className={`${
            showSidebar ? 'hidden' : 'flex'
          } md:flex flex-col flex-1 overflow-hidden`}
        >
          {!selectedPartnerId ? (
            <EmptyChat />
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2d4a] bg-[#0c1427]/80 flex-shrink-0">
                {selectedConv ? (
                  <>
                    <Avatar
                      src={selectedConv.partnerProfilePicture}
                      name={selectedConv.partnerName}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#dee5ff] font-semibold truncate">
                        {selectedConv.partnerName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RoleBadge role={selectedConv.partnerRole} />
                        {selectedConv.partnerCompany && (
                          <span className="text-xs text-[#9baad6] truncate">
                            {selectedConv.partnerCompany}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1a2744] animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-32 h-3 bg-[#1a2744] rounded animate-pulse" />
                      <div className="w-20 h-2 bg-[#1a2744] rounded animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messagesLoading ? (
                  <div className="flex justify-center py-10">
                    <span className="material-symbols-outlined text-3xl text-[#9baad6] animate-spin">
                      progress_activity
                    </span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#9baad6] gap-2">
                    <span className="material-symbols-outlined text-4xl opacity-30">
                      chat_bubble
                    </span>
                    <p className="text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isSent={String(msg.senderId) === String(user?.id)}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="px-4 py-3 border-t border-[#1e2d4a] bg-[#0c1427]/80 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Enter to send)"
                    rows={1}
                    className="flex-1 bg-[#1a2744] border border-[#1e2d4a] rounded-xl px-4 py-2.5 text-sm text-[#dee5ff] placeholder-[#9baad6]/50 focus:outline-none focus:border-blue-500/50 resize-none overflow-hidden leading-relaxed"
                    style={{ minHeight: '42px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!messageInput.trim() || sending}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? (
                      <span className="material-symbols-outlined text-lg animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-lg">send</span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
