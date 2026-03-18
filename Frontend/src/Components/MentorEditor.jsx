import { useEffect, useRef, useCallback } from 'react';
import './MentorEditor.css';

const TOOLS = [
  { cmd: 'bold',          icon: 'B',       title: 'Bold',          style: { fontWeight: 'bold' } },
  { cmd: 'italic',        icon: 'I',       title: 'Italic',        style: { fontStyle: 'italic' } },
  { cmd: 'underline',     icon: 'U',       title: 'Underline',     style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', icon: 'S',       title: 'Strikethrough', style: { textDecoration: 'line-through' } },
  { sep: true },
  { cmd: 'formatBlock',   val: 'h1',       icon: 'H1',  title: 'Heading 1' },
  { cmd: 'formatBlock',   val: 'h2',       icon: 'H2',  title: 'Heading 2' },
  { cmd: 'formatBlock',   val: 'h3',       icon: 'H3',  title: 'Heading 3' },
  { cmd: 'formatBlock',   val: 'p',        icon: 'P',   title: 'Paragraph' },
  { sep: true },
  { cmd: 'insertUnorderedList', icon: '≡', title: 'Bullet List' },
  { cmd: 'insertOrderedList',   icon: '1.', title: 'Numbered List' },
  { sep: true },
  { cmd: 'justifyLeft',   icon: '⬅',  title: 'Align Left' },
  { cmd: 'justifyCenter', icon: '↔',  title: 'Align Center' },
  { cmd: 'justifyRight',  icon: '➡',  title: 'Align Right' },
  { sep: true },
  { cmd: 'createLink',    icon: '🔗', title: 'Insert Link',  special: 'link' },
  { cmd: 'unlink',        icon: '✂',  title: 'Remove Link' },
  { sep: true },
  { cmd: 'insertImage',   icon: '🖼',  title: 'Insert Image', special: 'image' },
  { sep: true },
  { cmd: 'undo',          icon: '↩',  title: 'Undo' },
  { cmd: 'redo',          icon: '↪',  title: 'Redo' },
];

export default function MentorEditor({ value, onChange, placeholder = 'Start writing...' }) {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);

  // Sync external value → editor (only when value changes from outside)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isInternalChange.current) { isInternalChange.current = false; return; }
    if (el.innerHTML !== (value || '')) {
      el.innerHTML = value || '';
    }
  }, [value]);

  const exec = useCallback((cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    // Notify parent
    isInternalChange.current = true;
    onChange?.(editorRef.current.innerHTML);
  }, [onChange]);

  const handleTool = (tool) => {
    if (tool.special === 'link') {
      const url = prompt('Enter URL:', 'https://');
      if (url) exec('createLink', url);
    } else if (tool.special === 'image') {
      const url = prompt('Enter image URL:', 'https://');
      if (url) exec('insertImage', url);
    } else if (tool.val) {
      exec(tool.cmd, tool.val);
    } else {
      exec(tool.cmd);
    }
  };

  const handleInput = () => {
    isInternalChange.current = true;
    onChange?.(editorRef.current.innerHTML);
  };

  const handleFontSize = (e) => {
    exec('fontSize', e.target.value);
  };

  const handleColor = (e) => {
    exec('foreColor', e.target.value);
  };

  return (
    <div className="me-wrap">
      <div className="me-toolbar">
        {TOOLS.map((t, i) =>
          t.sep
            ? <span key={i} className="me-sep" />
            : (
              <button
                key={i}
                type="button"
                title={t.title}
                className="me-btn"
                style={t.style}
                onMouseDown={e => { e.preventDefault(); handleTool(t); }}
              >
                {t.icon}
              </button>
            )
        )}
        <span className="me-sep" />
        <select className="me-select" title="Font Size" onChange={handleFontSize} defaultValue="">
          <option value="" disabled>Size</option>
          {[1,2,3,4,5,6,7].map(s => <option key={s} value={s}>{['8','10','12','14','18','24','36'][s-1]}px</option>)}
        </select>
        <input type="color" className="me-color" title="Text Color" onChange={handleColor} defaultValue="#1f2937" />
      </div>
      <div
        ref={editorRef}
        className="me-body"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  );
}
