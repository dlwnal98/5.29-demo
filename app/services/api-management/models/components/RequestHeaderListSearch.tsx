'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { requestHeaderList } from '@/lib/data';
import { ChevronDown } from 'lucide-react';
interface Option {
  id: string;
  label: string;
  value: string;
}
interface HeaderSearchProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  updateHeader: (field: 'name' | 'required' | 'value', value: string | boolean) => void;
  existingSearch: string;
}

export default function RequestHeaderListSearch({
  isOpen,
  setIsOpen,
  updateHeader,
  existingSearch,
}: HeaderSearchProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(
    () =>
      requestHeaderList.filter((opt) => opt?.value?.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlightedIndex]) {
        selectOption(filtered[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectOption = (option: Option) => {
    setSelected(option);
    setSearch(option.value);
    setIsOpen(false);
    updateHeader('name', option.value); // id 필요 없음
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (existingSearch) setSearch(existingSearch);
  }, [existingSearch]);

  // 클릭 외부 영역 감지해서 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-100 relative">
      <label htmlFor="autocomplete-input" className="sr-only">
        Select header type
      </label>
      <div className="relative">
        <input
          id="autocomplete-input"
          ref={inputRef}
          type="text"
          className="text-[14px] border px-3 py-2 pr-[35px] rounded-md cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type to search..."
          aria-autocomplete="list"
          aria-controls="autocomplete-list"
          aria-expanded={isOpen}
          aria-activedescendant={
            isOpen && filtered[highlightedIndex]
              ? `option-${filtered[highlightedIndex].id}`
              : undefined
          }
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <ChevronDown className="absolute right-[12px] top-[20%]" stroke="gray" width={'16px'} />
      </div>

      {isOpen && (
        <ul
          id="autocomplete-list"
          ref={listRef}
          role="listbox"
          //   className="relative !z-999 w-full p-1 bg-white border rounded-md shadow max-h-48 overflow-auto mt-1">
          className={`relative z-50 w-full p-1 bg-white border rounded-md shadow max-h-48 overflow-auto mt-1 transform origin-top transition-all duration-200 ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
          {filtered.length > 0 ? (
            filtered.map((opt, idx) => (
              <li
                id={`option-${opt.id}`}
                key={opt.id}
                role="option"
                aria-selected={selected?.id === opt.id}
                className={`text-[14px] px-3 py-2 rounded-md cursor-pointer ${
                  idx === highlightedIndex ? 'bg-blue-50' : ''
                }`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onMouseDown={() => selectOption(opt)}>
                {opt.value}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-400">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}
