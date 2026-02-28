import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "chats" | "calls" | "contacts" | "search" | "profile" | "settings";

interface Message {
  id: number;
  text: string;
  time: string;
  out: boolean;
  read: boolean;
  voice?: boolean;
  duration?: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
  color: string;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  color: string;
  phone: string;
}

interface Call {
  id: number;
  name: string;
  avatar: string;
  color: string;
  time: string;
  type: "incoming" | "outgoing" | "missed";
  video: boolean;
  duration?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CHATS: Chat[] = [
  { id: 1, name: "Алексей Громов", avatar: "АГ", lastMsg: "Скинь конспект по физике 🙏", time: "сейчас", unread: 3, online: true, typing: true, color: "#4f8ef7" },
  { id: 2, name: "Класс 11-Б", avatar: "11", lastMsg: "Кто идёт на олимпиаду?", time: "2 мин", unread: 12, online: true, color: "#8b5cf6" },
  { id: 3, name: "Марина Ветрова", avatar: "МВ", lastMsg: "Ок, договорились! 👌", time: "15 мин", unread: 0, online: true, color: "#ec4899" },
  { id: 4, name: "Дима Козлов", avatar: "ДК", lastMsg: "Голосовое · 0:42", time: "1 час", unread: 1, online: false, color: "#06b6d4" },
  { id: 5, name: "Учительская", avatar: "УЧ", lastMsg: "Завтра контрольная отменяется", time: "2 часа", unread: 0, online: false, color: "#10b981" },
  { id: 6, name: "Соня Белова", avatar: "СБ", lastMsg: "Ты видела новые стикеры? 😍", time: "вчера", unread: 0, online: false, color: "#f59e0b" },
  { id: 7, name: "Спортзал ⚽", avatar: "СЗ", lastMsg: "Тренировка в 18:00!", time: "вчера", unread: 5, online: true, color: "#ef4444" },
];

const MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Привет! Как дела?", time: "13:10", out: false, read: true },
    { id: 2, text: "Отлично, спасибо! Готовлюсь к завтрашнему экзамену", time: "13:12", out: true, read: true },
    { id: 3, text: "О, и я тоже! Скинь конспект по физике 🙏", time: "13:15", out: false, read: true },
    { id: 4, text: "", time: "13:16", out: true, read: true, voice: true, duration: "0:18" },
    { id: 5, text: "Скинь конспект по физике 🙏", time: "только что", out: false, read: false },
  ],
  2: [
    { id: 1, text: "Всем привет! Кто идёт на олимпиаду по математике?", time: "14:00", out: false, read: true },
    { id: 2, text: "Я иду!", time: "14:01", out: true, read: true },
    { id: 3, text: "И я тоже буду!", time: "14:02", out: false, read: true },
    { id: 4, text: "Кто идёт на олимпиаду?", time: "14:05", out: false, read: false },
  ],
};

const CONTACTS: Contact[] = [
  { id: 1, name: "Алексей Громов", avatar: "АГ", status: "Слушает музыку 🎵", online: true, color: "#4f8ef7", phone: "+7 900 123-45-67" },
  { id: 2, name: "Дима Козлов", avatar: "ДК", status: "Был 1 час назад", online: false, color: "#06b6d4", phone: "+7 900 234-56-78" },
  { id: 3, name: "Марина Ветрова", avatar: "МВ", status: "В сети", online: true, color: "#ec4899", phone: "+7 900 345-67-89" },
  { id: 4, name: "Соня Белова", avatar: "СБ", status: "Учится 📚", online: true, color: "#f59e0b", phone: "+7 900 456-78-90" },
  { id: 5, name: "Петя Иванов", avatar: "ПИ", status: "Был вчера", online: false, color: "#10b981", phone: "+7 900 567-89-01" },
  { id: 6, name: "Катя Смирнова", avatar: "КС", status: "В сети", online: true, color: "#8b5cf6", phone: "+7 900 678-90-12" },
];

const CALLS: Call[] = [
  { id: 1, name: "Алексей Громов", avatar: "АГ", color: "#4f8ef7", time: "сегодня, 13:20", type: "incoming", video: false, duration: "12:34" },
  { id: 2, name: "Марина Ветрова", avatar: "МВ", color: "#ec4899", time: "сегодня, 11:05", type: "outgoing", video: true, duration: "5:21" },
  { id: 3, name: "Класс 11-Б", avatar: "11", color: "#8b5cf6", time: "вчера, 19:30", type: "missed", video: false },
  { id: 4, name: "Дима Козлов", avatar: "ДК", color: "#06b6d4", time: "вчера, 15:00", type: "incoming", video: true, duration: "1:02:10" },
  { id: 5, name: "Соня Белова", avatar: "СБ", color: "#f59e0b", time: "2 дня назад", type: "outgoing", video: false, duration: "23:45" },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = "md", online }: { initials: string; color: string; size?: "sm" | "md" | "lg" | "xl"; online?: boolean }) {
  const sizes: Record<string, string> = { sm: "w-9 h-9 text-xs", md: "w-11 h-11 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-2xl" };
  const dots: Record<string, string> = { sm: "w-2.5 h-2.5", md: "w-3 h-3", lg: "w-3.5 h-3.5", xl: "w-4 h-4" };
  const dotPos: Record<string, { bottom: string; right: string }> = {
    sm: { bottom: "-1px", right: "-1px" },
    md: { bottom: "-1px", right: "-1px" },
    lg: { bottom: "0px", right: "0px" },
    xl: { bottom: "4px", right: "4px" },
  };
  return (
    <div className={`relative flex-shrink-0 ${sizes[size]} rounded-full flex items-center justify-center font-bold text-white font-rubik`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, boxShadow: `0 4px 12px ${color}40` }}>
      {initials}
      {online !== undefined && (
        <span className={`absolute ${dots[size]} rounded-full border-2 border-[hsl(222,28%,7%)] ${online ? "bg-green-400 pulse-online" : "bg-gray-600"}`}
          style={{ bottom: dotPos[size].bottom, right: dotPos[size].right }} />
      )}
    </div>
  );
}

// ─── Background orbs ──────────────────────────────────────────────────────────
function BgOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #4f8ef7, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)", filter: "blur(80px)" }} />
    </div>
  );
}

// ─── Chats Tab ────────────────────────────────────────────────────────────────
function ChatsTab() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Record<number, Message[]>>(MESSAGES);
  const [recording, setRecording] = useState(false);

  const chatMsgs = activeChat ? (messages[activeChat.id] || []) : [];

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;
    const newMsg: Message = { id: Date.now(), text: input, time: "сейчас", out: true, read: false };
    setMessages(prev => ({ ...prev, [activeChat.id]: [...(prev[activeChat.id] || []), newMsg] }));
    setInput("");
  };

  if (activeChat) {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex items-center gap-3 px-4 py-3 glass border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <button onClick={() => setActiveChat(null)} className="p-2 rounded-xl glass-hover text-white/60 hover:text-white">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <Avatar initials={activeChat.avatar} color={activeChat.color} size="sm" online={activeChat.online} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-white font-rubik">{activeChat.name}</p>
            <p className="text-xs" style={{ color: activeChat.online ? "#10b981" : "rgba(255,255,255,0.4)" }}>
              {activeChat.typing ? "печатает..." : activeChat.online ? "в сети" : "был(а) недавно"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {(["Phone", "Video", "MoreVertical"] as const).map(ic => (
              <button key={ic} className="p-2 rounded-xl glass-hover text-white/60 hover:text-white">
                <Icon name={ic} size={18} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
          {chatMsgs.map((msg, i) => (
            <div key={msg.id} className="flex flex-col animate-fade-in" style={{ alignItems: msg.out ? "flex-end" : "flex-start", animationDelay: `${i * 0.04}s` }}>
              <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl ${msg.out ? "msg-bubble-out rounded-br-sm" : "msg-bubble-in rounded-bl-sm"}`}>
                {msg.voice ? (
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                      <Icon name="Play" size={14} className="text-white" />
                    </button>
                    <div className="flex-1 flex items-center gap-0.5 h-5">
                      {Array.from({ length: 20 }).map((_, j) => (
                        <div key={j} className="flex-1 rounded-full bg-white/40" style={{ height: `${(Math.sin(j) * 0.5 + 0.5) * 14 + 4}px` }} />
                      ))}
                    </div>
                    <span className="text-xs text-white/70">{msg.duration}</span>
                  </div>
                ) : (
                  <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5 px-1">
                <span className="text-[11px] text-white/30">{msg.time}</span>
                {msg.out && <Icon name={msg.read ? "CheckCheck" : "Check"} size={12} className={msg.read ? "text-blue-400" : "text-white/30"} />}
              </div>
            </div>
          ))}
          {activeChat.typing && (
            <div className="flex items-start">
              <div className="msg-bubble-in px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50"
                      style={{ animation: `bounceTyping 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {["😂", "❤️", "🔥", "👍", "😍", "🎉", "😭", "💯", "🙏", "✨"].map(s => (
            <button key={s} className="text-xl flex-shrink-0 glass rounded-xl px-3 py-1.5 glass-hover">{s}</button>
          ))}
        </div>

        <div className="px-4 py-3 flex items-end gap-2 glass border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <button className="p-2.5 rounded-xl glass-hover text-white/60 hover:text-white">
            <Icon name="Paperclip" size={20} />
          </button>
          <button className="p-2.5 rounded-xl glass-hover text-white/60 hover:text-white">
            <Icon name="Image" size={20} />
          </button>
          <div className="flex-1 glass rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <input
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none font-golos"
              placeholder="Написать сообщение..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button className="text-lg">😊</button>
          </div>
          {input ? (
            <button onClick={sendMessage} className="p-2.5 rounded-xl grad-bg text-white" style={{ boxShadow: "0 4px 16px rgba(79,142,247,0.4)" }}>
              <Icon name="Send" size={20} />
            </button>
          ) : (
            <button
              onMouseDown={() => setRecording(true)}
              onMouseUp={() => setRecording(false)}
              className={`p-2.5 rounded-xl transition-all text-white ${recording ? "grad-bg scale-110" : "glass-hover text-white/60"}`}
            >
              <Icon name="Mic" size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold font-rubik grad-text mb-3">Чаты</h1>
        <div className="glass rounded-2xl flex items-center gap-2 px-4 py-2.5">
          <Icon name="Search" size={18} className="text-white/40" />
          <input className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none font-golos" placeholder="Поиск..." />
        </div>
      </div>

      <div className="px-4 pb-3 flex gap-3 overflow-x-auto">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-14 h-14 rounded-full grad-bg flex items-center justify-center cursor-pointer">
            <Icon name="Plus" size={22} className="text-white" />
          </div>
          <span className="text-[10px] text-white/40">Моя история</span>
        </div>
        {CONTACTS.slice(0, 5).map(c => (
          <div key={c.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
            <div className="p-0.5 rounded-full" style={{ background: "linear-gradient(135deg, #4f8ef7, #8b5cf6, #ec4899)" }}>
              <div className="p-0.5 rounded-full" style={{ background: "hsl(222,28%,7%)" }}>
                <Avatar initials={c.avatar} color={c.color} size="sm" />
              </div>
            </div>
            <span className="text-[10px] text-white/40 w-14 text-center truncate">{c.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {CHATS.map((chat, i) => (
          <div key={chat.id} onClick={() => setActiveChat(chat)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer glass-hover border-b animate-fade-in"
            style={{ borderColor: "rgba(255,255,255,0.03)", animationDelay: `${i * 0.05}s` }}>
            <Avatar initials={chat.avatar} color={chat.color} online={chat.online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-semibold text-sm text-white font-rubik truncate">{chat.name}</p>
                <span className={`text-[11px] flex-shrink-0 ml-2 ${chat.unread ? "text-blue-400" : "text-white/30"}`}>{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-xs truncate ${chat.typing ? "text-blue-400 italic" : "text-white/40"}`}>
                  {chat.typing ? "печатает..." : chat.lastMsg}
                </p>
                {chat.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 text-[11px] font-bold text-white grad-bg rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Calls Tab ────────────────────────────────────────────────────────────────
function CallsTab() {
  const [activeCall, setActiveCall] = useState(false);
  const [callContact, setCallContact] = useState<Call | null>(null);

  if (activeCall && callContact) {
    return (
      <div className="flex flex-col h-full items-center justify-between py-12 animate-scale-in"
        style={{ background: "linear-gradient(180deg, rgba(79,142,247,0.2) 0%, rgba(139,92,246,0.15) 50%, rgba(236,72,153,0.1) 100%)" }}>
        <div className="text-center">
          <p className="text-white/50 text-sm mb-6 font-rubik">Видеозвонок</p>
          <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-3xl text-white animate-float font-rubik"
            style={{ background: `linear-gradient(135deg, ${callContact.color}, ${callContact.color}80)`, boxShadow: `0 0 50px ${callContact.color}50` }}>
            {callContact.avatar}
          </div>
          <h2 className="text-2xl font-bold text-white font-rubik">{callContact.name}</h2>
          <p className="text-green-400 text-sm mt-1">02:34</p>
        </div>
        <div className="flex gap-6">
          {[
            { icon: "MicOff" as const, label: "Микрофон", bg: "rgba(255,255,255,0.1)" },
            { icon: "VideoOff" as const, label: "Камера", bg: "rgba(255,255,255,0.1)" },
            { icon: "Volume2" as const, label: "Звук", bg: "rgba(255,255,255,0.1)" },
            { icon: "PhoneOff" as const, label: "Завершить", bg: "#ef4444" },
          ].map(btn => (
            <div key={btn.icon} className="flex flex-col items-center gap-2">
              <button onClick={() => { if (btn.icon === "PhoneOff") setActiveCall(false); }}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: btn.bg, boxShadow: btn.bg === "#ef4444" ? "0 4px 20px rgba(239,68,68,0.5)" : undefined }}>
                <Icon name={btn.icon} size={22} className="text-white" />
              </button>
              <span className="text-xs text-white/50 font-rubik">{btn.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-rubik grad-text">Звонки</h1>
        <button className="p-2 rounded-xl glass glass-hover">
          <Icon name="PhoneCall" size={20} className="text-white/70" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {CALLS.map((call, i) => (
          <div key={call.id} className="flex items-center gap-3 px-4 py-3 border-b animate-fade-in"
            style={{ borderColor: "rgba(255,255,255,0.03)", animationDelay: `${i * 0.05}s` }}>
            <Avatar initials={call.avatar} color={call.color} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white font-rubik">{call.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon
                  name={call.type === "missed" ? "PhoneMissed" : call.type === "incoming" ? "PhoneIncoming" : "PhoneOutgoing"}
                  size={13}
                  className={call.type === "missed" ? "text-red-400" : "text-green-400"}
                />
                <span className="text-xs text-white/40">{call.time}</span>
                {call.duration && <span className="text-xs text-white/25">· {call.duration}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              {call.video && (
                <button onClick={() => { setCallContact(call); setActiveCall(true); }}
                  className="p-2 rounded-xl glass glass-hover text-blue-400">
                  <Icon name="Video" size={18} />
                </button>
              )}
              <button onClick={() => { setCallContact(call); setActiveCall(true); }}
                className="p-2 rounded-xl glass glass-hover text-green-400">
                <Icon name="Phone" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────────
function ContactsTab() {
  const [selected, setSelected] = useState<Contact | null>(null);

  if (selected) {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex items-center gap-3 px-4 py-3 glass border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <button onClick={() => setSelected(null)} className="p-2 rounded-xl glass-hover text-white/60 hover:text-white">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <p className="font-semibold text-white font-rubik">Профиль контакта</p>
        </div>
        <div className="flex flex-col items-center py-8 px-6">
          <Avatar initials={selected.avatar} color={selected.color} size="xl" online={selected.online} />
          <h2 className="mt-4 text-2xl font-bold text-white font-rubik">{selected.name}</h2>
          <p className="text-sm mt-1" style={{ color: selected.online ? "#10b981" : "rgba(255,255,255,0.4)" }}>{selected.status}</p>
          <p className="text-sm text-white/30 mt-1">{selected.phone}</p>
          <div className="flex gap-4 mt-6">
            {[
              { icon: "MessageCircle" as const, label: "Написать", color: "#4f8ef7" },
              { icon: "Phone" as const, label: "Позвонить", color: "#10b981" },
              { icon: "Video" as const, label: "Видео", color: "#8b5cf6" },
            ].map(btn => (
              <div key={btn.icon} className="flex flex-col items-center gap-2">
                <button className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${btn.color}25`, border: `1px solid ${btn.color}40` }}>
                  <Icon name={btn.icon} size={22} style={{ color: btn.color }} />
                </button>
                <span className="text-xs text-white/50 font-rubik">{btn.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 space-y-2">
          {["Добавить в группу", "Поделиться контактом", "Заблокировать"].map(action => (
            <button key={action} className="w-full glass glass-hover rounded-2xl py-3 px-4 text-left text-sm text-white/70 hover:text-white">
              {action}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const online = CONTACTS.filter(c => c.online);
  const offline = CONTACTS.filter(c => !c.online);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold font-rubik grad-text">Контакты</h1>
        <button className="p-2 rounded-xl glass glass-hover">
          <Icon name="UserPlus" size={20} className="text-white/70" />
        </button>
      </div>
      <div className="px-4 mb-3">
        <div className="glass rounded-2xl flex items-center gap-2 px-4 py-2.5">
          <Icon name="Search" size={18} className="text-white/40" />
          <input className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none font-golos" placeholder="Найти контакт..." />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <p className="text-xs text-white/30 uppercase tracking-widest font-rubik">В сети — {online.length}</p>
        </div>
        {online.map((c, i) => (
          <div key={c.id} onClick={() => setSelected(c)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer glass-hover border-b animate-fade-in"
            style={{ borderColor: "rgba(255,255,255,0.03)", animationDelay: `${i * 0.05}s` }}>
            <Avatar initials={c.avatar} color={c.color} online />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white font-rubik">{c.name}</p>
              <p className="text-xs text-green-400/80">{c.status}</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-white/20" />
          </div>
        ))}
        <div className="px-4 py-2 mt-1">
          <p className="text-xs text-white/30 uppercase tracking-widest font-rubik">Не в сети — {offline.length}</p>
        </div>
        {offline.map((c, i) => (
          <div key={c.id} onClick={() => setSelected(c)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer glass-hover border-b animate-fade-in"
            style={{ borderColor: "rgba(255,255,255,0.03)", animationDelay: `${i * 0.05}s` }}>
            <Avatar initials={c.avatar} color={c.color} online={false} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white font-rubik">{c.name}</p>
              <p className="text-xs text-white/30">{c.status}</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-white/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Search Tab ───────────────────────────────────────────────────────────────
function SearchTab() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Все");
  const filters = ["Все", "Чаты", "Контакты", "Медиа", "Файлы"];

  const filteredChats = CHATS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  const filteredContacts = CONTACTS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold font-rubik grad-text mb-3">Поиск</h1>
        <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
          <Icon name="Search" size={18} className="text-white/40" />
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none font-golos"
            placeholder="Поиск по сообщениям, людям..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <Icon name="X" size={16} className="text-white/40" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 flex gap-2 pb-3 overflow-x-auto">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 text-xs px-4 py-1.5 rounded-full transition-all font-rubik ${activeFilter === f ? "grad-bg text-white font-semibold" : "glass text-white/50 hover:text-white"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {!query ? (
          <div className="flex flex-col items-center justify-center h-full pb-20">
            <div className="w-20 h-20 rounded-3xl grad-soft-bg flex items-center justify-center mb-4">
              <Icon name="Search" size={32} className="text-white/30" />
            </div>
            <p className="text-white/40 text-sm text-center font-rubik">Введите запрос, чтобы<br />найти сообщения и людей</p>
          </div>
        ) : (
          <>
            {filteredContacts.length > 0 && (
              <>
                <p className="text-xs text-white/30 uppercase tracking-widest font-rubik py-2">Контакты</p>
                {filteredContacts.map(c => (
                  <div key={c.id} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                    <Avatar initials={c.avatar} color={c.color} online={c.online} />
                    <div>
                      <p className="font-semibold text-sm text-white font-rubik">{c.name}</p>
                      <p className="text-xs text-white/40">{c.status}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {filteredChats.length > 0 && (
              <>
                <p className="text-xs text-white/30 uppercase tracking-widest font-rubik py-2 mt-2">Чаты</p>
                {filteredChats.map(c => (
                  <div key={c.id} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                    <Avatar initials={c.avatar} color={c.color} online={c.online} />
                    <div>
                      <p className="font-semibold text-sm text-white font-rubik">{c.name}</p>
                      <p className="text-xs text-white/40 truncate">{c.lastMsg}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {filteredContacts.length === 0 && filteredChats.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-white/30 text-sm font-rubik">Ничего не найдено</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const statuses = ["В сети", "Не беспокоить 🔕", "Учусь 📚", "Занят 🔴", "Нет дома 🏃"];
  const [status, setStatus] = useState(0);

  return (
    <div className="flex flex-col h-full animate-fade-in overflow-y-auto">
      <div className="relative px-4 pt-8 pb-6 flex flex-col items-center"
        style={{ background: "linear-gradient(180deg, rgba(79,142,247,0.2) 0%, transparent 100%)" }}>
        <div className="relative">
          <div className="w-24 h-24 rounded-full grad-bg flex items-center justify-center text-3xl font-bold text-white font-rubik"
            style={{ boxShadow: "0 0 40px rgba(79,142,247,0.5)" }}>
            ВИ
          </div>
          <button className="absolute w-8 h-8 grad-bg rounded-full flex items-center justify-center border-2 border-[hsl(222,28%,7%)]"
            style={{ bottom: 0, right: 0 }}>
            <Icon name="Camera" size={14} className="text-white" />
          </button>
          <span className="absolute w-4 h-4 bg-green-400 rounded-full border-2 border-[hsl(222,28%,7%)] pulse-online"
            style={{ bottom: "2px", right: "28px" }} />
        </div>
        <h2 className="text-2xl font-bold text-white mt-3 font-rubik">Виктор Иванов</h2>
        <p className="text-sm text-white/40 mt-0.5">@viktor_ivanov</p>
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {statuses.map((s, i) => (
            <button key={s} onClick={() => setStatus(i)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all ${status === i ? "grad-bg text-white font-medium" : "glass text-white/50 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex px-4 gap-3 mb-4">
        {[{ label: "Чатов", value: "24" }, { label: "Друзей", value: "156" }, { label: "Стикеров", value: "89" }].map(stat => (
          <div key={stat.label} className="flex-1 glass rounded-2xl py-3 text-center">
            <p className="text-xl font-bold font-rubik grad-text">{stat.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-2">
        <p className="text-xs text-white/30 uppercase tracking-widest font-rubik px-1 mb-2">Информация</p>
        {[
          { icon: "Phone" as const, label: "Телефон", value: "+7 900 123-45-67" },
          { icon: "Mail" as const, label: "Email", value: "viktor@school.ru" },
          { icon: "MapPin" as const, label: "Город", value: "Москва" },
          { icon: "Calendar" as const, label: "Дата рождения", value: "15 марта 2008" },
        ].map(item => (
          <div key={item.label} className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grad-soft-bg flex items-center justify-center">
              <Icon name={item.icon} size={16} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/30">{item.label}</p>
              <p className="text-sm text-white">{item.value}</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-white/20" />
          </div>
        ))}
      </div>

      <div className="px-4 mt-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-white/30 uppercase tracking-widest font-rubik">Медиа</p>
          <button className="text-xs text-blue-400 font-rubik">Все</button>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${["#4f8ef7","#8b5cf6","#ec4899","#06b6d4"][i % 4]}30, ${["#8b5cf6","#ec4899","#4f8ef7","#10b981"][i % 4]}30)`, border: "1px solid rgba(255,255,255,0.06)" }}>
              <Icon name={i % 3 === 0 ? "FileImage" : i % 3 === 1 ? "Video" : "Music"} size={20} className="text-white/25" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  type SettingItem = { icon: string; label: string; desc?: string; toggle?: boolean; onToggle?: () => void; danger?: boolean };
  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Аккаунт",
      items: [
        { icon: "User", label: "Личные данные", desc: "Имя, фото, username" },
        { icon: "Lock", label: "Конфиденциальность", desc: "Кто видит мой профиль" },
        { icon: "Shield", label: "Безопасность", desc: "Пароль, 2FA" },
      ]
    },
    {
      title: "Уведомления",
      items: [
        { icon: "Bell", label: "Push-уведомления", toggle: notifications, onToggle: () => setNotifications(!notifications) },
        { icon: "Volume2", label: "Звуки", toggle: soundEffects, onToggle: () => setSoundEffects(!soundEffects) },
      ]
    },
    {
      title: "Внешний вид",
      items: [
        { icon: "Moon", label: "Тёмная тема", toggle: darkMode, onToggle: () => setDarkMode(!darkMode) },
        { icon: "Palette", label: "Цветовая схема", desc: "Синий градиент" },
        { icon: "Type", label: "Размер шрифта", desc: "Средний" },
      ]
    },
    {
      title: "О приложении",
      items: [
        { icon: "Info", label: "О School", desc: "Версия 1.0.0" },
        { icon: "HelpCircle", label: "Помощь", desc: "FAQ и поддержка" },
        { icon: "LogOut", label: "Выйти", danger: true },
      ]
    },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in overflow-y-auto">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold font-rubik grad-text">Настройки</h1>
      </div>

      <div className="mx-4 mb-4 glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer glass-hover">
        <div className="w-14 h-14 rounded-full grad-bg flex items-center justify-center text-xl font-bold text-white font-rubik">ВИ</div>
        <div className="flex-1">
          <p className="font-bold text-white font-rubik">Виктор Иванов</p>
          <p className="text-sm text-white/40">@viktor_ivanov · В сети</p>
        </div>
        <Icon name="ChevronRight" size={18} className="text-white/30" />
      </div>

      <div className="px-4 space-y-4 pb-6">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs text-white/30 uppercase tracking-widest font-rubik px-1 mb-2">{section.title}</p>
            <div className="glass rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <div key={item.label} className={`flex items-center gap-3 px-4 py-3 glass-hover cursor-pointer ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.danger ? "bg-red-500/15" : "grad-soft-bg"}`}>
                    <Icon name={item.icon} size={16} className={item.danger ? "text-red-400" : "text-blue-400"} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.danger ? "text-red-400" : "text-white"}`}>{item.label}</p>
                    {item.desc && <p className="text-xs text-white/30">{item.desc}</p>}
                  </div>
                  {item.toggle !== undefined ? (
                    <button onClick={item.onToggle}
                      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                      style={{ background: item.toggle ? "var(--grad-main)" : "rgba(255,255,255,0.1)" }}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                        style={{ left: item.toggle ? "calc(100% - 22px)" : "2px" }} />
                    </button>
                  ) : !item.danger && (
                    <Icon name="ChevronRight" size={16} className="text-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");

  const navItems: { id: Tab; icon: string; label: string; badge?: number }[] = [
    { id: "chats", icon: "MessageCircle", label: "Чаты", badge: 16 },
    { id: "calls", icon: "Phone", label: "Звонки" },
    { id: "contacts", icon: "Users", label: "Контакты" },
    { id: "search", icon: "Search", label: "Поиск" },
    { id: "profile", icon: "User", label: "Профиль" },
    { id: "settings", icon: "Settings", label: "Настройки" },
  ];

  const renderTab = () => {
    switch (tab) {
      case "chats": return <ChatsTab />;
      case "calls": return <CallsTab />;
      case "contacts": return <ContactsTab />;
      case "search": return <SearchTab />;
      case "profile": return <ProfileTab />;
      case "settings": return <SettingsTab />;
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen font-golos"
      style={{ background: "hsl(222, 28%, 5%)" }}>
      <BgOrbs />

      <div className="relative z-10 flex items-start" style={{ height: "min(780px, 100vh)" }}>
        {/* Sidebar — desktop */}
        <div className="hidden sm:flex flex-col glass rounded-3xl mr-3 px-2 py-4 gap-1 w-[76px] h-full border"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex flex-col items-center mb-4">
            <div className="w-10 h-10 rounded-xl grad-bg flex items-center justify-center" style={{ boxShadow: "0 4px 16px rgba(79,142,247,0.4)" }}>
              <span className="text-white font-bold text-base font-rubik">S</span>
            </div>
          </div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className="relative flex flex-col items-center gap-1 py-2.5 px-1 rounded-2xl w-full transition-all"
              style={tab === item.id ? {
                background: "linear-gradient(135deg, rgba(79,142,247,0.22), rgba(139,92,246,0.22))",
                border: "1px solid rgba(139,92,246,0.28)",
                color: "white",
              } : { color: "rgba(255,255,255,0.3)", border: "1px solid transparent" }}>
              <Icon name={item.icon} size={20} />
              <span className="text-[10px] font-medium font-rubik leading-tight">{item.label}</span>
              {item.badge && tab !== item.id && (
                <span className="absolute top-0.5 right-0.5 text-[9px] font-bold grad-bg text-white rounded-full px-1 min-w-[15px] text-center leading-4">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Phone */}
        <div className="glass rounded-3xl overflow-hidden border flex flex-col h-full"
          style={{ width: "min(380px, 100vw)", borderColor: "rgba(255,255,255,0.07)" }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-2 flex-shrink-0">
            <span className="text-xs text-white/30 font-rubik">9:41</span>
            <div className="w-16 h-4 rounded-full" style={{ background: "rgba(0,0,0,0.4)" }} />
            <div className="flex items-center gap-1.5">
              <Icon name="Wifi" size={11} className="text-white/30" />
              <Icon name="Battery" size={11} className="text-white/30" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {renderTab()}
          </div>

          {/* Bottom nav */}
          <div className="flex items-center glass border-t px-1 py-1 flex-shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl relative transition-all"
                style={{ color: tab === item.id ? "white" : "rgba(255,255,255,0.28)" }}>
                {tab === item.id && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full grad-bg" />
                )}
                <Icon name={item.icon} size={tab === item.id ? 21 : 19} />
                <span className="text-[9px] font-medium font-rubik">{item.label}</span>
                {item.badge && tab !== item.id && (
                  <span className="absolute top-0 right-0.5 text-[9px] font-bold grad-bg text-white rounded-full px-1 min-w-[14px] text-center leading-4">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounceTyping {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}