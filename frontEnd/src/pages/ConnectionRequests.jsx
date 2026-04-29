import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import connectionService from '../services/connectionService';
import { useAuth } from '../context/AuthContext';

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
  const sizeClass = size === 'sm' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
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

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[#9baad6]">
      <span className="material-symbols-outlined text-5xl mb-3 opacity-40">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#0c1427] border border-[#1e2d4a] rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <p className="text-[#dee5ff] text-sm mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg text-[#9baad6] hover:bg-[#1a2744] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── My Connections Tab ───────────────────────────────────────────────────────

function MyConnectionsTab({ connections, loading, onRemove }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [confirm, setConfirm] = useState(null); // { connectionId, name }

  function getOther(conn) {
    if (!user) return {};
    if (String(conn.requesterId) === String(user.id)) {
      return {
        id: conn.receiverId,
        name: conn.receiverName,
        role: conn.receiverRole,
        picture: conn.receiverProfilePicture,
        college: conn.receiverCollege,
        company: conn.receiverCompany,
      };
    }
    return {
      id: conn.requesterId,
      name: conn.requesterName,
      role: conn.requesterRole,
      picture: conn.requesterProfilePicture,
      college: conn.requesterCollege,
      company: conn.requesterCompany,
    };
  }

  if (loading) return <LoadingSpinner />;
  if (!connections.length)
    return <EmptyState icon="group" message="No connections yet. Start networking!" />;

  return (
    <>
      {confirm && (
        <ConfirmDialog
          message={`Remove ${confirm.name} from your connections?`}
          onConfirm={() => {
            onRemove(confirm.connectionId);
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((conn) => {
          const other = getOther(conn);
          const sub = other.company || other.college || '';
          return (
            <div
              key={conn.id}
              className="bg-[#0c1427]/80 border border-[#1e2d4a] rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <Avatar src={other.picture} name={other.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-[#dee5ff] font-medium text-sm truncate">{other.name}</p>
                  <RoleBadge role={other.role} />
                  {sub && (
                    <p className="text-[#9baad6] text-xs mt-1 truncate">{sub}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() =>
                    navigate('/messages', { state: { partnerId: other.id } })
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  Message
                </button>
                <button
                  onClick={() => setConfirm({ connectionId: conn.id, name: other.name })}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">person_remove</span>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Requests Received Tab ────────────────────────────────────────────────────

function RequestsReceivedTab({ requests, loading, onAccept, onReject }) {
  if (loading) return <LoadingSpinner />;
  if (!requests.length)
    return <EmptyState icon="inbox" message="No pending requests." />;

  return (
    <div className="flex flex-col gap-3">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-[#0c1427]/80 border border-[#1e2d4a] rounded-xl p-4 flex items-center gap-4"
        >
          <Avatar src={req.requesterProfilePicture} name={req.requesterName} />
          <div className="flex-1 min-w-0">
            <p className="text-[#dee5ff] font-medium text-sm truncate">{req.requesterName}</p>
            <RoleBadge role={req.requesterRole} />
            {(req.requesterCompany || req.requesterCollege) && (
              <p className="text-[#9baad6] text-xs mt-1 truncate">
                {req.requesterCompany || req.requesterCollege}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onAccept(req.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
            >
              <span className="material-symbols-outlined text-base">check</span>
              Accept
            </button>
            <button
              onClick={() => onReject(req.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Requests Sent Tab ────────────────────────────────────────────────────────

function RequestsSentTab({ requests, loading, onWithdraw }) {
  if (loading) return <LoadingSpinner />;
  if (!requests.length)
    return <EmptyState icon="send" message="No pending sent requests." />;

  return (
    <div className="flex flex-col gap-3">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-[#0c1427]/80 border border-[#1e2d4a] rounded-xl p-4 flex items-center gap-4"
        >
          <Avatar src={req.receiverProfilePicture} name={req.receiverName} />
          <div className="flex-1 min-w-0">
            <p className="text-[#dee5ff] font-medium text-sm truncate">{req.receiverName}</p>
            <RoleBadge role={req.receiverRole} />
            {(req.receiverCompany || req.receiverCollege) && (
              <p className="text-[#9baad6] text-xs mt-1 truncate">
                {req.receiverCompany || req.receiverCollege}
              </p>
            )}
          </div>
          <button
            onClick={() => onWithdraw(req.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">undo</span>
            Withdraw
          </button>
        </div>
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16">
      <span className="material-symbols-outlined text-4xl text-[#9baad6] animate-spin">
        progress_activity
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = ['My Connections', 'Requests Received', 'Requests Sent'];

export default function ConnectionRequests() {
  const [activeTab, setActiveTab] = useState(0);
  const [connections, setConnections] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState({ connections: true, received: true, sent: true });
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading({ connections: true, received: true, sent: true });
    try {
      const [connRes, recvRes, sentRes] = await Promise.allSettled([
        connectionService.getMyConnections(),
        connectionService.getPendingReceived(),
        connectionService.getPendingSent(),
      ]);
      setConnections(connRes.status === 'fulfilled' ? connRes.value?.data ?? [] : []);
      setReceived(recvRes.status === 'fulfilled' ? recvRes.value?.data ?? [] : []);
      setSent(sentRes.status === 'fulfilled' ? sentRes.value?.data ?? [] : []);
    } catch {
      setError('Failed to load connections.');
    } finally {
      setLoading({ connections: false, received: false, sent: false });
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleAccept(id) {
    try {
      await connectionService.accept(id);
      setReceived((prev) => prev.filter((r) => r.id !== id));
      fetchAll();
    } catch {
      setError('Failed to accept request.');
    }
  }

  async function handleReject(id) {
    try {
      await connectionService.reject(id);
      setReceived((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Failed to reject request.');
    }
  }

  async function handleWithdraw(id) {
    try {
      await connectionService.withdraw(id);
      setSent((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Failed to withdraw request.');
    }
  }

  async function handleRemove(connectionId) {
    try {
      await connectionService.remove(connectionId);
      setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    } catch {
      setError('Failed to remove connection.');
    }
  }

  const counts = [connections.length, received.length, sent.length];

  return (
    <div className="min-h-screen bg-[#060e1d] text-[#dee5ff]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#dee5ff] mb-6">Connections</h1>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto material-symbols-outlined text-base hover:text-red-200"
            >
              close
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0c1427]/80 border border-[#1e2d4a] rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === i
                  ? 'bg-blue-600/30 text-blue-300'
                  : 'text-[#9baad6] hover:text-[#dee5ff] hover:bg-[#1a2744]'
              }`}
            >
              {tab}
              {counts[i] > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === i
                      ? 'bg-blue-500/30 text-blue-200'
                      : 'bg-[#1a2744] text-[#9baad6]'
                  }`}
                >
                  {counts[i]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 0 && (
          <MyConnectionsTab
            connections={connections}
            loading={loading.connections}
            onRemove={handleRemove}
          />
        )}
        {activeTab === 1 && (
          <RequestsReceivedTab
            requests={received}
            loading={loading.received}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
        {activeTab === 2 && (
          <RequestsSentTab
            requests={sent}
            loading={loading.sent}
            onWithdraw={handleWithdraw}
          />
        )}
      </div>
    </div>
  );
}
