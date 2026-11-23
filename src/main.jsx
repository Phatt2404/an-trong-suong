import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RotateCcw, Check, X, LogOut } from 'lucide-react';
import './styles.css';

const CHARACTERS = [
  { id: 'mac', name: 'Mạc', image: '/assets/characters/mac.png' },
  { id: 'ba-vinh', name: 'Bà Vĩnh', image: '/assets/characters/ba-vinh.png' },
  { id: 'ba-chuc', name: 'Bà Chúc', image: '/assets/characters/ba-chuc.png' },
  { id: 'bang-tam', name: 'Băng Tâm', image: '/assets/characters/bang-tam.png' },
  { id: 'nhan', name: 'Nhạn', image: '/assets/characters/nhan.png' },
  { id: 'ong-thuong', name: 'Ông Thương', image: '/assets/characters/ong-thuong.png' },
];

function shuffleArray(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getNewOrder(excludedIds = []) {
  const available = CHARACTERS.filter(item => !excludedIds.includes(item.id));
  const orderKey = excludedIds.length ? 'ats-last-retry-order' : 'ats-last-entry-order';
  let previous = null;
  try { previous = localStorage.getItem(orderKey); } catch { /* storage may be unavailable */ }
  let order = shuffleArray(available);
  if (order.length > 1 && previous) {
    try {
      const previousIds = JSON.parse(previous);
      let attempts = 0;
      while (attempts < 40 && order.map(x => x.id).join('|') === previousIds.join('|')) {
        order = shuffleArray(available);
        attempts++;
      }
    } catch { /* ignore stale storage */ }
  }
  try { localStorage.setItem(orderKey, JSON.stringify(order.map(x => x.id))); } catch { /* session still works without storage */ }
  return order;
}


function App() {
  const [excluded, setExcluded] = useState([]);
  const [cards, setCards] = useState(() => getNewOrder());
  const [selected, setSelected] = useState(null);
  const [screen, setScreen] = useState('selection');
  const [flipping, setFlipping] = useState(false);
  const flipTimer = useRef(null);
  const remainingCount = CHARACTERS.length - excluded.length;


  useEffect(() => () => window.clearTimeout(flipTimer.current), []);

  const chooseCharacter = character => {
    if (selected || flipping) return;
    setSelected(character);
    setFlipping(true);
    // Let the full card reveal finish before moving to the private dossier.
    flipTimer.current = window.setTimeout(() => {
      setFlipping(false);
      setScreen('owner');
    }, 1180);
  };

  const startRetry = () => {
    if (!selected) return;
    const nextExcluded = [...excluded, selected.id];
    setExcluded(nextExcluded);
    setSelected(null);
    if (nextExcluded.length >= CHARACTERS.length) {
      setCards([]);
      setScreen('empty');
      return;
    }
    setCards(getNewOrder(nextExcluded));
    setScreen('selection');
  };

  const exitApp = () => {
    if (!window.confirm('Thoát khỏi Án Trong Sương?')) return;
    try {
      window.close();
      if (!window.closed) window.alert('Trình duyệt không cho tự đóng tab này. Bạn có thể đóng tab thủ công.');
    } catch {
      window.alert('Bạn có thể đóng tab trình duyệt để thoát khỏi trò chơi.');
    }
  };

  const resetGame = () => {
    window.clearTimeout(flipTimer.current);
    setExcluded([]);
    setSelected(null);
    setFlipping(false);
    setCards(getNewOrder());
    setScreen('selection');
  };

  return (
    <main className={`app-shell screen-${screen}`}>
      <div className="paper-texture" aria-hidden="true" />
      <header className="topbar">
        <div className="topbar-inner">
          <button className="exit-button" type="button" onClick={exitApp} aria-label="Thoát khỏi trò chơi" title="Thoát">
            <LogOut size={18} strokeWidth={1.7} />
          </button>
          <img className="header-logo" src="/assets/brand/logo-gold.png" alt="Án Trong Sương" />
          <span className="header-spacer" aria-hidden="true" />
        </div>
      </header>


      {screen === 'selection' && <section className="selection-screen" aria-labelledby="selection-title">
        <div className="section-heading">
          <h1 id="selection-title">Chọn một lá bài</h1>
          <p className="heading-copy">Mỗi lá bài ẩn giấu một thân phận. Hãy chọn thật cẩn trọng.</p>
        </div>

        <div className={`card-table ${selected ? 'has-selection' : ''}`}>
          {cards.map((character, index) => <button type="button" key={character.id}
            className={`card-slot slot-${index} ${selected?.id === character.id ? 'chosen-slot' : selected ? 'not-chosen' : ''}`}
            onClick={() => chooseCharacter(character)} disabled={!!selected || flipping}
            aria-label={`Chọn lá bài ${index + 1}`}>
            <span className={`card-rotator ${selected?.id === character.id && flipping ? 'is-flipping-card' : ''}`}>
              <span className="card-face card-face-back"><img src="/assets/cards/card-back.png" alt="Mặt sau thẻ Án Trong Sương" /></span>
              <span className="card-face card-face-front"><img src={character.image} alt={`Thẻ nhân vật ${character.name}`} /></span>
            </span>
          </button>)}
        </div>
        <div className="selection-status">
          {remainingCount === 6 ? 'Chọn một lá bài để mở hồ sơ' : `Còn ${remainingCount} lá bài chưa được kiểm tra`}
        </div>
        {excluded.length > 0 && <button className="restart-link" type="button" onClick={resetGame}><RotateCcw size={14} /> Bắt đầu lượt điều tra mới</button>}
      </section>}


      {screen === 'owner' && selected && <section className="workflow-screen">
        <div className="workflow-heading">
          <p className="eyebrow">Hồ sơ nhân vật đã mở</p>
          <div className="ornament-divider reveal-divider" aria-hidden="true"><img src="/assets/brand/dragonfly-border.png" alt="" /></div>
          <h1>Thân phận được hé lộ</h1>
        </div>
        <div className="owner-layout">
          <div className="selected-character-card"><img src={selected.image} alt={`Thẻ nhân vật ${selected.name}`} /></div>
          <div className="owner-panel">
            <span className="panel-kicker">Nhân vật được chọn</span>
            <h2>{selected.name}</h2>
            <div className="instruction-card">
              <p>Nếu lá bài nhân vật này thuộc về một người chơi khác, hãy để người đó xòe hai lá <b>Địa điểm</b> và <b>Hung khí</b>, rồi cho bạn xem <b>một trong hai lá</b>.</p>
              <p>Nếu lá bài thuộc về bạn hoặc không có ai sở hữu, hãy chọn lại để mở một nhân vật khác.</p>
            </div>
            <div className="action-row">
              <button className="secondary-button" onClick={startRetry}><RotateCcw size={16} /> Chọn lại</button>
              <button className="primary-button" onClick={() => setScreen('finished')}><Check size={16} /> Kết thúc</button>
            </div>
          </div>
        </div>
        <p className="remaining-note">Còn {remainingCount - 1} lá nhân vật có thể chọn nếu cần thử lại</p>
      </section>}


      {screen === 'finished' && <section className="end-screen">
        <p className="eyebrow">Lượt điều tra đã hoàn tất</p>
        <h1>Mời mọi người<br />tiếp tục màn chơi</h1>
        <p className="end-copy">Thông tin cần thiết đã được hé lộ. Hãy tiếp tục suy luận và tìm ra bí mật ẩn sau màn sương.</p>
        <button className="primary-button close-button" onClick={resetGame}><X size={16} /> Đóng</button>
      </section>}


      {screen === 'empty' && <section className="end-screen">
        <p className="eyebrow">Hồ sơ đã được kiểm tra</p>
        <h1>Không còn lá bài<br />để lựa chọn</h1>
        <p className="end-copy">Cả sáu nhân vật đã được kiểm tra trong lượt này. Hãy bắt đầu lại một lượt điều tra mới.</p>
        <button className="primary-button close-button" onClick={resetGame}><RotateCcw size={16} /> Bắt đầu lại</button>
      </section>}

    </main>
  );
}


createRoot(document.getElementById('root')).render(<App />);
