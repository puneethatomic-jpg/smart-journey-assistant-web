'use client';

import React, { useState, useEffect } from 'react';
import JourneyHistoryList from '@/components/journey/JourneyHistoryList';
import { getJourneyHistory, clearJourneyHistory } from '@/lib/storage/localStorage';
import { Journey } from '@/types';

export default function HistoryPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);

  useEffect(() => {
    setJourneys(getJourneyHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your entire journey history?')) {
      clearJourneyHistory();
      setJourneys([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <JourneyHistoryList journeys={journeys} onClearHistory={handleClear} />
    </div>
  );
}
