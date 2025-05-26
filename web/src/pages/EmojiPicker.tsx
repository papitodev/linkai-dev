import React, { useState, useMemo } from 'react';
import { EMOJI_LIST } from './emojiList';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose?: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const [showLegend, setShowLegend] = useState(false);
  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return EMOJI_LIST;
    const term = search.trim().toLowerCase();
    return EMOJI_LIST.filter(e =>
      e.emoji.toLowerCase().includes(term) ||
      e.name.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <div className="bg-white border rounded-xl shadow-lg p-3 max-w-xs relative">
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por nome ou emoji..."
        className="w-full mb-2 px-2 py-1 border rounded text-sm"
        autoFocus
      />
      {/* <button
        type="button"
        className="text-xs text-purple-600 underline mb-2"
        onClick={() => {
          if (onClose) onClose();
          setShowLegend(true);
        }}
      >
        papito
      </button> */}
      <div className="grid grid-cols-8 gap-2 max-h-56 overflow-y-auto">
        {filteredEmojis.map(({ emoji, name }) => (
          <button
            key={emoji + name}
            type="button"
            className="text-2xl hover:bg-purple-100 rounded transition"
            title={name}
            onClick={() => {
              onSelect(emoji);
              if (onClose) onClose();
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
      {onClose && (
        <button
          type="button"
          className="w-full text-xs text-gray-500 mt-2 underline"
          onClick={onClose}
        >
          Fechar
        </button>
      )}
      {/* Modal de legenda de emojis */}
      {showLegend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[700px] w-full max-w-2xl relative animate-fade-in">
            <h2 className="text-lg font-bold mb-4">Tabela de Emojis</h2>
            <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {EMOJI_LIST.map(({ emoji, name }) => (
                <div key={emoji + name} className="flex flex-col items-center text-center">
                  <span className="text-2xl mb-1">{emoji}</span>
                  <span className="text-xs text-gray-600 break-words">{name}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-purple-600 text-sm font-bold px-2 py-1"
              onClick={() => setShowLegend(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker; 