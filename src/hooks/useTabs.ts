import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useTabs = (allTabs: any[], initialTab?: string) => {
  const [activeTab, setActiveTab] = useState(initialTab || allTabs[0]?.key);
  const location = useLocation();

  useEffect(() => {
    const currentSearch = location.search;
    let currentTab = '';
    if (currentSearch.includes('filter')) {
      currentTab = currentSearch.replace(/^(.*?filter)=/, '');
    }
    if (!currentSearch.includes('text')) {
      currentTab = currentSearch.slice(currentSearch.indexOf('=') + 1);
    }
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.search, activeTab, setActiveTab]);

  return { activeTab, setActiveTab };
};
export default useTabs;
